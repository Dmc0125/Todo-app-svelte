import type { RequestHandler } from './$types'
import type { RequestLocals } from '$lib/hooks.server'
import { prismaClient } from '$lib/utils/prisma'
import { AppError, errorResponse, jsonResponse } from '$lib/utils/response'
import { groupSchema } from '$lib/schemas/group'

// Create Todo group
export const POST: RequestHandler = async ({ request, locals }) => {
  const { id } = locals as RequestLocals

  const result = groupSchema.safeParse(await request.json())
  if (!result.success) {
    return errorResponse(AppError.validation, result.error)
  }

  const { name, description } = result.data
  const insertedGroup = await prismaClient.todoGroup.create({
    data: {
      author: Number(id),
      name,
      description,
    },
  })

  return jsonResponse(insertedGroup)
}

// Find one or all Todo groups for user
export const GET: RequestHandler = async ({ url, locals }) => {
  const { id } = locals as RequestLocals
  const groupId = url.searchParams.get('id')

  try {
    if (!groupId) {
      // Find all
      const groups = await prismaClient.todoGroup.findMany({
        where: {
          author: Number(id),
        },
      })
      return jsonResponse(groups)
    }

    // Find one
    const group = await prismaClient.todoGroup.findFirst({
      where: { id: Number(groupId), author: Number(id) },
    })
    return jsonResponse(group)
  } catch (error) {
    return errorResponse(AppError.unknown)
  }
}

export const DELETE: RequestHandler = async ({ request }) => {
  return new Response()
}
