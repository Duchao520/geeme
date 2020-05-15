// pages/UIC//pages/equityTransfer/equityTransfer.js
var apiAction = require('../../../../utils/apiAction.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    // 顶部吸附相关
    scrollTop: 0,
    isFixed: false,
    tabs: ['选择门店', '选择转出方式'],
    activeTab: -1,
    storeInfoList: ['选择门店'],    // 获取门店列表
    sortStores: ['选择门店'],       // 门店数组列表
    sortMethods: ['选择转出方式', '转至钱包余额', '转至银行卡'],
    // 权益金校验字段
    queryParamCheck: {
      amount: 0,
      brandCustomerId: '',
      storeId: null
    },
    // 权益金金额提现
    withdrawal: {
      canOut: false
    },
    // 权益金申请提现
    queryParamApply: {
      brandCustomerId: '',
      brandId: '',
      amount: '',
      storeId: null,
      type: null
    },
    // 权益金银行信息
    queryParamBank: {
      accountName: '',
      accountNum: '',
      bankName: '',
      openBank: ''
    },
    maxAmount: '',   // 最大转出权益金金额
    typeName: '',
    EQUITY_SUBMIT: false,
    submitSwitcher: false,
    SUCCESS_MODAL: false,
    type: 'add'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.getBrand(brand => {
      this.setData({ phone: brand.phone })
    })
    if (options.type == undefined) {
      this.data.queryParamCheck.brandCustomerId = options.brandCustomerId
      this.data.queryParamApply.brandCustomerId = options.brandCustomerId
      this.data.queryParamApply.brandId = options.brandId
      this.data.type = 'add'
    } else {
      let queryParamBank = JSON.parse(options.queryParamBank)
      let queryParamApply = JSON.parse(options.queryParamApply)
      this.data.queryParamCheck.brandCustomerId = queryParamApply.brandCustomerId
      this.data.queryParamCheck.storeId = queryParamApply.storeId
      this.data.type = 'view'
      let name = queryParamApply.type === 1 ? '转至钱包余额' : '转至银行卡'
      this.setData({
        queryParamBank,
        queryParamApply,
        'tabs[1]': name,
        typeName: name,
        EQUITY_SUBMIT: true
      })
    }
  },
  onShow() {
    // 权益门店列表
    this.getStoreList()
    if (this.data.queryParamCheck.storeId == null) return
    // 权益金校验
    this.checkPreMoneyOut()
  },
  // 权益门店列表
  getStoreList() {
    const { brandCustomerId } = this.data.queryParamCheck
    let params = {
      brandCustomerId
    }
    return apiAction.getStoreList(params).then(res => {
      // console.log(res)
      if (res.storeInfoList == null) return
      let sortStores = ['选择门店'];
      let { storeId } = this.data.queryParamCheck, name = '';
      for (let i in res.storeInfoList) {
        sortStores.push(res.storeInfoList[i].storeName)
        if (res.storeInfoList[i].storeId == storeId) {
          name = res.storeInfoList[i].storeName
        }
      }
      this.setData({
        sortStores,
        storeInfoList: res.storeInfoList
      })
      // console.log(storeId)
      if (storeId !== null) {
        this.setData({
          'tabs[0]': name,
        })
      }
    })
  },
  // 权益金校验
  checkPreMoneyOut() {
    const { queryParamCheck } = this.data
    return apiAction.checkPreMoneyOut(queryParamCheck).then(res => {
      // console.log(res)
      let maxAmount = res.preMoney - res.frozenMoney;
      maxAmount = maxAmount.toFixed('2')
      this.setData({ 
        withdrawal: res,
        maxAmount
       })
    })
  },
  // 获取输入权益金体现信息
  // 提现金额
  bindAmount(e) {
    let { queryParamApply } = this.data
    let patrn = /^\d+(\.\d+)?$/;
    if (!patrn.exec(e.detail.value)) {
      wx.showToast({
        title: '提现金额输入不合法~',
        icon: 'none'
      })
      return
    }
    queryParamApply.amount = e.detail.value.replace(/\s/g, "")
    this.setData({
      queryParamApply
    });
  },
  // 银行信息
  bindValue(e) {
    // console.log(e)
    let { key } = e.target.dataset,
      { value } = e.detail,
      { queryParamBank } = this.data;
    queryParamBank[key] = value.replace(/\s/g, "");  //过滤空格
    this.setData({
      queryParamBank
    });
  },
  valiData() {
    let { queryParamApply, queryParamBank } = this.data;
    if (queryParamApply.type == null) {
      wx.showToast({
        title: '选择转出方式',
        icon: 'none'
      })
      return false
    }
    if (Number(queryParamApply.amount <= 0)) {
      wx.showToast({
        title: '请填写提现金额',
        icon: 'none'
      })
      return false
    };
    if (queryParamApply.type == 2) {
      for (var i in queryParamBank) {
        if (queryParamBank[i] == 'null' || !queryParamBank[i]) {
          wx.showToast({
            title: '请填写完整银行卡信息',
            icon: 'none'
          })
          return false
        };
      }
    }
    return true;
  },
  // 提交请求
  submit() {
    this.setData({
      submitSwitcher: this.valiData()
    })
    let { submitSwitcher, queryParamApply, queryParamBank } = this.data;
    if (!submitSwitcher) return;
    this.setData({ submitSwitcher: false })
    if (queryParamApply.type == 2) {
      queryParamApply = { ...queryParamApply, ...queryParamBank}
    }
    try {
      if (this.data.type === 'view') {
        apiAction.updatePreMoneyOutApply(queryParamApply).then(res => {
          if (res.success) {
            wx.navigateBack({
              delta: 1
            });
          }
        })
      } else {
        apiAction.createPreMoneyOutApply(queryParamApply).then(res => {
          if (res.success) {
            this.setData({
              SUCCESS_MODAL: true,
              submitSwitcher: true
            })
          }
        })
      }
    } finally {
      this.setData({ submitSwitcher: true })
    }
  },
  // 选择门店
  selectStore(e) {
    let { EQUITY_SUBMIT } = this.data
    this.data.queryParamCheck.storeId = e.detail.index === 0 ? null : this.data.storeInfoList[e.detail.index - 1].storeId
    this.data.queryParamApply.storeId = e.detail.index === 0 ? null : this.data.storeInfoList[e.detail.index - 1].storeId
    EQUITY_SUBMIT = e.detail.index === 0 ? false : true
    this.setData({
      'tabs[0]': e.detail.item,
      activeTab: -1,
      EQUITY_SUBMIT
    })
    if (e.detail.index === 0) return
    this.checkPreMoneyOut();
  },
  // 选择转出方式
  selectSort(e) {
    const { queryParamApply, typeName } = this.data
    queryParamApply.type = e.detail.index === 0 ? null : e.detail.index
    this.setData({
      queryParamApply,
      'tabs[1]': e.detail.item,
      typeName: e.detail.item,
      activeTab: -1
    })
  },
  // 改变吸附状态
  changeFix(e) {
    this.setData({
      isFixed: e.detail
    })
  },
  // 选择弹框
  popup(e) {
    // console.log(e)
    const index = e.detail.index
    this.$setData({
      activeTab: index
    })
  },
  // 全部转出权益金
  onTapAllWithdral() {
    const { queryParamApply, maxAmount } = this.data
    queryParamApply.amount = maxAmount
    this.setData({ queryParamApply })
  },
  // 转出记录
  onTapRecords() {
    this.$route("/pages/UIC/pages/equityTransferRecords/equityTransferRecords", { brandCustomerId: this.data.queryParamCheck.brandCustomerId})
  },
  //返回上一页
  jumpBack() {
    wx.navigateBack({
      delta: 1
    });
  },
  //查看礼品卡
  jumpGiftCard() {
    let { queryParamApply } = this.data
    queryParamApply.amount = ''
    this.setData({
      queryParamApply,
      queryParamBank: {
        accountName: '',
        accountNum: '',
        bankName: '',
        openBank: ''
      },
      SUCCESS_MODAL: false
    })
    // 权益金校验
    this.checkPreMoneyOut()
  },
})