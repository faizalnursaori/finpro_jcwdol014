import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCategories = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = (req.query.search as string) || '';

  const skip = (page - 1) * limit;

  try {
    const categories = await prisma.category.findMany({
      where: {
        OR: [{ name: { contains: search } }, { slug: { contains: search } }],
      },
      skip,
      take: limit,
    });

    const totalCategories = await prisma.category.count({
      where: {
        OR: [{ name: { contains: search } }, { slug: { contains: search } }],
      },
    });
    const totalPages = Math.ceil(totalCategories / limit);

    res.status(200).json({
      categories,
      meta: {
        currentPage: page,
        totalPages,
        totalCategories,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch categories', error });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
    });

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: 'Category not found' });
    }

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch category', error });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  const { name, slug } = req.body;

  try {
    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [{ slug }, { name }],
      },
    });

    if (existingCategory) {
      return res.status(400).json({
        message: 'Category with the same name or slug already exists.',
      });
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
      },
    });

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to create category', error });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, slug } = req.body;

  try {
    const category = await prisma.category.update({
      where: { id: Number(id) },
      data: {
        name,
        slug,
      },
    });

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to update category', error });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.category.delete({
      where: { id: Number(id) },
    });

    res
      .status(200)
      .json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to delete category', error });
  }
};
