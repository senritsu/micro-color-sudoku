import { squarePlacement } from './layout'

describe('square grid placement', () => {
  it('places cells correctly on a 4x4 grid', () => {
    const placement = squarePlacement(4)

    // 1 0 2 0
    // 0 3 0 0
    // 0 0 0 4
    // 0 0 5 0
    expect(placement.cell(0)).toEqual({ gridRow: '1 / span 1', gridColumn: '1 / span 1' })
    expect(placement.cell(2)).toEqual({ gridRow: '1 / span 1', gridColumn: '3 / span 1' })
    expect(placement.cell(5)).toEqual({ gridRow: '2 / span 1', gridColumn: '2 / span 1' })
    expect(placement.cell(11)).toEqual({ gridRow: '3 / span 1', gridColumn: '4 / span 1' })
    expect(placement.cell(14)).toEqual({ gridRow: '4 / span 1', gridColumn: '3 / span 1' })
  })

  it('places cells correctly on a 9x9 grid', () => {
    const placement = squarePlacement(9)
    
    expect(placement.cell(3)).toEqual({ gridRow: '1 / span 1', gridColumn: '4 / span 1' })
    expect(placement.cell(37)).toEqual({ gridRow: '5 / span 1', gridColumn: '2 / span 1' })
    expect(placement.cell(79)).toEqual({ gridRow: '9 / span 1', gridColumn: '8 / span 1' })
  })

  it('places rows correctly on a 4x4 grid', () => {
    const placement = squarePlacement(4)

    expect(placement.row(0)).toEqual({ gridRow: '1 / span 1', gridColumn: '1 / span 4' })
    expect(placement.row(2)).toEqual({ gridRow: '3 / span 1', gridColumn: '1 / span 4' })
  })

  it('places columns correctly on a 4x4 grid', () => {
    const placement = squarePlacement(4)

    expect(placement.column(1)).toEqual({ gridRow: '1 / span 4', gridColumn: '2 / span 1' })
    expect(placement.column(3)).toEqual({ gridRow: '1 / span 4', gridColumn: '4 / span 1' })
  })

  it('places blocks correctly on a 4x4 grid', () => {
    const placement = squarePlacement(4)

    expect(placement.block(0)).toEqual({ gridRow: '1 / span 2', gridColumn: '1 / span 2' })
    expect(placement.block(3)).toEqual({ gridRow: '3 / span 2', gridColumn: '3 / span 2' })
  })
})