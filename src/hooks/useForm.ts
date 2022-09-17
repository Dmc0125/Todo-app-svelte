import { get, writable } from 'svelte/store'
import type { ZodError } from 'zod'

import { debounce } from '$lib/utils/debounce'

type ErrorParserFunction = (value: string) => ZodError<string> | null
type FormStateConfig = Record<string, { value: string; errorParser?: ErrorParserFunction }>
type InputState = {
  value: string
  error: string | null
}

export const useForm = <State extends FormStateConfig>(defaultState: State) => {
  const errorParsers = new Map<keyof State, ErrorParserFunction>()
  const stateObj = {} as Record<keyof State, InputState>

  Object.entries(defaultState).forEach(([prop, { value, errorParser }]) => {
    stateObj[prop as keyof State] = {
      error: null,
      value,
    }

    if (errorParser) {
      errorParsers.set(prop, errorParser)
    }
  })

  const state = writable(stateObj)

  const parseError = (prop: keyof State) => {
    const parse = errorParsers.get(prop)

    if (parse) {
      const _state = get(state)
      const error = parse(_state[prop].value)
      state.update((s) => {
        if (error) {
          s[prop].error = error.errors[0].message.replace(
            /string/i,
            `${prop.toString()[0].toUpperCase()}${prop.toString().slice(1)}`,
          )
        } else {
          s[prop].error = null
        }
        return s
      })
    }
  }
  const parseErrorDebounced = debounce(parseError)

  return {
    state,
    parseError,
    parseErrorDebounced,
  }
}
