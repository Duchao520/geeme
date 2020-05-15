const cardFriendsIndex = () => import('@/components/cardFriends/Index/cardFriendsIndex');
const defHistory = () => import('@/components/cardFriends/defHistory/defHistory');
const appdefHistory = () => import('@/components/cardFriends/appdefHistory/defHistory');
const submitOrder = () => import('@/components/cardFriends/submitOrder/submitOrder');
const bargain = () => import('@/components/cardFriends/bargain/bargain');
const goodsDetail = () => import('@/components/cardFriends/goodsDetail/goodsDetail');
const checkSale = () => import('@/components/cardFriends/checkSale/checkSale');
const activeBargain = () => import('@/components/cardFriends/activeBargain/activeBargain');
const bargaining = () => import('@/components/cardFriends/bargaining/bargaining');
const winRule = () => import('@/components/cardFriends/winRule/winRule');


export default [
  {
    path: '/cardFriendsIndex',
    name: 'cardFriendsIndex',
    component: cardFriendsIndex
  },
  {
    path: '/defHistory',
    name: 'defHistory',
    component: defHistory
  },
  {
    path: '/appdefHistory',
    name: 'appdefHistory',
    component: appdefHistory
  },
  {
    path: '/submitOrder',
    name: 'submitOrder',
    component: submitOrder
  },
  {
    path: '/bargain',
    name: 'bargain',
    component: bargain
  },
  {
    path: '/goodsDetail',
    name: 'goodsDetail',
    component: goodsDetail
  },
  {
    path: '/checkSale',
    name: 'checkSale',
    component: checkSale
  },
  {
    path: '/activeBargain',
    name: 'activeBargain',
    component: activeBargain
  },
  {
    path: '/bargaining',
    name: 'bargaining',
    component: bargaining
  },
  {
    path: '/winRule',
    name: 'winRule',
    component: winRule
  }
]
