import { useMemo } from 'react'
import passoverData from '../../content/passover.json'
import { useGameState } from '../../hooks/useGameState.js'
import { shuffle, pickRandom } from '../../utils/shuffle.js'
import FeedbackOverlay from '../shared/FeedbackOverlay.jsx'
import ProgressBar from '../shared/ProgressBar.jsx'
import './PassoverMatch.css'

function buildChoices(current, allQuestions) {
  const distractors = pickRandom(
    allQuestions.filter(q => q.id !== current.id),
    2
  )
  return shuffle([current, ...distractors])
}

export default function PassoverMatch({ onAnswer, onGameEnd, onMenu }) {
  const questions = passoverData.questions

  const { currentWord: current, questionIndex, total, feedback, submitAnswer, goBack, canGoBack } =
    useGameState(questions, onAnswer, onGameEnd)

  const choices = useMemo(
    () => (current ? buildChoices(current, questions) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [current?.id]
  )

  if (!current) return null

  return (
    <div className="passover-match screen-pad">
      <FeedbackOverlay type={feedback} visible={feedback !== null} />

      <div className="game-header">
        <div className="game-header-row">
          <button className="btn btn-secondary prev-btn" onClick={goBack} disabled={!canGoBack}>
            ← Prev
          </button>
          <span className="question-counter">{questionIndex + 1} / {total}</span>
          <button className="btn btn-secondary menu-btn" onClick={onMenu}>☰ Menu</button>
        </div>
        <ProgressBar current={questionIndex + 1} total={total} />
      </div>

      <div className="passover-sentence-block">
        <p className="game-instruction">Which picture matches?</p>
        <p className="passover-sentence" lang="he" dir="rtl">{current.sentence}</p>
        <p className="passover-translation">"{current.translation}"</p>
      </div>

      <div className="passover-choices">
        {choices.map(choice => (
          <button
            key={choice.id}
            className={`passover-choice game-card`}
            onClick={() => submitAnswer(choice.id === current.id)}
            disabled={feedback !== null}
          >
            <img
              src={choice.imageFile}
              alt={choice.translation}
              className="passover-choice-img"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
