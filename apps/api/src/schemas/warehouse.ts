import {z} from 'zod'


export const warehouseSchema = z.object({
    name: z.string().min(3),
    address: z.string(),
    provinceId: z.number(),
    cityId: z.string(),
    postalCode: z.string().min(3),
    latitude: z.string(),
    longitude: z.string(),
    storeRadius: z.string(),
    userId: z.number()
})

export const editWarehouseSchema = z.object({
    name: z.string().min(3).optional(),
    address: z.string().optional(),
    provinceId: z.number().optional(),
    cityId: z.string().optional(),
    postalCode: z.string().min(3).optional(),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
    storeRadius: z.string().optional(),
    userId: z.number().optional()
})