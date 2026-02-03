import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
})

export const analyzeText = async (text, url = null) => {
  try {
    const response = await api.post('/analyze', { text, url })

    if (response.data && response.data.success) {
      return response.data.data
    }

    // API returned 200 but success=false
    const apiError = response.data?.error || {}
    const details = Array.isArray(apiError.details) ? apiError.details.map(d => d.msg || JSON.stringify(d)).join('; ') : apiError.details
    const apiMsg = apiError.message + (details ? `: ${details}` : '') || 'Analysis failed'
    throw new Error(apiMsg)
  } catch (err) {
    // Axios network or non-2xx errors
    if (err.response && err.response.data && err.response.data.error) {
      const apiError = err.response.data.error
      const details = Array.isArray(apiError.details) ? apiError.details.map(d => d.msg || JSON.stringify(d)).join('; ') : apiError.details
      const apiMsg = apiError.message + (details ? `: ${details}` : '') || 'Analysis failed'
      throw new Error(apiMsg)
    }
    // Fallback to network error message
    throw new Error(err.message ? `Network error: ${err.message}` : 'Analysis failed')
  }
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

