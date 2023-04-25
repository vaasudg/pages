/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextFunction, Request } from 'express'
import { ObjectSchema } from 'joi'
import { JoiRequestValidationError } from './../../middlewares/errorMiddleware'

type IJoiDecorator = (target: any, key: string, descriptor: PropertyDescriptor) => void

export function joiValidation(schema: ObjectSchema): IJoiDecorator {
    return (_target: any, _key: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value

        descriptor.value = async function (...arg: any[]) {
            const req: Request = arg[0]
            const next: NextFunction = arg[2]
            const { error } = await Promise.resolve(schema.validate(req.body))
            if (error?.details) {
                next(new JoiRequestValidationError(error.details[0].message))
            }
            return originalMethod.apply(this, arg)
        }
        return descriptor
    }
}