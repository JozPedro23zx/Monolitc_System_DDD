import { Sequelize } from "sequelize-typescript";
import Invoice from "../domain/invoice.entity";
import InvoiceFactoryFacade from "../factory/invoice.factory";
import InvoiceModel from "../repository/invoice.model";
import {ProductModel} from "../repository/product.model";

const product1 = {
    id: "123",
    name: "Product 1",
    price: 25
}

const product2 = {
    id: "456",
    name: "Product 2",
    price: 50
}


const input = {
    id: "12345",
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

describe("Invoice facade test", ()=>{
    let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([InvoiceModel, ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should generate invoice", async ()=>{
    const invoiceFacade = InvoiceFactoryFacade.create()

    await invoiceFacade.generate(input)

    const invoiceResultDb = await InvoiceModel.findOne({where: {name: "Roberto"}, include: ["items"]})

    expect(invoiceResultDb).toBeDefined();
    expect(invoiceResultDb.name).toBe("Roberto");
    expect(invoiceResultDb.document).toBe("XRL8");
    expect(invoiceResultDb.street).toBe("Rua 1");
    expect(invoiceResultDb.number).toBe("579");
    expect(invoiceResultDb.complement).toBe("...");
    expect(invoiceResultDb.city).toBe("The City");
    expect(invoiceResultDb.state).toBe("The State");
    expect(invoiceResultDb.zip_code).toBe("0009990");

    expect(invoiceResultDb.items[0].id).toBe(product1.id);
    expect(invoiceResultDb.items[0].name).toBe(product1.name);
    expect(invoiceResultDb.items[0].price).toBe(product1.price);

    expect(invoiceResultDb.items[1].id).toBe(product2.id);
    expect(invoiceResultDb.items[1].name).toBe(product2.name);
    expect(invoiceResultDb.items[1].price).toBe(product2.price);
  })

  it("should find a invoice", async () =>{
    const invoiceFacade = InvoiceFactoryFacade.create()

    await InvoiceModel.create({
        id: "7897",
        name: input.name,
        document: input.document,
        street: input.street,
        number: input.number,
        complement: input.complement,
        city: input.city,
        state: input.state,
        zip_code: input.zipCode,
        items: input.items.map((item) =>({
            id: item.id,
            name: item.name,
            price: item.price
        }))
    }, 
    {
        include: [{model: ProductModel}]
    })

    const invoice = await invoiceFacade.find({id: "7897"})

    expect(invoice).toBeDefined();
    expect(invoice.name).toBe("Roberto");
    expect(invoice.document).toBe("XRL8");
    expect(invoice.address.street).toBe("Rua 1");
    expect(invoice.address.number).toBe("579");
    expect(invoice.address.complement).toBe("...");
    expect(invoice.address.city).toBe("The City");
    expect(invoice.address.state).toBe("The State");
    expect(invoice.address.zipCode).toBe("0009990");

    expect(invoice.items[0].id).toBe(product1.id);
    expect(invoice.items[0].name).toBe(product1.name);
    expect(invoice.items[0].price).toBe(product1.price);

    expect(invoice.items[1].id).toBe(product2.id);
    expect(invoice.items[1].name).toBe(product2.name);
    expect(invoice.items[1].price).toBe(product2.price);
  })
})