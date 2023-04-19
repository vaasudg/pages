import express, { Express } from 'express'
import { PagesServer } from './setupServer'
import { config } from './config'
// import DBConnection from './setupDB'

class PagesApplication {
  public start(): void {
    this.configuration()
    // DBConnection()
    const app: Express = express()
    const server: PagesServer = new PagesServer(app)
    server.start()
  }

  private configuration() {
    config.validation()
    config.cloudinaryConfig()
  }
}

const pagesApplication: PagesApplication = new PagesApplication()
pagesApplication.start()
