const { PrismaClient } = require('@prisma/client')
const bcryptjs = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create stadium first
  const stadium = await prisma.stadium.upsert({
    where: { id: 'default-stadium' },
    update: {},
    create: {
      id: 'default-stadium',
      name: 'FIFA 2026 Stadium',
      city: 'New York',
      country: 'USA',
      capacity: 80000,
      latitude: 40.7128,
      longitude: -74.0060,
      timezone: 'America/New_York',
    },
  })
  console.log('✓ Stadium created:', stadium.name)

  // Hash passwords
  const adminPasswordHash = await bcryptjs.hash('Admin@12345', 12)
  const staffPasswordHash = await bcryptjs.hash('Staff@12345', 12)
  const visitorPasswordHash = await bcryptjs.hash('Visitor@12345', 12)

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@stadium.com' },
    update: {},
    create: {
      email: 'admin@stadium.com',
      passwordHash: adminPasswordHash,
      fullName: 'Stadium Operations',
      role: 'admin',
      department: 'admin',
    },
  })
  console.log('✓ Admin created:', admin.email, '(admin)')

  // Create visitor user
  const visitor = await prisma.user.upsert({
    where: { email: 'visitor@stadium.com' },
    update: {},
    create: {
      email: 'visitor@stadium.com',
      passwordHash: visitorPasswordHash,
      fullName: 'Fan Visitor',
      role: 'visitor',
      department: 'general',
    },
  })
  console.log('✓ Visitor created:', visitor.email, '(visitor)')

  // Create staff users with departments
  const staff1 = await prisma.user.upsert({
    where: { email: 'staff@stadium.com' },
    update: { department: 'security' },
    create: {
      email: 'staff@stadium.com',
      passwordHash: staffPasswordHash,
      fullName: 'Security Team Lead',
      role: 'staff',
      department: 'security',
    },
  })
  console.log('✓ Staff 1 created:', staff1.email, '(security)')

  const staff2 = await prisma.user.upsert({
    where: { email: 'security2@stadium.com' },
    update: { department: 'medical' },
    create: {
      email: 'security2@stadium.com',
      passwordHash: staffPasswordHash,
      fullName: 'Medical Team',
      role: 'staff',
      department: 'medical',
    },
  })
  console.log('✓ Staff 2 created:', staff2.email, '(medical)')

  // Create sample incidents
  const incidents = await Promise.all([
    prisma.incident.create({
      data: {
        type: 'medical_emergency',
        severity: 'critical',
        location: 'Section A - Upper Stand',
        description: 'Visitor experiencing chest pain, requires immediate medical attention',
        status: 'reported',
        stadiumId: 'default-stadium',
      },
    }),
    prisma.incident.create({
      data: {
        type: 'security_breach',
        severity: 'high',
        location: 'North Gate',
        description: 'Unauthorized person attempting to enter restricted area',
        status: 'open',
        stadiumId: 'default-stadium',
      },
    }),
    prisma.incident.create({
      data: {
        type: 'crowd_control',
        severity: 'medium',
        location: 'Concourse Level 2',
        description: 'Crowd congestion near merchandise stand',
        status: 'open',
        stadiumId: 'default-stadium',
      },
    }),
    prisma.incident.create({
      data: {
        type: 'fire_alarm',
        severity: 'high',
        location: 'Kitchen Area - Level 1',
        description: 'Fire alarm triggered in kitchen, smoke detected',
        status: 'responding',
        stadiumId: 'default-stadium',
      },
    }),
  ])

  console.log('✓ Sample incidents created:', incidents.length)

  console.log('✅ Seeding complete!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seeding error:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
