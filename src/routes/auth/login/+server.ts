import type { RequestHandler } from './$types'
import { AUTH_URL } from '$lib/utils/discord'

export const GET: RequestHandler = () => (
  new Response(null, {
    headers: {
      location: AUTH_URL,
    },
    status: 302,
  })
)
