// src/routes/productRoutes.ts
import express from 'express';
import { ProductController } from '../controllers/product.controller';
import {
  AdminGuard,
  authenticateToken,
  SuperAdminGuard,
} from '@/middleware/auth.middleware';
import { uploadMiddleware } from '@/middleware/uploaderProduct';

const router = express.Router();
const productController = new ProductController();

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.get('/slug/:slug', productController.getProductBySlug);
router.post(
  '/',
  authenticateToken,
  SuperAdminGuard,
  uploadMiddleware,
  productController.createProduct,
);
router.put(
  '/:id',
  authenticateToken,
  SuperAdminGuard,
  uploadMiddleware,
  productController.updateProduct,
);
router.delete(
  '/:id',
  authenticateToken,
  SuperAdminGuard,
  productController.deleteProduct,
);

export default router;
