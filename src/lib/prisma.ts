import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

/**
 * Safe query wrapper that catches Prisma connection errors and retries once.
 * Prevents 5xx server errors from killing Google crawl budget.
 */
export async function safeQuery<T>(
  queryFn: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await queryFn()
  } catch (error: unknown) {
    // Retry once on connection errors
    const message = error instanceof Error ? error.message : String(error)
    const isConnectionError =
      message.includes('Can\'t reach database server') ||
      message.includes('Connection refused') ||
      message.includes('Connection timed out') ||
      message.includes('prepared statement') ||
      message.includes('ECONNRESET') ||
      message.includes('socket hang up') ||
      message.includes('ETIMEDOUT')

    if (isConnectionError) {
      try {
        // Wait briefly then retry
        await new Promise((resolve) => setTimeout(resolve, 500))
        return await queryFn()
      } catch {
        console.error('[Prisma] Retry failed:', message)
        return fallback
      }
    }

    console.error('[Prisma] Query error:', message)
    return fallback
  }
}

export default prisma
