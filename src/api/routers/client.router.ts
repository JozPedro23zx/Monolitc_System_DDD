import express, {Request, Response} from "express"
import Id from "../../modules/@shared/domain/value-object/id.value-object";
import Client from "../../modules/client-adm/domain/client.entity";
import Address from "../../modules/client-adm/domain/value-object/address.value-object";
import ClientAdmFacadeFactory from "../../modules/client-adm/factory/facade.factory";

export const clientRouter = express.Router();

clientRouter.post("/", async (req: Request, res: Response) =>{
    const clientFacade = ClientAdmFacadeFactory.create();
    try{
        const address = new Address({
            street: req.body.street,
            number: req.body.number,
            complement: req.body.complement,
            city: req.body.city,
            state: req.body.state,
            zipCode: req.body.zipCode,
        });

        const client = new Client({
            id: new Id(),
            name: req.body.name,
            email: req.body.email,
            document: req.body.document,
            address: address
        });

        const input = {
            id: client.id.id,
            name: client.name,
            email: client.email,
            document: client.document,
            street: client.address.street,
            number: client.address.number,
            complement: client.address.complement,
            city: client.address.city,
            state: client.address.state,
            zipCode: client.address.zipCode
        }

        const output = await clientFacade.add(input)

        res.status(200).send(output)
    }catch(err){
        res.status(500).send(err)
    }
})