import { SECRET_KEY } from '$env/static/private'

// This code was inspired by https://deno.land/x/squishy_cookies@v0.2.4
const { sign, verify } = (() => {
  let key: null | CryptoKey = null

  const createKey = async () =>
    crypto.subtle.importKey(
      'raw',
      Buffer.from(SECRET_KEY, 'utf-8'),
      { name: 'HMAC', hash: 'SHA-256' },
      true,
      ['sign', 'verify'],
    )

  return {
    sign: async (data: string) => {
      if (!key) {
        key = await createKey()
      }

      const signed = await crypto.subtle.sign('HMAC', key, Buffer.from(data, 'utf-8'))
      return Buffer.from(signed).toString('hex')
    },
    verify: async (base64sig: string, data: string) => {
      if (!key) {
        key = await createKey()
      }

      return crypto.subtle.verify(
        'HMAC',
        key,
        Buffer.from(base64sig, 'hex'),
        Buffer.from(data, 'utf-8'),
      )
    },
  }
})()

export { sign, verify }
