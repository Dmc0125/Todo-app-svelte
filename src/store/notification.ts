import { writable } from 'svelte/store'

export const serverErrorMessage = 'Server Error. Please try again later.'

type NotificationData = {
  content: string
  status: 'error' | 'success'
}

export const notifications = writable<Map<number, NotificationData>>(new Map())

type Config = {
  content: string,
  status: 'error' | 'success',
  onHide?: () => void | Promise<void>
}

let id = 0
export const showNotification = ({
  content,
  status,
  onHide,
}: Config) => {
  const _id = id
  notifications.update((n) => {
    if (n.size === 6) {
      const [firstId] = [...n][0]
      n.delete(firstId)
    }

    n.set(_id, {
      content,
      status,
    })
    return n
  })

  setTimeout(() => {
    notifications.update((n) => {
      n.delete(_id)
      return n
    })

    if (onHide) {
      onHide()
    }
  }, 5000)

  id += 1
}
