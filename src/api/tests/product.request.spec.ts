import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", ()=>{
    beforeEach(async () => {
        await sequelize.sync({ force: true });
      });
    
      afterAll(async () => {
        await sequelize.close();
      });

    it("should add a product", async ()=>{
        const response = await request(app).post("/product").send({
            name: "Product 1",
            description: "Description of Product 1",
            purchasePrice: 10,  
            stock: 23
        })

        expect(response.status).toBe(200)
        expect(response.body.name).toBe("Product 1")
        expect(response.body.description).toBe("Description of Product 1")
        expect(response.body.purchasePrice).toBe(10)
        expect(response.body.stock).toBe(23)
    })

    // it("should not add product and show error", async ()=>{
    //   const response = await request(app).post("/product").send({
    //     name: "Product 1",
    //     description: "Description of Product 1",
    //     purchasePrice: 10
    //   })

    //   expect(response.status).toBe(500)
    // })
})