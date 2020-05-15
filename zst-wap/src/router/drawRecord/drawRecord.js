const drawType = () => import('@/components/drawRecord/drawType');
const converRecord = () => import('@/components/drawRecord/converRecord');
const purHistory = () => import('@/components/drawRecord/purHistory');
const purDetail = () => import('@/components/drawRecord/purDetail');

export default [
    /*抽奖记录*/
    {
        path: '/drawType',
        name: 'drawType',
        component: drawType,
    },
    //话呗对换区抽奖记录
    {
        path: '/converRecord',
        name: 'converRecord',
        component: converRecord,
    },
    {
        path: '/purHistory',
        name: 'purHistory',
        component: purHistory,
        meta: {
          keepAlive: true // 需要被缓存
        }
    },
    {
        path: '/purDetail',
        name: 'purDetail',
        component: purDetail,
        meta: {
          keepAlive: true // 需要被缓存
        }
    }
]
