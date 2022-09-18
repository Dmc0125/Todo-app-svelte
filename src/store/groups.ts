import type { TodoGroup } from '@prisma/client'
import { writable } from 'svelte/store'

export const groups = writable<TodoGroup[]>([])
