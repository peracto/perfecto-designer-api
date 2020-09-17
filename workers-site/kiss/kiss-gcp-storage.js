const { encodeURIComponentEx, encodeURIPath } = require('./kiss-uri')

export default function storageFactory (fetch, bucket) {
  const base = `https://storage.googleapis.com/storage/v1/b/${bucket}/o/`
  const getUrl = path => new URL(path, base).toString()

  function create (file, body) {
    // const base = `https://storage.googleapis.com/upload/storage/v1/b/${bucket}/o/`
    return fetch(
      getUrl(`?uploadType=media&name=${file}`),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'text/json'
        },
        body
      })
  }
  function put (file, content, contentEncoding) {
    return fetch(
      getUrl(`https://storage.googleapis.com/upload/storage/v1/b/${bucket}/o/?uploadType=media&name=${encodeURIPath(file)}&contentEncoding=${encodeURIComponentEx(contentEncoding)}&predefinedAcl=publicRead`),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'text/json'
        },
        body: content
      })
  }
  function get (file) {
    return fetch(getUrl(`${encodeURIComponentEx(file)}?alt=media`), {})
  }
  return {
    create,
    get,
    put
  }
}
