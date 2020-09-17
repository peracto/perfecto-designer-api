const now = () => Math.floor(Date.now() / 1000)
const GOOGLE_TOKEN_URL = 'https://www.googleapis.com/oauth2/v4/token'
const _create = c => authTokenFactory(c.fetch, c.renew, c.sign, c.ttl, c.scope)

export default function createClient (config) {
  return _create({
    scope: 'https://www.googleapis.com/auth/cloud-platform',
    ttl: 3600, // 1 hour
    renew: 300, // 5 minutes, we will trigger a refresh {renew} seconds before token expiry
    ...config,
    fetch: config.fetch || fetch
  })
}

function authTokenFactory (fetch, renew, sign, ttl, scope) {
  let expires = 0
  let promise = null
  let loading = false

  return () => {
    if (!loading && now() > expires) {
      loading = true
      promise = getToken()
    }
    return promise
  }

  function createPayload (iss) {
    const iat = now()
    return { iss, aud: GOOGLE_TOKEN_URL, exp: iat + ttl, iat, scope }
  }

  async function getToken () {
    try {
      const response = await fetch(
        GOOGLE_TOKEN_URL,
        makeOptions(await sign(createPayload))
      )

      const token = await response.json()

      if (!response.ok) {
        throw new Error(JSON.stringify(token))
      }
      const auth = `${token.token_type} ${token.access_token}`
      expires = now() + (token.expires_in || 0) - renew
      promise = Promise.resolve(auth)
      loading = false
      return auth
    } catch (ex) {
      loading = false
      promise = Promise.reject(ex)
      expires = now() * 2
    }
  }
}

function makeOptions (assertion) {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion })
  }
}
