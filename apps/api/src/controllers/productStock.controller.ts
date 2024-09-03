import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ProductStockController{
    async getAllProductStocks(req: Request, res: Response) {
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

}