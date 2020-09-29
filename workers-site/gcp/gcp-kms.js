import { kms } from 'kiss-gcp'
import { gcpFetch } from './gcp-fetch'
import { cacheKey } from 'kiss-object-cache'
import { importKey } from 'kiss-subtle'
import { appConfig } from '../app/app-config'

const cacheIt = o => ({ ...o, getPublicKey: cacheKey(o.getPublicKey) })

export const gcpKms = cacheIt(kms.kmsFactory({
  fetch: gcpFetch,
  projectName: appConfig.keys.verify,
  decoder: key => importKey('spki', key.pem, key.algorithm, false, ['verify'])
}))
