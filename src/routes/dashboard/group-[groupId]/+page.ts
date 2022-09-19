import { get } from 'svelte/store'
import { page } from '$app/stores'
import { browser } from '$app/environment'
import type { Todo, TodoGroup } from '@prisma/client'

import type { PageLoad } from './$types'
import type { FetchResponse } from '$lib/hooks/useFetchInternal'
import { PUBLIC_BASE_URL } from '$env/static/public'

export const load: PageLoad = async ({ fetch, data }) => {
  const _data = data as unknown as Record<'todos', Todo[]>
  if (!browser) {
    return _data
  }

  const pageStore = get(page)
  if (pageStore?.data?.groups?.length) {
    return _data
  }

  const groupsRes = (await (
    await fetch(`${PUBLIC_BASE_URL}/api/group`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    })
  ).json()) as FetchResponse<TodoGroup[]>

  if (!groupsRes.success) {
    return {
      ..._data,
      error: true,
    }
  }

  return {
    ..._data,
    groups: groupsRes.data,
  }
}
