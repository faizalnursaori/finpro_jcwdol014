import axios from "axios"

export const getProvince = async () =>{
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/locations/province`)
    return res.data
}

export const getCities = async () =>{
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/locations/city`)
    return res.data
}

export const getCity = async (provinceId : number) => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/locations/city/${provinceId}`)
    return res.data
}