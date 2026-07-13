import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

interface NotificationPayload {
  title: string
  body: string
  type: 'incident' | 'crowd' | 'emergency' | 'info'
  data?: Record<string, string>
  recipients?: string[] // user IDs
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const body = await req.json() as NotificationPayload
    const { title, body: notificationBody, type, data, recipients } = body

    if (!title || !notificationBody) {
      return new Response(JSON.stringify({ success: false, error: 'Title and body required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Store notification in database
    const notification = await prisma.notification.create({
      data: {
        title,
        body: notificationBody,
        type,
        data: data ? JSON.stringify(data) : null,
        sentBy: payload.userId,
        sentAt: new Date(),
      },
    })

    // If recipients specified, send to those users
    // Otherwise broadcast to all logged-in users
    if (recipients && recipients.length > 0) {
      // Create notification records for specific users
      for (const userId of recipients) {
        await prisma.userNotification.create({
          data: {
            notificationId: notification.id,
            userId,
            read: false,
          },
        })
      }
    } else {
      // Broadcast to all users (for critical incidents)
      const allUsers = await prisma.user.findMany({
        select: { id: true },
      })
      for (const user of allUsers) {
        await prisma.userNotification.create({
          data: {
            notificationId: notification.id,
            userId: user.id,
            read: false,
          },
        })
      }
    }

    console.log(`✓ Notification sent: ${notification.id}`)

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          notificationId: notification.id,
          title,
          body: notificationBody,
          type,
          recipientCount: recipients?.length || 'all users',
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (err) {
    console.error('Notification error:', err)
    return new Response(JSON.stringify({ success: false, error: 'Failed to send notification' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Get unread notifications for user
    const notifications = await prisma.userNotification.findMany({
      where: {
        userId: payload.userId,
        read: false,
      },
      include: {
        notification: true,
      },
      orderBy: {
        notification: { sentAt: 'desc' },
      },
      take: 20,
    })

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          count: notifications.length,
          notifications: notifications.map((un) => ({
            id: un.notification.id,
            title: un.notification.title,
            body: un.notification.body,
            type: un.notification.type,
            data: un.notification.data ? JSON.parse(un.notification.data) : null,
            sentAt: un.notification.sentAt,
            read: un.read,
          })),
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (err) {
    console.error('Error fetching notifications:', err)
    return new Response(JSON.stringify({ success: false, error: 'Failed to fetch notifications' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
