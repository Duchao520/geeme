const setSvipCard = () => import('@/components/sVip/setSvipCard');
const editorSvipCard = () => import('@/components/sVip/editorSvipCard');
const svipDetail = () => import('@/components/sVip/svipDetail');
const isCarder = () => import('@/components/sVip/isCarder');
const mycreatcard = () => import('@/components/sVip/mycreatcard');
const newpurHistory = () => import('@/components/sVip/newpurHistory');
const shareHistory = () => import('@/components/sVip/shareHistory');
const purDetail = () => import('@/components/sVip/purDetail');
const findSvip = () => import('@/components/sVip/findSvip');
const sellerDetail = () => import('@/components/sVip/sellerDetail');
const vipCard = () => import('@/components/sVip/vipCard');
const shareSvipCard = () => import('@/components/sVip/shareSvipCard');
const mySvipCard = () => import('@/components/sVip/mySvipCard');
const mainshareHistory = () => import('@/components/sVip/mainshareHistory');
const svipRules = () => import('@/components/sVip/svipRule/svipRules');
const carderText = () => import('@/components/sVip/svipRule/carderText');
const cardMaster = () => import('@/components/sVip/svipRule/cardMaster');
const approvePayChanel = () => import('@/components/sVip/svipRule/approvePayChanel');
const shareCommision = () => import('@/components/sVip/svipRule/shareCommision');
const allienceDesc = () => import('@/components/sVip/svipRule/allienceDesc');


export default [
  /*svip页面*/

  {
    path: '/setSvipCard',
    name: 'setSvipCard',
    component: setSvipCard
  },
  {
    path: '/editorSvipCard',
    name: 'editorSvipCard',
    component: editorSvipCard
  },
  {
    path: '/svipDetail',
    name: 'svipDetail',
    component: svipDetail
  },
  {
    path: '/isCarder',
    name: 'isCarder',
    component: isCarder
  },
  {
    path: '/mycreatcard',
    name: 'mycreatcard',
    component: mycreatcard
  },
  {
    path: '/newpurHistory',
    name: 'newpurHistory',
    component: newpurHistory
  }
  , {
    path: '/shareHistory',
    name: 'shareHistory',
    component: shareHistory
  },
  {
    path: '/purDetail',
    name: 'purDetail',
    component: purDetail
  },
  {
    path: '/findSvip',
    name: 'findSvip',
    component: findSvip
  },
  {
    path: '/sellerDetail',
    name: 'sellerDetail',
    component: sellerDetail
  },
  {
    path: '/vipCard',
    name: 'vipCard',
    component: vipCard
  }, {
    path: '/shareSvipCard',
    name: 'shareSvipCard',
    component: shareSvipCard
  },
  {
    path: '/mySvipCard',
    name: 'mySvipCard',
    component: mySvipCard
  },
  {
    path: '/mainshareHistory',
    name: 'mainshareHistory',
    component: mainshareHistory
  },
  {
    path: '/svipRules',
    name: 'svipRules',
    component: svipRules
  },
  {
    path: '/carderText',
    name: 'carderText',
    component: carderText
  },
  {
    path: '/cardMater',
    name: 'cardMaster',
    component: cardMaster
  },
  {
    path: '/shareCommision',
    name: 'shareCommision',
    component: shareCommision
  },
  {
    path: '/approvePayChanel',
    name: 'approvePayChanel',
    component: approvePayChanel
  },
  {
    path: '/allienceDesc',
    name: 'allienceDesc',
    component: allienceDesc
  }
]
