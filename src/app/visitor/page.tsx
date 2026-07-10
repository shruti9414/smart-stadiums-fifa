'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface Event {
  id: string
  name: string
  date: string
  time: string
  status: 'upcoming' | 'live' | 'completed'
  occupancy: number
}

export default function VisitorPage() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  const events: Event[] = [
    {
      id: '1',
      name: 'FIFA 2026 World Cup - Semi-Final',
      date: 'July 14, 2026',
      time: '8:00 PM',
      status: 'upcoming',
      occupancy: 0,
    },
    {
      id: '2',
      name: 'FIFA 2026 World Cup - Quarter-Final',
      date: 'July 9, 2026',
      time: '6:00 PM',
      status: 'live',
      occupancy: 78,
    },
    {
      id: '3',
      name: 'FIFA 2026 World Cup - Group Stage',
      date: 'July 4, 2026',
      time: '3:00 PM',
      status: 'completed',
      occupancy: 85,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900/50 to-black">
      {/* Hero Section */}
      <motion.section
        className="relative overflow-hidden px-8 py-16 md:py-24 border-b border-slate-800/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Animated background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-black mb-6 gradient-text">
              🏟️ FIFA 2026 Stadium
            </h1>
            <p className="text-xl text-slate-300 mb-4 max-w-2xl">
              Welcome to the world's most advanced football stadium. Experience world-class facilities, real-time navigation, and premium hospitality.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                href="/login"
                className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl"
              >
                🎫 Get Tickets
              </Link>
              <Link
                href="/dashboard/navigate"
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-all border border-slate-700 hover:border-slate-600"
              >
                🗺️ Stadium Navigation
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Content */}
      <main className="px-8 py-16 max-w-7xl mx-auto">
        {/* Quick Stats */}
        <motion.div
          className="grid md:grid-cols-4 gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <InfoCard icon="👥" label="Capacity" value="80,000" />
          <InfoCard icon="📍" label="Location" value="Downtown" />
          <InfoCard icon="🏥" label="Medical Centers" value="3" />
          <InfoCard icon="🍽️" label="Food Outlets" value="24" />
        </motion.div>

        {/* Events Section */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-white mb-8">📅 Upcoming Events</h2>
          <div className="space-y-4">
            {events.map((event, idx) => (
              <motion.div
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className={`rounded-xl border p-6 cursor-pointer transition-all backdrop-blur-sm ${
                  selectedEvent?.id === event.id
                    ? 'border-cyan-400/50 bg-gradient-to-r from-cyan-500/20 to-blue-500/20'
                    : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600/50'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">⚽</span>
                      <div>
                        <h3 className="font-bold text-white text-lg">{event.name}</h3>
                        <p className="text-slate-400 text-sm">
                          📅 {event.date} at {event.time}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                      event.status === 'live'
                        ? 'bg-red-500/20 text-red-300 animate-pulse'
                        : event.status === 'upcoming'
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-slate-700/50 text-slate-400'
                    }`}>
                      {event.status === 'live' && '🔴 LIVE'}
                      {event.status === 'upcoming' && '🕒 UPCOMING'}
                      {event.status === 'completed' && '✓ COMPLETED'}
                    </span>
                    {event.occupancy > 0 && (
                      <p className="text-slate-400 text-sm mt-2">{event.occupancy}% Full</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Facilities Grid */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-white mb-8">✨ Premium Facilities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FacilityCard
              icon="🍽️"
              name="World-Class Dining"
              description="Multiple cuisines, premium restaurants, fast food options"
              amenities={['Multiple cuisines', 'Vegan options', 'Halal options']}
            />
            <FacilityCard
              icon="🏥"
              name="Medical Services"
              description="24/7 medical staff, AED, emergency services"
              amenities={['24/7 Staff', 'Emergency Room', 'AED']}
            />
            <FacilityCard
              icon="🅿️"
              name="Parking & Transport"
              description="5,000+ parking spaces with EV charging"
              amenities={['EV Charging', 'Multi-level', 'Real-time Info']}
            />
            <FacilityCard
              icon="♿"
              name="Accessibility"
              description="Full accessibility throughout the stadium"
              amenities={['Wheelchair Access', 'Accessible Restrooms', 'Level Floors']}
            />
            <FacilityCard
              icon="🎙️"
              name="Entertainment"
              description="Premium screens, surround sound, interactive experiences"
              amenities={['4K Screens', 'Surround Sound', 'Interactive']}
            />
            <FacilityCard
              icon="🛟"
              name="Security & Safety"
              description="Advanced security systems and trained personnel"
              amenities={['24/7 Monitoring', 'Emergency Exits', 'Staff']}
            />
          </div>
        </motion.div>

        {/* Guidelines Section */}
        <motion.div
          className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900/60 to-slate-950/60 backdrop-blur-sm p-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">📋 Visitor Guidelines</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-cyan-300 mb-4">✓ Please Do</h3>
              <ul className="space-y-2 text-slate-300">
                <li>✓ Arrive at least 2 hours before event</li>
                <li>✓ Follow all safety instructions</li>
                <li>✓ Use official navigation app</li>
                <li>✓ Report concerns to staff</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-red-300 mb-4">✗ Please Avoid</h3>
              <ul className="space-y-2 text-slate-300">
                <li>✗ Hazardous items/weapons</li>
                <li>✗ Alcohol outside designated areas</li>
                <li>✗ Flash photography</li>
                <li>✗ Recording in restricted zones</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-white mb-4">📞 Need Help?</h2>
          <p className="text-slate-300 mb-6">
            Our support team is available 24/7 to assist you with any questions or concerns.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="tel:+1234567890"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all"
            >
              📞 Call Support
            </a>
            <a
              href="mailto:support@stadium.com"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-all border border-slate-700"
            >
              📧 Email Support
            </a>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 bg-black/50 backdrop-blur-xl px-8 py-8 mt-16">
        <div className="max-w-7xl mx-auto text-center text-slate-400 text-sm">
          <p>© 2026 FIFA Stadium. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </footer>
    </div>
  )
}

function InfoCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <motion.div
      className="rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-900/60 to-slate-950/60 backdrop-blur-sm p-6 text-center hover:border-slate-600/50 transition-all"
      whileHover={{ scale: 1.05 }}
    >
      <span className="text-3xl mb-2 block">{icon}</span>
      <p className="text-slate-400 text-sm mb-2">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </motion.div>
  )
}

function FacilityCard({
  icon,
  name,
  description,
  amenities,
}: {
  icon: string
  name: string
  description: string
  amenities: string[]
}) {
  return (
    <motion.div
      className="rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-900/60 to-slate-950/60 backdrop-blur-sm p-6 hover:border-slate-600/50 transition-all group"
      whileHover={{ y: -5, borderColor: 'rgba(59, 130, 246, 0.3)' }}
    >
      <span className="text-4xl mb-4 block group-hover:scale-110 transition-transform">{icon}</span>
      <h3 className="font-bold text-white mb-2 text-lg">{name}</h3>
      <p className="text-sm text-slate-400 mb-4">{description}</p>
      <ul className="space-y-1">
        {amenities.map((amenity) => (
          <li key={amenity} className="text-xs text-slate-400">
            ✓ {amenity}
          </li>
        ))}
      </ul>
    </motion.div>
  )
}
