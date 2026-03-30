import Elysia, { t } from "elysia";
import { UsersUseCase } from "./users.usecase";
import { CreateUserBodySchema, UpdateUserBodySchema } from "./users.types";

// Plugin Elysia com todas as rotas do módulo de usuários
export const usersController = new Elysia({ prefix: "/users" })

  // POST /users — cria um novo usuário
  .post(
    "/",
    async ({ body, set }) => {
      try {
        const user = await UsersUseCase.createUser(body);
        set.status = 201;
        return user;
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === "CEP inválido") {
            set.status = 400;
            return { error: "CEP inválido" };
          }
        }
        // Loga o erro inesperado no terminal para facilitar o diagnóstico
        console.error("[POST /users]", error);
        set.status = 500;
        return { error: "Erro interno do servidor" };
      }
    },
    { body: CreateUserBodySchema }
  )

  // GET /users — lista todos os usuários
  .get("/", async ({ set }) => {
    try {
      return await UsersUseCase.getAllUsers();
    } catch (error) {
      console.error("[GET /users]", error);
      set.status = 500;
      return { error: "Erro interno do servidor" };
    }
  })

  // GET /users/:id — busca um usuário por ID
  .get(
    "/:id",
    async ({ params, set }) => {
      try {
        return await UsersUseCase.getUserById(Number(params.id));
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === "Usuário não encontrado") {
            set.status = 404;
            return { error: "Usuário não encontrado" };
          }
        }
        console.error("[GET /users/:id]", error);
        set.status = 500;
        return { error: "Erro interno do servidor" };
      }
    },
    { params: t.Object({ id: t.String() }) }
  )

  // PUT /users/:id — atualiza um usuário existente
  .put(
    "/:id",
    async ({ params, body, set }) => {
      try {
        return await UsersUseCase.updateUser(Number(params.id), body);
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === "Usuário não encontrado") {
            set.status = 404;
            return { error: "Usuário não encontrado" };
          }
          if (error.message === "CEP inválido") {
            set.status = 400;
            return { error: "CEP inválido" };
          }
        }
        console.error("[PUT /users/:id]", error);
        set.status = 500;
        return { error: "Erro interno do servidor" };
      }
    },
    {
      params: t.Object({ id: t.String() }),
      body: UpdateUserBodySchema,
    }
  )

  // DELETE /users/:id — remove um usuário
  .delete(
    "/:id",
    async ({ params, set }) => {
      try {
        return await UsersUseCase.deleteUser(Number(params.id));
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === "Usuário não encontrado") {
            set.status = 404;
            return { error: "Usuário não encontrado" };
          }
        }
        console.error("[DELETE /users/:id]", error);
        set.status = 500;
        return { error: "Erro interno do servidor" };
      }
    },
    { params: t.Object({ id: t.String() }) }
  );
