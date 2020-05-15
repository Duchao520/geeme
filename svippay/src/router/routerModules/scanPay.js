const success = () => import("@/components/scanPay/success");
const fail = () => import("@/components/scanPay/fail");
const cardMaster = () => import("@/components/scanPay/cardMaster");
const couponCourse = () => import("@/components/scanPay/couponCourse");
const error = () => import("@/components/scanPay/error");
const code = () => import("@/components/scanPay/code");
const store_error = () => import("@/components/scanPay/store_error");
const recharge = () => import("@/components/scanPay/recharge");
const scanPay = () => import("@/components/scanPay/pay");
const pay_success = () => import("@/components/scanPay/pay_success");
const notPayChanel = () => import("@/components/scanPay/notPayChanel");
const scanPay_hangbai = () => import("@/components/hangbai/hangbai_pay_1");
const allienceDesc = () => import("@/components/scanPay/allienceDesc");

export default [
  {
    path: '/success',
    name: 'success',
    component: success
  },
  {
    path: '/fail',
    name: 'fail',
    component: fail
  },
  {
    path: '/cardMaster',
    name: 'cardMaster',
    component: cardMaster
  },
  {
    path: '/couponCourse',
    name: 'couponCourse',
    component: couponCourse
  },
  {
    path: '/error',
    name: 'error',
    component: error
  },
  {
    path: '/code',
    name: 'code',
    component: code
  },
  {
    path: '/store_error',
    name: 'store_error',
    component: store_error
  },
  {
    path: '/recharge',
    name: 'recharge',
    component: recharge
  },
  {
    path: '/scanPay',
    name: 'scanPay',
    component: scanPay
  },
  {
    path: '/pay_success',
    name: 'pay_success',
    component: pay_success
  },
  {
    path: '/notPayChanel',
    name: 'notPayChanel',
    component: notPayChanel
  },
  {
    path: '/scanPay_hangbai',
    name: 'scanPay_hangbai',
    component: scanPay_hangbai
  },
  {
    path: '/allienceDesc',
    name: 'allienceDesc',
    component: allienceDesc
  }
]
