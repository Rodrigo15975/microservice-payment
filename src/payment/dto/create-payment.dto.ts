export class CreatePaymentDto {
  totalPrice: number
  dataFormat: {
    product: string
    brand: string
    quantity_buy: number
    category: {
      id: number
      category: string
    }
    discount: number
    price: number
    gender: string
    productVariant: {
      color: string
      id: number
      key_url: string
      url: string
    }[]
    size: string[]
    id: number
  }[]
  emailUser: string
  idUser: string
  discount: number
}
