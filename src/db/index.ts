import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Cria o pool de conexões com o banco PostgreSQL via variável de ambiente
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Instância do Drizzle ORM com o schema definido
export const db = drizzle(pool, { schema });
