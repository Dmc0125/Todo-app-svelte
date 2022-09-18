import type { Cookies, Handle } from '@sveltejs/kit'

import { PUBLIC_BASE_URL } from '$env/static/public'
import { verify } from './utils/sign'
import { AppError, errorResponse, redirectResponse } from './utils/response'

const errorHandlers = new Map([
  ['api', errorResponse(AppError.unauthorized)],
  ['dashboard', redirectResponse(`${PUBLIC_BASE_URL}?message=Unauthorized`)],
])

const parseAndVerifyCookie = async (cookies: Cookies) => {
  const idCookie = cookies.get('id')
  if (!idCookie || !idCookie.length) {
    return null
  }
  const [id, sig] = idCookie.split('.')
  if (!id || !sig) {
    return null
  }
  const isSigned = await verify(sig, id)
  if (!isSigned) {
    return null
  }
  return [id, sig] as [string, string]
}

export type RequestLocals = {
  id: string
}

export const handle: Handle = async ({ event, resolve }) => {
  const cookie = await parseAndVerifyCookie(event.cookies)

  if (!cookie) {
    const path = event.url.pathname.split('/')[1]
    const response = errorHandlers.get(path)
    return response || resolve(event)
  }

  event.locals = {
    id: cookie[0],
  }
  return resolve(event)
}
