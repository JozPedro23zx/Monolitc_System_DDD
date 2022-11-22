import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", ()=>{
    beforeEach(async () => {
        await sequelize.sync({ force: true });
      });
    
      afterAll(async () => {
        await sequelize.close();
      });

    it("should add a client", async ()=>{
        const response = await request(app).post("/client").send({
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

        expect(response.status).toBe(200)
        expect(response.body.name).toBe("Roberto");
        expect(response.body.email).toBe("x@x.com");
        expect(response.body.document).toBe("XRL8");
        expect(response.body.street).toBe("Rua 1");
        expect(response.body.number).toBe("579");
        expect(response.body.complement).toBe("...")
        expect(response.body.city).toBe("The City")
        expect(response.body.state).toBe("The State")
        expect(response.body.zipCode).toBe("0009990")
    })
})