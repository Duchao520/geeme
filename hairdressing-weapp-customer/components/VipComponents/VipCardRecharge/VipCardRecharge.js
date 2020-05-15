// components/VipComponents/VipCardRecharge/VipCardRecharge.js
Component({
  lifetimes:{
    attached(){
      const app = getApp()
      app.getBrand( (brand) => {
        this.$setData({
          logo:brand.logo
        })
      })
      this.$setData({
        currentRule:this.data.rechargeRules[0]
      })
    }
  },
  properties: {
    // 充值弹窗是否显示
    flagRecharge:{
      type:Boolean,
      value:false
    },
    rechargeRules:Array,  // 充值规则
    info:Object,  // 当前会员卡信息
  },
  data: {
    // 当前所选价格的下标
    index: 0,
    currentRule:null,
  },
  computed:{
    validTime(){
      if(this.data.currentRule){
        const finishTime = this.data.info.finishTime

        const rule = this.data.currentRule
        let timestamp_add
        switch (rule.validUnit) {
          case 'year':
            timestamp_add = rule.validNum * 365 * 24 * 60 * 60 * 1000
            break;
          case 'month':
            timestamp_add = rule.validNum * 30 * 24 * 60 * 60 * 1000
            break;
          case 'day':
            timestamp_add = rule.validNum * 24 * 60 * 60 * 1000
            break;
        }
        const deadline = new Date(finishTime + timestamp_add)
        const deadline_str = deadline.getFullYear() + '年' + (deadline.getMonth() + 1) + '月' + deadline.getDate() + '日'
        return deadline_str
      }
    }
  },
  methods: {
    // 关闭弹窗
    close(){
      this.triggerEvent('closeRecharge')
    },
    // 改变充值金额
    bindPickerChange(e){
      const index = e.detail.value
      this.$setData({
        index,
        currentRule: this.data.rechargeRules[index]
      })
    },
    // 点击支付
    toPay(){
      const currentRule = this.data.currentRule
      const rechargeNum = this.data.info.cardType == 0 ? currentRule.cardPrice : currentRule.cardRechargeNum
      this.triggerEvent('toRecharge', {rechargeNum})
    }
  }
})
