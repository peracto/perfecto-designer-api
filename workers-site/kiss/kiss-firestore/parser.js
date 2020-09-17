const decode = v => {
  return (v && v.fields && Object.fromEntries(Object.entries(v.fields).map(kvp => [kvp[0], resolveType(kvp[1])]))) || {}
}

class LatLong {
  constructor (lat, long) {
    this.latitude = lat
    this.longitude = long
  }
}

function resolveType (value) {
  for (const type in value) {
    return (decodeMap[type] || noop)(value[type])
  }
}

const noop = v => v
const decodeMap = {
  arrayValue: v => v.values.map(resolveType),
  doubleValue: parseFloat,
  integerValue: parseInt,
  timestampValue: v => new Date(v),
  mapValue: decode,
  geoPointValue: v => new LatLong(v.latitude, v.longitude)
}

const nullValue = { nullValue: null }
const resolve = v => v === null ? nullValue : (encodeMap[typeof v] || encodeDefault)(v)
const encode = o => ({ fields: Object.fromEntries(Object.entries(o).map(v => [v[0], resolve(v[1])])) })
const encodeDefault = v => ({ stringValue: v.toString() })
const encodeMap = {
  undefined: () => nullValue,
  number: v => Number.isInteger(v) ? { integerValue: v.toString() } : { doubleValue: v.toString() },
  string: v => ({ stringValue: v }),
  boolean: v => ({ booleanValue: v }),
  object: v => Array.isArray(v) ? { arrayValue: { values: v.map(resolve) } }
    : v instanceof Date ? { timestampValue: v.toISOString() }
      : { mapValue: encode(v) }
}

module.exports = {
  decode,
  encode
}
