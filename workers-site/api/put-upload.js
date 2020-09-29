import { gcpSigner } from '../gcp/gcp-signer'
import { gcpConfig } from '../app/app-config'

export async function putUpload (request, { data, meta }) {
  console.log('putUpload')
  const params = new URL(request.url).searchParams
  console.log('auth data', JSON.stringify(data))
  console.log('auth meta', JSON.stringify(meta))
  const r = await gcpSigner.getSignedUrl(
    gcpConfig.imageBucket,
    data.id + '/' + params.get('file'),
    {
      method: 'PUT',
      expiration: 20, // 10 seconds
      contentType: params.get('contentType')
    },
    {
    }
  )
  return Response.redirect(r, 302)
}
