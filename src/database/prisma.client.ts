import { PrismaClient } from "@prisma/client";

interface GlobalForPrisma {
  prisma: PrismaClient | null;
}

declare global {
  // eslint-disable-next-line no-var
  var globalForPrisma: GlobalForPrisma | undefined;
}

class DatabaseClient {
  private static instance: PrismaClient;

  private constructor() {}

  public static getInstance(): PrismaClient {
    if (!DatabaseClient.instance) {
      const globalForPrisma = (global as typeof globalThis & { globalForPrisma?: GlobalForPrisma })
        .globalForPrisma || { prisma: null };

      DatabaseClient.instance = globalForPrisma.prisma || new PrismaClient();

      if (process.env["NODE_ENV"] !== "production") {
        (global as typeof globalThis & { globalForPrisma: GlobalForPrisma }).globalForPrisma = {
          prisma: DatabaseClient.instance,
        };
      }
    }

    return DatabaseClient.instance;
  }

  public static async disconnect(): Promise<void> {
    if (DatabaseClient.instance) {
      await DatabaseClient.instance.$disconnect();
    }
  }
}

export const prisma = DatabaseClient.getInstance();
export default DatabaseClient;
