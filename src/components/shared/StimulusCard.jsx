import './StimulusCard.css'

/**
 * Shared stimulus display used by all 3 games.
 * Shows: image or emoji · English label · fun-fact paragraph
 */
export default function StimulusCard({ word }) {
  const { imageFile, emoji, english, funFact } = word

  return (
    <div className="stimulus-card">
      <div className="stimulus-media">
        {imageFile
          ? <img src={imageFile} alt={english} className="stimulus-img" />
          : <div className="stimulus-emoji">{emoji}</div>
        }
      </div>

      <div className="stimulus-label">{english}</div>

      {funFact && (
        <p className="stimulus-fact">
          <span className="stimulus-fact-icon">💡</span> {funFact}
        </p>
      )}
    </div>
  )
}
