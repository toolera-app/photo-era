import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  errorFormat: "minimal",
  transactionOptions: {
    maxWait: 10000, //  10 seconds
    timeout: 15000, //  15s
  },
});

export default prisma;
