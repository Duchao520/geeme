const deposit = () => import('@/components/auditModule/deposit');
const merchant = () => import('@/components/auditModule/merchant');
const depositList = () => import('@/components/auditModule/depositList');
const earnList = () => import('@/components/auditModule/earnList');
const earnDetail = () => import('@/components/auditModule/earnDetail');
const merchantAudit = () => import('@/components/auditModule/merchantAudit');

/*审核模块*/
export default [
  //提现审核
  {
    path: '/deposit',
    name: 'deposit',
    component: deposit
  },
  //商家审核
  {
    path: '/merchant',
    name: 'merchant',
    component: merchant
  },
  //提现明细列表
  {
    path: '/depositList',
    name: 'depositList',
    component: depositList
  },
  //收益明细列表
  {
    path: '/earnList',
    name: 'earnList',
    component: earnList
  },
  //收益详情
  {
    path: '/earnDetail',
    name: 'earnDetail',
    component: earnDetail
  },
  //商家资料审核
  {
    path: '/merchantAudit',
    name: 'merchantAudit',
    component: merchantAudit
  }
]
