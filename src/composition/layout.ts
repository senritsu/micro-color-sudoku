import { Ref, computed } from 'vue'

export interface Groups {
  rows: Ref<number[][]>,
  columns: Ref<number[][]>,
  blocks: Ref<number[][]>
}

interface GridPosition {
  gridRow: string,
  gridColumn: string
}

interface GridPositionFunction {
  (rowMajorIndex: number): GridPosition
}

interface GridPlacement {
  cell: GridPositionFunction,
  row: GridPositionFunction,
  column: GridPositionFunction,
  block: GridPositionFunction
}

interface GridLayout {
  groups: Ref<Groups>, 
  placement: Ref<GridPlacement>
}

export function squarePlacement (gridSize: number) : GridPlacement {
  const N = gridSize
  const K = Math.sqrt(N)

  return {
    cell: (index : number) => ({
      gridRow: `${Math.floor(index / N) + 1} / span 1`,
      gridColumn: `${index % N + 1} / span 1`
    }),
    row: (index : number) => ({
      gridRow: `${index + 1} / span 1`,
      gridColumn: `1 / span ${N}`
    }),
    column: (index : number) => ({
      gridRow: `1 / span ${N}`,
      gridColumn: `${index + 1} / span 1`
    }),
    block: (index : number) => ({
      gridRow: `${1 + Math.floor(index / K) * K} / span ${K}`,
      gridColumn: `${1 + (index % K) * K} / span ${K}`
    })
  }
}

export function useSquareLayout (cells: Ref<number[]>) : GridLayout {
  const N = computed(() => Math.sqrt(cells.value.length))

  function forSize<T>(f: (index: number) => T) {
    return Array.from({ length: N.value }).map((_, i) => f(i))
  } 
  
  const rows = computed(() => {
    const n = N.value
    return forSize(i => cells.value.slice(n * i, n * i + n))
  })
  const columns = computed(() => {
    return forSize(i => rows.value.map(row => row[i]))
  })
  const blocks = computed(() => {
    const n = N.value
    const k = Math.sqrt(n)
    
    return forSize(i => forSize(j => {
      return cells.value[j % k
        // block row offset = row * size * size
        + Math.floor(i / k) * n * k
        // block column offset = col * blockSize
        + (i % k) * k
        // cell row offset = cellrow * size
        + Math.floor(j / k) * n]
    }))
  })

  const groups = computed(() => ({
    rows,
    columns,
    blocks
  } as Groups))

  const placement = computed(() => squarePlacement(N.value))

  return {
    groups,
    placement
  }
}