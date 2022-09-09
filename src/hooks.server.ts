import type { Cookies, Handle } from '@sveltejs/kit'

import { BASE_URL } from '$env/static/private'
import { verify } from './utils/sign'

const errorRedirect = new Response(null, {
  headers: {
    location: BASE_URL,
  },
  status: 301,
})

const authorize = async (
  cookies: Cookies,
  onSuccess: () => Promise<Response> | Response,
) => {
  const idCookie = cookies.get('id')

  if (!idCookie || !idCookie.length) {
    return errorRedirect
  }

  const [id, sig] = idCookie.split('.')
  const isSigned = await verify(sig, id)

  if (!isSigned) {
    return errorRedirect
  }

  return onSuccess()
}

export const handle: Handle = async ({ event, resolve }) => {
  if (
    event.url.pathname.startsWith('/api')
    || event.url.pathname.startsWith('/dashboard')
  ) {
    return authorize(event.cookies, () => resolve(event))
  }

  return resolve(event)
}