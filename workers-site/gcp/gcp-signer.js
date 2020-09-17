import signerFactory from '../kiss/kiss-gcp-url-signer_v4'
import { sign, digest } from '../kiss/kiss-subtle-sign'
import credentials from './gcp-credentials'

export default signerFactory(async state => {
  const a = await credentials()
  const q = state.getQueryString(a.clientEmail)
  const d = state.getDigestPayload(q)
  const s = state.getSignPayload(await digest('SHA-256', Buffer.from(d), 'hex'))
  return state.getResult(q, await sign(a.public, s, 'hex'))
})
