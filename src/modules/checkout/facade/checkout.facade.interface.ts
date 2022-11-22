export interface PlaceOrderFacadeInputDto {
    clientId: string;
    products: {
      productId: string;
    }[];
  }
  
export interface PlaceOrderFacadeOutputDto {
    id: string;
    total: number;
    products: {
      productId: string;
    }[];
  }


export default interface CheckoutFacadeInterface{
    addOrder(intput: PlaceOrderFacadeInputDto): Promise<PlaceOrderFacadeOutputDto>;
}