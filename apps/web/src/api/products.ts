import axios from 'axios';

const base_api = process.env.BASE_API_PRODUCTS;

export const getProducts = async () => {
  try {
    const res = await axios.get(`${base_api}/products/`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
