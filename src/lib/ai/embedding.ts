import { Embeddings, EmbeddingsParams } from '@langchain/core/embeddings'
import { GoogleGenerativeAI } from '@google/generative-ai'

export class GeminiEmbeddings extends Embeddings {
  private client: GoogleGenerativeAI
  private model: string

  constructor(fields?: EmbeddingsParams & { apiKey?: string; model?: string }) {
    super(fields ?? {})
    const apiKey = fields?.apiKey || process.env.GOOGLE_GENERATIVE_AI_API_KEY
    if (!apiKey) {
      throw new Error('Google API key not found')
    }
    this.client = new GoogleGenerativeAI(apiKey)
    this.model = fields?.model || 'text-embedding-004'
  }

  async embedDocuments(documents: string[]): Promise<number[][]> {
    const model = this.client.getGenerativeModel({ model: this.model })
    const embeddings: number[][] = []

    // Gemini has batch limits, but for simplicity we iterate.
    // In production, batching is recommended.
    for (const doc of documents) {
      const result = await model.embedContent(doc)
      embeddings.push(result.embedding.values)
    }
    return embeddings
  }

  async embedQuery(document: string): Promise<number[]> {
    const model = this.client.getGenerativeModel({ model: this.model })
    const result = await model.embedContent(document)
    return result.embedding.values
  }
}

export const embeddings = new GeminiEmbeddings({
  model: 'models/gemini-embedding-001',
})
