import axios from "axios"

export const getShippingCost = async (data: any) =>{
    try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/locations/cost`, data)
    return res.data
    } catch (error) {
        console.log(error);
        
    }
}