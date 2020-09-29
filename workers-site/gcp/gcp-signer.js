import { urlSignerV4 } from 'kiss-gcp'
import { sign, digest } from 'kiss-subtle'
import { gcpCredentials } from './gcp-credentials'
import { cacheChange } from 'kiss-object-cache'

export const gcpSigner = urlSignerV4.urlSignV4Factory(cacheChange(gcpCredentials, (creds) => creds.then(c => ({
  clientEmail: c.clientEmail,
  sign: (h) => sign(c.public, h, 'hex'),
  digest: (s) => digest('SHA-256', Buffer.from(s), 'hex')
}))))
