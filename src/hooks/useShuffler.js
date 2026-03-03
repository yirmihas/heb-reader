import { useMemo } from 'react'
import { shuffle } from '../utils/shuffle.js'

/**
 * Returns a stable shuffled copy of `array`.
 * Re-shuffles only when `deps` change (by default when array reference changes).
 */
export function useShuffler(array, deps = [array]) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => shuffle(array), deps)
}
