import axios from "axios";
import { haversineDistance } from "@/utils/getClosestStore";
import { getUserCurrentLocation } from "@/utils/getUserCurrentLocation";
import 'dotenv/config'
import { cookies } from 'next/headers';



const token = cookies().get('next-auth.session-token')?.value;

export const getClosestWarehouse = async () =>{
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}warehouses/`)
    const data = res.data.warehouses
    const userLoc =  getUserCurrentLocation()
    let distance = 0
    let wareId = 1 //default store
    data?.forEach((warehouse:any) => {
      const result = haversineDistance([userLoc.lon, userLoc.lat], [warehouse.longitude, warehouse.latitude])
       if(distance < result){
        distance = result
        wareId = warehouse.id
      }
    })

    return wareId
    
}

export const getWarehouse = async (id:number) =>{
  if (!token) {
    return { ok: false, message: 'Unauthenticated' };
  }

  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}warehouses/${id}`,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })

    return res.data

  } catch (error) {
    console.error('Error getting Warehouse data:', error);
    return {
      ok: false,
      message: 'Fail to get Warehouse data ',
    };
    
  }
}

export const createWarehouse = async (data:any) =>{
  if (!token) {
    return { ok: false, message: 'Unauthenticated' };
  }

  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}warehouses/create`, data,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })

    console.log('Success creating new warehouse');
  
    return res.data

  } catch (error) {
    console.error('Error creating new Warehouse:', error);
    return {
      ok: false,
      message: 'Fail to create a new Warehouse.',
    };
    
  }
}

export const editWarehouse = async (data:any, id: number) =>{
  if (!token) {
    return { ok: false, message: 'Unauthenticated' };
  }

  try {
    const res = await axios.put(`${process.env.NEXT_PUBLIC_BASE_API_URL}warehouses/update/${id}`, data,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })

    console.log('Success updating the warehouse data.');
  
    return res.data

  } catch (error) {
    console.error('Error updating the Warehouse data:', error);
    return {
      ok: false,
      message: 'Fail to update the Warehouse.',
    };
    
  }
}

export const deleteWarehouse = async (id: number) =>{
  if (!token) {
    return { ok: false, message: 'Unauthenticated' };
  }

  try {
    const res = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_API_URL}warehouses/delete/${id}`,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })

    console.log('Success deleting the warehouse.');
  
    return res.data

  } catch (error) {
    console.error('Error deleting the Warehouse:', error);
    return {
      ok: false,
      message: 'Fail to delete the Warehouse.',
    };
    
  }
}
