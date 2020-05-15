import * as types from '../types'
import * as datas from '@/assets/js/datas'
import * as utils from '@/assets/js/utils'
/* const state = sessionStorage.getItem('geeme_state') ? JSON.parse(sessionStorage.getItem('geeme_state')) : { */
const state = {
    currentInfo: {
        brandId: null, // 当前选择的品牌id
        brandLogo: null, // 当前选择的品牌logo
        shopId: null, // 当前选择的店铺id
        city: null, // 当前的店铺城市名
        name: null, // 当前店铺名称
        shopLogo: null, // 当前店铺logo
        serviceId: null, // 当前的服务id
        staffId: null, // 当前员工的id编号
        customerId: null, // 当前客户的id编号
        appointmentId: null, // 预约id
        userId: null, // 用户id
        orderTime: null, // 预约列表的时间记录，如2017-12-12
        appoTime: null, // 记录点击预约列表中的加号时间点，如10:00
        staffLevel: null, // 记录员工级别id
        staffName: null, // 记录员工名字
        appoLevelId: null, // 记录预约日历职级id
        cpLevelId: null, // 记录选择开单人的职级id
        cpStaffId: null, // 记录选择开单人的员工id
        cpLevelName: null, // 记录选择开单人的职级名称
        cpStaffName: null, // 记录选择开单人姓名
        cpStaffAvatar: null, // 记录选择开单人头像
        cpTimeChecked: false, // 选择开单人中是否勾选了只显示30分钟有效
        shopName: null,
        brandName: null,
        revenueType: 'NORMAL',
    },
    operate: {
        saveVuex: true,
        dialog: false, // 记录弹窗状态
        clickEnter: null, // 从哪个入口点击进入的,如edit（编辑），add（新增）
    },
    menuShow: true, // 当前menu的显示与隐藏状态
    createBrand: {
        id: null // 当前创建的品牌id
    },
    userInfo: {
        brandList: null, // 记录用户拥有的品牌数组
        birthDay: null,
        defaultHeadPortrait: datas.avatar.URL,
        headPortrait: '',
        hasHeadPortrait: false,
        nickname: null,
        personalProfile: null,
        sex: '保密',
        telephone: null,
        username: null,
        tokenLikeInCookie: null,
        token: null
    },
    brandAuthentication: {
        brandName: "",
        belongTo: "",
        id: null
    },
    currentShopInfo: {
        city: null,
        name: null,
        shopLogo: null
    },
    ws: null
}

const mutations = {
    // 保存当前创建店铺的品牌ID
    [types.SAVE_CREATE_BRAND_ID](state, payload) {
        state.createBrand.id = payload
    },
    // 保存当前品牌的信息
    [types.SAVE_CURRENT_INFO](state, payload) {
        for (let key in payload) {
            state.currentInfo[key] = payload[key]
        }
    },
    //清除预约列表的时间
    [types.CLEAR_TIME]: (state, payload) => {
        state.currentInfo.orderTime = utils.formatDateTimeYYR(new Date())
    },
    // 保存当前品牌的品牌ID
    [types.SAVE_BRAND_ID](state, payload) {
        state.currentInfo.brandId = payload
    },
    // 保存当前品牌的品牌LOGO
    [types.SAVE_BRAND_LOGO](state, payload) {
        state.currentInfo.brandLogo = payload
    },
    // 保存当前店铺的ID
    [types.SAVE_SHOP_ID](state, payload) {
        state.currentInfo.shopId = payload
    },
    // 保存当前menu的显示隐藏状态
    [types.CHANGE_MENU_SHOW](state) {
        state.menuShow = !state.menuShow
    },
    // 保存当前操作的状态
    [types.SAVE_OPERATE](state, payload) {
        for (let key in payload) {
            if (key === 'dialog') {
                state.operate[key] = !state.operate[key]
            } else {
                state.operate[key] = payload[key]
            }

        }
    },
    // 保存当前用户信息
    [types.SAVE_USER_INFO](state, payload) {
        if (!!payload) {
            for (let key in payload) {
                state.userInfo[key] = payload[key]
            }
        }
    },
    //保存用户的品牌
    [types.SAVE_USER_BRAND](state, payload) {
        state.userInfo.brandList = payload
    },
    [types.SET_CURRENT_SHOP_INFO](state, payload) {
        for (let i in payload) {
            state.currentShopInfo[i] = payload[i];
        }
    },
    // websocket
    [types.SAVE_WEBSOCKET](state, payload) {
        state.ws = payload
    },
    [types.SET_APPROVE_BRAND]: (state, payload) => {
        state.brandAuthentication = payload
    }
}
const actions = {
    // websocket
    saveWebsocket: ({ commit }, param) => {
        commit(types.SAVE_WEBSOCKET, param)
    },
    // 保存当前选择的品牌信息
    saveCurrentInfo: ({ commit }, param) => {
        commit(types.SAVE_CURRENT_INFO, param)
    },
    // 保存当前选择的品牌ID
    saveBrandId: ({ commit }, param) => {
        commit(types.SAVE_BRAND_ID, param)
    },
    // 保存当前选择的品牌LOGO
    saveBrandLogo: ({ commit }, param) => {
        commit(types.SAVE_BRAND_LOGO, param)
    },
    // 保存当前选择的店铺ID
    saveShopId: ({ commit }, param) => {
        commit(types.SAVE_SHOP_ID, param)
    },
    // 保存当前创建的品牌ID
    saveCreateBrandId: ({ commit }, param) => {
        commit(types.SAVE_CREATE_BRAND_ID, param)
    },
    // 保存当前用户信息
    saveUserInfo: ({ commit }, param) => {
        commit(types.SAVE_USER_INFO, param)
    },
    saveUserBrand: ({ commit }, param) => {
        commit(types.SAVE_USER_BRAND, param)
    },
    changeMenuShow: ({ commit }) => {
        commit(types.CHANGE_MENU_SHOW)
    },
    // 从哪个入口点击进入的,如edit（编辑），add（新增）
    saveOperate: ({ commit }, param) => {
        commit(types.SAVE_OPERATE, param)
    },
    //清除预约列表的时间
    clearTime: ({ commit }) => {
        commit(types.CLEAR_TIME)
    },
    setApproveBrand({ commit }, param) {
        commit(types.SET_APPROVE_BRAND, param)
    },
    setCurrentShopInfo({ commit }, param) {
        commit(types.SET_CURRENT_SHOP_INFO, param)
    }
}
export default {
    state,
    mutations,
    actions
}