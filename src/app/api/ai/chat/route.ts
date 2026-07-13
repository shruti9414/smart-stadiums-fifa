import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')

// Stadium context for AI responses
const STADIUM_CONTEXT = {
  name: 'Lusail Stadium',
  city: 'Doha, Qatar',
  capacity: 80000,
  amenities: {
    restrooms: 'Level 1 Section B (accessible with grab bars), Level 2 Section D, Level 3 Section F',
    food: 'Food Hall A (Main), Quick Bite (5 locations), Cafe (8 locations)',
    medical: '24/7 Medical Center (East Wing), First Aid Posts (every section)',
    wheelchair: 'Sections A1-A4 with ramp access, Elevators at all 4 corners, Accessible parking Level 1',
    parking: '245 parking spaces, $8/day, EV Level 3 charging, Accessible reserved spaces',
    transport: 'Metro Line 5 (25 mins, $2.50), Express Bus 42 (35 mins, $1.50), Taxi/Uber available',
  },
}

// Multilingual system prompts
const SYSTEM_PROMPTS = {
  en: `You are an expert FIFA World Cup 2026 stadium AI assistant for ${STADIUM_CONTEXT.name} (${STADIUM_CONTEXT.capacity.toLocaleString()} capacity).
You help visitors with accurate, specific information about:
- Restroom locations and accessibility features
- Food options and dining venues
- Medical facilities and emergency procedures
- Wheelchair accessibility and accommodations for people with disabilities
- Parking, EV charging, and transportation options
- Ticket information, seating locations, and upgrades
- Sustainability initiatives and eco-friendly options
- Event schedules and live information

STADIUM CONTEXT:
- Restrooms: ${STADIUM_CONTEXT.amenities.restrooms}
- Food: ${STADIUM_CONTEXT.amenities.food}
- Medical: ${STADIUM_CONTEXT.amenities.medical}
- Wheelchair Access: ${STADIUM_CONTEXT.amenities.wheelchair}
- Parking: ${STADIUM_CONTEXT.amenities.parking}
- Transport: ${STADIUM_CONTEXT.amenities.transport}

Guidelines:
- Provide concise, actionable responses (1-2 sentences)
- Always include relevant emoji to make responses friendly
- Provide specific locations and times when available
- Prioritize accessibility and safety
- Be multilingual-aware of user's selected language
- For urgent queries (medical/security), escalate immediately`,

  hi: `आप FIFA World Cup 2026 के ${STADIUM_CONTEXT.name} स्टेडियम के लिए एक विशेषज्ञ AI सहायक हैं।
आप आगंतुकों को निम्नलिखित बातों में मदद करते हैं:
- शौचालय स्थान और पहुंचयोग्यता
- खाना और रेस्तरां विकल्प
- चिकित्सा सुविधाएं और आपातकालीन प्रक्रियाएं
- व्हीलचेयर पहुंचयोग्यता
- पार्किंग और परिवहन विकल्प
- टिकट और सीटिंग जानकारी
- स्थिरता पहल

प्रतिक्रियाएं संक्षिप्त (1-2 वाक्य) रखें, हमेशा प्रासंगिक emoji शामिल करें, और सटीक स्थान प्रदान करें।`,

  es: `Eres un asistente de IA experto del Estadio ${STADIUM_CONTEXT.name} para la Copa Mundial FIFA 2026.
Ayudas a visitantes con:
- Ubicaciones de baños y accesibilidad
- Opciones de comida
- Instalaciones médicas
- Accesibilidad para sillas de ruedas
- Estacionamiento y transporte
- Información de entradas y asientos
- Iniciativas de sostenibilidad

Proporciona respuestas concisas (1-2 oraciones), incluye emoji relevantes, y se específico con ubicaciones.`,

  fr: `Vous êtes un assistant IA expert du Stade ${STADIUM_CONTEXT.name} pour la Coupe du Monde FIFA 2026.
Vous aidez les visiteurs avec:
- Emplacements des toilettes et accessibilité
- Options alimentaires
- Services médicaux
- Accessibilité pour fauteuils roulants
- Stationnement et transport
- Billets et sièges
- Durabilité

Réponses concises (1-2 phrases), incluez des emoji pertinents, soyez spécifique sur les emplacements.`,

  ar: `أنت مساعد ذكاء اصطناعي خبير في ملعب ${STADIUM_CONTEXT.name} لكأس العالم FIFA 2026.
تساعد الزوار في:
- مواقع الحمامات والإمكانية الوصول
- خيارات الطعام
- المرافق الطبية
- إمكانية الوصول للعاجلات
- مواقف السيارات والمواصلات
- معلومات التذاكر والمقاعد
- الاستدامة

قدم ردود موجزة (1-2 جملة)، أدرج emoji ذات الصلة، وكن محددًا بشأن المواقع.`,
}

// Estimate tokens (simplified - actual token counting would use tiktoken)
function estimateTokens(messages: Array<{ role: string; content: string }>): number {
  let totalChars = 0
  for (const msg of messages) {
    totalChars += msg.content.length
  }
  return Math.ceil(totalChars / 4) // Rough estimate: 1 token ≈ 4 chars
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

    // Validate language
    const validLanguages = ['en', 'hi', 'es', 'fr', 'ar']
    const selectedLanguage = validLanguages.includes(language) ? language : 'en'

    // Get or create conversation
    let conversation
    if (conversationId) {
      conversation = await prisma.aIConversation.findUnique({
        where: { id: conversationId },
        include: { messages: { orderBy: { createdAt: 'asc' } } },
      })
    } else {
      conversation = await prisma.aIConversation.create({
        data: {
          userId: (payload as any).userId || 'visitor',
          stadiumId: 'lusail-2026', // Could be dynamic
          topic: message.substring(0, 50),
          language: selectedLanguage,
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

    // Fetch recent conversation history for context (last 5 messages)
    const recentMessages = await prisma.aIMessage.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: 'asc' },
      take: -5, // Last 5 messages
    })

    // Build message array with context
    const systemPrompt = SYSTEM_PROMPTS[selectedLanguage as keyof typeof SYSTEM_PROMPTS] || SYSTEM_PROMPTS.en

    const messagesForAI = [
      { role: 'system' as const, content: systemPrompt },
      ...recentMessages
        .filter((m) => m.id !== undefined) // Exclude current message
        .map((m) => ({
          role: (m.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
          content: m.content,
        })),
      { role: 'user' as const, content: message },
    ]

    // Estimate tokens and set max_tokens
    const estimatedInputTokens = estimateTokens(messagesForAI)
    const maxOutputTokens = Math.min(200, 4096 - estimatedInputTokens)

    // Call Google Gemini API with proper error handling
    if (!process.env.GOOGLE_AI_API_KEY) {
      throw new Error('GOOGLE_AI_API_KEY not configured. Please set it in .env')
    }

    let aiResponse: string
    let tokensUsed = 0

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

      // Build conversation history for Gemini
      const history = recentMessages
        .filter((m) => m.id !== undefined)
        .map((m) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }],
        }))

      // Start chat session with history
      const chat = model.startChat({
        history: history as any,
        generationConfig: {
          maxOutputTokens: maxOutputTokens,
          temperature: 0.7,
          topP: 0.9,
        },
      })

      // Send current message
      const result = await chat.sendMessage(message)
      const response = await result.response
      aiResponse = response.text() || '🤔 I could not generate a response. Please try again.'

      // Estimate tokens (Gemini doesn't return exact count in free tier)
      tokensUsed = Math.ceil((systemPrompt.length + message.length) / 4) + Math.ceil(aiResponse.length / 4)

      console.log(
        `✓ Gemini Response (${selectedLanguage}): ~${tokensUsed} tokens estimated`
      )
    } catch (geminiError: any) {
      console.error('Google Gemini API Error:', geminiError.message)

      // Provide helpful error message
      if (geminiError.message?.includes('API key')) {
        throw new Error('Google Gemini API key is invalid. Check GOOGLE_AI_API_KEY in .env')
      } else if (geminiError.message?.includes('429') || geminiError.message?.includes('quota')) {
        aiResponse = '⏳ API quota exceeded. Please wait a moment and try again.'
      } else {
        throw geminiError
      }
    }

    // Store AI response in database
    const aiMessage = await prisma.aIMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'assistant',
        content: aiResponse,
        tokensUsed,
      },
    })

    // Update conversation token count
    await prisma.aIConversation.update({
      where: { id: conversation.id },
      data: {
        tokenUsed: { increment: tokensUsed },
      },
    })

    console.log(`✓ Chat stored: Conv=${conversation.id}, Tokens=${tokensUsed}`)

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          conversationId: conversation.id,
          messageId: aiMessage.id,
          response: aiResponse, // Changed from 'message' to 'response' for consistency
          message: aiResponse, // Also keep 'message' for backward compatibility
          language: selectedLanguage,
          timestamp: aiMessage.createdAt,
          tokensUsed,
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (err: any) {
    console.error('Chat error:', err.message)
    return new Response(
      JSON.stringify({
        success: false,
        error: err.message || 'Chat failed',
        hint: 'Ensure GOOGLE_AI_API_KEY is set in .env file',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
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
