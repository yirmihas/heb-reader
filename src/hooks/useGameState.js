import { useState, useCallback, useRef } from 'react'
import { shuffle } from '../utils/shuffle.js'

const QUESTIONS_PER_ROUND = 10

/**
 * Shared game state: question sequencing, scoring, feedback timing.
 *
 * Behaviour:
 *   - Wrong answer: flash red → stay on same question (retry until correct)
 *   - Only the FIRST attempt at each question is scored / sent to onAnswer
 *   - goBack: go to previous question (already-scored answers are not re-scored)
 *   - retryKey: bumped on each wrong answer so parent can remount stateful sub-components
 *
 * Returns:
 *   currentWord    — current word object
 *   questionIndex  — 0-based index into shuffled question list
 *   total          — total questions this round
 *   feedback       — null | 'correct' | 'wrong'
 *   submitAnswer   — (isCorrect: boolean) => void
 *   isGameOver     — boolean
 *   retryKey       — number (use in key prop of stateful question sub-components)
 *   goBack         — () => void
 *   canGoBack      — boolean
 */
export function useGameState(words, onAnswer, onGameEnd) {
  const [shuffledWords] = useState(() =>
    shuffle(words).slice(0, Math.min(QUESTIONS_PER_ROUND, words.length))
  )
  const [questionIndex, setQuestionIndex] = useState(0)
  const [feedback, setFeedback] = useState(null) // null | 'correct' | 'wrong'
  const [isGameOver, setIsGameOver] = useState(false)
  const [retryKey, setRetryKey] = useState(0)

  // Track first-attempt result per question index — never re-score revisited questions
  const firstAnswers = useRef({})

  const total = shuffledWords.length
  const currentWord = shuffledWords[questionIndex] ?? null

  const submitAnswer = useCallback((isCorrect) => {
    if (feedback !== null) return // ignore taps during animation

    setFeedback(isCorrect ? 'correct' : 'wrong')

    // Only score the first attempt at each question index
    const isFirstAttempt = !(questionIndex in firstAnswers.current)
    if (isFirstAttempt) {
      firstAnswers.current[questionIndex] = isCorrect
      onAnswer(isCorrect)
    }

    if (isCorrect) {
      setTimeout(() => {
        setFeedback(null)
        setRetryKey(0)
        const next = questionIndex + 1
        if (next >= total) {
          setIsGameOver(true)
          const correct = Object.values(firstAnswers.current).filter(Boolean).length
          onGameEnd({ correct, total })
        } else {
          setQuestionIndex(next)
        }
      }, 800)
    } else {
      // Wrong: flash red, then reset — let user try again
      setTimeout(() => {
        setFeedback(null)
        setRetryKey(k => k + 1)
      }, 700)
    }
  }, [feedback, questionIndex, total, onAnswer, onGameEnd])

  const goBack = useCallback(() => {
    if (questionIndex > 0 && feedback === null) {
      setRetryKey(0)
      setQuestionIndex(q => q - 1)
    }
  }, [questionIndex, feedback])

  return {
    currentWord,
    questionIndex,
    total,
    feedback,
    submitAnswer,
    isGameOver,
    retryKey,
    goBack,
    canGoBack: questionIndex > 0,
  }
}
