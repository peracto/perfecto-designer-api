import { appEnv } from './app-env'
export const appConfig = Object.freeze({
  ...appEnv,
  keys: {
    verify: `/projects/${appEnv.gcp.projectId}/locations/global/keyRings/${appEnv.gcp.keyring}/cryptoKeys/${appEnv.gcp.key1}/`
  }
})
export const gcpConfig = appConfig.gcp
