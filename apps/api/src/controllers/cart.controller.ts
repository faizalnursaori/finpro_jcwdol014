import { Request, Response } from 'express';
import {
  createNewCart,
  getOrCreateCart,
  fetchCart,
  addItem,
  updateItem,
  removeItem,
  deactivateCart,
} from '../services/cart.services';
import prisma from '@/prisma';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    email: string;
    username: string;
    role: string;
  };
}

export const createCart = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId || typeof userId !== 'number') {
      return res.status(400).json({ error: 'Valid userId is required' });
    }
    const newCart = await createNewCart(userId);
    res.status(201).json({ message: 'Create cart success', cart: newCart });
  } catch (error) {
    console.error('Error in createCart controller:', error);
    res.status(500).json({ error: 'Failed to create cart' });
  }
};

export const getCart = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const cart = await getOrCreateCart(userId);

    res.status(200).json({ message: 'Get cart success', cart: cart });
  } catch (error) {
    console.error('Error in getCart controller:', error);
    res.status(500).json({ error: 'Failed to get cart' });
  }
};

export const getCartById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {id} = req.params

    const cart = await prisma.cart.findUnique({
      where: {id: Number(id)},
      include: {items: {
        include: {
          product: true
        }
      }}
    });

    res.status(200).json({ message: 'Get cart success', cart: cart });
  } catch (error) {
    console.error('Error in getCart controller:', error);
    res.status(500).json({ error: 'Failed to get cart' });
  }
};

export const handleInvalidCart = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { cartId } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    await deactivateCart(cartId);
    const newCart = await getOrCreateCart(userId);

    res.status(200).json({
      message: 'Cart deactivated and new cart created',
      cart: newCart,
    });
  } catch (error) {
    console.error('Error in handleInvalidCart controller:', error);
    res.status(500).json({ error: 'Failed to handle invalid cart' });
  }
};

export const addItemToCart = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { productId, quantity } = req.body;
    const addedItem = await addItem(parseInt(id), productId, quantity);
    res
      .status(201)
      .json({ message: 'Add item to cart success', cartItem: addedItem });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const { id, itemId } = req.params;
    const { quantity } = req.body;
    const modifiedItem = await updateItem(parseInt(itemId), quantity);
    res
      .status(200)
      .json({ message: 'Update item success', updatedItem: modifiedItem });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update cart item' });
  }
};

export const removeCartItem = async (req: Request, res: Response) => {
  try {
    const { id, itemId } = req.params;
    const removalResult = await removeItem(parseInt(itemId));
    res.status(204).json(removalResult);
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove cart item' });
  }
};
