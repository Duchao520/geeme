let state = {
  flatAuths: [], // 全部权限 1维
  btnAuths: [], // 全部按钮权限 1维
  currentAuth: [], // 当前激活的权限（品牌或门店）
  currentEntry: '', // 记录当前入口是门店还是品牌 (shop || brand) => (shop-inner || brand-innner)
  currentEntryNav: {
    ROUTER_TABS: {}, // 主导航栏页面 二级导航（内嵌页面）
    ROUTER_3rd_Nav: {}, // 3级导航
    ROUTER_SUB_TABS: {}, // 独立页面的顶部导航（伪1级）seedHeader 组件
    ROUTER_Nav_Bars: {}, // 一级路由
  },
  comparisonBrandId: null, // 比对品牌id,用于解决多标签问题,不要随便往这里存!!!
}
export default state;