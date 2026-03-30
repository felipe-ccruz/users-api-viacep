import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { usersController } from "./modules/users/users.controller";

// Instância principal da aplicação Elysia
const app = new Elysia()
  // Registra a documentação Swagger em /docs
  .use(
    swagger({
      path: "/docs",
      documentation: {
        info: {
          title: "Users API",
          version: "1.0.0",
          description: "CRUD de usuários com validação de CEP via ViaCEP",
        },
      },
    })
  )
  // Registra o controller de usuários
  .use(usersController)
  // Sobe o servidor na porta 3000
  .listen(3000);

console.log("\n\n🎎 Servidor rodando em http://localhost:3000/docs\n\n");
