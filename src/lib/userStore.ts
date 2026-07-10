// In-memory user storage for demo (persists per session)
export interface User {
  id: string
  email: string
  password: string
  fullName: string
  role: 'admin' | 'staff' | 'visitor'
  createdAt: string
  createdBy?: string
}

export interface UserStore {
  users: User[]
}

const DEFAULT_USERS: User[] = [
  {
    id: 'admin_001',
    email: 'admin@stadium.com',
    password: 'Admin@12345',
    fullName: 'Stadium Operations',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'staff_001',
    email: 'staff@stadium.com',
    password: 'Staff@12345',
    fullName: 'Security Team Lead',
    role: 'staff',
    createdAt: new Date().toISOString(),
    createdBy: 'admin_001',
  },
  {
    id: 'staff_002',
    email: 'security2@stadium.com',
    password: 'Staff@12345',
    fullName: 'Medical Team',
    role: 'staff',
    createdAt: new Date().toISOString(),
    createdBy: 'admin_001',
  },
]

// Initialize with admin and seed staff
let store: UserStore = {
  users: JSON.parse(JSON.stringify(DEFAULT_USERS)),
}

export function getUserStore(): UserStore {
  return store
}

export function findUserByEmail(email: string): User | undefined {
  return store.users.find(u => u.email.toLowerCase() === email.toLowerCase())
}

export function findUserById(id: string): User | undefined {
  return store.users.find(u => u.id === id)
}

export function createVisitor(email: string, password: string, fullName: string): User {
  const newUser: User = {
    id: `visitor_${Date.now()}`,
    email: email.trim().toLowerCase(),
    password: password.trim(),
    fullName: fullName.trim(),
    role: 'visitor',
    createdAt: new Date().toISOString(),
  }
  store.users.push(newUser)
  console.log('✓ Visitor created:', newUser.email, '| Total users:', store.users.length)
  return newUser
}

export function createStaff(email: string, password: string, fullName: string, createdBy: string): User {
  const newUser: User = {
    id: `staff_${Date.now()}`,
    email: email.trim().toLowerCase(),
    password: password.trim(),
    fullName: fullName.trim(),
    role: 'staff',
    createdAt: new Date().toISOString(),
    createdBy,
  }
  store.users.push(newUser)
  console.log('✓ Staff created:', newUser.email, '| Total users:', store.users.length)
  return newUser
}

export function getAllStaff(): User[] {
  return store.users.filter(u => u.role === 'staff')
}

export function deleteStaff(id: string): boolean {
  const index = store.users.findIndex(u => u.id === id && u.role === 'staff')
  if (index > -1) {
    store.users.splice(index, 1)
    return true
  }
  return false
}

export function updateStaff(id: string, fullName: string, email: string, password?: string): User | null {
  const user = store.users.find(u => u.id === id && u.role === 'staff')
  if (user) {
    user.fullName = fullName.trim()
    user.email = email.trim().toLowerCase()
    if (password && password.trim()) {
      user.password = password.trim()
    }
    console.log('✓ Staff updated:', user.email)
    return user
  }
  console.log('❌ Staff not found:', id, '| Available:', store.users.map(u => u.id))
  return null
}

export function resetToDefaults(): void {
  store.users = JSON.parse(JSON.stringify(DEFAULT_USERS))
  console.log('✓ Store reset to defaults')
}

export function dumpStore(): void {
  console.log('📋 Current Store:', store.users.map(u => ({ id: u.id, email: u.email, role: u.role })))
}
