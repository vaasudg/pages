import bunyan from 'bunyan'
import { v2 } from 'cloudinary'
import dotenv from 'dotenv'

dotenv.config({})

class Config {
  public NODE_ENV: string | undefined
  public PORT: string | undefined
  public JWT_SECRET: string | undefined
  public MONGODB_URI: string | undefined
  public SESSION_KEY1: string | undefined
  public SESSION_KEY2: string | undefined
  public CLIENT_URL: string | undefined
  public CLOUD_NAME: string | undefined
  public CLOUD_API_KEY: string | undefined
  public CLOUD_API_SECRET: string | undefined

  constructor() {
    this.NODE_ENV = process.env.NODE_ENV || ''
    this.PORT = process.env.PORT || ''
    this.JWT_SECRET = process.env.JWT_SECRET || ''
    this.MONGODB_URI = process.env.MONGODB_URI || ''
    this.SESSION_KEY1 = process.env.SESSION_KEY1 || ''
    this.SESSION_KEY2 = process.env.SESSION_KEY2 || ''
    this.CLIENT_URL = process.env.CLIENT_URL || ''
    this.CLOUD_NAME = process.env.CLOUD_NAME || ''
    this.CLOUD_API_KEY = process.env.CLOUD_API_KEY || ''
    this.CLOUD_API_SECRET = process.env.CLOUD_API_SECRET || ''
  }

  public validation(): void {
    for (const [key, value] of Object.entries(this)) {
      if (!value) {
        throw new Error(`${key} must be valid`)
      }
    }
  }

  public logger(name: string): bunyan {
    return bunyan.createLogger({
      name,
      level: 'debug'
    })
  }

  public cloudinaryConfig(): void {
    v2.config({
      cloud_name: this.CLOUD_NAME,
      api_key: this.CLOUD_API_KEY,
      api_secret: this.CLOUD_API_SECRET
    })
  }
}
export const config: Config = new Config()
