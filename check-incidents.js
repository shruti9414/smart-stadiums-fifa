const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  try {
    const count = await prisma.incident.count()
    console.log('Total incidents in database:', count)

    if (count > 0) {
      const incidents = await prisma.incident.findMany({ take: 5 })
      console.log('Sample incidents:')
      incidents.forEach(inc => {
        console.log(`- ${inc.id}: ${inc.type} (${inc.severity}) - ${inc.status}`)
      })
    } else {
      console.log('No incidents in database. Need to create some!')
    }
  } catch (err) {
    console.error('Error:', err.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()
