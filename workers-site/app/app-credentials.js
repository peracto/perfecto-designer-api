import kvKeys from 'kiss-kv-keys'
import { life } from '../utility'
import env from './app-env'

export default ((k) => ({
  ...k,
  public: life(env.keyLife, p => k().then(i => i.public)),
  private: life(env.keyLife, p => k().then(i => i.private))
}))(
  life(env.keyLife - 1000, () => kvKeys(env.kvstore, env.jwtId))
)
