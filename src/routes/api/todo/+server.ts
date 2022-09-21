import type { RequestHandler } from './$types'
import { AppError, errorResponse, jsonResponse } from '$lib/utils/response'
import { prismaClient } from '$lib/utils/prisma'
import { todoId, todoSchema } from '$lib/schemas/todo'
import { groupId } from '$lib/schemas/group'
import { z } from 'zod'
import { requiredError, typeError } from '$lib/utils/zod'

export const POST: RequestHandler = async ({ request }) => {
  const result = todoSchema.safeParse(await request.json())
  if (!result.success) {
    return errorResponse(AppError.validation, result.error)
  }

  const { groupId } = result.data
  const group = await prismaClient.todoGroup.findFirst({
    where: {
      id: groupId,
    },
  })

  if (!group) {
    return errorResponse(AppError.notFound, `Group with id ${groupId} does not exist.`)
  }

  try {
    const insertedTodo = await prismaClient.todo.create({
      data: result.data,
    })
    await prismaClient.todoGroup.update({
      where: {
        id: groupId,
      },
      data: {
        todosCount: { increment: 1 },
      },
    })
    return jsonResponse(insertedTodo)
  } catch (error) {
    return errorResponse(AppError.unknown)
  }
}

export const GET: RequestHandler = async ({ url }) => {
  const result = groupId.safeParse(url.searchParams.get('groupId'))

  if (!result.success) {
    return errorResponse(AppError.validation, result.error)
  }

  try {
    return jsonResponse(
      await prismaClient.todo.findMany({
        where: {
          groupId: result.data,
        },
      }),
    )
  } catch (error) {
    return errorResponse(AppError.unknown)
  }
}

export const DELETE: RequestHandler = async ({ request }) => {
  const body = await request.json()
  const result = z
    .array(
      z
        .number({
          required_error: requiredError('todoId'),
          invalid_type_error: typeError('todoId', 'number'),
        })
        .min(1),
      {
        required_error: requiredError('todoIds'),
        invalid_type_error: typeError('todoIds', 'array of numbers'),
      },
    )
    .nonempty('todoIds must not be empty')
    .safeParse(body.todoIds)

  if (!result.success) {
    return errorResponse(AppError.validation, result.error)
  }

  const { data } = result
  const ids = [...new Set(data)]

  try {
    const deleteResult = await prismaClient.$transaction(
      ids.map((id) =>
        prismaClient.todo.delete({
          where: {
            id,
          },
        }),
      ),
    )
    return jsonResponse(deleteResult)
  } catch (error) {
    return errorResponse(AppError.unknown)
  }
}

export const PUT: RequestHandler = async ({ request }) => {
  const body = await request.json()
  const result = z
    .record(
      todoId,
      z.object({
        done: z.boolean({
          required_error: requiredError('done'),
          invalid_type_error: typeError('done', 'boolean'),
        }),
      }),
    )
    .safeParse(body)

  if (!result.success) {
    return errorResponse(AppError.validation, result.error)
  }

  try {
    const putResult = await prismaClient.$transaction(
      Object.entries(result.data).map(([id, { done }]) =>
        prismaClient.todo.update({
          where: {
            id: Number(id),
          },
          data: {
            done,
          },
        }),
      ),
    )
    return jsonResponse(putResult)
  } catch (error) {
    return errorResponse(AppError.unknown)
  }
}
