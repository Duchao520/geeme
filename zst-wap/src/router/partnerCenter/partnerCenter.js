const partnerCenter = () => import('@/components/partnerCenter/index')
const putCash = () => import('@/components/partnerCenter/withdraw/putCash')
const withdrawList = () => import('@/components/partnerCenter/withdraw/withdrawList')
const partnerInfo = () => import('@/components/partnerCenter/info/partnerInfo')
const bindPhone  = () => import('@/components/partnerCenter/info/bindPhone')
const profitList = () => import('@/components/partnerCenter/profitList')


const newBusiness = () => import('@/components/partnerCenter/manage/newBusiness/newBusiness')
const businessList = () => import('@/components/partnerCenter/manage/newBusiness/businessList')
const detail = () => import('@/components/partnerCenter/manage/newBusiness/detail')
const storeMenberCount = () => import('@/components/partnerCenter/manage/newBusiness/storeMenberCount')
const storeCardCount = () => import('@/components/partnerCenter/manage/newBusiness/storeCardCount')
const storeProfit = () => import('@/components/partnerCenter/manage/newBusiness/storeProfit')
const buyCardDetail = () => import('@/components/partnerCenter/manage/newBusiness/buyCardDetail')

const memberList = () => import('@/components/partnerCenter/manage/newMenber/memberList')
const memberDetail = () => import('@/components/partnerCenter/manage/newMenber/memberDetail')

const currentSaleCard = () => import('@/components/partnerCenter/manage/saleCard/currentSaleCard')
const orderDetail = () => import('@/components/partnerCenter/manage/saleCard/orderDetail')


const businessCount = () => import('@/components/partnerCenter/count/businessCount')
const menberCount = () => import('@/components/partnerCenter/count/menberCount')
const saleCard = () => import('@/components/partnerCenter/count/saleCard')
const saleCardDetail = () => import('@/components/partnerCenter/count/saleCardDetail')
const dataStatistics = () => import('@/components/partnerCenter/count/dataStatistics')
const locationParter = () => import('@/components/partnerCenter/count/locationParter')


const staff = () => import('@/components/partnerCenter/tool/staff/staff')
const staffDetail = () => import('@/components/partnerCenter/tool/staff/staffDetail')
const addStaff = () => import('@/components/partnerCenter/tool/staff/addStaff')
const stafHistory = () => import('@/components/partnerCenter/tool/staff/stafHistory')

const setShopList = r => import('@/components/partnerCenter/setShopRate/setShopList')
const setStoreList = r => import('@/components/partnerCenter/setShopRate/setStoreList')
const setShopRate = r => import('@/components/partnerCenter/setShopRate/setShopRate')

const buyCard = () => import('@/components/partnerCenter/tool/buyCard/buyCard')
const material = () => import('@/components/partnerCenter/tool/buyCard/material')
const buyCardAddresss = () => import('@/components/partnerCenter/tool/buyCard/addresss')
const shopList = r => require.ensure([], () => r(require('@/components/partnerCenter/tool/buyCard/shopList')), 'shopList')



const information = () => import('@/components/partnerCenter/tool/enter/information')
const loginInfo = () => import('@/components/partnerCenter/tool/enter/loginInfo')
const address = () => import('@/components/partnerCenter/tool/enter/address')
const aptitude = () => import('@/components/partnerCenter/tool/enter/aptitude')
const receivables = () => import('@/components/partnerCenter/tool/enter/receivables')
const preview = () => import('@/components/partnerCenter/tool/enter/preview')


const newMember = () => import('@/components/partnerCenter/chart/newMember')
const profitCount = () => import('@/components/partnerCenter/chart/profitCount')

const partnerDetail = () => import('@/components/partnerCenter/tool/location/partnerDetail')

const actCodeRecord = () => import('@/components/partnerCenter/serviceProvide/actCodeRecord');
const actCodeDetail = () => import('@/components/partnerCenter/serviceProvide/actCodeDetail');
const actCodeList = () => import('@/components/partnerCenter/serviceProvide/actCodeList');
const getActCodeList = () => import('@/components/partnerCenter/serviceProvide/getActCodeList');





export default[
  {
    path: '/partnerCenter',
    name: 'partnerCenter',
    component: partnerCenter ,
    meta :{
      title : '服务商中心'
    }
  },
  {
    path: '/putCash',
    name: 'putCash',
    component: putCash ,
    meta :{
      title : '提现'
    }
  },
  {
    path: '/withdrawList',
    name: 'withdrawList',
    component: withdrawList,
    meta :{
      title : '提现记录'
    }
  },
  {
    path: '/partnerInfo',
    name: 'partnerInfo',
    component: partnerInfo,
    meta :{
      title : '个人中心设置'
    }
  },
  {
    path: '/bindPhone',
    name: 'bindPhone',
    component: bindPhone,
    meta :{
      title : '更改绑定手机号'
    }
  },
  {
    path: '/profitList',
    name: 'profitList',
    component: profitList,
    meta :{
      title : '收益统计'
    }
  },
  {
    path: '/businessList',
    name: 'businessList',
    component: businessList,
    meta :{
      title : '我推荐的联盟商家'
    }
  },
  {
    path: '/detail',
    name: 'detail',
    component: detail,
    meta :{
      title : '联盟商家详情'
    }
  },
  {
    path: '/storeMenberCount',
    name: 'storeMenberCount',
    component: storeMenberCount,
    meta :{
      title : '商家会员统计'
    }
  },
  {
    path: '/storeCardCount',
    name: 'storeCardCount',
    component: storeCardCount,
    meta :{
      title : '商家购卡统计'
    }
  },
  {
    path: '/buyCardDetail',
    name: 'buyCardDetail',
    component: buyCardDetail,
    meta :{
      title : '商家购卡明细'
    }
  },
  {
    path: '/storeProfit',
    name: 'storeProfit',
    component: storeProfit,
    meta :{
      title : '商家收益统计'
    }
  },
  {
    path: '/saleCard',
    name: 'saleCard',
    component: saleCard,
    meta :{
      title : '售卡统计'
    }
  },
  {
    path: '/newMember',
    name: 'newMember',
    component: newMember,
    meta :{
      title : '新增会员'
    }
  },
  {
    path: '/newBusiness',
    name: 'newBusiness',
    component: newBusiness,
    meta :{
      title : '新增商家'
    }
  },
  {
    path: '/currentSaleCard',
    name: 'currentSaleCard',
    component: currentSaleCard,
    meta :{
      title : '本月售卡'
    }
  },
  {
    path: '/orderDetail',
    name: 'orderDetail',
    component: orderDetail,
    meta :{
      title : '订单购卡详情'
    }
  },
  {
    path: '/businessCount',
    name: 'businessCount',
    component: businessCount,
    meta :{
      title : '商家统计'
    }
  },
  {
    path: '/menberCount',
    name: 'menberCount',
    component: menberCount,
    meta :{
      title : '会员统计'
    }
  },
  {
    path: '/saleCardDetail',
    name: 'saleCardDetail',
    component: saleCardDetail,
    meta :{
      title : '购卡明细'
    }
  },
  {
    path: '/dataStatistics',
    name: 'dataStatistics',
    component: dataStatistics,
    meta: {
      title: '数据统计'
    }
  },
  {
    path: '/locationParter',
    name: 'locationParter',
    component: locationParter,
    meta: {
      title: '推荐的区域服务商'
    }
  },
  {
    path: '/profitCount',
    name: 'profitCount',
    component: profitCount,
    meta :{
      title : '收益统计'
    }
  },
  {
    path: '/setShopList',
    name: 'setShopList',
    component: setShopList,
    meta :{
      title : '服务商费率设置'
    },
  },
  {
    path: '/setShopRate',
    name: 'setShopRate',
    component: setShopRate,
    meta :{
      title : '服务商费率设置'
    },
  },
  {
    path: '/setStoreList',
    name: 'setStoreList',
    component: setStoreList,
    meta :{
      title : '服务商费率设置'
    },
  },
  {
    path: '/staff',
    name: 'staff',
    component: staff,
    meta :{
      title : '我的职员'
    }
  },
  {
    path: '/staffDetail',
    name: 'staffDetail',
    component: staffDetail,
    meta :{
      title : '职员详情'
    }
  },
  {
    path: '/addStaff',
    name: 'addStaff',
    component: addStaff,
    meta :{
      title : '新增职员'
    }
  },
  {
    path: '/stafHistory',
    name: 'stafHistory',
    component: stafHistory,
    meta :{
      title : '职员添加记录'
    }
  },
  {
    path: '/buyCard',
    name: 'buyCard',
    component: buyCard,
    meta :{
      title : '在线购卡'
    }
  },
  {
    path: '/shopList',
    name: 'shopList',
    component: shopList,
    meta :{
      title : '在线购卡'
    }
  },
  {
    path: '/buyCardAddresss',
    name: 'buyCardAddresss',
    component: buyCardAddresss,
    meta :{
      title : '在线购卡'
    }
  },
  {
    path: '/material',
    name: 'material',
    component: material,
    meta :{
      title : '在线购卡'
    }
  },
  {
    path: '/memberList',
    name: 'memberList',
    component: memberList,
    meta :{
      title : '会员列表'
    }
  },
  {
    path: '/memberDetail',
    name: 'memberDetail',
    component: memberDetail,
    meta :{
      title : '会员详情'
    }
  },
  {
    path: '/information',
    name: 'information',
    component: information,
    meta :{
      title : '商家入驻'
    }
  },
  {
    path: '/loginInfo',
    name: 'loginInfo',
    component: loginInfo,
    meta :{
      title : '商家入驻'
    }
  },
  {
    path: '/address',
    name: 'address',
    component: address,
    meta :{
      title : '商家入驻'
    }
  },
  {
    path: '/aptitude',
    name: 'aptitude',
    component: aptitude,
    meta :{
      title : '商家入驻'
    }
  },
  {
    path: '/preview',
    name: 'preview',
    component: preview,
    meta :{
      title : '商家入驻'
    }
  },
  {
    path: '/receivables',
    name: 'receivables',
    component: receivables,
    meta :{
      title : '二维码收款'
    }
  },
  {
    path: '/partnerDetail',
    name: 'partnerDetail',
    component: partnerDetail,
    meta: {
      title: '服务商详情'
    }
  },
  {
    path: '/actCodeRecord',
    name: 'actCodeRecord',
    component: actCodeRecord,
    meta: {
      title: '商家激活码'
    }
  },
  {
    path: '/actCodeDetail',
    name: 'actCodeDetail',
    component: actCodeDetail,
    meta: {
      title: '商家激活码'
    }
  },
  {
    path: '/actCodeList',
    name: 'actCodeList',
    component: actCodeList,
    meta: {
      title: '商家激活码'
    }
  },
  {
    path: '/getActCodeList',
    name: 'getActCodeList',
    component: getActCodeList,
    meta: {
      title: '商家激活码'
    }
  }
]

