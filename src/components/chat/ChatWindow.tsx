'use client'

import { useChat } from '@ai-sdk/react'
import ReactMarkdown from 'react-markdown'
import { Send, User, Bot, Loader2, AlertCircle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
// import { UIMessage as Message } from 'ai'

export default function ChatWindow({ tenantId }: { tenantId: string }) {
  const { messages, status, sendMessage, error } = useChat()

  // Helper function to get message content (handles both 'content' and 'parts' formats)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getMessageContent = (message: any): string => {
    if (message.content) {
      return message.content
    }
    if (message.parts && Array.isArray(message.parts)) {
      return (
        message.parts
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((part: any) => part.type === 'text')
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((part: any) => part.text)
          .join('')
      )
    }
    return ''
  }

  const [selectedModel, setSelectedModel] = useState(
    'gemini-3.1-flash-lite-preview'
  )
  const [input, setInput] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Pass tenantId and selectedModel in the request body via the second parameter

    sendMessage(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { role: 'user', content: input } as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { body: { tenantId, model: selectedModel } } as any
    )
    setInput('')
  }

  const isLoading = status === 'submitted' || status === 'streaming'
  const isError = error != null

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, error]) // Scroll on error too

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm sm:shadow-md border border-gray-200 overflow-hidden">
      {/* Header with Model Selector */}
      <div className="p-3 sm:p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center bg-gray-50/80 gap-3 sm:gap-0">
        <h2 className="text-base sm:text-lg font-semibold text-gray-700">
          Chat de Blueprint AI
        </h2>
        <select
          value={selectedModel}
          onChange={handleModelChange}
          className="w-full sm:w-auto p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 transition-shadow"
          disabled={isLoading}
        >
          <option value="gemini-2.5-flash" className="text-gray-900">
            Gemini 2.5 Flash
          </option>
          <option
            value="gemini-3.1-flash-lite-preview"
            className="text-gray-900"
          >
            Gemini 3.1 Flash Lite Preview (Recomendado)
          </option>
          <option value="gemini-3-flash-preview" className="text-gray-900">
            Gemini 3 Flash Preview
          </option>
        </select>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
        {messages.length === 0 && !error && (
          <div className="text-center text-gray-500 mt-10">
            <div className="flex justify-center mb-4">
              <Bot size={48} className="text-blue-500" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">
              ¿En qué puedo ayudarte hoy?
            </h3>
            <p className="text-sm px-4">
              Haz preguntas sobre tus documentos subidos.
            </p>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex items-start max-w-[95%] sm:max-w-[85%] ${
                m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`p-2 rounded-full mx-1 sm:mx-2 flex-shrink-0 ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {m.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div
                className={`p-3 rounded-2xl ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-sm'
                    : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                } shadow-sm`}
              >
                <div className="prose prose-sm max-w-none break-words">
                  <ReactMarkdown>{getMessageContent(m)}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2 text-gray-500 bg-gray-50 p-3 rounded-2xl rounded-tl-sm">
              <Loader2 className="animate-spin text-blue-500" size={16} />
              <span className="text-xs sm:text-sm font-medium">
                Generando respuesta...
              </span>
            </div>
          </div>
        )}

        {isError && (
          <div className="flex justify-center my-4">
            <div className="flex items-start sm:items-center space-x-2 text-red-600 bg-red-50 p-3 sm:p-4 rounded-lg border border-red-200 max-w-[95%] sm:max-w-[90%] flex-col sm:flex-row gap-2 sm:gap-0">
              <AlertCircle
                size={20}
                className="flex-shrink-0 hidden sm:block"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 sm:space-x-0">
                  <AlertCircle size={18} className="flex-shrink-0 sm:hidden" />
                  <p className="font-semibold text-sm sm:text-base">
                    Error al generar respuesta
                  </p>
                </div>
                <p className="text-xs sm:text-sm mt-1">{error.message}</p>
                {(error.message.includes('429') ||
                  error.message.includes('Quota') ||
                  error.message.includes('límite')) && (
                  <p className="text-xs mt-2 text-red-700 font-medium bg-red-100 p-2 rounded">
                    💡 Consejo: Prueba cambiando a otro modelo usando el menú
                    desplegable de arriba.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} className="h-2" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-3 sm:p-4 border-t border-gray-200 bg-gray-50"
      >
        <div className="flex space-x-2 items-end">
          <textarea
            className="flex-1 p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 resize-none min-h-[44px] max-h-[120px] shadow-sm transition-shadow"
            value={input}
            onChange={(e) => {
              handleInputChange(
                e as unknown as React.ChangeEvent<HTMLInputElement>
              )
              // Auto-resize textarea
              e.target.style.height = 'auto'
              e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                if (input.trim()) handleSubmit(e)
              }
            }}
            placeholder="Haz una pregunta..."
            disabled={isLoading}
            rows={1}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-3 h-[44px] sm:h-[48px] bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center"
            aria-label="Enviar mensaje"
          >
            <Send size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
        <div className="text-[10px] sm:text-xs text-center text-gray-400 mt-2">
          Blueprint AI puede cometer errores. Considera verificar la información
          importante.
        </div>
      </form>
    </div>
  )
}
