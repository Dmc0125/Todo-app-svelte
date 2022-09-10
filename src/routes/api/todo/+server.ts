import { z } from 'zod'

import type { RequestHandler } from './$types'
import { requiredError, typeError } from '$lib/utils/zod'
import { jsonResponse, zodErrorResponse } from '$lib/utils/response'
import { prismaClient } from '$lib/utils/prisma'

const todoSchema = z.object({
  title: z
    .string({
      required_error: requiredError('title'),
      invalid_type_error: typeError('title', 'string'),
    })
    .max(100)
    .min(1),
  content: z
    .string({
      required_error: requiredError('content'),
      invalid_type_error: typeError('content', 'string'),
    })
    .max(500)
    .min(1),
  groupId: z
    .number({
      required_error: requiredError('groupId'),
      invalid_type_error: typeError('groupId', 'number'),
    })
    .min(1),
})

// TODO: Add total todos to group and increment on create
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

const getTodosQuerySchema = z.object({
  todoId: z
    .string({
      invalid_type_error: typeError('todoId', 'number'),
    })
    .regex(/^[1-9][0-9]*/)
    .nullable(),
  groupId: z
    .string({
      required_error: requiredError('groupId'),
      invalid_type_error: typeError('groupId', 'number'),
    })
    .regex(/^[1-9][0-9]*/),
})

export const GET: RequestHandler = async ({ url }) => {
  const result = getTodosQuerySchema.safeParse({
    todoId: url.searchParams.get('todoId'),
    groupId: url.searchParams.get('groupId'),
  })
  if (!result.success) {
    return zodErrorResponse(result.error)
  }

  const { todoId, groupId } = result.data
  const todoIdNum = Number(todoId)
  const groupIdNum = Number(groupId)

  try {
    const data = await (async () => {
      if (todoId) {
        return prismaClient.todo.findFirst({
          where: {
            id: todoIdNum,
            groupId: groupIdNum,
          },
        })
      }
      return prismaClient.todo.findMany({
        where: {
          groupId: groupIdNum,
        },
      })
    })()
    return jsonResponse(data)
  } catch (error) {
    return jsonResponse('Server error.', {
      init: {
        status: 500,
      },
    })
  }
}
