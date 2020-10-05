import { firestore } from '../gcp/gcp-firestore'
import { responseBuilder } from '../app/app-response-builder'

export async function getDesign (request, { data, meta }) {
  const a = await firestore.get(`designs/${data.id}`)
  console.log('DESIGN:::', JSON.stringify(data))
  return responseBuilder({
    createTime: a.createTime,
    updatedTime: a.updateTime,
    document: a.value.document
  })
}
