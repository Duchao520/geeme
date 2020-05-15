import { getItem, setItem, removeItem } from '@/utils/storage'
import moment from 'moment'
import store from '@/store'

/**
 * @description 获取token
 */
export const getToken = () => {
  return getItem('ACCESS_TOKEN')
}

/**
 * @description 删除Token。暂不删除 vuex 中对应信息
 */
export const removeToken = () => {
  removeItem('ACCESS_TOKEN')
  removeItem('REFRESH_TOKEN')
  removeItem('EXPIRES_IN')
  removeItem('TOKEN_EXPIRES_TIME')
  removeItem('USER_INFO')
}

/**
 * @description Token是否存在
 */
export const tokenExist = () => {
  return getItem('ACCESS_TOKEN')? true: false
}

/**
 * @description Token 是否过期
 */
export const tokenExpires = () => {
  const limit = parseInt(getItem('TOKEN_EXPIRES_TIME'))
  if (!limit) {
    console.error('access_token_time not find.')
    return true
  }
  return moment().unix() > limit? true: false
}

/**
 * @description 设置Token,获取user_info相关，并存于 vuex 中
 */
export const setToken = (data) => {
  setItem('ACCESS_TOKEN', data.access_token)
  setItem('REFRESH_TOKEN', data.refresh_token)
  setItem('EXPIRES_IN', data.expires_in)
  setItem('TOKEN_EXPIRES_TIME', moment().add(data.expires_in, 's').unix())
  setItem('USER_INFO', JSON.stringify(data.user_info))
  store.commit('SET_USER_INFO', {
    name: data.user_info.userName,
    id: data.user_info.id
  })
}


/**
 * @description 登出操作
 */
export const logout = () => {
  removeToken()
  window.location.href = process.env.VUE_APP_AUTHURL + '/logout'
}

