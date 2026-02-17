import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

dotenv.config()

async function main() {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)
  const modelName = 'models/gemini-embedding-001'
  console.log(`Checking dimensions for ${modelName}...`)

  try {
    const model = genAI.getGenerativeModel({ model: modelName })
    const result = await model.embedContent('Test string')
    const dims = result.embedding.values.length
    console.log(`Dimensions: ${dims}`)
  } catch (e: unknown) {
    if (e instanceof Error) console.error('Error:', e.message)
  }
}

main()
