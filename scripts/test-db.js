/* eslint-disable @typescript-eslint/no-require-imports */
const { Client } = require('pg')
require('dotenv').config({ path: '.env' })

async function testConnection(connectionString, name) {
  console.log(`\nTesting ${name}...`)
  if (!connectionString) {
    console.error(`❌ ${name} is missing in .env`)
    return
  }

  // Mask sensitive part for log
  const maskedUrl = connectionString.replace(/:([^:@]+)@/, ':***@')
  console.log(`Connecting to: ${maskedUrl}`)

  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }, // Supabase requires SSL, usually self-signed or CA-signed
  })

  try {
    await client.connect()
    console.log(`✅ ${name} Connection Successful!`)
    const res = await client.query('SELECT NOW()')
    console.log(`   Time from DB: ${res.rows[0].now}`)
    await client.end()
  } catch (err) {
    console.error(`❌ ${name} Failed:`)
    console.error(`   Message: ${err.message}`)
    if (err.code) console.error(`   Code: ${err.code}`)
    // Hint common errors
    if (err.code === '28P01')
      console.log(
        '   Hint: Check your password. If it has special chars like # or @ or ?, make sure they are URL encoded.'
      )
    if (err.code === '3D000') console.log('   Hint: Database does not exist.')
    if (err.errno === -4078)
      console.log(
        '   Hint: Network connection refused. Check firewall or port.'
      )
  }
}

;(async () => {
  console.log('--- Database Connection Diagnostic ---')
  await testConnection(
    process.env.DATABASE_URL,
    'DATABASE_URL (Pooling - Port 6543)'
  )
  await testConnection(
    process.env.DIRECT_URL,
    'DIRECT_URL (Direct - Port 5432)'
  )
})()
