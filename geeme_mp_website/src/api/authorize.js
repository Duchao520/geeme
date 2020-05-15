import fetch from '@/utils/fetch'

/**
 * @description 品牌客户关联公众号的openId
 * @params code 公众号授权code
 * @params mobile  手机号
 * @params officialAppId 公众号appId
 * @author Duchao
 */
export const bindOpenId = (data) => {
  return fetch({
    method: 'post',
    url: '/service-api/weGetSaveOpenIdOfOfficialAccountsForCustomer',
    data,
  })
}
export const getVerifyCodeForOfficialBind = (data) => {
  return fetch({
    method: 'post',
    url: '/service-api/getVerifyCodeForOfficialBind',
    data,
  })
}
