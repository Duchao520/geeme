import {
  allComponents
} from './allComponents'
import store from '../store'

// ============ 确保新增路由都有name属性，该属性用于新的路由权限校验！ ============
// ============ 确保新增路由都有name属性，该属性用于新的路由权限校验！ ============
// ============ 确保新增路由都有name属性，该属性用于新的路由权限校验！ ============

const shopRouters = [
  // 新增预约
  {
    path: '/shop-inner/appo-addnew',
    name: '/shop-inner/appo-addnew',
    component: allComponents.AppoAddnew,
    beforeEnter: (to, from, next) => {
      if (from.path === '/shop-inner/console') {
        store.dispatch('saveOperate', {
          clickEnter: 'add'
        }) // 旧的存储
        store.dispatch('setAppoEntry', 'add') // 以后只用这个
      }
      next()
    }
  },
  // 新增拼团 - 营销中心
  {
    path: '/shop-inner/create-group-buying', // new
    name: '/shop-inner/create-group-buying',
    component: allComponents.GroupBuy_create,
  },
  // 服务订单详情
  {
    path: '/shop-inner/service-order-detail',
    name: '/shop-inner/service-order-detail',
    component: allComponents.ServiceAndProductDetailOrder,
  },
  // 产品订单详情
  {
    path: '/shop-inner/product-order-detail',
    name: '/shop-inner/product-order-detail',
    component: allComponents.ServiceAndProductDetailOrder,
  },
  // 卡项订单详情
  {
    path: '/shop-inner/card-order-detail',
    name: '/shop-inner/card-order-detail',
    component: allComponents.CardOrderDetail,
  },
  // 新增会员卡 - 次卡&时间卡
  {
    path: '/shop-inner/add-new-vip-card',
    name: '/shop-inner/add-new-vip-card',
    component: allComponents.AddNewVipCard,
  },
  // 编辑会员卡 - 次卡&时间卡
  {
    path: '/shop-inner/edit-vip-card',
    name: '/shop-inner/edit-vip-card',
    component: allComponents.editVipCard,
  },
  // 商品管理-服务详情
  {
    path: '/shop-inner/service-detail',
    name: '/shop-inner/service-detail',
    component: allComponents.ServiceDetail,
  },
  // 商品管理-产品详情
  {
    path: '/shop-inner/product-detail',
    name: '/shop-inner/product-detail',
    component: allComponents.ProductDetail,
  },
  // 开单 选择开单人
  {
    path: '/shop-inner/choose-person',
    name: '/shop-inner/choose-person',
    component: allComponents.ChoosePerson,
    beforeEnter: (to, from, next) => {
      // - 清理纸单号， 入口太多了 放这里统一处理
      if (from.path !== '/shop-inner/choose-service') {
        // v2重构以后，各入口单独处理
        // store.dispatch('setPaperId', null)
        // 职级id
        // store.dispatch('saveCurrentInfo', {cpLevelId: null})
      }
      // 清理缓存的开单人职级
      next()
    }
  },
  // 开单 选择服务项目
  {
    path: '/shop-inner/choose-service',
    name: '/shop-inner/choose-service',
    component: allComponents.ChooseService,
  },
  //新增提成服务方案 - v2 弃用
  {
    path: '/shop-inner/add-new-commission-plan-service',
    name: '/shop-inner/add-new-commission-plan-service',
    component: allComponents.CommissionService_editPlans,
  },
  // 新增产品提成方案 - v2 弃用
  {
    path: '/shop-inner/add-new-commission-plan-product',
    name: '/shop-inner/add-new-commission-plan-product',
    // component: allComponents.AddNewCommissionPlanProduct, // v1
    component: allComponents.CommissionProduct_editPlans, // v2
  },
  // 新增会员卡提成方案 - v2 弃用
  {
    path: '/shop-inner/add-new-commission-plan-card',
    name: '/shop-inner/add-new-commission-plan-card',
    component: allComponents.AddNewCommissionPlanCard_shop,
  },
  // 新增门店总提成方案 - v2 弃用
  {
    path: '/shop-inner/add-new-commission-plan-store',
    name: '/shop-inner/add-new-commission-plan-store',
    component: allComponents.AddNewCommissionPlanStore,
  },
  //编辑提成方案
  {
    path: '/shop-inner/edit-commission-plan-service',
    name: '/shop-inner/edit-commission-plan-service',
    // component: allComponents.AddNewCommissionPlanService, // v1
    component: allComponents.CommissionService_editPlans, // v2
  },
  // 编辑产品提成方案
  {
    path: '/shop-inner/edit-commission-plan-product',
    name: '/shop-inner/edit-commission-plan-product',
    // component: allComponents.AddNewCommissionPlanProduct, // v1
    component: allComponents.CommissionProduct_editPlans, // v2
  },
  // 编辑卡项提成方案
  {
    path: '/shop-inner/edit-commission-plan-card',
    name: '/shop-inner/edit-commission-plan-card',
    // component: allComponents.AddNewCommissionPlanCard_shop, // v1
    component: allComponents.CommissionCard_editPlans, // v2
  },
  // 编辑门店提成方案 - v2 弃用
  {
    path: '/shop-inner/edit-commission-plan-store',
    name: '/shop-inner/edit-commission-plan-store',
    component: allComponents.AddNewCommissionPlanStore,
  },

   // 授权支付宝
   {
    path: "/shop-inner/auth-ali-pay",
    name: "/shop-inner/auth-ali-pay",
    component: allComponents.AliPay,
    beforeEnter: (to, from, next) => {
      // 如果缓存的id对不上 或者 展示的id（authUrl）为空, 视为非法访问
      let currentInfo = store.state.manage.currentInfo
      let alipay = store.state.payTypesAuth.aliPay
      if (currentInfo.brandId === alipay.brandId && alipay.authUrl) {
        next()
      } else {
        next({
          path: '/center/brands'
        })
      }
    }
  },
  // 申请开通支付宝
  {
    path: "/shop-inner/ali-pay-info",
    name: "/shop-inner/ali-pay-info",
    component: allComponents.AliPayInfo,
  },
  // 申请开通支付宝
  {
    path: "/shop-inner/ali-pay-detail",
    name: "/shop-inner/ali-pay-detail",
    component: allComponents.alipayInfoDetail,
  },
  // 申请开通微信支付账号
  {
    path: "/shop-inner/open-up-pay",
    name: "/shop-inner/open-up-pay",
    component: allComponents.OpenUpPay
  },
  // 微信支付账号 - 详情
  {
    path: "/shop-inner/wechat-pay-detail",
    name: "/shop-inner/wechat-pay-detail",
    component: allComponents.wechatDetail
  },


  // - 库存产品 详情
  {
    path: '/shop-inner/stock/stock-product-detail/:id',
    name: '/shop-inner/stock/stock-product-detail',
    component: allComponents.prodDetail,
  },
  // - 库存 订货单详情
  {
    path: '/shop-inner/stock-order-details',
    name: '/shop-inner/stock-order-details',
    component: allComponents.detailsInAllSteps,
  },
  // 员工档案
  {
    path: '/shop-inner/staffRecord/:staffId/:userId/:jobType',
    name: '/shop-inner/staffRecord',
    component: allComponents.StaffRecord,
    children: [{
        path: '/shop-inner/staffRecord/:staffId/:userId/:jobType/record-introduce',
        name: '/shop-inner/staffRecord/record-introduce',
        component: allComponents.shopStaffAdd
      },
      {
        path: '/shop-inner/staffRecord/:staffId/:userId/:jobType/record-archives',
        name: '/shop-inner/staffRecord/record-archives',
        component: allComponents.RecordArchives
      },
      {
        path: '/shop-inner/staffRecord/:staffId/:userId/:jobType/record-dynamic',
        name: '/shop-inner/staffRecord/record-dynamic',
        component: allComponents.RecordDynamic
      },
      {
        path: '/shop-inner/staffRecord/:staffId/:userId/:jobType/record-rate',
        name: '/shop-inner/staffRecord/record-rate',
        component: allComponents.RecordRate
      },
      {
        path: '/shop-inner/staffRecord/:staffId/:userId/:jobType/record-service',
        name: '/shop-inner/staffRecord/record-service',
        component: allComponents.RecordService
      }
    ],
    redirect: '/shop-inner/staffRecord/:staffId/:userId/:jobType/record-introduce'
  },
  // 客户档案
  {
    path: '/shop-inner/customerRecord/:id',
    name: '/shop-inner/customerRecord',
    component: allComponents.CustomerRecord,
    children: [{
        path: '/shop-inner/customerRecord/:id/beauty-record',
        name: '/shop-inner/customerRecord/beauty-record',
        component: allComponents.BeautyRecord
      },
      {
        path: '/shop-inner/customerRecord/:id/customer-remark',
        name: '/shop-inner/customerRecord/customer-remark',
        component: allComponents.customerRemark
      },
      {
        path: '/shop-inner/customerRecord/:id/record-history',
        name: '/shop-inner/customerRecord/record-history',
        component: allComponents.RecordHistory
      },
      {
        path: '/shop-inner/customerRecord/:id/vip-card',
        name: '/shop-inner/customerRecord/vip-card',
        component: allComponents.VipCard
      },
      { // 权益金
        path: '/shop-inner/customerRecord/:id/equity-money',
        name: '/shop-inner/customerRecord/equity-money',
        component: allComponents.equitymoney
      },
      {
        path: '/shop-inner/customerRecord/:id/red-packet',
        name: '/shop-inner/customerRecord/red-packet',
        component: allComponents.Redpacket
      },
      {
        path: '/shop-inner/customerRecord/:id/coupons',
        name: '/shop-inner/customerRecord/coupons',
        component: allComponents.Coupons
      },
      {
        path: '/shop-inner/customerRecord/:id/growth-history',
        name: '/shop-inner/customerRecord/growth-history',
        component: allComponents.GrowthHistory
      },
      {
        path: '/shop-inner/customerRecord/:id/point-history',
        name: '/shop-inner/customerRecord/point-history',
        component: allComponents.pointHistory
      },
    ],
    redirect: '/shop-inner/customerRecord/:id/beauty-record'
  },
  // 新增员工
  {
    path: '/shop-inner/staff-add',
    name: '/shop-inner/staff-add',
    component: allComponents.shopStaffAdd,
  },
  // 新增服务
  {
    path: '/shop-inner/service-add',
    name: '/shop-inner/service-add',
    // component: allComponents.ServiceAdd,
    component: allComponents.ServiceAddOrEdit,
  },
  // 编辑服务
  {
    path: '/shop-inner/service-edit',
    name: '/shop-inner/service-edit',
    // component: allComponents.ServiceAdd,
    component: allComponents.ServiceAddOrEdit,
  },
  // 新增产品
  {
    path: '/shop-inner/product-add',
    name: '/shop-inner/product-add',
    component: allComponents.productAdd,
  },
  // 编辑产品
  {
    path: '/shop-inner/product-edit',
    name: '/shop-inner/product-edit',
    component: allComponents.productAdd,
  },
  // 会员卡详情
  {
    path: '/shop-inner/vip-card-details',
    name: '/shop-inner/vip-card-details',
    component: allComponents.vipCardDetails,
  },
  // 作品动态详情(门店所有员工)
  {
    path: '/shop-inner/dynamic-work-detail',
    name: '/shop-inner/dynamic-work-detail',
    component: allComponents.DynamicWorkDetail,
  },
  // 新人体验价 - 新增
  {
    path: '/shop-inner/new-user-price/add',
    name: '/shop-inner/new-user-price/add',
    component: allComponents.changeNewUserPrice,
  },
  // 新人体验价 - 详情
  {
    path: '/shop-inner/new-user-price/detail',
    name: '/shop-inner/new-user-price/detail',
    component: allComponents.changeNewUserPrice,
  },
  // 美物拼团 - 详情
  {
    path: '/shop-inner/group-buying-detail',
    name: '/shop-inner/group-buying-detail',
    component: allComponents.GroupBuy_deltai,
  },
  // 美物拼团 - 重新上线
  {
    path: '/shop-inner/reset-group-buying',
    name: '/shop-inner/reset-group-buying',
    component: allComponents.GroupBuy_online,
  },
  // 推广返佣 - 推客详情
  {
    path: '/shop-inner/promotion-commission/propagandist-detail/:id',
    name: '/shop-inner/promotion-commission/propagandist-detail',
    component: allComponents.sellerDetail,
  },
  // 推广返佣 - 新增商品
  {
    path: '/shop-inner/promotion-commission/goods-add',
    name: '/shop-inner/promotion-commission/goods-add',
    component: allComponents.createGoods,
  },
  // 礼品卡 - 新增活动
  {
    path: '/shop-inner/gift-vip-card-add',
    name: '/shop-inner/gift-vip-card-add',
    component: allComponents.createGiftActivity,
  },
  // 礼品卡 - 活动详情
  {
    path: '/shop-inner/gift-vip-card-detail',
    name: '/shop-inner/gift-vip-card-detail',
    component: allComponents.createGiftActivity,
  },
  // 股东分红 - 股东详情
  {
    path: '/shop-inner/market/market-list/shareholder-detail',
    name: '/shop-inner/market/market-list/shareholder-detail',
    component: allComponents.shareholderDetail,
  },
  // 股东分红 - 交易记录详情
  {
    path: '/shop-inner/market/market-list/transaction-record',
    name: '/shop-inner/market/market-list/transaction-record',
    component: allComponents.transactionRecord,
  },
  // 广告专题 - 发布广告
  {
    path: '/shop-inner/ad-project-add',
    name: '/shop-inner/ad-project-add',
    component: allComponents.advertising,
  },
  // 广告专题 - 编辑广告
  {
    path: '/shop-inner/ad-project-edit',
    name: '/shop-inner/ad-project-edit',
    component: allComponents.advertising,
  },
  // 广告专题 - 广告详情
  {
    path: '/shop-inner/ad-project-detail',
    name: '/shop-inner/ad-project-detail',
    component: allComponents.advertising,
  },
  //店铺管理中心
  {
    path: '/shop-inner/shopNavBar',
    name: '/shop-inner/shopNavBar',
    component: allComponents.shopNavBar,
    children: [
      // 操作台
      {
        path: '/shop-inner/console',
        name: '/shop-inner/console',
        component: allComponents.shopConsole
      },
      //  收款台
      {
        path: '/shop-inner/cashier-dask',
        name: '/shop-inner/cashier-dask',
        component: allComponents.Cashier,
        children: [{
            path: '/shop-inner/cashier-dask/cashier-list',
            name: '/shop-inner/cashier-dask/cashier-list',
            component: allComponents.CashierList,
            beforeEnter: (to, from, next) => {
              // 职级id
              store.dispatch('saveCurrentInfo', {cpLevelId: null})
              // 清理缓存的开单人职级
              next()
            }
          },
          // 开支记录
          {
            path: '/shop-inner/cashier-dask/spend-record',
            name: '/shop-inner/cashier-dask/spend-record',
            component: allComponents.SpendRecord
          },
          // 钱包 - 充值提现
          {
            path: '/shop-inner/cashier-dask/wallet',
            name: '/shop-inner/cashier-dask/wallet',
            component: allComponents.Wallet
          },
          // 商城统计
          {
            path: '/shop-inner/cashier-dask/mall-statistics',
            name: '/shop-inner/cashier-dask/mall-statistics',
            component: allComponents.mallStatistics
          },
          // 权益金
          {
            path: '/shop-inner/cashier-dask/equity-money',
            name: '/shop-inner/cashier-dask/equity-money',
            component: allComponents.equityMoney
          },
        ],
      },
      // 预约管理
      {
        path: '/shop-inner/appo',
        name: '/shop-inner/appo',
        component: allComponents.AppoIndex,
        children: [{
            path: '/shop-inner/appo/appo-time',
            name: '/shop-inner/appo/appo-time',
            component: allComponents.AppoTime
          },
          {
            path: '/shop-inner/appo/appo-list',
            name: '/shop-inner/appo/appo-list',
            component: allComponents.AppoList
          }

        ],
      },
      // 订单
      {
        path: '/shop-inner/order',
        name: '/shop-inner/order',
        component: allComponents.OrderIndex,
        children: [
          /* {
            path: '/shop-inner/order/cashier-order',
            name: '/shop-inner/order/cashier-order',
            component: allComponents.Cashier,
            children: [
              {
                path: '/shop-inner/order/cashier-order/cashierList',
                name: '/shop-inner/order/cashier-order/cashierList',
                component: allComponents.CashierList
              }, {
                path: '/shop-inner/order/cashier-order/cashierRecycle',
                name: '/shop-inner/order/cashier-order/cashierRecycle',
                component: allComponents.CashierRecycle
              }
            ],
          }, */
          {
            path: '/shop-inner/order/service-order',
            name: '/shop-inner/order/service-order',
            component: allComponents.ServiceOrder,
          },
          {
            path: '/shop-inner/order/product-order',
            name: '/shop-inner/order/product-order',
            component: allComponents.ProductOrder,
          },
          {
            path: '/shop-inner/order/card-order',
            name: '/shop-inner/order/card-order',
            component: allComponents.CardOrder,
          },
        ],
      },
      // 客户中心
      {
        path: '/shop-inner/customer',
        name: '/shop-inner/customer',
        component: allComponents.CustomerIndex,
        children: [{
            path: '/shop-inner/customer/customer-list',
            name: '/shop-inner/customer/customer-list',
            component: allComponents.CustomerList
          },
          // 会员卡
          {
            path: '/shop-inner/customer/vip-cards',
            name: '/shop-inner/customer/vip-cards',
            component: allComponents.soldedVipCards
          },
          {
            path: '/shop-inner/customer/birthday-greetings', // 生日问候
            name: '/shop-inner/customer/birthday-greetings', // 生日问候
            component: allComponents.emptyPage
          },
          {
            path: '/shop-inner/customer/loss-warning', // 流失预警
            name: '/shop-inner/customer/loss-warning', // 流失预警
            component: allComponents.emptyPage
          },
          {
            path: '/shop-inner/customer/complaint-management', // 投诉管理 // title改成 意见反馈
            name: '/shop-inner/customer/complaint-management', // 投诉管理 // title改成 意见反馈
            component: allComponents.emptyPage
          },
          // {
          //   path: '/shop-inner/customer/customer-analysis',  // 客户分析 // 1.0 不做
          //   name: '/shop-inner/customer/customer-analysis',
          //   component: allComponents.emptyPage
          // },
          // {
          //   path: '/shop-inner/customer/customer-import',  // 客户导入 // 1.0 不做
          //   name: '/shop-inner/customer/customer-import',  // 客户导入 // 1.0 不做
          //   component: allComponents.emptyPage
          // },
        ],
      },

      // 员工中心
      {
        path: '/shop-inner/staff',
        name: '/shop-inner/staff',
        component: allComponents.StaffIndex,
        children: [{
            path: '/shop-inner/staff/staff-list',
            name: '/shop-inner/staff/staff-list',
            component: allComponents.StaffList
          },
          {
            path: '/shop-inner/staff/staff-recycle',
            name: '/shop-inner/staff/staff-recycle',
            component: allComponents.StaffRecycle
          },
          {
            path: '/shop-inner/staff/performance-salary', // 业绩薪酬
            name: '/shop-inner/staff/performance-salary', // 业绩薪酬
            component: allComponents.PerformanceSalary
          },
          {
            path: '/shop-inner/staff/work-dynamic', // 作品动态
            name: '/shop-inner/staff/work-dynamic', // 作品动态
            component: allComponents.DynamicWork
          },

          // {
          //   path: '/shop-inner/staff/attendance-manage', // 考勤管理 // 1.0 不做
          //   name: '/shop-inner/staff/attendance-manage', // 考勤管理 // 1.0 不做
          //   component: allComponents.emptyPage
          // },
          // {
          //   path: '/shop-inner/staff/learning-management',  // 学习管理 // 1.0 不做
          //   name: '/shop-inner/staff/learning-management',  // 学习管理 // 1.0 不做
          //   component: allComponents.emptyPage
          // },
          // {
          //   path: '/shop-inner/staff/companies-inform', // 企业通知 // 1.0 不做
          //   name: '/shop-inner/staff/companies-inform', // 企业通知 // 1.0 不做
          //   component: allComponents.emptyPage
          // },
        ],
      },
      //商品管理
      {
        path: '/shop-inner/goods',
        name: '/shop-inner/goods',
        component: allComponents.GoodsIndex,
        children: [{
            path: '/shop-inner/goods/service-list', // 服务管理 // 1.0 门店端
            name: '/shop-inner/goods/service-list', // 服务管理 // 1.0 门店端
            component: allComponents.ServiceManageList
          },
          {
            path: '/shop-inner/goods/product-list', // 产品管理 // 1.0 门店端
            name: '/shop-inner/goods/product-list', // 产品管理 // 1.0 门店端
            component: allComponents.ProductManageList
          },
          {
            path: '/shop-inner/goods/card-list', // 卡项管理 // 1.0 门店端 // 无新增和编辑
            name: '/shop-inner/goods/card-list', // 卡项管理 // 1.0 门店端 // 无新增和编辑
            component: allComponents.CardList
          },
          {
            path: '/shop-inner/goods/integral-store', // 积分商城 // 1.0取消
            name: '/shop-inner/goods/integral-store', // 积分商城 // 1.0取消
            component: allComponents.emptyPage
          },
          {
            path: '/shop-inner/goods/goods-import', // 产品导入
            name: '/shop-inner/goods/goods-import',
            component: allComponents.importGoods
          },
        ],
      },

      //营销中心
      {
        path: '/shop-inner/market',
        name: '/shop-inner/market',
        component: allComponents.MarketIndex,
        children: [{
            path: '/shop-inner/market/market-list',
            name: '/shop-inner/market/market-list',
            component: allComponents.MarketRegionIndex,
            children: [{
                path: '/shop-inner/market/market-list/index',
                name: '/shop-inner/market/market-list/index',
                component: allComponents.MarketRegion
              },
              {
                path: '/shop-inner/market/market-list/group-buying', //  团购
                name: '/shop-inner/market/market-list/group-buying',
                component: allComponents.GroupBuy,
                meta: {
                  parentTitle: '营销应用'
                }, // 焦点补救
              },
              {
                path: '/shop-inner/market/market-list/coupon-index', // 优惠券
                name: '/shop-inner/market/market-list/coupon-index',
                component: allComponents.eCoupon,
                meta: {
                  parentTitle: '营销应用'
                }, // 焦点补救
              },
              {
                path: '/shop-inner/market/market-list/new-user-price', // 新人体验价
                name: '/shop-inner/market/market-list/new-user-price',
                component: allComponents.newUserPrice,
                meta: {
                  parentTitle: '营销应用'
                }, // 焦点补救
              },
              {
                path: '/shop-inner/market/market-list/promotion-commission', // 推广返佣
                name: '/shop-inner/market/market-list/promotion-commission',
                component: allComponents.seller,
                meta: {
                  parentTitle: '营销应用'
                }, // 焦点补救
              },
              {
                path: '/shop-inner/market/market-list/gift-vip-card', // 礼品卡
                name: '/shop-inner/market/market-list/gift-vip-card',
                component: allComponents.giftCard,
                meta: {
                  parentTitle: '营销应用'
                }, // 焦点补救
              },
              {
                path: '/shop-inner/market/market-list/shareholder-profit', // 股东分红
                name: '/shop-inner/market/market-list/shareholder-profit',
                component: allComponents.shareholderProfit,
                meta: {
                  parentTitle: '营销应用'
                }, // 焦点补救
              },
            ],
          },
          {
            path: '/shop-inner/market/ad-project', // 广告专题
            name: '/shop-inner/market/ad-project',
            component: allComponents.adProject
          },
          // 以下1.0不做，但是保留导航栏
          /* {
            path: '/shop-inner/market/market-campaign', // 营销活动
            name: '/shop-inner/market/market-campaign',
            component: allComponents.emptyPage
          },
          {
            path: '/shop-inner/market/creative-posters', // 创意海报
            name: '/shop-inner/market/creative-posters',
            component: allComponents.emptyPage
          },
          {
            path: '/shop-inner/market/invite-friend', // 邀请好友
            name: '/shop-inner/market/invite-friend',
            component: allComponents.emptyPage
          },
          {
            path: '/shop-inner/market/promotion-rebate', // 推广返利
            name: '/shop-inner/market/promotion-rebate',
            component: allComponents.emptyPage
          }, */
        ],
      },

      //库存管理 //-供应链版的路由要额外配置!! [_shopStockRoutersOnly.js] -//
      {
        path: '/shop-inner/stock',
        name: '/shop-inner/stock',
        component: allComponents.newStockIndex,
        children: [
          {
            path: '/shop-inner/stock/stock-product',
            name: '/shop-inner/stock/stock-product',
            component: allComponents.newStockProduct
          },
          {
            path: '/shop-inner/stock/stock-list',
            name: '/shop-inner/stock/stock-list',
            component: allComponents.newStockList
          },
          {
            path: '/shop-inner/stock/stock-enter',
            name: '/shop-inner/stock/stock-enter',
            component: allComponents.newStockEnter
          },
          {
            path: '/shop-inner/stock/stock-out',
            name: '/shop-inner/stock/stock-out',
            component: allComponents.newStockOut
          },
          {
            path: '/shop-inner/stock/stock-require',
            name: '/shop-inner/stock/stock-require',
            component: allComponents.newStockRequire
          },
          {
            path: '/shop-inner/stock/stock-statistics',
            name: '/shop-inner/stock/stock-statistics',
            component: allComponents.stockStatistics
          },
          {
            path: '/shop-inner/stock/stock-transfers',
            name: '/shop-inner/stock/stock-transfers',
            component: allComponents.StockTransfers
          },
          {
            path: '/shop-inner/stock/stock-supplier',
            name: '/shop-inner/stock/stock-supplier',
            component: allComponents.StockSupplier
          }
        ],
      },

      // 供应市场 // 1.0不做，但是演示期保留导航栏
      {
        path: '/shop-inner/supply',
        name: '/shop-inner/supply',
        component: allComponents.SupplyIndex,
        children: [
          {
            path: '/shop-inner/supply/supply-list',
            name: '/shop-inner/supply/supply-list',
            component: allComponents.SupplyList
          },
          {
            path: '/shop-inner/supply/hair-care', // 美发产品
            name: '/shop-inner/supply/hair-care', // 美发产品
            component: allComponents.HairCare
          },
          {
            path: '/shop-inner/supply/excellent-course', // 精品课程
            name: '/shop-inner/supply/excellent-course', // 精品课程
            component: allComponents.ExcellentCourse
          },
          {
            path: '/shop-inner/supply/medical-beauty', // 医美整形
            name: '/shop-inner/supply/medical-beauty', // 医美整形
            component: allComponents.MedicalBeauty
          },
          {
            path: '/shop-inner/supply/geeme-shop', // 及美优选
            name: '/shop-inner/supply/geeme-shop', // 及美优选
            component: allComponents.GeemeShop
          },
          {
            path: '/shop-inner/supply/city-service', // 同城服务
            name: '/shop-inner/supply/city-service', // 同城服务
            component: allComponents.CityService
          },
          {
            path: '/shop-inner/supply/collect', // 收藏
            name: '/shop-inner/supply/collect', // 收藏
            component: allComponents.Collect
          },
          {
            path: '/shop-inner/supply/bill', // 账单
            name: '/shop-inner/supply/bill', // 账单
            component: allComponents.emptyPage
          },
        ],
      },

      //数据统计
      {
        path: '/shop-inner/dataCenter',
        name: '/shop-inner/dataCenter',
        component: allComponents.CountIndex,
        children: [
          {
            path: '/shop-inner/dataCenter/overview',
            name: '/shop-inner/dataCenter/overview',
            component: allComponents.CountList
          },
          {
            path: '/shop-inner/dataCenter/business-data',
            name: '/shop-inner/dataCenter/business-data',
            component: allComponents.CountBusiness
          },
          // 客户数据
          // 员工数据
          {
            path: '/shop-inner/dataCenter/staff-data',
            name: '/shop-inner/dataCenter/staff-data',
            component: allComponents.cm_staffIndex,
          },
          // 财务报表
          {
            path: '/shop-inner/dataCenter/financial-statement',
            name: '/shop-inner/dataCenter/financial-statement',
            component: allComponents.cm_financialIndex,
          },
        ],
      },
      // 店铺管理
      {
        path: '/shop-inner/store',
        name: '/shop-inner/store',
        component: allComponents.ShopIndex,
        children: [
          {
            path: '/shop-inner/store/info',
            name: '/shop-inner/store/info',
            component: allComponents.ShopDecorate,
            children: [{
                path: '/shop-inner/store/info/basic-info',
                name: '/shop-inner/store/info/basic-info',
                component: allComponents.BasicInfo
              },
              // {
              //   path: '/shop-inner/store/info/voerall-style',  // 总体风格 // 1.0不做
              //   name: '/shop-inner/store/info/voerall-style',
              //   component: allComponents.emptyPage
              // },
              // {
              //   path: '/shop-inner/store/info/navigator-set',  // 导航设置 // 1.0不做
              //   name: '/shop-inner/store/info/navigator-set',
              //   component: allComponents.emptyPage
              // },
              // {
              //   path: '/shop-inner/store/info/senior-customization', // 高级定制 // 1.0不做
              //   component: allComponents.emptyPage
              // },
              // {
              //   path: '/shop-inner/store/info/share-link',  // 分享链接 // 1.0不做
              //   name: '/shop-inner/store/info/share-link',
              //   component: allComponents.emptyPage
              // }
            ],
          },
          {
            path: '/shop-inner/store/assets-management', // 资产管理
            name: '/shop-inner/store/assets-management', // 资产管理
            component: allComponents.emptyPage
          },
          // {
          //   path: '/shop-inner/store/operation-tools', // 运营工具
          //   name: '/shop-inner/store/operation-tools', // 运营工具
          //   component: allComponents.emptyPage
          // },
          // {
          //   path: '/shop-inner/store/operating-recard', // 操作记录
          //   name: '/shop-inner/store/operating-recard', // 操作记录
          //   component: allComponents.emptyPage
          // },
          // {
          //   path: '/shop-inner/store/organization-chart', // 组织架构 // 1.0变更需求?
          //   name: '/shop-inner/store/organization-chart', // 组织架构 // 1.0变更需求?
          //   component: allComponents.emptyPage
          // },
          // {
          //   path: '/shop-inner/store/software-order', // 软件订购 // 1.0变更需求?
          //   name: '/shop-inner/store/software-order', // 软件订购 // 1.0变更需求?
          //   component: allComponents.emptyPage
          // },
        ],
      },
      // 设置中心
      {
        path: '/shop-inner/setting',
        name: '/shop-inner/setting',
        component: allComponents.SetIndex,
        children: [
          {
            path: '/shop-inner/setting/appoint-set', // 预约设置及排班设置  仅门店
            name: '/shop-inner/setting/appoint-set', // 预约设置及排班设置  仅门店
            component: allComponents.AppointSet,
            children: [
              {
                path: '/shop-inner/setting/appoint-set/quick-set',
                name: '/shop-inner/setting/appoint-set/quick-set',
                component: allComponents.QuickSet
              },
              {
                path: '/shop-inner/setting/appoint-set/schedule-set',
                name: '/shop-inner/setting/appoint-set/schedule-set',
                component: allComponents.ScheduleSet
              },
              {
                path: '/shop-inner/setting/appoint-set/senior-set',
                name: '/shop-inner/setting/appoint-set/senior-set',
                component: allComponents.emptyPage
              },
            ],
          },
          {
            path: '/shop-inner/setting/bussiness-set', // 交易设置 总部授权页面  门店也有
            name: '/shop-inner/setting/bussiness-set', // 交易设置 总部授权页面  门店也有
            component: allComponents.BusinessSet,
            children: [
              {
                path: '/shop-inner/setting/bussiness-set/basic',
                name: '/shop-inner/setting/bussiness-set/basic',
                component: allComponents.BusinessBasic
              },
              {
                path: '/shop-inner/setting/bussiness-set/receive-account',
                name: '/shop-inner/setting/bussiness-set/receive-account',
                component: allComponents.ReceiveAccount
              }
            ],
          },
          {
            path: '/shop-inner/setting/commission-set', // 提成设置 总部授权页面 门店可能没有部分页面
            name: '/shop-inner/setting/commission-set', // 提成设置 总部授权页面 门店可能没有部分页面
            // component: allComponents.CommissionSet, // v1
            component: allComponents.CommissionIndex, // v2
            children: [
              {
                path: '/shop-inner/setting/commission-set/basic-set',
                name: '/shop-inner/setting/commission-set/basic-set',
                component: allComponents.CommissionBasicSet
              },
              {
                path: '/shop-inner/setting/commission-set/service-set',
                name: '/shop-inner/setting/commission-set/service-set',
                // component: allComponents.CommissionServiceSet // v1
                component: allComponents.CommissionServiceList // v1
              },
              {
                path: '/shop-inner/setting/commission-set/product-set',
                name: '/shop-inner/setting/commission-set/product-set',
                // component: allComponents.CommissionProductSet // v1
                component: allComponents.CommissionProductList // v2
              },
              {
                path: '/shop-inner/setting/commission-set/cards-set',
                name: '/shop-inner/setting/commission-set/cards-set',
                // component: allComponents.CommissionCardsSet_shop // v1
                component: allComponents.CommissionCardList // v1
              },
              {
                path: '/shop-inner/setting/commission-set/shops-set',
                name: '/shop-inner/setting/commission-set/shops-set',
                component: allComponents.CommissionShopsSet
              },
              {
                path: '/shop-inner/setting/commission-set/staff-set',
                name: '/shop-inner/setting/commission-set/staff-set',
                component: allComponents.CommissionStaffSet
              },
            ],
          },
          {
            path: '/shop-inner/setting/global-set', // 全局设置
            name: '/shop-inner/setting/global-set',
            component: allComponents.GlobalSet,
            children: [
              {
              path: '/shop-inner/setting/global-set/common-set',
              name: '/shop-inner/setting/global-set/common-set',
              component: allComponents.CommonSet_shop
            }, ]
          },
          {
            path: '/shop-inner/setting/organization', // 组织架构
            name: '/shop-inner/setting/organization',
            component: allComponents.Organization,
            children: [
              {
              path: '/shop-inner/setting/organization/job-set', // 职务管理
              name: '/shop-inner/setting/organization/job-set',
              component: allComponents.Organization_jobset
            }, ]
          },
        ],
      }
    ],
  },
]
export {
  shopRouters
}
