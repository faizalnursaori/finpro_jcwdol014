// import express from 'express';
// import {
//   createCart,
//   getCart,
//   addItemToCart,
//   removeCartItem,
//   updateCartItem,
//   handleInvalidCart,
// } from '@/controllers/cart.controller';
// import { authenticateToken } from '@/middleware/auth.middleware';

// const router = express.Router();

// // Apply verifyToken middleware to all routes
// // router.use(verifyToken);

// router.use(authenticateToken);

// // Get or create a cart for the user
// router.get('/', getCart);

// // Handle invalid cart
// router.post('/invalidate', handleInvalidCart);

// // Add an item to a cart
// router.post('/:id/items', addItemToCart);

// // Update a cart item
// router.put('/:id/items/:itemId', updateCartItem);

// // Remove a cart item
// router.delete('/:id/items/:itemId', removeCartItem);

// export default router;
