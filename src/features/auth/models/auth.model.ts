import { compare, hash } from 'bcryptjs'
import { Model, model, Schema } from 'mongoose'

import { IAuthDocument } from '../interfaces/auth.interface'
import { SALT_ROUND } from '../../../utils/constants'

const authSchema: Schema = new Schema({
    username: { type: String },
    email: { type: String },
    uId: { type: String },
    password: { type: String },
    avatarColor: { type: String }
}, {
    toJSON: {
        transform(_doc, ret) {
            delete ret.password
            return ret
        }
    }
})

authSchema.pre('save', async function (this: IAuthDocument, next: () => void) {
    const hashedPassword: string = await hash(this.password as string, SALT_ROUND)
    this.password = hashedPassword
    next()
})

authSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    // const hashedPassword: string | undefined = (this as unknown as IAuthDocument).password
    const hashedPassword: string = this.password
    return compare(password, hashedPassword)
}

authSchema.methods.hashPassword = async function (password: string): Promise<string> {
    return hash(password, SALT_ROUND)
}

export const AuthModel: Model<IAuthDocument> = model<IAuthDocument>('Auth', authSchema, 'Auth')