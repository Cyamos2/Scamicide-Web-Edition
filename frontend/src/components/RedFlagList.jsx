import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

const RedFlagList = ({ redFlags = [] }) => {
  const [isExpanded, setIsExpanded] = useState(true)

  if (!redFlags || redFlags.length === 0) {
    return (
      <div className="card bg-green-50 border border-green-200">
        <div className="flex items-center gap-3">
          <div className="bg-green-100 p-2 rounded-full">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-green-800">No Red Flags Detected</h3>
            <p className="text-sm text-green-600">This posting appears clean, but always exercise caution.</p>
          </div>
        </div>
      </div>
    )
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'payment': return 'border-l-red-500 bg-red-50'
      case 'identity': return 'border-l-purple-500 bg-purple-50'
      case 'urgency': return 'border-l-orange-500 bg-orange-50'
      case 'communication': return 'border-l-blue-500 bg-blue-50'
      case 'company': return 'border-l-yellow-500 bg-yellow-50'
      case 'grammar': return 'border-l-gray-500 bg-gray-50'
      default: return 'border-l-gray-500 bg-gray-50'
    }
  }

  return (
    <div className="card">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between mb-4"
      >
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          Red Flags ({redFlags.length})
        </h3>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="space-y-3">
          {redFlags.map((flag, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-l-4 ${getTypeColor(flag.type)}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">
                  {flag.type === 'payment' ? '💰' :
                   flag.type === 'identity' ? '🪪' :
                   flag.type === 'urgency' ? '⚡' :
                   flag.type === 'communication' ? '📱' :
                   flag.type === 'company' ? '🏢' : '📝'}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 capitalize">
                      {flag.type} Concern
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
                      +{flag.weight} points
                    </span>
                  </div>
                  <p className="text-gray-700">{flag.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RedFlagList

