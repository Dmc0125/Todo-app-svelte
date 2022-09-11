import { BASE_URL } from '$env/static/private'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = ({ request }) => {
  console.log(request.headers)
  return new Response(null, {
    headers: {
      location: BASE_URL,
      'set-cookie': `id=0; HttpOnly=true; Max-Age=0; Path=/`,
    },
    status: 301,
  })
}