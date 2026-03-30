import type { ViaCepResponse } from "../modules/users/users.types";

// Resultado formatado retornado pelo serviço ViaCEP
interface AddressResult {
  cep: string;
  city: string;
  state: string;
}

export const ViaCepService = {
  // Busca o endereço de um CEP na API ViaCEP
  async fetchAddress(rawCep: string): Promise<AddressResult> {
    // Remove pontos e hífens do CEP antes de chamar a API
    const cep = rawCep.replace(/[.\-]/g, "");

    let data: ViaCepResponse;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      data = (await response.json()) as ViaCepResponse;
    } catch {
      // Lança erro caso o fetch falhe
      throw new Error("CEP inválido");
    }

    // Lança erro se a API retornar o campo `erro`
    if (data.erro) {
      throw new Error("CEP inválido");
    }

    return {
      cep: rawCep,
      city: data.localidade,
      state: data.uf,
    };
  },
};
