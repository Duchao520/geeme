// components/Card/RedPacketCard/RedPacketCarad.js
Component({
  properties: {
    item:Object,
    type:{
      type:Number,
      value:0
    }
  },
  data: {
    popAll:false
  },
  methods: {
    displayAll(){
      const info = this.data.item.customerRedPacketDetailInfo
      if(info.packetUseStrategy != 3) return
      this.$setData({
        popAll:true
      })
    },
    prevent(){}
  }
})
