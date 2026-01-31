import { X, Trash2, Clock, CheckCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getHistory, deleteHistoryItem } from '../services/api'

const HistoryPanel = ({ onClose, onLoadItem }) => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      setLoading(true)
      const response = await getHistory()
      setHistory(response.data || [])
    } catch (err) {
      const localHistory = localStorage.getItem('scamicide_history')
      if (localHistory) {
        setHistory(JSON.parse(localHistory))
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    try {
      await deleteHistoryItem(id)
      setHistory(history.filter(h => h.id !== id))
    } catch (err) {
      setHistory(history.filter(h => h.id !== id))
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    })
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-red-600 bg-red-100'
    if (score >= 60) return 'text-orange-600 bg-orange-100'
    if (score >= 40) return 'text-yellow-600 bg-yellow-100'
    return 'text-green-600 bg-green-100'
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-end z-50">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Analysis History
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No analysis history yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onLoadItem(item)}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-sm font-bold ${getScoreColor(item.risk_score)}`}>
                          {item.risk_score}
                        </span>
                        <span className="text-sm text-gray-500">{item.risk_category}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {item.input_text?.substring(0, 80)}...
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(item.created_at)}</p>
                    </div>
                    <button onClick={(e) => handleDelete(item.id, e)} className="p-2 text-gray-400 hover:text-red-500 rounded opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HistoryPanel

