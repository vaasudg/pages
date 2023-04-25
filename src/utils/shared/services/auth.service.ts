import { IAuthDocument } from '../../../features/auth/interfaces/auth.interface'
import { AuthModel } from '../../../features/auth/models/auth.model'
import { Logs } from './../../../utils/constants'

import { Helpers } from '../../helpers/global.helpers'
const { log } = new Logs('Auth Service')

class AuthService {
    public async isExistingUser(username: string, email: string): Promise<IAuthDocument> {
        const query = {
            $or: [{ username: Helpers.firstLetterUpperCase(username) }, { email: Helpers.lowerCase(email) }]
        }
        const user: IAuthDocument = await AuthModel.findOne(query) as IAuthDocument
        log().info({ user })
        return user
    }
}

export const authService: AuthService = new AuthService()