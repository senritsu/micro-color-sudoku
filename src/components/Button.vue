<template>
  <button :class="$style.button">
    <slot />
  </button>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  setup () {
    
  }
})
</script>

<style module>
.button {
  font-size: 2em;
  padding: 0.5em;
  margin: 0.5em;

  border-radius: 10%;
  border: 0.1em solid #aeaeae;
  box-shadow: 0.05em 0.1em 0.2em 0.1em #eaeaea;
}
</style>