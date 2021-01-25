<template>
  <Menu v-if="state.matches('menu')" @start="send({type: 'START', payload: {size: $event}})" />
  <Puzzle
    v-else-if="state.matches('puzzle')"
    v-bind="state.context"
    @set="send({type: 'SET', payload: $event})"
    @gameover="send('GAMEOVER')"
    @back="send('BACK')"
  />
  <Result v-if="state.matches('result')" />
</template>

<script lang="ts">
import { useMachine } from '@xstate/vue';
import { Machine, assign } from 'xstate';

import { defineComponent } from 'vue'
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
        const cells = new Array(context.size * context.size).fill(0)

        cells[1] = Math.floor(Math.random() * context.size + 1)
        cells[11] = Math.floor(Math.random() * context.size + 1)

        return cells;
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

        cells[event.payload.index] = event.payload.value

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