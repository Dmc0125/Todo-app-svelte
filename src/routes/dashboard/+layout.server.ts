import { redirect } from '@sveltejs/kit'

import type { LayoutServerLoad } from './$types'
import type { RequestLocals } from '$lib/hooks.server'
import { prismaClient } from '$lib/utils/prisma'
import { PUBLIC_BASE_URL } from '$env/static/public'

export const load: LayoutServerLoad = async ({ locals }) => {
  const { id } = locals as RequestLocals
  const user = await prismaClient.user.findUnique({
    where: {
      id: Number(id),
    },
  })

  if (!user) {
    throw redirect(301, `${PUBLIC_BASE_URL}?message=Unauthorized`)
  }

  return {
    user,
  }
}
