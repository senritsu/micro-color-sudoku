<template>
  <Menu v-if="state.matches('menu')" @start="send({type: 'START', payload: {size: $event}})" />
  <Puzzle
    v-else-if="state.matches('puzzle')"
    v-bind="state.context"
    @set="send({type: 'SET', payload: $event})"
    @gameover="send('GAMEOVER')"
    @back="send('BACK')"
  />
  <Result 
    v-if="state.matches('result')"
    @back="send('BACK')"
  />
</template>

<script lang="ts">
import { useMachine } from '@xstate/vue';
import { Machine, assign } from 'xstate';
import { defineComponent } from 'vue'

import randomize from './randomize'
import puzzles from './puzzles'

import Menu from './components/Menu.vue'
import Puzzle from './components/Puzzle.vue'
import Result from './components/Result.vue'

interface SudokuContext {
  size: number,
  cells: number[],
  fixedCells: number[]
}

const gameMachine = Machine<SudokuContext>({
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
      size: (context, event) => event.payload.size
    }),
    createPuzzle: assign({
      cells: (context, event) => {
        const options = puzzles[context.size]
        const puzzle = options[Math.floor(Math.random() * options.length)]

        return randomize(puzzle)
      }
    }),
    setFixedCells: assign({
      fixedCells: (context, event) => context.cells.reduce((fixed, cell, i) => {
        if (cell) {
          fixed.push(i)
        }
        return fixed
      }, [] as number[])
    }),
    setCell: assign({
      cells: (context, event) => {
        const cells = [...context.cells]

        const { index, value } = event.payload

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

export default defineComponent({
  name: 'App',
  components: {
    Menu,
    Puzzle,
    Result
  },
  setup () {
    const { state, send } = useMachine(gameMachine)

    return { state, send }
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;

  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>