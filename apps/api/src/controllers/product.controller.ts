import { Request, Response } from "express";
import prisma from "@/prisma";


export const getProducts = async (req:Request, res: Response) =>{
    try {
    const data = await prisma.productStock.findMany({
        include:{
            product: {
                include: {
                    productImages: true
                }
            }
        }
    })

    res.status(200).json({message: 'Success getting products.', data})
    } catch (error) {
        res.status(500).json({message: 'Internal server error', error})
    }



}