const header = { alg: 'RS256' }

const toBuffer = data => Buffer.isBuffer(data) ? data : Buffer.from(JSON.stringify(data))
/**
 * @param {object|Buffer} data
 * @return {string} base64 encoded
 */
const encode64 = data =>
  toBuffer(data)
    .toString('base64')
    .replace(/[+/=]/g, c => c === '+' ? '-' : c === '/' ? '_' : '')
/**
 * Decodes string that was previously encoded using encode64
 * @param {string} base64 encoded
 * @return {Buffer} Buffer
 */
const decode64 = data =>
  Buffer.from(
    data.replace(/-/g, '+').replace(/_/g, '/') + ('='.repeat(4 - data.length % 4)),
    'base64'
  )

const _default = {
  /**
   * Signs a JWT payload
   * @param {CryptoKey} key
   * @param {Buffer|string|object} data
   * @returns {PromiseLike<string>} Encoded JWT Object
   */
  signJwt: (key, data, meta) =>
    _signJwt(key, encode64(meta || header) + '.' + encode64(data)),
  /**
   * Verifys a JWT payload
   * @param {CryptoKey} key
   * @param {string} token Jwt encoded token
   * @returns {PromiseLike<boolean>} true is passed otherwise fail
   */
  verifyJwt: (key, token) => _verifyJwt(key, typeof token === 'string' ? parseToken(token) : token),

  parse: parseToken
}

export default _default
export const signJwt = _default.signJwt
export const verifyJwt = _default.verifyJwt
export const parse = _default.parse

function parseToken (token) {
  const parts = token.split('.')
  const decoded = parts.map(decode64)
  return {
    meta: JSON.parse(decoded[0].toString()),
    payload: JSON.parse(decoded[1].toString()),
    rawPayload: decoded[1],
    signature: decoded[2],
    input: Buffer.from(parts[0] + '.' + parts[1])
  }
}

function _verifyJwt (key, parts) {
  return crypto.subtle
    .verify(key.algorithm, key.key, parts.signature, parts.input)
    .then(e => e ? {
      meta: parts.meta,
      data: parts.payload
    } : null)
}

function _signJwt (key, data) {
  return crypto.subtle
    .sign(key.algorithm, key.key, Buffer.from(data))
    .then(v => data + '.' + encode64(Buffer.from(v)))
}
