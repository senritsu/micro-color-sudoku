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
  (i: number): GridPosition
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

export function useSquareLayout (cells: Ref<number[]>) : GridLayout {
  const N = computed(() => Math.sqrt(cells.value.length))
  const K = computed(() => Math.sqrt(N.value))

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
    const k = K.value
    
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

  const placement = computed(() => {
    const n = N.value
    const k = K.value
    
    return {
      cell: (index : number) => ({
        gridRow: `${Math.floor(index / n) + 1} / span 1`,
        gridColumn: `${index % n + 1} / span 1`
      }),
      row: (index : number) => ({
        gridRow: `${index + 1} / span 1`,
        gridColumn: `1 / ${n + 1}`
      }),
      column: (index : number) => ({
        gridRow: `1 / ${n + 1}`,
        gridColumn: `${index + 1} / span 1`
      }),
      block: (index : number) => ({
        gridRow: `${1 + Math.floor(index / k) * k} / span ${k}`,
        gridColumn: `${1 + (index % k) * k} / span ${k}`
      })
    }
  })

  return {
    groups,
    placement
  }
}