import Vue from 'vue'
import Router from 'vue-router'

import common from './common/common'
import shareProfits from './shareProfits/shareProfits'
import drawRecord from './drawRecord/drawRecord'
import svip_1 from './svip/svip_1'
import svip_pay from './svip/svip_pay'
import proShow from './proShow/proShow'
import taobao from './taobao/taobao'
import auditModule from './auditModule/auditModule'
import serviceProvide from './serviceProvide/serviceProvide'
import rules from './rules/rules'
import partnerCenter from './partnerCenter/partnerCenter'
import chinaUnicom from './chinaUnicom/chinaUnicom'
import logistics from './logistics/logistics'
import cardFriends from './cardFriends/cardFriends'
import shop from './shop/shop'
import mchreg from './mchreg/mchreg'


Vue.use(Router)

export default new Router({
  // mode:'history',
  routes: [
    ...common,
    ...shareProfits,
    ...drawRecord,
    ...svip_1,
    ...svip_pay,
    ...proShow,
    ...taobao,
    ...auditModule,
    ...serviceProvide,
    ...rules,
    ...partnerCenter,
    ...chinaUnicom,
    ...logistics,
    ...cardFriends,
    ...shop,
    ...mchreg
  ]
})
