<template>
  <Button @click="onBackClick">↩</Button>
  <div :class="$style.container">
    <div :class="$style.grid">

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
      </template>

      <!-- block overlays -->
      <div
        v-for="(n, i) in size" :key="`group-${i}`"
        :class="{ [$style.group]: true, [$style.block]: true }"
        :style="placement.block(i)"
      >
        <div :class="{ [$style.errorOverlay]: true, [$style.error]: validation.blocks[i] === 'error' }" />
      </div>
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

    const blockSize = computed(() => Math.sqrt(props.size))

    function forSize<T>(f: (index: number) => T) {
      return Array.from({length: props.size}).map((_, i) => f(i))
    } 
    
    const rows = computed(() => {
      return forSize(i => props.cells.slice(props.size * i, props.size * i + props.size))
    })
    const columns = computed(() => {
      return forSize(i => rows.value.map(row => row[i]))
    })
    const blocks = computed(() => {
      return forSize(i => forSize(j => {
        const N = props.size
        const K = blockSize.value

        return props.cells[j % K
          // block row offset = row * size * size
          + Math.floor(i / K) * N * K
          // block column offset = col * blockSize
          + (i % K) * K
          // cell row offset = cellrow * size
          + Math.floor(j / K) * N]
      }))
    })

    function isFilled (group: number[]) {
      return group.every(x => x)
    }
    function hasError (group: number[]) {
      return group.some((x, i, arr) => x && (arr.indexOf(x) !== i))
    }

    type ValidationResult = 'error' | 'correct' | 'incomplete'
    function getState (group: number[]) : ValidationResult {
      return hasError(group) 
        ? 'error'
        : isFilled(group)
          ? 'correct'
          : 'incomplete'
    }

    const rowValidationStates = computed(() => rows.value.map(getState))
    const columnValidationStates = computed(() => columns.value.map(getState))
    const blockValidationStates = computed(() => blocks.value.map(getState))

    const puzzleValidationState = computed(() => {
      const concatenated = [...rowValidationStates.value, ...columnValidationStates.value, ...blockValidationStates.value]

      return concatenated.some(x => x === 'error')
        ? 'error'
        : concatenated.every(x => x === 'correct')
          ? 'correct'
          : 'incomplete'
    })

    const validation = computed(() => ({
      rows: rowValidationStates.value,
      columns: columnValidationStates.value,
      blocks: blockValidationStates.value
    }))

    watch(() => puzzleValidationState.value, state => {
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

    const placement = {
      cell: (index : number) => ({
        gridRow: `${Math.floor(index / props.size) + 1} / span 1`,
        gridColumn: `${index % props.size + 1} / span 1`
      }),
      row: (index : number) => ({
        gridRow: `${index + 1} / span 1`,
        gridColumn: `1 / ${props.size + 1}`
      }),
      column: (index : number) => ({
        gridRow: `1 / ${props.size + 1}`,
        gridColumn: `${index + 1} / span 1`
      }),
      block: (index : number) => ({
        gridRow: `${1 + Math.floor(index / blockSize.value) * blockSize.value} / span ${blockSize.value}`,
        gridColumn: `${1 + (index % blockSize.value) * blockSize.value} / span ${blockSize.value}`
      })
    }

    return {
      color,
      rows,
      columns,
      blocks,
      validation,
      placement,
      onCellClick,
      onBackClick
    }
  }
})
</script>

<style module>
.container {
  display: flex;
  flex-direction: column;
}

.grid {
  font-size: 10vw;
  margin-top: 10vw;

  width: 80vw;
  height: 80vw;

  display: grid;
  border: 0.2em solid rgb(0, 0, 0);
  /* background-color: rgb(238, 232, 230); */
  gap: 0.2em;
  padding: 0.2em;
  align-items: center;
  justify-items: center;
}

@media (orientation: landscape) {
  .grid {
    font-size: 5vh;
    margin-top: 10vh;

    width: 40vh;
    height: 40vh;
  }
}

.group {
  align-self: stretch;
  justify-self: stretch;
  margin: -0.1em;
  padding: 0.3em;
  pointer-events: none;
}

.group.block {
  border: 1px solid rgb(199, 199, 199);
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