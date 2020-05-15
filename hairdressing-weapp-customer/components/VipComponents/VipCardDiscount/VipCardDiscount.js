// components/VipComponents/VipCardDiscount/VipCardDiscount.js
Component({
  properties: {
    service:Array,  // 服务项目
    product:Array, // 产品项目
  },
  data: {

  },
  methods: {
    close(){
      this.triggerEvent('closeDiscount')
    }
  }
})
