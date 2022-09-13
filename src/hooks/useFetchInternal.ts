import { writable } from 'svelte/store'

type FetchState<T> = {
  response: null | T
  loading: boolean
  error: null | string | string[]
}

type FetchInternalResponseSuccess<T> = {
  success: true
  data: T
}

type FetchInternalResponseError = {
  success: false
  error: string | string[]
}

export const useFetchInternal = <T = unknown>(url: string) => {
  const state = writable<FetchState<T>>({
    response: null,
    loading: false,
    error: null,
  })

  const setLoading = (loading: boolean) => {
    state.update((s) => {
      s.loading = loading
      return s
    })
  }

  const execute = async (config: RequestInit) => {
    try {
      setLoading(true)
      const res = await fetch(url, config)
      const data = await res.json() as FetchInternalResponseSuccess<T> | FetchInternalResponseError
  
      switch (data.success) {
        case true: {
          state.update((s) => {
            s.response = data.data
            return s
          })
          break
        }
        case false: {
          state.update((s) => {
            s.error = data.error
            return s
          })
        }
      }
    } catch (error) {
      state.update((s) => {
        s.error = 'Unknown error.'
        return s
      })
    }
    setLoading(false)
  }

  return {
    state,
    execute,
  }
}