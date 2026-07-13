import { PrismaClient, Prisma } from '@prisma/client'
import bcryptjs from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting FIFA 2026 Stadium Database Seed...\n')

  try {
    // Step 1: Create Stadium
    console.log('📍 Creating Stadium...')
    const stadium = await prisma.stadium.upsert({
      where: { id: 'lusail-2026' },
      update: {},
      create: {
        id: 'lusail-2026',
        name: 'Lusail Stadium',
        city: 'Doha',
        country: 'Qatar',
        capacity: 80000,
        latitude: new Prisma.Decimal('25.3548'),
        longitude: new Prisma.Decimal('51.5507'),
        timezone: 'Asia/Qatar',
        mapUrl: 'https://maps.google.com/maps?q=Lusail+Stadium',
      },
    })
    console.log('✓ Stadium created:', stadium.name)

    // Step 2: Create Seating Sections
    console.log('\n🪑 Creating Seating Sections...')
    const wheelchairSections = []
    for (let i = 1; i <= 4; i++) {
      const section = await prisma.seatingSection.upsert({
        where: { id: `wheelchair-a${i}` },
        update: {},
        create: {
          id: `wheelchair-a${i}`,
          stadiumId: stadium.id,
          sectionName: `Wheelchair Accessible Section A${i}`,
          capacity: 500,
          accessibility: 100,
        },
      })
      wheelchairSections.push(section)
    }

    const generalSections = []
    for (let i = 1; i <= 8; i++) {
      const section = await prisma.seatingSection.upsert({
        where: { id: `general-b${i}` },
        update: {},
        create: {
          id: `general-b${i}`,
          stadiumId: stadium.id,
          sectionName: `General Seating Section B${i}`,
          capacity: 10000,
          accessibility: 50,
        },
      })
      generalSections.push(section)
    }
    console.log(`✓ Created ${wheelchairSections.length + generalSections.length} seating sections`)

    // Step 3: Create Amenities
    console.log('\n🍽️ Creating Amenities...')
    const amenityData = [
      { type: 'restroom', name: 'Restroom - Level 1, Section B', capacity: 50, queueLength: 5 },
      { type: 'restroom', name: 'Restroom - Level 2, Section D', capacity: 50, queueLength: 8 },
      { type: 'restroom', name: 'Restroom - Level 3, Section F (Accessible)', capacity: 30, queueLength: 0 },
      { type: 'food', name: 'Food Hall A - Main Concourse', capacity: 500, queueLength: 45 },
      { type: 'food', name: 'Quick Bite #1 - Section B', capacity: 100, queueLength: 12 },
      { type: 'food', name: 'Quick Bite #2 - Section D', capacity: 100, queueLength: 8 },
      { type: 'food', name: 'Quick Bite #3 - Section F', capacity: 100, queueLength: 3 },
      { type: 'food', name: 'Cafe - VIP Lounge', capacity: 50, queueLength: 0 },
      { type: 'medical', name: 'Medical Center - East Wing', capacity: 100, queueLength: 2 },
      { type: 'medical', name: 'First Aid Post - Section A', capacity: 30, queueLength: 1 },
      { type: 'medical', name: 'First Aid Post - Section B', capacity: 30, queueLength: 0 },
      { type: 'medical', name: 'Defibrillator Station - North', capacity: 1, queueLength: 0 },
      { type: 'parking', name: 'Parking Level 1 (Accessible)', capacity: 245, queueLength: 89 },
      { type: 'parking', name: 'EV Charging Station - Level 2', capacity: 50, queueLength: 5 },
      { type: 'elevator', name: 'Elevator - North Corner', capacity: 20, queueLength: 2 },
      { type: 'elevator', name: 'Elevator - South Corner', capacity: 20, queueLength: 3 },
      { type: 'elevator', name: 'Elevator - East Corner', capacity: 20, queueLength: 1 },
      { type: 'elevator', name: 'Elevator - West Corner', capacity: 20, queueLength: 0 },
    ]

    for (const amenity of amenityData) {
      await prisma.amenity.upsert({
        where: { id: amenity.name.replace(/[^a-z0-9]/gi, '-').toLowerCase() },
        update: { queueLength: amenity.queueLength },
        create: {
          id: amenity.name.replace(/[^a-z0-9]/gi, '-').toLowerCase(),
          stadiumId: stadium.id,
          type: amenity.type,
          name: amenity.name,
          capacity: amenity.capacity,
          queueLength: amenity.queueLength,
        },
      })
    }
    console.log(`✓ Created ${amenityData.length} amenities`)

    // Step 4: Create Navigation POIs
    console.log('\n🗺️ Creating Navigation POIs...')
    const poisData = [
      { poiType: 'entrance', name: 'Main Gate', accessibility: 'fully-accessible' },
      { poiType: 'entrance', name: 'Secondary Gate', accessibility: 'fully-accessible' },
      { poiType: 'entrance', name: 'VIP Entrance', accessibility: 'fully-accessible' },
      { poiType: 'exit', name: 'Emergency Exit North', accessibility: 'emergency' },
      { poiType: 'exit', name: 'Emergency Exit South', accessibility: 'emergency' },
      { poiType: 'exit', name: 'Emergency Exit East', accessibility: 'emergency' },
      { poiType: 'medical', name: 'Medical Center', accessibility: 'fully-accessible' },
      { poiType: 'food', name: 'Main Food Court', accessibility: 'fully-accessible' },
      { poiType: 'parking', name: 'Parking Area A', accessibility: 'accessible-spaces' },
      { poiType: 'transit', name: 'Bus Station', accessibility: 'fully-accessible' },
      { poiType: 'transit', name: 'Metro Entry Point', accessibility: 'fully-accessible' },
      { poiType: 'accessibility', name: 'Accessible Seating Hub', accessibility: 'fully-accessible' },
      { poiType: 'information', name: 'Information Desk', accessibility: 'fully-accessible' },
      { poiType: 'lost_found', name: 'Lost & Found - Main Hall', accessibility: 'fully-accessible' },
    ]

    for (const poi of poisData) {
      await prisma.navigationPOI.upsert({
        where: { id: poi.name.replace(/[^a-z0-9]/gi, '-').toLowerCase() },
        update: {},
        create: {
          id: poi.name.replace(/[^a-z0-9]/gi, '-').toLowerCase(),
          stadiumId: stadium.id,
          poiType: poi.poiType,
          name: poi.name,
          accessibility: poi.accessibility,
          coordinates: {
            lat: 25.3548 + (Math.random() - 0.5) * 0.005,
            lng: 51.5507 + (Math.random() - 0.5) * 0.005,
          },
        },
      })
    }
    console.log(`✓ Created ${poisData.length} navigation POIs`)

    // Step 5: Create Exits
    console.log('\n🚪 Creating Emergency Exits...')
    const exitsData = [
      { name: 'Emergency Exit North', emergency: true },
      { name: 'Emergency Exit South', emergency: true },
      { name: 'Emergency Exit East', emergency: true },
      { name: 'Emergency Exit West', emergency: true },
      { name: 'Primary Exit - Main Gate', emergency: false },
      { name: 'Secondary Exit - East Gate', emergency: false },
    ]

    for (const exit of exitsData) {
      await prisma.exit.upsert({
        where: { id: exit.name.replace(/[^a-z0-9]/gi, '-').toLowerCase() },
        update: {},
        create: {
          id: exit.name.replace(/[^a-z0-9]/gi, '-').toLowerCase(),
          stadiumId: stadium.id,
          name: exit.name,
          emergency: exit.emergency,
          coordinates: {
            lat: 25.3548 + (Math.random() - 0.5) * 0.01,
            lng: 51.5507 + (Math.random() - 0.5) * 0.01,
          },
        },
      })
    }
    console.log(`✓ Created ${exitsData.length} exits`)

    // Step 6: Create Sample Matches (FIFA 2026 Finals)
    console.log('\n⚽ Creating FIFA 2026 Matches...')
    const matchesData = [
      {
        teamA: 'Argentina',
        teamB: 'France',
        matchDate: new Date('2026-06-21T18:00:00Z'),
        status: 'scheduled',
      },
      {
        teamA: 'Brazil',
        teamB: 'Germany',
        matchDate: new Date('2026-06-22T18:00:00Z'),
        status: 'scheduled',
      },
      {
        teamA: 'Spain',
        teamB: 'Italy',
        matchDate: new Date('2026-06-23T20:00:00Z'),
        status: 'scheduled',
      },
      {
        teamA: 'Netherlands',
        teamB: 'Belgium',
        matchDate: new Date('2026-06-24T16:00:00Z'),
        status: 'scheduled',
      },
      {
        teamA: 'Portugal',
        teamB: 'England',
        matchDate: new Date('2026-06-25T18:00:00Z'),
        status: 'scheduled',
      },
    ]

    for (const match of matchesData) {
      await prisma.match.upsert({
        where: { id: `match-${match.teamA}-${match.teamB}` },
        update: {},
        create: {
          id: `match-${match.teamA}-${match.teamB}`,
          stadiumId: stadium.id,
          teamA: match.teamA,
          teamB: match.teamB,
          matchDate: match.matchDate,
          status: match.status,
        },
      })
    }
    console.log(`✓ Created ${matchesData.length} FIFA matches`)

    // Step 7: Create Sample Users
    console.log('\n👤 Creating Sample Users...')
    const adminPasswordHash = await bcryptjs.hash('Admin@12345', 12)
    const staffPasswordHash = await bcryptjs.hash('Staff@12345', 12)
    const visitorPasswordHash = await bcryptjs.hash('Visitor@12345', 12)

    const admin = await prisma.user.upsert({
      where: { email: 'admin@stadium.com' },
      update: {},
      create: {
        email: 'admin@stadium.com',
        passwordHash: adminPasswordHash,
        fullName: 'Stadium Operations Admin',
        role: 'admin',
        department: 'operations',
        language: 'en',
      },
    })

    const staff = await prisma.user.upsert({
      where: { email: 'staff@stadium.com' },
      update: {},
      create: {
        email: 'staff@stadium.com',
        passwordHash: staffPasswordHash,
        fullName: 'Security Team Lead',
        role: 'staff',
        department: 'security',
        language: 'en',
      },
    })

    const visitor = await prisma.user.upsert({
      where: { email: 'visitor@stadium.com' },
      update: {},
      create: {
        email: 'visitor@stadium.com',
        passwordHash: visitorPasswordHash,
        fullName: 'FIFA Fan',
        role: 'visitor',
        language: 'en',
      },
    })

    console.log('✓ Created 3 users: admin, staff, visitor')

    // Step 8: Create Sample Incidents
    console.log('\n🚨 Creating Sample Incidents...')
    const incidentsData = [
      { type: 'medical', severity: 'low', description: 'Minor injury - visitor twisted ankle', status: 'resolved' },
      {
        type: 'security',
        severity: 'medium',
        description: 'Unauthorized access attempt at North Gate',
        status: 'responding',
      },
      {
        type: 'accessibility',
        severity: 'low',
        description: 'Elevator outage in West Corner',
        status: 'reported',
      },
      { type: 'crowd', severity: 'medium', description: 'High occupancy in food zone', status: 'monitoring' },
      { type: 'lost_item', severity: 'low', description: 'Lost child reunited with parents', status: 'resolved' },
    ]

    for (const incident of incidentsData) {
      await prisma.incident.upsert({
        where: { id: `incident-${Date.now()}-${Math.random()}` },
        update: {},
        create: {
          id: `incident-${Date.now()}-${Math.random()}`,
          stadiumId: stadium.id,
          type: incident.type,
          severity: incident.severity,
          description: incident.description,
          location: 'Lusail Stadium',
          status: incident.status,
        },
      })
    }
    console.log(`✓ Created ${incidentsData.length} sample incidents`)

    // Step 9: Create Crowd Analytics History
    console.log('\n📊 Creating Crowd Analytics History...')
    for (let i = 0; i < 24; i++) {
      await prisma.crowdAnalytics.create({
        data: {
          id: `analytics-${Date.now()}-${i}`,
          stadiumId: stadium.id,
          occupancyPct: new Prisma.Decimal((Math.random() * 75 + 20).toFixed(2)),
          zoneData: {
            A1: Math.floor(Math.random() * 100),
            A2: Math.floor(Math.random() * 100),
            B1: Math.floor(Math.random() * 100),
            B2: Math.floor(Math.random() * 100),
            C1: Math.floor(Math.random() * 100),
            C2: Math.floor(Math.random() * 100),
          },
          timestamp: new Date(Date.now() - i * 60 * 60 * 1000),
        },
      })
    }
    console.log('✓ Created 24-hour crowd analytics history')

    // Step 10: Create Predictions
    console.log('\n🔮 Creating Crowd Predictions...')
    await prisma.crowdPrediction.create({
      data: {
        id: `prediction-30min`,
        stadiumId: stadium.id,
        occupancyPct: new Prisma.Decimal('65.50'),
        confidence: new Prisma.Decimal('0.92'),
        predictionTime: new Date(Date.now() + 30 * 60 * 1000),
        riskAlerts: {
          level: 'moderate',
          alerts: ['moderate_crowd_in_food_zone', 'busy_restroom_area'],
        },
      },
    })

    await prisma.crowdPrediction.create({
      data: {
        id: `prediction-2hr`,
        stadiumId: stadium.id,
        occupancyPct: new Prisma.Decimal('78.30'),
        confidence: new Prisma.Decimal('0.88'),
        predictionTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        riskAlerts: {
          level: 'high',
          alerts: ['high_occupancy_east_section', 'peak_food_service_time'],
        },
      },
    })

    console.log('✓ Created crowd predictions')

    console.log('\n' + '='.repeat(60))
    console.log('✅ DATABASE SEEDING COMPLETE!')
    console.log('='.repeat(60))
    console.log('\n📋 Test Accounts:')
    console.log('  👨‍💼 Admin: admin@stadium.com / Admin@12345')
    console.log('  👮 Staff: staff@stadium.com / Staff@12345')
    console.log('  👤 Visitor: visitor@stadium.com / Visitor@12345')
    console.log('\n📍 Stadium: Lusail Stadium, Doha, Qatar (80,000 capacity)')
    console.log('\n🎯 Ready for development and testing!')
  } catch (error) {
    console.error('\n❌ Seeding error:', error)
    throw error
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
    console.log('\n✓ Database connection closed')
  })
  .catch(async (e) => {
    console.error('\n❌ Fatal error:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
