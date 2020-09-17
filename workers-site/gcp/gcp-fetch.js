import { fetchAuthFactory } from 'kiss-fetch-auth'
import jwt from '../kiss/kiss-subtle-jwt'
import fetchFactory from '../kiss/kiss-gcp-fetch'
import credentials from './gcp-credentials'
import config from '../app/app-config'

export default fetchAuthFactory({
  fetch,
  auth: fetchFactory({
    sign: d => credentials().then(auth => jwt.signJwt(auth.public, d(auth.clientEmail))),
    fetch: config.fetch
  })
})
