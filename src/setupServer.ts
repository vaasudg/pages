import { Application, json, urlencoded, Response, Request, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import hpp from 'hpp'
import cookieSession from 'cookie-session'
import HTTP_STATUS_CODE from 'http-status-codes'
import 'express-async-error'
import compression from 'compression'
import http from 'http'
import { PORT } from '@/utils/constants'

export class PagesServer {
    private app: Application

    constructor(app: Application) {
        this.app = app
    }

    public start(): void {
        this._securityMiddleware(this.app)
        this._standardMiddleware(this.app)
        this._startServer(this.app)
    }

    private _securityMiddleware(app: Application): void {
        app.use(cookieSession({
            name: 'session',
            keys: ['k1', 'k2'],
            maxAge: 24 * 7 * 3600000,
            secure: false
        }))
        app.use(hpp())
        app.use(helmet())
        app.use(cors({
            origin: '*',
            credentials: true,
            optionsSuccessStatus: 200,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
        }))
    }
    private _standardMiddleware(app: Application): void {
        app.use(compression())
        app.use(json({ limit: '55mb' }))
        app.use(urlencoded({ extended: true, limit: '55mb' }))
    }

    private _startServer(app: Application): void {
        try {
            const httpServer: http.Server = new http.Server(this.app)
            this._startHttpServer(httpServer)
        } catch (error) {

        }
    }
    private _startHttpServer(httpServer: http.Server): void {
        httpServer.listen(PORT, () => {
            console.log(`${PORT} running`)
        })
    }
}