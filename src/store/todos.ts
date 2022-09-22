import type { Todo } from '@prisma/client'
import { writable } from 'svelte/store'

export const todos = writable<Record<number, Omit<Todo, 'groupId'>[]>>({})

export type BatchForDelete = Set<number> | null
export const batchForDelete = writable<BatchForDelete | null>(null)
export const addToDeleteBatch = (id: number) => {
  batchForDelete.update((ba) => {
    if (!ba) {
      return new Set([id])
    }
    ba.add(id)
    return ba
  })
}
export const removeFromDeleteBatch = (id: number) => {
  batchForDelete.update((ba) => {
    if (!ba) {
      throw Error('DeleteBatchActionStore is not defined')
    }
    ba.delete(id)
    if (!ba.size) {
      return null
    }
    return ba
  })
}

type BatchForComplete = Map<number, { done: boolean }>
export const batchForComplete = writable<BatchForComplete>(new Map())
export const addToCompleteBatch = (id: number, todoState: boolean) => {
  batchForComplete.update((bc) => {
    bc.set(id, { done: todoState })
    return bc
  })
}
export const removeFromCompleteBatch = (id: number) => {
  batchForComplete.update((bc) => {
    bc.delete(id)
    return bc
  })
}
