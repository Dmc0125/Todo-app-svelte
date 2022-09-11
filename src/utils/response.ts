import { z } from 'zod'

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

  return new Response(
    JSON.stringify({
      success,
      ...body,
    }),
    {
      ...init,
      headers: {
        ...(init?.headers || {}),
        'content-type': 'application/json',
      },
    },
  )
}

export const redirectResponse = (location: string, status = 301) =>
  new Response(null, {
    headers: {
      location,
    },
    status,
  })

export enum AppError {
  unknown = 'ServerError',
  validation = 'ValidationError',
  notFound = 'NotFoundError',
}

export const errorResponse = (error: AppError, message?: string | string[] | z.ZodError) => {
  switch (error) {
    case AppError.unknown: {
      return jsonResponse(error, {
        init: {
          status: 500,
        },
        success: false,
      })
    }
    case AppError.validation: {
      const errMessage =
        message instanceof z.ZodError ? message.errors.map(({ message }) => message) : message
      return jsonResponse(errMessage, {
        init: {
          status: 400,
        },
        success: false,
      })
    }
    case AppError.notFound: {
      return jsonResponse(message || error, {
        init: {
          status: 404,
        },
        success: false,
      })
    }
  }
}
