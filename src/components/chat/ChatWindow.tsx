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

  const [selectedModel, setSelectedModel] = useState('gemini-2.0-flash-001')
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
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md border border-gray-200">
      {/* Header with Model Selector */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
        <h2 className="text-lg font-semibold text-gray-700">
          Blueprint AI Chat
        </h2>
        <select
          value={selectedModel}
          onChange={handleModelChange}
          className="p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
          disabled={isLoading}
        >
          <option value="gemini-2.5-flash" className="text-gray-900">
            Gemini 2.5 Flash
          </option>
          <option value="gemini-2.5-flash-lite" className="text-gray-900">
            Gemini 2.5 Flash Lite (Recommended)
          </option>
          <option value="gemini-3-flash-preview" className="text-gray-900">
            Gemini 3 Flash Preview
          </option>
        </select>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !error && (
          <div className="text-center text-gray-500 mt-10">
            <div className="flex justify-center mb-4">
              <Bot size={48} className="text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              How can I help you today?
            </h3>
            <p className="text-sm">
              Ask questions about your uploaded documents.
            </p>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex items-start max-w-[80%] ${
                m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`p-2 rounded-full mx-2 ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {m.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div
                className={`p-3 rounded-lg ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
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
            <div className="flex items-center space-x-2 text-gray-500 bg-gray-50 p-3 rounded-lg">
              <Loader2 className="animate-spin" size={16} />
              <span className="text-xs">Generating response...</span>
            </div>
          </div>
        )}

        {isError && (
          <div className="flex justify-center my-4">
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-lg border border-red-200 max-w-[90%]">
              <AlertCircle size={24} className="flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold">Error al generar respuesta</p>
                <p className="text-sm mt-1">{error.message}</p>
                {(error.message.includes('429') ||
                  error.message.includes('Quota') ||
                  error.message.includes('límite')) && (
                  <p className="text-xs mt-2 text-red-700 font-medium">
                    Consejo: Prueba cambiando a otro modelo usando el menú
                    desplegable de arriba.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg"
      >
        <div className="flex space-x-2">
          <input
            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            value={input}
            onChange={handleInputChange}
            placeholder="Ask a question..."
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  )
}
