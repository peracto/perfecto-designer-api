import { gcpKms } from '../gcp/gcp-kms'
import { appCredentials } from '../app/app-credentials'
import { verifyJwt, signJwt, parseJwtToken } from 'kiss-subtle'
import { responseBuilder } from '../app/app-response-builder'

export const getVerify = async request => {
  console.log('getVerify')
  const requestUrl = new URL(request.url)
  console.log('API::VERIFY', requestUrl.href)
  const gcpToken = parseJwtToken(requestUrl.searchParams.get('token'))
  console.log('API::PARSED', gcpToken)
  const key = await gcpKms.getPublicKey(gcpToken.meta.kv)
  console.log('API::PUBLIC KEY', key)
  const valid = await verifyJwt(key, gcpToken)
  console.log('API::VERIFIED', valid)

  if (!valid) {
    return responseBuilder('Invalid token', 401)
  }
  console.log('API::SIGN 1')

  // Re-sign using our private key
  const token = await signJwt(
    await appCredentials.private(),
    gcpToken.rawPayload
  )
  console.log('API::SIGN 2')

  return responseBuilder({ valid: !!valid, token })
}
