import type { Todo } from '@prisma/client'
import { writable } from 'svelte/store'

export const todos = writable<Record<number, Omit<Todo, 'groupId'>[]>>({})

export const batchForDelete = writable<Set<number>>(new Set())
export const addToDeleteBatch = (id: number) => {
  batchForDelete.update((ba) => {
    ba.add(id)
    return ba
  })
}
export const removeFromDeleteBatch = (id: number) => {
  batchForDelete.update((ba) => {
    ba.delete(id)
    return ba
  })
}

export const batchForComplete = writable<Map<number, { done: boolean }>>(new Map())
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
