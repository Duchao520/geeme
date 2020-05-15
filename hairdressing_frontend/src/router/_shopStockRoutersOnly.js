/** 
 * 仅供应链版的门店单独设置的路由及按钮权限
 * 需求调整时需要同步调整以下数据
 **/
const stockRoutersOnly = [
  {
    path: "/shop-inner/staff-add",
    title: "新增员工",
    icon: "",
    show: false,
  },
  {
    path: "/shop-inner/staffRecord",
    title: "员工档案",
    icon: "",
    show: false,
    routes: [{
      path: "/shop-inner/staffRecord/record-introduce",
      title: "基本资料",
      icon: "",
      show: true,
    }],
  },
  {
    path: "/shop-inner/stock",
    title: "库存管理",
    icon: "icon-menu_stock",
    show: true,
    routes: [{
        path: "/shop-inner/stock/stock-product",
        title: "可订产品",
        icon: "",
        show: true,
      },
      {
        path: "/shop-inner/stock/stock-list",
        title: "库存明细",
        icon: "",
        show: true,
      },
      {
        path: "/shop-inner/stock/stock-enter",
        title: "入库管理",
        icon: "",
        show: true,
      },
      {
        path: "/shop-inner/stock/stock-out",
        title: "出库管理",
        icon: "",
        show: true,
      },
      {
        path: "/shop-inner/stock/stock-require",
        title: "门店订货",
        icon: "",
        show: true,
      },
      {
        path: "/shop-inner/stock/stock-statistics",
        title: "统计报表",
        icon: "",
        show: true,
      },
    ],
  },
  {
    path: "/shop-inner/staff",
    title: "员工中心",
    icon: "icon-menu_staff",
    show: true,
    routes: [{
      path: "/shop-inner/staff/staff-list",
      title: "员工列表",
      icon: "",
      show: true,
    }],
  },
  {
    path: "/shop-inner/stock/stock-product-detail",
    title: "库存产品详情",
    icon: "",
    show: false,
  },
  {
    path: "/shop-inner/stock-order-details",
    title: "订货单详情",
    icon: "",
    show: false,
  },
]

const frontFlags = [
  'shop_staff_staffStatus', // 门店-员工中心-员工列表-启用/禁用
  'shop_staff_staffRecord_base_save', // 门店-员工档案-基本资料-保存
]

export {
  stockRoutersOnly,
  frontFlags
}
