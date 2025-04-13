import api from './api';

export const getAllArticles = async () => {
  const res = await api.get('/articles');
  return res.data;
};
