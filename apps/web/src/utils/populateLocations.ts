import axios from 'axios';
import { getProvince, getCities } from './getLocation';

export const populateProvince = async () => {
  try {
    const { data } = await getProvince();
    const provinces = data?.rajaongkir?.results;
    provinces.forEach(async (province: any) => {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/locations/province/create`,
        { provinceId: province.province_id, provinceName: province.province },
      );
    });
    console.log("success populating the province database.");
    
  } catch (error) {
    console.log(error);
    
  }
};

export const populateCity = async () => {
  try {
    const { data } = await getCities();
    const cities = await data?.rajaongkir?.results;
    cities.forEach(async (city: any) => {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/locations/city/create`,
        { provinceId: city.province_id, cityName: city.city_name, cityId: city.city_id },
      );
    });
    console.log("success populating the cities database.");
  } catch (error) {
    console.log(error);
    
  }
};