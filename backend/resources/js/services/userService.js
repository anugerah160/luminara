import api from "./api"

export const registerUser = async (data) => {
  const res = await api.post("/register", data)
  return res.data
}

export const loginUser = async (data) => {
  const res = await api.post("/login", data)
  return res.data
}

export const getTopAuthors = async () => {
  const res = await api.get("/topauthors")
  return res.data
}

export const getUserById = async (id) => {
  const res = await api.get(`/users/${id}`)
  return res.data
}

/**
 * @param {string} id - User ID
 * @param {FormData} data - FormData object
 */
export const updateUser = async (id, data) => {
  const res = await api.post(`/users/${id}`, data)
  return res.data
}
