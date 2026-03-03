import { useState, useCallback } from 'react'
import { shuffle } from '../utils/shuffle.js'

const QUESTIONS_PER_ROUND = 10

/**
 * Shared game state: question sequencing, scoring, feedback timing.
 *
 * Returns:
 *   currentWord    — current word object
 *   questionIndex  — 0-based index into shuffled question list
 *   total          — total questions this round
 *   score          — { correct, total }
 *   feedback       — null | 'correct' | 'wrong'
 *   submitAnswer   — (isCorrect: boolean) => void
 *   isGameOver     — boolean
 */
export function useGameState(words, onAnswer, onGameEnd) {
  const [shuffledWords] = useState(() =>
    shuffle(words).slice(0, Math.min(QUESTIONS_PER_ROUND, words.length))
  )
  const [questionIndex, setQuestionIndex] = useState(0)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [feedback, setFeedback] = useState(null) // null | 'correct' | 'wrong'
  const [isGameOver, setIsGameOver] = useState(false)

  const currentWord = shuffledWords[questionIndex] ?? null
  const total = shuffledWords.length

  const submitAnswer = useCallback((isCorrect) => {
    if (feedback !== null) return // prevent double-tap during animation

    const fb = isCorrect ? 'correct' : 'wrong'
    setFeedback(fb)
    onAnswer(isCorrect)

    const newScore = {
      correct: score.correct + (isCorrect ? 1 : 0),
      total: score.total + 1,
    }
    setScore(newScore)

    setTimeout(() => {
      setFeedback(null)
      const nextIndex = questionIndex + 1
      if (nextIndex >= total) {
        setIsGameOver(true)
        onGameEnd(newScore)
      } else {
        setQuestionIndex(nextIndex)
      }
    }, 700)
  }, [feedback, onAnswer, score, questionIndex, total, onGameEnd])

  return {
    currentWord,
    questionIndex,
    total,
    score,
    feedback,
    submitAnswer,
    isGameOver,
  }
}
