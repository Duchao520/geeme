let state = {
  // 以下数据改版后弃用 ↓↓↓↓↓↓
  settleAccountsInfo: {
    payTypeNumber: 100,
    advancesPayType: 100
  },
  selectedProduct: [],
  paymentModeId: null,
  consumerServiceOrderInfo: {
    serialCode: null,
    consumerGoodsOrderInfoList: [],
    goodsType: null,
    serviceTime: null
  },
  currentChooseTypeAndSortOneId: {
    sortGoodsType: 'service',
    billGoodsType: null,
    //不要随便更改：因为“全部”这个选项，产品和服务的都是null，但是叶磊的是0
    sortOneId: {
      service: null,
      product: null,
      card: 0,
      freeCard:0
    }
  },
  /**
   * 是否处于重新加载的过程中，该过程之前需要存数据，该过程之后需要拿走和清除相关数据
   * 1.为true的时机：在页面刷新，和页面载入初始化结束之前的这一段时间
   *      为true做什么？
   *          保存所选的服务，以及是否保存所选择的服务时
   *
   * 2.置为false的时机：在检测到是true，并进行了一系列的数据操作之后
   */
  onReload: false,
  listOfMemberLevelPrices: [],
  numberOfPendingPaymentsForm: {//为什么这么写？是为了表单验证。为什么写在这里？是为了在得到账单总价的时候显示在自助结算的框框里
    numberOfPendingPayments: null
  },
  // 以上数据改版后弃用 ↑↑↑↑↑↑ 

  // 改版后沿用部分原数据 ↓↓↓↓↓↓
  billId: null, // 账单id // ==结算的==
  isCount: true, // - 计客数
  appointId: null, // 预约开单的预约单id
  billOrigin: null, // 开单来源 -> 取单:cashierList; 预约开单:appointment; 快速开单、客户列表开单:null;
  selectedCard: [], // 购买的卡(含：新开、续卡、自由开卡、取单后删除的卡)
  serviceTime: null, // 服务时间
  paperOrderId: null, // - 纸单号
  serialCode: null, // - 服务单号
  consumerOrderId: null, // 取单开单的服务单号 // ==挂单的==
  unServicedOrders: null, // 未服务的订单/未核销的产品订单
  billingStaff: { // 开单人
    name: null,
    image: null,
    staffId: null,
    levelId: null,
  },
  customerInfo: { // 客户
    id: null,
    sex: null,
    name: null,
    mobile: null,
    memberLevel: null,
    headPortrait: null,
  },
  carPosition: { // 购物车坐标
    x: 0,
    y: 0
  },
  goodsViewWithImg: 'card', // 是否用图片展示服务、产品 'card' => img; 'list' => text
  protectedGoodsType: null, //card || goods 受保护的商品分类，在从收款台取单的时候以及点击了结算按钮之后会受保护（不可切换至本就不可选在一起的分类），为null的时候为不受保护
  // 改版后沿用部分原数据 ↑↑↑↑↑↑

  // 改版后新启用的数据 ↓↓↓↓↓↓
  selectedGoods: [], // 已经选择的服务、产品, 如果是取单后删除的，保留数据在数组内，按delete字段隐藏，需要提交给后端
  leftNavBarTypes: ['service', 'product', 'card', 'renewal_card'], // 服务(新零售版没有), 产品, 卡项(新开、自由卡), 续卡升级,
  currentLeftType: 'service', // 默认是服务， 如果没有服务的行业， 次优先级为产品
  currentTopStatus: { // 存储各种左侧导航下的当前激活的顶部导航id
    service: null, // 服务项目默认激活的id : null => 全部
    product: null, // 产品项目默认激活的id : null => 全部
    card: null, // 卡项项目默认激活的 id=> 0:全部(文档是0 null也可以) 1:储值卡， 2：身份卡，3：次卡，4：时间卡
    renewal_card: null, // 这里后端还没有筛选字段? 前端自己实现以下? cardType = 0: 身份卡, 1: 储值卡, 2:次卡,3:时间卡 // 续目前只有null,0,1;
  },
  compareMemberLevelPrice: {}, // 存放服务、产品 - 会员价（成长会员价）的比对数据
  createTime: null, // 下单时间
  selectedPrepaidCardForPay: {
    customerCardId: null
  }, // 支付用的储值卡，用组件传递效率太慢
  selectedIdentityCardForPay: {
    customerCardId: null
  }, // 支付用的储值卡，用组件传递效率太慢 - 身份卡用统一的组件
  usbReaderCode: '', // 存储的手牌号
  paymentWay: [], // 支付方式
  // 改版后新启用的数据 ↑↑↑↑↑↑
};
export default state;
