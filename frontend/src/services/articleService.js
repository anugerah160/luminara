import api from "./api"

export const getAllArticles = async () => {
  const res = await api.get("/articles")
  return res.data
}
export const getArticleBySlug = async (slug) => {
  const res = await api.get(`/articles/${slug}`)
  return res.data
}
export const searchArticles = async (params = {}) => {
  const res = await api.get("/articles/search", {
    params,
  })
  return res.data
}
export const getArticlesByAuthor = async (authorId) => {
  const res = await api.get(`/authors/${authorId}`)
  return res.data
}

export const getCommentsById = async (articleId) => {
  const res = await api.get(`/comments/${articleId}`)
  return res.data
}

export const postComment = async (articleId, comment) => {
  const res = await api.post(`/comments`, {
    article_id: articleId,
    comment: comment,
  })
  return res.data
}

export const getMyArticles = async () => {
  const res = await api.get("my-articles")
  return res.data
}
export const postArticle = async (articleData) => {
  const res = await api.post("/articles", articleData)
  return res.data
}

export const deleteArticle = async (id) => {
  const res = await api.delete(`/articles/${id}`)
  return res.data
}

export const updateArticle = async (id, data) => {
  const res = await api.post(`/articles/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return res.data
}
