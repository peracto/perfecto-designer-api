const createPem = key => btoa(String.fromCharCode.apply(null, new Uint8Array(key)))

export default {
  /**
   * Generates a new Public/Private keypair
   * @returns {Promise<{private: string, public: string, type: {name: string, hash: string}}>}
   */
  generateKey
}

async function generateKey () {
  const type = { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }
  const keyPair = await crypto.subtle.generateKey(
    {
      ...type,
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1])
    },
    true,
    ['sign', 'verify']
  )

  return {
    type,
    private: createPem(await crypto.subtle.exportKey('pkcs8', keyPair.privateKey)),
    public: createPem(await crypto.subtle.exportKey('spki', keyPair.publicKey))
  }
}
