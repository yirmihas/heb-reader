/**
 * Compute star rating (1–3) from a score ratio.
 */
export function computeStars(correct, total) {
  if (total === 0) return 0
  const ratio = correct / total
  if (ratio >= 0.9) return 3
  if (ratio >= 0.6) return 2
  return 1
}

/**
 * Format score as a human-readable string.
 */
export function formatScore(correct, total) {
  return `${correct} / ${total}`
}

// USER SYSTEM STUB: also call user.saveProgress(gameId, score)
export function saveProgress(gameId, score) {
  // Stub — connect to UserContext / Supabase / Firebase here
}
