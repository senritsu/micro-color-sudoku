/**
 * Rotates a matrix to the left
 * @param original Square matrix, stored as a flat array in row-major order
 * @param steps How many multiples of 90 degrees to rotate
 */
export function rotateLeft(original: number[], steps: number = 1) {
  steps = steps % 4
  
  if (steps < 0) {
    steps += 4
  }

  if (!steps) return [...original]

  return transform(original, (i, j, N) => {
    // 90/270 degrees: transpose
    if (steps % 2) {
      [i, j] = [j, i]
    }

    // 90/180 degrees: vertical reflection
    if (steps < 3) {
      j = N - j - 1
    }

    // 180/270 degrees: horizontal reflection
    if (steps > 1) {
      i = N - i - 1
    }

    return [i ,j]
  })
}

/**
 * Rotates a matrix to the right
 * @param original Square matrix, stored as a flat array in row-major order
 * @param steps How many multiples of 90 degrees to rotate
 */
export function rotateRight(original: number[], steps: number = 1) {
  return rotateLeft(original, 4 - steps)
}

export const mirrorHorizontally = (original: number[]) => transform(original, (i, j, N) => [N - i - 1, j])

export const mirrorVertically = (original: number[]) => transform(original, (i, j, N) => [i, N - j - 1])

function transform(original: number[], calculateNewIndex: (i: number, j: number, N: number) => [iNew: number, jNew: number]) {
  const N = Math.sqrt(original.length)

  const transformed = new Array(original.length)

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const [iNew, jNew] = calculateNewIndex(i, j, N)
      transformed[jNew * N + iNew] = original[j * N + i]
    }
  }

  return transformed
}