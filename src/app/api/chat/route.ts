import { google } from '@ai-sdk/google'
import { streamText, convertToCoreMessages } from 'ai'
import { constructPrompt, SYSTEM_PROMPT } from '@/lib/ai/generation'
import { searchSimilarChunks } from '@/lib/ai/retrieval'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, tenantId } = await req.json()

  if (!tenantId) {
    return new Response('Missing tenantId', { status: 400 })
  }

  // Get the last user message
  const lastMessage = messages[messages.length - 1]
  const query = lastMessage.content

  // 1. Retrieve relevant context
  try {
    console.log(`🔍 Searching for context: "${query}" (Tenant: ${tenantId})`)
    const contextChunks = await searchSimilarChunks(query, tenantId)

    const contextText = contextChunks.map((c) => c.content)
    console.log(`📄 Found ${contextChunks.length} chunks.`)

    // 2. Construct the full system prompt with context
    // We don't put context in system prompt usually with Vercel AI SDK,
    // but we can inject it as a system message or user message augmentation.
    // Here we will augment the last user message for RAG.

    const promptWithContext = constructPrompt(query, contextText)

    // Replace the last user message content with the augmented prompt
    // But keep the history intact
    const coreMessages = convertToCoreMessages(messages)
    const lastCoreMessage = coreMessages[coreMessages.length - 1]

    if (lastCoreMessage.role === 'user') {
      lastCoreMessage.content = promptWithContext
    }

    console.log('🌊 Starting streamText...')
    // 3. Stream the response
    const result = await streamText({
      model: google('gemini-2.0-flash-lite-preview-02-05'),
      system: SYSTEM_PROMPT,
      messages: coreMessages,
    })

    console.log('✅ Stream initiated.')
    return result.toDataStreamResponse()
  } catch (err: unknown) {
    console.error('❌ Error in chat route:', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return new Response(message, { status: 500 })
  }
}
