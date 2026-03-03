/**
 * HebrewCard — single canonical place for RTL Hebrew rendering.
 * Always uses lang="he" and dir="rtl" so browsers apply correct bidi shaping.
 * Never use text-transform on Hebrew (breaks nikud positioning).
 */
export default function HebrewCard({ text, className = '', onClick, feedback = null }) {
  const feedbackClass = feedback ? ` ${feedback}` : ''
  return (
    <button
      className={`game-card ${className}${feedbackClass}`}
      onClick={onClick}
      lang="he"
      dir="rtl"
      aria-label={text}
    >
      <span className="hebrew-text" lang="he" dir="rtl">
        {text}
      </span>
    </button>
  )
}
