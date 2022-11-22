import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import Address from "../domain/value-object/address.value-object";
import CheckoutGateway from "../gateway/checkout.gateway";
import OrderItemsModel from "./order.items.model";
import OrderModel from "./order.model";

export default class OrderRepository implements CheckoutGateway{
    async addOrder(order: Order): Promise<void> {
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

    }
    async findOrder(orderId: string): Promise<Order> {
        const orderData = await OrderModel.findOne({where: {id: orderId}, include: ["products"]})

        const address = new Address({
            street: orderData.client_street,
            number: orderData.client_number,
            complement: orderData.client_complement,
            city: orderData.client_city,
            state: orderData.client_state,
            zipCode: orderData.client_zip_code
          })

        const client = new Client({
            id: new Id(orderData.client_id),
            name: orderData.client_name,
            email: orderData.client_email,
            document: orderData.client_document,
            address: address
        })

        const products = orderData.products.map(product =>{
            let newProduct = new Product({
                id: new Id(product.product_id),
                name: product.name,
                description: product.description,
                salesPrice: product.salesPrice
            })

            return newProduct
        })

        const order = new Order({
            id: new Id(orderData.id),
            client: client,
            products: products,
            status: orderData.status
        })

        return order
    }   
}