import AddClientUseCase from "./add-client.usecase";

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn(),
  };
};

describe("Add Client usecase unit test", () => {
  it("should add a Client", async () => {
    const clientRepository = MockRepository();
    const usecase = new AddClientUseCase(clientRepository);

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
      zipCode: "0009990",
  }

    const result = await usecase.execute(input);

    expect(clientRepository.add).toHaveBeenCalled();
    expect(result.id).toBe(input.id);
    expect(result.name).toBe(input.name);
    expect(result.email).toBe(input.email);
    expect(result.document).toBe("XRL8");
    expect(result.street).toBe("Rua 1");
    expect(result.number).toBe("579");
    expect(result.complement).toBe("...");
    expect(result.city).toBe("The City");
    expect(result.state).toBe("The State");
    expect(result.zipCode).toBe("0009990");

  });
});
