import { Application, json, urlencoded, Response, Request, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import hpp from 'hpp'
import cookieSession from 'cookie-session'
import HTTP_STATUS_CODE from 'http-status-codes'
import 'express-async-error'
import compression from 'compression'
import http from 'http'
import { config } from './config'
import appRouter from './routes'
import { Logs } from './utils/constants'

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
    appRouter(app)
  }

  private startServer(app: Application): void {
    try {
      const httpServer: http.Server = new http.Server(this.app)
      this.startHttpServer(httpServer)
    } catch (error) { }
  }
  private startHttpServer(httpServer: http.Server): void {
    log().info(`Server running the processor of ${process.pid}`)
    httpServer.listen(config.PORT, () => {
      log().info(`${config.PORT} running`)
    })
  }
}
