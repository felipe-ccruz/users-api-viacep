import { ViaCepService } from "../../external/viacep.service";
import { UsersRepository } from "./users.repository";
import type { CreateUserBody, UserResponse } from "./users.types";

// Formata um registro do banco para o padrão de resposta da API
function formatUser(user: {
  id: number;
  first_name: string;
  last_name: string;
  age: number;
  gender: string;
  cep: string;
  city: string;
  state: string;
  created_at: Date;
}): UserResponse {
  return {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    age: user.age,
    gender: user.gender,
    address: {
      cep: user.cep,
      city: user.city,
      state: user.state,
    },
    // Converte o objeto Date retornado pelo PostgreSQL para string ISO
    createdAt: user.created_at.toISOString(),
  };
}

export const UsersUseCase = {
  // Cria um novo usuário após validar o CEP via ViaCEP
  async createUser(body: CreateUserBody): Promise<UserResponse> {
    let address: { cep: string; city: string; state: string };

    try {
      address = await ViaCepService.fetchAddress(body.cep);
    } catch {
      // Propaga o erro de CEP inválido para o controller
      throw new Error("CEP inválido");
    }

    const created = await UsersRepository.create({
      first_name: body.firstName,
      last_name: body.lastName,
      age: body.age,
      gender: body.gender,
      cep: address.cep,
      city: address.city,
      state: address.state,
    });

    return formatUser(created);
  },

  // Retorna todos os usuários formatados
  async getAllUsers(): Promise<UserResponse[]> {
    const all = await UsersRepository.findAll();
    return all.map(formatUser);
  },

  // Retorna um usuário pelo id ou lança erro se não encontrado
  async getUserById(id: number): Promise<UserResponse> {
    const user = await UsersRepository.findById(id);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    return formatUser(user);
  },

  // Atualiza os campos enviados do usuário, validando o CEP se alterado
  async updateUser(
    id: number,
    body: Partial<CreateUserBody>
  ): Promise<UserResponse> {
    const existing = await UsersRepository.findById(id);

    if (!existing) {
      throw new Error("Usuário não encontrado");
    }

    // Monta os dados a serem atualizados
    const updateData: {
      first_name?: string;
      last_name?: string;
      age?: number;
      gender?: string;
      cep?: string;
      city?: string;
      state?: string;
    } = {};

    if (body.firstName !== undefined) updateData.first_name = body.firstName;
    if (body.lastName !== undefined) updateData.last_name = body.lastName;
    if (body.age !== undefined) updateData.age = body.age;
    if (body.gender !== undefined) updateData.gender = body.gender;

    // Se um novo CEP for enviado, valida via ViaCEP antes de atualizar
    if (body.cep !== undefined) {
      let address: { cep: string; city: string; state: string };

      try {
        address = await ViaCepService.fetchAddress(body.cep);
      } catch {
        throw new Error("CEP inválido");
      }

      updateData.cep = address.cep;
      updateData.city = address.city;
      updateData.state = address.state;
    }

    const updated = await UsersRepository.update(id, updateData);
    return formatUser(updated);
  },

  // Remove o usuário pelo id ou lança erro se não encontrado
  async deleteUser(id: number): Promise<{ message: string }> {
    const existing = await UsersRepository.findById(id);

    if (!existing) {
      throw new Error("Usuário não encontrado");
    }

    await UsersRepository.delete(id);

    return { message: "Usuário deletado com sucesso" };
  },
};
