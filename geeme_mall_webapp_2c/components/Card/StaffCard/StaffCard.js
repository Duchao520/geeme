// components/Card/StaffCard/StaffCard.js
const util = require('../../../utils/util.js')
const follow = require('../../../utils/apiAction.js').weDynamicAttentive
Component({
  externalClasses: ['my-class'],
  properties: {
    item:Object,
    hideReserve:{
      type:Boolean,
      value:false,
    },
    selected:{
      type:Boolean,
      value:false
    }
  },
  methods: {
    // 预约
    reserve(e){
      wx.removeStorageSync('appointment')
      const staffId = e.currentTarget.dataset.id;
      if (util.addhair(staffId)) {
        this.$route('/pages/TC/pages/choosetime/choosetime')
      }
    },
    jumpStaffDetail(e){
      const {id, tabindex} = e.currentTarget.dataset
      const query = {
        hairId:id
      }
      if(tabindex) query.tabIndex = tabindex
      this.$route('/pages/SC/pages/hairdetails/hairdetails', query)
    },
    follow(){
      wx.$showLoading()
      const { followed, userId } = this.data.item
      const params = {
        attentive: !followed,
        beAttentiveUserId: userId
      }

      follow(params).then(data => {
        wx.$hideLoading()
        if (data.success) {
          this.$setData({
            'item.followed': !followed
          })
        } else {
          wx.showToast({
            title: data.message,
            icon: 'none'
          })
        }
      })
    }
  }
})
