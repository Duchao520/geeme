const wxPublickPay = () => import('@/components/wx-public/wxPublicPay');
const wxPay = () => import('@/components/wx-public/wxPay');



export default [
  {
    path: '/wxPublickPay',
    name: 'wxPublickPay',
    component: wxPublickPay
  },
  {
    path: '/wxPay',
    name: 'wxPay',
    component: wxPay
  }
]
