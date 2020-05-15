<template>
  <div class="index" @click="getonfocus">
    <div class="pay">
      <div class="business">
        <div class="bus_left">
          <img :src="supplierLogo" alt="">
        </div>
        <div class="bus_right">{{shopName}}</div>
      </div>
      <div class="remainMoney">
        <span style="margin-right:40rpx;">当前卡主余额：{{money}}元</span><span> 卡主折扣：{{discountRate*1000/100}}折</span>
      </div>
      <div class="inputContainer">
        ￥<input type="text"
                name="shortprice"
                v-model="totalMoney"
                disabled="disabled"
                placeholder="请咨询商家后输入">
        <div class="input_mask"></div>
      </div>
      <div class="input_inner" @click="closeInner">
        <div class="in_in_le">
          <i  v-if="closeMes ==1"  class="iconfont icon-weigouxuanv2"></i>
          <i v-if="closeMes != 1" class="iconfont icon-tucenggouxuan" style="color:#FDB300;"></i>
        </div>
        <div class="in_in_ri">
          不参与打折金额
        </div>
      </div>
      <div class="input_mes" v-if="closeMes !=1">
        <input type="text"
               name="shortprice"
               v-model="noMoney"
               disabled ="disabled"
               placeholder="输入不参与折扣的金额">
        <div class="input_mask"></div>
      </div>
      <button class="affirm" @click="isSubmit">卡 主 余 额 支 付</button>
    </div>
    <div class='keyboard' v-if="InputHidden">
      <div class='left number'>
        <div data-key="1" :hover-class='active' :hover-stay-time='100' @click.stop='inputPassword'>1</div>
        <div data-key="2" :hover-class='active' :hover-stay-time='100' @click.stop='inputPassword'>2</div>
        <div data-key="3" :hover-class='active' :hover-stay-time='100' @click.stop='inputPassword'>3</div>
        <div data-key="4" :hover-class='active' :hover-stay-time='100' @click.stop='inputPassword'>4</div>
        <div data-key="5" :hover-class='active' :hover-stay-time='100' @click.stop='inputPassword'>5</div>
        <div data-key="6" :hover-class='active' :hover-stay-time='100' @click.stop='inputPassword'>6</div>
        <div data-key="7" :hover-class='active' :hover-stay-time='100' @click.stop='inputPassword'>7</div>
        <div data-key="8" :hover-class='active' :hover-stay-time='100' @click.stop='inputPassword'>8</div>
        <div data-key="9" :hover-class='active' :hover-stay-time='100' @click.stop='inputPassword'>9</div>
        <div data-key="X" :hover-class='active' :hover-stay-time='100' @click.stop='inputPassword'>X</div>
        <div data-key="0" :hover-class='active' :hover-stay-time='100' @click.stop='inputPassword'>0</div>
        <div data-key="." :hover-class='active' :hover-stay-time='100' @click.stop='inputPassword'>.</div>
      </div>
      <div class='right ctr-btn'>
        <div class='ctr-btn-item' :hover-class='active' :hover-stay-time='100' @click.stop='clear'>
          <label class='iconfont icon-shanchu'></label>
        </div>
        <div class='ctr-btn-item' :hover-class='active' :hover-stay-time='100' @click.stop='HiddenMes'>取消</div>
      </div>
    </div>
  </div>
</template>

<script>

  import { getSignIn , getQuery} from '@/common/js/comm';
  import floatTo from '@/common/js/floatTo'
  import Tips from '@/common/js/tips'
  export default {
    name: "index",
    data(){
      return{
        totalMoney:'',
        noMoney:'',
        closeMes:1,

        supplierLogo:'',
        shopName:'',
        money:'',
        id:'',
        discountRate:'',

        InputHidden: false,

        totOrno:'',
        no: '',
        refStoreId: ''
      }
    },
    mounted(){
      var _self = this;
      var par = getQuery();
      _self.shopStoreId = par.shopStoreId;
      _self.no = par.no;
      _self.id = par.id;
      _self.refStoreId = par.refStoreId;
      _self.getCardDetail();
      _self.concatWBT();
    },
    methods: {
      inputPassword(e){
        if(this.totOrno ==1 ) {
          this.totalMoney = `${this.totalMoney}${e.target.dataset.key}`;
        }else if(this.totOrno == 2){
          this.noMoney = `${this.noMoney}${e.target.dataset.key}`;
        }
      },
      HiddenMes() {
        this.InputHidden = false;  //取反 打开关闭小键盘
      },
      getfocus(par){
        var _self = this;
        _self.totOrno = par;
        _self.InputHidden = true;
      },
      getDetail(){
        var mes = floatTo.multiply(Number(this.shopMes.actualReceiveMoney),100);  //元转换成分
        var _data = {
          token:this.$store.state.token,
          storeId:this.shopStoreId,
          price:mes,
        }
        var _this = this;
        getSignIn(_data).then(sec=>{
          _this.$http.bargainDetail(_data,sec).then(res=>{
            if(res.state==1) {
              if (res.data) {
                _this.showActive =1;
                _this.cutDetail = res.data;
                _this.copywritingTitle = res.data.copywritingTitle;
                _this.price = res.data.price;
                var discount = floatTo.divide(res.data.discount ,10);
                _this.currentPrice = floatTo.multiply(_this.price, discount);
                _this.mainImg = res.data.mainImg;
              } else {
                _this.showActive =0;
              }
            }else{
              Tips.toast(`${decodeURIComponent(res.msg)}`,'none');
            }
          })

        })
      },
      clear(){
        var str;
        var _self = this;
        if(_self.totOrno == 1) {
          str = _self.totalMoney;
          _self.totalMoney = str.substr(0, str.length - 1);
        }else if(_self.totOrno == 2){
          str = _self.noMoney;
          _self.noMoney = str.substr(0, str.length - 1);
        }
      },
      getonfocus(){
        var _self = this;
        _self.InputHidden = false;
      },
      isSubmit(){
        var _this = this;
        if(_this.totalMoney == ''){
          Tips.toast('请输入金额','none');
          return false;
        }else if(_this.totalMoney < 0.01){
          Tips.toast('你输入金额有点小哦', 'none');
          return false
        } {
          if(Number(_this.totalMoney) < 0.01){
            Tips.toast('你输入金额有点小哦','none');
            _this.totalMoney = '';
            return false
          }
          if((!(/^\d+(\.\d{1,2})?$/.test(_this.totalMoney) || /^\d$/.test(_this.totalMoney) ))){
            Tips.toast('输入金额精确到分','none');
            _this.totalMoney = '';
            return false
          }
          if(_this.totalMoney <_this.noMoney){
            Tips.toast('输入金额有误，请咨询商家确认','none');
            return false
          }
          if(_this.noMoney != '') {
            if (!(/^\d+(\.\d{1,2})?$/.test(_this.noMoney))) {
              Tips.toast('输入金额要精确到分', 'none');
              _this.noMoney = '';
              return false
            }
          }
          var totle = Number(_this.totalMoney);
          var noMoney = Number(_this.noMoney);

          let disNumber = Number(_this.discountRate) *10;
          var disCou = ((totle-noMoney) - (totle - noMoney) * disNumber/10).toFixed(2);
          var shiji =  (noMoney + (totle- noMoney) * disNumber /10);
          shiji = (Math.round(shiji * 100) / 100);
          wx.showModal({
            title: '订单详情',
            content:  `消费总金额：${totle}元\n卡主抵扣：${disCou}元\n不参与打折金额：${noMoney}元\n实需支付：${shiji}元\n`,
            confirmText:'立即支付',
            success(res) {
              var ll = Number(_this.shopStoreId);
              var _data= {
                token:_this.$store.state.token,
                maincardId:_this.id,
                totalMoney:totle * 1000 / 10,
                shouldMoney:shiji * 100000 / 1000,
                nonPartakeMoney:_this.noMoney *1000/10,
                no: _this.no,
                scanSrc: '1'
              }
              getSignIn(_data).then(sec=>{
                if (res.confirm) {
                  _this.$http.carderMoney(_data,sec).then(result=>{
                    if(result.state ==1){
                      wx.showModal({
                        title: '支付成功',
                        content:`卡余额：${(_this.money - shiji).toFixed(2)}`,
                        success(res){
                          if (res.confirm) {
                            wx.navigateTo({
                              url:`/pages/packageD/pages/cardpaySuc/main?mainCardId=${result.data.mainCardId}&orderNum=${result.data.orderNum}&shopStoreId=${_this.shopStoreId}`
                            })
                          }
                          else if(res.cancel){
                            Tips.toast(`支付取消`,'none');
                          }
                        }
                      })
                    }else{
                      Tips.toast(`${decodeURIComponent(result.msg)}`,'none')
                    }
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              })

            }
          })
        }

      },
      /**
       * 获取卡门店详情
       **/
      getCardDetail() {
        var _self = this;
        var _data = {
          maincardId: String(_self.id),
          token: _self.$store.state.token,
        };
        getSignIn(_data).then(sec => {
          _self.$http.getCardDetail(_data, sec).then(res => {
            if (res.state == 1) {
              _self.supplierLogo = res.data.shop.supplierLogo;
              _self.shopName = res.data.shop.shopName;
              _self.money = res.data.card.money ? floatTo.divide(Number(res.data.card.money),100) : 0;
              _self.discountRate = res.data.card.discountRate;
            }else{
              Tips.toast(`${decodeURIComponent(res.msg)}`,'none');
            }
          })
        })
      },

      concatWBT(){
        var _self = this;
        var WBT = wx.connectSocket({
          url: 'wss://www.myhbsoft.com/wssmzf/',
          success: function (res) {
            console.log(res,'success');
          },
          fail: function (res) {
            console.log(res,'fail');
          },
          complete(res) {
            console.log(res,'complete');
          }
        })
        WBT.onOpen(function () {
          var concat_data = {
            "Type":"connection",
            "storeid":_self.refStoreId
          };
          WBT.send({
            data: JSON.stringify(concat_data)
          });
          var getorder_data = {
            "Type":"getorder",
            "storeid":_self.refStoreId,
            "th":_self.no
          };
          WBT.send({
            data: JSON.stringify(getorder_data)
          });
        })
        WBT.onMessage(
          function (e) {
            var data = JSON.parse(e.data);
            if(data.Type == 'returnorder'){
              _self.returnorder(data);
            }
          }
        )
      },

      /**
       * 获取航佰账单回调
       */
      returnorder(e){
        var _self = this;
        console.log(e);
        if(e.errcode == 0){
          var notDisMoney=0;
          var totalMoney = 0;
          e.cpinfo.forEach(ele => {
            if(ele.kz == '1'){
              notDisMoney += floatTo.multiply(Number(ele.hyj),Number(ele.sl));   //参与折扣金额
              totalMoney += floatTo.multiply(Number(ele.hyj),Number(ele.sl));
            }else{
              totalMoney += floatTo.multiply(Number(ele.dj),Number(ele.sl));
            }
          });
          _self.totalMoney = totalMoney;   //订单总金额
          console.log(_self.totalMoney);
          _self.noMoney = floatTo.subtract(Number(_self.totalMoney),Number(notDisMoney));   //不参与折扣金额
          console.log(_self.noMoney);
        }else{
          Tips.toast(decodeURIComponent(e.errmsg))
        }
      },
      closeInner(){
        var _self = this;
        if(_self.closeMes == 1) {
          _self.closeMes = 0;
        }else{
          _self.closeMes=1;
          _self.noMoney = '';
        }
      }
    }

  }
</script>

<style lang="scss" scoped>
  .index{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #F1F1F1;
    box-sizing: border-box;
    padding: 28rpx 15rpx;
    .pay{
      width: 100%;
      background: #FFFFFF;
      padding-bottom:60rpx;
      .business{
        width:100%;
        height:80rpx;
        padding: 10rpx 0 30rpx 46rpx;
        display: flex;
        align-items: center;
        .bus_left{
          width:80rpx;
          height:80rpx;
          border-radius: 50%;
          margin-right:16rpx;
          img{
            width:100%;
            height:100%;
            display: block;
            border-radius: 50%;
          }
        }
        .bus_right{
          font-size: 34rpx;
        }
      }
      .remainMoney{
        font-size: 26rpx;
        padding: 0 45rpx 20rpx;
      }
      .inputContainer{
        width: 679rpx;
        border-bottom: 2rpx solid #EBECEE;
        box-sizing: border-box;
        margin: 30rpx 22rpx;
        padding:20rpx 0;
        padding-top:0;
        display: flex;
        font-size: 30rpx;
        align-items: flex-end;
        border-bottom:2rpx solid #f2f2f2;
        margin-bottom:20rpx;
        position: relative;
        input{
          font-size: 30rpx;
          display: block;
          width: 100%;
          padding-left:14rpx;
        }
        input::placeholder{
          font-size: 30rpx;
          text-align: center;
        }
        .input_mask{
          position: absolute;
          left:0;right:0;
          bottom:0;top:0;
          z-index: 9999;
        }
      }
      .input_inner{
        width:680rpx;
        margin:0 auto;
        height:38rpx;
        margin-bottom:40rpx;
        display: flex;
        align-items: center;
        .in_in_le{
          width:38rpx;
          height:38rpx;
          background:rgba(255,255,255,1);
          float: left;
          i{
            height:38rpx;
            line-height: 38rpx;
          }
        }
        .in_in_ri{
          float: left;
          font-size: 30rpx;
          line-height: 38rpx;
          margin-left:20rpx;
        }
      }
      .input_mes{
        margin:20rpx 20rpx;
        margin-top:56rpx;
        margin-bottom:40rpx;
        position: relative;
        input{
          padding:20rpx 20rpx;
          border-bottom:2rpx solid #f2f2f2;
        }
        .input_mask{
          position: absolute;
          left:0;bottom:0;
          top:0;right:0;
          z-index: 999;
        }
      }
      .payMoney{
        font-size: 30rpx;
        color:rgba(13,13,15,1);
        padding: 22rpx 50rpx 65rpx;
      }
      .affirm{
        width: 690rpx;
        height: 91rpx;
        border-radius: 7rpx;
        display: block;
        background:rgba(247,9,77,1);
        color: #FFFFFF;
        font-size: 41rpx;
        margin: 0 auto;
      }
      .notice_text{
        font-size: 30rpx;
        padding:0 22rpx;
        margin-top:30rpx;
      }
    }
  }

  .keyboard {
    width: 100%;
    display: flex;
    background-color: #fff;
    border-top: 1px solid #eee;
    margin-top: 50 rpx;
    position: absolute;
    bottom:0;
    left:0;
  }
  .keyboard .number {
    display: flex;
    width: 570rpx;
    flex-wrap: wrap;
  }

  .keyboard .number div {
    width: 190rpx;
    height: 120rpx;
    line-height: 120rpx;
    text-align: center;
    font-size: 46rpx;
    font-weight: bold;
    box-sizing: border-box;
    border-right: 1px solid #eee;
    border-bottom: 1px solid #eee;
  }

  .keyboard .ctr-btn {
    width: 174rpx;
  }

  .keyboard .ctr-btn div {
    height: 240rpx;
    line-height: 240rpx;
    text-align: center;
    box-sizing: border-box;
    border-bottom: 1px solid #eee;
  }

  .keyboard .ctr-btn div .iconfont {
    font-size: 44rpx !important;
    color: #c30;
  }

  .keyboard .ctr-btn div:nth-child(2) {
    font-size: 46rpx;
    color: #c30;
  }

  .keyboard .active {
    background-color: #e4e7ed;
  }

  .activity {
    background-color: #fff;
    padding: 25rpx 20rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 24rpx;
    border-bottom: 1px solid #f6f6f6;
  }

  .activity.activity-item {
    font-size: 26rpx;
  }

  .arrows-right {
    width: 30rpx;
    height: 30rpx;
  }

  .arrows-right.active {
    transform: rotate(270deg);
  }
</style>
