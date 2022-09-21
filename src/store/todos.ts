import type { Todo } from '@prisma/client'
import { writable } from 'svelte/store'

export const todos = writable<Record<number, Omit<Todo, 'groupId'>[]>>({})

export type StashedForDelete = Set<number> | null
export const deleteStashedBatch = writable<StashedForDelete | null>(null)
export const addToDeleteBatch = (id: number) => {
  deleteStashedBatch.update((ba) => {
    if (!ba) {
      return new Set([id])
    }
    ba.add(id)
    return ba
  })
}
export const removeFromDeleteBatch = (id: number) => {
  deleteStashedBatch.update((ba) => {
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
