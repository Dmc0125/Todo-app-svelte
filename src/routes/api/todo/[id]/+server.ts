import { z } from 'zod'

import type { RequestHandler } from './$types'
import { requiredError, typeError } from '$lib/utils/zod'
import { jsonResponse, zodErrorResponse } from '$lib/utils/response'
import { idStrToNumSchema } from '../utils'
import { prismaClient } from '$lib/utils/prisma'

const getSchema = z.object({
  todoId: idStrToNumSchema({
    invalid_type_error: typeError('todoId', 'number'),
  }),
  groupId: idStrToNumSchema({
    required_error: requiredError('groupId'),
    invalid_type_error: typeError('groupId', 'number'),
  }),
})

export const GET: RequestHandler = async ({ params, url }) => {
  const result = getSchema.safeParse({
    todoId: params.id,
    groupId: url.searchParams.get('groupId'),
  })
  if (!result.success) {
    console.log(result.error)
    return zodErrorResponse(result.error)
  }

  const { todoId, groupId } = result.data
  try {
    const todo = await prismaClient.todo.findFirst({
      where: {
        id: todoId,
        groupId: groupId,
      },
    })
    return jsonResponse(todo)
  } catch (error) {
    return jsonResponse('Server error')
  }
}
