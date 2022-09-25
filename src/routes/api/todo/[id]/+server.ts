import { z } from 'zod'

import type { RequestHandler } from './$types'
import { AppError, errorResponse, jsonResponse } from '$lib/utils/response'
import { prismaClient } from '$lib/utils/prisma'
import { groupId } from '$lib/schemas/group'
import { todoId } from '$lib/schemas/todo'

const getSchema = z.object({
  todoId,
  groupId,
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

const setDoneSchema = z.object({
  done: z.boolean(),
  groupId,
  todoId,
})

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

export const DELETE: RequestHandler = async ({ params }) => {
  const result = todoId.safeParse(params.id)
  if (!result.success) {
    return errorResponse(AppError.validation, result.error)
  }

  const id = result.data

  try {
    const todo = await prismaClient.todo.findUnique({
      where: {
        id,
      },
    })

    if (!todo) {
      return errorResponse(AppError.notFound, `Todo with id ${id} does not exist`)
    }


    const groupChange = todo.done
      ? {
        todosCount: { decrement: 1 },
        todosCompleted: { decrement: 1 },
      }
      : { todosCount: { decrement: 1 } }

    const response = await prismaClient.$transaction([
      prismaClient.todo.delete({
        where: {
          id: result.data,
        },
      }),
      prismaClient.todoGroup.update({
        where: {
          id: todo.groupId,
        },
        data: groupChange,
      }),
    ])
    return jsonResponse(response)
  } catch (error) {
    return errorResponse(AppError.unknown)
  }
}
