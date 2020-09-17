module.exports = function authFetchFactory (options) {
  const myFetch = (options && options.fetch) || fetch
  const myAuth = (options && options.auth)

  return async function authenticatedFetch (resource, init) {
    return await myFetch(resource, {
      ...init,
      headers: {
        ...init.headers,
        Authorization: await myAuth()
      }
    })
  }
}
