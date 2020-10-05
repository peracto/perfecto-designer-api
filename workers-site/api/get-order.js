import { firestore } from '../gcp/gcp-firestore'
import { responseBuilder } from '../app/app-response-builder'

export async function getOrder (request, { data }) {
  const order = await firestore.get(`orders/${data.id}`)
  const design = 'tshirt'
  const surface = await firestore.get(`tenants/${data.tenantId}/designSurfaces/${design}`)
  console.log('ORDERX1:::', JSON.stringify(order), surface)
  const a = await firestore.get(`designs/${data.id}`)

  let rrr
  try {
    rrr = await firestore.batchGet({
      order: `orders/${data.id}`,
      surface: `tenants/${data.tenantId}/designSurfaces/${design}`,
      design: `designs/${data.id}`
    })
  } catch (ex) {
    console.error(ex)
  }

  return responseBuilder({
    order: {
      createTime: order.createTime,
      updatedTime: order.updateTime,
      document: a.value
    },
    surfaces: [surface].map(a => a.value.document),
    design: {
      createTime: a.createTime,
      updatedTime: a.updateTime,
      document: a.value.document
    },
    rrr
  })
}
