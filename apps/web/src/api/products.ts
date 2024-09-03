import axios from "axios";

const base_api = 'http://localhost:8000/api'

export const getProducts = async (id: number | undefined) =>{
    const res = await axios.get(`${base_api}/products`)
    // const data = res.data.data.filter((product: {warehouseId: number}) => {
    //     return product.warehouseId == id
    // })
  console.log(id);
  
 return res.data.data
}