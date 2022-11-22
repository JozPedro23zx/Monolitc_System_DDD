import ClientAdmFacadeFactory from "../../client-adm/factory/facade.factory";
import InvoiceFactoryFacade from "../../invoice/factory/invoice.factory";
import ProductAdmFacadeFactory from "../../product-adm/factory/facade.factory";
import StoreCatalogFacadeFactory from "../../store-catalog/factory/facade.factory";
import CheckoutFacade from "../facade/checkout.facade";
import OrderRepository from "../repository/order.repository";
import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase";

export default class CheckoutFactoryFacade{
    static create(){
        const clientFacade = ClientAdmFacadeFactory.create()
        const productFacade = ProductAdmFacadeFactory.create()
        const storeCatalogFacade = StoreCatalogFacadeFactory.create()
        const invoiceFacade = InvoiceFactoryFacade.create()
        
        const repository = new OrderRepository()
        const usecase = new PlaceOrderUseCase(clientFacade, productFacade, storeCatalogFacade, invoiceFacade, repository)

        const facade = new CheckoutFacade(usecase)

        return facade
    }
}