Thanks David.

I've now engaged my brain, and this is the resultant solution to my RSA-SHA256 signing issue ...

First, convert and decode the PEM string from base 64 into a Buffer object (I will cache and persist this to the KV store.) ...

```javascript
function convertPem (pem) {
  return Buffer.from(pem.split('\n').map(s => s.trim()).filter(l => l.length && !l.startsWith('---')).join(''), 'base64')
}
```
Second part, create a CryptoKey (using the object result from the converPem function)
```javascript
function createSigningKey (keyData) {
  return crypto.subtle.importKey(
    'pkcs8',
    keyData,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  )
}
```
We can now use the result of the createSigningKey to sign. In my case I have a string of text, I convert it to a Buffer object, sign the content of the buffer using a key derived from createSigningKey, and finally return a base64 encoded string as result.
```javascript
async function createSignature(text, key) {
  const textBuffer = Buffer.from(text, 'utf8')
  const sign = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, textBuffer)
  return Buffer.from(sign).toString('base64')
}
```
Bada bing.
