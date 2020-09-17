function lazy (cb) {
  let cache
  return () => cache || (cache = cb())
}
function life (ttl, cb) {
  let expire = 0
  let cache
  return () => {
    if (Date.now() >= expire) {
      cache = cb()
      expire = Date.now() + ttl
    }
    return cache
  }
}

export {
  lazy,
  life
}
