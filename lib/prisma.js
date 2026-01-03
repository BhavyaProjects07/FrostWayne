import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { neonConfig } from '@neondatabase/serverless'
import ws from 'ws'

/* Neon WebSocket setup (Node.js only) */
neonConfig.webSocketConstructor = ws

/* Create Prisma Neon adapter */
const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
})

/* Prisma singleton (JS-safe) */
const globalForPrisma = globalThis

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
export { prisma }
