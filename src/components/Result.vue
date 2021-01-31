<template>
  <Button @click="$emit('back')">↩</Button>
  <h1 :class="$style.crown">👑</h1>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import Button from './Button.vue'

export default defineComponent({
  components: {
    Button
  },
  emits: ['back']
})
</script>

<style module>
.crown {
  font-size: 5em;
  margin: 0.5em;
  animation: pulse 1.5s linear infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  5% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>