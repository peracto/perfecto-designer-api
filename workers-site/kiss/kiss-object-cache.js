export default function cachedProducer (producer, state, keyFn) {
  const cache = new Map()
  keyFn = typeof keyFn === 'function' ? keyFn : undefined

  return function getCachedProducer (key) {
    const k = keyFn ? keyFn(key) : key
    return cache.get(k) || create(k)
  }

  function create (key) {
    const r = producer(key, state)
    cache.set(key, r)
    return r
  }
}
