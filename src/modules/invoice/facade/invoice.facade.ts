import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import InvoiceFacadeInterface, { FindInvoiceFacadeInputDto, FindInvoiceFacadeOutputDto, GenerateInvoiceFacadeInputDto } from "./invoice.facade.interface";


export interface InvoiceUseCaseProps{
    generate: UseCaseInterface,
    find: UseCaseInterface
};

export default class InvoiceFacade implements InvoiceFacadeInterface{
    private _generate: UseCaseInterface;
    private _find: UseCaseInterface;

    constructor(props: InvoiceUseCaseProps){
        this._generate = props.generate
        this._find = props.find
    }

    async generate(input: GenerateInvoiceFacadeInputDto): Promise<void> {
        await this._generate.execute(input)
    };
    async find(input: FindInvoiceFacadeInputDto): Promise<FindInvoiceFacadeOutputDto> {
        const invoice = await this._find.execute(input)
        return invoice
    };
};