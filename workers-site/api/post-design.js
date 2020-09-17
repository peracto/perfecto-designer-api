import { storage } from '../gcp'
import respond from '../app/app-response-builder'

export default async request => {
  const result = await request.text()
  const rc = await storage.put('test/design.json2', result, 'text/json')
  return respond(rc)
}
