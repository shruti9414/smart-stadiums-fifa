'use client'

// Sidebar disabled due to Vercel build issues - will fix later
// import { Sidebar } from '@/components/Sidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex">
      {/* <Sidebar /> */}
      <div className="flex-1">{children}</div>
    </div>
  )
}
