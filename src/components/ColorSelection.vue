<template>
  <div
    :class="$style.colors"
    :style="{ gridTemplate }"
  >
    <div
      v-for="(color, i) in colors" :key="color"
      :class="{[$style.color]: true, [$style.active]: modelValue === (i + 1)}"
      :style="{ backgroundColor: colors[i] }"
      @click="onClick(i + 1)"
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
      return `auto / repeat(${this.size}, 1fr)`
    },
    colors () {
      return colors.slice(1, this.size + 1)
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
  height: 2.5em;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  cursor: pointer;
  border-color: white;

  transition: border-color 0.2s;
}

.color:hover {
  border-bottom: 0.2em solid rgb(192, 192, 192);
}

.color.active {
  border-bottom: 0.2em solid black;
}

</style>