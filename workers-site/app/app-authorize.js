import { verifyJwt } from '../kiss/kiss-subtle-jwt'
import ppk from './app-credentials'
import respond from './app-response-builder'

export default function authorize (cb) {
  return async request => {
    const auth = getAuthToken(request)
    const token = auth && await verifyJwt(await ppk.public(), auth)
    return token
      ? cb(request, token)
      : respond('not authorized', 401)
  }
}

function getAuthToken (request) {
  const auth = request.headers.get('Authorization')
  if (!auth) return false
  const parts = auth.split(' ')
  return parts.length >= 2 && parts[1]
}
