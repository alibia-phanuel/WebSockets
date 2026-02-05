import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http"; // ✅ CORRECTION du typo
import { neon } from "@neondatabase/serverless"; // ✅ Import manquant

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql);
