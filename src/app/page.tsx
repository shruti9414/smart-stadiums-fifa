'use client'

import { Universe3D } from '@/components/Universe3D'
import { LandingHero } from '@/components/LandingHero'

export default function Home() {
  return (
    <main className="relative w-full min-h-screen bg-black text-white overflow-hidden">
      {/* 3D Universe Background */}
      <Universe3D />

      {/* Hero Content */}
      <LandingHero />
    </main>
  )
}
