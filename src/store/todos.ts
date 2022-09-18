import type { Todo } from '@prisma/client'
import { writable } from 'svelte/store'

export const todos = writable<Record<number, Omit<Todo, 'groupId'>[]>>({})
