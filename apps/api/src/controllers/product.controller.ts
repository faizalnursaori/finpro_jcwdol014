// src/controllers/productController.ts

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ProductController {
  async getAllProducts(req: Request, res: Response) {
    try {
      console.log('Fetching all products with stock information...');
      const products = await prisma.product.findMany({
        include: {
          category: true,
          productImages: true,
          productStocks: {
            include: {
              warehouse: true,
            },
          },
        },
      });
      console.log('Products fetched:', products.length);
      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Error fetching products' });
    }
  }

  async getProductById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const product = await prisma.product.findUnique({
        where: { id: parseInt(id) },
        include: {
          category: true,
          productImages: true,
          productStocks: {
            include: {
              warehouse: true,
            },
          },
        },
      });
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ error: 'Error fetching product' });
    }
  }

  async createProduct(req: Request, res: Response) {
    const { name, description, price, categoryId } = req.body;
    try {
      const product = await prisma.product.create({
        data: {
          name,
          description,
          price: parseFloat(price),
          categoryId: parseInt(categoryId),
          slug: name.toLowerCase().replace(/ /g, '-'),
        },
      });
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: 'Error creating product' });
    }
  }

  async updateProduct(req: Request, res: Response) {
    const { id } = req.params;
    const { name, description, price, categoryId } = req.body;
    try {
      const product = await prisma.product.update({
        where: { id: parseInt(id) },
        data: {
          name,
          description,
          price: parseFloat(price),
          categoryId: parseInt(categoryId),
          slug: name.toLowerCase().replace(/ /g, '-'),
        },
      });
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Error updating product' });
    }
  }

  async deleteProduct(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await prisma.product.delete({
        where: { id: parseInt(id) },
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error deleting product' });
    }
  }
}
