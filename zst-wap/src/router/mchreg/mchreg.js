const mchpar = () => import('@/components/mchreg/mchpar');
const merchantPar = () => import('@/components/mchreg/merchantPar');
const searchProgress = () => import('@/components/mchreg/searchProgress');
const queryResult = () => import('@/components/mchreg/queryResult');
const EnterType = () => import('@/components/mchreg/EnterType');

export default [
  {
    name: 'mchpar',
    path: '/mchpar',
    component: mchpar
  },
  {
    name: 'merchantPar',
    path: '/merchantPar',
    component: merchantPar
  },
  {
    name: 'searchProgress',
    path: '/searchProgress',
    component: searchProgress
  },
  {
    name: 'queryResult',
    path: '/queryResult',
    component: queryResult
  },
  {
    name: 'EnterType',
    path: '/EnterType',
    component: EnterType
  }
]
