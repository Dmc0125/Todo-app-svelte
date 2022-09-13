import type { PageServerLoad } from './$types'
import type { RequestLocals } from '$lib/hooks.server'
import { prismaClient } from '$lib/utils/prisma'

export const load: PageServerLoad = async ({ locals }) => {
  const { id } = locals as RequestLocals
  const groups = await prismaClient.todoGroup.findMany({
    where: {
      author: Number(id),
    },
  })
  return {
    groups,
  }
}
