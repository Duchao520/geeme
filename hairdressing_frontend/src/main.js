// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import '../theme/index.css'

// - for el-bigdata-table - (应用于门店提成设置方案) 【大数据表格】
import 'el-bigdata-table'

// - for pl-table - 暂时没有使用（问题图片丢失） 【大数据表格】
import plTable from 'pl-table'
import 'pl-table/themes/index.css' // 引入样式，请查看webpack是否配置了url-loader对woff，ttf文件的引用,不配置会报错哦
import 'pl-table/themes/plTableStyle.css' // 默认表格样式很丑 引入这个样式就可以好看啦

import * as utils from '@/assets/js/utils'
import "@/components/common/_global.js";
import { mixin } from './util/mixin' // 延时处理
import './assets/icon/iconfont.css'
import '@/util/qiyukf'
// 全局注册组件
import GTags from '@/components/common/global/tags'
import GUploadSPic from '@/components/common/global/uploadSPic'
import GUploadMPic from '@/components/common/global/uploadMPic'
import GLoading from '@/components/common/global/loading'
import GNolist from '@/components/common/global/nolist'
import GTabs from '@/components/common/global/tabs'
import GTabpane from '@/components/common/global/tabpane'
import GButton from '@/components/common/global/button'
import GGradBtn from '@/components/common/global/gradbtn'
import GBtn from '@/components/common/global/btn'
import GClickbtn from '@/components/common/global/clickbtn'
import GTable from '@/components/common/global/table'
import GCard from '@/components/common/global/card'
import GAvatar from '@/components/common/global/avatar'
import StatusText from '@/components/common/global/StatusText'
import GAddress from '@/components/common/global/address'
import SAddress from '@/components/common/global/saddress'
import addressMap from '@/components/common/global/addressMap'
import GSearch from '@/components/common/global/search'
import GInput from '@/components/common/global/input'
import GNumInput from '@/components/common/global/numInput'
import GTip from '@/components/common/global/tip'
import GPicAjust from '@/components/common/global/pic-ajust'
import OperateDialog from '@/components/commonModal/modal/operate'
import MyDialog from '@/components/commonModal/modal/dialog'
import DelModel from '@/components/common/DelModel'
import DialogWithSlot from '@/components/common/dialogWithSlot'
import InputSearch from "@/components/common/InputSearch"
import InputWithCount from '@/components/common/InputWithCount'
import SwitchMenu from '@/components/common/SwitchMenu'
import SwitchButton from '@/components/common/SwitchButton'
import FullSinglePage from '@/pages/fullSinglePage'
/**图片查看器 */
import preview from 'vue-photo-preview'
/**全局minxin deplay */
Vue.mixin(mixin)
import 'vue-photo-preview/dist/skin.css'
Vue.component('g-tags', GTags)
    // 可点击更换上传单张图片
Vue.component('g-upload-spic', GUploadSPic)
    // 上传多张图片，自带删除
Vue.component('g-upload-mpic', GUploadMPic)
    // 正在加载图片
Vue.component('g-loading', GLoading)
    // 列表缺省提示
Vue.component('g-nolist', GNolist)
    // 头部路由列表
Vue.component('g-tabs', GTabs)
    // 头部路由列表,el组件改造
Vue.component('g-tabpane', GTabpane)
    // 全局按钮
Vue.component('g-button', GButton)
    // 不带icon的全局按钮
Vue.component('g-btn', GBtn)
    // 带有渐变色的按钮
Vue.component('g-gradbtn', GGradBtn)
    // 新增小按钮
Vue.component('g-clickbtn', GClickbtn)
    // 全局状态按钮
Vue.component('status-text', StatusText)
    // table表格
Vue.component('g-table', GTable)
    // 卡片选项入口
Vue.component('g-card', GCard)
    // 头像
Vue.component('g-avatar', GAvatar)
    // 祖籍地址选择
Vue.component('g-address', GAddress)
    // 单个下拉的多层级联下拉框
Vue.component('s-address', SAddress)
    // 地图组件
Vue.component('g-saddress', addressMap)
    // 搜索框
Vue.component('g-search', GSearch)
    // 输入框
Vue.component('g-input', GInput)
    // 带增加减少按钮的数字输入框
Vue.component('g-num-input', GNumInput)
    // 输入框的提示
Vue.component('g-tip', GTip)
    // 图片预览的提示
Vue.component('g-pic-ajust', GPicAjust)
    // 弹窗外壳
Vue.component('my-dialog', MyDialog)
    //删除弹窗
Vue.component('g-del-model', DelModel)
    // 删除弹窗-2
Vue.component('g-dialog-with-slot', DialogWithSlot)
    // 操作成功弹窗
Vue.component('operate-dialog', OperateDialog)
    //搜索输入框（样式已经修改好）
Vue.component('input-search', InputSearch)
    //  带有数字限制的输入框
Vue.component('input-width-count', InputWithCount)
    //切换列表和块状显示
Vue.component('switch-menu', SwitchMenu)
    //不带v-model的button切换器（仅作展示）
Vue.component('switch-button', SwitchButton)
    // 一级路由页面
Vue.component('full-single-page', FullSinglePage)

Vue.config.productionTip = false

Vue.use(ElementUI)

Vue.use(plTable)

import printPlugin from './util/print'
Vue.use(printPlugin)

/**图片查看器 */
var options = {
    fullscreenEl: false //关闭全屏按钮
}
Vue.use(preview, options)

window.router = router

// 首先需要判断是否需要登录
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requireAuth)) { // 判断该路由是否需要登录权限
        let token = utils.getCookieToken('geeme_pc_token')
            // 如果有token值说明可以直接进入我的主页，否则跳转到登录页
        if (!!token && token[2].length) {
            next()
        } else {
            next({
                path: '/',
                query: {} // 将跳转的路由path作为参数，登录成功后跳转到该路由
            })
        }
    } else {
        next();
    }
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    test: [],
    components: { App },
    template: '<App/>'
})