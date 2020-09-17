import fetch from './app-fetch-retry'
import appEnv from './app-env'

const config = Object.freeze({
  ...appEnv,
  keys: {
    verify: `/projects/${appEnv.gcp.projectId}/locations/global/keyRings/${appEnv.gcp.keyring}/cryptoKeys/${appEnv.gcp.key1}/`
  },
  fetch: fetch || require('node-fetch')
})

export default config
export const gcp = config.gcp
