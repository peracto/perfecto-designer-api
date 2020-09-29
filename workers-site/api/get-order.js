import { gcpStorage } from '../gcp/gcp-storage'

export async function getOrder (request) {
  return await gcpStorage.get('test/sku-map.json')
}
