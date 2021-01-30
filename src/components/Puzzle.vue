<template>
  <Button @click="$emit('back')">↩</Button>
  <div :class="$style.container">
    <div :class="$style.grid">

      <!-- cells -->
      <Cell
        v-for="(cell, i) in cells" :key="`cell-${i}`" 
        :value="cell" :fixed="fixedCells.includes(i)" 
        :style="{ gridArea: `${Math.floor(i / size) + 1} / ${i % size + 1} / span 1 / span 1` }"
        @click="onClick(i)"
      />

      <template v-for="i in size" :key="`overlay-${i}`">
        <!-- row overlays -->
        <div
          :class="{[$style.group]: true, [$style.error]: rowStatus[i - 1] === 'error'}"
          :style="{
            gridRow: `${i} / span 1`,
            gridColumn: `1 / ${this.size + 1}`
          }"
        />
        <!-- column overlays -->
        <div
          :class="{[$style.group]: true, [$style.error]: columnStatus[i - 1] === 'error'}"
          :style="{
            gridRow: `1 / ${this.size + 1}`,
            gridColumn: `${i} / span 1`
          }"
        />
      </template>

      <template v-for="i in blockSize">
        <!-- block overlays -->
        <div
          v-for="j in blockSize" :key="`group-${i}-${j}`"
          :class="{[$style.group]: true, [$style.error]: blockStatus[(i - 1) + this.blockSize * (j - 1)] === 'error'}"
          :style="{
            gridRow: `${1 + (j - 1) * blockSize} / span ${blockSize}`,
            gridColumn: `${1 + (i - 1) * blockSize} / span ${blockSize}`
          }"
        />
      </template>
    </div>
    <ColorSelection
      v-model="color"
      :size="size"
    />
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'

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
    cells: { type: Array, required: true },
    fixedCells: { type: Array, required: true }
  },
  emits: ['set', 'gameover', 'back'],
  data () {
    return {
      color: null
    }
  },
  computed: {
    blockSize () { return Math.sqrt(this.size) },
    rows () {
      return this.forSize(i => this.cells.slice(this.size * i, this.size * i + this.size))
    },
    rowStatus () {
      return this.rows.map(this.getStatus)
    },
    columns () {
      return this.forSize(i => this.rows.map(row => row[i]))
    },
    columnStatus () {
      return this.columns.map(this.getStatus)
    },
    blocks () {
      return this.forSize(i => this.forSize(j => {
        return this.cells[j % this.blockSize
          // block row offset = row * size * size
          + Math.floor(i / this.blockSize) * this.size * this.blockSize
          // block column offset = col * blockSize
          + (i % this.blockSize) * this.blockSize
          // cell row offset = cellrow * size
          + Math.floor(j / this.blockSize) * this.size]
      }))
    },
    blockStatus () {
      return this.blocks.map(this.getStatus)
    },
    combinedStatus () {
      const concatenated = [...this.rowStatus, ...this.columnStatus, ...this.blockStatus]

      return concatenated.some(x => x === 'error')
        ? 'error'
        : concatenated.every(x => x === 'correct')
          ? 'correct'
          : 'incomplete'
    }
  },
  watch: {
    combinedStatus (status) {
      if (status === 'correct') {
        this.$emit('gameover')
      }
    }
  },
  methods: {
    forSize (f) {
      return Array.from({length: this.size}).map((_, i) => f(i))
    },
    isFilled (group) {
      return group.every(x => x)
    },
    hasError (group) {
      return group.some((x, i, arr) => x && (arr.indexOf(x) !== i))
    },
    getStatus (group) {
      return this.hasError(group) 
        ? 'error'
        : this.isFilled(group)
          ? 'correct'
          : 'incomplete'
    },
    onClick (i) {
      if (this.fixedCells.includes(i)) return

      if (this.color === null) {
        // cycle colors
      this.$emit('set', {index: i, value: (this.cells[i] + 1) % (this.size + 1)})
      } else {
        // set/toggle selected color
        this.$emit('set', {index: i, value: this.color })
      }
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
  background-color: transparent;
  opacity: 0.1;
  /* margin: -0.1em; */
  margin: 0.2em;
  pointer-events: none;

  transition: background-color 0.3s;
}

.group.error {
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