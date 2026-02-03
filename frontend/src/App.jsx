import { useState, useEffect } from 'react'
import { Shield, AlertTriangle, CheckCircle, Clock, FileText, History, X, ChevronDown, ChevronUp } from 'lucide-react'
import { analyzeText } from './services/api'
import ScoreDisplay from './components/ScoreDisplay'
import RedFlagList from './components/RedFlagList'
import HistoryPanel from './components/HistoryPanel'
import ScoreBreakdown from './components/ScoreBreakdown'

function App() {
  const [text, setText] = useState('')
  const [url, setUrl] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showHistory, setShowHistory] = useState(false)
  const [activeTab, setActiveTab] = useState('analyze')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim()) {
      setError('Please enter job posting text to analyze')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const analysisResult = await analyzeText(text, url || null)
      // Add missing fields that ScoreDisplay expects
      const enrichedResult = {
        ...analysisResult,
        categoryColor: analysisResult.categoryColor || getCategoryColor(analysisResult.score),
        categoryIcon: analysisResult.categoryIcon || getCategoryIcon(analysisResult.score)
      }
      setResult(enrichedResult)
    } catch (err) {
      const msg = err.message || 'Analysis failed. Please try again.'
      if (msg.startsWith('Network error')) {
        setError(`${msg} — please check that the API is reachable and that VITE_API_URL is set correctly.`)
      } else {
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setText('')
    setUrl('')
    setResult(null)
    setError(null)
  }

  // Helper function to get category color based on score
  const getCategoryColor = (score) => {
    if (score >= 80) return '#dc2626' // red-600
    if (score >= 60) return '#ea580c' // orange-600
    if (score >= 40) return '#ca8a04' // yellow-600
    return '#16a34a' // green-600
  }

  // Helper function to get category icon based on score
  const getCategoryIcon = (score) => {
    if (score >= 80) return '🚨'
    if (score >= 60) return '⚠️'
    if (score >= 40) return '⚡'
    return '✅'
  }

  const loadFromHistory = (item) => {
    setText(item.input_text || '')
    setUrl(item.input_url || '')
    // Create enriched result with all required fields for ScoreDisplay
    const enrichedResult = {
      score: item.risk_score,
      category: item.risk_category,
      redFlags: item.red_flags,
      explanation: item.explanation,
      analyzedAt: item.created_at,
      categoryColor: getCategoryColor(item.risk_score),
      categoryIcon: getCategoryIcon(item.risk_score)
    }
    setResult(enrichedResult)
    setShowHistory(false)
    setActiveTab('analyze')
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary-100 p-2 rounded-lg">
              <Shield className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Scamicide</h1>
              <p className="text-sm text-gray-500">Job Scam Detection System</p>
            </div>
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="btn-secondary flex items-center gap-2"
          >
            <History className="w-5 h-5" />
            History
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('analyze')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'analyze'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white text-gray-700 shadow'
            }`}
          >
            <FileText className="w-5 h-5 inline mr-2" />
            Analyze
          </button>
          <button
            onClick={() => setActiveTab('sample')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'sample'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white text-gray-700 shadow'
            }`}
          >
            <CheckCircle className="w-5 h-5 inline mr-2" />
            Try Sample
          </button>
        </div>

        {activeTab === 'analyze' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-primary-600" />
                Analyze Job Posting
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description
                  </label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste job posting text here..."
                    className="input-field min-h-[200px] resize-y"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job URL (optional)
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/job/123"
                    className="input-field"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading || !text.trim()}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Clock className="w-5 h-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5" />
                        Analyze Now
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="btn-secondary"
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>

            {/* Results Section */}
            <div>
              {result ? (
                <div className="space-y-6">
                  <ScoreDisplay
                    score={result.score}
                    category={result.category}
                    categoryColor={result.categoryColor}
                    categoryIcon={result.categoryIcon}
                    explanation={result.explanation}
                  />
                  <ScoreBreakdown detectorResults={result.detectorResults} />
                  <RedFlagList redFlags={result.redFlags} />
                  {result.sourceInfo?.isLegitimate && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                      <strong>✓ Recognized Source:</strong> This job posting is from a known legitimate 
                      platform ({result.sourceInfo.url}). Some flags have been reduced accordingly.
                    </div>
                  )}
                </div>
              ) : (
                <div className="card bg-gray-50 text-center py-16">
                  <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Ready to Analyze
                  </h3>
                  <p className="text-gray-500">
                    Paste a job posting and click "Analyze Now" to check for scam risk
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'sample' && (
          <div className="card max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Try Sample Analysis</h2>
            <p className="text-gray-600 mb-6">
              Click the button below to run a sample analysis with a known scam job posting pattern.
            </p>
            <button
              onClick={async () => {
                setLoading(true)
                setError(null)
                try {
                  const sampleText = `URGENT HIRING: We are looking for immediate hires for a work-from-home position.
Pay: $50/hour - start immediately!

Requirements:
- No experience needed
- Must have a phone to text me on WhatsApp
- Will need to send your ID (passport or driver's license)
- Must be available to start today

Contact me at: hiring@company-gmail.com

This is a legitimate opportunity. Send me your details and I will send you a check to buy equipment.

Only serious candidates apply!`
                  const analysisResult = await analyzeText(sampleText, null)
                  // Enrich result with missing fields for ScoreDisplay
                  const enrichedResult = {
                    ...analysisResult,
                    categoryColor: analysisResult.categoryColor || getCategoryColor(analysisResult.score),
                    categoryIcon: analysisResult.categoryIcon || getCategoryIcon(analysisResult.score)
                  }
                  setResult(enrichedResult)
                } catch (err) {
                  const msg = err.message || 'Analysis failed'
                  if (msg.startsWith('Network error')) {
                    setError(`${msg} — please check that the API is reachable and that VITE_API_URL is set correctly.`)
                  } else {
                    setError(msg)
                  }
                } finally {
                  setLoading(false)
                }
              }}
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Analyzing...' : 'Run Sample Analysis'}
            </button>

            {result && (
              <div className="mt-8 space-y-6">
                <ScoreDisplay
                  score={result.score}
                  category={result.category}
                  categoryColor={result.categoryColor}
                  categoryIcon={result.categoryIcon}
                  explanation={result.explanation}
                />
                <ScoreBreakdown detectorResults={result.detectorResults} />
                <RedFlagList redFlags={result.redFlags} />
              </div>
            )}
          </div>
        )}
      </main>

      {/* History Panel */}
      {showHistory && (
        <HistoryPanel
          onClose={() => setShowHistory(false)}
          onLoadItem={loadFromHistory}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          <p>Scamicide - Protect yourself from job scams</p>
        </div>
      </footer>
    </div>
  )
}

export default App

