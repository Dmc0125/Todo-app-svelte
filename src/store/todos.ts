import { writable } from 'svelte/store'

import type { prismaClient } from '$lib/utils/prisma'

export type Todo = NonNullable<Awaited<ReturnType<typeof prismaClient.todo.findFirst>>>
export const todos = writable<Record<number, Omit<Todo, 'groupId'>[]>>({})
