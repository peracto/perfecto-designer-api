import parser from './parser'

export default function firestoreFactory (fetch, projectId) {
  const buildUrl = createUrl(`https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/`)

  return {
    db (params) {
      return fetch(buildUrl('auth/', params), {})
        .then(r => r.json())
        .then(d => ({ d, e: d.documents ? d.documents.map(parser.decode) : parser.decode(d) }))
    },

    write (value) {
      return fetch(
        buildUrl('auth'),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...parser.encode(value)
          })
        }
      )
    }
  }
}

function createUrl (base) {
  return (path, params) => addParams(new URL(path, base), params).toString()
}

function addParams (url, params) {
  if (!params) return url
  Object.entries(params).reduce((a, v) => {
    a.set(v[0], v[1])
    return a
  }, url.searchParams)
  return url
}
