const proShowIndex = () => import ('@/components/proShow/index');
const report = () => import ('@/components/proShow/report');
const mineShowList = () => import ('@/components/proShow/mineShowsList');
const newProshowsList = () => import ('@/components/proShow/newProshowsList');
const proShowsDetails = () => import ('@/components/proShow/proShowsDetails');
const taskDetails = () => import  ('@/components/proShow/taskModule/taskDetails');
const bountyDetail = () => import ('@/components/proShow/taskModule/bountyDetail');
const buyStart = () => import ('@/components/proShow/buyPosModule/buyStart');
const buyFinish = () => import ('@/components/proShow/buyPosModule/buyFinish');
const allTaskShow = () => import('@/components/proShow/allTaskShow');

/*产品秀界面*/
export default [
    {
        path: '/proShowIndex',
        name: 'proShowIndex',
        component: proShowIndex
    },
    {
        path: '/mineShowList',
        name: 'mineShowList',
        component: mineShowList
    },
    {
        path: '/newProshowsList',
        name: 'newProshowsList',
        component: newProshowsList
    },
    {
        path: '/proShowsDetails',
        name: 'proShowsDetails',
        component: proShowsDetails
    },
    {
        path: '/taskDetails',
        name: 'taskDetails',
        component: taskDetails
    },
    {
        path: '/bountyDetail',
        name: 'bountyDetail',
        component: bountyDetail
    },
    {
        path: '/buyStart',
        name: 'buyStart',
        component: buyStart
    },
    {
        path: '/buyFinish',
        name: 'buyFinish',
        component: buyFinish
    },
    {
        path: '/report',
        name: 'report',
        component: report
    },
    {
        path: '/allTaskShow',
        name: 'allTaskShow',
        component: allTaskShow
    }
]