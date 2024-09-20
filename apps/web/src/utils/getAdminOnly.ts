'use server'
import axios from "axios";
import { cookies } from "next/headers";


export const getAdminOnly = async () =>{
    const token = cookies().get('next-auth.session-token')?.value;
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/admins/admins`, {
            headers: {Authorization : `Bearer ${token}`}
        })
        return {
            ok: true,
            data: res.data,
          };
    } catch (error) {
        console.error('Error getting Admins data:', error);
    return {
      ok: false,
      message: 'Failed to get Admins data',
    };
    }
}