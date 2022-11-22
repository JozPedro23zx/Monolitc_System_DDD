import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../../client-adm/domain/value-object/address.value-object";
import Invoice from "../domain/invoice.entity";
import invoiceEntity from "../domain/invoice.entity";
import Product from "../domain/product.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import InvoiceModel from "./invoice.model";
import {ProductModel} from "./product.model";

export default class InvoiceRepository implements InvoiceGateway{
    async generate(invoice: invoiceEntity): Promise<void> {
        await InvoiceModel.create({
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            street: invoice.address.street,
            number: invoice.address.number,
            complement: invoice.address.complement,
            city: invoice.address.city,
            state: invoice.address.state,
            zip_code: invoice.address.zipCode,
            items: invoice.items.map((item) =>({
                id: item.id.id,
                name: item.name,
                price: item.price
            }))
        }, 
        {
            include: [{model: ProductModel}]
        }
        )
    }
    async find(id: string): Promise<invoiceEntity> {
        const invoiceResultDb = await InvoiceModel.findOne({where: {id: id}, include:["items"]})

        if(!invoiceResultDb){
            throw new Error("Invoice not Found");
        }

        const address = new Address({
            street: invoiceResultDb.street,
            number: invoiceResultDb.number,
            complement: invoiceResultDb.complement,
            city: invoiceResultDb.city,
            state: invoiceResultDb.state,
            zipCode: invoiceResultDb.zip_code,
        })

        const items = invoiceResultDb.items.map((item) =>{
            return new Product({
                id: new Id(item.id),
                name: item.name,
                price: item.price
            })
        })

        const invoice = new Invoice({
            id: new Id(invoiceResultDb.id),
            name: invoiceResultDb.name,
            document: invoiceResultDb.document,
            address: address,
            items: items
        })

        return invoice
    }

}