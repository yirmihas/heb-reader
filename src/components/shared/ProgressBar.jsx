export default function ProgressBar({ current, total }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0
  return (
    <div className="progress-bar-track" role="progressbar" aria-valuenow={current} aria-valuemax={total}>
      <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
    </div>
  )
}
