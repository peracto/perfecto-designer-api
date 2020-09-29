/* eslint-disable no-undef */
export const appEnv = Object.freeze({
  keyLife: 15 * 60 * 1000,
  ...JSON.parse(APPCONFIG),
  kvstore: CLIENT_ROUTING
})
