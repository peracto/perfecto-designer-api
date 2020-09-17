import { storage } from '../gcp'

export default function get (request) {
  return storage.get('test/design.json2')
}
