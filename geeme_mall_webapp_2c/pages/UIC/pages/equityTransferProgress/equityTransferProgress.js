// pages/UIC//pages/equityTransferProgress/equityTransferProgress.js
var apiAction = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 权益金银行信息
    queryParamBank: {
      accountName: '',
      accountNum: '',
      bankName: '',
      openBank: ''
    },
    // 权益金申请提现
    queryParamApply: {
      brandCustomerId: '',
      brandId: '',
      amount: '',
      storeId: null,
      type: null
    },
    applyId: null,
    status: null,
    brandCustomerId: null,
    SUCCESS_MODAL: false,
    progressInfoList: []     //提现进度列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    apiAction = require('../../../../utils/apiAction.js');

    this.data.applyId = options.id;
    this.data.brandCustomerId = options.brandCustomerId;
    this.setData({
      status: options.status
    })
  },
  onShow() {
    this.weGetApplyProgress()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    apiAction = null;
    this.data = null;
  },

  /**
   * 根据申请记录Id获取申请进度
   */
  weGetApplyProgress() {
    let data = {
      applyId: this.data.applyId,
      customer: false
    }
    return apiAction.getPreMoneyOutApplyProgress(data).then(res => {
      let queryParamBank = {
        accountName: res.accountName,
        accountNum: res.accountNum,
        bankName: res.bankName,
        openBank: res.openBank
      }
      let queryParamApply = {
        brandCustomerId: this.data.brandCustomerId,
        brandId: res.brandId,
        amount: res.progressInfoList[res.progressInfoList.length - 1].amount,
        storeId: res.storeId,
        type: res.progressInfoList[res.progressInfoList.length - 1].type,
        applyId: this.data.applyId
      }
      if (res.progressInfoList) {
        this.setData({
          progressInfoList: res.progressInfoList,
          queryParamBank,
          queryParamApply
        })
      }
    })
  },
  // 取消申请操作
  onTapCancle() {
    this.setData({
      SUCCESS_MODAL: true
    })
  },
  cancelPreMoneyOutApply() {
    let data = {
      applyId: this.data.applyId
    }
    return apiAction.cancelPreMoneyOutApply(data).then(res => {
      console.log(res)
      if (res.success) {
        wx.navigateBack({
          delta: 1
        });
      }
    })
  },
  // 弹框操作
  jumpBack() {
    this.setData({
      SUCCESS_MODAL: false
    })
  },
  jumpGiftCard() {
    this.cancelPreMoneyOutApply()
  },
  // 修改申请
  onTapEdit() {
    const params = {
      queryParamBank: JSON.stringify(this.data.queryParamBank),
      queryParamApply: JSON.stringify(this.data.queryParamApply),
      type: 'edit'
    }
    this.$route('/pages/UIC/pages/equityTransfer/equityTransfer', params)
  }
})