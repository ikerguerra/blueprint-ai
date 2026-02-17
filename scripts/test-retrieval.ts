// Script to test semantic retrieval
// Usage: npx tsx scripts/test-retrieval.ts

// Need to register ts-node or use tsx to run having imports
// We'll assume the user runs with `npx tsx` which handles imports/env

import 'dotenv/config'
import { searchSimilarChunks } from '../src/lib/ai/retrieval'
import prisma from '../src/lib/prisma'
import { embeddings } from '../src/lib/ai/embedding'

async function main() {
  const tenantId = 'test-tenant-retrieval'
  const query = 'What is Blueprint AI?'

  console.log(`🧹 Cleaning up old test data for tenant: ${tenantId}...`)
  // Clean up previous test data
  await prisma.document.deleteMany({
    where: { tenantId },
  })

  console.log('🌱 Seeding test data...')
  const text =
    'Blueprint AI is a multi-tenant SaaS platform for semantic document search.'

  // Create document
  const doc = await prisma.document.create({
    data: {
      filename: 'test-doc.txt',
      content: text,
      tenantId,
    },
  })

  // Generate embedding manually for seed
  const embedding = await embeddings.embedQuery(text)
  const embeddingString = `[${embedding.join(',')}]`

  // Insert chunk
  await prisma.$executeRaw`
    INSERT INTO "document_chunks" (id, content, metadata, "document_id", "tenant_id", embedding, "created_at")
    VALUES (gen_random_uuid(), ${text}, ${JSON.stringify({ source: 'test' })}::jsonb, ${doc.id}::uuid, ${tenantId}, ${embeddingString}::vector, NOW());
  `

  console.log(`🔍 Searching for: "${query}"...`)
  const results = await searchSimilarChunks(query, tenantId)

  console.log('📊 Results:')
  if (results.length === 0) {
    console.log('❌ No results found.')
  } else {
    results.forEach((r, i) => {
      console.log(`   ${i + 1}. [${r.similarity.toFixed(4)}] ${r.content}`)
    })
    console.log('✅ Retrieval Test Passed!')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
