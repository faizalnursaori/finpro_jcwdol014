import { Request, Response } from 'express';
import prisma from '@/prisma';

export const getWarehouses = async (req: Request, res: Response) => {
  try {
    const warehouses = await prisma.warehouse.findMany();
    res
      .status(200)
      .json({ message: 'Success Getting All Warehouses.', warehouses });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

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

export const deleteWarehouse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const warehouse = await prisma.warehouse.delete({
      where: {
        id: Number(id),
      },
    });
    console.log(warehouse);
    

    res.status(200).json({ message: 'Success deleting the warehouse.' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.', error });
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
