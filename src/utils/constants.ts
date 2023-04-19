import Logger from 'bunyan'
import { config } from './../config'

export const COOKIES_OPTION = {
  name: 'session',
  keys: ['k1', 'k2'],
  maxAge: '24 * 7 * 3600000',
  secure: false
}

// export const log = (title: string) => {
//     const l: Logger = config.logger(title)
//     return l

// }

export class Logs {
  private title: string
  constructor(title: string) {
    this.title = title
    if (!title) {
      console.log('Title cannot be empty')
    }
  }
  public log = (): Logger => config.logger(this.title)
}

export const BASE_ROUTER = (router: string): string => `/api/${router}/v1`
