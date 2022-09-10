import type { Cookies, Handle } from '@sveltejs/kit'

import { BASE_URL } from '$env/static/private'
import { verify } from './utils/sign'
import { redirectResponse } from './utils/response'

const errorRedirect = redirectResponse(`${BASE_URL}?message=Unauthorized`)

const authorize = async (
  cookies: Cookies,
  onSuccess: (userId: string) => Promise<Response> | Response,
) => {
  const idCookie = cookies.get('id')

  if (!idCookie || !idCookie.length) {
    return errorRedirect
  }

  const [id, sig] = idCookie.split('.')
  if (!id || !sig) {
    return errorRedirect
  }

  const isSigned = await verify(sig, id)

  if (!isSigned) {
    return errorRedirect
  }

  return onSuccess(id)
}

export type RequestLocals = {
  id: string
}

export const handle: Handle = async ({ event, resolve }) => {
  if (
    event.url.pathname.startsWith('/api')
    || event.url.pathname.startsWith('/dashboard')
  ) {
    return authorize(event.cookies, (userId) => {
      event.locals = {
        id: userId,
      }
      return resolve(event)
    })
  }

  return resolve(event)
}