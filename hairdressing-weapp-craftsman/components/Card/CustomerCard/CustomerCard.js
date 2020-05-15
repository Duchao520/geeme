// components/Card/CustomerCard/CustomerCard.js
Component({
  properties: {
    item:Object,
    selected:{
      type:Boolean,
      value:false
    },
    canSelect:{
      type:Boolean,
      value:false
    }
  },
  data: {

  },
  methods: {
    jumpConsumptionBillOne(){
      this.$route('/pages/TC/pages/consumptionBillOne/consumptionBillOne', {id:this.data.item.brandCustomerId})
    },
    jumpChooseTime(){
      this.$route('/pages/TC/pages/chooseTime/chooseTime', {customerId:this.data.item.customerId})
    },
    jumpCustomerDetail(e){
      if(this.data.canSelect) return
      this.$route('/pages/SC/pages/customerDetail/customerDetail', { id: e.currentTarget.dataset.id })
    }
  }
})
