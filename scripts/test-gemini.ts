import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

dotenv.config()

async function main() {
  console.log('Testing Google Gemini API...')
  try {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error('GOOGLE_API_KEY is missing')
    }
    console.log('Key length: ' + process.env.GOOGLE_API_KEY.length)

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
    // Try generation model to debug
    console.log('\n👉 Trying generation model: gemini-1.5-flash...')
    try {
      const modelGen = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
      const resultGen = await modelGen.generateContent('Hello')
      console.log(
        `✅ Success with gemini-1.5-flash! Response: ${resultGen.response.text()}`
      )
    } catch (e: unknown) {
      console.log(`❌ Failed with gemini-1.5-flash`)
      if (e instanceof Error) console.log(`   Error: ${e.message}`)
    }

    const modelsToTry = [
      'models/text-embedding-004',
      'text-embedding-004',
      'models/embedding-001',
    ]

    for (const modelName of modelsToTry) {
      console.log(`\n👉 Trying model: ${modelName}...`)
      try {
        const model = genAI.getGenerativeModel({ model: modelName })
        const result = await model.embedContent('Test string')
        console.log(`✅ Success with ${modelName}!`)
        console.log('   Vector length:', result.embedding.values.length)
        return // Exit on first success
      } catch (e: unknown) {
        console.log(`❌ Failed with ${modelName}`)
        if (e instanceof Error) console.log(`   Error: ${e.message}`)
      }
    }
    throw new Error('All models failed.')
  } catch (error: unknown) {
    console.error('\n💥 Final Error:')
    if (error instanceof Error) console.error(error.message)
    process.exit(1)
  }
}

main()
