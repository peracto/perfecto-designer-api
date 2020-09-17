import fetchGcp from './gcp-fetch'
import factory from '../kiss/kiss-gcp-storage'
import config from '../app/app-config'
export default factory(fetchGcp, config.gcp.imageBucket)
