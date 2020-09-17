import kvKeys from 'kiss-kv-keys'
import { life } from '../utility'
import env from '../app/app-env'

export default life(env.keyLife, () => kvKeys(env.kvstore, env.gcp.certId))
