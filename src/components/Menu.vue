<template>
  <h1>Micro Color Sudoku</h1>
  <button @click="$emit('start', 4)">Start (4)</button>
  <button @click="$emit('start', 9)">Start (9)</button>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  emits: ['start'],
  setup () {
    
  }
})
</script>

<style scoped>
button {
  font-size: 2em;
  padding: 0.5em;
  margin: 1em;
}
</style>