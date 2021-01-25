<template>
  <h1 :class="$style.crown">👑</h1>
  <button :class="$style.button" @click="$emit('back')">↩</button>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  emits: ['start'],
  setup () {
    
  }
})
</script>

<style module>
.crown {
  font-size: 5em;
  margin: 0.5em;
  animation: pulse 1.5s linear infinite;
}
.button {
  font-size: 3em;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  5% {
    transform: scale(1.2);
  }
  15% {
    transform: scale(1.1);
  }
  90% {
    transform: scale(1);
  }
}
</style>