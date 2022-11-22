import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", ()=>{
    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });
    
    afterAll(async () => {
        await sequelize.close();
      });
    

    it("should add order", async()=>{
        const clientResponse = await request(app).post("/client").send({
            name: "Roberto",
            email: "x@x.com",
            document: "XRL8",
            street: "Rua 1",
            number: "579",
            complement: "...",
            city: "The City",
            state: "The State",
            zipCode: "0009990",
        });

        const product1Response = await request(app).post("/product").send({
            name: "Product 1",
            description: "Description of Product 1",
            purchasePrice: 10,  
            stock: 23
        })

        const product2Response = await request(app).post("/product").send({
            name: "Product 2",
            description: "Description of Product 2",
            purchasePrice: 40,  
            stock: 5
        })

        const productsId = [{productId: product1Response.body.id}, {productId: product2Response.body.id}]

        const checkoutResponse = await request(app).post("/checkout").send({
            clientId: clientResponse.body.id,
            products: productsId
        })

        expect(checkoutResponse.status).toBe(200)
        expect(checkoutResponse.body.total).toBeDefined();
        expect(checkoutResponse.body.products[0].productId).toBe(product1Response.body.id);
        expect(checkoutResponse.body.products[1].productId).toBe(product2Response.body.id);
    })
})