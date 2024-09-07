import axios from "axios";
const base_api = 'http://localhost:8000/api'
import { haversineDistance } from "@/utils/getClosestStore";
import { getUserCurrentLocation } from "@/utils/getUserCurrentLocation";

export const getClosestWarehouse = async () =>{
    const res = await axios.get(`${base_api}/warehouses/`)
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