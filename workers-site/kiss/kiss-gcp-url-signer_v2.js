/*
    signerV2: signerFactory(async payload => {
      const auth = await credentials()
      return {
        signature: await sign.sign(auth.public, payload),
        clientEmail: auth.clientEmail
      }
    }),
 */

const { encodeURIPath, buildUrl } = require('./kiss-uri')

export default function storageFactory (sign) {
  return {
    getSignedUrl: (bucket, file, config) => getSignedUrl(sign, config, bucket, encodeURIPath(file))
  }
}

async function getSignedUrl (sign, config, bucket, encodedFile) {
  const auth = await sign(createPayload(
    config.method,
    config.contentMd5,
    config.contentType,
    config.expires,
    `${getCanonicalHeaders(config.extensionHeaders)}/${bucket}/${encodedFile}`
  ))

  return buildUrl(
    `https://${bucket}.storage.googleapis.com`,
    encodedFile,
    {
      GoogleAccessId: auth.clientEmail,
      Expires: config.expires,
      Signature: auth.signature,
      ...config.queryParams
    }
  )
}

function getCanonicalHeaders (headers) {
  return !headers
    ? ''
    : Object.entries(headers)
      .map(([key, value]) => [key.toLowerCase(), value])
      .sort((a, b) => a[0].localeCompare(b[0]))
      .reduce((a, v) => v[1] === undefined ? a : `${a}${v[0]}:${`${v[1]}`.trim().replace(/\s{2,}/g, ' ')}\n`, '')
}

function createPayload (method, md5, type, expiration, headers) {
  return `${method}\n${md5 || ''}\n${type || ''}\n${expiration}\n${headers}`
}
