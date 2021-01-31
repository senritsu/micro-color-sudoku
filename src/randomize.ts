import { rotateLeft, mirrorHorizontally, mirrorVertically } from './math'

export default function (puzzle : number[]) {
  const numbers = Array.from({length: Math.sqrt(puzzle.length)}).map((_, i) => i + 1)
  const mapping = shuffled(numbers).reduce((map, n, i) => {
    map[i + 1] = n
    return map
  }, {} as { [key: number]: number })

  let randomized = puzzle.map(n => mapping[n] || 0)

  for (const modify of [mirrorHorizontally, mirrorVertically]) {
    if (Math.random() < 0.25) {
      randomized = modify(randomized)
    }
  }

  const steps = Math.floor(Math.random() * 4)
  return rotateLeft(randomized, steps)
}

function shuffled (array : number[]) {
  const a = [...array]

  // Durstenfeld shuffle
  for (let i : number = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    // NOTE in-place swapping with [a, b] = [b, a] results in typescript error, unsure why
    const prev = a[i]
    a[i] = a[j]
    a[j] = prev
  }

  return a
}