import { z } from 'zod'

import type { RequestHandler } from './$types'
import { requiredError, typeError } from '$lib/utils/zod'
import { AppError, errorResponse, jsonResponse } from '$lib/utils/response'
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
    return errorResponse(AppError.validation, result.error)
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
    return errorResponse(AppError.unknown)
  }
}

const setDoneSchema = z
  .object({
    done: z.boolean(),
    groupId: z
      .number({
        required_error: requiredError('groupId'),
        invalid_type_error: typeError('groupId', 'number'),
      })
      .min(1),
  })
  .merge(getSchema.pick({ todoId: true }))

export const PUT: RequestHandler = async ({ request, params }) => {
  const body = await request.json()
  const result = setDoneSchema.safeParse({
    ...body,
    todoId: params.id,
  })
  if (!result.success) {
    return errorResponse(AppError.validation, result.error)
  }

  const { groupId, todoId, done } = result.data

  try {
    const [todo] = await prismaClient.$transaction([
      prismaClient.todo.update({
        where: {
          id: todoId,
        },
        data: {
          done,
        },
      }),
      prismaClient.todoGroup.update({
        where: {
          id: groupId,
        },
        data: {
          todosCompleted: { increment: 1 },
        },
      }),
    ])
    return jsonResponse(todo)
  } catch (error) {
    if (error && 'meta' in error) {
      const { meta } = error as { meta?: { cause: string } }
      if (meta?.cause === 'Record to update not found.') {
        return errorResponse(AppError.notFound, 'Todo or todoGroup not found.')
      }
    }
    return errorResponse(AppError.unknown)
  }
}
