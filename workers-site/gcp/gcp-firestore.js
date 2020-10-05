import { firestoreFactory } from 'kiss-gcp-firestore'
import { gcpFetch } from './gcp-fetch'
import { gcpConfig } from '../app/app-config'

export const firestore = firestoreFactory({
  fetch: gcpFetch,
  projectId: gcpConfig.projectId
})
