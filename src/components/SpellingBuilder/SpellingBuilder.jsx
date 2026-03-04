import { useState, useMemo, useEffect } from 'react'
import wordsData from '../../content/words.json'
import { useGameState } from '../../hooks/useGameState.js'
import { shuffle } from '../../utils/shuffle.js'
import FeedbackOverlay from '../shared/FeedbackOverlay.jsx'
import ProgressBar from '../shared/ProgressBar.jsx'
import StimulusCard from '../shared/StimulusCard.jsx'
import './SpellingBuilder.css'

/**
 * Split a Hebrew string (no nikud) into individual grapheme characters.
 * We use hebrewNoNikud for letter manipulation — never displayed to child.
 */
function splitLetters(str) {
  return [...str]
}

function SpellingQuestion({ word, onSubmit }) {
  const letters = useMemo(
    () => shuffle(splitLetters(word.hebrewNoNikud)),
    [word.id] // eslint-disable-line react-hooks/exhaustive-deps
  )
  const targetLength = splitLetters(word.hebrewNoNikud).length

  const [slots, setSlots] = useState([])          // letters tapped into answer
  const [usedIndexes, setUsedIndexes] = useState(new Set()) // which source tiles used

  // Reset when word changes
  useEffect(() => {
    setSlots([])
    setUsedIndexes(new Set())
  }, [word.id])

  function tapLetter(letter, index) {
    if (usedIndexes.has(index)) return
    const newSlots = [...slots, letter]
    const newUsed = new Set([...usedIndexes, index])
    setSlots(newSlots)
    setUsedIndexes(newUsed)

    if (newSlots.length === targetLength) {
      const guess = newSlots.join('')
      const correct = word.hebrewNoNikud
      onSubmit(guess === correct)
    }
  }

  function clear() {
    setSlots([])
    setUsedIndexes(new Set())
  }

  return (
    <div className="spelling-question">
      {/* Answer slots — RTL order: first slot on right */}
      <div className="answer-slots" dir="rtl">
        {Array.from({ length: targetLength }).map((_, i) => (
          <div key={i} className={`answer-slot ${slots[i] ? 'filled' : 'empty'}`}>
            {slots[i] ? (
              <span className="hebrew-text hebrew-letter" lang="he" dir="rtl">
                {slots[i]}
              </span>
            ) : null}
          </div>
        ))}
      </div>

      {/* Scrambled letter tiles */}
      <div className="letter-tiles" dir="rtl">
        {letters.map((letter, i) => (
          <button
            key={i}
            className={`game-card letter-tile ${usedIndexes.has(i) ? 'used' : ''}`}
            onClick={() => tapLetter(letter, i)}
            disabled={usedIndexes.has(i)}
          >
            <span className="hebrew-text hebrew-letter" lang="he" dir="rtl">
              {letter}
            </span>
          </button>
        ))}
      </div>

      <button className="btn btn-danger clear-btn" onClick={clear}>
        Clear ↺
      </button>
    </div>
  )
}

export default function SpellingBuilder({ gameConfig, onAnswer, onGameEnd, onMenu }) {
  const words = useMemo(() => {
    const all = wordsData.words
    if (!gameConfig.category || gameConfig.category === 'all') return all
    return all.filter(w => w.category === gameConfig.category)
  }, [gameConfig.category])

  const { currentWord, questionIndex, total, feedback, submitAnswer, retryKey, goBack, canGoBack } =
    useGameState(words, onAnswer, onGameEnd)

  if (!currentWord) return null

  return (
    <div className="spelling-builder screen-pad">
      <FeedbackOverlay type={feedback} visible={feedback !== null} />

      <div className="game-header">
        <div className="game-header-row">
          <button className="btn btn-secondary prev-btn" onClick={goBack} disabled={!canGoBack}>← Prev</button>
          <span className="question-counter">{questionIndex + 1} / {total}</span>
          <button className="btn btn-secondary menu-btn" onClick={onMenu}>☰ Menu</button>
        </div>
        <ProgressBar current={questionIndex + 1} total={total} />
      </div>

      <StimulusCard word={currentWord} />

      <p className="game-instruction">Spell the Hebrew word</p>

      <SpellingQuestion
        key={`${currentWord.id}-${retryKey}`}
        word={currentWord}
        onSubmit={submitAnswer}
      />
    </div>
  )
}
