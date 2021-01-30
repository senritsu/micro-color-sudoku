<template>
  <div
    :class="{ [$style.cell]: true, [$style.fixed]: fixed }" 
    :style="{ backgroundColor }"
  />
</template>

<script>
import { defineComponent } from 'vue'

import colors from '../colors'

export default defineComponent({
  props: {
    value: {
      type: Number,
      required: true
    },
    fixed: {
      type: Boolean
    }
  },
  computed: {
    backgroundColor () {
      return colors[this.value]
    }
  }
})
</script>

<style module>
.cell {
  width: 100%;
  height: 100%;
}

.cell.fixed {
  border: 0.1em dashed black;
  box-sizing: border-box;
}
</style>