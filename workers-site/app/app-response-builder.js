export default (response, status, headers) => {
  if (response === null || response === undefined) {
    return new Response(null, { status: status || 200, headers })
  }
  const isString = typeof response === 'string'
  const content = isString ? response : JSON.stringify(response)
  return new Response(
    content,
    {
      status: status || 200,
      headers: {
        'Content-Type': isString ? 'text/plain' : 'application/json',
        'Content-Length': content.length,
        ...headers
      }
    }
  )
}
