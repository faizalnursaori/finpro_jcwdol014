'use server'
import axios from 'axios';
import { cookies } from 'next/headers';


export const createAddress = async (data: any) => {
  const token = cookies().get('next-auth.session-token')?.value;
  if (!token) {
    return { ok: false, message: 'Unauthenticated' };
  }
  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/addresses/new`,
      data,{
        headers: {
            Authorization: `Bearer ${token}`,
          }
      }
    );
    console.log('success creating new address');
  } catch (error) {
    console.log(error);
  }
};

export const editAddress = async (data: any, id:string) => {
  const token = cookies().get('next-auth.session-token')?.value;
  if (!token) {
    return { ok: false, message: 'Unauthenticated' };
  }
  try {
    await axios.put(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/addresses/edit/${id}`,
      data,{
        headers: {
            Authorization: `Bearer ${token}`,
          }
      }
    );
    console.log('success updating the address');
  } catch (error) {
    console.log(error);
  }
};

export const getUserAddresses = async (id: any) => {
  
  const token = cookies().get('next-auth.session-token')?.value;
  if (!token) {
    return { ok: false, message: 'Unauthenticated' };
  }
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/addresses/${id}`,{
        headers: {
            Authorization: `Bearer ${token}`,
          }
      }
    );
    return res.data
  } catch (error) {
    console.log(error);
  }
};

export const deleteUserAddresses = async (id: any) => {
  const token = cookies().get('next-auth.session-token')?.value;
  if (!token) {
    return { ok: false, message: 'Unauthenticated' };
  }
  try {
    await axios.delete(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/addresses/${id}`,{
        headers: {
            Authorization: `Bearer ${token}`,
          }
      }
    );
    console.log('success deleting address.');
    
  } catch (error) {
    console.log(error);
  }
};
