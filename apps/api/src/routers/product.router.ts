import { Router } from 'express';

import { getProducts } from '@/controllers/product.controller';

const router = Router()

//get Warehouse
router.get('/products/', getProducts)

export default router