# 🏟️ Complete Guide - Smart Stadiums FIFA 2026
## Kya Hai, Kaise Chalta Hai, Aur Local Me Kaise Check Karu

---

## 📖 TABLE OF CONTENTS

1. **Project Overview** - Pura project kya hai
2. **Architecture Explained** - Sab kaise connect hai
3. **Features Breakdown** - Har feature kaise kaam karta hai
4. **Local Setup** - Step-by-step setup
5. **Testing Guide** - Har feature ko test kaise karu
6. **File Walkthrough** - Important files explain kiye
7. **API Endpoints** - Har endpoint detailed

---

## PART 1: PROJECT OVERVIEW

### 🎯 PROJECT KYA HAI?

**Smart Stadiums FIFA 2026** ek complete web application hai jise **FIFA World Cup 2026 ke stadiums** ke operations better karne ke liye banaya gaya.

**4 Main Features:**
1. 🤖 AI Stadium Companion (AI assistant)
2. 📊 Crowd Intelligence (Real-time data)
3. 🚨 Emergency Response (Incident management)
4. 🗺️ Smart Navigation (Route planning)

### 👥 KON ISTEMAAAL KAREGA?

```
├─ Fans              → AI assistant se help le sakte ho
├─ Organizers        → Real-time crowd data dekh sakte ho
├─ Security Staff    → Incidents manage kar sakte ho
├─ Volunteers        → Tasks assign ho sakte hain
└─ Admin            → Poora system manage kar sakte hain
```

### 🏗️ TECHNOLOGY STACK KYA HAI?

```
Frontend (Jise aap dekh rahe ho)
├─ React 19          (UI library)
├─ Next.js 15        (Framework)
├─ TypeScript        (Programming language)
├─ Tailwind CSS      (Styling)
└─ Three.js          (3D visualization)

Backend (Server-side logic)
├─ Next.js API Routes (Backend server)
├─ Prisma ORM        (Database helper)
└─ OpenAI GPT-4      (AI model)

Database (Data storage)
└─ TiDB MySQL        (Database)

Deployment (Internet par live)
└─ Vercel            (Hosting)
```

---

## PART 2: ARCHITECTURE EXPLAINED

### 🔄 PURA FLOW KAISE KAAM KARTA HAI?

#### **User Signup/Login Flow:**

```
1. User aata hai: http://localhost:3000
   ↓
2. Login page dikhai deta hai
   ↓
3. Email + Password enter karta hai
   ↓
4. Browser → Server ko POST request bhejta hai
   /api/auth/login
   ↓
5. Server → Database mein check karta hai
   "Ye email database mein hai?"
   ↓
6. Password match kare?
   ↓
7. Agar match → JWT token create karta hai (security ke liye)
   ↓
8. Token browser ko bhej deta hai
   ↓
9. Browser → Token localStorage mein save karta hai
   ↓
10. Dashboard page open hota hai
```

#### **Dashboard Load Flow:**

```
1. User dashboard page dekh raha hai
   ↓
2. Page load hota hai
   ↓
3. Browser → Server ko GET request bhejta hai
   /api/crowd/live-stats?stadiumId=default-stadium
   ↓
4. Server → Database mein query karta hai
   "Latest crowd data kya hai?"
   ↓
5. Database → Data return karta hai
   {occupancy: 65.5%, zones: {...}}
   ↓
6. Server → Browser ko data bhej deta hai
   ↓
7. Browser → 3D stadium render karta hai
   ↓
8. Dashboard mein stats dikhai dete hain
```

#### **AI Chat Flow:**

```
1. User kuch likhe: "Bathroom kidhar hai?"
   ↓
2. Browser → Server ko POST request bhejta hai
   /api/ai/chat
   ↓
3. Server → Conversation check karta hai
   "Ye user pehle se chat kar raha hai?"
   ↓
4. Server → Context gather karta hai:
   - User location
   - User role (fan/organizer)
   - Previous messages
   - Stadium data
   ↓
5. Server → OpenAI ko bhejta hai:
   "Ye context hai, ab response do"
   ↓
6. OpenAI → Smart response generate karta hai
   "Restroom Section A Level 2 mein hai"
   ↓
7. Server → Browser ko response bhej deta hai
   ↓
8. Chat interface mein message dikhai deta hai
```

---

## PART 3: FEATURES BREAKDOWN

### FEATURE 1️⃣: AI STADIUM COMPANION

**YE KYA KARATA HAI?**
- User se conversational (baatcheet style) questions poochtaa hai
- Smart responses deta hai
- Zyada se zyada languages support karta hai
- Context-aware (janti hai user kahan hai, kya poocha tha pehle)

**EXAMPLE INTERACTIONS:**

```
User: "Where's the nearest restroom?"
AI: "Nearest restroom is at Section A, Level 2 (100m away). 
    Estimated wait time: 3 minutes. Would you like directions?"

User: "I'm in a wheelchair, what's the accessible route?"
AI: "Accessible route to restroom: Main entrance → Elevator A → 
     Level 2 → Section A. All facilities wheelchair accessible.
     Distance: 150m, Time: 8 minutes."

User: "Bathroom kidhar hai?" (Hindi)
AI: (Hindi mein response deta hai)
```

**HOW IT'S BUILT:**

```
Frontend (src/app/dashboard/companion/page.tsx)
├─ Chat input box
├─ Message display area
├─ Send button
└─ Loading indicator

Backend (src/app/api/ai/chat/route.ts)
├─ Message validation
├─ Conversation history fetch
├─ Context aggregation
├─ OpenAI API call
└─ Response formatting

Database (prisma schema)
├─ ai_conversations table (chat history)
└─ ai_conversation_messages table (individual messages)
```

**FILES INVOLVED:**
- `src/app/dashboard/companion/page.tsx` (UI)
- `src/app/api/ai/chat/route.ts` (Backend logic)
- `src/hooks/useApi.ts` (API calling)
- `src/lib/validators.ts` (Input validation)

---

### FEATURE 2️⃣: CROWD INTELLIGENCE DASHBOARD

**YE KYA KARATA HAI?**
- Real-time crowd occupancy dikhai deta hai
- Zone-wise breakdown deta hai
- 4 ghante ahead ke liye prediction deta hai
- Recommendations deta hai

**DASHBOARD PAGE:**

```
┌─────────────────────────────────────────────┐
│  SMART STADIUMS - FIFA 2026                 │
├─────────────────────────────────────────────┤
│                                             │
│  [3D STADIUM VISUALIZATION]                 │
│  - Real-time 3D model                       │
│  - Color coded: Green/Yellow/Red            │
│  - Rotating animation                       │
│                                             │
├─────────────────────────────────────────────┤
│  LIVE STATISTICS                            │
│                                             │
│  Stadium Occupancy: 65%                     │
│  Live Visitors: 8,234                       │
│  Active Incidents: 3                        │
│  Volunteers: 127                            │
│                                             │
├─────────────────────────────────────────────┤
│  LIVE FEED                                  │
│  📢 Gate A opened - 2 mins ago              │
│  ⚠️  High crowd in Zone C - 5 mins ago      │
│  🚨 Medical assistance - 12 mins ago        │
└─────────────────────────────────────────────┘
```

**HOW IT WORKS:**

```
Server har 30 seconds mein:
1. Sensors/Mobile apps se crowd data collect karta hai
2. Database mein store karta hai (crowd_analytics table)
3. Predictions calculate karta hai
4. Dashboard ko realtime update bhejta hai

Frontend:
1. Page load hota hai
2. Occupancy data fetch karta hai
3. 3D stadium render karta hai
4. Stats display karta hai
5. Every 30 seconds data refresh karta hai
```

**FILES INVOLVED:**
- `src/app/dashboard/page.tsx` (Main dashboard)
- `src/components/Stadium3D.tsx` (3D visualization)
- `src/app/api/crowd/live-stats/route.ts` (Backend API)
- `src/hooks/useApi.ts` (Data fetching)

---

### FEATURE 3️⃣: EMERGENCY RESPONSE SYSTEM

**YE KYA KARATA HAI?**
- Incidents report karne deta hai (Medical, Security, Fire, etc)
- Real-time tracking karta hai
- Responders assign karta hai
- AI recommendations deta hai

**INCIDENT REPORT FORM:**

```
┌──────────────────────────────┐
│ REPORT INCIDENT              │
├──────────────────────────────┤
│                              │
│ Type: [Medical ▼]            │
│ Severity: [High ▼]           │
│ Location: [Section A ________│
│ Description: [________________│
│              ________________│
│              ________________│
│                              │
│  [Submit Report]             │
└──────────────────────────────┘

Then:
Incident Created → ID: inc_123456
Status: Reported
Responders Assigned: 3
Estimated Response Time: 2 minutes
```

**HOW IT WORKS:**

```
1. User /dashboard/incidents page pe jata hai
2. "+ Report Incident" button click karta hai
3. Form dikhai deta hai
4. Information fill karta hai
5. Submit karta hai
   ↓
6. Browser → Server ko POST request bhejta hai
   /api/incidents/report
   ↓
7. Server → Input validate karta hai (Zod validation)
8. Database mein insert karta hai
9. Notifications send karta hai responders ko
10. Response bhej deta hai
   ↓
11. Page mein incident dikhai deta hai
12. Real-time update hote rehte hain
```

**INCIDENT TRACKING:**

```
Timeline:
14:30 - Incident Reported (Medical, Section A)
14:32 - 3 Responders Assigned
14:33 - First Responder on Scene
14:45 - Status Changed to "In Progress"
14:58 - Resolved
```

**FILES INVOLVED:**
- `src/app/dashboard/incidents/page.tsx` (UI)
- `src/app/api/incidents/report/route.ts` (Backend)
- `src/lib/validators.ts` (Validation)
- `prisma/schema.prisma` (Database tables)

---

### FEATURE 4️⃣: SMART NAVIGATION

**YE KYA KARATA HAI?**
- Point A se Point B tak route batata hai
- Accessibility info deta hai
- Crowd-aware routing karta hai
- Distance + time estimate deta hai

**EXAMPLE:**

```
User Input:
From: Main Entrance
To: Nearest Restroom

Output:
═══════════════════════════════════
Route: Main Entrance → Elevator A → 
       Level 2 → Section A Restroom

Distance: 450 meters
Estimated Time: 6 minutes
Crowd Risk: Low
Accessibility Score: 95/100

Waypoints:
1. Main Entrance (Start)
2. Elevator A (Accessible lift)
3. Level 2 (Accessible floor)
4. Section A Restroom (End)

Features:
✓ Wheelchair accessible
✓ No crowded areas
✓ Multiple exit routes
```

**HOW IT WORKS:**

```
1. User navigate page mein jaata hai
2. "From" aur "To" select karta hai
3. Route calculate karta hai
   ↓
4. Browser → Server ko POST request bhejta hai
   /api/navigation/route
   {from: "poi_123", to: "poi_456", ...}
   ↓
5. Server:
   - POI details fetch karta hai
   - Distance calculate karta hai (Haversine formula)
   - Accessibility check karta hai
   - Crowd data check karta hai
   ↓
6. Route data return karta hai
   ↓
7. Map mein path dikhai deta hai
8. Details display hoti hain
```

**TECHNICAL DETAILS:**

```
Distance Formula (Haversine):
- Latitude aur Longitude se distance calculate karta hai
- Accurate geographic calculation
- Real world distance

Accessibility Scoring:
- Elevators presence: +25
- Ramps: +25
- Accessible bathrooms: +25
- Wide corridors: +25

Crowd Awareness:
- Current occupancy check karta hai
- Congestion zones avoid karta hai
- Alternative routes suggest karta hai
```

**FILES INVOLVED:**
- `src/app/dashboard/navigate/page.tsx` (Navigation page)
- `src/app/api/navigation/route/route.ts` (Route calculation)
- `src/lib/utils.ts` (Distance calculation)
- `prisma/schema.prisma` (POI data)

---

## PART 4: LOCAL SETUP - STEP BY STEP

### STEP 1: PROJECT FOLDER MEIN JAWA

```bash
# Command line mein type karo:
cd C:\Users\Admin\Documents\smart-stadiums-fifa

# Check karo ki aap sahi folder mein ho:
dir
# Output mein ye files dikhai denge:
# package.json, README.md, QUICK_START.md, etc.
```

### STEP 2: DEPENDENCIES INSTALL KARNA

```bash
# Terminal mein type karo:
npm install

# Ye kya karata hai?
# → node_modules folder create karta hai
# → Sab libraries download karta hai
# → ~500MB size ho sakhta hai
# → 2-5 minutes lag sakhta hai

# Jab complete ho, ye dikhai dega:
# added XXX packages in 3m
```

### STEP 3: ENVIRONMENT FILE SETUP

```bash
# Terminal mein:
cp .env.example .env.local

# Ye kya karata hai?
# → .env.example file copy karta hai
# → .env.local naam deta hai
# → Ab aap isko edit kar sakte ho

# Ab text editor mein open karo:
# C:\Users\Admin\Documents\smart-stadiums-fifa\.env.local

# File mein ye dikhai dega:
DATABASE_URL=mysql://user:password@tidbhost:4000/smart_stadiums
OPENAI_API_KEY=sk-your-api-key-here
AUTH_SECRET=your-secret-key-change-in-production
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

**DATABASE_URL EDIT KARNA:**

```
Agar aapke paas TiDB Cloud account nahi hai to:

1. https://tidbcloud.com pe jao
2. Sign up karo (free hai)
3. Cluster create karo (5 minutes wait)
4. Connection string copy karo
5. Format hona chahiye:
   mysql://root:password@tidbhost:4000/database_name

Phir .env.local mein paste karo aur save karo.

Agar sirf test karna ho to mock data use kar sakte ho.
```

**OPENAI_API_KEY EDIT KARNA:**

```
1. https://openai.com pe jao
2. Login karo aur API key generate karo
3. Format: sk-... (long string)
4. .env.local mein paste karo

Agar nahi kar sakte ho to AI feature work nahi karega
lekin rest sab chale ga.
```

### STEP 4: TYPESCRIPT & BUILD CHECK

```bash
# Terminal mein:
npm run type-check

# Ye kya karata hai?
# → TypeScript errors check karta hai
# → Syntax validate karta hai
# → Code quality verify karta hai

# Output:
# ✓ No errors found (agar sab theek hai)
```

### STEP 5: DEVELOPMENT SERVER START

```bash
# Terminal mein:
npm run dev

# Ye kya karata hai?
# → Development server start karta hai
# → Code changes automatically reload hote hain
# → Logs display karta hai

# Output dikhai dega:
# 
# > smart-stadiums-fifa@1.0.0 dev
# > next dev
#
# ▲ Next.js 15.0.0
# - Local: http://localhost:3000
# - Environments: .env.local
#
# Ready in 2.5s
```

### STEP 6: BROWSER MEIN OPEN KARNA

```bash
# Browser mein type karo URL:
http://localhost:3000

# Ya direct click karo: localhost:3000

# Ye dikhai dega:
# → Login page load hoga
# → Beautiful black theme
# → Input fields dikhai denge
```

---

## PART 5: TESTING GUIDE - HAR FEATURE KO TEST KAISE KARU

### TEST 1️⃣: LOGIN & REGISTRATION

**Step 1: Registration Test**

```
1. http://localhost:3000 pe open karo
   (Auto redirect to /login)

2. Page bottom mein dekho:
   "Don't have an account? Register here"

3. Register link click karo
   → /register page open hoga

4. Form fill karo:
   Full Name: Aapka naam (e.g., "Raj Kumar")
   Email: Aapka email (e.g., "raj@example.com")
   Password: Minimum 8 chars + 1 uppercase (e.g., "Pass@12345")

5. Create Account button click karo

6. Expected Result:
   ✓ Account create hona chahiye
   ✓ Auto logged in ho jaona chahiye
   ✓ /dashboard pe redirect hona chahiye
```

**Step 2: Login Test (Demo Account)**

```
Agar register nahi karna to ye use karo:

1. Login page pe jao
   
2. Credentials enter karo:
   Email: demo@stadiums.com
   Password: Demo@12345

3. Sign In button click karo

4. Expected Result:
   ✓ Dashboard page load hona chahiye
   ✓ Welcome message dikhai dena chahiye
   ✓ Stats cards visible hone chahiye
```

**Step 3: Logout Test**

```
1. Dashboard pe top-right corner dekho
   (Username likha hoga)

2. Logout link click karo

3. Expected Result:
   ✓ Login page pe redirect hona chahiye
   ✓ Token clear ho gya hona chahiye
   ✓ Login fir se kar sakte ho
```

---

### TEST 2️⃣: DASHBOARD & 3D VISUALIZATION

**Step 1: Dashboard Load**

```
1. Login karo (demo credentials use karo)

2. /dashboard page load hota hai

3. Page mein ye dikhai dena chahiye:
   ✓ "Smart Stadiums" heading (yellow color)
   ✓ User name aur role
   ✓ 4 Statistics cards (yellow, green, red, blue)
   ✓ 3D Stadium visualization
   ✓ Live feed section
```

**Step 2: 3D Stadium Exploration**

```
1. Dashboard mein middle section dekho
   → 3D stadium model dikhai dega

2. Action try karo:
   - Mouse drag karo
     → Stadium rotate hona chahiye
   - Zoom (scroll wheel)
     → Stadium bada/chhota hona chahiye
   - Pause karo
     → Animation continue rehni chahiye

3. Colors dekho:
   - Green sections: Low occupancy
   - Yellow sections: Medium occupancy
   - Red sections: High occupancy

4. Performance check:
   - Smooth hona chahiye (60 FPS)
   - Lag nahi hona chahiye
```

**Step 3: Statistics Cards**

```
Cards mein ye info hona chahiye:

┌─────────────────────────────┐
│ Stadium Occupancy: 65%      │
│ Trend: ↑ up                 │
├─────────────────────────────┤
│ Live Visitors: 8,234        │
│ Trend: ↑ up                 │
├─────────────────────────────┤
│ Active Incidents: 3         │
│ Trend: ↑ up                 │
├─────────────────────────────┤
│ Volunteers: 127             │
│ Trend: → stable             │
└─────────────────────────────┘

Numbers actual data se aate hain (database se).
```

---

### TEST 3️⃣: AI COMPANION (CHAT)

**Step 1: Chat Page Open**

```
1. Dashboard pe jao

2. Left sidebar mein dekho (ya top menu)
   → "🤖 Companion" option

3. Click karo
   → /dashboard/companion page open hoga

4. Page dikhai dena chahiye:
   ✓ Chat bubble area (khali)
   ✓ Input box (bottom)
   ✓ Send button
```

**Step 2: Send First Message**

```
1. Input box mein click karo

2. Type karo: "Where's the nearest bathroom?"

3. Send button click karo (ya Enter press karo)

4. Expected Flow:
   ✓ User message chat mein dikhai de (yellow bubble)
   ✓ Loading indicator dikhai de
   ✓ AI response aaye (dark bubble)
   ✓ Response 5-10 seconds mein aana chahiye

Example AI Response:
"The nearest restroom is located at Section A, Level 2.
Distance: 150m. Estimated walking time: 3 minutes.
Queue wait time: ~5 minutes. Wheelchair accessible."
```

**Step 3: Multi-turn Conversation**

```
1. Follow-up message type karo:
   "I'm in a wheelchair, what's the accessible path?"

2. Send karo

3. Expected:
   ✓ AI context remember karega
   ✓ Wheelchair-friendly route suggest karega
   ✓ Previous context use hona chahiye

4. Aur message try karo:
   "Bathroom kidhar hai?" (Hindi mein)

5. Expected:
   ✓ Hindi understand karega
   ✓ Hindi mein response dega (GPT multilingual hai)
```

**Step 4: Conversation History**

```
1. Multiple messages exchange karo

2. Page refresh karo (F5)

3. Expected:
   ✓ Conversation history persist rahni chahiye
   ✓ Sab messages screen par dikhai den

(Note: Backend mein conversation database mein store hota hai)
```

---

### TEST 4️⃣: EMERGENCY RESPONSE

**Step 1: Incident Report Form**

```
1. Dashboard pe /dashboard/incidents page open karo

2. Top-right mein "+ Report Incident" button dikhai dena chahiye

3. Click karo
   → Form open hona chahiye
```

**Step 2: Report Incident**

```
1. Form fill karo:

   Type (Dropdown):
   ├─ Medical
   ├─ Security
   ├─ Fire
   ├─ Lost Person
   └─ Accessibility
   
   Select: Medical

2. Severity (Dropdown):
   ├─ Low
   ├─ Medium
   ├─ High
   └─ Critical
   
   Select: High

3. Location (Text):
   Type: "Section A, Gate 3"

4. Description (Textarea):
   Type: "Person fell down, bleeding on leg"

5. Submit Report button click karo

6. Expected:
   ✓ Form submit hona chahiye
   ✓ Incident list mein incident dikhai de
   ✓ Status: "Reported" hona chahiye
```

**Step 3: Incident Card Details**

```
Incident card mein ye dikhai dena chahiye:

┌────────────────────────────────────┐
│ 🚨 INCIDENT REPORT                 │
├────────────────────────────────────┤
│ Type: Medical                       │
│ Severity: High (red background)    │
│ Location: Section A, Gate 3        │
│ Description: Person fell down...   │
│ Time: 2 mins ago                   │
│ Status: Reported ✓                 │
└────────────────────────────────────┘

Color coding dekho:
- Low → Blue color
- Medium → Yellow color
- High → Orange color
- Critical → Red color
```

**Step 4: Multiple Incidents**

```
1. Multiple incidents report karo

2. Recent incident top mein hona chahiye

3. List mein order hona chahiye: newest first

4. Each incident independently display hona chahiye
```

---

### TEST 5️⃣: NAVIGATION

**Step 1: Navigate Page Open**

```
1. Dashboard mein /dashboard/navigate page open karo
   (Agar navigation link dikhai de)

2. Page load hona chahiye with:
   ✓ Map area
   ✓ POI (Points of Interest) list
   ✓ Route calculation form

Note: Agar Mapbox API key nahi hai to map work nahi karega
lekin rest UI display hona chahiye.
```

**Step 2: Route Search**

```
1. "From" field mein click karo
   → POI list dropdown ho sakhta hai

2. POI select karo (e.g., "Main Entrance")

3. "To" field mein click karo

4. Different POI select karo (e.g., "Restroom")

5. Route Calculate button click karo

6. Expected:
   ✓ Route calculate hona chahiye
   ✓ Distance dikhai de
   ✓ Time estimate dikhai de
   ✓ Path display hona chahiye (agar map working hai)
```

---

## PART 6: FILE WALKTHROUGH

### 📁 FOLDER STRUCTURE EXPLAINED

```
smart-stadiums-fifa/
│
├── src/                          (MAIN SOURCE CODE)
│   │
│   ├── app/
│   │   ├── layout.tsx            ← Root layout (sab pages yahan wrap hote hain)
│   │   ├── globals.css           ← Global styles (Tailwind config)
│   │   ├── page.tsx              ← Home page (redirects to login)
│   │   │
│   │   ├── (auth)/               ← Auth pages folder
│   │   │   ├── login/page.tsx     ← Login page
│   │   │   └── register/page.tsx  ← Register page
│   │   │
│   │   ├── dashboard/            ← Dashboard pages (protected)
│   │   │   ├── page.tsx           ← Main dashboard
│   │   │   ├── companion/         ← AI chat folder
│   │   │   │   └── page.tsx       ← Chat interface
│   │   │   ├── incidents/         ← Emergency folder
│   │   │   │   └── page.tsx       ← Incident form
│   │   │   └── navigate/          ← Navigation folder
│   │   │       └── page.tsx       ← Navigation page
│   │   │
│   │   └── api/                   ← Backend API routes
│   │       ├── auth/
│   │       │   ├── login/route.ts     ← Login API
│   │       │   └── register/route.ts  ← Register API
│   │       ├── ai/
│   │       │   └── chat/route.ts      ← Chat API
│   │       ├── crowd/
│   │       │   └── live-stats/route.ts ← Crowd data API
│   │       ├── incidents/
│   │       │   └── report/route.ts    ← Incident API
│   │       ├── navigation/
│   │       │   └── route/route.ts     ← Navigation API
│   │       └── health/route.ts        ← Health check
│   │
│   ├── components/
│   │   └── Stadium3D.tsx         ← 3D stadium component
│   │
│   ├── hooks/
│   │   ├── useAuth.ts            ← Auth state management (Zustand)
│   │   └── useApi.ts             ← API calling wrapper
│   │
│   └── lib/
│       ├── auth.ts               ← JWT & security functions
│       ├── db.ts                 ← Prisma client
│       ├── api.ts                ← API utilities & helpers
│       ├── validators.ts         ← Zod validation schemas
│       └── utils.ts              ← Common utility functions
│
├── prisma/
│   ├── schema.prisma             ← Database schema (14 tables)
│   └── seed.ts                   ← Demo data
│
├── public/                        (Static files - images, icons)
│
├── .env.example                  ← Environment template
├── .env.local                    ← Your local env (create karna padta hai)
│
├── package.json                  ← Project dependencies
├── tsconfig.json                 ← TypeScript config
├── tailwind.config.ts            ← Tailwind CSS config
├── next.config.ts                ← Next.js config
│
├── README.md                     ← Project overview
├── ARCHITECTURE.md               ← Detailed architecture
├── DEPLOYMENT.md                 ← Deployment guide
├── BUILD_SUMMARY.md              ← What's built
├── QUICK_START.md                ← Quick setup
└── COMPLETE_GUIDE.md             ← This file!
```

### 🔍 IMPORTANT FILES EXPLAINED

#### **1. `src/app/layout.tsx` (Root Layout)**

```typescript
// Ye file page load hone ka base structure hai
// Sab pages yahan se wrap hote hain

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {/* All pages render here */}
        {children}
      </body>
    </html>
  )
}

// Kaam: HTML structure, global providers setup
```

#### **2. `src/app/dashboard/page.tsx` (Main Dashboard)**

```typescript
// Main dashboard page
// 3D stadium, stats, activity feed

export default function Dashboard() {
  // 1. Check if user logged in
  useEffect(() => {
    if (!token) redirect('/login')
  }, [token])

  // 2. Fetch crowd data
  useEffect(() => {
    const loadCrowd = async () => {
      const stats = await call('/api/crowd/live-stats')
      setOccupancy(stats.totalOccupancy)
    }
    loadCrowd()
  }, [call])

  // 3. Render UI
  return (
    <div>
      <Stadium3D occupancy={occupancy} />
      {/* Stats cards */}
      {/* Activity feed */}
    </div>
  )
}

// Kaam: Sab data fetch karo aur display karo
```

#### **3. `src/components/Stadium3D.tsx` (3D Visualization)**

```typescript
// Three.js se 3D stadium render karta hai

export function Stadium3D({ occupancy }) {
  useEffect(() => {
    // 1. Three.js setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(...)
    const renderer = new THREE.WebGLRenderer(...)

    // 2. Create stadium geometry
    const stadium = new THREE.Group()
    
    // Add bowl (main structure)
    const bowl = new THREE.Mesh(geometry, material)
    stadium.add(bowl)
    
    // Add seating sections (16 sections)
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2
      const seats = new THREE.Mesh(...)
      
      // Color based on occupancy
      if (occupancy > 80) seats.material.color.set(0xff4444) // Red
      else if (occupancy > 50) seats.material.color.set(0xffb800) // Yellow
      else seats.material.color.set(0x10b981) // Green
      
      stadium.add(seats)
    }
    
    // Add roof (gold color)
    const roof = new THREE.Mesh(roofGeo, roofMat)
    stadium.add(roof)
    
    // 3. Add lighting
    const light1 = new THREE.AmbientLight(0xffffff, 0.6)
    const light2 = new THREE.DirectionalLight(0xffffff, 0.8)
    scene.add(light1, light2)
    
    // 4. Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      stadium.rotation.y += 0.001  // Rotate
      renderer.render(scene, camera)
    }
    animate()
  }, [occupancy])

  return <div ref={containerRef} />
}

// Kaam: 3D model render karo aur rotate karo
```

#### **4. `src/app/api/auth/login/route.ts` (Login API)**

```typescript
// Login endpoint: POST /api/auth/login

export async function POST(req) {
  // 1. Body validate karo (Zod schema)
  const body = await validateBody(req, loginSchema)
  if (!body) return error('Invalid input')

  // 2. Database mein user find karo
  const user = await prisma.user.findUnique({
    where: { email: body.email }
  })
  
  if (!user) return error('Invalid credentials', 401)

  // 3. Password verify karo
  const isValid = await verifyPassword(body.password, user.passwordHash)
  if (!isValid) return error('Invalid credentials', 401)

  // 4. JWT token generate karo
  const token = await generateToken({
    userId: user.id,
    role: user.role
  })

  // 5. Session database mein save karo
  await prisma.userSession.create({
    data: {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  })

  // 6. Response bhej do
  return success({
    user: { id: user.id, email: user.email, fullName: user.fullName },
    token
  })
}

// Kaam: Username/password verify karo aur token generate karo
```

#### **5. `src/app/api/ai/chat/route.ts` (AI Chat API)**

```typescript
// AI Chat endpoint: POST /api/ai/chat

export async function POST(req) {
  // 1. User verify karo
  const user = await authenticate(req)
  if (!user) return error('Unauthorized', 401)

  // 2. Request validate karo
  const body = await validateBody(req, chatSchema)
  if (!body) return error('Invalid input')

  // 3. Conversation fetch karo (ya new create karo)
  let conversation = await prisma.aIConversation.findUnique({
    where: { id: body.conversationId },
    include: { messages: { take: 5 } }
  })

  if (!conversation) {
    conversation = await prisma.aIConversation.create({
      data: {
        userId: user.id,
        stadiumId: 'default-stadium',
        context: body.context
      }
    })
  }

  // 4. Previous messages fetch karo (context ke liye)
  const messages = conversation.messages.map(m => ({
    role: m.role,
    content: m.content
  }))

  // 5. System prompt create karo
  const systemPrompt = `You are a helpful stadium assistant.
User role: ${user.role}
Language: ${body.context?.language}
Location: ${body.context?.location}
Respond in JSON format...`

  // 6. OpenAI ko call karo
  const response = await openai.chat.completions.create({
    model: 'gpt-4-1106-preview',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
      { role: 'user', content: body.message }
    ]
  })

  // 7. Response extract karo
  const aiResponse = response.choices[0].message.content

  // 8. Messages database mein save karo
  await prisma.aIMessage.create({
    data: {
      conversationId: conversation.id,
      role: 'user',
      content: body.message
    }
  })

  await prisma.aIMessage.create({
    data: {
      conversationId: conversation.id,
      role: 'assistant',
      content: aiResponse
    }
  })

  // 9. Response bhej do
  return success({
    conversationId: conversation.id,
    response: aiResponse
  })
}

// Kaam: Previous context get karo, OpenAI se response lao, save karo
```

#### **6. `src/hooks/useAuth.ts` (Auth State)**

```typescript
// Zustand se auth state manage karta hai

interface AuthStore {
  user: User | null
  token: string | null
  setAuth: (user, token) => void
  logout: () => void
}

export const useAuth = create<AuthStore>((set) => ({
  user: null,
  token: null,
  
  setAuth: (user, token) => {
    if (token) {
      // localStorage mein save karo
      localStorage.setItem('auth_token', token)
    }
    set({ user, token })
  },
  
  logout: () => {
    localStorage.removeItem('auth_token')
    set({ user: null, token: null })
  },
}))

// Kaam: Global auth state manage karo
// Kisi bhi component mein use kar sakte ho:
// const { user, token, logout } = useAuth()
```

#### **7. `src/lib/validators.ts` (Input Validation)**

```typescript
// Zod schemas se input validate karta hai

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 chars')
})

export const chatSchema = z.object({
  message: z.string().min(1).max(2000),
  conversationId: z.string().optional(),
  context: z.object({
    location: z.string().optional(),
    role: z.string().optional(),
    language: z.string().optional()
  }).optional()
})

// Kaam: API requests validate karo
// Agar invalid → error throw hota hai
```

---

## PART 7: API ENDPOINTS - DETAILED

### 🔌 HOW TO CALL API ENDPOINTS

**General Pattern:**

```javascript
// Browser se API call karte ho:
const token = localStorage.getItem('auth_token')

const response = await fetch('/api/endpoint', {
  method: 'POST',  // or GET, PATCH, DELETE
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`  // Important!
  },
  body: JSON.stringify({
    // Your data here
  })
})

const data = await response.json()
console.log(data)
```

### ENDPOINT 1: Authentication

#### **POST /api/auth/login**

```javascript
// Request:
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'demo@stadiums.com',
    password: 'Demo@12345'
  })
})

// Response (Success):
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "demo@stadiums.com",
      "fullName": "Demo User",
      "role": "fan"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}

// Response (Failure):
{
  "success": false,
  "error": "Invalid credentials"
}

// Browser mein:
// 1. Token localStorage mein save hota hai
// 2. Dashboard redirect hota hai
```

#### **POST /api/auth/register**

```javascript
// Request:
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'newuser@example.com',
    password: 'Pass@12345',
    fullName: 'New User'
  })
})

// Response:
{
  "success": true,
  "data": {
    "user": {...},
    "token": "..."
  }
}
```

### ENDPOINT 2: AI Chat

#### **POST /api/ai/chat**

```javascript
// Request:
const response = await fetch('/api/ai/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    message: "Where's the bathroom?",
    conversationId: null,  // First message
    context: {
      location: "Section A",
      role: "fan",
      language: "en"
    }
  })
})

// Response:
{
  "success": true,
  "data": {
    "conversationId": "conv_123",
    "response": "The nearest restroom is at Section A, Level 2...",
    "tokens": 150
  }
}

// Follow-up message:
const response2 = await fetch('/api/ai/chat', {
  method: 'POST',
  headers: {...},
  body: JSON.stringify({
    message: "I'm in a wheelchair",
    conversationId: "conv_123",  // Use existing conversation
    context: {...}
  })
})

// Response:
{
  "success": true,
  "data": {
    "conversationId": "conv_123",
    "response": "Accessible route: ... Elevator A is wheelchair accessible...",
    "tokens": 200
  }
}
```

### ENDPOINT 3: Crowd Data

#### **GET /api/crowd/live-stats**

```javascript
// Request:
const response = await fetch(
  '/api/crowd/live-stats?stadiumId=default-stadium',
  {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
)

// Response:
{
  "success": true,
  "data": {
    "totalOccupancy": 65.5,
    "zones": [
      { "zone": "sectionA", "occupancy": 78 },
      { "zone": "sectionB", "occupancy": 62 }
    ],
    "predictions": [
      {
        "time": "2026-07-07T16:00:00Z",
        "occupancy": 70,
        "confidence": 0.92,
        "risks": ["high_exit_congestion_expected"]
      }
    ],
    "lastUpdated": "2026-07-07T15:32:00Z"
  }
}
```

### ENDPOINT 4: Incidents

#### **POST /api/incidents/report**

```javascript
// Request:
const response = await fetch('/api/incidents/report', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    type: "medical",
    severity: "high",
    location: "Section A, Gate 3",
    description: "Person fell down, bleeding"
  })
})

// Response:
{
  "success": true,
  "data": {
    "incidentId": "inc_123",
    "status": "reported",
    "createdAt": "2026-07-07T15:30:00Z"
  }
}
```

### ENDPOINT 5: Navigation

#### **POST /api/navigation/route**

```javascript
// Request:
const response = await fetch('/api/navigation/route', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    from: "poi_entrance_1",
    to: "poi_restroom_a2",
    preferences: ["shortest"]
  })
})

// Response:
{
  "success": true,
  "data": {
    "from": "Main Entrance",
    "to": "Restroom Section A",
    "distance": "450m",
    "estimatedTime": "6min",
    "accessibility": "wheelchair_accessible",
    "path": [
      { "lat": 19.2622, "lng": -99.0818 },
      { "lat": 19.2630, "lng": -99.0820 }
    ]
  }
}
```

---

## PART 8: DATABASE EXPLAINED

### 🗄️ DATABASE KYA HAI?

```
Database = Large filing cabinet
Table = Folder in cabinet
Row = Individual file
Column = Information in file
```

### 14 MAIN TABLES

#### **Table 1: users**
```
Purpose: User information store karta hai

Columns:
├─ id (unique identifier)
├─ email (login ke liye)
├─ passwordHash (encrypted password)
├─ fullName (user ka naam)
├─ role (fan/organizer/security/volunteer/admin)
├─ language (preferred language)
└─ createdAt (account creation time)

Example Row:
id: "user_123"
email: "demo@stadiums.com"
passwordHash: "$2b$12$..."
fullName: "Demo User"
role: "fan"
language: "en"
createdAt: "2026-07-01T10:00:00Z"
```

#### **Table 2: stadiums**
```
Purpose: Stadium information

Columns:
├─ id
├─ name
├─ city
├─ country
├─ capacity
├─ latitude
├─ longitude
└─ timezone

Example:
id: "default-stadium"
name: "2026 FIFA World Cup Stadium"
city: "Mexico City"
country: "Mexico"
capacity: 87000
latitude: 19.2622
longitude: -99.0818
timezone: "America/Mexico_City"
```

#### **Table 3: ai_conversations**
```
Purpose: Chat history store karta hai

Columns:
├─ id
├─ userId
├─ stadiumId
├─ topic
├─ context (JSON - location, role, etc)
├─ totalTokensUsed
└─ expiresAt

Example:
id: "conv_123"
userId: "user_123"
stadiumId: "default-stadium"
topic: "navigation"
context: {"location": "Section A", "role": "fan"}
totalTokensUsed: 150
expiresAt: "2026-07-08T15:30:00Z"
```

#### **Table 4: ai_conversation_messages**
```
Purpose: Individual messages store karta hai

Columns:
├─ id
├─ conversationId
├─ role (user or assistant)
├─ content (actual message)
└─ tokensUsed

Example:
id: "msg_123"
conversationId: "conv_123"
role: "user"
content: "Where's the bathroom?"
tokensUsed: 10

id: "msg_124"
conversationId: "conv_123"
role: "assistant"
content: "The nearest restroom is at Section A, Level 2..."
tokensUsed: 140
```

#### **Table 5: crowd_analytics**
```
Purpose: Real-time crowd data store karta hai

Columns:
├─ id
├─ stadiumId
├─ occupancyPct
├─ zoneData (JSON)
└─ timestamp

Example:
id: "crowd_123"
stadiumId: "default-stadium"
occupancyPct: 65.5
zoneData: {"sectionA": 78, "sectionB": 62, "sectionC": 55}
timestamp: "2026-07-07T15:30:00Z"

(Every 30 seconds new row add hota hai)
```

#### **Table 6: incidents**
```
Purpose: Emergency reports store karta hai

Columns:
├─ id
├─ stadiumId
├─ type (medical/security/fire)
├─ severity (low/medium/high/critical)
├─ location
├─ description
├─ status (reported/acknowledged/resolved)
└─ createdAt

Example:
id: "inc_123"
stadiumId: "default-stadium"
type: "medical"
severity: "high"
location: "Section A, Gate 3"
description: "Person fell down"
status: "reported"
createdAt: "2026-07-07T15:30:00Z"
```

#### **Table 7-14: Others**

```
seating_sections    → Stadium ke sections
seating_seats       → Individual seats
amenities          → Bathrooms, food courts, etc
gates              → Entry/exit gates
navigation_pois    → Landmarks
matches            → Match events
match_tickets      → Ticket information
user_notifications → Alerts aur notifications
```

### 📊 DATABASE QUERIES EXAMPLE

**Query 1: Crowd data get karna**

```javascript
// Frontend se:
const stats = await call('/api/crowd/live-stats')

// Backend mein:
const analytics = await prisma.crowdAnalytics.findFirst({
  where: { stadiumId: 'default-stadium' },
  orderBy: { timestamp: 'desc' }  // Latest first
})

// SQL equivalent:
// SELECT * FROM crowd_analytics 
// WHERE stadium_id = 'default-stadium'
// ORDER BY timestamp DESC
// LIMIT 1
```

**Query 2: User login verify karna**

```javascript
const user = await prisma.user.findUnique({
  where: { email: 'demo@stadiums.com' }
})

// SQL equivalent:
// SELECT * FROM users WHERE email = 'demo@stadiums.com'
```

**Query 3: Conversation messages get karna**

```javascript
const conversation = await prisma.aIConversation.findUnique({
  where: { id: 'conv_123' },
  include: {
    messages: { take: 5, orderBy: { createdAt: 'desc' } }
  }
})

// SQL equivalent:
// SELECT * FROM ai_conversations WHERE id = 'conv_123'
// SELECT * FROM ai_conversation_messages 
// WHERE conversation_id = 'conv_123'
// ORDER BY created_at DESC LIMIT 5
```

---

## PART 9: COMPLETE LOCAL TESTING CHECKLIST

### ✅ DAY 1: SETUP

```bash
[ ] npm install
[ ] cp .env.example .env.local
[ ] Edit .env.local (DATABASE_URL, OPENAI_API_KEY)
[ ] npm run type-check (no errors?)
[ ] npm run dev (server starts?)
[ ] http://localhost:3000 open karo (login page dikhai de?)
```

### ✅ DAY 2: AUTHENTICATION

```bash
[ ] Register new account
    [ ] Valid email
    [ ] Strong password (8+ chars, 1 uppercase)
    [ ] Full name
    [ ] Should redirect to dashboard

[ ] Login with demo account
    [ ] Email: demo@stadiums.com
    [ ] Password: Demo@12345
    [ ] Should show dashboard

[ ] Logout
    [ ] Should redirect to login

[ ] Refresh page
    [ ] Should stay logged in (token persists)
```

### ✅ DAY 3: DASHBOARD

```bash
[ ] Dashboard loads
    [ ] 3D stadium renders
    [ ] Rotating animation smooth
    [ ] No lag

[ ] Statistics cards show
    [ ] Occupancy percentage
    [ ] Visitor count
    [ ] Incidents
    [ ] Volunteers

[ ] Activity feed displays
    [ ] Recent events
    [ ] Timestamps
    [ ] Icons/colors correct
```

### ✅ DAY 4: AI COMPANION

```bash
[ ] Navigate to /dashboard/companion
[ ] Chat interface loads
[ ] Send first message
    [ ] Message appears (user bubble)
    [ ] Loading indicator shows
    [ ] AI response comes (5-10 seconds)
    [ ] Response appears (AI bubble)

[ ] Send follow-up messages
    [ ] Context remembered
    [ ] Relevant responses

[ ] Refresh page
    [ ] Chat history persists
```

### ✅ DAY 5: EMERGENCY RESPONSE

```bash
[ ] Navigate to /dashboard/incidents
[ ] Click "+ Report Incident"
[ ] Form loads
[ ] Fill form
    [ ] Select type
    [ ] Select severity
    [ ] Enter location
    [ ] Enter description
[ ] Click submit
[ ] Incident appears in list
[ ] Correct color coding
[ ] Report multiple incidents
[ ] List shows newest first
```

### ✅ DAY 6: COMPLETE WORKFLOW TEST

```bash
1. Login
2. See dashboard + 3D stadium
3. Chat with AI (ask about bathroom)
4. Report an incident
5. Check crowd data
6. Navigate (if available)
7. Logout

Expected:
- All features work smoothly
- No console errors
- No lag or freezing
- Professional appearance
```

---

## SUMMARY

**Ab aap samajh gaye:**

1. **Project kya hai** - AI-powered stadium management
2. **Kaise kaam karta hai** - Full-stack flow, APIs, database
3. **Sab features kaise hain** - 4 core features detailed
4. **Kaise local mein chotu** - Step-by-step setup
5. **Kaise test karte ho** - Feature-by-feature testing
6. **Code kaise organize** - File structure explained
7. **APIs kaise hain** - Endpoint examples

**Aab aapko:**
1. npm install karo
2. npm run dev karo
3. Features test karo
4. Code explore karo
5. Samjho aur learn karo

Koi problem ho to poocho! 🎯

