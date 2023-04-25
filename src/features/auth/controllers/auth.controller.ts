import { UploadApiResponse } from 'cloudinary'
import { NextFunction, Request, Response } from 'express'
import HTTP_STATUS from 'http-status-codes'
import { Types } from 'mongoose'
import { BadRequestError } from '../../../middlewares/errorMiddleware'
import { Helpers } from '../../../utils/helpers/global.helpers'
import { IAuthDocument, IRegisterData } from '../interfaces/auth.interface'
import { registerSchema } from '../schemas/register.schema'
import { Logs } from './../../../utils/constants'
import { joiValidation } from './../../../utils/decorators/joi.validation.decorators'
import { authService } from './../../../utils/shared/services/auth.service'

import imageUpload from '../../../utils/helpers/helper.utils.cloudnary'

const { log } = new Logs('Auth Controller')

export class Register {
    @joiValidation(registerSchema)
    public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { username, email, password, avatarColor, avatarImage } = req.body
        const user = await authService.isExistingUser(username, email)
        if (user) {
            // throw new BadRequestError('If you have account with us, please login')
            next('If you have account with us, please login')
        }

        const authObjectId: Types.ObjectId = new Types.ObjectId()
        const userObjectId: Types.ObjectId = new Types.ObjectId()
        const uId = `${Helpers.randomNumber(12)}`

        const authData: IAuthDocument = Register.prototype.registerData({
            _id: authObjectId,
            username,
            email,
            password,
            avatarColor,
            uId
        })

        const imageResult: UploadApiResponse = await imageUpload(avatarImage, `${userObjectId}`, true, true) as UploadApiResponse
        log().info({ imageResult })
        if (!imageResult.public_id) {
            return next(new BadRequestError('Error while uploading the image, please try again'))
        }

        log().info({
            username, email, password, avatarColor, avatarImage
        })

        res.status(HTTP_STATUS.CREATED).json({ message: 'User created', authData })
    }

    private registerData(data: IRegisterData): IAuthDocument {
        const { _id, uId, username, password, email, avatarColor } = data
        return {
            _id,
            uId,
            username: Helpers.firstLetterUpperCase(username),
            password,
            email: Helpers.lowerCase(email),
            avatarColor,
            createAt: new Date()
        } as IAuthDocument
    }
}