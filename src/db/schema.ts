import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// Definição da tabela de usuários no banco de dados PostgreSQL
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  first_name: text("first_name").notNull(),
  last_name: text("last_name").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  cep: text("cep").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});
