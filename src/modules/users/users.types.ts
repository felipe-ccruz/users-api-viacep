import { t, type Static } from "elysia";

// Schema e tipo do corpo da requisição para criar usuário
export const CreateUserBodySchema = t.Object({
  firstName: t.String(),
  lastName: t.String(),
  age: t.Number(),
  gender: t.String(),
  cep: t.String(),
});
export type CreateUserBody = Static<typeof CreateUserBodySchema>;

// Schema e tipo do corpo da requisição para atualizar usuário (campos opcionais)
export const UpdateUserBodySchema = t.Object({
  firstName: t.Optional(t.String()),
  lastName: t.Optional(t.String()),
  age: t.Optional(t.Number()),
  gender: t.Optional(t.String()),
  cep: t.Optional(t.String()),
});
export type UpdateUserBody = Static<typeof UpdateUserBodySchema>;

// Schema e tipo do formato de resposta com endereço aninhado
export const UserResponseSchema = t.Object({
  id: t.Number(),
  firstName: t.String(),
  lastName: t.String(),
  age: t.Number(),
  gender: t.String(),
  address: t.Object({
    cep: t.String(),
    city: t.String(),
    state: t.String(),
  }),
  createdAt: t.String(),
});
export type UserResponse = Static<typeof UserResponseSchema>;

// Schema e tipo da resposta da API ViaCEP
export const ViaCepResponseSchema = t.Object({
  cep: t.String(),
  logradouro: t.String(),
  localidade: t.String(),
  uf: t.String(),
  erro: t.Optional(t.Boolean()),
});
export type ViaCepResponse = Static<typeof ViaCepResponseSchema>;
