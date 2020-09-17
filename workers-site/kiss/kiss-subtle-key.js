const splitString = s => s.replace(/^([A-Z]+)([0-9]+)$/, '$1-$2')
const _toBuffer = str => Buffer.from(str.includes('----') ? _convertPem(str) : str, 'base64')
const _convertPem = pem => pem.split('\n').map(s => s.trim()).filter(l => l.length && !l.startsWith('---')).join('')

/**
 * Imports a Key
 * @param {string} format
 * @param {string} PEM or Base64 encoded string containing the key
 * @param algorithm The algorithm
 * @param {boolean} extractable
 * @param {array<string>} keyUsage
 * @returns {PromiseLike<CryptoKey>}
 */
export const importKey = (format, keyData, algorithm, extractable, keyUsage) =>
  crypto.subtle
    .importKey(format, _toBuffer(keyData), mapAlgorithm(algorithm), extractable, keyUsage)
    .then(key => ({ key, algorithm: mapAlgorithm(algorithm), pem: keyData }))

export default {
  importKey
}

function mapAlgorithm (algorithm) {
  if (typeof algorithm !== 'string') return algorithm
  const parts = algorithm.split('_')
  return parts.length === 4 && parts[0] === 'EC'
    ? { name: 'ECDSA', namedCurve: splitString(parts[2]), hash: splitString(parts[3]) }
    : parts.length === 5 && parts[0] === 'RSA'
      ? { name: 'RSASSA-PKCS1-v1_5', hash: splitString(parts[4]) }

      : algorithm
}
