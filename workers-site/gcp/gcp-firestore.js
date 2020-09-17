import factory from '../kiss/kiss-firestore'
import fetch from './gcp-fetch'
import config from '../app/app-config'

export default factory(fetch, config.gcp.projectId)
