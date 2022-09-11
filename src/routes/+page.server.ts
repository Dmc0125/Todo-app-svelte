import { redirect } from '@sveltejs/kit'

import type { PageServerLoad } from './$types'
import { verify } from '$lib/utils/sign'
import { BASE_URL } from '$env/static/private'

export const load: PageServerLoad = async ({ request }) => {
  const cookies = request.headers.get('Cookie')
  const idCookie = cookies?.split(';').find((cookie) => cookie.startsWith('id='))
  if (!idCookie) {
    return
  }

  const val = idCookie.split('=')[1]
  if (!val) {
    return
  }
  
  const [id, sig] = val.split('.')
  const isSigned = await verify(sig, id)

  if (isSigned) {
    throw redirect(301, `${BASE_URL}/dashboard`)
  }
}