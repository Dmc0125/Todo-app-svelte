import { BASE_URL, DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET } from '$env/static/private'

const DISCORD_BASE_URL = 'https://discord.com/api'

const authUrlParams = new URLSearchParams({
	client_id: DISCORD_CLIENT_ID,
	redirect_uri: new URL(`${BASE_URL}/auth/login/callback`).toString(),
	response_type: 'code',
	scope: 'identify',
})
export const AUTH_URL = `${DISCORD_BASE_URL}/oauth2/authorize?${authUrlParams.toString()}`

type DiscordTokenResponseSuccess = {
	access_token: string
	expires_in: number
	refresh_token: string
	scope: 'identify'
	token_type: string
}

type DiscordTokenResponseError = {
	error: string
}

export const getAccessToken = async (code: string) =>
	(
		await fetch(`${DISCORD_BASE_URL}/oauth2/token`, {
			method: 'POST',
			body: new URLSearchParams({
				client_id: DISCORD_CLIENT_ID,
				client_secret: DISCORD_CLIENT_SECRET,
				grant_type: 'authorization_code',
				redirect_uri: `${BASE_URL}/auth/login/callback`,
				code,
			}),
			headers: {
				'content-type': 'application/x-www-form-urlencoded',
			},
		})
	).json() as Promise<DiscordTokenResponseError | DiscordTokenResponseSuccess>

type DiscordUserProfile = {
	id: string
	username: string
	avatar: string
}

export const getUserProfile = async (accessToken: string) =>
	(
		await fetch(`${DISCORD_BASE_URL}/users/@me`, {
			headers: {
				authorization: `Bearer ${accessToken}`,
			},
		})
	).json() as Promise<DiscordUserProfile>
