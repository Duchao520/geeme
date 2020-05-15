// components/Card/FansCard/FansCard.js
const fetch = require('../../../utils/fetch.js')
Component({
  properties: {
    info:Object
  },
  data: {

  },
  methods: {
    follow(e){
      const {attentived, id} = e.currentTarget.dataset
      fetch.weStaffDynamicAttentive({ beAttentiveUserId: id, attentive: !attentived}).then( data => {
        if(data.success){
          this.setData({
            'info.attentived':!attentived
          })
        }else{
          wx.showToast({
            title: data.message,
            icon:'none'
          })
        }
      })
    }
  }
})
