import factory from '../../../../Library/Application Support/JetBrains/WebStorm2020.2/scratches/kiss/kiss-firestore'
import { gcpFetch } from './gcp-fetch'
import { gcpConfig } from '../app/app-config'

export default factory(gcpFetch, gcpConfig.projectId)
