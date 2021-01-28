/**
 * Rotates a matrix to the left
 * @param original Square matrix, stores as flat array
 * @param steps How many multiples of 90 degrees to rotate
 */
export function rotateLeft(original: number[], steps: number = 1) {
  steps = steps % 4

  if (!steps) return [...original]

  const N = Math.sqrt(original.length)

  const rotated = new Array(original.length)

  for (let a = 0; a < N; a++) {
    for (let b = 0; b < N; b++) {
      const x = original[b * N + a]

      let [i, j] = [a, b]

      // 90/270 degrees: transpose
      if (steps % 2) {
        [i, j] = [j, i]
      }

      // 90/180 degrees: horizontal reflection
      if (steps < 3) {
        j = N - j - 1
      }

      // 180/270 degrees: vertical reflection
      if (steps > 1) {
        i = N - i - 1
      }

      rotated[j * N + i] = x
    }
  }

  return rotated
}

/**
 * Rotates a matrix to the right
 * @param original Square matrix, stores as flat array
 * @param steps How many multiples of 90 degrees to rotate
 */
export function rotateRight(original: number[], steps: number = 1) {
  return rotateLeft(original, 4 - steps)
}