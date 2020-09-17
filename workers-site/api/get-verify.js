import { kms } from '../gcp'
import ppk from '../app/app-credentials'
import jwt from '../kiss/kiss-subtle-jwt'
import respond from '../app/app-response-builder'

export default async request => {
  const requestUrl = new URL(request.url)
  const gcpToken = jwt.parse(requestUrl.searchParams.get('token'))
  const key = await kms.getPublicKey(gcpToken.meta.kv)
  const valid = await jwt.verifyJwt(key, gcpToken)

  if (!valid) {
    return respond('Invalid token', 401)
  }

  // Re-sign using our private key
  const token = await jwt.signJwt(
    await ppk.private(),
    gcpToken.rawPayload
  )

  return respond({ valid: !!valid, token })
}
