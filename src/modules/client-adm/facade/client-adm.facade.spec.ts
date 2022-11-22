import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import ClientAdmFacadeFactory from "../factory/facade.factory";
import ProductAdmFacadeFactory from "../factory/facade.factory";
import { ClientModel } from "../repository/client.model";
import ClientAdmFacade from "./client-adm.facade";

describe("ClientAdmFacade test", () => {
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
    const facade = ClientAdmFacadeFactory.create();

    const input = {
      id: "12345",
      name: "Roberto",
      email: "x@x.com",
      document: "XRL8",
      street: "Rua 1",
      number: "579",
      complement: "...",
      city: "The City",
      state: "The State",
      zipCode: "0009990"
  }
    await facade.add(input);

    const client = await ClientModel.findOne({ where: { id: "12345" } });

    expect(client).toBeDefined();
    expect(client.name).toBe(input.name);
    expect(client.email).toBe(input.email);
    expect(client.document).toBe("XRL8");
    expect(client.street).toBe("Rua 1");
    expect(client.number).toBe("579");
    expect(client.complement).toBe("...");
    expect(client.city).toBe("The City");
    expect(client.state).toBe("The State");
    expect(client.zip_code).toBe("0009990");
  });

  it("it should find a client", async () => {
    const facade = ClientAdmFacadeFactory.create();

    const input = {
      id: "1",
      name: "Client 1",
      email: "x@x.com",
      document: "XRL8",
      street: "Rua 1",
      number: "579",
      complement: "...",
      city: "The City",
      state: "The State",
      zipCode: "0009990"
    };

    await facade.add(input);

    const client = await facade.find({ id: "1" });

    expect(client).toBeDefined();
    expect(client.id).toBe(input.id);
    expect(client.name).toBe(input.name);
    expect(client.email).toBe(input.email);
    expect(client.document).toBe("XRL8");
    expect(client.address.street).toBe("Rua 1");
    expect(client.address.number).toBe("579");
    expect(client.address.complement).toBe("...");
    expect(client.address.city).toBe("The City");
    expect(client.address.state).toBe("The State");
    expect(client.address.zipCode).toBe("0009990");
  });
});
