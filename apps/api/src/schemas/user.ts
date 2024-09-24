
import {z} from 'zod'


export const setUserDataSchema = z.object({
    name: z.string().min(3),
    username: z.string().min(3),
    password: z.string().min(3)
})


export const editUserDataSchema = z.object({
    username: z.string().min(3),
    name: z.string().min(3),
    email : z.string().email().min(5),
    gender: z.string(),
    mobileNumber: z.number().min(10)
})

export const changePasswordSchema = z.object({
    password: z.string().min(3)
})