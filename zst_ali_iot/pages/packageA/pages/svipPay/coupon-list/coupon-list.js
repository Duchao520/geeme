var app = getApp();

Component({
  mixins: [],
  data: {
    totalAmount: ''
  },
  props: {
    onCloseCouponList: () => console.error('not find'),
    onChooseCoupon: () => console.error('not find'),
    onOnlyUseCoupon: () => console.error('not find'),
    COUPON_LIST: '',
    COUPON_ACTIVE_INDEX: ''
  },
  didMount() {
    this.setData({
      totalAmount: app.store.totalAmount.getStore().data
    })
  },
  didUpdate() {},
  didUnmount() {},
  methods: {
    close(){
      this.props.onCloseCouponList(); 
    },
    chooseCoupon(event){
      var {index} = event.target.dataset,
          COUPON_LIST = this.props.COUPON_LIST,
          _self = this;
        if(Number(_self.data.totalAmount) >= COUPON_LIST[index].consumeMoney * 100 / 100 && Number(_self.data.totalAmount)){
          if(index === _self.props.COUPON_ACTIVE_INDEX){    //再次选择同一张,放弃使用当前优惠券
            _self.props.onChooseCoupon('','')
            // _self.$emit('chooseCouponEvent','');
          }else{
            if(COUPON_LIST[index].isAllowSuperposition == '0'){
              my.confirm({
                title: '温馨提示',
                content: '该优惠券只可单独使用，是否继续',
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                success: (res) => {
                  if(res.confirm){
                    _self.props.onOnlyUseCoupon(COUPON_LIST[index],index);
                    _self.close();
                  }
                },
              });
            }else{
              _self.props.onChooseCoupon(COUPON_LIST[index],index)
              _self.close();
            }
          }
        }
      
    }
  },
});
