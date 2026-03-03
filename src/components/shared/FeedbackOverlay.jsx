import './FeedbackOverlay.css'

/**
 * Full-screen momentary feedback shown after each answer.
 * type: 'correct' | 'wrong'
 */
export default function FeedbackOverlay({ type, visible }) {
  if (!visible) return null

  return (
    <div className={`feedback-overlay feedback-${type}`}>
      <span className="feedback-icon">
        {type === 'correct' ? '✅' : '❌'}
      </span>
      <span className="feedback-text">
        {type === 'correct' ? 'כן!' : 'נסה שוב'}
      </span>
    </div>
  )
}
