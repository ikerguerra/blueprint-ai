import { NextRequest, NextResponse } from 'next/server'
import { parseFile, splitText } from '@/lib/ingestion/loader'
import { embeddings } from '@/lib/ai/embedding'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const tenantId = formData.get('tenantId') as string // For MVP, pass basic tenantId

    if (!file || !tenantId) {
      return NextResponse.json(
        { error: 'Missing file or tenantId' },
        { status: 400 }
      )
    }

    const text = await parseFile(file)
    const chunks = await splitText(text)

    // Create Document record
    const document = await prisma.document.create({
      data: {
        filename: file.name,
        tenantId: tenantId,
        content: text, // Optional: store full text
      },
    })

    // Process chunks and embeddings
    const chunksWithEmbeddings = await Promise.all(
      chunks.map(async (chunk) => {
        const embedding = await embeddings.embedQuery(chunk.content)
        return {
          content: chunk.content,
          metadata: chunk.metadata ?? {},
          documentId: document.id,
          tenantId: tenantId,
          embedding: embedding, // We need to handle this because Prisma doesn't support vector type directly in createMany easily without raw SQL or checking extension support
        }
      })
    )

    // Prisma doesn't support writing to vector column directly via createMany normally in standard client unless Typed?
    // With 'postgresqlExtensions', maybe?
    // Using $executeRaw is safer for pgvector for now, or ensure Prisma client supports it.
    // Actually, Prisma 5.x supports vector if mapped to Unsupported?
    // My schema has: embedding Unsupported("vector(1536)")?
    // So I cannot use create/createMany to write to it directly via JS object API easily.
    // I must use $executeRaw for insertion of vectors.

    // Strategy: Insert chunks without vectors first? No, cleaner to insert with vectors.
    // Or insert using create() on each (slow) with dbgenerated? No, invalid.

    // Best approach for pgvector in Prisma: use $executeRaw.

    for (const chunk of chunksWithEmbeddings) {
      // Prisma's $executeRaw properly handles template literals for safe parameterization
      // We pass the string representation of the vector, requiring a cast to ::vector in SQL
      const embeddingString = `[${chunk.embedding.join(',')}]`
      await prisma.$executeRaw`
        INSERT INTO "document_chunks" (id, content, metadata, "document_id", "tenant_id", embedding, "created_at")
        VALUES (gen_random_uuid(), ${chunk.content}, ${JSON.stringify(chunk.metadata)}::jsonb, ${chunk.documentId}::uuid, ${chunk.tenantId}, ${embeddingString}::vector, NOW());
      `
    }

    return NextResponse.json({ success: true, documents: chunks.length })
  } catch (error: unknown) {
    console.error('Ingestion error:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
