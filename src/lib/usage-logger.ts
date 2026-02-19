import prisma from '@/lib/prisma'

interface TokenUsageParams {
  tenantId: string
  model: string
  inputTokens: number
  outputTokens: number
}

export async function logTokenUsage({
  tenantId,
  model,
  inputTokens,
  outputTokens,
}: TokenUsageParams) {
  try {
    const totalTokens = inputTokens + outputTokens
    await prisma.tokenUsage.create({
      data: {
        tenantId,
        model,
        inputTokens,
        outputTokens,
        totalTokens,
      },
    })
    console.log(
      `📊 Validated token usage for tenant ${tenantId}: ${totalTokens} tokens`
    )
  } catch (error) {
    console.error('❌ Error logging token usage:', error)
    // We don't want to fail the request if logging fails, just log the error
  }
}
