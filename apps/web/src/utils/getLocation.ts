import axios from 'axios';
export const getProvince = async () => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/locations/province`,
      {
        headers: { 'Content-Type': 'aplication/json' },
      },
    );

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getCities = async () => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/locations/city`,
    );
    
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getCity = async (provinceId: number) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/locations/city/${provinceId}`,
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
