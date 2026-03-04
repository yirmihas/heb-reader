import { useMemo } from 'react'
import wordsData from '../../content/words.json'
import { useGameState } from '../../hooks/useGameState.js'
import { shuffle, pickRandom } from '../../utils/shuffle.js'
import HebrewCard from '../shared/HebrewCard.jsx'
import FeedbackOverlay from '../shared/FeedbackOverlay.jsx'
import ProgressBar from '../shared/ProgressBar.jsx'
import StimulusCard from '../shared/StimulusCard.jsx'
import './WordPictureMatch.css'

function buildChoices(currentWord, allWords) {
  const distractors = pickRandom(
    allWords.filter(w => w.id !== currentWord.id),
    3
  )
  return shuffle([currentWord, ...distractors])
}

export default function WordPictureMatch({ gameConfig, onAnswer, onGameEnd, onMenu }) {
  const words = useMemo(() => {
    const all = wordsData.words
    if (!gameConfig.category || gameConfig.category === 'all') return all
    return all.filter(w => w.category === gameConfig.category)
  }, [gameConfig.category])

  const { currentWord, questionIndex, total, feedback, submitAnswer, goBack, canGoBack } =
    useGameState(words, onAnswer, onGameEnd)

  const choices = useMemo(
    () => (currentWord ? buildChoices(currentWord, words) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentWord?.id, words]
  )

  if (!currentWord) return null

  return (
    <div className="word-picture screen-pad">
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

      <p className="game-instruction">Find the Hebrew word</p>

      <div className="choices-grid">
        {choices.map(word => (
          <HebrewCard
            key={word.id}
            text={word.hebrew}
            className="hebrew-choice"
            onClick={() => submitAnswer(word.id === currentWord.id)}
          />
        ))}
      </div>
    </div>
  )
}
