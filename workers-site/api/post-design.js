import { firestore } from '../gcp/gcp-firestore'
import { responseBuilder } from '../app/app-response-builder'

export const postDesign = async (request, { data }) => {
  const result = await request.text()
  console.log('SAVING::', result)
  const a = await firestore.patch(
    `designs/${data.id}`,
    {
      document: result
    }
  )

  return responseBuilder(a)
}
