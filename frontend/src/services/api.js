import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
})

export const analyzeText = async (text, url = null) => {
  const response = await api.post('/analyze', { text, url })
  return response.data
}

export const getHistory = async (limit = 50, offset = 0) => {
  const response = await api.get('/analyze/history', { params: { limit, offset } })
  return response.data
}

export const deleteHistoryItem = async (id) => {
  const response = await api.delete(`/analyze/history/${id}`)
  return response.data
}

export default api

