import express from 'express';
import {
  createCart,
  getCart,
  addItemToCart,
  removeCartItem,
  updateCartItem,
} from '@/controllers/cart.controller';

const router = express.Router();

// Create a new cart
router.post('/', createCart);

// Get a cart by ID
router.get('/:id', getCart);

// Add an item to a cart
router.post('/:id/items', addItemToCart);

// Update a cart item
router.put('/:id/items/:itemId', updateCartItem);

// Remove a cart item
router.delete('/:id/items/:itemId', removeCartItem);

export default router;
