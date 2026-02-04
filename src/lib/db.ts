import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const connectionString =
    process.env.DATABASE_URL ??
    "postgresql://postgres:postgres@localhost:5432/finances_app?schema=public";

  // Serverless (e.g. Vercel) + ngrok tunnel: pg may try SSL for non-localhost and fail.
  // Use plain TCP (ssl: false) and a longer timeout for tunneled connections.
  const isTunnel =
    connectionString.includes("ngrok") || connectionString.includes("tcp.ngrok");
  const poolConfig: { connectionString: string; ssl?: false; connectionTimeoutMillis?: number } = {
    connectionString,
    ...(isTunnel && {
      ssl: false,
      connectionTimeoutMillis: 15000,
    }),
  };

  const adapter = new PrismaPg(poolConfig);
  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
