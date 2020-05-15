<template>
  <div class="page">
    <div class="all_con">
      <div class="scroll_box" id="the-id">
        <scroll-view class="scroll-view_x" scroll-x style="width: auto;overflow:hidden;">
          <div class="item_list" :key="item.id" v-for="(item,index) in statusType">
            <div class="item_book_text" :class="{active:num == index}" @click="statusTap(item,index)">{{item}}</div>
          </div>
        </scroll-view>
      </div>
      <div class="line_bot"></div>
    </div>

    <div class="con_con" >
      <div class="hasData" v-for="item in orderList" :key="item.id" v-if="orderList">
          <div class="con_top">
            <div class="co_to_le">
                 订单时间：{{item.createTime}}
            </div>
            <div class="co_to_ri">
                 {{item.stabb}}
            </div>
          </div>
          <div class="con_mid">
              <div class="co_mi_le">
                <img :src="item.imgUrl" alt="">
              </div>
              <div class="co_mi_ri">
                  <div class="co_mi_ri_top">
                    {{item.goodsName}}
                  </div>
                  <div class="co_mi_ri_bot">
                     <span>X {{item.goodsCount}}</span><span style="color:#F7094D;">￥{{item.goodsTotalPrice}} + {{item.usedIntegralCount}}话呗</span>
                  </div>
              </div>
          </div>
          <div class="con_bot">
              <div class="type_top">
                  规格：{{item.specParamsName}}
              </div>
              <div class="type_mid">
                  订单编号：{{item.orderNum}}
              </div>
              <div class="type_bot">
                  所属店铺：{{item.shopName}}
              </div>
              <div class="href_btn" v-if="item.stabb == '待付款'" >
                 <div class="href_btn_btn" style="border:1rpx solid #F7094D;color:#F7094D;" @click="rightPay(item)">
                    立即付款
                 </div>

                  <div class="href_btn_btn" style="margin-right:10rpx;" @click="deleteOrder(item)">
                    删除订单
                  </div>
              </div>

              <div class="href_btn" v-if="item.stabb == '待收货' || item.stabb == '待使用'">
                 <!--<div class="href_btn_btn" style="border:1rpx solid #F7094D;color:#F7094D;">-->
                    <!--查看物流-->
                 <!--</div>-->
                  <div class="href_btn_btn" v-if="item.goodsType==1" style="margin-right:10rpx;border:1rpx solid #F7094D;color:#F7094D;" @click="confirmGet(item)">
                    确认收货
                  </div>
                <div class="href_btn_btn" v-if="item.goodsType==0" style="margin-right:10rpx;border:1rpx solid #F7094D;color:#F7094D;" @click="goLookcode(item)">
                    查看核销码
                  </div>
              </div>

            <div class="href_btn" v-if="item.stabb == '交易成功'">
              <!--<div class="href_btn_btn" style="border:1rpx solid #F7094D;color:#F7094D;">-->
                 <!--立即评价-->
              <!--</div>-->

              <div class="href_btn_btn" style="margin-right:10rpx;border:1rpx solid #F7094D;color:#F7094D;" @click="refundMonM(item , '评价待发货')">
                 申请退款
              </div>
            </div>

             <div class="href_btn" v-if="item.stabb == '待发货'">
                 <div class="href_btn_btn" style="border:1rpx solid #F7094D;color:#F7094D;" @click="refundMonM(item , '待发货')">
                     申请退款
                 </div>
              </div>

            <div class="href_btn" v-if="item.stabb == '交易完成'">
                 <!--<div class="href_btn_btn" style="border:1rpx solid #F7094D;color:#F7094D;">-->
                     <!--立即评价-->
                 <!--</div>-->
              </div>

            <div class="href_btn" v-if="item.stabb == '退款中'">
                 <div class="href_btn_btn" style="color:#F7094D;border:1rpx solid #F7094D;" @click="contactSer">
                     联系客服
                 </div>
              </div>

          </div>
      </div>
      <no-data :showNoData = "noData" :noticeMes="conNot"/>
      <div class="footer">
        {{notice_mes}}
      </div>
    </div>
  </div>
</template>

<script>
  import { getQuery , getSignIn ,toDate } from '@/common/js/comm'
  import Tips from '@/common/js/tips'
  import noData from '@/components/noData'

  export default {
    components:{
      noData
    },
    data() {
      return {
        statusType: ["全部", "待付款", "待发货", "待收货/待使用", "待评价","退款"],
        currentType:0,
        parData:{
          token:this.$store.state.token,
          deliveryState:'', //发送状态
          evaluationState:'', //评价状态
          pageNum:1,
          pageSize:10,
        },
        orderList:[],

        noData:false,
        conNot:'',
        notice_mes:'',
        num:0,
        index:0,
      }
    },
    mounted(){
        var par = getQuery();
        var otPar = par.imgText;
        if(otPar == '待付款'){
          this.$set(this.parData, 'deliveryState' , 1);
          this.currentType = 1;
          this.num =1;
          this.index=1;
          this.getOrderDe(this.parData);
        }
        if(otPar == '待发货'){
          this.$set(this.parData, 'deliveryState' , 2);
          this.currentType = 2;
          this.num =2;
          this.index=2;
          this.getOrderDe(this.parData);
        }
        if(otPar == '待评价') {
          this.$set(this.parData ,'deliveryState', '');
          this.currentType = 4;
          this.num =4;
          this.index=4;
          this.parData.evaluationState = 0;
          this.getOrderDe(this.parData);
        }
        if(otPar == '退款'){
          this.$set(this.parData, 'deliveryState' , 6);
          this.currentType = 5;
          this.num =5;
          this.index=5;
          this.getOrderDe(this.parData);
        }
        if(otPar == '待收货/待使用'){
          this.$set(this.parData, 'deliveryState' , 3);
          this.currentType = 3;
          this.num =3;
          this.index=3;
          this.getOrderDe(this.parData);
        }
    },
    methods:{
      statusTap(par,index){
        this.num = index;
        this.parData.pageNum = 1;
        if(par == '全部'){
           this.parData.deliveryState = '';
           this.orderList = [];
           this.parData.evaluationState = '';
           this.getOrderDe(this.parData);
        }
        else if(par == '待付款'){
          this.parData.deliveryState = 1;
          this.orderList = [];
          this.parData.evaluationState = '';
          this.getOrderDe(this.parData);
        }
        else if(par == '待发货'){
          this.parData.deliveryState = 2;
          this.orderList = [];
          this.parData.evaluationState = '';
          this.getOrderDe(this.parData);
        }
        else if(par == '待收货/待使用'){
          this.parData.deliveryState = 3;
          this.parData.evaluationState = '';
          this.orderList = [];
          this.getOrderDe(this.parData);
        }
        else if(par == '待评价'){
          this.parData.deliveryState = '';
          this.parData.evaluationState = 0;
          this.orderList = [];
          this.getOrderDe(this.parData);
        }
        else if(par == '退款'){
          this.parData.deliveryState = 6;
          this.parData.evaluationState ='';
          this.orderList = [];
          this.getOrderDe(this.parData);
        }
      },
      getOrderDe(par){
          var _this = this;
          getSignIn(par).then(sec=>{
              _this.$http.getOrder(par,sec).then(res=>{
                /***
                 * 假如说 后台没有返回的数据了  那么就说确实没有更多的数据了
                 *       如果又返回的数据那就继续往里面合并知道没有数据返回、
                 *
                 *       把整个值都赋值给了一个变量
                 *       那么根据这个变量  如果没有数据  那就直接显示没有数据  当然没有更多的数据肯定也不会显示
                 *                      如果有数据   那就显示呗  我肯定在后面也不会把前面的覆盖掉
                 *       下次这种事情一定要先想清楚了再往后坐   这个就是所谓的要有伪代码的原因
                 *
                 * ***/
                  if(res.data.length == 0){
                    _this.notice_mes = '没有更多数据了'
                  }
                  for (let i = 0; i < res.data.length; i++) {
                    res.data[i].createTime = toDate(res.data[i].createTime * 1000);
                    var stala = res.data[i].deliveryState;
                    if (stala == 0) {
                      res.data[i].stabb = '已取消';
                    } else if (stala == 1) {
                      res.data[i].stabb = '待付款';
                    } else if (stala == 2) {
                      res.data[i].stabb = '待发货';
                    } else if (stala == 3) {
                      if(res.data[i].goodsType==0) {
                        res.data[i].stabb = '待使用';
                      }else{
                        res.data[i].stabb = '待收货';
                      }
                    } else if (stala == 4) {
                      res.data[i].stabb = '交易成功';
                    } else if (stala == 5) {
                      res.data[i].stabb = '交易完成';
                    } else if (stala == 6) {
                      res.data[i].stabb = '退款中';
                    } else if (stala == 7) {
                      res.data[i].stabb = '退款成功';
                    } else if (stala == 8) {
                      res.data[i].stabb = '退款失败';
                    }
                  }
                  _this.orderList = _this.orderList.concat(res.data);
                  if(_this.orderList.length == 0){
                    _this.noData = true;
                    _this.conNot = '暂无数据';
                    _this.notice_mes = '';
                  }else{
                    _this.noData = false;
                    _this.conNot = '';
                  }
              })
          })
      },
      href_btn_btn(par){
        console.log(par.id);
      },
      // 联系客服
      contactSer(){
        wx.makePhoneCall({
          phoneNumber: '400-8090-775',
          success(res){
            console.log(res);
          },
          fail(res){
            console.log(res);
          }
        })
      },
      //删除订单
      deleteOrder(par){
          var _this = this;
          var _data = {
            token : this.$store.state.token,
            state:'-1',
            deliveryState:'-2',
            onlineorderGoodsId:par.id,
            goodsId:par.goodsId,
            orderNum:par.orderNum,
            usedIntegralCount:par.usedIntegralCount
          }
          Tips.confirm('确认删除该订单吗','',{'yes':1}).then(res=>{
            if(res.yes == 1){
              getSignIn(_data).then(sec=>{
                _this.$http.deleOrder(_data , sec).then(res=>{
                  if(res.state == 1){
                    Tips.toast('删除成功','none');
                    _this.orderList = [];
                    _this.parData.pageNum = 1;
                    this.getOrderDe(this.parData);
                  }else{
                    Tips.toast(decodeURIComponent(res.msg),'none');
                  }
                })
              })
            }
          })
      },
      rightPay(par){
        var _this = this;
        var _data = {
          token:this.$store.state.token,
          onlineorderId:par.onlineorderId,
          onlineordergoodsId:par.id,
          tradeType:'JSAPI',
          openid:_this.$store.state.openId,
          appid:'wx5e11922e81e3951d'
        }
        getSignIn(_data).then(sec=>{
          _this.$http.postOrderLater(_data,sec).then(res=>{
            //这里是提示信息
            Tips.toast(`${decodeURIComponent(res.msg)}`,'none');
            var payObj = {
              timeStamp: res.data.apiSigntype ,
              nonceStr: res.data.apiNoncestr,
              package: res.data.apiPackage,
              signType: res.data.apiSigntype,
              paySign: res.data.apiPaysign,
            }
            wx.requestPayment({
              timeStamp: res.data.apiTimestamp,
              nonceStr: res.data.apiNoncestr,
              package: res.data.apiPackage,
              signType: res.data.apiSigntype,
              paySign: res.data.apiPaysign,
              success:function(res){
                console.log(res);
              },
              fail:function(res){
                console.log(res)
              },
              complete:function(res){

              }
            })
          })
        })
      },
      refundMonM(par, tryYour){
        if(tryYour == '评价待发货'){
          wx.navigateTo({
            url:`../../pages/refundMoney/main?orderNum=${par.orderNum}&stat=1`
          })
        }else if(tryYour == '待发货'){
          wx.navigateTo({
            url:`../../pages/refundMoney/main?orderNum=${par.orderNum}&stat=2`
          })
        }

      },
      confirmGet(par){
        var _this = this;
        var _data = {
          token : this.$store.state.token,
          deliveryState:4,
          onlineorderGoodsId:par.id,
          goodsId:par.goodsId,
          orderNum:par.orderNum,
          usedIntegralCount:par.usedIntegralCount
        }
        Tips.confirm('是否确认收货','',{'yes':1}).then(res=>{
            if(res.yes ==1){
              getSignIn(_data).then(sec=>{
                _this.$http.deleOrder(_data , sec).then(res=>{
                  if(res.state == 1){
                    Tips.toast('已确认收货','none');
                    _this.orderList = [];
                    this.getOrderDe(this.parData);
                  }else{
                    Tips.toast(decodeURIComponent(res.msg),'none');
                  }
                })
              })
            }
        })
      },
      goLookcode(par){
        console.log(par);
        wx.navigateTo({
          url:`/pages/packageA/pages/lookGoodsCode/main?orderNum=${par.orderNum}`
        })
      }
    },
    async onReachBottom() {
      // 到这底部在这里需要做什么事情
      this.notice_mes = '加载中...';
      this.parData.pageNum ++;
      this.getOrderDe(this.parData);
      if(this.notice_mes == '没有更多数据了'){
        return false;
      }
    },
  }
</script>

<style lang="scss">
  .page{
    width: 100%;
    background: #F2f2f2;
    .all_con{
      width:100%;
      overflow: hidden;
      position: relative;
      .line_bot{
        position: absolute;
        bottom:3rpx;
        left:0;
        width:100%;
        height:2rpx;
        background:rgba(154,156,165,0.3);;
        z-index: 99;
        opacity: 0.2;
      }
    }
    .con_con{
      width:100%;
      overflow: hidden;
      background:#fff;
      .hasData{
        overflow: hidden;
        border-bottom:2rpx solid rgba(154,156,165,0.3);
        padding:20rpx 0;
      }
      .con_top{
         width:710rpx;
         height:52rpx;
         font-size: 28rpx;
         @include jcsb;
         padding:0 20rpx;
        .co_to_le{
          color:#8D8E98;
        }
        .co_to_ri{
          color:#F7094D;
        }
      }
      .con_mid{
        width:710rpx;
        padding:20rpx;
        overflow: hidden;
        .co_mi_le{
          width:160rpx;
          height:160rpx;
          margin-right:20rpx;
          float: left;
          img{
            width:100%;
            height:100%;
            display: block;
          }
        }
        .co_mi_ri{
          width:500rpx;
          padding:0 10rpx;
          overflow: hidden;
          float: left;
          .co_mi_ri_top{
            font-size: 30rpx;
            margin-bottom:20rpx;
          }
          .co_mi_ri_bot{
            font-size: 30rpx;
            @include jcsb;
          }
        }
      }
      .type_top{
        margin:0 20rpx;
        background:rgba(142,142,152,0.3);
        display:inline-block;
        font-size: 24rpx;
        margin-bottom:36rpx;
      }
      .type_mid{
          font-size:30rpx;
          margin:0 20rpx;
      }
      .type_bot{
        font-size: 30rpx;
        margin:0 20rpx;
        margin-bottom:20rpx;
      }
      .href_btn{
        height:50rpx;
        width:710rpx;
        margin:0 20rpx;
        .href_btn_btn{
          float: right;
          width:166rpx;
          height:50rpx;
          border-radius: 25rpx;
          border:1rpx solid $fontColor;
          color:#8D8E98;
          @include jcc;
          margin-bottom:14rpx;
          font-size:28rpx;
        }
      }
    }
    .footer{
      width:100%;
      height:100rpx;
      background:#fff;
      text-align: center;
      line-height:100rpx;
    }
  }
  .status-box{
    width:710rpx;
    height: 88rpx;
    line-height: 88rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    padding:0 20rpx;
  }
  .status-box .status-label{
    width: 150rpx;
    height: 100%;
    text-align: center;
    font-size:28rpx;
    color:#353535;
    box-sizing: border-box;
    position: relative;
    z-index: 99;
  }
  .status-box .status-label.active{
    bottom:3rpx;
    color:#e64340;
    border-bottom: 6rpx solid #e64340;
  }
  .status-box .status-label .red-dot{
    width: 16rpx;
    height: 16rpx;
    position: absolute;
    left: 116rpx;
    top:23rpx;
    background-color: #f43530;
    border-radius: 50%;
  }
  .scroll_box{
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    background:#fff;
    padding-top:20rpx;
    ::-webkit-scrollbar{
      width: 0;
      height: 0;
      color: transparent;
    }
  }
  .item_list{
    height: auto;
    margin-right: 28rpx;
    display: inline-block;
    padding:0 20rpx;
    .item_book_text{
      font-size: 28rpx;
      padding-bottom:20rpx;
    }
    .active{
      color:#F7094D;
      border-bottom:2px solid #F7094D;
    }
  }

</style>
