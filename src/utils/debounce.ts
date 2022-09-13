export const debounce = <T extends unknown[]>(cb: (...args: T) => void, time = 500) => {
  let timeoutId: NodeJS.Timeout | null = null

  return (...args: T) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => cb(...args), time)
  }
}
