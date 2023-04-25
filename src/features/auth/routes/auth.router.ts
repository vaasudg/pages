import express, { Router } from 'express'
import { Register } from '../controllers/auth.controller'

class AuthRouter {
    private router: Router
    constructor() {
        this.router = express.Router()
    }

    public route(): Router {
        this.router.post('/register', Register.prototype.create)

        return this.router
    }
}

export const autRouter: AuthRouter = new AuthRouter()