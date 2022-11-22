import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Address from "../domain/value-object/address.value-object";
import { ClientModel } from "./client.model";
import ClientRepository from "./client.repository";

describe("ClientRepository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ClientModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a client", async () => {
    const address = new Address({
      street: "Rua 1",
      number: "579",
      complement: "...",
      city: "The City",
      state: "The State",
      zipCode: "0009990"
    });    
  
    const client = new Client({
      id: new Id("1"),
      name: "Client 1",
      email: "x@x.com",
      document: "XRL8",
      address: address,
    });

    const repository = new ClientRepository();
    await repository.add(client);

    const clientDb = await ClientModel.findOne({
      where: { id: client.id.id },
    });

    expect(clientDb).toBeDefined();
    expect(clientDb.id).toBe(client.id.id);
    expect(clientDb.name).toBe(client.name);
    expect(clientDb.email).toBe(client.email);
    expect(clientDb.document).toBe(client.document);

    expect(client.address.street).toBe(clientDb.street)
    expect(client.address.number).toBe(clientDb.number)
    expect(client.address.complement).toBe(clientDb.complement)
    expect(client.address.city).toBe(clientDb.city)
    expect(client.address.state).toBe(clientDb.state)
    expect(client.address.zipCode).toBe(clientDb.zip_code)
  });

  it("should find a client", async () => {
    const address = new Address({
      street: "Rua 1",
      number: "579",
      complement: "...",
      city: "The City",
      state: "The State",
      zipCode: "0009990"
    });

    const client = new Client({
      id: new Id("1"),
      name: "Client 1",
      email: "x@x.com",
      document: "XRL8",
      address: address,
    });

    const repository = new ClientRepository();
    await repository.add(client);

    const result = await repository.find("1");

    expect(result).toBeDefined();
    expect(result.id.id).toBe(client.id.id);
    expect(result.name).toBe(client.name);
    expect(result.email).toBe(client.email);
    expect(result.document).toBe(client.document);

    expect(result.address.street).toBe("Rua 1");
    expect(result.address.number).toBe("579");
    expect(result.address.complement).toBe("...");
    expect(result.address.city).toBe("The City");
    expect(result.address.state).toBe("The State");
    expect(result.address.zipCode).toBe("0009990");
  });
});
