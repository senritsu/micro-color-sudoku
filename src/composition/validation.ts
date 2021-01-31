import { Ref, computed, watch } from 'vue'

import { Groups } from './layout'

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

export function useValidation (groups: Ref<Groups>) {
  const rowValidationStates = computed(() => groups.value.rows.value.map(getState))
  const columnValidationStates = computed(() => groups.value.columns.value.map(getState))
  const blockValidationStates = computed(() => groups.value.blocks.value.map(getState))

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
    blocks: blockValidationStates.value,
    puzzle: puzzleValidationState.value
  }))

  return { validation }
}