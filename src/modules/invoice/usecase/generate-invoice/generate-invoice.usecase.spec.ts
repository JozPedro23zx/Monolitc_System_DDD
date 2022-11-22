import GenerateInvoiceUsecase from "./generate-invoice.usecase";

const MockRepository = () =>{
    return{
        generate: jest.fn(),
        find: jest.fn()
    }
}

describe("Generate invoice usecase unity test", ()=>{
    it("should generate a invoice", async () => {
        const invoiceRepository = MockRepository();
        const invoiceUsecase = new GenerateInvoiceUsecase(invoiceRepository)

        const product1 = {
            id: "123",
            name: "product 1",
            price: 10
        }

        const product2 = {
            id: "456",
            name: "product 2",
            price: 20
        }

        const input = {
            name: "Roberto",
            document: "XRL8",
            street: "Rua 1",
            number: "579",
            complement: "...",
            city: "The City",
            state: "The State",
            zipCode: "0009990",
            items: [product1, product2]
        }

        const invoice = await invoiceUsecase.execute(input)

        expect(invoice).toBeDefined();
        expect(invoice.name).toBe("Roberto");
        expect(invoice.document).toBe("XRL8");
        expect(invoice.street).toBe("Rua 1");
        expect(invoice.number).toBe("579");
        expect(invoice.complement).toBe("...");
        expect(invoice.city).toBe("The City");
        expect(invoice.state).toBe("The State");
        expect(invoice.zipCode).toBe("0009990");

        expect(invoice.items[0].id).toBe(product1.id);
        expect(invoice.items[0].name).toBe(product1.name);
        expect(invoice.items[0].price).toBe(product1.price);

        expect(invoice.items[1].id).toBe(product2.id);
        expect(invoice.items[1].name).toBe(product2.name);
        expect(invoice.items[1].price).toBe(product2.price);
    })
})