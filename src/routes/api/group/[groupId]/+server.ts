import type { RequestHandler } from './$types'
import { groupId } from '$lib/schemas/group'
import { prismaClient } from '$lib/utils/prisma'
import { AppError, errorResponse, jsonResponse } from '$lib/utils/response'

export const DELETE: RequestHandler = async ({ params }) => {
  const result = groupId.safeParse(params.groupId)
  console.log(params)
  if (!result.success) {
    return errorResponse(AppError.validation, result.error)
  }

  try {
    const id = result.data
    await prismaClient.$transaction([
      prismaClient.todoGroup.delete({
        where: {
          id,
        },
      }),
      prismaClient.todo.deleteMany({
        where: {
          groupId: id,
        },
      }),
    ])
    return jsonResponse(undefined)
  } catch (error) {
    return errorResponse(AppError.unknown)
  }
}
