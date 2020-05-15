<template>
  <div class="page">
    <div class="all_con">
      <div class="status-box">
        <div @click="statusTap(item,index)"
             class="status-label"
             :class="currentType == index ? 'active' : ''"
             v-for="(item, index) in statusType"
             :key="index">
          {{item}}
          <div class="tabClass[index]" v-if="index!=0"></div>
        </div>
      </div>
      <div class="line_bot"></div>
      <!--1满减券  2代金券 3 折扣券 4产品券-->
      <div class="page_coupon">
        <div class="eve_coupon"  v-if="currentType != 1" v-for="(item,index) in dataList" :key="index" @click="goPay(item)">
        <div class="eve_le" v-if="item.couponType ==1">
          <img src="/static/img/common/couponle.png" alt="">
          <div class="eve_le_inner">
            <div class="eve_le_top">
              <span style="font-size: 30rpx;">￥</span><span style="font-size: 50rpx;">{{item.couponMoney}}</span>
            </div>
            <div class="eve_le_bot">
              满{{item.consumeMoney}}元可用
            </div>
          </div>
        </div>

        <div class="eve_le" v-if="item.couponType ==2">
          <img src="/static/img/common/couponle.png" alt="">
          <div class="eve_le_inner">
            <div class="eve_le_top">
              <span style="font-size: 30rpx;">￥</span><span style="font-size: 50rpx;">{{item.couponMoney}}</span>
            </div>
            <div class="eve_le_bot">
               现金券
            </div>
          </div>
        </div>


        <div class="eve_ri">
          <div class="eve_ri_top">{{item.couponTitle}}</div>
          <div class="eve_ri_mid">
            <div class="mid_inner">{{item.startDate}} - {{item.endDate}}</div>
            <div class="mid_inner">{{item.distance}}km</div>
          </div>
          <div class="eve_ri_bot">{{item.storeName}}</div>
        </div>

        <div class="right_card_expire"  v-if="item.state == 1">
          立即领取
        </div>

        <div class="card_expire" v-if="item.state == 4">
          <img src="../../static/img/card_expire_img.png" alt="">
        </div>

        <div class="card_expire" v-if="item.state == 3">
          <img src="../../static/img/card_over_img.png" alt="">
        </div>
      </div>
        <div class="eve_coupon"  v-if="currentType == 1" v-for="(item,index) in dataList" :key="index" @click="getItCoupon(item)">

          <div class="eve_le" v-if="item.couponType ==1">
            <img src="/static/img/common/couponle.png" alt="">
            <div class="eve_le_inner">
              <div class="eve_le_top">
                <span style="font-size: 30rpx;">￥</span><span style="font-size: 50rpx;">{{item.couponMoney}}</span>
              </div>
              <div class="eve_le_bot">
                满{{item.consumeMoney}}元可用
              </div>
            </div>
          </div>

          <div class="eve_le" v-if="item.couponType ==2">
            <img src="/static/img/common/couponle.png" alt="">
            <div class="eve_le_inner">
              <div class="eve_le_top">
                <span style="font-size: 30rpx;">￥</span><span style="font-size: 50rpx;">{{item.couponMoney}}</span>
              </div>
              <div class="eve_le_bot">
                现金券
              </div>
            </div>
          </div>

          <div class="eve_ri">
            <div class="eve_ri_top">{{item.couponTitle}}</div>
            <div class="eve_ri_mid">
              <div class="mid_inner">{{item.startDate}} - {{item.endDate}}</div>
              <div class="mid_inner">{{item.distance}}km</div>
            </div>
            <div class="eve_ri_bot">{{item.storeName}}</div>
          </div>

          <div class="right_card_expire"  v-if="item.state == 1">
            立即领取
          </div>

          <div class="card_expire" v-if="item.state == 4">
            <img src="../../static/img/card_expire_img.png" alt="">
          </div>

          <div class="card_expire" v-if="item.state == 3">
            <img src="../../static/img/card_over_img.png" alt="">
          </div>
        </div>
        <div class="nomore" v-if="nomore==1" style="width100%:height:80rpx;line-height: 80rpx;text-align: center;font-size: 30rpx;">没有更多了~</div>
        <no-data :showNoData = "noData" :noticeMes="conNot"/>
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
        statusType: ["已领取", "未领取", "已使用", "已过期"],
        currentType:0,
        parData:{
          token:this.$store.state.token,
          pageNum:1,
          limit:10,
          state:2,
          longitude:this.$store.state.lng,
          latitude:this.$store.state.lat,
        },

        noData:false,
        conNot:'',
        notice_mes:'',
        dataList:[],
        nomore:0,
      }
    },
    mounted(){
      var par = getQuery();
      this.getcoupon(this.parData);
    },
    methods:{
      statusTap(par,index){
        this.currentType = index;
        this.parData.pageNum = 1;
        if(par == '已领取'){
          this.parData.state = 2;
          this.dataList =[];
          this.getcoupon(this.parData);
        }
        else if(par == '未领取'){
          this.parData.state = 1;
          this.dataList =[];
          this.getcoupon(this.parData);
        }
        else if(par == '已使用'){
          this.parData.state = 3;
          this.dataList =[];
          this.getcoupon(this.parData);
        }
        else if(par == '已过期'){
          this.parData.state = 4;
          this.dataList =[];
          this.getcoupon(this.parData);
        }
      },
      getcoupon(_data){
        var _this = this;
        getSignIn(_data).then(sec=>{
          _this.$http.getCouponList(_data,sec).then(res=>{
            console.log(res);
            if(res.state ==1){
              for(let i=0;i<res.data.length;i++){
                res.data[i].startDate = _this.getData(res.data[i].startDate);
                res.data[i].endDate = _this.getData(res.data[i].endDate);
                res.data[i].distance = res.data[i].shopStore.distance;
                res.data[i].storeName = res.data[i].shopStore.storeName;
              }
              _this.couPage = res.biCardcouponCountVO;
              if(res.data!=0) {
                _this.dataList = _this.dataList.concat(res.data);
              }else{
                if(_this.dataList.length !=0 && res.data.length == 0){
                  _this.nomore =1;
                }else{
                  _this.nomore =0;
                }
              }
              if(_this.dataList.length == 0){
                _this.noData = true;
                _this.conNot = '暂无数据';
                _this.notice_mes = '';
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
      //领取优惠券
      getItCoupon(par){
         var _data = {
           token:this.$store.state.token,
           couponNum:par.couponNum,
           id:par.id
         }
         var _this = this;
         getSignIn(_data).then(sec=>{
           _this.$http.getItCoupon(_data,sec).then(res=>{
                console.log('优惠券的数据',res);
                if(res.state ==1){
                  Tips.toast('领取成功' ,'none');
                  _this.dataList = [];
                  _this.getcoupon(_this.parData);
                }else{
                  Tips.toast(`${decodeURIComponent(res.msg)}`,'none')
                }
           })
         })
      },
      goPay(par){
        console.log('看看有没有我想要的',par)
        wx.navigateTo({
          url:`../../pages/couponDetail/main?couponNum=${par.couponNum}&id=${par.id}`
        })
      },
      getData(newData){
        var time = String(newData);
        var newYear = time.substring(0,4);
        var newMonth = time.substring(4,6);
        var newDay = time.substring(6,8);
        return `${newYear}.${newMonth}.${newDay}`
      },
    },
    async onReachBottom() {
      // 到这底部在这里需要做什么事情
      this.notice_mes = '加载中...';
      this.parData.pageNum ++;
      this.getcoupon(this.parData);
      if(this.notice_mes == '没有更多数据了'){
        return false;
      }
    },
  }
</script>

<style lang="scss">
  .page{
    width: 100%;
    background: #F6f6f6;
    position: absolute;
    top:0;bottom:0;
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
  .page_coupon{
    width:710rpx;
    margin:0 20rpx;
    margin-top:40rpx;
    float: left;
    .eve_coupon{
      background:#fff;
      width:100%;
      height:186rpx;
      display: flex;
      justify-content: space-between;
      border-radius: 10rpx;
      box-shadow:1rpx 1rpx 30rpx rgba(0, 0, 0, 0.2);
      margin-bottom:20rpx;
      position: relative;
      .eve_le{
        width:240rpx;
        height:186rpx;
        position: relative;
        img{
          width:100%;
          height:100%;
          display: block;
        }
        .eve_le_inner{
          width:240rpx;
          height:186rpx;
          position: absolute;
          left:0;
          top:0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          color:#fff;
          .eve_le_top{
            color:#fff;

          }
          .eve_le_bot{
            font-size: 24rpx;
          }
        }
      }
      .eve_ri{
        width:430rpx;
        height:166rpx;
        padding:20rpx;
        .eve_ri_top{
          font-size: 28rpx;
          margin-bottom:6rpx;
        }
        .eve_ri_mid{
          font-size: 22rpx;
          border-bottom:2rpx dashed rgba(0,0,0,0.3);
          padding-bottom:4rpx;
          color:#c4c4c4;
          .mid_inner{

          }
        }
        .eve_ri_bot{
          font-size: 24rpx;
          line-height: 48rpx;
          color:rgba(0,0,0,0.6);
        }
      }
      .card_expire{
        position: absolute;
        right:48rpx;
        top:12rpx;
        width:160rpx;
        height:160rpx;
        img{
          width:100%;
          height:100%;
          display: block;
        }
      }
      .right_card_expire{
        position: absolute;
        right:56rpx;
        top:56rpx;
        padding:0 6rpx;
        border-radius: 4rpx;
        font-size: 24rpx;
        border: 2rpx solid #F7094D;
        color:#F7094D;
      }
    }
  }

</style>
