import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
/**
 * 信息（品牌id，用户信息，当前店铺）
 */
import manage from './modules/manage'
import vipCard from './modules/vipCard/index'
import authRouter from './modules/authRouter/index'
import queryParams from './modules/queryParams/index'
import appointment from './modules/appointment/index'
import bill from './modules/bill/index'
import commission from './modules/commission/index'
import marketing from './modules/marketing/index'
import soft from './modules/soft/index'
import payTypesAuth from './modules/payTypesAuth/index'
import shopStaffsInfo from './modules/shopStaffsInfo/index'
import stockGoods from './modules/stockGoods'
import seller from './modules/seller'
import giftCard from './modules/giftCard'
import shareholder from './modules/shareholder'
import ad from './modules/ad'

/**
 * 订单结算数据
 */

Vue.config.debug = true
Vue.use(Vuex)
Vue.config.warnExpressionErrors = false

const store = new Vuex.Store({
    modules: {
        manage,
        vipCard,
        authRouter,
        queryParams,
        appointment,
        bill,
        commission,
        marketing,
        soft,
        payTypesAuth,
        shopStaffsInfo,
        stockGoods,
        seller,
        giftCard,
        shareholder,
        ad,
    },
    strict: process.env.NODE_ENV !== 'production',
    plugins: [createPersistedState(
        {storage: window.sessionStorage}
    )]
})
export default store