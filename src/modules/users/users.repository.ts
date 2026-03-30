import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schema";

// Tipo inferido do schema para inserção de usuário
type NewUser = typeof users.$inferInsert;

// Tipo inferido do schema para atualização parcial (sem id e created_at)
type UpdateUser = Partial<Omit<NewUser, "id" | "created_at">>;

export const UsersRepository = {
  // Insere um novo usuário e retorna o registro criado
  async create(data: Omit<NewUser, "id" | "created_at">) {
    const [created] = await db.insert(users).values(data).returning();
    return created;
  },

  // Retorna todos os usuários cadastrados
  async findAll() {
    return db.select().from(users);
  },

  // Retorna um usuário pelo id ou undefined se não encontrado
  async findById(id: number) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  },

  // Atualiza campos parciais do usuário e retorna o registro atualizado
  async update(id: number, data: UpdateUser) {
    const [updated] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return updated;
  },

  // Remove o usuário pelo id e retorna true se deletado com sucesso
  async delete(id: number): Promise<boolean> {
    const result = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({ id: users.id });
    return result.length > 0;
  },
};
