<template>
  <div
    :class="$style.colors"
    :style="{ gridTemplate }"
  >
    <div
      v-for="(color, i) in relevantColors" :key="color"
      :class="{[$style.color]: true, [$style.active]: modelValue === (i + 1)}"
      :style="{ backgroundColor: relevantColors[i] }"
      @click="onClick(i + 1)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

import colors from '../colors'

export default defineComponent({
  props: {
    modelValue: {
      type: Number,
      required: true
    },
    size: {
      type: Number,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    const relevantColors = computed(() => colors.slice(1, props.size + 1))

    const gridTemplate = computed(() => `auto / repeat(${props.size}, 1fr)`)

    function onClick (color: number) {
      emit('update:modelValue', color)
    }

    return {
      relevantColors,
      gridTemplate,
      onClick
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