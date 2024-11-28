import { PrismaClient } from "@prisma/client";

let prisma = new PrismaClient();

export * from "@prisma/client";
export { prisma };
