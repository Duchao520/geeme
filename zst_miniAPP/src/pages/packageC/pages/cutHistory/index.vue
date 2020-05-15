<template>
  <div class="defHistory">
    <!--<type-select ref="typeSelect"></type-select>-->
    <!--<ul class="menu box_padding flex_box justify_space_between fz-30">-->
      <!--<li class="menu-item" :class="selMes == 1?'active':''" @click="inlineCut">线上砍价</li>-->
      <!--<li class="menu-item" :class="selMes == 2?'active':''" @click="outLineCut">线下砍价</li>-->
    <!--</ul>-->
    <div class="order-list">
      <!--<ul class="scroll-container" style="margin-top:90rpx;overflow-y: scroll;height: 100%;"  v-if="selMes ==1">-->
        <!--<li class="order-item box_padding" v-for="(item,index) in [1,2,3]" :key="index">-->
          <!--<div class="flex_box justify_space_between align_center"-->
               <!--style="margin-bottom: 24rpx">-->
            <!--<p class="fz-28 fc-8D8E98">订单时间：2018-04-10 11：11：11</p>-->
            <!--<p class="fz-30 fc-F7094D font-weight">未发货</p>-->
          <!--</div>-->
          <!--<p class="fz-24"-->
             <!--style="margin-bottom: 30rpx">砍价免费拿</p>-->
          <!--<div class="flex_box"-->
               <!--style="margin-bottom: 50rpx">-->
            <!--<img src="" alt="" class="thumb">-->
            <!--<div class="detail flex_box flex_column justify_space_between">-->
              <!--<p class="txt-overflow fz-30 font-weight">【高级黑智能手表】9.8mm轻薄设计/强-->
                <!--劲续航/50米防水</p>-->
              <!--<div class="flex_box fz-30 justify_space_between">-->
                <!--<p>X1</p>-->
                <!--<p class="fc-F7094D">0</p>-->
              <!--</div>-->
            <!--</div>-->
          <!--</div>-->
          <!--<p class="fz-30 fc-0D0D0F">订单编号:1221156464562212363656523</p>-->
          <!--<p class="fz-30 fc-0D0D0F"-->
             <!--style="margin-bottom: .36rem">所属店铺：浙江和米通讯提供</p>-->
          <!--<div class="btns">-->
            <!--<button class="fz-24 fc-F7094D">确认收货</button>-->
            <!--<button class="fz-24 fc-8D8E98" style="margin-right: 12rpx">查看物流</button>-->
          <!--</div>-->
        <!--</li>-->
      <!--</ul>-->

      <ul style="overflow: hidden">
        <li class="order-item box_padding" v-for="(item,index) in dataList" :key="index">
          <div class="flex_box justify_space_between align_center"
               style="margin-bottom: 24rpx">
            <p class="fz-28 fc-8D8E98">订单时间：{{item.endTime}}</p>
          </div>
          <div style="display:flex;justify-content: space-between;">
          <p class="fz-24" v-if="item.discount != 0"
             style="margin-bottom: 30rpx;display: flex;align-items: center"><img src="../../static/img/bargain_act.png" style="width:94rpx;height:24rpx;margin-right:20rpx;" alt="">{{item.remark}}</p>

            <p class="fz-24" v-if="item.discount == 0"
               style="margin-bottom: 30rpx;display: flex;align-items: center"><img src="../../static/img/bargain_act.png" style="width:94rpx;height:24rpx;margin-right:20rpx;" alt="">砍价免费拿</p>
            <p class="fz-24 fc-F7094D"
             style="margin-bottom: 30rpx;" v-if="item.isUse==1">已消费</p> <p class="fz-24 fc-F7094D"
             style="margin-bottom: 30rpx;" v-if="item.isUse==0">未消费</p>
          </div>
          <div class="flex_box"
               style="margin-bottom: 50rpx">
            <img :src="item.bargainImg" alt="" class="thumb">
            <div class="detail flex_box flex_column justify_space_between">
              <p class="txt-overflow fz-30 font-weight">{{item.bargainTitle}}</p>
              <div class="flex_box fz-30 justify_space_between">
                <p>X{{item.activityShareNum}}</p>
                <p class="fc-F7094D"><span style="margin-right:30rpx;">{{item.prentPrice}}</span><span class="fc-8D8E98" style="text-decoration: line-through">￥{{item.biBargain.price}}</span></p>
              </div>
            </div>
          </div>
          <p class="fz-30 fc-0D0D0F">订单编号:{{item.orderNo}}</p>
          <p class="fz-30 fc-0D0D0F"
             style="margin-bottom: .36rem">所属店铺：{{item.shopName}}</p>
          <div class="btns" v-if="item.isUse==0">
            <button class="fz-24 fc-F7094D" style="border:2rpx solid #F7094D;" @click="goLookCode(item)">查看核销码</button>
          </div>

          <div class="btns"  v-if="item.isUse!=0">
            <button class="fz-24 fc-F7094D"  v-if="item.isHasComment == 0"  @click="goComment(item)">立即评价</button>
            <button class="fz-24 fc-8D8E98" style="margin-right: 12rpx" @click="goCodePage(item)">核销码已核销</button>
          </div>
        </li>
      </ul>
    </div>
    <div v-if="dataList.length == 0">
      <div class="all_empty">
        <div class="empty_img">
          <img src="/static/img/common/empty.png" alt="">
        </div>
        <div class="em_title">
          {{conNot}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getSignIn , getQuery , toDate} from '@/common/js/comm';
  import Tips from '@/common/js/tips'
  import noData from '@/components/noData';
  import floatTo from '@/common/js/floatTo'
  export default {
    name: "defHistory",
    components: {
      noData
    },
    data(){
      return {
        selMes:1,
        dataList:[],
        pageNum:1,
        noData:false,
        conNot:'',
      }
    },
    onShow(){
      this.getTasksing();
    },
    onHide(){
      this.dataList=[];
      this.pageNum=1;
    },
    methods: {
      inlineCut(){
         console.log(111);
          this.selMes =1;
      },
      outLineCut(){
         console.log(2222);
          this.selMes =2;
      },
      goLookCode(par){
        var _this = this;
        wx.navigateTo({
          url:`/pages/packageC/pages/lookCode/main?bargainTasksId=${par.id}&bargainTitle=${par.bargainTitle}&helperNum=${par.activityShareNum}&bargainImg=${par.bargainImg}&price=${par.biBargain.price}&prentPrice=${par.prentPrice}
          &storeName=${par.storeName}&address=${par.address}&shopTel=${par.shopTel}&storeId=${par.storeId}&description=${par.biBargain.description}`,
          success(){
            _this.dataList=[];
            _this.pageNum=1;
          },
        })
      },
      goCodePage(par){
        console.log(par);
        var _this = this;
        wx.navigateTo({
           url:`/pages/packageC/pages/expiredCode/main?bargainTasksId=${par.id}&bargainTitle=${par.bargainTitle}&helperNum=${par.activityShareNum}&bargainImg=${par.bargainImg}&price=${par.biBargain.price}&prentPrice=${par.prentPrice}`,
          success(){
            _this.dataList=[];
            _this.pageNum=1;
          },

        })
      },
      //立即评价
      goComment(par){
        var _this =  this;
         wx.navigateTo({
           url:`/pages/packageC/pages/commonPage/main?bargainTasksId=${par.id}&bargainTitle=${par.bargainTitle}&helperNum=${par.activityShareNum}&bargainImg=${par.bargainImg}&price=${par.biBargain.price}&prentPrice=${par.prentPrice}`,
           success(){
             _this.dataList=[];
             _this.pageNum=1;
           },
         })
      },
      //砍成记录
      getTasksing(){
        var _data = {
          token:this.$store.state.token,
          pageNum:this.pageNum,
          limit:10,
          isUse:'',
          startTime:'',
          endTime:'',
        }
        var _this = this;
        getSignIn(_data).then(sec=>{
          _this.$http.getTasksing(_data,sec).then(res=>{
            console.log('看看情况',res);
            if(res.state==1) {
              for (let i = 0; i < res.data.length; i++) {
                res.data[i].endTime = toDate(res.data[i].endTime * 1000);
                var disCount = floatTo.divide(Number(res.data[i].biBargain.discount),10);
                res.data[i].prentPrice = (floatTo.multiply(Number(res.data[i].biBargain.price),disCount)).toFixed(2);
                res.data[i].discount = res.data[i].biBargain.discount;
              }
              if(res.data.length!=0) {
                _this.dataList = _this.dataList.concat(res.data);
              }
              if(_this.dataList.length==0){
                _this.noData = true;
                _this.conNot = '您当前还没有砍成记录';
              }else{
                _this.noData = false;
                _this.conNot = '';
              }
            }else{
              Tips.toast(`${decodeURIComponent(res.msg)}`,'none');
            }
          })
        })
      },
    },
    async onReachBottom() {
      // 到这底部在这里需要做什么事情
      this.pageNum ++;
      this.getTasksing();
    },
  }
</script>

<style lang="scss" scoped>
  .menu{
    width: 100%;
    height:75rpx;
    padding: 0 130rpx;
    position: fixed;
    top:0;
    left:0;
    border-bottom: 2rpx solid #eee;
    z-index: 88;
    .menu-item{
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .menu-item::after{
      content: '';
      display: block;
      width: 150rpx;
      height: 5rpx;
      border-radius: 3rpx;
      margin-top: 22rpx;
    }
    .active{
      color: #F7094D;
    }
    .active::after{
      background: #F7094D;
    }
  }
  .order-list{
    overflow: hidden;
    .order-item{
      border-bottom: 2rpx solid #E5E5E5;
      padding: 40rpx 20rpx;
      margin-bottom:6rpx;
      .thumb{
        display: block;
        width: 160rpx;
        height: 160rpx;
        border-radius: 10rpx;
        margin-right: 28rpx;
        background: #FF4F81;
      }
      .detail{
        width: 514rpx;
      }
      .btns{
        overflow: hidden;
        button{
          display: block;
          height: 50rpx;
          border-radius: 26rpx;
          border: 2rpx solid #F7094D;
          float: right;
          line-height: 50rpx;
        }
        button:last-child{
          border: 2rpx solid #8D8E98;
          float: right;
          line-height: 50rpx;
        }
      }
    }
  }
  .all_empty{
    margin-top:300rpx;
    .empty_img{
      width:100%;
      height:332rpx;
      display: flex;
      justify-content: center;
      margin-top:300rpx;
      margin-bottom:60rpx;
      img{
        width:332rpx;
        height:332rpx;
        display: block;
      }
    }
    .em_title{
      font-size: 36rpx;
      text-align: center;
    }
  }
</style>
