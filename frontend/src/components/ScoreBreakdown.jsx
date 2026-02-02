import { Info, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

const ScoreBreakdown = ({ detectorResults }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const detectors = [
    { 
      id: 'payment', 
      name: 'Payment Red Flags', 
      description: 'Detects suspicious payment methods, check scams, and advance fee requests',
      maxScore: 30,
      color: 'bg-red-500'
    },
    { 
      id: 'identity', 
      name: 'Identity Requests', 
      description: 'Detects requests for ID documents, SSN, banking info before hiring',
      maxScore: 30,
      color: 'bg-orange-500'
    },
    { 
      id: 'urgency', 
      name: 'Urgency Tactics', 
      description: 'Detects pressure tactics, immediate hire promises, and too-good-to-be-true offers',
      maxScore: 25,
      color: 'bg-yellow-500'
    },
    { 
      id: 'communication', 
      name: 'Communication Red Flags', 
      description: 'Detects off-platform requests, personal emails, suspicious interview methods',
      maxScore: 25,
      color: 'bg-purple-500'
    },
    { 
      id: 'company', 
      name: 'Company Details', 
      description: 'Detects vague company info, unverifiable business claims',
      maxScore: 20,
      color: 'bg-blue-500'
    },
    { 
      id: 'grammar', 
      name: 'Grammar & Formatting', 
      description: 'Detects poor grammar, excessive caps, unusual phrasing',
      maxScore: 15,
      color: 'bg-gray-500'
    }
  ]

  const getScorePercent = (current, max) => {
    return Math.min((current / max) * 100, 100)
  }

  const getRiskLevel = (current, max) => {
    const ratio = current / max
    if (ratio >= 0.7) return 'high'
    if (ratio >= 0.4) return 'medium'
    return 'low'
  }

  return (
    <div className="card">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-primary-600" />
          <h3 className="font-semibold text-gray-900">How Scoring Works</h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-gray-600">
            The analysis checks for various scam indicators across 6 categories. Each category 
            contributes to a total risk score (0-100). Higher scores indicate higher scam probability.
          </p>

          <div className="space-y-3">
            {detectors.map((detector) => {
              const result = detectorResults?.[detector.id] || { score: 0, hasRedFlags: false }
              const riskLevel = getRiskLevel(result.score, detector.maxScore)
              
              return (
                <div key={detector.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${detector.color}`} />
                      <span className="font-medium text-sm text-gray-900">{detector.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {result.score} / {detector.maxScore}
                    </span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        riskLevel === 'high' ? 'bg-red-500' :
                        riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${getScorePercent(result.score, detector.maxScore)}%` }}
                    />
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-1">{detector.description}</p>
                </div>
              )
            })}
          </div>

          <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700">
            <strong>Note:</strong> Legitimate job platforms (LinkedIn, WorkDay, Indeed, etc.) 
            receive reduced scores since they use professional communication channels.
          </div>

          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-red-100 rounded p-2">
              <div className="text-lg font-bold text-red-700">80-100</div>
              <div className="text-xs text-red-600">Critical Risk</div>
            </div>
            <div className="bg-orange-100 rounded p-2">
              <div className="text-lg font-bold text-orange-700">60-79</div>
              <div className="text-xs text-orange-600">High Risk</div>
            </div>
            <div className="bg-yellow-100 rounded p-2">
              <div className="text-lg font-bold text-yellow-700">40-59</div>
              <div className="text-xs text-yellow-600">Medium Risk</div>
            </div>
            <div className="bg-green-100 rounded p-2">
              <div className="text-lg font-bold text-green-700">0-39</div>
              <div className="text-xs text-green-600">Low Risk</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ScoreBreakdown

