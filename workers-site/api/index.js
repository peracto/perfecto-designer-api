import { buildRouter } from 'kiss-simple-router'
import { authorize } from '../app/app-authorize'
import { getVerify } from './get-verify'
import { getDesign } from './get-design'
import { getOrder } from './get-order'
import { putUpload } from './put-upload'
import { postDesign } from './post-design'

console.log('APP_INDEX_STARTUP')

export default buildRouter({
  get: {
    verify: getVerify,
    design: authorize(getDesign),
    order: authorize(getOrder)
  },
  put: {
    upload: authorize(putUpload)
  },
  post: {
    design: authorize(postDesign)
  }
})
