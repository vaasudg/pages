import Joi, { ObjectSchema } from 'joi'

export const registerSchema: ObjectSchema = Joi.object().keys({
    username: Joi.string().required().min(4).max(8).messages({
        'string.base': 'Username must be string',
        'string.min': 'Username minimum length must be 4',
        'string.max': 'Username maximum length must be 8',
        'string.empty': 'Username cannot be empty'
    }),
    password: Joi.string().required().min(4).max(8).messages({
        'string.min': 'Password minimum length must be 4',
        'string.max': 'Password maximum length must be 8',
        'string.empty': 'Password cannot be empty'
    }),
    email: Joi.string().required().email().messages({
        'string.base': 'Email must be string',
        'string.email': 'Email must be valid email format',
        'string.empty': 'Email cannot be empty'
    }),
    avatarColor: Joi.string().required().messages({
        'any.required': 'Avatar color required'
    }),
    avatarImage: Joi.string().required().messages({
        'any.required': 'Avatar image required'
    })
})