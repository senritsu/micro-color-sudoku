<template>
  <h3 :class="$style.subheader">Micro</h3>
  <h1 :class="$style.header">Color Sudoku</h1>
  <Button @click="$emit('start', 4)">🔰</Button>
  <Button @click="$emit('start', 9)">💠</Button>
</template>

<script>
import { defineComponent } from 'vue'

import Button from './Button.vue'

export default defineComponent({
  components: {
    Button
  },
  emits: ['start'],
  setup () {
    
  }
})
</script>

<style module>
.subheader {
  margin: 0;
  opacity: 0.25;
}
.header {
  margin-top: 0;
  font-size: 2.5em;
}
</style>