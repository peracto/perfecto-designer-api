'use strict'
const makeEscape = (encode) => {
  const table = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0
  ]
  for (let i = 0; i < encode.length; i++) {
    const x = encode.charCodeAt(i)
    if (x > 0x7f) continue
    table[x] = 0
  }
  return table
}

const hex = new Array(256).fill('').map((u, i) => '%' + (i + 256).toString(16).substr(1).toUpperCase())
// const enhancedNoEscape = makeEscape(' "#$%&+,/:;<=>?@[\\]^`{|}!\'()*')
const surrogatePair = (c) => hex[0xF0 | (c >> 18)] + hex[0x80 | ((c >> 12) & 0x3F)] + hex[0x80 | ((c >> 6) & 0x3F)] + hex[0x80 | (c & 0x3F)]

function makeUriEncoder (encode) {
  const e = createEncoder(makeEscape(encode))
  // @ts-ignore
  e.encodeSet = encode
  return e
}

function createEncoder (escape) {
  return (str) => {
    const len = str.length
    if (len === 0) return str

    let out = ''
    let p = 0

    for (let i = 0; i < len; i++) {
      const c = str.charCodeAt(i)
      if (c < 0x80 && escape[c] === 1) continue

      if (p < i) out += str.slice(p, i)

      if (c < 0x80) {
        // ASCII
        out += hex[c]
      } else if (c < 0x800) {
        // Multi-byte characters ...
        out += hex[0xC0 | (c >> 6)] + hex[0x80 | (c & 0x3F)]
      } else if (c < 0xD800 || c >= 0xE000) {
        out += hex[0xE0 | (c >> 12)] + hex[0x80 | ((c >> 6) & 0x3F)] + hex[0x80 | (c & 0x3F)]
      } else if (++i < len) {
        // Surrogate pair
        out += surrogatePair(0x10000 + (((c & 0x3FF) << 10) | (str.charCodeAt(i) & 0x3FF)))
      } else throw new Error('ERR_INVALID_URI')

      p = i + 1
    }
    return p === 0 ? str : p < len ? out + str.slice(p) : out
  }
}
const encoder1 = makeUriEncoder(' "#$%&+,/:;<=>?@[\\]^`{|}!\'()*')

for (let q = 0; q < 65535; q++) {
  const c = String.fromCharCode(q)
  let e1, e2
  try { e1 = encodeURIComponent(c) } catch (ex) { e1 = '??' }
  try { e2 = encoder1(c) } catch (ex) { e2 = '??' }
  if (e1 === e2) continue
  console.log(`${e1} <> ${e2}`)
}
