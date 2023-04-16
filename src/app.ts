import express, { Express } from 'express'
import { PagesServer } from './setupServer'

class PagesApplication {
    public start(): void {
        const app: Express = express()
        const server: PagesServer = new PagesServer(app)
        server.start()
    }
}

const pagesApplication: PagesApplication = new PagesApplication()
pagesApplication.start()