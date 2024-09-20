import Email from 'next-auth/providers/email'
import {z} from 'zod'


export const setUserDataSchema = z.object({
    name: z.string().min(3),
    username: z.string().min(3),
    password: z.string().min(3)
})


export const editUserDataSchema = z.object({
    username: z.string().min(3).optional(),
    name: z.string().min(3).optional(),
    email : z.string().email().min(5).optional(),
    gender: z.string(),
    mobileNumber: z.number().min(10).optional()
})