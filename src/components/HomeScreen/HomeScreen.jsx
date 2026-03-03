import './HomeScreen.css'

// USER SYSTEM STUB: ProfilePicker goes here

export default function HomeScreen({ onStart }) {
  return (
    <div className="home-screen screen-pad">
      <div className="home-hero">
        <div className="home-logo">📚</div>
        <h1 className="home-title">
          <span lang="he" className="hebrew-text">קרא עברית</span>
        </h1>
        <p className="home-subtitle">Hebrew Reading for Kids</p>
      </div>

      {/* USER SYSTEM STUB: ProfilePicker goes here */}

      <div className="home-actions">
        <button className="btn btn-primary home-start-btn" onClick={onStart}>
          Let's Play! 🎮
        </button>
      </div>

      <div className="home-stars">
        <span>⭐</span><span>⭐</span><span>⭐</span>
      </div>
    </div>
  )
}
