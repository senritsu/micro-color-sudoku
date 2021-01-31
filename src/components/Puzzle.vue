<template>
  <Button @click="onBackClick">↩</Button>
  <div :class="$style.container">
    <div :class="$style.grid">
      <div 
        v-for="(n, i) in size" :key="`block-underlay-${i}`"
        :class="[$style.group, $style.blockUnderlay]"
        :style="placement.block(i)"
      >

      </div>

      <!-- cells -->
      <Cell
        v-for="(cell, i) in cells" :key="`cell-${i}`" 
        :value="cell" :fixed="fixedCells.includes(i)" 
        :style="placement.cell(i)"
        @click="onCellClick(i)"
      />

      <template v-for="(n, i) in size" :key="`overlay-${i}`">
        <!-- row overlays -->
        <div
          :class="$style.group"
          :style="placement.row(i)"
        >
          <div :class="{ [$style.errorOverlay]: true, [$style.error]: validation.rows[i] === 'error'}" />
        </div>
        <!-- column overlays -->
        <div
          :class="$style.group"
          :style="placement.column(i)"
        >
          <div :class="{ [$style.errorOverlay]: true, [$style.error]: validation.columns[i] === 'error' }" />
        </div>
        <!-- block overlays -->
        <div
          :class="{ [$style.group]: true, [$style.block]: true }"
          :style="placement.block(i)"
        >
          <div :class="{ [$style.errorOverlay]: true, [$style.error]: validation.blocks[i] === 'error' }" />
        </div>
      </template>

      
    </div>
    <ColorSelection
      v-model="color"
      :size="size"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRef, computed, watch, PropType } from 'vue'

import Button from './Button.vue'
import Cell from './Cell.vue'
import ColorSelection from './ColorSelection.vue'

import { useSquareLayout } from '../composition/layout'
import { useValidation } from '../composition/validation'

export default defineComponent({
  components: {
    Button,
    Cell,
    ColorSelection
  },
  props: {
    size: { type: Number, required: true },
    cells: { type: Array as PropType<number[]>, required: true },
    fixedCells: { type: Array as PropType<number[]>, required: true }
  },
  emits: ['set', 'gameover', 'back'],
  setup (props, { emit }) {
    const color = ref(1)

    const { groups, placement } = useSquareLayout(toRef(props, 'cells'))

    const { validation } = useValidation(groups)

    watch(() => validation.value.puzzle, state => {
      if (state === 'correct') {
        emit('gameover')
      }
    })

    function onCellClick(index: number) {
      if (props.fixedCells.includes(index)) return

      emit('set', {index, value: color.value })
    }

    function onBackClick() {
      emit('back')
    }

    return {
      color,
      placement,
      validation,
      onCellClick,
      onBackClick
    }
  }
})
</script>

<style module>
.container {
  display: flex;
  margin-top: 10vw;
  flex-direction: column;
  box-shadow: 0.05em 0.1em 0.3em 0.1em #d1d1d1;
}

.grid {
  font-size: 10vw;

  width: 80vw;
  height: 80vw;

  display: grid;
  border: 0.2em solid white;
  /* background-color: rgb(238, 232, 230); */
  gap: 0.2em;
  padding: 0.2em;
  align-items: center;
  justify-items: center;
}

@media (orientation: landscape) {
  .container {
    margin-top: 10vh;
  }

  .grid {
    font-size: 5vh;

    width: 40vh;
    height: 40vh;
  }
}

.group {
  align-self: stretch;
  justify-self: stretch;
  padding: 0.2em;
  pointer-events: none;
}

.blockUnderlay {
  margin: -0.15em;
  border: 0.1em solid rgb(211, 210, 210);
  /* background-color: #6d6d6d; */
}

.group > .errorOverlay {
  width: 100%;
  height: 100%;
  opacity: 0.1;

  transition: background-color 0.3s;
}

.group > .errorOverlay.error {
  background-color: red;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% {
    opacity: 0.1;
  }
  50% {
    opacity: 0.2;
  }
}
</style>