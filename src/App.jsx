import { useState } from 'react'
import './App.css'
import HomeScreen from './components/HomeScreen/HomeScreen.jsx'
import GameMenu from './components/GameMenu/GameMenu.jsx'
import WordPictureMatch from './components/WordPictureMatch/WordPictureMatch.jsx'
import SpellingBuilder from './components/SpellingBuilder/SpellingBuilder.jsx'
import MissingLetter from './components/MissingLetter/MissingLetter.jsx'
import SentenceBuilder from './components/SentenceBuilder/SentenceBuilder.jsx'
import ScoreBoard from './components/ScoreBoard/ScoreBoard.jsx'

// USER SYSTEM STUB: replace with useUser() hook
const currentUser = null

export default function App() {
  const [view, setView] = useState('home')
  // gameConfig: { level, category } — passed to games for filtering words
  const [gameConfig, setGameConfig] = useState({ level: 1, category: 'all' })
  // sessionScore: accumulated across one game session
  const [sessionScore, setSessionScore] = useState({ correct: 0, total: 0 })
  // which game the user just played (for ScoreBoard back-button routing)
  const [activeGame, setActiveGame] = useState(null)

  function startGame(gameId) {
    setActiveGame(gameId)
    setSessionScore({ correct: 0, total: 0 })
    setView(gameId)
  }

  function handleAnswer(isCorrect) {
    setSessionScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }))
  }

  function handleGameEnd(finalScore) {
    setSessionScore(finalScore)
    setView('score')
  }

  function handlePlayAgain() {
    startGame(activeGame)
  }

  function handleBackToMenu() {
    setView('menu')
  }

  return (
    <div className="app-shell">
      {view === 'home' && (
        <HomeScreen onStart={() => setView('menu')} />
      )}
      {view === 'menu' && (
        <GameMenu
          onSelectGame={startGame}
          onBack={() => setView('home')}
          gameConfig={gameConfig}
          onConfigChange={setGameConfig}
        />
      )}
      {view === 'word-picture' && (
        <WordPictureMatch
          gameConfig={gameConfig}
          onAnswer={handleAnswer}
          onGameEnd={handleGameEnd}
          onMenu={handleBackToMenu}
        />
      )}
      {view === 'spelling' && (
        <SpellingBuilder
          gameConfig={gameConfig}
          onAnswer={handleAnswer}
          onGameEnd={handleGameEnd}
          onMenu={handleBackToMenu}
        />
      )}
      {view === 'missing-letter' && (
        <MissingLetter
          gameConfig={gameConfig}
          onAnswer={handleAnswer}
          onGameEnd={handleGameEnd}
          onMenu={handleBackToMenu}
        />
      )}
      {view === 'sentence' && (
        <SentenceBuilder
          onAnswer={handleAnswer}
          onGameEnd={handleGameEnd}
          onMenu={handleBackToMenu}
        />
      )}
      {view === 'score' && (
        <ScoreBoard
          score={sessionScore}
          onPlayAgain={handlePlayAgain}
          onMenu={handleBackToMenu}
        />
      )}
    </div>
  )
}
