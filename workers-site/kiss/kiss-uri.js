import querystring from 'querystring'

export const encodeURIComponentEx = ((uriReplace, regex) => str => encodeURIComponent(str).replace(regex, c => uriReplace[c]))(
  { '!': '%21', '\'': '%27', '(': '%28', ')': '%29', '*': '%2A' },
  /[!'()*]/g
)
export const queryStringify = (options => qs => querystring.stringify(qs, '&', '=', options))(
  { encodeURIComponent: encodeURIComponentEx }
)

export function buildUrl (base, path, search) {
  const signedUrl = new URL(path, base)
  signedUrl.search = queryStringify(search)
  return signedUrl.href
}

/**
 * Encodes the URI component but ignores the forward-slash
 * @param path
 * @returns {string}
 */
export const encodeURIPath = path => encodeURIComponentEx(path).replace(/%2F/, '/')

export default {
  /**
   * Encodes a text string as a component of a Uri
   * @param {string|number|boolean} str
   * @returns {string} Uri encoded string
   */
  encodeURIComponentEx,
  /**
   * Enhanced version of querystring.stringify. Uses encodeURIComponentsEx to encode Uri components
   * @param {ParsedUrlQueryInput} str
   * @returns {string} Uri encoded string
   */
  queryStringify,
  /**
   * Builds a URL from base, path and search
   * @param {string} base
   * @param {string} path
   * @param {object} search
   * @returns {string} href
   */
  buildUrl,
  /**
   * Encodes the URI component but ignores the forward-slash
   * @param path
   * @returns {string}
   */
  encodeURIPath
}
