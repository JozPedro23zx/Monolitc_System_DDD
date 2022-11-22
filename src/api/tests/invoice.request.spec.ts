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


        const invoiceResponse = await request(app).post(`/invoice/${checkoutResponse.body.id}`)

        expect(invoiceResponse.status).toBe(200)
        expect(invoiceResponse.body.name).toBe("Roberto");
        expect(invoiceResponse.body.document).toBe("XRL8");
        expect(invoiceResponse.body.address.street).toBe("Rua 1");
        expect(invoiceResponse.body.address.number).toBe("579");
        expect(invoiceResponse.body.address.complement).toBe("...");
        expect(invoiceResponse.body.address.city).toBe("The City");
        expect(invoiceResponse.body.address.state).toBe("The State");
        expect(invoiceResponse.body.address.zipCode).toBe("0009990");

        expect(invoiceResponse.body.items[0].id).toBe(product1Response.body.id);
        expect(invoiceResponse.body.items[0].name).toBe(product1Response.body.name);
        expect(invoiceResponse.body.items[0].price).toBe(product1Response.body.purchasePrice);

        expect(invoiceResponse.body.items[1].id).toBe(product2Response.body.id);
        expect(invoiceResponse.body.items[1].name).toBe(product2Response.body.name);
        expect(invoiceResponse.body.items[1].price).toBe(product2Response.body.purchasePrice);
    })
})