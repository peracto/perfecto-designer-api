import kmsFactory from '../kiss/kiss-gcp-kms'
import fetchGcp from './gcp-fetch'
import cacher from '../kiss/kiss-object-cache'
import { importKey } from '../kiss/kiss-subtle-key'
import config from '../app/app-config'

export default (() => {
  const kms = kmsFactory(
    fetchGcp,
    config.keys.verify,
    key => importKey('spki', key.pem, key.algorithm, false, ['verify'])
  )

  return {
    ...kms,
    getPublicKey: cacher(kms.getPublicKey)
  }
})()
