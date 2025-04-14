import api from './api';

export const getAllArticles = async () => {
  const res = await api.get('/articles');
  return res.data;
};
export const getArticleBySlug = async (slug) => {
  const res = await api.get(`/articles/${slug}`)
  return res.data
}
export const searchArticles = async (params = {}) => {
  const res = await api.get('/articles/search', {
    params,
  });
  return res.data;
};