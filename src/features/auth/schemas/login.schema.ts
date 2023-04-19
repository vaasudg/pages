import Joi, { ObjectSchema } from 'joi'

export const loginSchema: ObjectSchema = Joi.object().keys({
    email: Joi.string().required().email().messages({
        'string.base': 'Email must be string',
        'string.email': 'Email must be valid email format',
        'string.empty': 'Email cannot be empty'
    }),
    password: Joi.string().required().min(4).max(8).messages({
        'string.min': 'Password minimum length must be 4',
        'string.max': 'Password maximum length must be 8',
        'string.empty': 'Password cannot be empty'
    })
})