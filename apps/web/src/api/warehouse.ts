import axios from 'axios';
import { haversineDistance } from '@/utils/getClosestStore';
import { getUserCurrentLocation } from '@/utils/getUserCurrentLocation';

export const getClosestWarehouse = async () => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/warehouses/`,
  );
  const data = res.data.warehouses;
  const userLoc = getUserCurrentLocation();
  let distance = 0;
  let wareId = 1; //default store
  data?.forEach((warehouse: any) => {
    const result = haversineDistance(
      [userLoc.lon, userLoc.lat],
      [warehouse.longitude, warehouse.latitude],
    );
    if (distance < result) {
      distance = result;
      wareId = warehouse.id;
    }
  });

  return wareId;
};
