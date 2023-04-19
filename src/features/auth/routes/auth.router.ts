import express, { Router } from 'express'

class AuthRouter {
    private router: Router
    constructor() {
        this.router = express.Router()
    }

    public route(): Router {
        this.router.post('/register', (req, res) => {
            res.send('Register')
        })

        return this.router
    }
}

export const autRouter: AuthRouter = new AuthRouter()