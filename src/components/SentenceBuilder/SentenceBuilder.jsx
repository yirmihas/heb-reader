import { useState, useMemo, useRef } from 'react'
import sentencesData from '../../content/sentences.json'
import { shuffle } from '../../utils/shuffle.js'
import FeedbackOverlay from '../shared/FeedbackOverlay.jsx'
import ProgressBar from '../shared/ProgressBar.jsx'
import './SentenceBuilder.css'

const ROUND_SIZE = 8

// ── Single-question sub-component ────────────────────────────────────
// Keyed by `${sentence.id}-${attemptKey}` from parent so it remounts
// cleanly on each retry.
function SentenceQuestion({ sentence, feedback, onCheck }) {
  const tiles = useMemo(
    () => shuffle(sentence.words.map((w, i) => ({ ...w, origIndex: i }))),
    // key-based remount makes this run fresh each time
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const len = sentence.words.length
  const [slots, setSlots]   = useState(() => Array(len).fill(null))
  const [used, setUsed]     = useState(() => new Set())

  function tapTile(tile, tileIdx) {
    if (used.has(tileIdx) || feedback !== null) return
    const firstEmpty = slots.findIndex(s => s === null)
    if (firstEmpty === -1) return

    const newSlots = [...slots]
    newSlots[firstEmpty] = tile
    const newUsed = new Set([...used, tileIdx])
    setSlots(newSlots)
    setUsed(newUsed)

    if (newSlots.every(s => s !== null)) {
      const isCorrect = newSlots.every(
        (s, i) => s.hebrewNoNikud === sentence.words[i].hebrewNoNikud
      )
      onCheck(isCorrect)
    }
  }

  function clear() {
    setSlots(Array(len).fill(null))
    setUsed(new Set())
  }

  return (
    <div className="sentence-question">

      {/* ── Answer slots (RTL) + scene emoji ── */}
      <div className="sentence-row" dir="rtl">
        <div className="sentence-slots">
          {slots.map((slot, i) => (
            <div
              key={i}
              className={[
                'sentence-slot',
                slot     ? 'filled'  : 'empty',
                feedback === 'correct' && slot ? 'slot-correct' : '',
                feedback === 'wrong'   && slot ? 'slot-wrong'   : '',
              ].join(' ')}
            >
              {slot && (
                <div className="slot-inner">
                  <span className="hebrew-text sentence-word-he" lang="he" dir="rtl">
                    {slot.hebrew}
                  </span>
                  <span className="slot-en">{slot.english}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Scene picture at the END of the sentence (left side in RTL layout) */}
        <div className="sentence-scene">{sentence.emoji}</div>
      </div>

      {/* ── Shuffled word tiles ── */}
      <div className="sentence-tiles" dir="rtl">
        {tiles.map((tile, i) => (
          <button
            key={i}
            className={`game-card sentence-tile ${used.has(i) ? 'used' : ''}`}
            onClick={() => tapTile(tile, i)}
            disabled={used.has(i) || feedback !== null}
          >
            <span className="hebrew-text sentence-word-he" lang="he" dir="rtl">
              {tile.hebrew}
            </span>
            <span className="tile-en">{tile.english}</span>
          </button>
        ))}
      </div>

      <button className="btn btn-danger clear-btn" onClick={clear}
        disabled={feedback !== null}>
        Clear ↺
      </button>
    </div>
  )
}

// ── Main game component ───────────────────────────────────────────────
export default function SentenceBuilder({ onAnswer, onGameEnd, onMenu }) {
  const [shuffled]   = useState(() => shuffle(sentencesData.sentences).slice(0, ROUND_SIZE))
  const [index,      setIndex]     = useState(0)
  const [feedback,   setFeedback]  = useState(null)  // null | 'correct' | 'wrong'
  const [attemptKey, setAttemptKey] = useState(0)    // bumped on retry to remount child

  // Track first-attempt result per index — never re-score revisited questions
  const firstAnswers = useRef({})

  const total   = shuffled.length
  const current = shuffled[index]

  function handleCheck(isCorrect) {
    if (feedback !== null) return
    setFeedback(isCorrect ? 'correct' : 'wrong')

    const isFirstAttempt = !(index in firstAnswers.current)
    if (isFirstAttempt) {
      firstAnswers.current[index] = isCorrect
      onAnswer(isCorrect)
    }

    if (isCorrect) {
      setTimeout(() => {
        setFeedback(null)
        setAttemptKey(0)
        const next = index + 1
        if (next >= total) {
          const correct = Object.values(firstAnswers.current).filter(Boolean).length
          onGameEnd({ correct, total })
        } else {
          setIndex(next)
        }
      }, 800)
    } else {
      // Wrong: flash red, then remount SentenceQuestion (clears slots)
      setTimeout(() => {
        setFeedback(null)
        setAttemptKey(k => k + 1)
      }, 700)
    }
  }

  function goBack() {
    if (index > 0 && feedback === null) {
      setAttemptKey(0)
      setIndex(i => i - 1)
    }
  }

  const canGoBack = index > 0

  if (!current) return null

  return (
    <div className="sentence-builder screen-pad">
      <FeedbackOverlay type={feedback} visible={feedback !== null} />

      <div className="game-header">
        <div className="game-header-row">
          <button className="btn btn-secondary prev-btn" onClick={goBack} disabled={!canGoBack}>← Prev</button>
          <span className="question-counter">{index + 1} / {total}</span>
          <button className="btn btn-secondary menu-btn" onClick={onMenu}>☰ Menu</button>
        </div>
        <ProgressBar current={index + 1} total={total} />
      </div>

      <div className="sentence-instruction-block">
        <p className="game-instruction">Build the sentence</p>
        <p className="sentence-translation">"{current.translation}"</p>
      </div>

      <SentenceQuestion
        key={`${current.id}-${attemptKey}`}
        sentence={current}
        feedback={feedback}
        onCheck={handleCheck}
      />
    </div>
  )
}
