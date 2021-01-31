import { rotateLeft, rotateRight, mirrorHorizontally, mirrorVertically } from './math'

describe('matrix rotation', () => {
  it('rotates 90 degrees left or 270 degrees right', () => {
    // 1 2 3    3 6 9
    // 4 5 6 -> 2 5 8
    // 7 8 9    1 4 7
    const original = [1, 2, 3, 4, 5, 6, 7, 8, 9]

    const expected = [3, 6, 9, 2, 5, 8, 1, 4, 7]
    expect(rotateLeft(original)).toEqual(expected)
    expect(rotateRight(original, 3)).toEqual(expected)
  })

  it('rotates 180 degrees either side', () => {
    // 1 2 3    9 8 7
    // 4 5 6 -> 6 5 4
    // 7 8 9    3 2 1
    const original = [1, 2, 3, 4, 5, 6, 7, 8, 9]

    const expected = [9, 8, 7, 6, 5, 4, 3, 2, 1]
    expect(rotateLeft(original, 2)).toEqual(expected)
    expect(rotateRight(original, 2)).toEqual(expected)
  })

  it('rotates 270 degrees left or 90 degrees right', () => {
    // 1 2 3    7 4 1
    // 4 5 6 -> 8 5 2
    // 7 8 9    9 6 3
    const original = [1, 2, 3, 4, 5, 6, 7, 8, 9]

    const expected = [7, 4, 1, 8, 5, 2, 9, 6, 3]
    expect(rotateLeft(original, 3)).toEqual(expected)
    expect(rotateRight(original)).toEqual(expected)
  })

  it('rotates 90 degrees left or 270 degrees right (4x4 matrix)', () => {
    //  1  2  3  4     4  8 12 16
    //  5  6  7  8 ->  3  7 11 15
    //  9 10 11 12     2  6 10 14
    // 13 14 15 16     1  5  9 13
    const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]

    const expected = [4, 8, 12, 16, 3, 7, 11, 15, 2, 6, 10, 14, 1, 5, 9, 13]
    expect(rotateLeft(original)).toEqual(expected)
    expect(rotateRight(original, 3)).toEqual(expected)
  })

  it('rotates 90 degrees left for equivalent non-standard step counts', () => {
    // 1 2 3    3 6 9
    // 4 5 6 -> 2 5 8
    // 7 8 9    1 4 7
    const original = [1, 2, 3, 4, 5, 6, 7, 8, 9]

    const expected = [3, 6, 9, 2, 5, 8, 1, 4, 7]
    expect(rotateLeft(original)).toEqual(expected)
    expect(rotateLeft(original, 1)).toEqual(expected)
    expect(rotateLeft(original, 5)).toEqual(expected)
    expect(rotateLeft(original, 17)).toEqual(expected)
    expect(rotateLeft(original, -3)).toEqual(expected)
    expect(rotateLeft(original, -15)).toEqual(expected)
  })
})

describe('mirroring', () => {
  it('mirrors horizontally', () => {
    // 1 2 3    3 2 1
    // 4 5 6 -> 6 5 4
    // 7 8 9    9 8 7
    const original = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    
    const expected = [3, 2, 1, 6, 5, 4, 9, 8, 7]
    expect(mirrorHorizontally(original)).toEqual(expected)
    expect(mirrorHorizontally(mirrorHorizontally(original))).toEqual(original)
  })

  it('mirrors vertically', () => {
    // 1 2 3    7 8 9
    // 4 5 6 -> 4 5 6
    // 7 8 9    1 2 3
    const original = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    
    const expected = [7, 8, 9, 4, 5, 6, 1, 2, 3]
    expect(mirrorVertically(original)).toEqual(expected)
    expect(mirrorVertically(mirrorVertically(original))).toEqual(original)
  })
})