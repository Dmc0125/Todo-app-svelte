import { PUBLIC_BASE_URL } from '$env/static/public'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ params, fetch }) => {
  const res = await fetch(`${PUBLIC_BASE_URL}/api/todo?groupId=${params.groupId}`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
  })
  console.log(await res.json())
}
