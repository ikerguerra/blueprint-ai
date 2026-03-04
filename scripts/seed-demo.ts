import fs from 'fs'
import path from 'path'
import { PrismaClient } from '@prisma/client'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import { splitText } from '../src/lib/ingestion/loader'
import { embeddings } from '../src/lib/ai/embedding'

// To handle ESM module imports
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

// Config environment variables
dotenv.config({ path: path.join(rootDir, '.env.local') })
dotenv.config({ path: path.join(rootDir, '.env') })

const prisma = new PrismaClient()

async function seedDemoDoc() {
  console.log('🌱 Starting Demo Seeder...')

  let defaultUser = null
  try {
    defaultUser = await prisma.user.findFirst({
      where: { email: 'demo@blueprintai.com' },
    })
  } catch (e: unknown) {
    const error = e as Error
    console.error('❌ Error fatal de Prima al iniciar BD:', error.message)
    process.exit(1)
  }

  if (!defaultUser) {
    console.warn(
      '❌ User demo@blueprintai.com no encontrado en la BD local de Prisma.'
    )
    console.warn(
      '👉 Asegúrate de registrarte primero a través de la interfaz web usando demo@blueprintai.com y la contraseña "Demo1234!".'
    )
    process.exit(1)
  }

  const tenantId = defaultUser.tenantId || defaultUser.id
  console.log(`✅ Tenant encontrado: ${tenantId}`)

  let fullDocText = ''
  try {
    const readmePath = path.join(rootDir, 'README.md')
    fullDocText += fs.readFileSync(readmePath, 'utf8') + '\n\n'
  } catch {
    console.log('No se pudo leer README.md')
  }

  try {
    const archPath = path.join(rootDir, 'docs', 'architecture.md')
    fullDocText += fs.readFileSync(archPath, 'utf8') + '\n\n'
  } catch {
    console.log('No se pudo leer docs/architecture.md')
  }

  if (!fullDocText) {
    console.error('❌ No se encontró texto para indexar.')
    process.exit(1)
  }

  console.log('🔄 Extrayendo y dividiendo texto...')
  const chunks = await splitText(fullDocText)

  console.log(
    `Documento dividido en ${chunks.length} fragmentos. Generando embeddings...`
  )

  const document = await prisma.document.create({
    data: {
      filename: 'Documentacion_BlueprintAI.txt',
      tenantId: tenantId,
      content: fullDocText,
    },
  })

  // Use the imported embeddings static instance

  for (const chunk of chunks) {
    const embedding = await embeddings.embedQuery(chunk.content)

    const embeddingString = `[${embedding.join(',')}]`
    await prisma.$executeRaw`
              INSERT INTO "document_chunks" (id, content, metadata, "document_id", "tenant_id", embedding, "created_at")
              VALUES (gen_random_uuid(), ${chunk.content}, ${JSON.stringify(chunk.metadata)}::jsonb, ${document.id}::uuid, ${tenantId}, ${embeddingString}::vector, NOW());
            `
  }

  console.log('🎉 Documento insertado con éxito localmente!')
}

seedDemoDoc()
