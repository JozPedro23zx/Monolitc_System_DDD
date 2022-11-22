import express, {Request, Response} from "express"
import Id from "../../modules/@shared/domain/value-object/id.value-object";
import Product from "../../modules/product-adm/domain/product.entity";
import ProductAdmFacadeFactory from "../../modules/product-adm/factory/facade.factory";

export const productRouter = express.Router();

productRouter.post("/", async (req: Request, res: Response) =>{
    const productFacade = ProductAdmFacadeFactory.create()
    try{
        const product = new Product({
            id: new Id(),
            name: req.body.name,
            description: req.body.description,
            purchasePrice: req.body.purchasePrice,
            stock: req.body.stock
        });

        const productInput = {
            id: product.id.id,
            name: product.name,
            description: product.description,
            purchasePrice: product.purchasePrice,
            stock: product.stock
        };

        const result = await productFacade.addProduct(productInput)
        res.status(200).send(result)

    }catch(err){
        res.status(500).send(err)
    }
})