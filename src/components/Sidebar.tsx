'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { LanguageSelector } from './LanguageSelector'
import { useLanguage, type Language } from '@/hooks/useLanguage'
import { useAuth } from '@/hooks/useAuth'

// Public links for visitors
const PUBLIC_MENU_ITEMS = [
  { href: '/dashboard', key: 'dashboard', icon: '📊' },
  { href: '/dashboard/companion', key: 'companion', icon: '🤖' },
  { href: '/dashboard/incidents', key: 'incidents', icon: '🚨' },
  { href: '/dashboard/navigate', key: 'navigation', icon: '🗺️' },
  { href: '/dashboard/accessibility', key: 'accessibility', icon: '♿' },
  { href: '/dashboard/transport', key: 'transport', icon: '🚗' },
  { href: '/dashboard/sustainability', key: 'sustainability', icon: '🌱' },
]

// Admin-only links
const ADMIN_MENU_ITEMS = [
  { href: '/admin', key: 'admin-overview', icon: '🎯' },
  { href: '/admin/analytics', key: 'analytics', icon: '📈' },
  { href: '/admin/manage-teams', key: 'teams', icon: '👥' },
  { href: '/admin/manage-staff', key: 'staff-management', icon: '👨‍💼' },
  { href: '/admin/volunteer-management', key: 'volunteers', icon: '🤝' },
  { href: '/admin/staff-performance', key: 'staff', icon: '📋' },
  { href: '/admin/emergency-response', key: 'emergency', icon: '🆘' },
]

const translations: Record<Language, Record<string, string>> = {
  en: {
    dashboard: 'Dashboard',
    'admin-overview': 'Overview',
    companion: 'AI Companion',
    navigation: 'Navigation',
    analytics: 'Analytics',
    queue: 'Queue Status',
    accessibility: 'Accessibility',
    transport: 'Transport',
    sustainability: 'Green Stadium',
    incidents: 'Incidents',
    teams: 'Teams',
    'staff-management': 'Manage Staff',
    volunteers: 'Volunteers',
    staff: 'Staff Performance',
    emergency: 'Emergency',
    logout: 'Logout',
    language: 'Language',
  },
  hi: {
    dashboard: 'डैशबोर्ड',
    'admin-overview': 'अवलोकन',
    companion: 'एआई सहायक',
    navigation: 'नेविगेशन',
    analytics: 'विश्लेषण',
    queue: 'कतार की स्थिति',
    accessibility: 'पहुंचयोग्यता',
    transport: 'परिवहन',
    sustainability: 'हरा स्टेडियम',
    incidents: 'घटनाएं',
    teams: 'टीमें',
    'staff-management': 'स्टाफ प्रबंधन',
    volunteers: 'स्वयंसेवक',
    staff: 'स्टाफ प्रदर्शन',
    emergency: 'आपातकाल',
    logout: 'लॉगआउट',
    language: 'भाषा',
  },
  es: {
    dashboard: 'Panel de Control',
    'admin-overview': 'Descripción General',
    companion: 'Asistente de IA',
    navigation: 'Navegación',
    analytics: 'Análisis',
    queue: 'Estado de Cola',
    accessibility: 'Accesibilidad',
    transport: 'Transporte',
    sustainability: 'Estadio Verde',
    incidents: 'Incidentes',
    teams: 'Equipos',
    'staff-management': 'Gestionar Personal',
    volunteers: 'Voluntarios',
    staff: 'Desempeño del Personal',
    emergency: 'Emergencia',
    logout: 'Cerrar Sesión',
    language: 'Idioma',
  },
  fr: {
    dashboard: 'Tableau de Bord',
    'admin-overview': 'Aperçu',
    companion: 'Assistant IA',
    navigation: 'Navigation',
    analytics: 'Analyse',
    queue: 'État de la File',
    accessibility: 'Accessibilité',
    transport: 'Transport',
    sustainability: 'Stade Vert',
    incidents: 'Incidents',
    teams: 'Équipes',
    'staff-management': 'Gérer le Personnel',
    volunteers: 'Bénévoles',
    staff: 'Performance du Personnel',
    emergency: 'Urgence',
    logout: 'Déconnexion',
    language: 'Langue',
  },
  ar: {
    dashboard: 'لوحة المعلومات',
    'admin-overview': 'نظرة عامة',
    companion: 'مساعد ذكي',
    navigation: 'التنقل',
    analytics: 'التحليلات',
    queue: 'حالة الطابور',
    accessibility: 'إمكانية الوصول',
    transport: 'النقل',
    sustainability: 'ملعب أخضر',
    incidents: 'حوادث',
    teams: 'الفرق',
    'staff-management': 'إدارة الموظفين',
    volunteers: 'المتطوعون',
    staff: 'أداء الموظفين',
    emergency: 'الطوارئ',
    logout: 'تسجيل الخروج',
    language: 'اللغة',
  },
}

export function Sidebar() {
  const pathname = usePathname()
  const [showLanguages, setShowLanguages] = useState(false)
  const { language } = useLanguage()
  const { user } = useAuth()

  // Determine which menu items to show based on role
  const isAdmin = user?.role === 'admin'
  const menuItems = isAdmin ? ADMIN_MENU_ITEMS : PUBLIC_MENU_ITEMS

  return (
    <aside className="w-72 h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black border-r border-slate-800/50 fixed left-0 top-0 flex flex-col backdrop-blur-sm">
      {/* Top Section - Fixed */}
      <div className="p-6 border-b border-slate-800/30 flex-shrink-0">
        {/* Logo Section with Branding */}
        <div className="flex items-start gap-4 mb-4">
          {/* SDD Logo - Bigger */}
          <motion.div
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 shadow-lg shadow-red-500/20 border border-slate-700/50"
          >
            <Image
              src="/sdd-logo.png"
              alt="SDD Logo"
              width={64}
              height={64}
              className="w-full h-full object-cover"
              priority
            />
          </motion.div>

          {/* Text Section */}
          <div className="flex-1">
            <h1 className="text-lg font-black gradient-text leading-tight">Smart Stadiums</h1>
            <p className="text-xs text-slate-400 mt-0.5">FIFA 2026</p>
          </div>
        </div>
        {user && <p className="text-xs text-yellow-400 capitalize">👤 {user.role}</p>}
      </div>

      {/* Scrollable Navigation */}
      <nav className="flex-1 overflow-y-auto px-8 py-6 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          const label = translations[language]?.[item.key] || item.key
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive
                  ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border border-yellow-500/30 text-yellow-300 shadow-lg shadow-yellow-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 border border-transparent'
                }
              `}
            >
              <span className={`text-xl transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                {item.icon}
              </span>
              <span className="font-medium text-sm">{label}</span>
              {isActive && (
                <span className="ml-auto">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Section - Fixed */}
      <div className="p-8 border-t border-slate-800/30 flex-shrink-0 space-y-4">
        {/* Footer Info */}
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/30">
          <p className="text-xs text-slate-500 mb-2">Connected as</p>
          <p className="text-sm font-medium text-slate-200">{user?.fullName || 'Guest'}</p>
          <p className="text-xs text-yellow-400 mt-1 capitalize">Role: {user?.role || 'visitor'}</p>
        </div>

        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setShowLanguages(!showLanguages)}
            className="w-full px-4 py-2 bg-slate-800/50 text-slate-300 rounded-xl hover:bg-slate-800 transition-all text-sm font-medium flex items-center justify-center gap-2"
          >
            🌍 {translations[language]?.language || 'Language'}
          </button>
          {showLanguages && <LanguageSelector onClose={() => setShowLanguages(false)} />}
        </div>

        {/* Logout Button */}
        <button
          onClick={() => {
            localStorage.removeItem('auth_token')
            window.location.href = '/login'
          }}
          className="w-full px-4 py-3 bg-gradient-to-r from-red-500/20 to-red-600/10 text-red-300 rounded-xl hover:from-red-500/30 hover:to-red-600/20 transition-all duration-200 text-sm font-medium border border-red-500/20 hover:border-red-500/40"
        >
          🚪 {translations[language]?.logout || 'Logout'}
        </button>
      </div>
    </aside>
  )
}
