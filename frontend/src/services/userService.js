import api from './api';

export const registerUser = async (data) => {
  const res = await api.post('/register', data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await api.post('/login', data);
  return res.data;
};

export const getTopAuthors = async () => {
  const res = await api.get("/topauthors");
  return res.data;
};
