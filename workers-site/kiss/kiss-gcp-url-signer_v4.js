const { encodeURIComponentEx, encodeURIPath } = require('./kiss-uri')

export default (sign) => ({
  getSignedUrl: (bucket, file, config) => sign(new SignV4State(config, bucket, file))
})

class SignV4State {
  constructor (config, bucket, file) {
    const host = `${bucket}.storage.googleapis.com`
    const headers = {
      ...config.extensionHeaders,
      host,
      'content-md5': config.contentMd5,
      'content-type': config.contentType
    }
    const sortedHeaders = getSortedHeaders(headers)
    this.signedHeaders = sortedHeaders.map(kvp => kvp[0]).join(';')
    this.extensionHeadersString = sortedHeaders.map(([headerName, value]) => `${headerName}:${value}\n`).join('')
    this.host = host
    this.timestamp = timestamp(new Date())
    this.credentialScope = `${this.timestamp.substr(0, 8)}/auto/storage/goog4_request`
    this.expiration = config.expiration || 604800
    this.resourcePath = encodeURIPath(`/${file}`)
    this.algorithm = 'GOOG4-RSA-SHA256'
    this.method = config.method || 'PUT'
    this.queryParams = config.queryParams
    this.contentSha256 = headers['x-goog-content-sha256']
  }

  getQueryString (clientEmail) {
    return merge(
      [
        ['X-Goog-Algorithm', this.algorithm],
        ['X-Goog-Credential', encodeURIComponentEx(`${clientEmail}/${this.credentialScope}`)],
        ['X-Goog-Date', this.timestamp],
        ['X-Goog-Expires', this.expiration],
        ['X-Goog-SignedHeaders', encodeURIComponentEx(this.signedHeaders)]
      ],
      this.queryParams
    ).map(([key, value]) => `${key}=${value}`).join('&')
  }

  getDigestPayload (canonicalQueryParams) {
    return `${this.method}\n${this.resourcePath}\n${canonicalQueryParams}\n${this.extensionHeadersString}\n${this.signedHeaders}\n${this.contentSha256 || 'UNSIGNED-PAYLOAD'}`
  }

  getSignPayload (hash) {
    return `${this.algorithm}\n${this.timestamp}\n${this.credentialScope}\n${hash}`
  }

  getResult (queryString, signature) {
    return `https://${this.host}${this.resourcePath}?${queryString}&x-goog-signature=${encodeURIComponent(signature)}`
  }
}

const getSortedHeaders = headers => Object
  .entries(headers)
  .map(kvp => kvp[1] === undefined ? undefined : [kvp[0].toLowerCase(), `${kvp[1]}`.trim().replace(/\s{2,}/g, ' ')])
  .filter(v => v)
  .sort((a, b) => a[0].localeCompare(b[0]))

const merge = (q1, q2) => !q2
  ? q1
  : [
    ...q1,
    ...Object.entries(q2).map(([key, value]) => [encodeURIComponentEx(key), encodeURIComponentEx(value)])
  ].sort((a, b) => (a[0] < b[0] ? -1 : 1))

const timestamp = d => d.toISOString().replace(/[-:]/g, '').replace(/\.[0-9]*/, '')
