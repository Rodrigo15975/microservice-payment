import { InjectStripeClient } from '@golevelup/nestjs-stripe'
import { Injectable } from '@nestjs/common'
import Stripe from 'stripe'
import { CreatePaymentDto } from './dto/create-payment.dto'
import { UpdatePaymentDto } from './dto/update-payment.dto'

@Injectable()
export class PaymentService {
  constructor(@InjectStripeClient() private readonly stripeClient: Stripe) {}

  async create(data: CreatePaymentDto): Promise<{ url: string }> {
    console.log(data)
    const session = await this.stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: '',
            product_data: {
              name: 'Example Product',
            },
            unit_amount: 5000, // $50.00 (en centavos)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/cancel`,
      customer_email: 'rodrigo15975@gmail.com',
    })

    return { url: session.url } // Retornar la URL para redirigir al frontend
  }

  findAll() {
    console.log({
      message: 'hola',
    })

    return `This action returns all payment`
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    console.log({
      updatePaymentDto,
    })

    return `This action updates a #${id} payment`
  }

  remove(id: number) {
    return `This action removes a #${id} payment`
  }
}
