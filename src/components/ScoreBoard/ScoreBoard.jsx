import { computeStars, formatScore } from '../../utils/scoring.js'
import './ScoreBoard.css'

// USER SYSTEM STUB: show user name + cumulative stars badge

const STAR_MESSAGES = {
  3: 'Amazing! 🎉',
  2: 'Great job! 👍',
  1: 'Keep trying! 💪',
}

export default function ScoreBoard({ score, onPlayAgain, onMenu }) {
  const stars = computeStars(score.correct, score.total)
  const starDisplay = '⭐'.repeat(stars) + '☆'.repeat(3 - stars)

  return (
    <div className="scoreboard screen-pad">
      {/* USER SYSTEM STUB: show user name + cumulative stars badge */}

      <div className="scoreboard-hero">
        <div className="score-stars">{starDisplay}</div>
        <div className="score-message">{STAR_MESSAGES[stars]}</div>
        <div className="score-number">{formatScore(score.correct, score.total)}</div>
        <div className="score-label">correct answers</div>
      </div>

      <div className="scoreboard-actions">
        <button className="btn btn-primary play-again-btn" onClick={onPlayAgain}>
          Play Again 🔄
        </button>
        <button className="btn btn-secondary menu-btn" onClick={onMenu}>
          Game Menu
        </button>
      </div>
    </div>
  )
}
