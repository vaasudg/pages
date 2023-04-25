import { Application } from 'express'
import { BASE_ROUTER } from './utils/constants'
import { autRouter } from './features/auth/routes/auth.router'

export default (app: Application): void => {
  const routes = () => {
    app.use(BASE_ROUTER('auth'), autRouter.route())
  }
  routes()
}
