import Elysia, { t } from "elysia";
import { UsersUseCase } from "./users.usecase";

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
        // Erro inesperado
        set.status = 500;
        return { error: "Erro interno do servidor" };
      }
    },
    {
      body: t.Object({
        firstName: t.String(),
        lastName: t.String(),
        age: t.Number(),
        gender: t.String(),
        cep: t.String(),
      }),
    }
  )

  // GET /users — lista todos os usuários
  .get("/", async ({ set }) => {
    try {
      return await UsersUseCase.getAllUsers();
    } catch {
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
        set.status = 500;
        return { error: "Erro interno do servidor" };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
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
        set.status = 500;
        return { error: "Erro interno do servidor" };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        firstName: t.Optional(t.String()),
        lastName: t.Optional(t.String()),
        age: t.Optional(t.Number()),
        gender: t.Optional(t.String()),
        cep: t.Optional(t.String()),
      }),
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
        set.status = 500;
        return { error: "Erro interno do servidor" };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  );
