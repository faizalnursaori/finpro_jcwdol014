import { Request, Response } from 'express';
import prisma from '@/prisma';
import axios from 'axios';

export const getProvince = async (req: Request, res: Response) => {
  try {
    console.log('nyoba nge fetch');
    
    const  {data}  = await axios.get(
      'https://api.rajaongkir.com/starter/province',
      {
        headers: {
          key: '52f9fdf3233f8e61a6883ad3d87abdff',
          'Content-Type': 'application/json',
        },
      },
    );
    console.log('hasil fetch province ', data);
    
    
    res.status(200).json({ data });
  } catch (error) {
      res.status(500).json({ message: 'Error getting province.', error });
  }
};

export const getCities = async (req: Request, res: Response) => {
  try {
    const { data } = await axios.get(
      'https://api.rajaongkir.com/starter/city',
      {
        headers: {
          key: '52f9fdf3233f8e61a6883ad3d87abdff',
          'Content-Type': 'application/json',
        },
      },
    );

    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.', error });
  }
};

export const getCity = async (req: Request, res: Response) => {
  try {
    const { provinceId } = req.params;
    const { data } = await axios.get(
      `https://api.rajaongkir.com/starter/city?province=${provinceId}`,
      {
        headers: {
          key: '52f9fdf3233f8e61a6883ad3d87abdff',
          'Content-Type': 'application/json',
        },
      },
    );
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.', error });
  }
};

export const createProvince = async (req: Request, res: Response) => {
  try {
    const { provinceId, provinceName } = req.body;

    const province = await prisma.province.create({
      data: {
        id: Number(provinceId),
        name: provinceName,
      },
    });

    res.status(201).json({province})
  } catch (error) {
    res.status(500).json({message: "Internal server error", error})
  }
};

export const createCity = async (req: Request, res: Response) => {
  try {
    const { cityId , cityName ,provinceId } = req.body;

    const city = await prisma.city.create({
      data: {
        id: Number(cityId),
        name: cityName,
        provinceId: Number(provinceId)
      },
      include:{
        province: true
      }
    });

    res.status(201).json({city})
  } catch (error) {
    res.status(500).json({message: "Internal server error", error})
  }
};

export const getShipping = async (req: Request, res: Response) => {
  try {
    const reqData= req.body;
    const nyoba = {
      origin: 1,
      destination: 3,
      weight: 1500,
      courier: "jne"
    }
    
    const response = await axios.post(
      `https://api.rajaongkir.com/starter/cost`,{...reqData},
      {
        headers: {
          key: '52f9fdf3233f8e61a6883ad3d87abdff',
          'Content-Type': 'application/json',
        },
      },
    );
    console.log(response.data.rajaongkir.results);
    
    const hasil = response.data.rajaongkir.results
    
    res.status(200).json({ hasil });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.', error });
  }
};