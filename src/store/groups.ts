import { writable } from 'svelte/store'

import type { prismaClient } from '$lib/utils/prisma'

export type Group = NonNullable<Awaited<ReturnType<typeof prismaClient.todoGroup.findUnique>>>
export const groups = writable<Group[]>([])
