import { create } from 'zustand'

export type Language = 'en' | 'hi' | 'es' | 'fr' | 'ar'

interface LanguageStore {
  language: Language
  setLanguage: (lang: Language) => void
}

const translations = {
  en: {
    dashboard: 'Dashboard',
    companion: 'AI Companion',
    navigation: 'Navigation',
    accessibility: 'Accessibility',
    transport: 'Transport',
    sustainability: 'Green Stadium',
    incidents: 'Incidents',
    logout: 'Logout',
    welcome: 'Welcome to Smart Stadiums',
    smartStadiums: 'Smart Stadiums',
    fifaWorldCup: 'FIFA World Cup 2026',
  },
  hi: {
    dashboard: 'डैशबोर्ड',
    companion: 'एआई सहायक',
    navigation: 'नेविगेशन',
    accessibility: 'पहुंचयोग्यता',
    transport: 'परिवहन',
    sustainability: 'हरा स्टेडियम',
    incidents: 'घटनाएं',
    logout: 'लॉगआउट',
    welcome: 'स्मार्ट स्टेडियम में स्वागत है',
    smartStadiums: 'स्मार्ट स्टेडियम',
    fifaWorldCup: 'फीफा विश्व कप 2026',
  },
  es: {
    dashboard: 'Panel de Control',
    companion: 'Asistente de IA',
    navigation: 'Navegación',
    accessibility: 'Accesibilidad',
    transport: 'Transporte',
    sustainability: 'Estadio Verde',
    incidents: 'Incidentes',
    logout: 'Cerrar Sesión',
    welcome: 'Bienvenido a Estadios Inteligentes',
    smartStadiums: 'Estadios Inteligentes',
    fifaWorldCup: 'Copa Mundial FIFA 2026',
  },
  fr: {
    dashboard: 'Tableau de Bord',
    companion: 'Assistant IA',
    navigation: 'Navigation',
    accessibility: 'Accessibilité',
    transport: 'Transport',
    sustainability: 'Stade Vert',
    incidents: 'Incidents',
    logout: 'Déconnexion',
    welcome: 'Bienvenue aux Stades Intelligents',
    smartStadiums: 'Stades Intelligents',
    fifaWorldCup: 'Coupe du Monde FIFA 2026',
  },
  ar: {
    dashboard: 'لوحة المعلومات',
    companion: 'مساعد ذكي',
    navigation: 'التنقل',
    accessibility: 'إمكانية الوصول',
    transport: 'النقل',
    sustainability: 'ملعب أخضر',
    incidents: 'حوادث',
    logout: 'تسجيل الخروج',
    welcome: 'أهلا وسهلا بالملاعب الذكية',
    smartStadiums: 'الملاعب الذكية',
    fifaWorldCup: 'كأس العالم FIFA 2026',
  },
}

export const useLanguage = create<LanguageStore>((set) => ({
  language: 'en',
  setLanguage: (lang: Language) => {
    localStorage.setItem('language', lang)
    set({ language: lang })
  },
}))

export function t(key: keyof typeof translations.en): string {
  const lang = useLanguage((state) => state.language)
  return translations[lang][key] || translations.en[key] || key
}

export const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
]
