<template>
  <div
    :class="{ [$style.cell]: true, [$style.fixed]: fixed }" 
    :style="{ backgroundColor }"
  />
</template>

<script lang="ts">
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
    backgroundColor () : string {
      return colors[this.value]
    }
  }
})
</script>

<style module>
.cell {
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.cell.fixed {
  border: 0.075em dashed black;
  box-sizing: border-box;
}
</style>