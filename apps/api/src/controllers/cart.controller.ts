import { Request, Response } from 'express';
import {
  createNewCart,
  fetchCart,
  addItem,
  updateItem,
  removeItem,
} from '../services/cart.services';

export const createCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const newCart = await createNewCart(userId);
    res.status(201).json({ message: 'Create cart success', cart: newCart });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create cart' });
  }
};

export const getCart = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const foundCart = await fetchCart(parseInt(id));
    if (!foundCart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    res.status(200).json({ message: 'Get cart success', cart: foundCart });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get cart' });
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
