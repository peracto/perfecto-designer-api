import { gcpStorage } from '../gcp/gcp-storage'
import { responseBuilder } from '../app/app-response-builder'

export const postDesign = async (request, { data, meta }) => {
  console.log('postDesign')
  const result = await request.text()
  console.log('posting Design', result)
  const rc = await gcpStorage.put(`${data.id}/design.json`, result, 'text/json')
  return rc
}
