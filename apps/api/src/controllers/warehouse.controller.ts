import { Request, Response } from 'express';
import prisma from '@/prisma';
import * as warehouseService from '@/services/warehouse.service';

// export const createWarehouse = async (req: Request, res: Response) => {
//   try {
//     await warehouseService.createWarehouse(req.body);
//     res.status(201).json({ message: 'Warehouse created successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Internal server error', error });
//   }
// };

export const getWarehouse = async (req: Request, res: Response) => {
  try {
      const {id} = req.params
      const warehouse = await prisma.warehouse.findUnique({
          where:{
              id: Number(id)
          },
          include:{
            city:true,
            province:true,
            user: true
          }
      })
      res.status(200).json({message: 'Success getting the warehouse datas', warehouse})
  } catch (error) {
      res.status(500).json({message: 'Internal server error', error})
  }
};


export const createWarehouse = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    const warehouse = await prisma.warehouse.create({
      data: {
        ...data,
        cityId: Number(data.cityId),
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        storeRadius: parseFloat(data.storeRadius)
      },
      include: {
        user: true,
        city: true,
        province: true,
      },
    });

    res
      .status(200)
      .json({ message: 'Success creating the warehouse.', warehouse });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.', error });
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

// export const updateWarehouse = async (req: Request, res: Response) => {
//   try {
//     const id = Number(req.params.id);
//     await warehouseService.updateWarehouseById(id, req.body);
//     res.status(200).json({ message: 'Warehouse updated successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Internal server error', error });
//   }
// };

export const updateWarehouse = async (req: Request, res: Response) => {
  try {
    let data = req.body;
    const { id } = req.params;
    if(data.cityId){
      data = {...data, cityId: Number(data.cityId)}
    }
    if(data.latitude){
      data = {...data, latitude: parseFloat(data.latitude)}
    }
    if(data.longitude){
      data = {...data, longitude: parseFloat(data.longitude)}
    }
    if(data.storeRadius){
      data = {...data, storeRadius: parseFloat(data.storeRadius)}
    }

    const warehouse = await prisma.warehouse.update({
      where: {
        id: Number(id),
      },
      data,
    });

    res
      .status(200)
      .json({ message: 'Success updating the warehouse.', warehouse });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.', error });
  }
};

// export const deleteWarehouse = async (req: Request, res: Response) => {
//   try {
//     const id = Number(req.params.id);
//     await warehouseService.deleteWarehouseById(id);
//     res.status(200).json({ message: 'Warehouse deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Internal server error', error });
//   }
// };

export const deleteWarehouse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const warehouse = await prisma.warehouse.delete({
      where: {
        id: Number(id),
      },
    });
      

    res.status(200).json({ message: 'Success deleting the warehouse.' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.', error });
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

export const getWarehousesByPage = async (req: Request, res: Response) =>{
  try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const search = (req.query.search as string) || '';

      const skip = (page - 1) * limit;

      const warehouses = await prisma.warehouse.findMany({
        where: {
          OR: [
            { name: { contains: search } }
          ],
        },
        include:{
          province:true,
          city:true,
          user:true
        },
        skip: skip,
        take: limit,
      });

      const totalWarehouse = await prisma.warehouse.count({
        where: {
          OR: [
            { name: { contains: search } },
          ],
        },
      });

      res.status(200).json({
        warehouses,
        meta: {
          totalItems: totalWarehouse,
          totalPages: Math.ceil(totalWarehouse / limit),
          currentPage: page,
          perPage: limit,
        },
      });
    } catch (error) {
      console.error('Error getting warehouses:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
}
