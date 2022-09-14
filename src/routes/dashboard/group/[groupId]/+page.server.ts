import type { PageServerLoad } from './$types'
import { prismaClient } from '$lib/utils/prisma'

export const load: PageServerLoad = async ({ params }) => {
  const todos = await prismaClient.todo.findMany({
    where: {
      groupId: Number(params.groupId),
    },
  })
  return {
    todos,
  }
}
