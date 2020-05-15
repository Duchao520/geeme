// components/App/AppModal/AppModal.js
Component({
  properties: {
    show:Boolean,
    title:String,
    content:String,
    button1:{
      type:String,
      value:'取消'
    },
    button2:{
      type:String,
      value:'确定'
    }
  },
  data: {

  },
  methods: {
    action(e){
      const {from} = e.currentTarget.dataset
      this.triggerEvent('action', {from})
    },
    confirm(e){
      this.setData({ show: false})
      this.triggerEvent('confirm')
      const { from } = e.currentTarget.dataset
      this.triggerEvent('action', { from })
    },
    cancle(e){
      this.setData({ show: false })
      this.triggerEvent('cancle')
      const { from } = e.currentTarget.dataset
      this.triggerEvent('action', { from })
    },
    prevent(){}
  }
})
