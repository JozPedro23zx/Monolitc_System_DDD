import express, {Request, Response} from "express"
import Id from "../../modules/@shared/domain/value-object/id.value-object";
import CheckoutFactoryFacade from "../../modules/checkout/factory/checkout.factory.facade";

export const checkoutRouter = express.Router()

checkoutRouter.post("/", async (req: Request, res: Response) =>{
    const checkoutFacade = CheckoutFactoryFacade.create()
    try{
        const input = {
            clientId: req.body.clientId,
            products: req.body.products
        }

        const response = await checkoutFacade.addOrder(input)

        res.status(200).send(response)
    }catch(err){
        res.status(500).send(err)
    }
})