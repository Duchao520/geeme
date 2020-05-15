import fetch from '@/utils/fetch'

/** 
 * @description 获取短信验证码
 */
export const getVerificationCode = (phone) => {
  return fetch({
    method: 'post',
    url: 'getVerificationCode',
    data: { phone: phone}
  })
}

/** 
 * @description 检验手机号是否已注册
 */
export const phoneExists = (phone) => {
  return fetch({
    method: 'get',
    url: `phoneExists?phone=${phone}`,
  })
}

/** 
 * @description 注册新用户
 */
export const userRegistered = (data) => {
  return fetch({
    method: 'post',
    url: 'userRegistered',
    data,
  })
}