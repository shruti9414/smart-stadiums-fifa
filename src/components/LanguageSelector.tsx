'use client'

import { useEffect, useState } from 'react'
import { useLanguage, languages, type Language } from '@/hooks/useLanguage'

interface LanguageSelectorProps {
  onClose?: () => void
}

export function LanguageSelector({ onClose }: LanguageSelectorProps) {
  const { language, setLanguage } = useLanguage()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedLang = localStorage.getItem('language') as Language | null
    if (savedLang) {
      setLanguage(savedLang)
    }
  }, [])

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
    onClose?.()
  }

  if (!mounted) return null

  return (
    <div className="absolute bottom-24 left-6 right-6 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm z-50">
      <div className="p-2 space-y-1">
        {languages.map(lang => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
              language === lang.code
                ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/30'
                : 'text-slate-300 hover:bg-slate-700/30'
            }`}
          >
            {lang.flag} {lang.name}
          </button>
        ))}
      </div>
    </div>
  )
}
