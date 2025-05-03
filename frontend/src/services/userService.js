import api from './api';

export const getTopAuthors = async () => {
  const res = await api.get("/topauthors");
  return res.data;
};
