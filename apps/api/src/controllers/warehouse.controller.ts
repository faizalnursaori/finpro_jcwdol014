import { Request, Response } from "express";
import prisma from "@/prisma";



export const getWarehouses = async(req: Request, res: Response) => {
    try {
        const warehouses = await prisma.warehouse.findMany()
        res.status(200).json({message: 'Success Getting All Warehouses.', warehouses})
    } catch (error) {
        res.status(500).json({message: 'Internal server error', error})
    }
}