const svipPayIndex = () => import('@/components/sVip/svipPay/index');
const svipPayPay = () => import('@/components/sVip/svipPay/pay');
const mainCardPay = () => import('@/components/sVip/svipPay/mainCardPay');
const mainCardPay_hangbai = () => import('@/components/sVip/svipPay/mainCardPay_hangbai');
const pay_success = () => import('@/components/sVip/svipPay/pay_success');
const notPayChanel = () => import('@/components/sVip/svipPay/notPayChanel');
const scanPay_hangbai = () => import('@/components/sVip/svipPay/scanPay_hangbai');
const svip_test = () => import('@/components/sVip/svipPay/test');

export default [
  /*svip支付页面*/
  {
    path: '/svipPayIndex',
    name: 'svipPayIndex',
    component: svip_test
  },
  {
    path: '/svipPayPay',
    name: 'svipPayPay',
    component: svipPayPay
  },
  {
    path: '/mainCardPay',
    name: 'mainCardPay',
    component: mainCardPay
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
    path: '/mainCardPay_hangbai',
    name: 'mainCardPay_hangbai',
    component: mainCardPay_hangbai
  },
  {
    path: '/svip_test',
    name: 'svip_test',
    component: svip_test
  }
]
