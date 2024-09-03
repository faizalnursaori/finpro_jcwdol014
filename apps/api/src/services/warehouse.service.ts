import {
  PrismaClient,
  TransferStatus,
  Prisma,
  Warehouse,
} from '@prisma/client';
import prisma from '@/prisma';

export const createWarehouse = async (data: Prisma.WarehouseCreateInput) => {
  await prisma.warehouse.create({ data });
};

export const getWarehouses = async (
  page: number,
  limit: number,
  filter: string,
  sortBy: string,
  orderBy: string,
) => {
  return await prisma.warehouse.findMany({
    where: {
      OR: [
        { user: { username: { contains: filter } } },
        { name: { contains: filter } },
        { address: { contains: filter } },
        { postalCode: { contains: filter } },
        { province: { name: { contains: filter } } },
        { city: { name: { contains: filter } } },
      ],
    },
    include: {
      province: { select: { id: true, name: true } },
      city: { select: { id: true, name: true } },
      user: { select: { id: true, username: true } },
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { [sortBy]: orderBy },
  });
};

export const countWarehouses = async (filter: string) => {
  return await prisma.warehouse.count({
    where: {
      OR: [
        { user: { username: { contains: filter } } },
        { name: { contains: filter } },
        { address: { contains: filter } },
        { postalCode: { contains: filter } },
        { province: { name: { contains: filter } } },
        { city: { name: { contains: filter } } },
      ],
    },
  });
};

export const findWarehouseById = async (id: number) => {
  return await prisma.warehouse.findUnique({
    where: { id },
    include: {
      province: { select: { id: true, name: true } },
      city: { select: { id: true, name: true } },
      user: { select: { id: true, username: true } },
    },
  });
};

export const deleteWarehouseById = async (id: number) => {
  await prisma.warehouse.delete({ where: { id } });
};

export const updateWarehouseById = async (
  id: number,
  data: Prisma.WarehouseUpdateInput,
) => {
  await prisma.warehouse.update({ where: { id }, data });
};

export const findNearestWarehouse = async (body: any) => {
  const { latitude, longitude } = body;

  const warehouses = await prisma.warehouse.findMany({
    select: {
      id: true,
      name: true,
      latitude: true,
      longitude: true,
      city: true,
    },
  });

  if (warehouses.length === 0) {
    throw new Error('No warehouses found');
  }

  const validWarehouses = warehouses.filter(
    (w) => w.latitude !== null && w.longitude !== null,
  );

  if (validWarehouses.length === 0) {
    throw new Error('No warehouses with valid coordinates found');
  }

  let nearestWarehouse = validWarehouses[0];
  let shortestDistance = getDistance(
    latitude,
    longitude,
    nearestWarehouse.latitude!,
    nearestWarehouse.longitude!,
  );

  for (let i = 1; i < validWarehouses.length; i++) {
    const warehouse = validWarehouses[i];
    const distance = getDistance(
      latitude,
      longitude,
      warehouse.latitude!,
      warehouse.longitude!,
    );
    if (distance < shortestDistance) {
      shortestDistance = distance;
      nearestWarehouse = warehouse;
    }
  }

  return {
    warehouseId: nearestWarehouse.id,
    name: nearestWarehouse.name,
    distance: shortestDistance,
    city: nearestWarehouse.city,
    latitude: nearestWarehouse.latitude,
    longitude: nearestWarehouse.longitude,
  };
};

export const findWarehouseByUserId = async (id: number) => {
  return await prisma.warehouse.findUnique({
    where: { userId: id },
    include: {
      province: { select: { id: true, name: true } },
      city: { select: { id: true, name: true } },
      user: { select: { id: true, username: true } },
    },
  });
};

const getDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  if (lat2 === null || lon2 === null) return Infinity;

  const R = 6371; // Radius bumi dalam km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Jarak dalam km
};

export const findWarehousesWithStock = async (
  tx: PrismaClient,
  productId: number,
  excludeWarehouseId: number,
) => {
  return tx.productStock.findMany({
    where: {
      productId,
      stock: { gt: 0 },
      NOT: { warehouseId: excludeWarehouseId },
    },
    include: { product: true, warehouse: true },
  });
};

export const sortWarehousesByDistance = (
  warehouses: (Warehouse & {
    product: { name: string };
    warehouse: { latitude: number | null; longitude: number | null };
  })[],
  latitude: number,
  longitude: number,
) => {
  return warehouses.sort((a, b) => {
    const distanceA = getDistance(
      latitude,
      longitude,
      a.warehouse.latitude!,
      a.warehouse.longitude!,
    );
    const distanceB = getDistance(
      latitude,
      longitude,
      b.warehouse.latitude!,
      b.warehouse.longitude!,
    );
    return distanceA - distanceB;
  });
};

export const createStockTransfer = async (
  tx: PrismaClient,
  productId: number,
  quantity: number,
) => {
  return tx.stockTransfer.create({
    data: {
      stockRequest: quantity,
      stockProcess: quantity,
      note: `Stock transfer for order fulfillment`,
      productId,
      status: TransferStatus.COMPLETED,
    },
  });
};
