import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini Client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)
const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash-lite-preview-02-05',
})

export const SYSTEM_PROMPT = `
You are Blueprint AI, an intelligent assistant for analyzing and querying documents.
Your goal is to provide accurate, helpful answers based STRICTLY on the provided context.

Rules:
1. Use ONLY the information provided in the "Context" section to answer.
2. If the answer is not in the context, state that you don't have enough information.
3. Do not make up information.
4. Keep your answers concise and professional.
5. Format your response in Markdown.
`

export function constructPrompt(
  query: string,
  contextChunks: string[]
): string {
  const contextBlock = contextChunks.join('\n\n---\n\n')

  return `
Context:
${contextBlock}

Question: 
${query}

Answer:
`
}

export async function generateAnswer(query: string, contextChunks: string[]) {
  const prompt = `
${SYSTEM_PROMPT}

${constructPrompt(query, contextChunks)}
`

  const result = await model.generateContent(prompt)
  return result.response.text()
}
