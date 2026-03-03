import './GameMenu.css'

const THEMES = [
  { id: 'all',       label: 'All',       emoji: '⭐' },
  { id: 'animals',   label: 'Animals',   emoji: '🐾' },
  { id: 'food',      label: 'Food',      emoji: '🍽️' },
  { id: 'countries', label: 'Countries', emoji: '🌍' },
  { id: 'cities',    label: 'Cities',    emoji: '🏙️' },
  { id: 'nature',    label: 'Nature',    emoji: '🌿' },
  { id: 'things',    label: 'Things',    emoji: '🏠' },
]

const GAMES = [
  {
    id: 'word-picture',
    emoji: '🖼️',
    title: 'Word Match',
    titleHe: 'התאם מילים',
    description: 'Match the picture to the Hebrew word',
    difficulty: '⭐',
  },
  {
    id: 'spelling',
    emoji: '🔤',
    title: 'Spell It!',
    titleHe: 'בנה מילה',
    description: 'Put the letters in the right order',
    difficulty: '⭐⭐',
  },
  {
    id: 'missing-letter',
    emoji: '❓',
    title: 'Missing Letter',
    titleHe: 'האות החסרה',
    description: 'Find the missing letter in the word',
    difficulty: '⭐⭐⭐',
  },
  {
    id: 'sentence',
    emoji: '📝',
    title: 'Sentence Builder',
    titleHe: 'בנה משפט',
    description: 'Put the words in the right order',
    difficulty: '⭐⭐⭐⭐',
  },
]

export default function GameMenu({ onSelectGame, onBack, gameConfig, onConfigChange }) {
  const selectedTheme = gameConfig?.category ?? 'all'

  function selectTheme(themeId) {
    onConfigChange({ ...gameConfig, category: themeId })
  }

  return (
    <div className="game-menu screen-pad">
      <div className="game-menu-header">
        <button className="btn btn-secondary back-btn" onClick={onBack}>← Back</button>
        <h2 className="game-menu-title">Choose a Game</h2>
      </div>

      {/* Theme chips */}
      <div className="theme-section">
        <p className="theme-label">Theme</p>
        <div className="theme-chips">
          {THEMES.map(t => (
            <button
              key={t.id}
              className={`theme-chip ${selectedTheme === t.id ? 'active' : ''}`}
              onClick={() => selectTheme(t.id)}
            >
              {t.emoji} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Game list */}
      <div className="game-list">
        {GAMES.map(game => (
          <button
            key={game.id}
            className="game-card game-menu-card"
            onClick={() => onSelectGame(game.id)}
          >
            <span className="game-card-emoji">{game.emoji}</span>
            <div className="game-card-info">
              <div className="game-card-title">{game.title}</div>
              <div className="game-card-title-he" lang="he">{game.titleHe}</div>
              <div className="game-card-desc">{game.description}</div>
              <div className="game-card-difficulty">{game.difficulty}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
