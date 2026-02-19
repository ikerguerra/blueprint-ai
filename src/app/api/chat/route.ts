import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { streamText } from 'ai'
import { SYSTEM_PROMPT } from '@/lib/ai/generation'

import { searchSimilarChunks } from '@/lib/ai/retrieval'
import { logTokenUsage } from '@/lib/usage-logger'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  // Extract tenantId from the body, as headers are unreliable in some environments/proxies
  const body = await req.json()

  const { messages, tenantId, model } = body
  console.log('📨 Messages:', messages.length)
  console.log('� TenantId:', tenantId)
  console.log('🤖 Requested Model:', model)

  // Validate model
  const allowedModels = [
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-3-flash-preview',
  ]
  const selectedModel = allowedModels.includes(model)
    ? model
    : 'gemini-2.5-flash'

  if (!tenantId) {
    console.error('Missing tenantId in body')
    return new Response('Missing tenantId in body', { status: 400 })
  }

  // Get the last user message
  const lastMessage = messages[messages.length - 1]
  const query = lastMessage.content

  // 1. Retrieve relevant context
  try {
    // 3. Search for context
    const contextChunks = await searchSimilarChunks(query, tenantId)

    const contextText = contextChunks.map((c) => c.content)

    // 2. Build system prompt with RAG context
    const systemPromptWithContext = `${SYSTEM_PROMPT}

RELEVANT CONTEXT FROM KNOWLEDGE BASE:
${contextText.map((text, i) => `[${i + 1}] ${text}`).join('\n\n')}

Use the above context to answer the user's question. If the context doesn't contain relevant information, say so.`

    // Normalize messages: convert 'parts' format to 'content' format
    // Normalize messages: convert 'parts' format to 'content' format
    // This is needed because toUIMessageStreamResponse() returns messages with 'parts'
    // but streamText expects 'content'
    interface MessagePart {
      type: string
      text: string
    }

    interface Message {
      role: string
      content?: string
      parts?: MessagePart[]
    }

    const normalizedMessages = messages.map((msg: Message) => {
      if (msg.content) {
        // Already has content, return as-is
        return msg
      }
      if (msg.parts && Array.isArray(msg.parts)) {
        // Extract text from parts
        const content = msg.parts
          .filter((part: MessagePart) => part.type === 'text')
          .map((part: MessagePart) => part.text)
          .join('')
        return { ...msg, content }
      }
      // Fallback: return message as-is
      return msg
    })

    console.log('🌊 Starting streamText...')

    // Get API key from environment
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    if (!apiKey) {
      throw new Error(
        'GOOGLE_GENERATIVE_AI_API_KEY environment variable is not set'
      )
    }

    // Create Google provider with explicit API key
    const google = createGoogleGenerativeAI({ apiKey })

    // 3. Stream the response - use normalized messages
    // 3. Stream the response - use normalized messages
    const result = await streamText({
      model: google(selectedModel), // Use the valid selected model
      system: systemPromptWithContext,
      messages: normalizedMessages,
      onFinish: async ({ usage }) => {
        const { inputTokens, outputTokens } = usage
        await logTokenUsage({
          tenantId,
          model: selectedModel,
          inputTokens: inputTokens || 0,
          outputTokens: outputTokens || 0,
        })
      },
    })

    return result.toUIMessageStreamResponse()
  } catch (err: unknown) {
    console.error('❌ Error in chat route:', err)

    // Check for quota/429 errors
    const errorMessage = err instanceof Error ? err.message : String(err)
    if (
      errorMessage.includes('429') ||
      errorMessage.includes('Quota') ||
      errorMessage.includes('Resource has been exhausted')
    ) {
      return new Response(
        JSON.stringify({
          error: 'Quota Exceeded',
          message:
            'You have reached the API limit for this model. Please try a different model or wait.',
        }),
        {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    return new Response(errorMessage, { status: 500 })
  }
}
