import {
  allComponents
} from './allComponents'
import store from '../store'
// ============ 确保新增路由都有name属性，该属性用于新的路由权限校验！ ============
// ============ 确保新增路由都有name属性，该属性用于新的路由权限校验！ ============
// ============ 确保新增路由都有name属性，该属性用于新的路由权限校验！ ============

const brandRouters = [
  //新增提成方案 // 品牌+门店
  {
    path: '/brand-inner/add-new-commission-plan-service',
    name: '/brand-inner/add-new-commission-plan-service',
    component: allComponents.AddNewCommissionPlanService,
  },
  // 新增产品提成方案
  {
    path: '/brand-inner/add-new-commission-plan-product',
    name: '/brand-inner/add-new-commission-plan-product',
    component: allComponents.AddNewCommissionPlanProduct,
  },
  // 新增卡项提成方案
  {
    path: '/brand-inner/add-new-commission-plan-card',
    name: '/brand-inner/add-new-commission-plan-card',
    component: allComponents.AddNewCommissionPlanCard,
  },
  // 新增门店提成方案
  {
    path: '/brand-inner/add-new-commission-plan-store',
    name: '/brand-inner/add-new-commission-plan-store',
    component: allComponents.AddNewCommissionPlanStore,
  },
  //编辑提成方案 // 品牌+门店
  {
    path: '/brand-inner/edit-commission-plan-service',
    name: '/brand-inner/edit-commission-plan-service',
    component: allComponents.AddNewCommissionPlanService,
  },
  // 编辑产品提成方案
  {
    path: '/brand-inner/edit-commission-plan-product',
    name: '/brand-inner/edit-commission-plan-product',
    component: allComponents.AddNewCommissionPlanProduct,
  },
  // 编辑卡项提成方案
  {
    path: '/brand-inner/edit-commission-plan-card',
    name: '/brand-inner/edit-commission-plan-card',
    component: allComponents.AddNewCommissionPlanCard,
  },
  // 编辑门店提成方案
  {
    path: '/brand-inner/edit-commission-plan-store',
    name: '/brand-inner/edit-commission-plan-store',
    component: allComponents.AddNewCommissionPlanStore,
  },
  // 新增会员卡 // 仅品牌
  {
    path: '/brand-inner/add-new-vip-card',
    name: '/brand-inner/add-new-vip-card',
    component: allComponents.AddNewVipCard,
    // 以下3个将在数据库中删除
    // children: [
    //     { path: '/brand-inner/add-new-vip-card/select-card', component: allComponents.SelectCard },
    //     { path: '/brand-inner/add-new-vip-card/write-card-info', component: allComponents.WriteCardInfo },
    //     { path: '/brand-inner/add-new-vip-card/select-card-cover', component: allComponents.SelectCardCover }
    // ],
  },
  // 新增服务模板
  {
    path: '/brand-inner/service-add',
    name: '/brand-inner/service-add',
    component: allComponents.ServiceAddOrEdit, // 共用门店创建服务页面
  },
  // 编辑服务模板
  {
    path: '/brand-inner/service-edit',
    name: '/brand-inner/service-edit',
    component: allComponents.ServiceAddOrEdit, // 共用门店编辑服务页面
  },
  // 服务模板详情
  {
    path: '/brand-inner/service-detail/:id',
    name: '/brand-inner/service-detail',
    component: allComponents.ServiceDetail, // 共用门店服务详情页面
  },
  // 新增产品模板
  {
    path: '/brand-inner/product-add',
    name: '/brand-inner/product-add',
    component: allComponents.productAdd, // 共用门店产品新增页面
  },
  // 编辑产品模板
  {
    path: '/brand-inner/product-edit',
    name: '/brand-inner/product-edit',
    component: allComponents.productAdd, // 共用门店产品编辑页面
  },
  // 产品模板详情
  {
    path: '/brand-inner/product-detail/:id',
    name: '/brand-inner/product-detail',
    component: allComponents.ProductDetail, // 共用门店产品详情页面
  },
  // 服务订单详情
  {
    path: '/brand-inner/service-order-detail',
    name: '/brand-inner/service-order-detail',
    component: allComponents.ServiceAndProductDetailOrder,
  },
  // 产品订单详情
  {
    path: '/brand-inner/product-order-detail',
    name: '/brand-inner/product-order-detail',
    component: allComponents.ServiceAndProductDetailOrder,
  },
  // 卡项订单详情
  {
    path: '/brand-inner/card-order-detail',
    name: '/brand-inner/card-order-detail',
    component: allComponents.CardOrderDetail,
  },
  // 广告专题 - 发布广告
  {
    path: '/brand-inner/ad-project-add',
    name: '/brand-inner/ad-project-add',
    component: allComponents.advertising,
  },
  // 广告专题 - 编辑广告
  {
    path: '/brand-inner/ad-project-edit',
    name: '/brand-inner/ad-project-edit',
    component: allComponents.advertising,
  },
  // 广告专题 - 广告详情
  {
    path: '/brand-inner/ad-project-detail',
    name: '/brand-inner/ad-project-detail',
    component: allComponents.advertising,
  },
    // 股东分红 - 股东详情
    {
      path: '/brand-inner/market/market-list/shareholder-detail',
      name: '/brand-inner/market/market-list/shareholder-detail',
      component: allComponents.shareholderDetail,
    },
    // 股东分红 - 交易记录详情
    {
      path: '/brand-inner/market/market-list/transaction-record',
      name: '/brand-inner/market/market-list/transaction-record',
      component: allComponents.transactionRecord,
    },
  // 编辑会员卡
  {
    path: '/brand-inner/edit-vip-card',
    name: '/brand-inner/edit-vip-card',
    component: allComponents.editVipCard,
  },
  // 会员卡详情
  {
    path: '/brand-inner/vip-card-details',
    name: '/brand-inner/vip-card-details',
    component: allComponents.vipCardDetails,
  },
  // 创建商品品牌
  {
    path: '/brand-inner/create-new-brand',
    name: '/brand-inner/create-new-brand',
    component: allComponents.CreateNewBrand,
  },
  // 编辑商品品牌
  {
    path: '/brand-inner/edit-new-brand',
    name: '/brand-inner/edit-new-brand',
    component: allComponents.CreateNewBrand,
  },
  // - 库存产品 新增
  {
    path: '/brand-inner/stock/stock-product-add',
    name: '/brand-inner/stock/stock-product-add',
    component: allComponents.prodAddOrEdit,
  },
  // - 库存产品 编辑
  {
    path: '/brand-inner/stock/stock-product-edit',
    name: '/brand-inner/stock/stock-product-edit',
    component: allComponents.prodAddOrEdit,
  },
  // - 库存产品 详情
  {
    path: '/brand-inner/stock/stock-product-detail/:id',
    name: '/brand-inner/stock/stock-product-detail',
    component: allComponents.prodDetail,
  },
  // - 库存 订货单详情
  {
    path: '/brand-inner/stock-order-details',
    name: '/brand-inner/stock-order-details',
    component: allComponents.detailsInAllSteps,
  },
  // 员工档案 // 品牌+门店
  {
    path: '/brand-inner/staffRecord/:staffId/:userId/:jobType',
    name: '/brand-inner/staffRecord',
    component: allComponents.StaffRecord,
    children: [{
        path: '/brand-inner/staffRecord/:staffId/:userId/:jobType/record-introduce',
        name: '/brand-inner/staffRecord/record-introduce',
        component: allComponents.RecordIntroduce
      },
      {
        path: '/brand-inner/staffRecord/:staffId/:userId/:jobType/record-archives',
        name: '/brand-inner/staffRecord/record-archives',
        component: allComponents.RecordArchives
      },
      {
        path: '/brand-inner/staffRecord/:staffId/:userId/:jobType/record-dynamic',
        name: '/brand-inner/staffRecord/record-dynamic',
        component: allComponents.RecordDynamic
      },
      {
        path: '/brand-inner/staffRecord/:staffId/:userId/:jobType/record-rate',
        name: '/brand-inner/staffRecord/record-rate',
        component: allComponents.RecordRate
      },
      {
        path: '/brand-inner/staffRecord/:staffId/:userId/:jobType/record-service',
        name: '/brand-inner/staffRecord/record-service',
        component: allComponents.RecordService
      }
    ],
    redirect: '/brand-inner/staffRecord/:staffId/:userId/:jobType/record-introduce'
  },
  // 客户档案 // 品牌+门店
  {
    path: '/brand-inner/customerRecord/:id',
    name: '/brand-inner/customerRecord',
    component: allComponents.CustomerRecord,
    children: [{
        path: '/brand-inner/customerRecord/:id/beauty-record',
        name: '/brand-inner/customerRecord/beauty-record',
        component: allComponents.BeautyRecord_Brand
      },
      {
        path: '/brand-inner/customerRecord/:id/customer-remark',
        name: '/brand-inner/customerRecord/customer-remark',
        component: allComponents.customerRemark
      },
      {
        path: '/brand-inner/customerRecord/:id/record-history',
        name: '/brand-inner/customerRecord/record-history',
        component: allComponents.RecordHistory
      },
      {
        path: '/brand-inner/customerRecord/:id/vip-card',
        name: '/brand-inner/customerRecord/vip-card',
        component: allComponents.VipCard
      },
      { // 权益金
        path: '/brand-inner/customerRecord/:id/equity-money',
        name: '/brand-inner/customerRecord/equity-money',
        component: allComponents.equitymoney
      }, 
      {
        path: '/brand-inner/customerRecord/:id/red-packet',
        name: '/brand-inner/customerRecord/red-packet',
        component: allComponents.Redpacket
      }, // redpacket
      {
        path: '/brand-inner/customerRecord/:id/coupons',
        name: '/brand-inner/customerRecord/coupons',
        component: allComponents.Coupons
      }, //Coupons
      {
        path: '/brand-inner/customerRecord/:id/customer-wallet',
        name: '/brand-inner/customerRecord/customer-wallet',
        component: allComponents.CustomerWallet
      }, // wallet
      {
        path: '/brand-inner/customerRecord/:id/growth-history',
        name: '/brand-inner/customerRecord/growth-history',
        component: allComponents.emptyPage
      }, //GrowthHistory
      {
        path: '/brand-inner/customerRecord/:id/point-history',
        name: '/brand-inner/customerRecord/point-history',
        component: allComponents.pointHistory
      }, //pointHistory

    ],
    redirect: '/brand-inner/customerRecord/:id/beauty-record'
  },
  // 新增员工 // 品牌
  {
    path: '/brand-inner/staff-add',
    name: '/brand-inner/staff-add',
    component: allComponents.StaffAdd,
  },
  // 作品动态详情
  {
    path: '/brand-inner/dynamic-work-detail',
    name: '/brand-inner/dynamic-work-detail',
    component: allComponents.DynamicWorkDetail,
  },
  // 红包详情
  {
    path: '/brand-inner/market/market-list/red-packet-details',
    name: '/brand-inner/market/market-list/red-packet-details',
    component: allComponents.DetailsRedPacket,
  },
  // 派发红包
  {
    path: '/brand-inner/market/market-list/send-red-packet',
    name: '/brand-inner/market/market-list/send-red-packet',
    component: allComponents.SendRedPacket,
  },

  // 新增活动红包模板 // new
  {
    path: '/brand-inner/market/market-list/create-red-packet-model',
    name: '/brand-inner/market/market-list/create-red-packet-model',
    component: allComponents.ModelRedPacket_Activity,
  },
  // 编辑活动红包模板 // new
  {
    path: '/brand-inner/market/market-list/edit-red-packet-model',
    name: '/brand-inner/market/market-list/edit-red-packet-model',
    component: allComponents.ModelRedPacket_Activity,
  },
  // 派发活动红包 // new
  {
    path: '/brand-inner/market/market-list/activity-red-packet-send',
    name: '/brand-inner/market/market-list/activity-red-packet-send',
    component: allComponents.SendRedPacket_Activity,
  },
  // - 详情可能不需要 new

  // 小程序填写授权
  {
    path: '/brand-inner/create/mini-project',
    name: '/brand-inner/create/mini-project',
    component: allComponents.createMiniProject,
  },

  // 授权支付宝
  {
    path: "/brand-inner/auth-ali-pay",
    name: "/brand-inner/auth-ali-pay",
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
    path: "/brand-inner/ali-pay-info",
    name: "/brand-inner/ali-pay-info",
    component: allComponents.AliPayInfo,
  },
  // 申请开通支付宝
  {
    path: "/brand-inner/ali-pay-detail",
    name: "/brand-inner/ali-pay-detail",
    component: allComponents.alipayInfoDetail,
  },
  // 申请开通微信支付账号
  {
    path: "/brand-inner/open-up-pay",
    name: "/brand-inner/open-up-pay",
    component: allComponents.OpenUpPay
  },
  // 微信支付账号 - 详情
  {
    path: "/brand-inner/wechat-pay-detail",
    name: "/brand-inner/wechat-pay-detail",
    component: allComponents.wechatDetail
  },
  // 新增会员级别
  {
    path: '/brand-inner/add-member-level',
    name: '/brand-inner/add-member-level',
    component: allComponents.AddMemberLevel,
  },
  // 编辑会员级别
  {
    path: '/brand-inner/edit-member-level',
    name: '/brand-inner/edit-member-level',
    component: allComponents.AddMemberLevel,
  },
  // 品牌管理中心
  {
    path: '/brand-inner/brandNavBar',
    name: '/brand-inner/brandNavBar',
    component: allComponents.brandNavBar,
    children: [
      // 控制台
      {
        path: '/brand-inner/console',
        name: '/brand-inner/console',
        component: allComponents.brandConsole
      },
      //  收款台
      {
        path: '/brand-inner/cashier-dask',
        name: '/brand-inner/cashier-dask',
        component: allComponents.Cashier,
        children: [
          // 钱包 - 充值提现
          {
            path: '/brand-inner/cashier-dask/wallet',
            name: '/brand-inner/cashier-dask/wallet',
            component: allComponents.Wallet
          },
          // 开支记录
          {
            path: '/brand-inner/cashier-dask/spend-record',
            name: '/brand-inner/cashier-dask/spend-record',
            component: allComponents.SpendRecord
          },
          // 商城统计
          {
            path: '/brand-inner/cashier-dask/mall-statistics',
            name: '/brand-inner/cashier-dask/mall-statistics',
            component: allComponents.mallStatistics
          },
          // 权益金
          {
            path: '/brand-inner/cashier-dask/equity-money',
            name: '/brand-inner/cashier-dask/equity-money',
            component: allComponents.equityMoney
          },
        ],
      },
      // 订单
      {
        path: '/brand-inner/order',
        name: '/brand-inner/order',
        component: allComponents.OrderIndex,
        children: [
          {
            path: '/brand-inner/order/service-order',
            name: '/brand-inner/order/service-order',
            component: allComponents.ServiceOrder,
          },
          {
            path: '/brand-inner/order/product-order',
            name: '/brand-inner/order/product-order',
            component: allComponents.ProductOrder,
          },
          {
            path: '/brand-inner/order/card-order',
            name: '/brand-inner/order/card-order',
            component: allComponents.CardOrder,
          },
        ],
      },
      // 客户中心
      {
        path: '/brand-inner/customer',
        name: '/brand-inner/customer',
        component: allComponents.CustomerIndex,
        children: [{
            path: '/brand-inner/customer/customer-list',
            name: '/brand-inner/customer/customer-list',
            component: allComponents.CustomerList_Brand
          },
          {
            path: '/brand-inner/customer/birthday-greetings', // 生日问候
            name: '/brand-inner/customer/birthday-greetings', // 生日问候
            component: allComponents.emptyPage
          },
          {
            path: '/brand-inner/customer/loss-warning', // 流失预警
            name: '/brand-inner/customer/loss-warning',
            component: allComponents.emptyPage
          },
          {
            path: '/brand-inner/customer/complaint-management', // 投诉管理 // title改成 意见反馈
            name: '/brand-inner/customer/complaint-management',
            component: allComponents.emptyPage
          },
          // {
          //     path: '/brand-inner/customer/customer-analysis',  // 客户分析 // 1.0 不做
          //     name: '/brand-inner/customer/customer-analysis',
          //     component: allComponents.emptyPage
          // },
          {
            path: '/brand-inner/customer/customer-import', // 客户导入
            name: '/brand-inner/customer/customer-import',
            component: allComponents.ImportCustomer
          },
        ],
      },

      // 员工中心
      {
        path: '/brand-inner/staff',
        name: '/brand-inner/staff',
        component: allComponents.StaffIndex,
        children: [{
            path: '/brand-inner/staff/staff-list', // 总部的
            name: '/brand-inner/staff/staff-list',
            component: allComponents.BrandStaffList,
          },
          {
            path: '/brand-inner/staff/staff-recycle',
            name: '/brand-inner/staff/staff-recycle',
            component: allComponents.StaffRecycle
          },
          {
            path: '/brand-inner/staff/performance-salary', // 业绩薪酬
            name: '/brand-inner/staff/performance-salary',
            component: allComponents.PerformanceSalary
          },
          {
            path: '/brand-inner/staff/work-dynamic', // 作品动态
            name: '/brand-inner/staff/work-dynamic',
            component: allComponents.DynamicWork
          },
          // {
          //     path: '/brand-inner/staff/attendance-manage',  // 考勤管理 // 1.0 不做
          //     name: '/brand-inner/staff/attendance-manage',
          //     component: allComponents.emptyPage
          // },
          // {
          //     path: '/brand-inner/staff/learning-management',  // 学习管理 // 1.0 不做
          //     name: '/brand-inner/staff/learning-management',
          //     component: allComponents.emptyPage
          // },
          // {
          //     path: '/brand-inner/staff/companies-inform', // 企业通知 // 1.0 不做
          //     name: '/brand-inner/staff/companies-inform',
          //     component: allComponents.emptyPage
          // },
        ],
      },
      //营销中心
      {
        path: '/brand-inner/market',
        name: '/brand-inner/market',
        component: allComponents.MarketIndex,
        children: [{
            path: '/brand-inner/market/market-list',
            name: '/brand-inner/market/market-list',
            component: allComponents.MarketRegionIndex,
            children: [
              // 应用列表
              {
                path: '/brand-inner/market/market-list/index',
                name: '/brand-inner/market/market-list/index',
                component: allComponents.MarketRegion
              },
              // 智能红包
              {
                path: '/brand-inner/market/market-list/red-packet',
                name: '/brand-inner/market/market-list/red-packet',
                component: allComponents.RedPacket,
                meta: {
                  parentTitle: '营销应用'
                }, // 焦点补救
              },
              // 活动红包
              {
                path: '/brand-inner/market/market-list/activity-red-packet',
                name: '/brand-inner/market/market-list/activity-red-packet',
                component: allComponents.RedPacket_Activity,
                meta: {
                  parentTitle: '营销应用'
                }, // 焦点补救
              },
              {
                path: '/brand-inner/market/market-list/shareholder-profit', // 股东分红
                name: '/brand-inner/market/market-list/shareholder-profit',
                component: allComponents.shareholderProfit,
                meta: {
                  parentTitle: '营销应用'
                }, // 焦点补救
              },
            ],
          },
          // 以下1.0不做，但是保留导航栏
          {
            path: '/brand-inner/market/ad-project', // 广告专题
            name: '/brand-inner/market/ad-project',
            component: allComponents.adProject
          },
          {
            path: '/brand-inner/market/market-campaign', // 营销活动
            name: '/brand-inner/market/market-campaign',
            component: allComponents.emptyPage
          },
          {
            path: '/brand-inner/market/creative-posters', // 创意海报
            name: '/brand-inner/market/creative-posters',
            component: allComponents.emptyPage
          },
          {
            path: '/brand-inner/market/invite-friend', // 邀请好友
            name: '/brand-inner/market/invite-friend',
            component: allComponents.emptyPage
          },
          {
            path: '/brand-inner/market/promotion-rebate', // 推广返利
            name: '/brand-inner/market/promotion-rebate',
            component: allComponents.emptyPage
          },
        ],
      },
      //商品管理
      {
        path: '/brand-inner/goods',
        name: '/brand-inner/goods',
        component: allComponents.GoodsIndex,
        children: [{
            path: '/brand-inner/goods/service-list',
            name: '/brand-inner/goods/service-list',
            component: allComponents.brandServiceManageList, // 品牌服务管理
          },
          {
            path: '/brand-inner/goods/product-list',
            name: '/brand-inner/goods/product-list',
            component: allComponents.brandProductManageList, // 品牌产品管理
          },
          {
            path: '/brand-inner/goods/card-list', // 卡项管理 // 1.0 品牌端 // 缺少卡项编辑页面
            name: '/brand-inner/goods/card-list',
            component: allComponents.CardList
          },
          {
            path: '/brand-inner/goods/service-sort', // 服务分类 // 1.0 品牌端
            name: '/brand-inner/goods/service-sort', // 服务分类 // 1.0 品牌端
            component: allComponents.ServiceSort
          },
          {
            path: '/brand-inner/goods/product-sort', // 产品分类 // 1.0 品牌端
            name: '/brand-inner/goods/product-sort',
            component: allComponents.ProductSort
          },
          {
            path: '/brand-inner/goods/product-brand', // 产品品牌 // 1.0 品牌端
            name: '/brand-inner/goods/product-brand',
            component: allComponents.ProductBrand
          },
          {
            path: '/brand-inner/goods/integral-store', // 积分商城 // 1.0取消
            name: '/brand-inner/goods/integral-store',
            component: allComponents.emptyPage
          },
          {
            path: '/brand-inner/goods/goods-import', // 产品导入
            name: '/brand-inner/goods/goods-import',
            component: allComponents.importGoodsBrand
          },
        ],
      },
      // 库存管理
      {
        path: '/brand-inner/stock',
        name: '/brand-inner/stock',
        component: allComponents.newStockIndex,
        children: [{
            path: '/brand-inner/stock/stock-product',
            name: '/brand-inner/stock/stock-product',
            component: allComponents.newStockProduct
          },
          {
            path: '/brand-inner/stock/stock-list',
            name: '/brand-inner/stock/stock-list',
            component: allComponents.newStockList
          },
          {
            path: '/brand-inner/stock/stock-enter',
            name: '/brand-inner/stock/stock-enter',
            component: allComponents.newStockEnter
          },
          {
            path: '/brand-inner/stock/stock-out',
            name: '/brand-inner/stock/stock-out',
            component: allComponents.newStockOut
          },
          {
            path: '/brand-inner/stock/stock-require',
            name: '/brand-inner/stock/stock-require',
            component: allComponents.newStockRequire
          },
          {
            path: '/brand-inner/stock/stock-statistics',
            name: '/brand-inner/stock/stock-statistics',
            component: allComponents.stockStatistics
          },
          {
            path: '/brand-inner/stock/product-import',
            name: '/brand-inner/stock/product-import',
            component: allComponents.BrandProductImport
          },
        ]
      },
      //数据统计
      {
        path: '/brand-inner/dataCenter',
        name: '/brand-inner/dataCenter',
        component: allComponents.CountIndex,
        children: [{
            path: '/brand-inner/dataCenter/overview',
            name: '/brand-inner/dataCenter/overview',
            component: allComponents.CountList
          },
          {
            path: '/brand-inner/dataCenter/business-data',
            name: '/brand-inner/dataCenter/business-data',
            component: allComponents.CountBusiness
          },
          // 员工数据
          {
            path: '/brand-inner/dataCenter/staff-data',
            name: '/brand-inner/dataCenter/staff-data',
            component: allComponents.cm_staffIndex,
          },
          // 财务报表
          {
            path: '/brand-inner/dataCenter/financial-statement',
            name: '/brand-inner/dataCenter/financial-statement',
            component: allComponents.cm_financialIndex,
          },
        ],
      },

      //店铺管理
      {
        path: '/brand-inner/store',
        name: '/brand-inner/store',
        component: allComponents.brandIndex,
        children: [{
            path: '/brand-inner/store/info',
            name: '/brand-inner/store/info',
            component: allComponents.netShopIndex,
            children: [{
              path: '/brand-inner/store/info/mini-project',
              name: '/brand-inner/store/info/mini-project',
              component: allComponents.miniProject
            }]
          },
          {
            path: '/brand-inner/store/decorate',
            name: '/brand-inner/store/decorate',
            component: allComponents.DecorateShopIndex, // new
            children: [{
                path: '/brand-inner/store/decorate/theme', // 主题配色
                name: '/brand-inner/store/decorate/theme',
                component: allComponents.DecorateShopTheme
              },
              {
                path: '/brand-inner/store/decorate/menu', // 菜单设置
                name: '/brand-inner/store/decorate/menu',
                component: allComponents.DecorateShopMenu
              },
              {
                path: '/brand-inner/store/decorate/column-name', // 栏目标题
                name: '/brand-inner/store/decorate/column-name',
                component: allComponents.ColumnName
              },
            ]
          },
          {
            path: '/brand-inner/store/floor-info',
            name: '/brand-inner/store/floor-info',
            component: allComponents.BaseFloor, // new
          },
          {
            path: '/brand-inner/store/homepage',
            name: '/brand-inner/store/homepage',
            component: allComponents.homePage, // 品牌主页
            children: [{
                path: '/brand-inner/store/homepage/about-us', // 关于我们
                name: '/brand-inner/store/homepage/about-us',
                component: allComponents.aboutUs
              },
              {
                path: '/brand-inner/store/homepage/photo-album', // 品牌相册
                name: '/brand-inner/store/homepage/photo-album',
                component: allComponents.photoAlbum
              }
            ]
          },
          {
            path: '/brand-inner/store/shop-class',
            name: '/brand-inner/store/shop-class',
            component: allComponents.shopClass, // 店铺分类
          },
        ],
      },
      // 商品回收站
      // { path: '/brand-inner/goods/goods-recycle', component: allComponents.Recycle }, // 1.0 取消， 取消变更为表格筛选
      // 设置中心
      {
        path: '/brand-inner/setting',
        name: '/brand-inner/setting',
        component: allComponents.SetIndex,
        children: [{
            path: '/brand-inner/setting/bussiness-set', // 交易设置 总部授权页面  门店也有
            name: '/brand-inner/setting/bussiness-set',
            component: allComponents.BusinessSet,
            children: [{
                path: '/brand-inner/setting/bussiness-set/basic',
                name: '/brand-inner/setting/bussiness-set/basic',
                component: allComponents.BusinessBasic
              },
              {
                path: '/brand-inner/setting/bussiness-set/receive-account',
                name: '/brand-inner/setting/bussiness-set/receive-account',
                component: allComponents.ReceiveAccount
              }
            ],
          },
          {
            path: '/brand-inner/setting/commission-set', // 提成设置 总部授权页面 门店可能没有部分页面
            name: '/brand-inner/setting/commission-set',
            component: allComponents.CommissionSet,
            children: [{
                path: '/brand-inner/setting/commission-set/basic-set',
                name: '/brand-inner/setting/commission-set/basic-set',
                component: allComponents.CommissionBasicSet
              },
              {
                path: '/brand-inner/setting/commission-set/service-set',
                name: '/brand-inner/setting/commission-set/service-set',
                component: allComponents.CommissionServiceSet
              },
              {
                path: '/brand-inner/setting/commission-set/product-set',
                name: '/brand-inner/setting/commission-set/product-set',
                component: allComponents.CommissionProductSet
              },
              {
                path: '/brand-inner/setting/commission-set/cards-set',
                name: '/brand-inner/setting/commission-set/cards-set',
                component: allComponents.CommissionCardsSet
              },
              {
                path: '/brand-inner/setting/commission-set/shops-set',
                name: '/brand-inner/setting/commission-set/shops-set',
                component: allComponents.CommissionShopsSet
              },
              {
                path: '/brand-inner/setting/commission-set/staff-set',
                name: '/brand-inner/setting/commission-set/staff-set',
                component: allComponents.CommissionStaffSet
              },
            ],
          },
          {
            path: '/brand-inner/setting/organization', // 组织架构
            name: '/brand-inner/setting/organization',
            component: allComponents.OrganizationIndex,
            children: [{
                path: "/brand-inner/setting/organization/framework-set",
                name: "/brand-inner/setting/organization/framework-set",
                component: allComponents.FrameWorkSet
              },
              {
                path: "/brand-inner/setting/organization/job-set",
                name: "/brand-inner/setting/organization/job-set",
                component: allComponents.JobSet
              },
              {
                path: "/brand-inner/setting/organization/authority-set",
                name: "/brand-inner/setting/organization/authority-set",
                component: allComponents.AuthSet
              },
            ],
          },
          {
            path: '/brand-inner/setting/marketing-set', //  营销设置
            name: '/brand-inner/setting/marketing-set', //  营销设置
            component: allComponents.Marketing,
            children: [{
                path: "/brand-inner/setting/marketing-set/marketing-app",
                name: "/brand-inner/setting/marketing-set/marketing-app",
                component: allComponents.emptyPage
              },
              {
                path: "/brand-inner/setting/marketing-set/message-reminding",
                name: "/brand-inner/setting/marketing-set/message-reminding",
                component: allComponents.MessageReminding
              },
              {
                path: "/brand-inner/setting/marketing-set/message-signatures",
                name: "/brand-inner/setting/marketing-set/message-signatures",
                component: allComponents.emptyPage
              },
            ],
          },
          {
            path: '/brand-inner/setting/member-set', // 会员设置 仅总部
            name: '/brand-inner/setting/member-set',
            component: allComponents.MemberSet,
            children: [{
                path: "/brand-inner/setting/member-set/member-level",
                name: "/brand-inner/setting/member-set/member-level",
                component: allComponents.MemberLevel
              },
              {
                path: "/brand-inner/setting/member-set/member-grow",
                name: "/brand-inner/setting/member-set/member-grow",
                component: allComponents.MemberGrow
              },
              {
                path: "/brand-inner/setting/member-set/member-points",
                name: "/brand-inner/setting/member-set/member-points",
                component: allComponents.MemberPoints
              },
              {
                path: "/brand-inner/setting/member-set/tag-manage",
                name: "/brand-inner/setting/member-set/tag-manage",
                component: allComponents.MemberTagManage
              },
            ],
          },
        ],
      },
    ],
  },
]
export {
  brandRouters
}
