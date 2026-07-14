import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

async function verifyAuth(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) {
    return null
  }
  const payload = await verifyToken(token)
  return payload
}

export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAuth(req)
    if (!auth) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Get all staff grouped by department
    const staff = await prisma.user.findMany({
      where: { role: 'staff' },
      select: {
        id: true,
        email: true,
        fullName: true,
        department: true,
      },
      orderBy: { department: 'asc' },
    })

    // Group staff by department
    const departments = ['medical', 'security', 'fire', 'general']
    const teams = departments.map((dept: string) => {
      const deptStaff = staff.filter((s: any) => s.department === dept)

      // Get department icon and name
      const deptConfig = {
        medical: { icon: '🏥', name: 'Medical Team', color: 'medical' },
        security: { icon: '🛡️', name: 'Security Team', color: 'security' },
        fire: { icon: '🚒', name: 'Fire Rescue Team', color: 'fire' },
        general: { icon: '👤', name: 'General Team', color: 'general' },
      }

      const config = deptConfig[dept as keyof typeof deptConfig]

      return {
        id: `team_${dept}`,
        name: config.name,
        type: dept,
        icon: config.icon,
        members: deptStaff.length,
        location: dept === 'medical' ? 'Medical Bay' : dept === 'security' ? 'Security Post' : dept === 'fire' ? 'Fire Station' : 'General Area',
        eta: dept === 'medical' ? '2 min' : dept === 'security' ? '3 min' : dept === 'fire' ? '2 min' : '5 min',
        status: 'available',
        staff: deptStaff, // List of staff in this team
      }
    })

    // Filter out empty teams
    const activeTeams = teams.filter((t: any) => t.members > 0)

    console.log('✓ Teams fetched from database:', activeTeams.length)

    return new Response(
      JSON.stringify({
        success: true,
        data: activeTeams,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (err) {
    console.error('Teams error:', err)
    return new Response(JSON.stringify({ success: false, error: 'Failed to fetch teams' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
