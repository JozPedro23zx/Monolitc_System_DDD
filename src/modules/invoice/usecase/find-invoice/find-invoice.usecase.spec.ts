import Id from "../../../@shared/domain/value-object/id.value-object";
import Address from "../../../client-adm/domain/value-object/address.value-object";
import Invoice from "../../domain/invoice.entity";
import Product from "../../domain/product.entity";
import FindInvoiceUsecase from "./find-invoice.usecase";

const address = new Address({
    street: "Rua 1",
    number: "579",
    complement: "...",
    city: "The City",
    state: "The State",
    zipCode: "0009990"
});

const product1 = new Product({
    id: new Id("123"),
    name: "product 1",
    price: 10
});

const product2 = new Product({
    id: new Id("456"),
    name: "product 2",
    price: 20
});

const invoiceResult = new Invoice({
    id: new Id("12345"),
    name: "Pedro Alvares Cabral",
    document: "XRL8",
    address: address,
    items: [product1, product2],
    createdAt: new Date(),
    updatedAt: new Date()
});

const MockRepository = ()=>{
    return{
        generate: jest.fn(),
        find: jest.fn().mockResolvedValue(Promise.resolve(invoiceResult))
    }
};
describe("Find Invoice usecase unity test", ()=>{

    it("Should find a invoice", async () =>{
        const repository = MockRepository();
        const inviceUsecase = new FindInvoiceUsecase(repository)
        const invoice = await inviceUsecase.execute({id: "12345"})
        

        expect(invoice).toBeDefined();
        expect(invoice.name).toBe("Pedro Alvares Cabral");
        expect(invoice.document).toBe("XRL8");
        expect(invoice.address.street).toBe("Rua 1");
        expect(invoice.address.number).toBe("579");
        expect(invoice.address.complement).toBe("...");
        expect(invoice.address.city).toBe("The City");
        expect(invoice.address.state).toBe("The State");
        expect(invoice.address.zipCode).toBe("0009990");

        expect(invoice.items[0].id).toBe(product1.id.id);
        expect(invoice.items[0].name).toBe(product1.name);
        expect(invoice.items[0].price).toBe(product1.price);

        expect(invoice.items[1].id).toBe(product2.id.id);
        expect(invoice.items[1].name).toBe(product2.name);
        expect(invoice.items[1].price).toBe(product2.price);
    });

});