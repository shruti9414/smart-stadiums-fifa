import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { Prisma } from '@prisma/client'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    await verifyToken(token)

    const stadiumId = req.nextUrl.searchParams.get('stadiumId') || 'lusail-2026'
    const minutesAhead = parseInt(req.nextUrl.searchParams.get('minutesAhead') || '30')

    // Get recent crowd data for context
    const recentCrowd = await prisma.crowdAnalytics.findMany({
      where: { stadiumId },
      orderBy: { timestamp: 'desc' },
      take: 10,
    })

    // Get existing predictions
    const existingPredictions = await prisma.crowdPrediction.findMany({
      where: { stadiumId },
      orderBy: { predictionTime: 'desc' },
      take: 5,
    })

    // Check if we have recent predictions (within last 10 minutes)
    const lastPrediction = existingPredictions[0]
    const now = new Date()
    const timeSinceLastPrediction = lastPrediction
      ? (now.getTime() - lastPrediction.predictionTime.getTime()) / 1000 / 60
      : null

    // Use cached predictions if recent, otherwise generate new
    let predictions = []

    if (timeSinceLastPrediction !== null && timeSinceLastPrediction < 10) {
      // Use cached predictions
      predictions = existingPredictions.map((p) => ({
        time: p.predictionTime,
        occupancy: parseInt(p.occupancyPct.toString()),
        confidence: parseFloat(p.confidence.toString()),
        risks: (p.riskAlerts as Record<string, any>)?.alerts || [],
      }))
    } else {
      // Generate new predictions using Gemini AI with crowd context
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

      const crowdContext = recentCrowd.length > 0
        ? `Recent crowd data: ${recentCrowd
            .slice(0, 3)
            .map(
              (c) =>
                `${c.timestamp.toLocaleTimeString()}: ${c.occupancyPct}% occupancy`
            )
            .join(', ')}`
        : 'No recent crowd data available'

      const prompt = `You are a stadium crowd prediction AI. Based on the following context, predict the crowd occupancy for Lusail Stadium (Capacity: 80,000) for the next ${minutesAhead} minutes.

${crowdContext}

Current time: ${new Date().toLocaleTimeString()}
Stadium: Lusail Stadium, FIFA World Cup 2026
Current occupancy baseline: ${recentCrowd[0] ? recentCrowd[0].occupancyPct : 65}%

Provide predictions for:
1. ${minutesAhead} minutes ahead
2. ${minutesAhead * 2} minutes ahead
3. ${minutesAhead * 3} minutes ahead
4. ${minutesAhead * 4} minutes ahead

For each prediction, provide:
- occupancy percentage (0-100)
- confidence level (0-1)
- risk alerts (array of strings like "high_crowd", "queue_forming", etc.)

Format as JSON with array of predictions.`

      try {
        const result = await model.generateContent(prompt)
        const responseText = result.response.text()

        // Parse JSON from response
        const jsonMatch = responseText.match(/\[[\s\S]*\]/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0])
          predictions = Array.isArray(parsed) ? parsed : [parsed]

          // Store new predictions in database
          for (let i = 0; i < predictions.length; i++) {
            const pred = predictions[i]
            const predictionTime = new Date(Date.now() + (i + 1) * minutesAhead * 60000)

            await prisma.crowdPrediction.create({
              data: {
                stadiumId,
                predictionTime,
                occupancyPct: new Prisma.Decimal(
                  Math.min(99, Math.max(0, pred.occupancy || 65))
                ),
                confidence: new Prisma.Decimal(Math.min(1, Math.max(0, pred.confidence || 0.85))),
                riskAlerts: {
                  alerts: pred.risks || [],
                  timestamp: new Date().toISOString(),
                },
              },
            })
          }

          console.log(`✓ Generated ${predictions.length} crowd predictions via Gemini`)
        }
      } catch (geminiError) {
        console.error('Gemini prediction error:', geminiError)
        // Fall back to simple predictions
        predictions = [
          {
            occupancy: Math.min(99, (parseInt(recentCrowd[0]?.occupancyPct.toString() || '65') + 5)),
            confidence: 0.92,
            risks: [],
          },
          {
            occupancy: Math.min(99, (parseInt(recentCrowd[0]?.occupancyPct.toString() || '65') + 8)),
            confidence: 0.88,
            risks: ['moderate_crowd'],
          },
          {
            occupancy: Math.min(99, (parseInt(recentCrowd[0]?.occupancyPct.toString() || '65') + 3)),
            confidence: 0.85,
            risks: [],
          },
          {
            occupancy: Math.max(20, (parseInt(recentCrowd[0]?.occupancyPct.toString() || '65') - 5)),
            confidence: 0.82,
            risks: [],
          },
        ]
      }
    }

    // Format response
    const responseData = {
      stadium: 'Lusail Stadium',
      generatedAt: new Date(),
      minutesAhead,
      predictions: predictions.slice(0, 4).map((p, i) => ({
        minutesAhead: (i + 1) * minutesAhead,
        predictedOccupancy: p.occupancy,
        confidence: p.confidence,
        riskAlerts: p.risks,
        recommendation:
          p.occupancy > 85
            ? '🔴 Critical - restrict entry'
            : p.occupancy > 70
              ? '🟡 High - monitor closely'
              : '🟢 Normal - all systems go',
      })),
    }

    return new Response(JSON.stringify({ success: true, data: responseData }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    console.error('Prediction error:', err.message)
    return new Response(JSON.stringify({ success: false, error: 'Failed to generate predictions' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
