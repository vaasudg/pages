import { Document, Types } from 'mongoose'
// import {IUser}

declare global {
    namespace Express {
        interface Request {
            currentUser?: AuthPayload
        }
    }
}

export interface AuthPayload {
    userId: string
    uId: string
    email: string
    username: string
    avatarColor: string
    iat?: number
}

export interface IAuthDocument extends Document {
    _id: string | Types.ObjectId
    uId: string
    email: string
    username: string
    password?: string
    confirmPassword?: (_password: string) => Promise<boolean>
    hashedPassword?: (_password: string) => Promise<string>
    avatarColor: string
    createAt?: Date
}

export interface IRegisterData {
    _id: string | Types.ObjectId
    uId: string
    email: string
    username: string
    password: string
    avatarColor: string
}

export interface IAuthJob {
    value?: string | IAuthDocument
}