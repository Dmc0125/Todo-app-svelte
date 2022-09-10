import { z } from 'zod'

import type { RequestHandler } from './$types'
import { requiredError, typeError } from '$lib/utils/zod'
import { jsonResponse, zodErrorResponse } from '$lib/utils/response'
import { prismaClient } from '$lib/utils/prisma'

const todoSchema = z.object({
  title: z.string({
    required_error: requiredError('title'),
    invalid_type_error: typeError('title', 'string'),
  }).max(100).min(1),
  content: z.string({
    required_error: requiredError('content'),
    invalid_type_error: typeError('content', 'string'),
  }).max(500).min(1),
  groupId: z.number({
    required_error: requiredError('groupId'),
    invalid_type_error: typeError('groupId', 'number'),
  }).min(1),
})

export const POST: RequestHandler = async ({ request }) => {
  const result = todoSchema.safeParse(await request.json())
  if (!result.success) {
    return zodErrorResponse(result.error)
  }

  const { groupId } = result.data
  const group = await prismaClient.todoGroup.findFirst({
    where: {
      id: groupId,
    },
  })

  if (!group) {
    return jsonResponse(`Group with id ${groupId} does not exist.`, {
      success: false,
    })
  }

  try {
    const insertedTodo = await prismaClient.todo.create({
      data: result.data,
    })
    return jsonResponse(insertedTodo)
  } catch (error) {
    return jsonResponse('Server error.', {
      init: {
        status: 500,
      },
    })
  }
}
