import 'dotenv/config'
import { generateAnswer } from '../src/lib/ai/generation'

async function main() {
  const query = 'What are the rules?'
  const context = ['Rule 1: Always be polite.', 'Rule 2: Never give up.']

  console.log('🤖 Generating answer...')
  try {
    const answer = await generateAnswer(query, context)
    console.log('\n📄 Answer:')
    console.log(answer)

    if (answer.includes('Rule 1') && answer.includes('Rule 2')) {
      console.log('\n✅ Generation Test Passed!')
    } else {
      console.log('\n⚠️ Answer might be incomplete.')
    }
  } catch (error: unknown) {
    if (error instanceof Error) console.error('❌ Error:', error.message)
  }
}

main()
