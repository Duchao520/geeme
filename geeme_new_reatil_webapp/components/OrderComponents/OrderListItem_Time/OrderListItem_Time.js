Component({
  lifetimes:{
    attached(){
      let text, attr;
      const curPageName = this.$getCurPageName()
      if (curPageName === 'productOrderList'){
        switch (this.data.orderItem.orderStatus) {
          case 'WAITING_PAY':
            text = ''
            break;
          case 'WAITING_DELIVER':
            text = '付款时间'
            attr = 'paymentTime'
            break;
          case 'WAITING_CONFIRM':
            text = '发货时间'
            attr = 'deliverStart'
            break;
          case 'WAITING_ASSESSMENT':
            text = '发货时间'
            attr = 'deliverStart'
            break;
          case 'FINISHED':
            text = '评价时间'
            break;
          case 'GROUP_BUY_WAIT':
            text = '支付时间'
            attr = 'paymentTime'
            break;
        }
      }
      this.setData({
        'state.text':text,
        'state.attr':attr || 'modifyTime',
        curPage:curPageName
      }) 
    }
  },
  properties: {
    orderItem:{
      type:Object,
      value:null
    }
  },
  data: {
    state:null,
  },
})
