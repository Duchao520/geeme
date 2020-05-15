const couponCourse = () => import('@/components/rules/couponCourse');
const recruitStrategy = () => import ('@/components/rules/recruitStrategy');
const merchantCourse = () => import ('@/components/rules/merchantCourse');
const merchantAccess = () => import ('@/components/rules/merchantAccess');
const bargainRules = () => import ('@/components/rules/bargainRules');


export default [
  {
    path: '/couponCourse',
    name: 'couponCourse',
    component: couponCourse
  },
  {
    path: '/recruitStrategy',
    name: 'recruitStrategy',
    component: recruitStrategy
  },
  {
    path: '/merchantCourse',
    name: 'merchantCourse',
    component: merchantCourse
  },
  {
    path: '/merchantAccess',
    name: 'merchantAccess',
    component: merchantAccess
  },
  {
    path: '/bargainRules',
    name: 'bargainRules',
    component: bargainRules
  }
]
