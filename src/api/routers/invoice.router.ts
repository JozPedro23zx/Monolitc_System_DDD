import express, {Request, Response} from 'express'
import InvoiceFactoryFacade from '../../modules/invoice/factory/invoice.factory'

export const invoiceRouter = express.Router()

invoiceRouter.post("/:id", async (req: Request, res: Response) =>{
    const invoiceFacade = InvoiceFactoryFacade.create()
    try{
        const result = await invoiceFacade.find({id: req.params.id})
        res.status(200).send(result)
    }catch(err){
        res.status(500).send(err)
    }
})