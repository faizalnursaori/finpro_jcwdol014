'use server'
import axios from "axios";
import { cookies } from "next/headers";


export const getCart = async (id: string) => {
    try {
        const token = cookies().get('next-auth.session-token')?.value;
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/carts/${id}`,{
        headers: {Authorization: `Bearer ${token}` }
    })

    return res.data
    } catch (error) {
        console.log(error);
        
    }
}