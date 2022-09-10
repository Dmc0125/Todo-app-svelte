import { z } from 'zod'

import type { RequestHandler } from './$types'
import type { RequestLocals } from '$lib/hooks.server'
import { prismaClient } from '$lib/utils/prisma'
import { jsonResponse, zodErrorResponse } from '$lib/utils/response'
import { requiredError, typeError } from '$lib/utils/zod'

const groupSchema = z.object({
  name: z.string({
    required_error: requiredError('name'),
    invalid_type_error: typeError('name', 'string'),
  }).min(1).max(100),
  description: z.string({
    invalid_type_error: typeError('description', 'string'),
  }).max(300).default(''),
})

export const POST: RequestHandler = async ({ request, locals }) => {
  const { id } = locals as RequestLocals

  const result = groupSchema.safeParse(await request.json())
  if (!result.success) {
    return zodErrorResponse(result.error)
  }

  const { name, description } = result.data
  const insertedGroup = await prismaClient.todoGroup.create({
    data: {
      author: Number(id),
      name,
      description,
    },
  })

  return jsonResponse({
    success: true,
    data: insertedGroup,
  })
}
