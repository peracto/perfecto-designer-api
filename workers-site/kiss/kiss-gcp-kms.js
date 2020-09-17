export default function kmsFactory (fetch, name, decoder) {
  const base = `https://cloudkms.googleapis.com/v1/${name}/cryptoKeyVersions/`
  const getUrl = path => new URL(path, base).toString()
  return {
    getPublicKey: async version => {
      const response = await fetch(getUrl(`${version}/publicKey`), { method: 'GET' })
      if (!response.ok) {
        throw new Error(`failed to get public key ${response.status}\n${await response.text()}`)
      }
      const key = await response.json()
      return decoder ? decoder(key) : key
    }
  }
}
