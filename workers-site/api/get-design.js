import { gcpStorage } from '../gcp/gcp-storage'

export function getDesign (request, { data }) {
  console.log('getDesign')
  return gcpStorage.get(`${data.id}/design.json`)
}
