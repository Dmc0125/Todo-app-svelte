import type { RequestHandler } from './$types'
import { AppError, errorResponse, jsonResponse } from '$lib/utils/response'
import { prismaClient } from '$lib/utils/prisma'
import { todoSchema } from '$lib/schemas/todo'
import { groupId } from '$lib/schemas/group'

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
