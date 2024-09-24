// src/controllers/productController.ts

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ProductController {
  async getAllProducts(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const search = (req.query.search as string) || '';

      const skip = (page - 1) * limit;

      const products = await prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: search } },
            { slug: { contains: search } },
            { description: { contains: search } },
            { category: { name: { contains: search } } },
          ],
        },
        select: {
          id: true,
          slug: true,
          name: true,
          description: true,
          price: true,
          categoryId: true,
          createdAt: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          productImages: {
            select: {
              url: true,
            },
          },
          productStocks: {
            include: {
              warehouse: true,
            },
          },
        },
        skip: skip,
        take: limit,
      });

      const totalProducts = await prisma.product.count({
        where: {
          OR: [
            { name: { contains: search } },
            { slug: { contains: search } },
            { description: { contains: search } },
            { category: { name: { contains: search } } },
          ],
        },
      });

      res.status(200).json({
        products,
        meta: {
          totalItems: totalProducts,
          totalPages: Math.ceil(totalProducts / limit),
          currentPage: page,
          perPage: limit,
        },
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Internal Server Error' });
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
      if (!name || !price || !categoryId) {
        return res
          .status(400)
          .json({ message: 'Name, price, and categoryId are required.' });
      }

      const existingProduct = await prisma.product.findFirst({
        where: {
          OR: [{ name }],
        },
      });

      if (existingProduct) {
        return res.status(400).json({
          message: 'Product with the same name or slug already exists.',
        });
      }

      const product = await prisma.product.create({
        data: {
          name,
          slug: name.toLowerCase().replace(/ /g, '-'),
          description,
          price: parseFloat(price),
          categoryId: parseInt(categoryId),
        },
      });

      const images = req.files as Express.Multer.File[];
      const imageUrls = images.map((image) => ({
        name: image.originalname,
        url: `/images/${image.filename}`,
        productId: product.id,
      }));

      await prisma.productImage.createMany({
        data: imageUrls,
      });

      res
        .status(201)
        .json({ message: 'Product created successfully', product });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create product' });
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

      const uploadedFiles = req.files as Express.Multer.File[];

      if (uploadedFiles && uploadedFiles.length > 0) {
        await prisma.productImage.deleteMany({
          where: { productId: product.id },
        });

        const images = req.files as Express.Multer.File[];
        const imageUrls = images.map((image) => ({
          name: image.originalname,
          url: `/images/${image.filename}`,
          productId: product.id,
        }));

        await prisma.productImage.createMany({
          data: imageUrls,
        });
      }

      res.json({ product, message: 'Product updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error updating product' });
    }
  }

  async deleteProduct(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await prisma.stockTransferLog.deleteMany({
        where: { productStock: { productId: parseInt(id) } },
      });

      await prisma.productStock.deleteMany({
        where: { productId: parseInt(id) },
      });

      await prisma.cartItem.deleteMany({
        where: { productId: parseInt(id) },
      });

      await prisma.orderItem.deleteMany({
        where: { productId: parseInt(id) },
      });

      await prisma.productImage.deleteMany({
        where: { productId: parseInt(id) },
      });

      await prisma.product.delete({
        where: { id: parseInt(id) },
      });

      res.status(200).json({ message: 'Product deleted successfully.' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting product' });
    }
  }

  async getProductBySlug(req: Request, res: Response) {
    const { slug } = req.params;

    try {
      const product = await prisma.product.findUnique({
        where: { slug },
        include: {
          productStocks: {
            include: {
              warehouse: true,
            },
          },
          productImages: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json({
        product,
        message: 'Product fetch successfully',
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch product' });
    }
  }
}
