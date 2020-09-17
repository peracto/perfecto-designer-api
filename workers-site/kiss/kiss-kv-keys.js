export default (kvstore, key) => kvstore.get(key, 'json').then(mapKeys)

const mapKeys = async t => Object.assign(
  await buildKeys(t.keys, t.algorithm, t.encoding || 'base64', createKey),
  typeof t.meta === 'object' ? t.meta : undefined
)

const buildKeys = async (arr, algorithm, encoding, cb) => {
  const entries = []

  for (const key of arr) {
    entries.push([
      key.name,
      Object.assign(
        {
          key: await cb(algorithm, key, encoding),
          algorithm: algorithm
        },
        typeof key.meta === 'object' ? key.meta : undefined
      )
    ])
  }
  return Object.fromEntries(entries)
}

const createKey = (algorithm, key, encoding) => crypto.subtle.importKey(
  key.format,
  Buffer.from(key.key, encoding),
  algorithm,
  false,
  key.usage.split(',').map(s => s.trim())
)
