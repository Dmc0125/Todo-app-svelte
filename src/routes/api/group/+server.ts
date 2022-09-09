import type { RequestHandler } from './$types'
import { z } from 'zod'

const groupSchema = z.object({
  all_done: z.boolean().default(false),
  author: z.number(),
})

export const POST: RequestHandler = ({ request }) => {
  const validationResult = groupSchema.safeParse(request.body)

  return new Response()
}
