import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'

export type Chunk = {
  content: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: Record<string, any>
}

export async function parsePdf(buffer: Buffer): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdf = require('pdf-parse')
  const data = await pdf(buffer)
  return data.text
}

export async function splitText(
  text: string,
  chunkSize = 1000,
  chunkOverlap = 200
): Promise<Chunk[]> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap,
  })

  const output = await splitter.createDocuments([text])

  return output.map((doc) => ({
    content: doc.pageContent,
    metadata: doc.metadata,
  }))
}
