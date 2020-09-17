import { storage } from '../gcp'

export default async function getOrder (request) {
  return await storage.get('test/sku-map.json')
}
