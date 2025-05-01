import api from './api';

export const getAllCategories = async () => {
  const res = await api.get("/categories");
  return res.data;
};

export const getCategoryByName = async (name) => {
  const res = await api.get(`/categories/${name}`);
  return res.data;
};
