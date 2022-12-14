import { PUBLIC_BASE_URL } from '$env/static/public'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = () =>
  new Response(null, {
    headers: {
      location: PUBLIC_BASE_URL,
      'set-cookie': `id=0; Expires=${new Date().toString()}; Path=/`,
      'Cache-control': 'no-store',
    },
    status: 301,
  })
