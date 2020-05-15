// components/Card/AddressCard/AddressCard.js
Component({
  lifetimes:{
    attached(){
      if(this.data.showSelect){
        this.setData({
          showLeft:true
        })
      }

      if(this.data.showEdit || this.data.showArrow){
        this.setData({
          showRight:true
        })
      }
    }
  },
  properties: {
    item:Object,
    showEdit:{
      type:Boolean,
      value:false
    },
    showArrow:{
      type:Boolean,
      value:false
    },
    showSelect:{
      type:Boolean,
      value:false
    },
    isSelected:Boolean
  },
  data: {
    showLeft:false,
    showRight:false,
  },
  methods: {
    jump(){
      if(this.data.showEdit){
        this.$route('/pages/UIC/pages/shippingAddress_edit/shippingAddress_edit', {id: this.data.item.id})
      }else if(this.data.showArrow){

      }
    },
    select(){
      if(!this.data.showSelect) return
      this.triggerEvent('selectAddress', this.data.item)
    }
  }
})
