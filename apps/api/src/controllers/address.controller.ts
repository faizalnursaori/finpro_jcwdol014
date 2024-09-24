import { Request, Response } from 'express';
import prisma from '@/prisma';

export const createAddress = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    if(data?.isPrimary == true) {
      await prisma.address.updateMany({
        data:{
          isPrimary: false
        }
      })
  }

    const address = await prisma.address.create({
      data: {
        ...data,
        cityId: Number(data.cityId),
      },
      include: {
        user: true,
        province: true,
        city: true,
      },
    });
    res.status(201).json({ message: 'Address created.', address });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error..' });
  }
};

export const getUserAddresses = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const address = await prisma.address.findMany({
      where: {
        userId: Number(id),
      },
      include: {
        city: true,
        province: true,
      },
    });

    res
      .status(200)
      .json({ message: 'Success getting all the users address', address });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(id);

    await prisma.address.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).json({ message: 'Success deleting address.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed deleting address.' });
  }
};

export const editAddress = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const { id } = req.params;

    if(data?.cityId) {
        data.cityId = Number(data.cityId)
    }

    if(data?.isPrimary == true) {
        await prisma.address.updateMany({
          data:{
            isPrimary: false
          }
        })
    }

    const address = await prisma.address.update({
      where: {
        id: Number(id),
      },
      data: {
        ...data

      },
      include: {
        user: true,
        province: true,
        city: true,
      },
    });
    res.status(201).json({ message: 'Address updated.' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error...', error });
  }
};

export const getUserAddressById = async (req: Request, res: Response) => {
  try {
    const {id} = req.params

  const address = await prisma.address.findUnique({
    where:{
      id: Number(id)
    }
  })

  res.status(200).json({address})
  } catch (error) {
    res.status(500).json({message: 'Error getting the address', error})
  }
}
