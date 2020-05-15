import Axios from 'axios'

/**
 * @description token相关交互专用
 */
const service = Axios.create({
  timeout: 6000,
  //withCredentials: true,
  baseURL:/*  process.env.NODE_ENV === 'development'? '':  */process.env.VUE_APP_AUTHURL.replace('/auth', ''),
  transformRequest: [function(data) {
    let ret = ''
    for (let it in data) {
      ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
    }
    return ret
  }],
  auth: {
    username: process.env.VUE_APP_APPID,
    password: process.env.VUE_APP_APPSECRET
  }
})
service.interceptors.request.use(config => {
  config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
  return config
}, error => {
  window.console.log(error)
  Promise.reject(error)
})

export default service