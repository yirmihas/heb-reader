import { useMemo } from 'react'
import wordsData from '../../content/words.json'
import lettersData from '../../content/letters.json'
import { useGameState } from '../../hooks/useGameState.js'
import { shuffle, pickRandom } from '../../utils/shuffle.js'
import FeedbackOverlay from '../shared/FeedbackOverlay.jsx'
import ProgressBar from '../shared/ProgressBar.jsx'
import StimulusCard from '../shared/StimulusCard.jsx'
import './MissingLetter.css'

function splitLetters(str) {
  return [...str]
}

/**
 * Pick the missing-letter position and build 4 choices (1 correct + 3 distractors).
 */
function buildQuestion(word) {
  const letters = splitLetters(word.hebrewNoNikud)
  // Pick random position to blank out
  const missingPos = Math.floor(Math.random() * letters.length)
  const correctLetter = letters[missingPos]

  // Distractors: letters from aleph-bet NOT in the word
  const wordLetterSet = new Set(letters)
  const allAlephBet = lettersData.letters.map(l => l.letter)
  const distPool = allAlephBet.filter(l => !wordLetterSet.has(l))
  const distractors = pickRandom(distPool, 3)

  const choices = shuffle([correctLetter, ...distractors])

  return { missingPos, correctLetter, choices }
}

function MissingLetterQuestion({ word, question, onAnswer }) {
  const { missingPos, correctLetter, choices } = question
  const letters = splitLetters(word.hebrewNoNikud)

  // Build the display word with "?" at missing position
  const displayParts = letters.map((l, i) => i === missingPos ? '?' : l)

  return (
    <div className="missing-question">
      {/* Word display with gap — RTL */}
      <div className="missing-word" dir="rtl" lang="he">
        {displayParts.map((part, i) => (
          <span
            key={i}
            className={`word-part hebrew-text hebrew-letter ${part === '?' ? 'missing-slot' : ''}`}
            lang="he"
          >
            {part}
          </span>
        ))}
      </div>

      {/* 4 letter choices */}
      <div className="letter-choices">
        {choices.map((letter, i) => (
          <button
            key={i}
            className="game-card letter-choice-btn"
            onClick={() => onAnswer(letter === correctLetter)}
          >
            <span className="hebrew-text hebrew-letter" lang="he" dir="rtl">
              {letter}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function MissingLetter({ gameConfig, onAnswer, onGameEnd, onMenu }) {
  const words = useMemo(() => {
    const all = wordsData.words
    if (!gameConfig.category || gameConfig.category === 'all') return all
    return all.filter(w => w.category === gameConfig.category)
  }, [gameConfig.category])

  const { currentWord, questionIndex, total, feedback, submitAnswer, goBack, canGoBack } =
    useGameState(words, onAnswer, onGameEnd)

  // Build a new question each time the word changes
  const question = useMemo(
    () => (currentWord ? buildQuestion(currentWord) : null),
    [currentWord?.id] // eslint-disable-line react-hooks/exhaustive-deps
  )

  if (!currentWord || !question) return null

  return (
    <div className="missing-letter screen-pad">
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

      <p className="game-instruction">Which letter is missing?</p>

      <MissingLetterQuestion
        key={currentWord.id}
        word={currentWord}
        question={question}
        onAnswer={submitAnswer}
      />
    </div>
  )
}
