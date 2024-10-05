// src/routes/productRoutes.ts
import express from 'express';
import { ProductController } from '../controllers/product.controller';
import {
  authenticateToken2,
  SuperAdminGuard,
} from '@/middleware/auth.middleware';
import { uploadMiddleware } from '@/middleware/uploaderProduct';

const router = express.Router();
const productController = new ProductController();

router.get('/', productController.getAllProducts);
router.get('/all', productController.getProducts);
router.get('/:id', productController.getProductById);
router.get('/slug/:slug', productController.getProductBySlug);
router.post(
  '/',
  authenticateToken2,
  SuperAdminGuard,
  uploadMiddleware,
  productController.createProduct,
);
router.put(
  '/:id',
  authenticateToken2,
  SuperAdminGuard,
  uploadMiddleware,
  productController.updateProduct,
);
router.delete(
  '/:id',
  authenticateToken2,
  SuperAdminGuard,
  productController.deleteProduct,
);

export default router;
