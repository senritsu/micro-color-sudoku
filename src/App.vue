<template>
  <Menu v-if="state.matches('menu')" @start="onStart" />
  <Puzzle
    v-else-if="state.matches('puzzle')"
    v-bind="state.context"
    @set="onSet"
    @gameover="onGameover"
    @back="onBack"
  />
  <Result 
    v-if="state.matches('result')"
    @back="onBack"
  />
</template>

<script lang="ts">
import { useMachine } from '@xstate/vue';
import { defineComponent } from 'vue'


import Menu from './components/Menu.vue'
import Puzzle from './components/Puzzle.vue'
import Result from './components/Result.vue'

import appMachine from './machines/appMachine'

export default defineComponent({
  name: 'App',
  components: {
    Menu,
    Puzzle,
    Result
  },
  setup () {
    const { state, send } = useMachine(appMachine)

    return {
      state,
      onStart: (size: number) => send({ type: 'START', payload: { size } }),
      onSet: (payload : { index : number, value : number }) => send({ type: 'SET', payload }), 
      onBack: () => send({ type: 'BACK' }),
      onGameover: () => send({ type: 'GAMEOVER' })
    }
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