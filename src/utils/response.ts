import type { z } from 'zod'

export const jsonResponse = (body: unknown, init?: ResponseInit) => (
  new Response(JSON.stringify(body), {
    ...init,
    headers: {
      ...(init?.headers || {}),
      'content-type': 'application/json',
    },
  })
)

export const zodErrorResponse = <T>(err: z.ZodError<T>) => (
  jsonResponse({
    error: err.errors.map(({ message }) => message),
    success: false,
  }, {
    status: 400,
  })
)

export const redirectResponse = (location: string, status = 301) => (
  new Response(null, {
    headers: {
      location,
    },
    status,
  })
)
