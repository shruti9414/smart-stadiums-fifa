import { PrismaClient } from '@prisma/client'
import bcryptjs from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Hash passwords
  const adminPasswordHash = await bcryptjs.hash('Admin@12345', 12)
  const staffPasswordHash = await bcryptjs.hash('Staff@12345', 12)

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@stadium.com' },
    update: {},
    create: {
      email: 'admin@stadium.com',
      passwordHash: adminPasswordHash,
      fullName: 'Stadium Operations',
      role: 'admin',
    },
  })
  console.log('✓ Admin created:', admin.email)

  // Create staff users
  const staff1 = await prisma.user.upsert({
    where: { email: 'staff@stadium.com' },
    update: {},
    create: {
      email: 'staff@stadium.com',
      passwordHash: staffPasswordHash,
      fullName: 'Security Team Lead',
      role: 'staff',
    },
  })
  console.log('✓ Staff 1 created:', staff1.email)

  const staff2 = await prisma.user.upsert({
    where: { email: 'security2@stadium.com' },
    update: {},
    create: {
      email: 'security2@stadium.com',
      passwordHash: staffPasswordHash,
      fullName: 'Medical Team',
      role: 'staff',
    },
  })
  console.log('✓ Staff 2 created:', staff2.email)

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
