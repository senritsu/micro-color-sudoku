<template>
  <div
    :class="$style.colors"
    :style="{ gridTemplate }"
  >
    <div
      :class="{[$style.color]: true, [$style.active]: modelValue === null }"
      @click="onClick(null)"
    >
      🔁
    </div>

    <div
      v-for="(color, i) in colors" :key="color"
      :class="{[$style.color]: true, [$style.active]: modelValue === i }"
      :style="{ backgroundColor: colors[i] }"
      @click="onClick(i)"
    />
  </div>
</template>

<script>
import { defineComponent } from 'vue'

import colors from '../colors'

export default defineComponent({
  props: {
    modelValue: {
      validator: x => typeof x === 'number' || x === null,
      default: null
    },
    size: {
      type: Number,
      required: true
    }
  },
  computed: {
    gridTemplate () {
      return `auto / repeat(${this.size + 2}, 1fr)`
    },
    colors () {
      return colors.slice(0, this.size + 1)
    }
  },
  methods: {
    onClick (color) {
      this.$emit('update:modelValue', color)
    }
  }
})
</script>

<style module>
.colors {
  display: grid;
}

.color {
  font-size: 1em;
  height: 2.5em;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  cursor: pointer;
}

.color.active {
  border-bottom: 0.2em solid black;
}
</style>