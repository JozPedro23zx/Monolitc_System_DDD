import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import { ClientModel } from "../../client-adm/repository/client.model";
import { ProductCatalogModel as ProductCatalogModel} from "../../store-catalog/repository/product.model";
import { ProductAdmModel } from "../../product-adm/repository/product.model";
import Client from "../domain/client.entity";
import Product from "../domain/product.entity";
import CheckoutFactoryFacade from "../factory/checkout.factory.facade";
import OrderModel from "../repository/order.model";
import Address from "../domain/value-object/address.value-object";
import InvoiceModel from "../../invoice/repository/invoice.model";
import { ProductModel } from "../../invoice/repository/product.model";
import OrderItemsModel from "../repository/order.items.model";

describe("Checkout facade unity test", ()=>{
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ClientModel, OrderModel, OrderItemsModel, ProductCatalogModel, ProductAdmModel, ProductModel , InvoiceModel]);
    await sequelize.sync();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("Should add and return a Order", async ()=>{
    const address = new Address({
      street: "Rua 1",
      number: "579",
      complement: "...",
      city: "The City",
      state: "The State",
      zipCode: "0009990"
    });   

    const client = new Client({
        id: new Id("001"),
        name: "client",
        email: "email@email.com",
        document: "XRL8",
        address: address
    });

    const product1 = new Product({
        id: new Id("123"),
        name: "Product 1",
        description: "Description of Product 1",
        salesPrice: 200
    });

    const product2 = new Product({
        id: new Id("456"),
        name: "Product 2",
        description: "Description of Product 2",
        salesPrice: 400
    });


    await ClientModel.create({
        id: client.id.id,
        name: client.name,
        email: client.email,
        document: client.document,
        street: client.address.street,
        number: client.address.number,
        complement: client.address.complement,
        city: client.address.city,
        state: client.address.state,
        zip_code: client.address.zipCode,
        createdAt: client.createdAt,
        updatedAt: client.updatedAt
    });

    await ProductCatalogModel.create({
        id: product1.id.id,
        name: product1.name,
        description: product1.description,
        salesPrice: product1.salesPrice,
    });

    await ProductCatalogModel.create({
        id: product2.id.id,
        name: product2.name,
        description: product2.description,
        salesPrice: product2.salesPrice
    });

    await ProductAdmModel.create({
        id: product1.id.id,
        name: product1.name,
        description: product1.description,
        purchasePrice: product1.salesPrice,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date()
    });

    await ProductAdmModel.create({
        id: product2.id.id,
        name: product2.name,
        description: product2.description,
        purchasePrice: product2.salesPrice,
        stock: 30,
        createdAt: new Date(),
        updatedAt: new Date()
    });

    const checkoutFacate = CheckoutFactoryFacade.create();

    const result = await checkoutFacate.addOrder({
        clientId: client.id.id,
        products: [{productId: product1.id.id}, {productId: product2.id.id}]
    });

    expect(result).toBeDefined();
    expect(result.total).toBeDefined();
    expect(result.products[0].productId).toBe(product1.id.id);
    expect(result.products[1].productId).toBe(product2.id.id);
  })
})