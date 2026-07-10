import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Incident {
  id: string
  type: 'medical' | 'security' | 'fire' | 'lost_person'
  severity: 'low' | 'medium' | 'high' | 'critical'
  location: string
  description: string
  time: string
  status: 'open' | 'responding' | 'resolved'
}

interface IncidentStore {
  incidents: Incident[]
  addIncident: (incident: Omit<Incident, 'id' | 'time'>) => void
  updateIncident: (id: string, updates: Partial<Incident>) => void
  deleteIncident: (id: string) => void
  initializeMockData: () => void
}

export const useIncidentStore = create<IncidentStore>()(
  persist(
    (set) => ({
      incidents: [],

      initializeMockData: () => {
        set({
          incidents: [
            {
              id: '1',
              type: 'medical',
              severity: 'high',
              location: 'Section A, Row 12',
              description: 'Medical assistance requested - Visitor unresponsive',
              time: new Date(Date.now() - 2 * 60000).toISOString(),
              status: 'open',
            },
            {
              id: '2',
              type: 'security',
              severity: 'medium',
              location: 'North Gate',
              description: 'Unauthorized access attempt detected',
              time: new Date(Date.now() - 8 * 60000).toISOString(),
              status: 'responding',
            },
            {
              id: '3',
              type: 'lost_person',
              severity: 'low',
              location: 'Concourse B',
              description: 'Child separated from guardian - 6 years old',
              time: new Date(Date.now() - 15 * 60000).toISOString(),
              status: 'resolved',
            },
            {
              id: '4',
              type: 'fire',
              severity: 'critical',
              location: 'East Stand, Level 2',
              description: 'Fire alarm activated - Possible electrical issue',
              time: new Date(Date.now() - 25 * 60000).toISOString(),
              status: 'responding',
            },
            {
              id: '5',
              type: 'security',
              severity: 'high',
              location: 'West Entrance',
              description: 'Suspicious package found near entrance',
              time: new Date(Date.now() - 35 * 60000).toISOString(),
              status: 'open',
            },
            {
              id: '6',
              type: 'medical',
              severity: 'critical',
              location: 'VIP Box Section',
              description: 'Visitor collapsed - CPR in progress',
              time: new Date(Date.now() - 5 * 60000).toISOString(),
              status: 'open',
            },
            {
              id: '7',
              type: 'lost_person',
              severity: 'high',
              location: 'Main Concourse',
              description: 'Adult separated from group - Elderly person',
              time: new Date(Date.now() - 12 * 60000).toISOString(),
              status: 'responding',
            },
            {
              id: '8',
              type: 'security',
              severity: 'low',
              location: 'South Gate',
              description: 'Unruly visitor causing disturbance',
              time: new Date(Date.now() - 20 * 60000).toISOString(),
              status: 'resolved',
            },
            {
              id: '9',
              type: 'medical',
              severity: 'medium',
              location: 'Section C, Row 5',
              description: 'Visitor with minor injury - Bleeding from fall',
              time: new Date(Date.now() - 30 * 60000).toISOString(),
              status: 'resolved',
            },
            {
              id: '10',
              type: 'fire',
              severity: 'high',
              location: 'Kitchen Area',
              description: 'Small fire in food preparation area',
              time: new Date(Date.now() - 45 * 60000).toISOString(),
              status: 'resolved',
            },
          ],
        })
      },

      addIncident: (incident) => {
        const newIncident: Incident = {
          ...incident,
          id: Date.now().toString(),
          time: new Date().toISOString(),
        }
        set((state) => ({
          incidents: [newIncident, ...state.incidents],
        }))
      },

      updateIncident: (id, updates) => {
        set((state) => ({
          incidents: state.incidents.map((incident) =>
            incident.id === id ? { ...incident, ...updates } : incident
          ),
        }))
      },

      deleteIncident: (id) => {
        set((state) => ({
          incidents: state.incidents.filter((incident) => incident.id !== id),
        }))
      },
    }),
    {
      name: 'incident-storage',
    }
  )
)
