import Axios from 'axios'
import Vue from 'vue'
import { getToken } from '@/utils/token'

const handleErr = (err) => {
  Vue.prototype.$message.error(err.message)
}

// TODO此处要区分不同环境 
const service = Axios.create({
  baseURL: /* process.env.NODE_ENV === 'development'? '': */process.env.VUE_APP_AUTHURL.slice(0, -4),
  withCredentials: false,
  timeout: 5000
})

service.interceptors.request.use(config => {
  const token = getToken()
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token
  }
  return config
}, error => {
  Promise.reject(error)
})

service.interceptors.response.use(response => {
    const res = response.data
    return res
  }, error => {
    // console.log(error.response.status)
    if (error.response && error.response.status === 500) {
      handleErr(new Error(`系统错误`))
    } else if (error.message && error.message.indexOf("timeout") > -1) {
      handleErr(new Error(`网络超时`))
    } else if (error.response && error.response.status === 403) {
      handleErr(new Error(`无请求权限`))
    } else {
      handleErr(new Error(`网络错误`))
    }
    return Promise.reject(error)
  })

export default service