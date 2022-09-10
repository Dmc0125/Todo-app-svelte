import type { RequestHandler } from './$types'
import { AUTH_URL } from '$lib/utils/discord'
import { redirectResponse } from '$lib/utils/response'

export const GET: RequestHandler = () => (
  redirectResponse(AUTH_URL, 302)
)
