import { verifyJwt } from 'kiss-subtle'
import { appCredentials } from './app-credentials'
import { responseBuilder } from './app-response-builder'

export function authorize (cb) {
  return async request => {
    const auth = getAuthToken(request)
    const token = auth && await verifyJwt(await appCredentials.public(), auth)
    return token
      ? cb(request, token)
      : responseBuilder('not authorized', 401)
  }
}

function getAuthToken (request) {
  const auth = request.headers.get('Authorization')
  if (!auth) return false
  const parts = auth.split(' ')
  return parts.length >= 2 && parts[1]
}
