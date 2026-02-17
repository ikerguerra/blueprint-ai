import 'dotenv/config'
import { POST } from '../src/app/api/chat/route'

async function main() {
  const tenantId = 'test-tenant-retrieval'
  const query = 'What is Blueprint AI?'

  console.log(`💬 Sending chat request: "${query}"...`)

  const req = new Request('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: query }],
      tenantId,
    }),
  })

  const res = await POST(req)

  if (!res.ok) {
    console.error('❌ API Error:', res.status, await res.text())
    return
  }

  console.log('✅ Response received (streaming):')

  // Simple stream reader
  const reader = res.body?.getReader()
  const decoder = new TextDecoder()

  if (!reader) return

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const chunk = decoder.decode(value)
    process.stdout.write(chunk)
  }
  console.log('\n\n🏁 Stream finished.')
}

main()
