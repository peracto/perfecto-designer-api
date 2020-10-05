import { gcpKms } from '../gcp/gcp-kms'
import { appCredentials } from '../app/app-credentials'
import { verifyJwt, signJwt, parseJwtToken } from 'kiss-subtle'
import { responseBuilder } from '../app/app-response-builder'

export const getVerify = async request => {
  const requestUrl = new URL(request.url)
  const gcpToken = parseJwtToken(requestUrl.searchParams.get('token'))
  const key = await gcpKms.getPublicKey(gcpToken.meta.kv)
  const valid = await verifyJwt(key, gcpToken)

  if (!valid) {
    return responseBuilder('Invalid token', 401)
  }

  // Re-sign using our private key
  const token = await signJwt(
    await appCredentials.private(),
    gcpToken.rawPayload
  )

  return responseBuilder({ valid: !!valid, token })
}
