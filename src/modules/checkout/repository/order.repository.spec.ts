import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import { ClientModel } from "../../client-adm/repository/client.model";
import { ProductCatalogModel } from "../../store-catalog/repository/product.model";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import Address from "../domain/value-object/address.value-object";
import OrderItemsModel from "./order.items.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

describe("Order repository unity test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([OrderModel, OrderItemsModel, ClientModel, ProductCatalogModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("Should add a order", async ()=>{
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
        address: address,
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

    const order = new Order({
        id: new Id("1234"),
        client: client,
        products: [product1, product2]
    });


    const repository = new OrderRepository();
    await repository.addOrder(order);

    const orderDb = await OrderModel.findOne({where: {id: order.id.id}, include: ["products"]});

    

    expect(orderDb).toBeDefined();
    expect(orderDb.id).toBe(order.id.id);
    expect(orderDb.client_name).toBe(client.name)
    expect(orderDb.client_email).toBe(client.email)
    expect(orderDb.client_document).toBe(client.document)
    
    expect(orderDb.client_street).toBe("Rua 1");
    expect(orderDb.client_number).toBe("579");
    expect(orderDb.client_complement).toBe("...");
    expect(orderDb.client_city).toBe("The City");
    expect(orderDb.client_state).toBe("The State");
    expect(orderDb.client_zip_code).toBe("0009990");

    expect(orderDb.products[0].toJSON()).toStrictEqual({
        id: product1.id.id,
        name: product1.name,
        description: product1.description,
        salesPrice: product1.salesPrice,
        product_id: product1.id.id,
        order_id: orderDb.id
    });
    expect(orderDb.products[1].toJSON()).toStrictEqual({
        id: product2.id.id,
        name: product2.name,
        description: product2.description,
        salesPrice: product2.salesPrice,
        product_id: product2.id.id,
        order_id: orderDb.id
    });
    expect(orderDb.status).toBe("pending");
  })

  
  it("Should find a order", async ()=>{
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
        address: address,
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

    const order = new Order({
        id: new Id("1234"),
        client: client,
        products: [product1, product2]
    });

    await OrderModel.create({
      id: order.id.id,
      client_id: order.client.id.id,
      client_name: order.client.name,
      client_email: order.client.email,
      client_document: order.client.document,
      client_street: order.client.address.street,
      client_number: order.client.address.number,
      client_complement: order.client.address.complement,
      client_city: order.client.address.city,
      client_state: order.client.address.state,
      client_zip_code: order.client.address.zipCode,
      client_createdAt: order.client.createdAt,
      client_updatedAt: order.client.updatedAt,
      products: order.products.map((product) =>({
        id: product.id.id,
        product_id: product.id.id,
        order_id: order.id.id,
        name: product.name,
        description: product.description,
        salesPrice: product.salesPrice
      })),
      status: order.status
    },
    {
      include: [{model: OrderItemsModel}]
    })

    const repository = new OrderRepository()
    const orderDb = await repository.findOrder(order.id.id)


    expect(orderDb).toBeDefined();
    expect(orderDb.id.id).toBe(order.id.id);
    expect(orderDb.status).toBe("pending");

    expect(orderDb.client.id.id).toBe(client.id.id)
    expect(orderDb.client.name).toBe(client.name)
    expect(orderDb.client.email).toBe(client.email)
    expect(orderDb.client.document).toBe(client.document)
    
    expect(orderDb.client.address.street).toBe("Rua 1");
    expect(orderDb.client.address.number).toBe("579");
    expect(orderDb.client.address.complement).toBe("...");
    expect(orderDb.client.address.city).toBe("The City");
    expect(orderDb.client.address.state).toBe("The State");
    expect(orderDb.client.address.zipCode).toBe("0009990");
    
    expect(orderDb.products[0].id.id).toBe(product1.id.id)
    expect(orderDb.products[0].name).toBe(product1.name)
    expect(orderDb.products[0].description).toBe(product1.description)
    expect(orderDb.products[0].salesPrice).toBe(product1.salesPrice)

    expect(orderDb.products[1].id.id).toBe(product2.id.id)
    expect(orderDb.products[1].name).toBe(product2.name)
    expect(orderDb.products[1].description).toBe(product2.description)
    expect(orderDb.products[1].salesPrice).toBe(product2.salesPrice)
  })
});
