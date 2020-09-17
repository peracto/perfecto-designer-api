const normalizeHandlers = entries =>
  new Map([
    ...entries.map(v => [v[0].toUpperCase(), v[1]]),
    ...entries.map(v => [v[0].toLowerCase(), v[1]])
  ])

const createHandler = (map, invalidHandler) =>
  name => map[name && name.toLowerCase()] || map._default || invalidHandler

const createMethodHandler = (map, invalidHandler) =>
  name => map.get(name) || invalidHandler

const createRouteHandler = methodHandler =>
  request => {
    const url = new URL(request.url)
    const path = url.pathname.split('/')
    const handler = methodHandler(request.method)(path[2])
    return handler(request)
  }

export default function buildHandler (handlers, invalidHandler) {
  const h = invalidHandler | _standardHandler
  return createRouteHandler(
    createMethodHandler(
      normalizeHandlers(
        Object
          .entries(handlers)
          .map(v => [v[0], typeof v[1] === 'object' ? createHandler(v[1], h) : v[1]])
      )
    ),
    () => h
  )
}

function _standardHandler () {
  return new Response(null, { status: 404 })
}
