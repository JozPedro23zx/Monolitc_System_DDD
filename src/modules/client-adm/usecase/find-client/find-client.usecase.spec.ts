import Id from "../../../@shared/domain/value-object/id.value-object";
import Client from "../../domain/client.entity";
import Address from "../../domain/value-object/address.value-object";
import FindClientUseCase from "./find-client.usecase";

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
  document: "document 1",
  address: address,
});

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(client)),
  };
};

describe("find clientk usecase unit test", () => {
  it("should find a client", async () => {
    const repository = MockRepository();
    const usecase = new FindClientUseCase(repository);

    const input = {
      id: "1",
    };

    const result = await usecase.execute(input);

    expect(repository.find).toHaveBeenCalled();
    expect(result.id).toBe(input.id);
    expect(result.name).toBe(client.name);
    expect(result.email).toBe(client.email);
    expect(result.document).toBe("document 1");
    expect(result.address.street).toBe("Rua 1");
    expect(result.address.number).toBe("579");
    expect(result.address.complement).toBe("...");
    expect(result.address.city).toBe("The City");
    expect(result.address.state).toBe("The State");
    expect(result.address.zipCode).toBe("0009990");
  });
});
