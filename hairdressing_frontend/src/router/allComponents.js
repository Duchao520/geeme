const allComponents = {
    emptyPage: res => require(['@/pages/emptyPageInShop.vue'], res), // 开发中的页面

    // 门店管理一级导航栏
    shopNavBar: res => require(['@/pages/layout/shopNavBar.vue'], res),
    // 品牌管理一级导航栏
    brandNavBar: res => require(['@/pages/layout/brandNavBar.vue'], res),

    // 控制台
    shopConsole: res => require(['@/pages/console/shopConsole.vue'], res), // 门店-控制台
    brandConsole: res => require(['@/pages/console/brandConsole.vue'], res), // 品牌-控制台

    // 预约管理相关
    AppoIndex: res => require(['@/pages/appointment/AppoIndex.vue'], res), // 预约tab，主页
    AppoTime: res => require(['@/pages/appointment/AppoTime.vue'], res), // 预约时间表
    AppoList: res => require(['@/pages/appointment/AppoList.vue'], res), // 预约客户列表
    AppoAddnew: res => require(['@/pages/appointment/AppoAddnew.vue'], res), // 新增预约翻新版
    // 订单管理页面
    OrderIndex: res => require(['@/pages/orderManagement/OrderIndex.vue'], res), // 订单tab，主页
    // 服务订单
    ServiceOrder: res => require(['@/pages/orderManagement/ServiceOrder.vue'], res), // 服务订单列表

    // 开单(服务订单), // 旧版 
    // ChoosePerson: res => require(['@/pages/createOrder/ChoosePerson.vue'], res), // 选择开单人
    // ChooseService: res => require(['@/pages/createOrder/ChooseService.vue'], res), // 选择服务项目
    // 开单(服务订单), // 新版
    ChoosePerson: res => require(['@/pages/createOrder_v2/ChoosePerson.vue'], res), // 选择开单人
    ChooseService: res => require(['@/pages/createOrder_v2/ChooseGoods.vue'], res), // 选择服务项目

    // 产品订单
    ProductOrder: res => require(['@/pages/orderManagement/ProductOrder.vue'], res),
    // 卡项订单
    CardOrder: res => require(['@/pages/orderManagement/CardOrder.vue'], res),
    ServiceAndProductDetailOrder: res => require(['@/pages/orderManagement/ServiceAndProductDetailOrder.vue'], res),
    CardOrderDetail: res => require(['@/pages/orderManagement/CardOrderDetail.vue'], res),
    // 开支记录
    SpendRecord:res => require(['@/pages/orderManagement/SpendRecord.vue'], res),
    // 收款台
    Cashier: res => require(['@/pages/orderManagement/cashier/Cashier.vue'], res),
    CashierList: res => require(['@/pages/orderManagement/cashier/CashierList.vue'], res),
    CashierRecycle: res => require(['@/pages/orderManagement/cashier/CashierRecycle.vue'], res),

    Wallet: res => require(['@/pages/orderManagement/wallet'], res), // 钱包-充值、提现
    mallStatistics: res => require(['@/pages/orderManagement/mallStatistics'], res), // 商城统计

    equityMoney: res => require(['@/pages/orderManagement/equityMoney/index.vue'], res), // 权益金

    // 客户中心
    CustomerIndex: res => require(['@/pages/customerCenter/CustomerIndex.vue'], res),
    // 客户列表
    CustomerList: res => require(['@/pages/customerCenter/CustomerList.vue'], res), // 客户列表
    soldedVipCards: res => require(['@/pages/customerCenter/solded_VIP_card'], res), // 卖掉的会员卡
    ImportCustomer: res => require(['@/pages/customerCenter/importCustomer.vue'], res), // 客户导入
    CustomerList_Brand: res => require(['@/pages/customerCenter/CustomerList_Brand.vue'], res), // 客户列表-总部
    // 客户美丽档案
    CustomerRecord: res => require(['@/pages/customerCenter/CustomerRecord.vue'], res), // 员工档案
    BeautyRecord: res => require(['@/pages/customerCenter/BeautyRecord.vue'], res), // 客户基本资料
    BeautyRecord_Brand: res => require(['@/pages/customerCenter/BeautyRecord_Brand.vue'], res), // 客户基本资料
    RecordHistory: res => require(['@/pages/customerCenter/RecordHistory.vue'], res), // 消费记录
    customerRemark: res => require(['@/pages/customerCenter/customerRemark.vue'], res), // 客情备注 - 仅门店
    VipCard: res => require(['@/pages/customerCenter/VipCard.vue'], res), // 会员卡
    Coupons: res => require(['@/pages/customerCenter/Coupons.vue'], res), // 红包/优惠券
    equitymoney: res => require(['@/pages/customerCenter/equitymoney.vue'], res), // 权益金
    Redpacket: res => require(['@/pages/customerCenter/redpacket.vue'], res), // 红包-与优惠券独立
    GrowthHistory: res => require(['@/pages/customerCenter/GrowthHistory.vue'], res), // 成长值记录
    pointHistory: res => require(['@/pages/customerCenter/pointHistory.vue'], res), // 积分明细
    CustomerWallet: res => require(['@/pages/customerCenter/CustomerWallet.vue'], res), // 客户余额
    // 员工中心
    StaffIndex: res => require(['@/pages/staffCenter/StaffIndex.vue'], res),
    // 员工列表
    StaffList: res => require(['@/pages/staffCenter/StaffList.vue'], res), // 员工列表 门店
    //员工作品动态
    DynamicWork: res => require(['@/pages/staffCenter/DynamicWork.vue'], res),
    //员工作品动态详情
    DynamicWorkDetail: res => require(['@/pages/staffCenter/DynamicWorkDetail.vue'], res),
    BrandStaffList: res => require(['@/pages/staffCenter/BrandStaffList.vue'], res), // 员工列表 品牌
    StaffAdd: res => require(['@/pages/staffCenter/StaffAdd.vue'], res), // 新增总部员工
    shopStaffAdd: res => require(['@/pages/staffCenter/shopStaffAdd.vue'], res), // 门店新增员工 + 门店个人介绍
    PerformanceSalary: res => require(['@/pages/staffCenter/PerformanceSalary.vue'], res), // 业绩与薪酬
    // 员工档案相关
    StaffRecord: res => require(['@/pages/staffCenter/StaffRecord.vue'], res), // 员工档案
    RecordDynamic: res => require(['@/pages/staffCenter/RecordDynamic.vue'], res), // 作品动态
    // 基本资料
    RecordIntroduce: res => require(['@/pages/staffCenter/RecordIntroduceMiddle.vue'], res), // 总部个人介绍
    // 服务档案
    RecordArchives: res => require(['@/pages/staffCenter/RecordArchives.vue'], res), // 个人介绍
    RecordRate: res => require(['@/pages/staffCenter/RecordRate.vue'], res), // 服务评价
    RecordService: res => require(['@/pages/staffCenter/RecordService.vue'], res), // 相关服务
    // 商品管理
    GoodsIndex: res => require(['@/pages/goodsManagement/GoodsIndex.vue'], res), // 商品管理 主页面
    // 服务管理 -- 品牌端服务和产品管理
    brandServiceManageList:  res => require(['@/pages/brandGoodsManagement/ServiceManageList.vue'], res), // 品牌服务管理列表
    brandProductManageList:  res => require(['@/pages/brandGoodsManagement/ProductManageList.vue'], res), // 品牌产品管理列表
    // 服务管理
    ServiceManageList: res => require(['@/pages/goodsManagement/ServiceManageList.vue'], res), // 服务管理列表
    ProductManageList: res => require(['@/pages/goodsManagement/ProductManageList.vue'], res), // 产品管理列表
    CardList: res => require(['@/pages/goodsManagement/CardList.vue'], res), // 会员卡列表
    editVipCard: res => require(['@/pages/goodsManagement/editVipCard.vue'], res), // 会员卡编辑
    vipCardDetails: res => require(['@/pages/goodsManagement/vipCardDetails.vue'], res), // 会员卡详情
    ProductSort: res => require(['@/pages/goodsManagement/ProductSort.vue'], res), // 产品列表
    ServiceSort: res => require(['@/pages/goodsManagement/ServiceSort.vue'], res), // 服务列表
    ProductBrand: res => require(['@/pages/goodsManagement/ProductBrand.vue'], res), // 产品品牌
    // ServiceAdd: res => require(['@/pages/goodsManagement/ServiceAdd.vue'], res), // 新增服务
    ServiceAddOrEdit: res => require(['@/pages/goodsManagement/ServiceAddOrEdit.vue'], res), // 新增/编辑服务(重构版)
    productAdd: res => require(['@/pages/goodsManagement/productAdd.vue'], res), // 新增产品
    // 批量导入-门店
    importGoods: res => require(['@/pages/goodsManagement/importGoods/importGoods.vue'], res), // 产品批量导入
    importGoodsBrand: res => require(['@/pages/goodsManagement/importGoods/importGoodsBrand.vue'], res), // 商品模板批量导入 -- 总部
    // 商品回收站
    Recycle: res => require(['@/pages/goodsManagement/Recycle.vue'], res), // 商品回收站 列表
    AddNewVipCard: res => require(['@/pages/goodsManagement/AddNewVipCard.vue'], res),
    SelectCard: res => require(['@/components/goodsManagement/addNewVipCardModule/selectCard.vue'], res),
    // WriteCardInfo: res => require(['@/pages/goodsManagement/WriteCardInfo.vue'], res),
    SelectCardCover: res => require(['@/components/goodsManagement/addNewVipCardModule/SelectCardCover.vue'], res),
    // 员工中心回收站
    StaffRecycle: res => require(['@/pages/staffCenter/Recycle.vue'], res), // 商品回收站 列表

    // 门店管理
    StoreIndex: res => require(['@/pages/storeManagement/StoreIndex.vue'], res), // 门店管理 主页面
    // 库存管理列表首页-旧的
    Stock: res => require(['@/pages/stockControl/stockIndex.vue'], res), // 库存管理首页
    StockList: res => require(['@/pages/stockControl/stockList.vue'], res), // 库存明细
    StockEnter: res => require(['@/pages/stockControl/stockEnter.vue'], res), // 入库管理
    StockOut: res => require(['@/pages/stockControl/stockOut.vue'], res), // 出库管理
    StockTransfers: res => require(['@/pages/stockControl/stockTransfers.vue'], res), // 调拨管理
    StockSupplier: res => require(['@/pages/stockControl/stockSupplier.vue'], res), // 供应商管理

    // 库存-新的
    newStockIndex: res => require(['@/pages/stockMangement/stockIndex.vue'], res), // 库存 - 新版 -- 首页
    newStockProduct: res => require(['@/pages/stockMangement/stockProduct.vue'], res), // 库存 - 新版 -- 产品
    prodAddOrEdit: res => require(['@/pages/stockMangement/productAddOrEdit.vue'], res), // 产品新增、编辑
    prodDetail: res => require(['@/pages/stockMangement/productDetail.vue'], res), // 库存产品 - 详情
    newStockList: res => require(['@/pages/stockMangement/stockList.vue'], res), // 库存 - 新版 -- 明细
    newStockEnter: res => require(['@/pages/stockMangement/stockEnter.vue'], res), // 库存 - 新版 -- 入库
    newStockOut: res => require(['@/pages/stockMangement/stockOut.vue'], res), // 库存 - 新版 -- 出库
    newStockRequire: res => require(['@/pages/stockMangement/stockRequire.vue'], res), // 库存 - 新版 -- 订货
    stockStatistics: res => require(['@/pages/stockMangement/stockStatisticsIndex.vue'], res), // 库存 - 新版 -- 统计
    BrandProductImport: res => require(['@/pages/stockMangement/brand_productImport.vue'], res), // 库存 - 品牌端产品导入
    detailsInAllSteps: res => require(['@/pages/stockMangement/requireOrderComponents/detailsInAllSteps.vue'], res), // 订单货详情

    // 营销中心 ====>
    MarketIndex: res => require(['@/pages/marketManagement/MarketIndex.vue'], res), // 营销中心 主页面
    adProject: res => require(['@/pages/marketManagement/adProject/index.vue'], res), // 门店广告专题
    // 营销中心列表首页
    MarketRegion: res => require(['@/pages/marketManagement/MarketRegion.vue'], res), // 营销中心列表
    MarketRegionIndex: res => require(['@/pages/marketManagement/MarketRegionIndex.vue'], res),
    // - [总部]-智能红包
    RedPacket: res => require(['@/pages/marketManagement/marketSoft/redPacket/index.vue'], res),
    SendRedPacket: res => require(['@/pages/marketManagement/marketSoft/redPacket/send.vue'], res), // 派发红包
    DetailsRedPacket: res => require(['@/pages/marketManagement/marketSoft/redPacket/details.vue'], res), // 红包历史详情
    // - [总部]-活动红包
    RedPacket_Activity: res => require(['@/pages/marketManagement/marketSoft/redPacket_activity/index.vue'], res),
    SendRedPacket_Activity: res => require(['@/pages/marketManagement/marketSoft/redPacket_activity/send.vue'], res), // 派发活动红包
    // DetailsRedPacket_Activity: res => require(['@/pages/marketManagement/marketSoft/redPacket_activity/details.vue'], res), // 活动红包历史详情
    ModelRedPacket_Activity: res => require(['@/pages/marketManagement/marketSoft/redPacket_activity/model.vue'], res), // 活动红包模板

    // - [门店]-广告
    advertising: res => require(['@/pages/marketManagement/adProject/advertising.vue'], res), // 发布广告
    // - [门店]-团购
    GroupBuy: res => require(['@/pages/marketManagement/marketSoft/groupBuy_shop/index.vue'], res), // / 团购列表
    GroupBuy_create: res => require(['@/pages/marketManagement/marketSoft/groupBuy_shop/createOrDetailOrOnline.vue'], res), // / 团购列表
    GroupBuy_deltai: res => require(['@/pages/marketManagement/marketSoft/groupBuy_shop/createOrDetailOrOnline.vue'], res), // / 团购详情
    GroupBuy_online: res => require(['@/pages/marketManagement/marketSoft/groupBuy_shop/createOrDetailOrOnline.vue'], res), // / 团购重新上线

    eCoupon: res => require(['@/pages/marketManagement/marketSoft/coupon/index.vue'], res), // 电子优惠券

    // - [门店]-推广返佣
    seller: res => require(['@/pages/marketManagement/marketSoft/seller/index.vue'], res), // 推广返佣
    sellerDetail: res => require(['@/pages/marketManagement/marketSoft/seller/sellerDetail.vue'], res), // 推客详情
    createGoods: res => require(['@/pages/marketManagement/marketSoft/seller/createGoods.vue'], res), // 新增商品

    // - [门店]-礼品卡
    giftCard: res => require(['@/pages/marketManagement/marketSoft/giftCard/index.vue'], res), // 礼品卡 
    createGiftActivity: res => require(['@/pages/marketManagement/marketSoft/giftCard/createActivity.vue'], res), // 礼品卡添加 
    giftCardDetail: res => require(['@/pages/marketManagement/marketSoft/giftCard/detail.vue'], res), // 礼品卡活动详情 

    // - [门店]-礼品卡
    shareholderProfit: res => require(['@/pages/marketManagement/marketSoft/shareholderProfit/index.vue'], res), // 股东分红
    shareholderDetail: res => require(['@/pages/marketManagement/marketSoft/shareholderProfit/shareholderDetail.vue'], res), // 股东分红 - 股东详情 
    transactionRecord: res => require(['@/pages/marketManagement/marketSoft/shareholderProfit/transactionRecord.vue'], res), // 股东分红 - 交易记录详情 

    // - [门店]-新人体验价
    newUserPrice: res => require(['@/pages/marketManagement/marketSoft/newUserPrice/index.vue'], res), // 新人体验价
    changeNewUserPrice: res => require(['@/pages/marketManagement/marketSoft/newUser_shop/change.vue'], res), // / 新人体验价新建、详情
    // <====营销中心


    // 供应市场
    SupplyIndex: res => require(['@/pages/supplyManagement/SupplyIndex.vue'], res), // 供应市场 主页面
    // 供应市场列表首页
    SupplyList: res => require(['@/pages/supplyManagement/SupplyList.vue'], res), // 博美专场
    HairCare: res => require(['@/pages/supplyManagement/HairCare.vue'], res), // 美发用品列表
    ExcellentCourse: res => require(['@/pages/supplyManagement/ExcellentCourse.vue'], res), // 精品课程
    MedicalBeauty: res => require(['@/pages/supplyManagement/MedicalBeauty.vue'], res), // 医美整形
    GeemeShop: res => require(['@/pages/supplyManagement/GeemeShop.vue'], res), // 及美优选
    CityService: res => require(['@/pages/supplyManagement/CityService.vue'], res), //  同城服务
    Collect: res => require(['@/pages/supplyManagement/Collect.vue'], res), // 收藏
    // 数据统计
    CountIndex: res => require(['@/pages/countManagement/CountIndex.vue'], res), // 数据统计 主页面

    // 数据统计列表首页
    CountList: res => require(['@/pages/countManagement/CountList.vue'], res), // 数据统计列表
    CountBusiness: res => require(['@/pages/countManagement/CountBusiness.vue'], res), // 数据中心 营业流水
    //  数据中心 - 员工数据
    cm_staffIndex: res => require(['@/pages/countManagement/staffs/index.vue'], res), // 数据中心  员工数据 -  countManagement -> cm
    /* cm_staff_performance: res => require(['@/pages/countManagement/staffs/performanceList.vue'], res), // 数据中心  员工数据 -  业绩提成 (暂时没应用细分权限，备用)
    cm_staff_production: res => require(['@/pages/countManagement/staffs/productionList.vue'], res), // 数据中心  员工数据 -  作品动态 (暂时没应用细分权限，备用)
    cm_staff_assessment: res => require(['@/pages/countManagement/staffs/assessmentList.vue'], res), // 数据中心  员工数据 -  客户评价 (暂时没应用细分权限，备用) */
    // 数据中心 - 财务报表
    cm_financialIndex: res => require(['@/pages/countManagement/financial/index.vue'], res), //  数据中心  财务报表 -  countManagement -> cm
    /* cm_financial_business: res => require(['@/pages/countManagement/financial/businessList.vue'], res), //  数据中心  财务报表 -  营收报表 (暂时没应用细分权限，备用)
    cm_financial_performance: res => require(['@/pages/countManagement/financial/performanceList.vue'], res), //  数据中心  财务报表 - 业绩报表  (暂时没应用细分权限，备用)
    cm_financial_acrossStore: res => require(['@/pages/countManagement/financial/acrossStoreList.vue'], res), //  数据中心  财务报表 -  跨店结算 (暂时没应用细分权限，备用)
    cm_financial_expenditure: res => require(['@/pages/countManagement/financial/expenditureList.vue'], res), //  数据中心  财务报表 -  支出报表 (暂时没应用细分权限，备用)
    cm_financial_profit: res => require(['@/pages/countManagement/financial/profitList.vue'], res), //  数据中心  财务报表 -  利润表 (暂时没应用细分权限，备用) */

    // 店铺管理
    ShopIndex: res => require(['@/pages/shopManagement/ShopIndex.vue'], res), // 店铺管理 主页面
    // 品牌-->店铺管理
    brandIndex: res => require(['@/pages/brandStoreManagement/brandIndex.vue'], res), // 店铺管理 入口
    netShopIndex: res => require(['@/pages/brandStoreManagement/netshopMange/netShopIndex.vue'], res), // 店铺管理 网店设置 主页面
    DecorateShopIndex: res => require(['@/pages/brandStoreManagement/decorateTheme/index.vue'], res), // 店铺管理 网店装修 - 主页面
    DecorateShopTheme: res => require(['@/pages/brandStoreManagement/decorateTheme/theme.vue'], res), // 店铺管理 网店装修 - 主题
    DecorateShopMenu: res => require(['@/pages/brandStoreManagement/decorateTheme/menu.vue'], res), // 店铺管理 网店装修 - 菜单
    ColumnName: res => require(['@/pages/brandStoreManagement/decorateTheme/column.vue'], res), // 店铺管理 网店装修 - 栏目
    miniProject: res => require(['@/pages/brandStoreManagement/netshopMange/miniProject.vue'], res), // 店铺管理 网店设置 微信小程序
    createMiniProject: res => require(['@/pages/brandStoreManagement/netshopMange/createMiniProject.vue'], res), // 店铺管理 网店设置 微信小程序授权
    aboutUs: res => require(['@/pages/brandStoreManagement/homePage/aboutUs.vue'], res), // 品牌主页 - 关于我们
    photoAlbum: res => require(['@/pages/brandStoreManagement/homePage/photoAlbum.vue'], res), // 品牌主页 - 品牌相册

    // 网店装修π
    ShopDecorate: res => require(['@/pages/shopManagement/ShopDecorate.vue'], res), // 网店装修 主页面
    BasicInfo: res => require(['@/pages/shopManagement/BasicInfo.vue'], res), // 网店装修 基本资料 // 品牌认证
    BaseFloor: res => require(['@/pages/brandStoreManagement/floorSet/BaseFloor.vue'], res), // 楼层信息
    homePage: res => require(['@/pages/brandStoreManagement/homePage/index.vue'], res), // 品牌主页
    shopClass: res => require(['@/pages/brandStoreManagement/storeSort/shopClass.vue'], res), // 店铺分类

    // 设置中心 12
    SetIndex: res => require(['@/pages/setUp/SetIndex.vue'], res), // 设置中心 主页面
    // 预约设置  12.1
    AppointSet: res => require(['@/pages/setUp/appoint/AppointSet.vue'], res), // 预约设置 主页面
    QuickSet: res => require(['@/pages/setUp/appoint/QuickSet.vue'], res), // 预约设置 快捷设置
    ScheduleSet: res => require(['@/pages/setUp/appoint/ScheduleSet.vue'], res), // 预约设置 排班设置

    // 门店-组织架构
    Organization: res => require(['@/pages/setUp/organization/index.vue'], res), // 门店-组织架构主页面
    Organization_jobset: res => require(['@/pages/setUp/organization/components/jobManage'], res), // 门店-组织架构职务管理

    // 提成设置 - v1
    CommissionSet: res => require(['@/pages/setUp/commission/Index.vue'], res), // 提成设置
    CommissionBasicSet: res => require(['@/pages/setUp/commission/Basic.vue'], res), // 提成设置 基础设置
    CommissionServiceSet: res => require(['@/pages/setUp/commission/Service.vue'], res), // 提成设置 服务提成
    CommissionProductSet: res => require(['@/pages/setUp/commission/Product.vue'], res), // 提成设置 产品提成
    CommissionCardsSet: res => require(['@/pages/setUp/commission/Cards.vue'], res), // 提成设置 卡项提成 // - 旧的 在总部 即将废弃
    CommissionCardsSet_shop: res => require(['@/pages/setUp/commission/Cards_InShops.vue'], res), // 提成设置 卡项提成 // - 新的 在门店
    CommissionShopsSet: res => require(['@/pages/setUp/commission/Shops.vue'], res), // 提成设置 门店总提成
    CommissionStaffSet: res => require(['@/pages/setUp/commission/Staff.vue'], res), // 提成设置 员工提成配置

    AddNewCommissionPlanService: res => require(['@/pages/setUp/commission/subPages/serviceEditOrCreate.vue'], res), // 提成设置 新增提成方案 - 服务
    AddNewCommissionPlanProduct: res => require(['@/pages/setUp/commission/subPages/productEditOrCreate.vue'], res), // 提成设置 新增提成方案 - 产品
    AddNewCommissionPlanStore: res => require(['@/pages/setUp/commission/subPages/shopEditOrCreate.vue'], res), // 提成设置 新增提成方案 - 门店
    AddNewCommissionPlanCard: res => require(['@/pages/setUp/commission/subPages/_cardEditOrCreate.vue'], res), // 提成设置 新增提成方案 - 卡项 - 总部 - 即将废弃
    AddNewCommissionPlanCard_shop: res => require(['@/pages/setUp/commission/subPages/cardEditOrCreate.vue'], res), // 提成设置 新增提成方案 - 卡项 - 门店

    // 提成设置 - v2
    CommissionIndex: res => require(['@/pages/setUp/commission_v2/index.vue'], res), // 提成设置 门店和品牌通用
    CommissionProductList: res => require(['@/pages/setUp/commission_v2/shopSide/product/list.vue'], res), // 门店产品提成列表
    CommissionProduct_editPlans: res => require(['@/pages/setUp/commission_v2/shopSide/product/editPlans.vue'], res), // 门店产品提成-设置方案
    CommissionCardList: res => require(['@/pages/setUp/commission_v2/shopSide/card/list.vue'], res), // 门店卡项提成列表
    CommissionCard_editPlans: res => require(['@/pages/setUp/commission_v2/shopSide/card/editPlans.vue'], res), // 门店卡项提成-设置方案
    CommissionServiceList: res => require(['@/pages/setUp/commission_v2/shopSide/service/list.vue'], res), // 门店服务提成列表
    CommissionService_editPlans: res => require(['@/pages/setUp/commission_v2/shopSide/service/editPlans.vue'], res), // 门店服务提成-设置方案

    // 交易设置
    BusinessSet: res => require(['@/pages/setUp/business/Index.vue'], res), // 交易设置
    BusinessBasic: res => require(['@/pages/setUp/business/BusinessBasic.vue'], res), // 交易设置
    ReceiveAccount: res => require(['@/pages/setUp/business/ReceiveAccount.vue'], res), // 交易设置
    OpenUpPay: res => require(['@/pages/setUp/business/OpenUpPay'], res), // 交易设置 - 微信支付
    wechatDetail: res => require(['@/pages/setUp/business/wechatDetail'], res), // 交易设置 - 微信支付 - 详情
    AliPay: res => require(['@/pages/setUp/business/alipay.vue'], res), // 交易设置-支付宝支付-授权
    AliPayInfo: res => require(['@/pages/setUp/business/alipayInfo.vue'], res), // 交易设置-支付宝支付-信息录入
    alipayInfoDetail: res => require(['@/pages/setUp/business/alipayInfoDetail.vue'], res), // 交易设置-支付宝支付-信息录入 - 详情

    // 会员设置
    MemberSet: res => require(['@/pages/setUp/member/MemberSet.vue'], res), // 会员设置主界面
    MemberLevel: res => require(['@/pages/setUp/member/MemberLevel.vue'], res),
    MemberGrow: res => require(['@/pages/setUp/member/MemberGrow.vue'], res),
    MemberPoints: res => require(['@/pages/setUp/member/MemberPoints.vue'], res),
    MemberTagManage: res => require(['@/pages/setUp/member/MemberTagManage.vue'], res),
    AddMemberLevel: res => require(['@/pages/setUp/member/AddMemberLevel.vue'], res),
    // 营销设置
    Marketing: res => require(['@/pages/setUp/marketing/Marketing.vue'], res), // 交易设置
    // 组织架构
    OrganizationIndex: res => require(['@/pages/setUp/organization/index.vue'], res), // 组织架构主页面
    FrameWorkSet: res => require(['@/pages/setUp/organization/components/frameworkManage'], res),
    JobSet: res => require(['@/pages/setUp/organization/components/jobManage'], res),
    AuthSet: res => require(['@/pages/setUp/organization/components/authorityManage'], res),
    CreateNewBrand: res => require(['@/pages/goodsManagement/CreateNewBrand'], res),
    ServiceDetail: res => require(['@/pages/goodsManagement/ServiceDetail'], res),
    ProductDetail: res => require(['@/pages/goodsManagement/ProductDetail'], res),
    MessageReminding: res => require(['@/pages/setUp/marketing/MessageReminding'], res),

    // 全局设置
    GlobalSet: res => require(['@/pages/setUp/global/index'], res),
    CommonSet_shop: res => require(['@/pages/setUp/global/commonSet_shop'], res),
}
export { allComponents }
