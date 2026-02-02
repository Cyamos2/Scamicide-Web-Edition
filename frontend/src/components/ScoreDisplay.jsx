import { Info } from 'lucide-react'

const ScoreDisplay = ({ score, category, categoryColor, categoryIcon, explanation }) => {
  // Fallback values for missing props
  const displayColor = categoryColor || (score >= 80 ? '#dc2626' : score >= 60 ? '#ea580c' : score >= 40 ? '#ca8a04' : '#16a34a')
  const displayIcon = categoryIcon || (score >= 80 ? '🚨' : score >= 60 ? '⚠️' : score >= 40 ? '⚡' : '✅')
  const displayCategory = category || (score >= 80 ? 'Critical' : score >= 60 ? 'High' : score >= 40 ? 'Medium' : 'Low')

  return (
    <div className="card">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-200"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={`${score * 3.52} 352`}
              strokeLinecap="round"
              className={`${
                score >= 80 ? 'text-red-500' :
                score >= 60 ? 'text-orange-500' :
                score >= 40 ? 'text-yellow-500' : 'text-green-500'
              }`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-gray-900">{score}</span>
          </div>
        </div>

        <div className="flex-1">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
            score >= 80 ? 'bg-red-100' :
            score >= 60 ? 'bg-orange-100' :
            score >= 40 ? 'bg-yellow-100' : 'bg-green-100'
          }`}>
            <span className="text-2xl">{displayIcon}</span>
            <span className="font-bold text-lg" style={{ color: displayColor }}>
              {displayCategory} Risk
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
        <p className="text-gray-700">{explanation}</p>
      </div>
    </div>
  )
}

export default ScoreDisplay

