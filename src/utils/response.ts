import type { z } from 'zod'

type JsonResponseConfig = {
  success?: boolean
  init?: ResponseInit
}

export const jsonResponse = (data: unknown, config?: JsonResponseConfig) => {
  const { success, init } = config || {
    success: true,
    init: {},
  }

  const body = success ? { data } : { error: data }

  return new Response(JSON.stringify({
    success,
    ...body,    
  }), {
    ...init,
    headers: {
      ...(init?.headers || {}),
      'content-type': 'application/json',
    },
  })
}

// TODO: Create error response handler
export const zodErrorResponse = <T>(err: z.ZodError<T>) => (
  jsonResponse({
    error: err.errors.map(({ message }) => message),
    success: false,
  }, {
    init: {
      status: 400,
    },
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
