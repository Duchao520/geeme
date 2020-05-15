import Vue from 'vue'
import axios from 'axios'
import * as utils from '@/assets/js/utils'
import * as api from '@/assets/js/interface'
import store from '../../store'


function clear() {
    // 401的情况:1.验证失效
    window.location.href = window.location.origin + '/'
    utils.clearCookie('geeme_pc_token')
    store.commit('SAVE_OPERATE', {
        saveVuex: false
    })
}

function addVuexState() {
    // 改变vuex的状态
    store.commit('SAVE_OPERATE', {
        saveVuex: true
    })
}
// get方法调用
export function get(url, params, result, isAuth = true) {

    let token = utils.getCookieToken('geeme_pc_token')
    let headers = isAuth ? { Authorization: (!!token && token[2].length) ? token[2] : '' } : {}
    if (isAuth && !(!!headers.Authorization)) {
        window.location.href = window.location.origin + '/'
    }

    addVuexState()
    axios({
            method: "get",
            url: url,
            params: params,
            headers: headers
        })
        .then(res => {
            if (res.status === 200) {
                // 设置cookie
                if (!!res.headers.authorization) {
                    utils.setCookie('geeme_pc_token', res.headers.authorization, 100);
                }
                let _data = JSON.parse(JSON.stringify(res.data))
                delete _data.systemInfo
                result(_data)
            } else if (res.status === 401) {
                // 401的情况:1.验证失效
                clear()
            }
        })
        .catch(err => {
            if (utils.isInString(err, '401')) {
                // 401的情况:1.验证失效
                clear()
            } else {
                Vue.prototype.$message.error('请求错误');
            }
            console.log(err)
        })
}

// post方法调用
export function post(url, params, result, isAuth = true) {
    let token = utils.getCookieToken('geeme_pc_token')
    let headers = isAuth ? { Authorization: (!!token && token[2].length) ? token[2] : '' } : {}
    if (isAuth && !(!!headers.Authorization)) {
        window.location.href = window.location.origin + '/'
    }
    addVuexState()
    axios({
            method: "post",
            url: url,
            data: params,
            headers: headers,
        })
        .then(res => {
            if (res.status === 200) {
                if (!isAuth) utils.setCookie('geeme_pc_token', res.headers.authorization, 100);
                // 设置cookie
                if (!!res.headers.authorization) {
                    utils.setCookie('geeme_pc_token', res.headers.authorization, 100);
                }
                let _data = JSON.parse(JSON.stringify(res.data))
                delete _data.systemInfo
                result(_data, res)
            } else if (res.status === 401) {
                // 401的情况:1.验证失效
                clear()
            }
        })
        .catch(err => {
            if (utils.isInString(err, '401')) {
                if (utils.isInString(url, api.onLogin.URL)) {
                    Vue.prototype.$message.error(api.onLogin.fail_401);
                    return
                }
                // 401的情况:1.验证失效
                clear()
            } else {
                Vue.prototype.$message.error('请求错误');
            }
            console.log(err)
        })
}

export function del(url, params, result, isAuth = true) {
    let token = utils.getCookieToken('geeme_pc_token')
    let headers = isAuth ? { Authorization: (!!token && token[2].length) ? token[2] : '' } : {}
    if (isAuth && !(!!headers.Authorization)) {
        window.location.href = window.location.origin + '/'
    }
    addVuexState()
    axios({
            method: "delete",
            url: url,
            data: params,
            headers: headers,
        })
        .then(res => {
            if (res.status === 200) {
                if (!isAuth) utils.setCookie('geeme_pc_token', res.headers.authorization, 100);
                // 设置cookie
                if (!!res.headers.authorization) {
                    utils.setCookie('geeme_pc_token', res.headers.authorization, 100);
                }
                let _data = JSON.parse(JSON.stringify(res.data))
                delete _data.systemInfo
                result(_data, res)
            } else if (res.status === 401) {
                // 401的情况:1.验证失效
                clear()
            }
        })
        .catch(err => {
            if (utils.isInString(err, '401')) {
                if (utils.isInString(url, api.onLogin.URL)) {
                    Vue.prototype.$message.error(api.onLogin.fail_401);
                    return
                }
                // 401的情况:1.验证失效
                clear()
            } else {
                Vue.prototype.$message.error('请求错误');
            }
            console.log(err)
        })
}

export function put(url, params, result, isAuth = true) {
    let token = utils.getCookieToken('geeme_pc_token')
    let headers = isAuth ? { Authorization: (!!token && token[2].length) ? token[2] : '' } : {}
    if (isAuth && !(!!headers.Authorization)) {
        window.location.href = window.location.origin + '/'
    }
    addVuexState()
    axios({
            method: "put",
            url: url,
            data: params,
            headers: headers,
        })
        .then(res => {
            if (res.status === 200) {
                if (!isAuth) utils.setCookie('geeme_pc_token', res.headers.authorization, 100);
                // 设置cookie
                if (!!res.headers.authorization) {
                    utils.setCookie('geeme_pc_token', res.headers.authorization, 100);
                }
                let _data = JSON.parse(JSON.stringify(res.data))
                delete _data.systemInfo
                result(_data, res)
            } else if (res.status === 401) {
                // 401的情况:1.验证失效
                clear()
            }
        })
        .catch(err => {
            if (utils.isInString(err, '401')) {
                if (utils.isInString(url, api.onLogin.URL)) {
                    Vue.prototype.$message.error(api.onLogin.fail_401);
                    return
                }
                // 401的情况:1.验证失效
                clear()
            } else {
                Vue.prototype.$message.error('请求错误');
            }
            console.log(err)
        })
}