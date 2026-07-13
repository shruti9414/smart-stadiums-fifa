import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import * as admin from 'firebase-admin'

// Initialize Firebase Admin SDK
let firebaseInitialized = false
const adminSDK = admin as any
if (!firebaseInitialized && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  try {
    if (!adminSDK.apps?.length) {
      adminSDK.initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        credential: adminSDK.credential.cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
        }),
      })
    }
    firebaseInitialized = true
  } catch (e) {
    console.warn('Firebase not configured:', (e as any).message)
  }
}

interface NotificationPayload {
  title: string
  body: string
  type: 'incident' | 'crowd' | 'emergency' | 'info' | 'incident_alert' | 'queue_alert' | 'system'
  data?: Record<string, string>
  recipients?: string[] // user IDs
  severity?: 'low' | 'medium' | 'high' | 'critical'
}

// Send Firebase push notification
async function sendFirebasePush(userId: string, title: string, body: string, data: Record<string, string> = {}) {
  if (!firebaseInitialized || !adminSDK.apps?.length) {
    console.warn('Firebase not available, skipping push notification')
    return null
  }

  try {
    // Get user's push tokens
    const tokens = await prisma.pushNotificationToken.findMany({
      where: { userId },
    })

    if (tokens.length === 0) {
      console.log(`No push tokens for user ${userId}`)
      return null
    }

    const message = {
      notification: { title, body },
      data: {
        timestamp: new Date().toISOString(),
        ...data,
      },
    }

    // Send to all tokens
    const results = await Promise.allSettled(
      tokens.map((t) =>
        adminSDK
          .messaging()
          .send({
            ...message,
            token: t.token,
          } as any)
      )
    )

    // Clean up failed tokens
    for (let i = 0; i < results.length; i++) {
      if (results[i].status === 'rejected') {
        await prisma.pushNotificationToken.delete({
          where: { id: tokens[i].id },
        })
      }
    }

    const successCount = results.filter((r) => r.status === 'fulfilled').length
    console.log(`✓ Push notifications sent: ${successCount}/${tokens.length} to user ${userId}`)
    return successCount
  } catch (error) {
    console.error('Firebase push error:', error)
    return null
  }
}

// POST: Send notification
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

    const body = (await req.json()) as NotificationPayload
    const { title, body: notificationBody, type, data, recipients, severity } = body

    if (!title || !notificationBody) {
      return new Response(JSON.stringify({ success: false, error: 'Title and body required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const recipientList = recipients || []
    let pushSent = 0

    // Send push notifications immediately for critical alerts
    if (severity === 'critical' || type === 'emergency' || type === 'incident_alert') {
      for (const userId of recipientList) {
        const sent = await sendFirebasePush(userId, title, notificationBody, data)
        if (sent) pushSent += sent
      }
    }

    // Store notification in database for each recipient
    const createdNotifications = []
    if (recipientList.length > 0) {
      for (const userId of recipientList) {
        // Create Notification first
        const notification = await prisma.notification.create({
          data: {
            title,
            body: notificationBody,
            type: type || 'info',
            data: JSON.stringify(data || {}),
            sentBy: userId,
          },
        })

        // Then link to user
        const userNotif = await prisma.userNotification.create({
          data: {
            userId,
            notificationId: notification.id,
          },
        })
        createdNotifications.push(userNotif)
      }
    } else {
      // Broadcast to all users (critical incident)
      const allUsers = await prisma.user.findMany({
        select: { id: true },
      })

      // Send push to all
      for (const user of allUsers) {
        await sendFirebasePush(user.id, title, notificationBody, data)
      }

      // Store in DB
      for (const user of allUsers) {
        // Create Notification first
        const notification = await prisma.notification.create({
          data: {
            title,
            body: notificationBody,
            type: type || 'info',
            data: JSON.stringify(data || {}),
            sentBy: user.id,
          },
        })

        // Then link to user
        const notif = await prisma.userNotification.create({
          data: {
            userId: user.id,
            notificationId: notification.id,
          },
        })
        createdNotifications.push(notif)
      }
    }

    console.log(`✓ Notifications created: ${createdNotifications.length}, Push sent: ${pushSent}`)

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          count: createdNotifications.length,
          pushSent,
          title,
          type,
          severity,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err: any) {
    console.error('Notification error:', err.message)
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

// GET: Fetch notifications for current user
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

    // Get recent notifications
    const notifications = await prisma.userNotification.findMany({
      where: { userId: (payload as any).userId || '' },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    const unreadCount = notifications.filter((n) => !n.read).length

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          count: notifications.length,
          unreadCount,
          notifications,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err: any) {
    console.error('Get notifications error:', err.message)
    return new Response(JSON.stringify({ success: false, error: 'Failed to fetch notifications' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

// PATCH: Mark notification as read
export async function PATCH(req: NextRequest) {
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

    const body = await req.json()
    const { notificationId, read } = body

    if (!notificationId) {
      return new Response(JSON.stringify({ success: false, error: 'notificationId required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const notification = await prisma.userNotification.update({
      where: { id: notificationId },
      data: { read: read || true },
    })

    return new Response(
      JSON.stringify({ success: true, data: notification }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err: any) {
    console.error('Patch notification error:', err.message)
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
