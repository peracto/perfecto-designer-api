const _toBuffer = data =>
  typeof data !== 'object'
    ? Buffer.from(data)
    : Buffer.isBuffer(data)
      ? data
      : Buffer.from(JSON.stringify(data))

export const sign = (key, data, encode) =>
  crypto.subtle
    .sign(key.algorithm, key.key, _toBuffer(data))
    .then(v => Buffer.from(v).toString(encode || 'base64'))

export const digest = (algorithm, data, encode) =>
  crypto.subtle
    .digest(algorithm, data)
    .then(v => Buffer.from(v).toString(encode || 'base64'))

export default {
  sign,
  digest
}
