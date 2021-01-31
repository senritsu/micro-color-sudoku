import { Machine, assign } from 'xstate';

import randomize from '../randomize'
import puzzles from '../puzzles'

interface SudokuContext {
  size: number,
  cells: number[],
  fixedCells: number[]
}

interface SudokuStateSchema {
  states: {
    menu: {},
    puzzle: {},
    result: {}
  }
}

interface StartEvent { type: 'START', payload: { size: number } }
interface SetEvent { type: 'SET', payload: { index: number, value: number } }

type SudokuEvent =
  | StartEvent
  | SetEvent
  | { type: 'BACK' }
  | { type: 'GAMEOVER' }

export default Machine<SudokuContext, SudokuStateSchema, SudokuEvent>({
  id: 'game',
  context: {
    size: 0,
    cells: [],
    fixedCells: []
  },
  initial: 'menu',
  states: {
    menu: {
      on: {
        START: {
          target: 'puzzle',
          actions: ['setSize', 'createPuzzle', 'setFixedCells']
        }
      }
    },
    puzzle: {
      on: {
        BACK: 'menu',
        GAMEOVER: 'result',
        SET: {
          actions: 'setCell'
        }
      }
    },
    result: {
      on: {
        BACK: 'menu'
      }
    }
  }
}, {
  actions: {
    setSize: assign({
      size: (context, event) => (event as StartEvent).payload.size
    }),
    createPuzzle: assign({
      cells: (context, event) => {
        const options = puzzles[context.size]
        const puzzle = options[Math.floor(Math.random() * options.length)]
  
        return randomize(puzzle)
      }
    }),
    setFixedCells: assign({
      fixedCells: (context) => context.cells.reduce((fixed, cell, i) => {
        if (cell) {
          fixed.push(i)
        }
        return fixed
      }, [] as number[])
    }),
    setCell: assign({
      cells: (context, event) => {
        const cells = [...context.cells]
  
        const { index, value } = (event as SetEvent).payload
  
        // toggle functionality, in addition to simply setting a value
        if (value === cells[index]) {
          cells[index] = 0
        } else {
          cells[index] = value
        }
  
        return cells;
      }
    })
  }
})