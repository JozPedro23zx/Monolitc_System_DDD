import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../../client-adm/domain/value-object/address.value-object";
import Invoice from "../domain/invoice.entity";
import Product from "../domain/product.entity";
import InvoiceModel from "./invoice.model";
import InvoiceRepository from "./invoice.repository";
import {ProductModel} from "./product.model";


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


describe("Invoice repository unit test", ()=>{
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

  it("Should create a invoice", async () =>{
    const repository = new InvoiceRepository()
    await repository.generate(invoiceResult)
    const invoiceDb = await InvoiceModel.findOne({where: {id: invoiceResult.id.id}, include:["items"]})


    expect(invoiceDb).toBeDefined(),
    expect(invoiceDb.name).toBe(invoiceResult.name)
    expect(invoiceDb.document).toBe(invoiceResult.document)

    expect(invoiceDb.street).toBe(invoiceResult.address.street)
    expect(invoiceDb.number).toBe(invoiceResult.address.number)
    expect(invoiceDb.complement).toBe(invoiceResult.address.complement)
    expect(invoiceDb.city).toBe(invoiceResult.address.city)
    expect(invoiceDb.state).toBe(invoiceResult.address.state)
    expect(invoiceDb.zip_code).toBe(invoiceResult.address.zipCode)

    expect(invoiceDb.items[0].id).toBe(product1.id.id)
    expect(invoiceDb.items[0].name).toBe(product1.name)
    expect(invoiceDb.items[0].price).toBe(product1.price)

    expect(invoiceDb.items[1].id).toBe(product2.id.id)
    expect(invoiceDb.items[1].name).toBe(product2.name)
    expect(invoiceDb.items[1].price).toBe(product2.price)
  })

  it("Should find a invoice", async () =>{
    await InvoiceModel.create({
        id: invoiceResult.id.id,
        name: invoiceResult.name,
        document: invoiceResult.document,
        street: invoiceResult.address.street,
        number: invoiceResult.address.number,
        complement: invoiceResult.address.complement,
        city: invoiceResult.address.city,
        state: invoiceResult.address.state,
        zip_code: invoiceResult.address.zipCode,
        items: invoiceResult.items.map((item) =>({
            id: item.id.id,
            name: item.name,
            price: item.price
        }))
    }, 
    {
        include: [{model: ProductModel}]
    }
    )

    const repository = new InvoiceRepository
    const invoice = await repository.find(invoiceResult.id.id)

    expect(invoice).toBeDefined(),
    expect(invoice.name).toBe(invoiceResult.name)
    expect(invoice.document).toBe(invoiceResult.document)

    expect(invoice.address.street).toBe(invoiceResult.address.street)
    expect(invoice.address.number).toBe(invoiceResult.address.number)
    expect(invoice.address.complement).toBe(invoiceResult.address.complement)
    expect(invoice.address.city).toBe(invoiceResult.address.city)
    expect(invoice.address.state).toBe(invoiceResult.address.state)
    expect(invoice.address.zipCode).toBe(invoiceResult.address.zipCode)

    expect(invoice.items[0].id.id).toBe(product1.id.id)
    expect(invoice.items[0].name).toBe(product1.name)
    expect(invoice.items[0].price).toBe(product1.price)

    expect(invoice.items[1].id.id).toBe(product2.id.id)
    expect(invoice.items[1].name).toBe(product2.name)
    expect(invoice.items[1].price).toBe(product2.price)
  })
})