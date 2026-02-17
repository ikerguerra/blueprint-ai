import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'

export type Chunk = {
  content: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: Record<string, any>
}

// PDF parsing using pdf-parse (v1.1.1)
export async function parsePdf(buffer: Buffer): Promise<string> {
  try {
    // CRITICAL FIX: Import directly from lib to avoid index.js side-effect.
    // The main index.js has a "test mode" check (!module.parent) that triggers
    // trying to read a non-existent test file in Next.js/Webpack environments.
    // Importing the lib directly bypasses this logic.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require('pdf-parse/lib/pdf-parse.js')

    // The lib exports the function directly
    const data = await pdfParse(buffer)
    return data.text
  } catch (e) {
    console.error('PDF Parse Error', e)
    throw new Error(
      'Failed to parse PDF: ' + (e instanceof Error ? e.message : String(e))
    )
  }
}

export async function parseFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())

  // Check file type or extension
  if (
    file.type === 'application/pdf' ||
    file.name.toLowerCase().endsWith('.pdf')
  ) {
    return parsePdf(buffer)
  }

  // Default to text (UTF-8)
  return buffer.toString('utf-8')
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

  // @ts-expect-error - pdf-parse types are not perfect - Langchain types might be slightly off between versions
  const output = await splitter.createDocuments([text])

  return output.map((doc) => ({
    content: doc.pageContent,
    metadata: doc.metadata,
  }))
}
