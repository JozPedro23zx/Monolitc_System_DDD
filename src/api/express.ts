import express, {Express} from "express";
import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../modules/client-adm/repository/client.model";
import { ProductAdmModel } from "../modules/product-adm/repository/product.model";
import { ProductCatalogModel } from "../modules/store-catalog/repository/product.model";
import { ProductModel } from "../modules/invoice/repository/product.model";
import { productRouter } from "./routers/product.router";
import { clientRouter } from "./routers/client.router";
import { checkoutRouter } from "./routers/checkout.router";
import OrderModel from "../modules/checkout/repository/order.model";
import { invoiceRouter } from "./routers/invoice.router";
import InvoiceModel from "../modules/invoice/repository/invoice.model";
import OrderItemsModel from "../modules/checkout/repository/order.items.model";

export const app: Express = express();
app.use(express.json());
app.use("/product", productRouter)
app.use("/client", clientRouter)
app.use("/checkout", checkoutRouter)
app.use('/invoice', invoiceRouter)

export let sequelize: Sequelize;

async function setupDb() {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });
    await sequelize.addModels([ClientModel, ProductAdmModel, ProductCatalogModel, ProductModel, OrderModel, OrderItemsModel, InvoiceModel]);
    await sequelize.sync();
};

setupDb();