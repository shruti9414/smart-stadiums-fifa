import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

// AI Response templates (multilingual)
const AI_RESPONSES = {
  en: {
    restroom: '🚻 Restrooms are on Level 1, Section B. Fully accessible with grab bars. 2 min walk.',
    food: '🍽️ Food options: Restaurant (10 min), Fast Food (5 min), Cafe (2 min).',
    medical: '🏥 Medical Center 50m away, staffed 24/7. Press red emergency button or call 911.',
    wheelchair: '♿ Accessible seating: Sections A1-A4. Ramp access, elevators at all 4 corners.',
    parking: '🅿️ 245 parking spaces. Cost: $8/day. EV charging Level 3. Accessible Level 1.',
    transport: '🚇 Metro Line 5: 25 mins ($2.50). Express Bus 42: 35 mins ($1.50).',
    ticket: '🎫 Your seat: Premium view! Valid entire tournament. Upgrade to VIP available.',
    sustainability: '🌱 Carbon-neutral! 78% renewable energy. Public transport saves 80% carbon.',
    help: '👋 I can help with: restrooms, food, medical, wheelchair access, parking, transport, tickets!',
    default: '👋 Welcome to FIFA World Cup 2026! How can I assist you?',
  },
  hi: {
    restroom: '🚻 शौचालय Level 1, Section B में। 2 मिनट दूर।',
    food: '🍽️ खाना: रेस्तरां (10), फास्ट फूड (5), कैफे (2)।',
    medical: '🏥 चिकित्सा केंद्र 50m दूर। लाल बटन दबाएं।',
    help: '👋 मैं आपकी कैसे मदद कर सकता हूँ?',
    default: '👋 FIFA 2026 में आपका स्वागत है!',
  },
  es: {
    restroom: '🚻 Baños en Level 1, Sección B. 2 minutos a pie.',
    food: '🍽️ Opciones: Restaurante (10), Comida rápida (5), Café (2).',
    medical: '🏥 Centro médico a 50m. Presione el botón rojo.',
    help: '👋 ¿Cómo puedo ayudarte?',
    default: '👋 ¡Bienvenido a FIFA 2026!',
  },
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const body = await req.json()
    const { message, conversationId, language = 'en' } = body

    if (!message) {
      return new Response(JSON.stringify({ success: false, error: 'Message required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Get or create conversation
    let conversation
    if (conversationId) {
      conversation = await prisma.aIConversation.findUnique({
        where: { id: conversationId },
      })
    } else {
      conversation = await prisma.aIConversation.create({
        data: {
          userId: payload.userId,
          title: message.substring(0, 50),
          language,
        },
      })
    }

    if (!conversation) {
      return new Response(JSON.stringify({ success: false, error: 'Conversation not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Store user message in database
    await prisma.aIMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'user',
        content: message,
      },
    })

    // Generate AI response based on keywords
    let aiResponse = AI_RESPONSES[language as keyof typeof AI_RESPONSES]?.default || 'How can I help?'

    const lowerMessage = message.toLowerCase()
    const responses = AI_RESPONSES[language as keyof typeof AI_RESPONSES] || AI_RESPONSES.en

    if (lowerMessage.includes('restroom') || lowerMessage.includes('toilet') || lowerMessage.includes('bath')) {
      aiResponse = responses.restroom
    } else if (lowerMessage.includes('food') || lowerMessage.includes('eat') || lowerMessage.includes('restaurant')) {
      aiResponse = responses.food
    } else if (lowerMessage.includes('medical') || lowerMessage.includes('doctor') || lowerMessage.includes('emergency')) {
      aiResponse = responses.medical
    } else if (lowerMessage.includes('wheelchair') || lowerMessage.includes('accessible') || lowerMessage.includes('disability')) {
      aiResponse = responses.wheelchair
    } else if (lowerMessage.includes('parking') || lowerMessage.includes('car')) {
      aiResponse = responses.parking
    } else if (lowerMessage.includes('transport') || lowerMessage.includes('metro') || lowerMessage.includes('bus')) {
      aiResponse = responses.transport
    } else if (lowerMessage.includes('ticket') || lowerMessage.includes('seat')) {
      aiResponse = responses.ticket
    } else if (lowerMessage.includes('sustain') || lowerMessage.includes('green') || lowerMessage.includes('carbon')) {
      aiResponse = responses.sustainability
    } else if (lowerMessage.includes('help')) {
      aiResponse = responses.help
    }

    // Store AI response in database
    const aiMessage = await prisma.aIMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'assistant',
        content: aiResponse,
      },
    })

    console.log('✓ Chat message stored in database:', conversation.id)

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          conversationId: conversation.id,
          messageId: aiMessage.id,
          message: aiResponse,
          timestamp: aiMessage.createdAt,
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (err) {
    console.error('Chat error:', err)
    return new Response(JSON.stringify({ success: false, error: 'Chat failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const conversationId = req.nextUrl.searchParams.get('conversationId')

    if (!conversationId) {
      return new Response(JSON.stringify({ success: false, error: 'conversationId required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Get conversation history from database
    const messages = await prisma.aIMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    })

    return new Response(
      JSON.stringify({
        success: true,
        data: { conversationId, messages },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (err) {
    console.error('Error fetching messages:', err)
    return new Response(JSON.stringify({ success: false, error: 'Failed to fetch messages' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
