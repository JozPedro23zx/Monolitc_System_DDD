import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import InvoiceGateway from "../../gateway/invoice.gateway";
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "./generate-invoice.dto";
import Invoice from "../../domain/invoice.entity";
import Product from "../../domain/product.entity"
import Id from "../../../@shared/domain/value-object/id.value-object";
import Address from "../../../client-adm/domain/value-object/address.value-object";

export default class GenerateInvoiceUsecase implements UseCaseInterface{
    constructor(private invoiceRepository: InvoiceGateway){}

    async execute(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {
        const address = new Address({
            street: input.street,
            number: input.number,
            complement: input.complement,
            city: input.city,
            state: input.state,
            zipCode: input.zipCode,
        })

        const items = input.items.map(item=> {
            return new Product({
                id: new Id(item.id),
                name: item.name,
                price: item.price
            })
        })

        const invoice = new Invoice({
            id: new Id(input.id),
            name: input.name,
            document: input.document,
            address: address,
            items: items,
        })

        await this.invoiceRepository.generate(invoice)

        

        return{
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            street: invoice.address.street,
            number: invoice.address.number,
            complement: invoice.address.complement,
            city: invoice.address.city,
            state: invoice.address.state,
            zipCode: invoice.address.zipCode,
            items: items.map(item => {return {
                id: item.id.id,
                name: item.name,
                price: item.price
            }}),
            total: invoice.total
        }
    }

}