'use server';

import axios from 'axios';

const API_URL = process.env.BASE_API_VOUCHERS;

export const fetchVouchers = async () => {
  try {
    const response = await axios.get(API_URL as string);
    return response.data;
  } catch (error) {
    console.error('Error fetching vouchers:', error);
    throw error;
  }
};

export const deleteVoucherById = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting voucher:', error);
    throw error;
  }
};

export const createVoucher = async (voucherData: any) => {
  try {
    await axios.post(`${API_URL}`, voucherData);
  } catch (error) {
    throw new Error('Error creating voucher');
  }
};

export const applyVoucher = async (voucherCode: string, cartId: number) => {
  try {
    const response = await axios.post(`${API_URL}/apply`, {
      voucherCode,
      cartId,
    });
    return response.data;
  } catch (error) {
    console.error('Error applying voucher:', error);
    throw new Error(error.response?.data?.message || 'Failed to apply voucher');
  }
};
