const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/server");
describe("Testando Rotas de Usuário", () => {
  afterAll(async () => {
    await mongoose.connection.close(); // 🔥 Fechar a conexão do MongoDB após os testes
  });

  test("Registro de usuário", async () => {
    const res = await request(app).post("/register").send({
      name: "Testeea",
      email: "testeea@email.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Usuário registrado com sucesso!");
  });
});
