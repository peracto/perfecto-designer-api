const _waitPeriods = [1000, 3000, 5000, 9000]
const _maxRetries = 3

const waiter = s => new Promise(resolve => setTimeout(resolve, s))
const getWait = (waitPeriods, retry) => waitPeriods[retry >= waitPeriods.length ? waitPeriods.length - 1 : retry]
const _getWaitTimeout = value => value

module.exports = function retryFetchFactory (options) {
  const maxRetries = (options && options.maxRetries) || _maxRetries
  const waitPeriods = (options && options.waitPeriods) || _waitPeriods
  const shouldRetry = (options && options.shouldRetry) || _shouldRetryRequest
  const myFetch = (options && options.fetch) || fetch
  const getWaitTimeout = (options && options.getWaitTimeout) || _getWaitTimeout

  return async function retryFetch (resource, init) {
    for (let retry = 0; ; retry++) {
      const response = await myFetch(resource, init)
      if (response.ok || retry >= maxRetries || !shouldRetry(response, retry)) { return response }
      await waiter(
        getWaitTimeout(getWait(waitPeriods, retry),
          resource,
          response,
          retry
        ))
    }
  }
}

function _shouldRetryRequest (response) {
  const status = response.status
  return (
    (status >= 100 && status <= 199) ||
    (status >= 429 && status <= 429) ||
    (status >= 500 && status <= 599)
  )
}
