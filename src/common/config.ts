import { Logger } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import { IncomingMessage, Server, ServerResponse } from 'http'

export const InitialApp = async (
  app: NestExpressApplication<
    Server<typeof IncomingMessage, typeof ServerResponse>
  >,
) => {
  const PORT = parseInt(process.env.PORT, 10) || 8090

  app.useLogger(
    process.env.NODE_ENV === 'production'
      ? ['error', 'warn']
      : ['log', 'error', 'warn', 'debug', 'verbose'],
  )

  Logger.debug('Configurando CORS...')
  app.enableCors()
  Logger.debug('CORS configurado correctamente.')

  await app.listen(PORT, () => {
    if (process.env.NODE_ENV === 'development')
      return Logger.verbose(
        `Servidor escuchando en el puerto ${PORT} en modo ${process.env.NODE_ENV}`,
      )

    Logger.log(`Servidor iniciado en el puerto ${PORT}`)
  })
}
