'use client'

import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { redirect } from 'next/navigation'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

const QUICK_QUESTIONS = [
  '💬 Where are the restrooms?',
  '🍽️ Food court locations?',
  '🚑 Medical assistance',
  '🎫 Ticket information'
]

export default function CompanionPage() {
  const { token, user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkAuth = setTimeout(() => {
      const savedToken = localStorage.getItem('auth_token')
      if (!savedToken && !token) {
        redirect('/login')
      }
      setIsChecking(false)
    }, 50)
    return () => clearTimeout(checkAuth)
  }, [token])

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('companion_messages')
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages))
      } catch (error) {
        console.error('Error loading messages:', error)
      }
    }
  }, [])

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('companion_messages', JSON.stringify(messages))
    }
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input.trim()
    if (!textToSend || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend.replace(/^[^a-zA-Z0-9]+/, '').trim(), // Remove emoji
      timestamp: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: userMessage.content,
          context: { role: user?.role, language: 'en' },
        }),
      })

      if (res.ok) {
        const data = await res.json()
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.data.message || data.data.response || 'Unable to process response',
          timestamp: new Date().toISOString(),
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        const errorData = await res.json()
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `❌ Error: ${errorData.error || 'Failed to get response'}`,
          timestamp: new Date().toISOString(),
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } catch (error) {
      console.error('Chat error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900/50 to-black flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800/50 bg-black/20 backdrop-blur-xl px-8 py-6 sticky top-0 z-50">
        <h1 className="text-3xl font-bold gradient-text">AI Stadium Companion</h1>
        <p className="text-sm text-slate-400 mt-1">Intelligent stadium assistance powered by AI</p>
      </header>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-8 py-8 space-y-4 max-w-4xl mx-auto w-full">
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center text-center py-12">
            <div>
              <div className="text-7xl mb-6 opacity-80">🤖</div>
              <h2 className="text-2xl font-bold text-white mb-3">Welcome to AI Companion</h2>
              <p className="text-slate-400 max-w-md mx-auto mb-8">Ask me about navigation, facilities, accessibility, events, or any stadium-related questions. I'm here to help!</p>
              <div className="grid grid-cols-2 gap-3 mt-6">
                {QUICK_QUESTIONS.map(question => (
                  <button
                    key={question}
                    onClick={() => handleSend(question)}
                    disabled={loading}
                    className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 text-sm text-slate-300 hover:bg-slate-800/50 hover:border-yellow-500/50 transition-all cursor-pointer disabled:opacity-50 text-left font-medium"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.length > 0 && (
          <>
            {/* Quick access buttons when has messages */}
            <div className="flex justify-center gap-2 mb-4 flex-wrap">
              {QUICK_QUESTIONS.map(question => (
                <button
                  key={question}
                  onClick={() => handleSend(question)}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs text-slate-300 hover:bg-slate-800/70 hover:border-yellow-500/50 transition-all cursor-pointer disabled:opacity-50 font-medium"
                >
                  {question}
                </button>
              ))}
            </div>

            {/* Messages */}
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`rounded-2xl px-5 py-4 max-w-md backdrop-blur-sm border transition-all ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-950 rounded-br-none shadow-lg shadow-yellow-500/20 border-yellow-500/50'
                      : 'bg-gradient-to-br from-slate-800/60 to-slate-900/60 text-slate-100 rounded-bl-none border-slate-700/50 shadow-lg shadow-slate-900/30'
                  }`}
                >
                  <p className="text-sm font-medium">{msg.content}</p>
                  <p className="text-xs opacity-60 mt-2">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </>
        )}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-2xl px-5 py-4 border border-slate-700/50 rounded-bl-none shadow-lg">
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce" />
                <div className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-800/50 bg-black/20 backdrop-blur-xl px-8 py-6 sticky bottom-0">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything..."
            className="flex-1 rounded-xl bg-slate-800/50 border border-slate-700/50 px-5 py-3 text-white placeholder:text-slate-500 focus:border-yellow-500/50 focus:outline-none focus:bg-slate-800/70 transition-all backdrop-blur-sm"
            disabled={loading}
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 px-6 py-3 font-semibold text-slate-950 hover:from-yellow-400 hover:to-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
