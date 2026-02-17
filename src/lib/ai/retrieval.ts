import { embeddings } from './embedding'
import prisma from '../prisma'

export type SearchResult = {
  id: string
  content: string
  metadata: Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
  similarity: number
}

export async function searchSimilarChunks(
  query: string,
  tenantId: string,
  topK: number = 5
): Promise<SearchResult[]> {
  // 1. Generate embedding for the query
  const queryEmbedding = await embeddings.embedQuery(query)

  // 2. Format embedding as string for pgvector '[...]'
  const vectorString = `[${queryEmbedding.join(',')}]`

  // 3. Execute raw SQL query using cosine similarity (<=>)
  // We explicitly cast the parameter to vector type
  // Note: We filter by tenant_id to ensure data isolation
  const results = (await prisma.$queryRaw`
    SELECT 
      id,
      content,
      metadata,
      1 - (embedding <=> ${vectorString}::vector) as similarity
    FROM "document_chunks"
    WHERE "tenant_id" = ${tenantId}
    ORDER BY embedding <=> ${vectorString}::vector ASC
    LIMIT ${topK};
  `) as any[] // eslint-disable-line @typescript-eslint/no-explicit-any

  // 4. Map results to typed objects
  return results.map((row) => ({
    id: row.id,
    content: row.content,
    metadata: row.metadata,
    similarity: row.similarity,
  }))
}
