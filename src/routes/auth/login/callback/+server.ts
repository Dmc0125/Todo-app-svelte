import type { RequestHandler } from './$types'
import { BASE_URL } from '$env/static/private'
import { getAccessToken, getUserProfile } from '$lib/utils/discord'
import { prismaClient } from '$lib/utils/prisma'
import { redirectResponse } from '$lib/utils/response'
import { sign } from '$lib/utils/sign'

const errorRedirect = redirectResponse(BASE_URL)

export const GET: RequestHandler = async ({ url }) => {
  const codeParam = url.searchParams.get('code')
  if (!codeParam) {
    return errorRedirect
  }

  const accessTokenData = await getAccessToken(codeParam)
  if ('error' in accessTokenData) {
    return errorRedirect
  }

  const profileData = await getUserProfile(accessTokenData.access_token)
  const user = await (async () => {
    const existingUser = await prismaClient.user.findFirst({
      where: { discord_id: profileData.id },
    })

    if (!existingUser) {
      const insertedUser = await prismaClient.user.create({
        data: {
          discord_id: profileData.id,
          avatar: profileData.avatar,
          username: profileData.username,
        },
      })
      return insertedUser
    }

    // TODO: if user exist, check if avatar needs to be updated
    return existingUser
  })()

  const signature = await sign(user.id.toString())
  return new Response(null, {
    headers: {
      'set-cookie': `id=${user.id.toString()}.${signature}; HttpOnly=true; Max-Age=${
        60 * 60 * 24
      }; Path=/`,
      location: '/dashboard',
    },
    status: 301,
  })
}
