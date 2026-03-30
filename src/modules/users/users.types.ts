// Corpo da requisição para criar usuário
export interface CreateUserBody {
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  cep: string;
}

// Formato de resposta com endereço aninhado
export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  address: {
    cep: string;
    city: string;
    state: string;
  };
  createdAt: string;
}

// Resposta da API ViaCEP
export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}
