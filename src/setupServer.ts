import compression from 'compression'
import cookieSession from 'cookie-session'
import cors from 'cors'
import { Application, NextFunction, Request, Response, json, urlencoded } from 'express'
import 'express-async-error'
import helmet from 'helmet'
import hpp from 'hpp'
import http from 'http'
import HTTP_STATUS_CODE from 'http-status-codes'
import { Server } from 'socket.io'

import { config } from './config'
import { CustomError, IErrorResponse } from './middlewares/errorMiddleware'
import appRouter from './routes'
import { Logs } from './utils/constants'
import { createClient } from 'redis'
import { createAdapter } from '@socket.io/redis-adapter'

const { log } = new Logs('Server')

export class PagesServer {
  private app: Application

  constructor(app: Application) {
    this.app = app
  }

  public start(): void {
    this.securityMiddleware(this.app)
    this.standardMiddleware(this.app)
    this.startServer(this.app)
    this.routerMiddleware(this.app)
    this.errorMiddleware(this.app)
  }

  private securityMiddleware(app: Application): void {
    app.use(
      cookieSession({
        name: 'session',
        keys: [config.SESSION_KEY1!, config.SESSION_KEY2!],
        maxAge: 24 * 7 * 3600000,
        secure: config.NODE_ENV !== 'development'
      })
    )
    app.use(hpp())
    app.use(helmet())
    app.use(
      cors({
        origin: '*',
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      })
    )
  }

  private standardMiddleware(app: Application): void {
    app.use(compression())
    app.use(json({ limit: '55mb' }))
    app.use(urlencoded({ extended: true, limit: '55mb' }))
  }

  private routerMiddleware(app: Application): void {
    appRouter(app)
  }

  private errorMiddleware(app: Application): void {
    app.all('*', (req: Request, res: Response) => {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
        message: `${req.originalUrl} doesn't not exist`,
        statusCode: HTTP_STATUS_CODE.NOT_FOUND
      })
    })
    app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
      log().error({ error })
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json(error.serializeErrors())
      }
      next(error)
    })
  }

  private startServer(app: Application): void {
    try {
      const httpServer: http.Server = new http.Server(app)
      this.startHttpServer(httpServer)
    } catch (error) {
      log().error({ error })
    }
  }
  private startHttpServer(httpServer: http.Server): void {
    log().info(`Server running the processor of ${process.pid}`)
    httpServer.listen(config.PORT, () => {
      log().info(`${config.PORT} running`)
    })
  }

  private async socketIoServer(httpServer: http.Server): Promise<Server> {
    const io: Server = new Server(httpServer, {
      cors: {
        origin: config.CLIENT_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      }
    })
    const pubClient = createClient({ url: config.REDIS_URI })
    const subClient = pubClient.duplicate()

    await Promise.all([
      pubClient.connect(),
      subClient.connect()
    ])
    io.adapter(createAdapter(pubClient, subClient))

    return io

  }
}
