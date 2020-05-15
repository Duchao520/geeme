// pages/TC/pages/consumptionBillTwo/consumptionBillTwo.js
const fetch = require('../../../../utils/fetch.js')
const myUtil = require('../../../../utils/myUtil.js')

Page({
  data: {
    customerId: null,
    serviceArr: null, // 服务列表
    assistantList: null, // 助理列表
    serviceTime: null, // 服务时间
    unionOrder: null, // 并单时的订单信息
  },
  computed: {
    _totalPrice() {
      if (!this.data.serviceArr) return 0
      let total = 0
      // 若有并单信息
      if (this.data.unionOrder) {
        for (const v of this.data.unionOrder.consumerGoodsOrderInfoList) {
          total += v.unitFinalPrice
        }
      }
      for (const v of this.data.serviceArr) {
        // 核销订单才计入总价
        if (!v.goodsOrderId) {
          total += v.selectedSpecification.count * v.selectedSpecification.specialPrice
          console.log(total)
        }
      }
      return total
    }
  },
  onLoad(options) {
    const appointment = this.$take('appointment')
    let serviceArr
    if(appointment){
      serviceArr = []
      for (const v of appointment.serviceInfoForAppointments) {
        serviceArr.push({
          goodsType: 'service',
          image: v.image,
          name: v.name,
          serviceId: v.serviceId,
          selectedSpecification: {
            count: v.count,
            id: v.specificationId,
            name: v.specificationName,
            specialPrice: v.price,
            time: v.time
          },
        })
      }
    }else {
      serviceArr = this.$take('serviceArr')
      this.isCount = JSON.parse(options.isCount)
    }
    console.log(serviceArr);
    // 初始化工位
    if (serviceArr && serviceArr.length){
      for(const v of serviceArr){
        v.stationList = new Array(v.staffLevelNumber || 1)
      }
    }
    this.$setData({
      serviceArr: serviceArr,
      unionOrder: this.$take('unionOrder') || null,
    })

    this.formatVerifyOrders()
    console.log('待并单中的信息', this.data.unionOrder)
    console.log('本次选择的信息', Object.assign({}, this.data.serviceArr))
    console.log(this.data.serviceArr)
    this.data.customerId = options.customerId
    this.data.serviceTime = options.serviceTime
    this.getStaffList()
  },
  // 格式化待核销订单信息，使之与本次选择的信息一致
  formatVerifyOrders() {
    const _verifyOrders = this.$take('verifyOrders')
    console.log('待核销订单信息', _verifyOrders)
    if (!_verifyOrders) return

    const verifyOrders = []
    for (const v of _verifyOrders) {
      verifyOrders.push({
        serviceId:v.serviceId,
        goodsType: v.goodsType,
        goodsOrderId: v.goodsOrderId,
        snapshotId: v.serviceSnapshotId,
        image: v.image,
        name: v.serviceName,
        selectedSpecification: {
          name: v.specificationName,
          time: v.serverTime,
          specialPrice: v.price,
          count: v.count,
          id: v.snapshotId,
          specificationId: v.specificationId,
        }
      })
    }
    this.$setData({
      serviceArr: this.data.serviceArr.concat(verifyOrders)
    })

    // 请求各个服务的工位数量
    let service, attr
    for(let i=0; i<this.data.serviceArr.length; i++){
      service = this.data.serviceArr[i]
      if(service.goodsOrderId){
        if (service.goodsType === 'service'){
          this.$get(`/weGetServiceWorkStationInfoById/${service.serviceId}`).then(data => {
            attr = `serviceArr[${i}].stationList`
            this.$setData({
              [attr]: new Array(data.workStationCount)
            })
          })
        }else{
          this.$setData({
            [attr]: new Array(1)
          })
        }
      }
    }

  },
  // 获取员工列表及提成方案
  getStaffList() {
    const serviceInfoList = []
    for (const v of this.data.serviceArr) {
      serviceInfoList.push({
        serviceSnapshotId: v.snapshotId ? v.snapshotId : v.serviceId,
        type: v.goodsType == 'service' ? 'service' : 'sales'
      })
    }
    fetch.weGetSimpleStaffListForOrder(serviceInfoList).then(data => {
      this.commission_product = this.setAllocationNumber(data.storeAllocationForSales) // 产品提成方案
      this.commission_service = this.setAllocationNumber(data.storeAllocationForService) // 服务提成方案
      this.$setData({
        loadStaffAndCommission: true,
        assistantList: data.simpleStaffInfo, // 全部员工列表
      })
    })
  },
  // 设置提成方案的最大人数
  setAllocationNumber(allocationData) {
    if (!allocationData) return
    let maxNumber = 0;
    if (allocationData.autoAllocate) {
      maxNumber = 5
    } else {
      for (const v of allocationData.allocationModel) {
        if (v.numberOfPeople > maxNumber) {
          maxNumber = v.numberOfPeople
        }
      }
    }
    allocationData.maxNumber = maxNumber
    return allocationData
  },
  // 选择工位
  selectStation(e) {
    const {
      index_station,
      index_service,
      service_id,
      goods_type
    } = e.currentTarget.dataset
    this.opService = this.data.serviceArr[index_service]
    this.$setData({
      opStationIndex: index_station,
      selectedServers: this.opService.stationList[index_station] || [],
    })
    this.opServiceIndex = index_service
    if (goods_type == 'service') {
      fetch.getWeStaffsCanDoService(service_id, index_station + 1).then(data => {
        const list = myUtil.replaceKey(data.weStaffInfoList, 'avatar', 'headPortrait')
        this.$setData({
          canSelectedServers: list
        })
      })
    } else {
      this.$setData({
        canSelectedServers: this.data.assistantList
      })
    }
  },
  // 关闭弹框
  popdown() {
    this.$setData({
      opStationIndex: false,
      selectedServers: []
    })
  },
  // 弹框中点击服务者
  chooseStationServer(e) {
    const {
      item
    } = e.currentTarget.dataset
    const selectedServers = this.data.selectedServers || []

    let flag = true
    if (selectedServers.length) {
      // 若已选中则取消选中
      for (let i = 0; i < selectedServers.length; i++) {
        if (selectedServers[i].id === item.id) {
          selectedServers.splice(i, 1)
          flag = false
        }
      }
    }
    if (flag) {
      if (selectedServers.length === 5) {
        return wx.$toast('最多只能选择五位服务者')
      }
      selectedServers.push(item)
    }
    this.$setData({
      selectedServers
    })
  },
  // 确认选择工位
  confirmStation() {
    const index_service = this.opServiceIndex
    const index_station = this.data.opStationIndex

    const servers = JSON.parse(JSON.stringify(this.data.selectedServers))
    const commission = this.opService.goodsType == 'service' ? this.commission_service : this.commission_product
    for (let i = 0; i < servers.length; i++) {
      servers[i].ratio = getAllocationValue(commission, servers.length, i)
      servers[i].isChosen = false
    }

    const attr = `serviceArr[${index_service}].stationList[${index_station}]`
    this.$setData({
      [attr]: servers
    })
    this.popdown()
  },
  // 输入框调整提成比例
  adjustRatio(e) {
    const { index_service, index_station, index_server, goods_type } = e.currentTarget.dataset
    const commission = goods_type == 'service' ? this.commission_service : this.commission_product
    if(!commission.enableAdjust) return
    const server = this.data.serviceArr[index_service].stationList[index_station][index_server]
    this.$setData({
      opServer: server
    })
    this.attrForConfirmAdjustRatio = `serviceArr[${index_service}].stationList[${index_station}][${index_server}].ratio`
  },
  // 确认更改提成比例
  confirmAdjustRatio(e) {
    this.$setData({
      [this.attrForConfirmAdjustRatio]: e.detail.value
    })
    this.stopAdjustRatio()
  },
  // 取消更改提成比例(点击遮罩层)
  stopAdjustRatio() {
    this.$setData({
      opServer: null,
    })
  },
  // 更改员工是否指定
  changeIsChosen(e) {
    const { index_service, index_station, index_server, is_chosen } = e.currentTarget.dataset
    const attr = `serviceArr[${index_service}].stationList[${index_station}][${index_server}].isChosen`
    this.$setData({
      [attr]: !is_chosen
    })
  },
  // 留言
  inputRemark(e) {
    const index = e.currentTarget.dataset.index
    this.data.serviceArr[index].storeRemark = e.detail.value
  },
  // 确认开单
  createOrder() {
    let pct
    if (this.data.serviceArr){
      for (const a of this.data.serviceArr) {
        if (a.stationList) {
          for (const b of a.stationList) {
            pct = 0
            if (b && b.length) {
              for (const c of b) {
                pct += c.ratio
              }
              if (pct != 100) {
                return wx.$toast('提成比例设置不正确')
              }
            }
          }
        }
      }
    }
    

    const params = {
      isCount:this.isCount,
      brandId: wx.$getStorage('brandId'),
      storeId: wx.$getStorage('storeId'),
      customerId: this.data.customerId,
      staffId: wx.$getStorage('staffId'),
      serviceTime: this.data.serviceTime || new Date().Format('yyyy-MM-dd hh:mm'),
      tempFinalPrice: this.data._totalPrice,
      serviceInfos: []
    }
    // 如果有并单
    if (this.data.unionOrder) {
      params.id = this.data.unionOrder.id
    }
    let serviceInfo
    let assistantOrSalers
    
    for (const a of this.data.serviceArr) {
      serviceInfo = {
        goodsType: a.goodsType,
        count: a.selectedSpecification.count,
        staffId: a.staffId,
        storeRemark: a.storeRemark || '',
        snapshotId: a.selectedSpecification.snapshotId || a.selectedSpecification.id,
        specificationId: a.selectedSpecification.specificationId || a.selectedSpecification.id,
      }
      // 如果是选择的未核销订单，则加上goodsOrderId,否则加上tempFinalPrice
      if (a.goodsOrderId) serviceInfo.goodsOrderId = a.goodsOrderId
      else serviceInfo.tempFinalPrice = a.selectedSpecification.count * a.selectedSpecification.specialPrice
      // 补充工位信息
      function setStation(station, stationIndex){
        if(!(station && station.length)){
          return null
        }
        const list = []
        for(const v of station){
          list.push({
            staffId:v.id,
            staffName:v.name,
            postId:v.levelId,
            postName:v.levelName,
            ratio:v.ratio,
            isChosen:v.isChosen,
            workStation:stationIndex,
            headPortrait:v.headPortrait
          })
        }
        return list
      }
      if (a.stationList){
        if (a.goodsType === 'production') {
          serviceInfo.assistantOrSalers = setStation(a.stationList[0])
        } else {
          serviceInfo.stationOne = setStation(a.stationList[0], 1)
          serviceInfo.assistantOrSalers = setStation(a.stationList[1], 2)
          serviceInfo.stationThree = setStation(a.stationList[2], 3)
        }
      }
      params.serviceInfos.push(serviceInfo)
    }
    if (this._confirm) return
    this._confirm = true
    fetch.weStaffCreateConsumerOrder(params).then(data => {
      this._confirm = false
      if (data.success) {
        wx.reLaunch({
          url: '/pages/TC/pages/consumptionBillSuccess/consumptionBillSuccess',
        })
      } else {
        wx.showToast({
          title: data.message,
          icon: 'none'
        })
      }
    })
  },
  // 监听键盘高度变化
  onBoardHeight(e){
    this.$setData({
      boardHeight:e.detail.height
    })
  },
  prevent(){}
})

// 设置员工提成比例
function getAllocationValue(commission, serverNum, serverIndex) {
  if (commission.autoAllocate) {
    if (serverNum == 3) {
      if (serverIndex == 0) return 34
      else return 33
    } else {
      return 100 / serverNum
    }
  } else {
    if (serverNum == 1) {
      return 100
    } else {
      var model
      for (var i = 0; i < commission.allocationModel.length; i++) {
        model = commission.allocationModel[i]
        if (model.numberOfPeople == serverNum) {
          switch (serverIndex) {
            case 0:
              return model.allocationModel.first
            case 1:
              return model.allocationModel.second
            case 2:
              return model.allocationModel.third
            case 3:
              return model.allocationModel.forth
            case 4:
              return model.allocationModel.fifth
          }
        }
      }
    }
  }
}