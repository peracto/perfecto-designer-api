import { gcpFetch } from './gcp-fetch'
import { storage } from 'kiss-gcp'
import { gcpConfig } from '../app/app-config'

export const gcpStorage = storage.storageFactory({
  fetch: gcpFetch,
  bucket: gcpConfig.imageBucket
})
