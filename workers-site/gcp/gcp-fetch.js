import { fetchAuthFactory } from 'kiss-fetch-auth'
import { signJwt } from 'kiss-subtle'
import { auth } from 'kiss-gcp'
import { gcpCredentials } from './gcp-credentials'
import { fetchRetry } from '../app/app-fetch-retry'

export const gcpFetch = fetchAuthFactory({
  fetch: fetchRetry,
  auth: auth.gcpAuthFactory({
    sign: d => gcpCredentials().then(auth => signJwt(auth.public, d(auth.clientEmail))),
    fetch: fetchRetry
  })
})
