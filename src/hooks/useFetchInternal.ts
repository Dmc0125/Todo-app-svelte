import { writable } from 'svelte/store'

type FetchState<T> = {
  response: null | T
  loading: boolean
  error: null | string
  executed: boolean
}

type FetchInternalResponseSuccess<T> = {
  success: true
  data: T
}

type FetchInternalResponseError = {
  success: false
  error: string | string[]
}

export type FetchResponse<T> = FetchInternalResponseError | FetchInternalResponseSuccess<T>

export const useFetchInternal = <T = unknown>(url: string) => {
  const state = writable<FetchState<T>>({
    response: null,
    loading: false,
    error: null,
    executed: false,
  })

  const setState = <Y extends keyof FetchState<T>>(prop: Y, value: FetchState<T>[Y]) => {
    state.update((s) => {
      s[prop] = value
      return s
    })
  }

  const execute = async (config: RequestInit) => {
    try {
      setState('loading', true)
      const res = await fetch(url, config)
      const data = (await res.json()) as FetchResponse<T>

      switch (data.success) {
        case true: {
          setState('response', data.data)
          break
        }
        case false: {
          setState('error', typeof data.error === 'string' ? data.error : data.error.join('. '))
        }
      }
    } catch (error) {
      setState('error', 'Unknown error.')
    }
    state.update((s) => {
      s.loading = false
      s.executed = true
      return s
    })
  }

  return {
    state,
    execute,
  }
}
