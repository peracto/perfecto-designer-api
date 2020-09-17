import { signer } from '../gcp'
import config from '../app/app-config'

export default async function putUploadUrl (request, { data }) {
  const params = new URL(request.url).searchParams

  const r = await signer.getSignedUrl(
    config.gcp.imageBucket,
    params.get('file'),
    {
      method: 'PUT',
      expiration: 20, // 10 seconds
      contentType: params.get('contentType')
    }
  )
  return Response.redirect(r, 302)
}
