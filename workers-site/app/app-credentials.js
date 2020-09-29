import kvKeys from 'kiss-kv-keys'
import { cacheTimed } from 'kiss-object-cache'
import { appEnv } from './app-env'

export const appCredentials = ((base) => ({
  public: cacheTimed(appEnv.keyLife, k => k().then(i => i.public), base),
  private: cacheTimed(appEnv.keyLife, k => k().then(i => i.private), base)
}))(
  // 1 second behind to ensure the public/private are in-sync
  cacheTimed(appEnv.keyLife - 1000, () => kvKeys(appEnv.kvstore, appEnv.jwtId))
)
