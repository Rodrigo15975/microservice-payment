import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const PORT = process.env.PORT || 8090
  await app.listen(PORT, () => {
    if (process.env.NODE_ENV === 'development')
      return console.log(
        'listening on port:',
        PORT,
        `\nNODE_ENV: ${process.env.NODE_ENV} `,
      )
    console.log(
      'listening on port:',
      PORT,
      `\nNODE_ENV: ${process.env.NODE_ENV} `,
    )
  })
}
bootstrap()
