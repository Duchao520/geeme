import Vue from 'vue'
import Axios from 'axios'
import store from '@/store'
import * as utils from '@/assets/js/utils'

const axios = Axios.create({
    timeout: 60000,
    baseURL: SERVICE_URL + '/service-api'
})

axios.interceptors.request.use(
    config => {
        // console.log(config)
        // console.log(config.url)
        if (!config.withoutToken) {
            const token = utils.getCookieToken('geeme_pc_token')
            const headers = (!!token && token[2].length) ? token[2] : ''
            headers && (config.headers.Authorization = headers)
            // store.commit('SAVE_OPERATE', { saveVuex: true })
        }
        return config
    },
    err => {
        return Promise.error(err)
    }
)

// 登录接口密码错误给的401 不能判断接口url
// axios.interceptors.response.use(
//     res => {
//         res.headers.authorization && utils.setCookie('geeme_pc_token', res.headers.authorization, 100)
//         return res.data
//     },
//     err => {
//         // if (utils.isInString(err, '401') || utils.isInString(err, '403')) {
//         //     // store.commit('SAVE_OPERATE', { saveVuex: false })
//         //     utils.clearCookie('geeme_pc_token')
//         //     window.location.href = window.location.origin + '/'
//         // } else {
//         //     Vue.prototype.$message.error('请求错误')
//         //     return Promise.reject(err)
//         // }
//         console.log('err.....', err)
//     }
// )

export function post(url, data, config) {
    return new Promise((resolve, reject) => {
        axios.post(url, data, config).then(res => {
            res.headers.authorization && utils.setCookie('geeme_pc_token', res.headers.authorization, 100) // 不用原生拦截器需要每个请求封装带上
            resolve(res.data)
        }).catch(err => {
            if (utils.isInString(err, '401') || utils.isInString(err, '403')) {
                if (url.indexOf('/pc/login') !== -1) {
                    Vue.prototype.$message.error('用户名或密码错误')
                } else {
                    utils.clearCookie('geeme_pc_token')
                    window.location.href = window.location.origin + '/'
                }
            } else {
                if (config && config.noNormalError) {
                } else {
                    Vue.prototype.$message.error('请求错误')
                }
                reject(err)
            }
        })
    })
}

/**
 * axios.put
 * 同post
 * */
export function put(url, data, config) {
    return new Promise((resolve, reject) => {
        axios.put(url, data, config).then(res => {
            res.headers.authorization && utils.setCookie('geeme_pc_token', res.headers.authorization, 100)
            resolve(res.data)
        }).catch(err => {
            if (utils.isInString(err, '401') || utils.isInString(err, '403')) { // 不用原生拦截器需要每个请求封装带上
                utils.clearCookie('geeme_pc_token')
                window.location.href = window.location.origin + '/'
            } else {
                Vue.prototype.$message.error('请求错误')
                reject(err)
            }
        })
    })
}

/**
 * eg1: {params: {key1: value1}} ==> host:port/url?key1:value1&key2:value2
 * eg2: url/id ==> host:port/url/id
 */
export function get(url, config) {
    return new Promise((resolve, reject) => {
        axios.get(url, config).then(res => {
            res.headers.authorization && utils.setCookie('geeme_pc_token', res.headers.authorization, 100)
            resolve(res.data)
        }).catch(err => {
            if (utils.isInString(err, '401') || utils.isInString(err, '403')) {
                utils.clearCookie('geeme_pc_token')
                window.location.href = window.location.origin + '/'
            } else {
                Vue.prototype.$message.error('请求错误')
                reject(err)
            }
        })
    })
}

/**
 * axios.delete
 * eg: CustomerList.vue
 * {data: {key1: value1, key2: value2}}
 * */
export function del(url, config) {
    return new Promise((resolve, reject) => {
        axios.delete(url, config).then(res => {
            res.headers.authorization && utils.setCookie('geeme_pc_token', res.headers.authorization, 100)
            resolve(res.data)
        }).catch(err => {
            if (utils.isInString(err, '401') || utils.isInString(err, '403')) {
                utils.clearCookie('geeme_pc_token')
                window.location.href = window.location.origin + '/'
            } else {
                Vue.prototype.$message.error('请求错误')
                reject(err)
            }
        })
    })
}