import axios from 'axios';
import { haversineDistance } from '@/utils/getClosestStore';
import { getUserCurrentLocation } from '@/utils/getUserCurrentLocation';

export const getClosestWarehouse = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}warehouses/`,
      );
      const data = res.data.warehouses;
      const userLoc =  getUserCurrentLocation();
  
      let closestDistance = Infinity; // Atur jarak default ke yang sangat besar
      let closestWarehouseId = null; // Default warehouse null sampai ditemukan yang terdekat
  
      data?.forEach((warehouse: any) => {
        const distance = haversineDistance(
          [userLoc?.lon as number, userLoc?.lat as number],
          [warehouse.longitude, warehouse.latitude],
        );
  
        // Simpan gudang yang memiliki jarak terdekat
        if (distance < closestDistance) {
          closestDistance = distance;
          closestWarehouseId = warehouse.id;
        }
      });
  
      return closestWarehouseId; // Mengembalikan ID gudang terdekat
    } catch (error) {
      console.error('Error getting closest warehouse:', error);
    }
  };