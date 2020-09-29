import kvKeys from 'kiss-kv-keys'
import { cacheTimed } from 'kiss-object-cache'
import { appEnv } from '../app/app-env'

export const gcpCredentials = cacheTimed(appEnv.keyLife, () => kvKeys(appEnv.kvstore, appEnv.gcp.certId))
