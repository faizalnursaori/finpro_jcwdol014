import axios from 'axios';

const base_api = 'http://localhost:8000/api/users';

export const editUser = async (id: string, data: {}) => {
  const token = localStorage.getItem('token');
  const res = await axios.put(`${base_api}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const editUserByToken = async (idToken: any, data: {}) => {
  const res = await axios.put(`${base_api}/register/${idToken}`, data);

  console.log(res);
};

export const editUserPassword = async (id: string, data: {}) => {
  const token = localStorage.getItem('token');
  const res = await axios.put(`${base_api}/password/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const resetUserPassword = async (id: any, data: {}) => {
  const res = await axios.put(`${base_api}/reset-password/${id}`, data);
};

export const getUserByEmail = async(email:string) => {
  const res = await axios.get(`${base_api}/${email}`)
  return res.data
}

export const createUser = async (data: any) => {
  const res = await axios.post(`${base_api}/`, data)
  return res.data
}
