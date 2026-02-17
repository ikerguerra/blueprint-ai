import dotenv from 'dotenv'

dotenv.config()

async function main() {
  console.log('Listing models for API Key...')
  if (!process.env.GOOGLE_API_KEY) {
    console.error('GOOGLE_API_KEY is missing')
    return
  }

  // Direct fetch to avoid SDK complexity for listing
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GOOGLE_API_KEY}`

  try {
    const response = await fetch(url)
    const data = await response.json()

    if (data.error) {
      console.error('API Error:', data.error)
      return
    }

    if (!data.models) {
      console.log('No models found or unexpected format.')
      console.log(JSON.stringify(data, null, 2))
      return
    }

    console.log(`Found ${data.models.length} models:`)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.models.forEach((m: any) => {
      console.log(`- ${m.name} (${m.supportedGenerationMethods.join(', ')})`)
    })
  } catch (error: unknown) {
    if (error instanceof Error) console.error('Fetch error:', error.message)
  }
}

main()
