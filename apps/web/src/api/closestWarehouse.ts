import axios from 'axios';
import { haversineDistance } from '@/utils/getClosestStore';

export const getClosestWarehouse = async () => {
  let lon = 0
  let lat = 0

  const success = async (res: any) => {
    lon = (Number(res.coords.longitude)) ;
    lat =(Number(res.coords.latitude));
  };

  const fail = (res: any) => {
    console.log(res);
  };


 navigator.geolocation.getCurrentPosition(success, fail)
console.log(lon, lat);

  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/warehouses/`,
    );
    const data = res.data.warehouses;
    
    if(lon == 0 && lat == 0){
      return 1
    };

    let distance = 0;
    let wareId = 1; //default store
    data?.forEach((warehouse: any) => {
      const result = haversineDistance(
        [lon, lat],
        [warehouse.longitude, warehouse.latitude],
      );
      
      if (distance === 0) {
        distance = result;
        wareId = warehouse.id;
      } else if (distance > result) {
        distance = result;
        wareId = warehouse.id;
      }
    });
    
    return wareId;
  } catch (error) {
    console.error('Error getting closest warehouse:', error);
  }
};