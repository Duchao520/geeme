<template>
  <div class="page_con">
     <div class="eve_con" v-for="item in dataList" v-if="dataList.length!=0">
        <div class="eve_top">
           <span style="font-size: 24rpx;color:#8D8E98;">抽奖时间：{{item.createDateStr}}</span>
           <span style="font-size: 30rpx;color:#F7094D;">{{item.receiveStateStr}}</span>
        </div>
       <div class="eve_mid">
          <div class="mid_le">
            <!--{{item.imgMes}}-->
            <img :src="item.prize.img" alt="">
            <!--<img :src="item.imagMes" alt="">-->
          </div>
          <div class="mid_ri">
             <div style="font-size: 28rpx;margin-bottom:10rpx;">{{item.prize.name}}</div>
             <div style="font-size: 28rpx;margin-bottom:10rpx;">由{{item.shop.shopName}}提供</div>
             <div style="font-size: 24rpx;display: flex;justify-content: space-around;">
               <i class="iconfont icon-dizhi" style="margin-right:10rpx;color:#E7E9EE;"></i>
               <span style="margin-right:10rpx;" @click="goAddress(item.shop.nearestStore)">{{item.shop.nearestStore.address}}</span>
               <i @click="orderPhone(item.shop.nearestStore)" class="iconfont icon-dianhua" style="color:#F7094D;"></i>
             </div>
             <div class="eve_bot">
                <div style="color: #FF9C01;font-size: 24rpx;">领奖截止日期：{{item.receiveCloseDateStr}}</div>
                <div v-if="item.receiveState == 0" style="background:#FFA61A;color:#fff;padding:6rpx 20rpx;font-size: 24rpx;border-radius: 10rpx" @click="exchange(item)">获取兑奖码</div>
             </div>
          </div>
       </div>
     </div>
     <div class="noData" v-if="dataList.length==0">
       <img src="../../static/img/empty.png" alt="">
        <div>暂无数据</div>
     </div>
     <div class="mask" v-if="showItem == 1">
        <div class="code_mes">
          <div class="getCode_title">领奖兑换码</div>
          <div style="width:100%;display: flex;justify-content: center;align-items: center">
            <canvas style="width:358rpx;height:358rpx;" canvas-id="qrcode" />
          </div>
          <div class="code">{{code}}</div>
          <div class="storename">{{storename}}</div>
          <div class="close_img" @click="close_mask">
            <img src="/static/img/close.png" alt="">
          </div>
        </div>
     </div>
  </div>
</template>

<script>
  import { getSignIn , confirm } from '@/common/js/comm'
  import wxbarcode from 'wxbarcode'
  export default {
    name: "index",
    data(){
      return {
        pageNum:1,
        dataList:[],
        showItem:0,
        code:'',
        storename:'',
        receiveState:'',
      }
    },
    mounted(){
        this.getLottery();
    },
    methods:{
      getLottery(){
        var _self = this;
        var _data ={
          token:_self.$store.state.token,
          isWin:1,
          latitude:_self.$store.state.lat,
          longitude:_self.$store.state.lng,
          pageNum:_self.pageNum,
          pageSize:10
        }
        getSignIn(_data).then(sec=>{
           _self.$http.getLotteryhistory(_data,sec).then(res=>{
             for(let i=0;i<res.data.length;i++){
               res.data[i].imgMes = res.data[i].prize.img;
               console.log(res.data[i].imgMes);
             }
             _self.dataList = _self.dataList.concat(res.data);
           })
        })
      },
      orderPhone(par){
        console.log(par);
        wx.makePhoneCall({
          phoneNumber: `${par.tel}`,
        })
      },
      close_mask(){
        this.showItem = 0;
        this.code ='';
        this.proer(123);
      },
      exchange(par){
        // item.exchangeCode,item.shop.shopName
          console.log(par);
          this.showItem = 1;
          this.code = par.exchangeCode;
          this.storename = par.shop.shopName;
          this.receiveState = par.receiveState;
          this.proer(par);
      },
      proer(code){
        wxbarcode.qrcode('qrcode', `${code}`, 358, 358);
      },
      goAddress(par){
        console.log(par);
        this.formSubmit(par)
      },
      formSubmit(par) {
        var _this = this;
        wx.getLocation({//获取当前经纬度
          type: 'wgs84', //返回可以用于wx.openLocation的经纬度，官方提示bug: iOS 6.3.30 type 参数不生效，只会返回 wgs84 类型的坐标信息
          success: function (res) {
            wx.openLocation({//​使用微信内置地图查看位置。
              latitude: Number(par.latitude),//要去的纬度-地址
              longitude: Number(par.longitude),//要去的经度-地址
              name: par.address,
              address: par.address
            })
          }
        })
      },
    },
    async onReachBottom() {
        this.pageNum ++;
        this.getLottery();
    },

  }
</script>

<style lang="scss" scoped>
.page_con{
  width:710rpx;
  padding:0 20rpx;
  .eve_con{
    border-bottom:2rpx solid rgba(0,0,0,0.1);
    padding-bottom:20rpx;
    .eve_top{
      display: flex;
      justify-content: space-between;
      padding:20rpx 0;
      align-items: center;
    }
  }
  .noData{
    width:100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top:300rpx;
    img{
      width:332rpx;
      height:332rpx;
      display: block;
      margin-bottom:30rpx;
    }
  }
  .eve_mid{
    display: flex;
      .mid_le{
        width:160rpx;
        height:160rpx;
        border-radius: 6rpx;
        border:1px solid rgba(229,229,229,1);
        margin-right:10rpx;
        img{
          width:100%;
          height:100%;
          display: block;
        }
      }
      .mid_ri{
          width:530rpx;
        .eve_bot{
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      }
  }
  .mask{
    position: fixed;
    top:0;right:0;bottom:0;left:0;
    width:100vw;
    height:100vh;
    background:rgba(0,0,0,0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    .code_mes{
      width:400rpx;
      height:600rpx;
      background:#fff;
      border-radius: 10rpx;
      padding-top:30rpx;
      position: relative;
      .close_img{
        position: absolute;
        width:54rpx;
        height:54rpx;
        right:-66rpx;
        top:-66rpx;
        z-index: 999;
        img{
          width:100%;
          height:100%;
          display: block;
        }
      }
      .getCode_title{
        width:100%;
        text-align: center;
      }
      .code{
        width:100%;
        text-align: center;
        padding-bottom:20rpx;
      }
      .storename{
        width:100%;
        text-align: center;
      }
    }
  }
}
</style>
