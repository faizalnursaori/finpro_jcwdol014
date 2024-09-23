import { Request, Response } from 'express';
import * as warehouseService from '@/services/warehouse.service';

export const createWarehouse = async (req: Request, res: Response) => {
  try {
    await warehouseService.createWarehouse(req.body);
    res.status(201).json({ message: 'Warehouse created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const getWarehouses = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const filter = String(req.query.filter || '');
    const sortBy = String(req.query.sortBy || 'id');
    const orderBy = String(req.query.orderBy || 'asc');

    const warehouses = await warehouseService.getWarehouses(
      page,
      limit,
      filter,
      sortBy,
      orderBy,
    );
    const total = await warehouseService.countWarehouses(filter);

    res.status(200).json({
      message: 'Success Getting All Warehouses.',
      warehouses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const getWarehouseById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const warehouse = await warehouseService.findWarehouseById(id);
    if (!warehouse) {
      return res.status(404).json({ message: 'Warehouse not found' });
    }
    res.status(200).json({ message: 'Success Getting Warehouse', warehouse });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const updateWarehouse = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await warehouseService.updateWarehouseById(id, req.body);
    res.status(200).json({ message: 'Warehouse updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const deleteWarehouse = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await warehouseService.deleteWarehouseById(id);
    res.status(200).json({ message: 'Warehouse deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const findNearestWarehouse = async (req: Request, res: Response) => {
  try {
    const nearestWarehouse = await warehouseService.findNearestWarehouse(
      req.body,
    );
    res.status(200).json({
      message: 'Nearest warehouse found',
      warehouse: nearestWarehouse,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const getWarehouseByUserId = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.userId);
    const warehouse = await warehouseService.findWarehouseByUserId(id);
    if (!warehouse) {
      return res
        .status(404)
        .json({ message: 'Warehouse not found for this user' });
    }
    res.status(200).json({ message: 'Success Getting Warehouse', warehouse });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};
