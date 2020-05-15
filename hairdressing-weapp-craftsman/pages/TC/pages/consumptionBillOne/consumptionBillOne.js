const fetch = require('../../../../utils/fetch.js')
const util = require('../../../../utils/util.js')
Page({
  data: {
    tabList:['服务', '产品'],
    curTab: 0,
    dataList: null,
    serviceArr:null,
    customerInfo:null,
    date:'',
    selectDate:'',
    time:'',
    selectTime:'',
    popTime:false,
    popOrder:false,
    unionOrder:null,   // 能并单时取到的订单信息
    serviceTree:null,
    productTree:null,
    isCount:true, // 计客数
  },
  computed:{
    _totalPrice(){
      let total = 0
      if(this.data.serviceArr){
        for (const v of this.data.serviceArr) {
          total += v.selectedSpecification.count * v.selectedSpecification.specialPrice
        }
      }
      if(this.data.productArr){
        for (const v of this.data.productArr) {
          total += v.selectedSpecification.count * v.selectedSpecification.specialPrice
        }
      }

      return total
    },
  },
  onLoad(options){
    this.from = options.from
    console.log('页面参数', options)
    // 扫码进入
    if(options.scene){
      const obj = util.sceneToJson(options.scene)
      console.log('解析后obj对象', obj)
      this.brandCustomerId = obj.id
      this.brandId = obj.brandId
    // 其他页面进入
    }else{
      this.brandCustomerId = options.id
    }
    wx.$showLoading()
    // 检查品牌是否匹配
    this.checkSameBrand()
    // 获取用户信息
    this.getCustomerInfo()
    // 获取服务树
    this.getServiceTree()
  },
  // 检查品牌是否匹配
  checkSameBrand(){
    if(this.brandId && this.brandId != wx.$getStorage('brandId')){
      this.$setData({
        incorrectBrand:true
      })
    }else{
      // 检查并单
      this.checkUnionOrder().then(res => {
        this.checkUnservicedOrder()
      })
      // 检查未核销订单
    }
  },
  // 检查有无未结算订单
  checkUnservicedOrder(){
    fetch.weGetUnservicedOrderList(this.brandCustomerId).then( data => {
      if(data.orderList && data.orderList.length){
        let unionOrder = this.data.unionOrder;
        data.orderList.forEach(ele => {
          ele.unionFlag = false;
          if (unionOrder){
            unionOrder.consumerGoodsOrderInfoList.forEach(item => {
              if (item.goodsOrderId == ele.goodsOrderId) {
                ele.unionFlag = true;
              }
            })
          }
          
        })
        this.$setData({
          unservicedOrder: data.orderList,
          popOrder:true
        })
      }     
    })
  },
  // 检查有无并单
  checkUnionOrder(){
    if (this.from == 'serviceOrderDetail'){
      this.$setData({
        unionOrder:this.$take('unionOrder')
      })
      this.getTime()
      return Promise.resolve({ unionOrder: this.$take('unionOrder')})
    }else{
      return fetch.weStaffCheckUnionOrder(this.brandCustomerId).then(data => {
        if (data.hit) {
          this.$setData({
            unionOrder: data.orderInfo
          });
        }
        this.getTime();
        return {
          unionOrder: data.orderInfo
        }
      })
    }
  },
  // 获取开单时间
  getTime(){
    let date, time
    // 有并单信息时
    if (this.data.unionOrder){
      const arr = this.data.unionOrder.createTime.split(' ')
      date = arr[0]
      time = arr[1]
      const timeArr = time.split(':')
      if (timeArr.length == 3){
        time = [timeArr[0], timeArr[1]].join(':')
      }
    }else{
      const _now = new Date()
      date = util.formatTime3(_now)
      time = util.formatTime6(_now)
    }
    
    this.$setData({
      now:date,
      date,
      time,
      selectDate:date,
      selectTime:time
    })
  },
  // 获取服务树
  getServiceTree(){
    fetch.weGetServiceListByStoreIdAndStaffIds(this.brandCustomerId).then( data => {
      wx.$hideLoading()
      this.$setData({
        serviceTree:data.dataList
      })
    })
  },
  // 获取产品树
  getProductTree(){
    wx.$showLoading()
    fetch.getProductTree(this.brandCustomerId).then( data => {
      wx.$hideLoading()
      this.$setData({
        productTree:data.dataList
      })
    })
  },
  // 获取顾客信息
  getCustomerInfo(){
    fetch.weGetSimpleCustomerInfo(this.brandCustomerId).then( data => {
      this.setData({
        customerInfo:data
      })
    })
  },
  // 切换tab
  switchTab(e){
    const index = e.detail.index
    if(index == 1 && !this.data.productTree){
      this.getProductTree()
    }
    this.$setData({
      curTab:e.detail.index
    })
  },
  // 选择订单
  selectUnservicedOrder(e){
    const {item, index} = e.currentTarget.dataset
    if (!item.orderEnable) return
    if (item.unionFlag)return

    let attr = `unservicedOrder[${index}].selected`
    this.$setData({
      [attr]:!item.selected
    })
  },
  // 确认选择订单
  confirmOrder(){
    const orders = []
    for (const v of this.data.unservicedOrder){
      if(v.selected){
        orders.push(v)
      }
    }
    this.$setData({
      orders,
      popOrder:false
    })
  },
  // 下一步
  addappointment() {
    for(const v of this.data.serviceArr){
      v.goodsType = 'service'
    }

    for(const v of this.data.productArr){
      v.goodsType = 'production'
    }
    this.$place('serviceArr', [...this.data.serviceArr, ...this.data.productArr])
    if(this.data.unionOrder) this.$place('unionOrder', this.data.unionOrder)
    if(this.data.orders) this.$place('verifyOrders', this.data.orders.filter(item => item.selected))
    const serviceTime = this.data.date + ' ' + this.data.time
    this.$route('/pages/TC/pages/consumptionBillTwo/consumptionBillTwo', {customerId:this.data.customerInfo.customerId, serviceTime, isCount:this.data.isCount})
  },
  selectOrder(e){
    const index = e.currentTarget.dataset.index
    const attr = `orders[${index}].selected`
    this.$setData({
      [attr]:!this.data.orders[index].selected
    })
  },
  updateService(e){
    this.$setData({
      serviceArr:e.detail
    })
  },
  updateProduct(e){
    this.$setData({
      productArr:e.detail
    })
  },
  popdown(){
    this.$setData({
      popTime:false,
      popOrder:false
    })
  },
  changeDate(e) {
    this.$setData({
      selectDate: e.detail.value
    })
  },
  changeTime(e) {
    this.$setData({
      selectTime: e.detail.value
    })
  },
  updateDateTime() {
    this.$setData({
      date: this.data.selectDate,
      time: this.data.selectTime,
      popTime: false
    })
  },
  // 跳转客户美丽档案
  jumpCustomerDetail(){
    this.$route('/pages/SC/pages/customerDetail/customerDetail', {id:this.data.customerInfo.customerId})
  },
  // “不能为跨品牌客户开单”modal点击按钮
  modalAction(e){
    switch(e.detail.from){
      case 'button1':
        this.$route('/pages/SC/pages/customer_add/customer_add')
        break;
      case 'button2':
        this.$route('/pages/Login/chooseBrandStore/chooseBrandStore')
        break;
      case 'cover':
        return
    }
    this.$setData({
      incorrectBrand:false
    })
  },
  prevent(){}
})