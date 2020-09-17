import ApiRouteHandler from './api'

addEventListener('fetch', event => {
  try {
    event.respondWith(ApiRouteHandler(event.request))
  } catch (e) {
    event.respondWith(new Response(dump(e), { status: 500 }))
  }
})

function dump (e) {
  return `${e.message || e.toString()}\n${e.stack}`
}
