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
  cursor: pointer;
  font-size: 2em;
  line-height: 0.75em;
  padding: 0.5em;
  margin: 0.5em;

  border-radius: 5%;
  border: none;
  /* border: 0.05em solid #aeaeae; */
  background-color: white;
  /* background-color: rgb(233, 233, 233); */
  box-shadow: 0.05em 0.1em 0.3em 0.1em #d1d1d1;

  transition: background-color 0.2s;
}

.button:hover {
  background-color: rgb(238, 238, 238);
}
</style>