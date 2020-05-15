const taobaoToken = () => import ('@/components/taobao/taobaoToken');
const approveSuccess = () => import ('@/components/taobao/approveSuccess');
const approveTeach = () => import ('@/components/taobao/approveTeach');
const comTeach = () => import ('@/components/taobao/comTeach');

/*淘宝相关*/
export default [
  {
    path: '/taobaoToken',
    name: 'taobaoToken',
    component: taobaoToken
  },
  {
    path: '/approveSuccess',
    name: 'approveSuccess',
    component: approveSuccess
  },
  {
    path: '/approveTeach',
    name: 'approveTeach',
    component: approveTeach
  },
  {
    path: '/comTeach',
    name: 'comTeach',
    component: comTeach
  }
]
