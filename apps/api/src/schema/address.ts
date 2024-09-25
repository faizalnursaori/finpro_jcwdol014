import { z } from 'zod';

export const addressSchema = z.object({
  name: z.string().min(3),
  provinceId: z.number(),
  cityId: z.string(),
  postalCode: z.string().min(3),
  address: z.string(),
  isPrimary: z.boolean().optional(),
});

export const editAddressSchema = z.object({
  name: z.string().min(3),
  provinceId: z.number().optional(),
  cityId: z.string().optional(),
  postalCode: z.string().min(3).optional(),
  address: z.string().min(3).optional(),
  isPrimary: z.boolean().optional(),
});
