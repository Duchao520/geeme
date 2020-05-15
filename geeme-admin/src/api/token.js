import form from '@/utils/form'
import { getItem, removeItem } from '@/utils/storage'

/**
 * @param {String} code 
 * @description 请求授权服务器用 code 换取 token
 */
export const getTokenByCode = (code) => {
  return form({
    method: 'post',
    url: '/auth/oauth/token'/* Config.authUrl + '/oauth/token' */,
    data: {
      grant_type: 'authorization_code',
      code: code,
      client: process.env.VUE_APP_APPID,
      redirect_uri: process.env.VUE_APP_BASEURL
    }
  })
}

/**
 * @description 请求授权服务器刷新 Token 
 */
export const refreshToken = () => {
  let refresh = getItem('REFRESH_TOKEN')
  if (!refresh) {
    console.error('refresh_token not find.')
  }
  return form({
    method: 'post',
    url: '/auth/oauth/token',
    data: {
      grant_type: 'refresh_token',
      refresh_token: refresh
    }
  })
}

