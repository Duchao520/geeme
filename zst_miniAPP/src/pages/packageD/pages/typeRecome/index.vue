<template>
  <div class="page">
    <div class="nav_top">
      <div class="nav_top_le">
        <i class="iconfont icon-dizhi1"></i>
        <picker
          mode="region"
          @change="bindRegionChange"
          :value="region"
          :custom-item="customItem">
          <div class="nav_mid">
            {{ region[1] }}
          </div>
        </picker>
        <i class="iconfont icon-xiajiantou"></i>
      </div>
      <div class="nav_top_ri">
        <div class="input_nav">
          <i class="iconfont icon-sousuo"></i>
          <input type="text" v-model="par.storeName" placeholder="过桥米线" @change="seatce">
        </div>
      </div>
    </div>


    <div class="shop_bot">
      <div class="eve_shop_inner">
        <div class="eve_con" :key="item.id" v-for="item in dataArr" @click="goShop(item)">
          <div class="eve_con_le">
            <img :src="item.storeLogo" alt="">
            <!--11111111111111-->
            <div class="isCarder_shop" v-if="item.hasSvipSharecard ==1">
              <img src="/static/img/shopRecom/cardShop.png" alt="">
            </div>
          </div>
          <div class="eve_con_ri">
            <div class="ev_shopName">
              <span class="ev_name">{{item.storeName}}</span>
              <span class="ev_add">{{item.distance}}km</span>
            </div>
            <div class="intro">
              <div class="in_tit">{{item.dealCateMatchRow}}</div>
              <div class="in_img" v-if="item.hasSvipcardActive == 1">
                <img src="/static/img/shopRecom/comeCar.png" alt="">
              </div>
            </div>

            <div class="int_cu" v-if="item.arr.length!=0">
              <div class="cu_img">
                <img src="/static/img/shopRecom/cu.png" alt="">
              </div>
              <div class="cu_con">
                满{{item.arr[0].consumeMoney}}减{{item.arr[0].availableIntegral}}话呗
              </div>
            </div>

            <div class="int_cu" v-if="item.newArr.length !=0">
              <div class="cu_img">
                <img src="/static/img/shopRecom/zhe.png" alt="">
              </div>
              <div class="cu_con">
                话呗抵扣{{item.newArr[0].discountRate}}折活动
              </div>
            </div>

            <div class="int_cu">
              <div class="cu_img" style="width:90rpx;height:26rpx;">
                <img src="/static/img/shopRecom/sha.png" alt="">
              </div>
              <div class="cu_con" style="font-size: 20rpx;">
                立领卡主折扣{{item.shareCardDiscount}}折，折上折更优惠
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <no-data :showNoData = "noData" :noticeMes="conNot"/>
    <div class="no_more" v-if="noMore">{{notice_mes}}</div>
  </div>
</template>

<script>
  import { getSignIn , getQuery} from '@/common/js/comm';
  import Tips from '@/common/js/tips'
  import Swiper  from '@/components/swiper'
  import QQMapWX from '@/utils/qqmap-wx-jssdk';
  import noData from '@/components/noData'
  var qqMap;
  export default {
    name: "index",
    components: {
      Swiper , noData
    },
    data(){
      return {
        region: this.$store.state.region ? this.$store.state.region : ['浙江省','杭州市','萧山区'],
        // 轮播
        images:[],
        dataList:[],
        dataArr:[],
        par:{
          token:this.$store.state.token,
          Longitude:this.$store.state.lng,
          latitude:this.$store.state.lat,
          cityCode:this.$store.state.areaCode,
          storeName:'',
          pageNum:1,
          pageSize:20,
          industryId:''
        },
        notice_mes:'',
        noMore:false,

        noData:false,
        conNot:'',
        namePath:'',
        arr:'',
        newArr:''
      }
    },
    mounted(){
      var par = getQuery();
      console.log(par);
      this.par.industryId = par.industryId;
      this.recShop();
      this.getrecomList(this.par);
      this.namePath = par.namePath;
      this.cityCode = par.cityCode;
      wx.setNavigationBarTitle({
        title: this.namePath,
      });
      qqMap = new QQMapWX({key:'BQ5BZ-KE434-I4CU6-X5WGI-J4MXE-7CFZL'});
    },
    methods:{
      goShop(par){
        console.log(par);
        wx.navigateTo({
          url:`/pages/packageB/pages/shopRecDet/main?shopStoreId=${par.shopStoreId}&distance=${par.distance}`
        })
      },
      recShop(){
        var _this = this;
        var _data= {
          token:_this.$store.state.token,
        }
        getSignIn(_data).then(sec=>{
          _this.$http.recShop(_data,sec).then(res=>{
            for (let i = 0; i < res.data.length; i++) {
              res.data[i].imghref = `${res.imgDomain}${res.data[i].imghref}`
            }
            _this.images = _this.images.concat(res.data);
          })
        })
      },
      getrecomList(_data){
        var _this = this;
        getSignIn(_data).then(sec=>{
          _this.$http.recomList(_data,sec).then(res=>{
            if(res.data.length == 0 && this.dataArr.length !=0) {
              wx.hideLoading()
              _this.noMore = true;
              _this.notice_mes ='没有更多数据了~';
            }
            for(let i=0;i<res.data.length;i++){
              if(res.data[i].discountInfo) {
                res.data[i].discountRate = res.data[i].discountInfo.discountRate;
              }
              if(res.data[i].fullReduceInfo) {
                res.data[i].consumeMoney = res.data[i].fullReduceInfo.consumeMoney;
                res.data[i].availableIntegral = res.data[i].fullReduceInfo.availableIntegral;
              }else{
                res.data[i].consumeMoney = '';
              }
              if(JSON.stringify(res.data[i].shareCard) =='{}'){
                res.data[i].hasCard  = 0;
              }else{
                res.data[i].hasCard = 1;
              }
              var arr=[];var barr=[];
              var newArr = res.data[i].lstIntegralactive;
              for(let k=0;k<newArr.length;k++){
                //满减
                if(newArr[k].discountType==2 && newArr[k].isDefault ==1){
                  arr.push(newArr[k]);
                }else if(newArr[k].discountType==1 && newArr[k].isDefault ==1){
                  barr.push(newArr[k]);
                }
              }
              res.data[i].arr = arr;

              res.data[i].newArr = barr;
              console.log(res.data);

            }
            _this.dataArr = _this.dataArr.concat(res.data);
            if(_this.dataArr.length==0){
              _this.conNot='没有找到相关商家';
              _this.noData=true;
            }

          })
        })
      },
      seatce(){
        this.par.pageNum =1;
        this.dataArr = [];
        if(this.par.searchText!=''){
          this.par.cityCode = '';
        }else{
          this.par.cityCode = this.$store.state.areaCode;
        }
        this.noMore = false;
        this.getrecomList(this.par);
      },
      bindRegionChange(e){
        var _this = this;
        this.region = e.target.value;
        let newArr = e.target.value;
        let code = e.target.code[1];
        _this.par.cityCode = code;
        let reg =newArr.pop();
        qqMap.geocoder({
          address: newArr,
          success:function (res) {
            _this.dataList = [];
            _this.dataArr = [];
            _this.noMore = false;
            _this.noData = false;
            _this.par.pageNum = 1;
            _this.getrecomList(_this.par);
          },
          fail: function(error) {
            console.error(error);
          },
        })
      },
    },
    async onReachBottom() {
      this.par.pageNum ++;
      Tips.loading();
      if(this.notice_mes == '没有多数据了~'){
        return
      }
      this.getrecomList(this.par);
    },
  }
</script>

<style lang="scss" scoped>
  .page{
    width:100%;
    .no_more{
      width:100%;
      height:90rpx;
      text-align: center;
      line-height: 90rpx;
      background:#F6F6F6;
      /*padding-bottom:160rpx;*/
    }
    .nav_top{
      width:100%;
      height:56rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding:20rpx 0;
      position: fixed;
      top:0;
      left:0;
      background:#fff;
      z-index: 99;
      .nav_top_le{
        width:160rpx;
        height:100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding:0 10rpx;
        .nav_mid{
          color:rgba(133,138,152,1);
          font-size: 28rpx;
        }
        .icon-dizhi1{
          color:#F7094D;
          font-size: 34rpx;
        }
        .icon-xiajiantou{
          color:#343C53;
          opacity: 0.6;
        }
      }
      .nav_top_ri{
        width:550rpx;
        height:100%;
        margin-right:20rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        .input_nav{
          width:470rpx;
          height:100%;
          background:rgba(242,242,242,1);
          border-radius:30rpx;
          padding:0 40rpx;
          display: flex;
          align-items: center;
          .icon-sousuo{
            float: left;
            opacity: 0.2;
          }
          input{
            float: left;
            padding-left:20rpx;
            font-size:28rpx;
          }
          input::placeholder{
            color:red;
          }
        }
      }
    }
    .nav_img{
      margin-top:96rpx;
      width:100%;
      height:300rpx;
    }
    .shop_img_type{
      width:682rpx;
      padding:34rpx;
      display: flex;
      justify-content: space-between;
      flex-direction: row;
      flex-wrap: wrap;
      .eve_shop_img{
        width:120rpx;
        display: flex;
        align-items: center;
        flex-direction: column;
        margin-bottom:10rpx;
        .eve_top{
          width:80rpx;
          height:80rpx;
          margin-bottom:20rpx;
          img{
            width:100%;
            height:100%;
            display: block;
          }
        }
        .eve_bot{
          font-size: 24rpx;
        }
      }
    }
    .shop_bot{
      width:710rpx;
      padding:0 20rpx;
      padding-top:88rpx;
      .shop_bot_title{
        font-size:36rpx;
        font-weight:bold;
        color:rgba(0,0,0,1);
        margin-bottom:36rpx;
      }
      .eve_shop_inner{
        width:100%;
        .eve_con{
          width:100%;
          height:190rpx;
          border-bottom:2rpx solid rgba(52,60,83,0.2);
          padding-bottom:56rpx;
          margin-top:30rpx;
          .eve_con_le{
            width:250rpx;
            height:190rpx;
            background:#ff6700;
            border-radius: 10rpx;
            float: left;
            position: relative;
            img{
              width:100%;
              height:100%;
              display: block;
              border-radius: 10rpx;
            }
            .isCarder_shop{
              position: absolute;
              left:-10rpx;
              top:-10rpx;
              width:90rpx;
              height:88rpx;
              display: block;
              img{
                width:100%;
                height:100%;
                display: block;
              }
            }
          }
          .eve_con_ri{
            float: left;
            width:434rpx;
            margin-left:16rpx;
            .ev_shopName{
              font-size: 32rpx;
              font-weight:400;
              @include jcsb;
              align-items: center;
              .ev_name{
                width:324rpx;
                @include ovh;
              }
              .ev_add{
                font-size:24rpx;
                color:rgba(52,60,83,0.6);
              }
            }
            .intro{
              height:30rpx;
              display: flex;
              align-items: center;
              margin-top:10rpx;
              .in_tit{
                font-size: 24rpx;
                line-height:30rpx;
                float: left;
                margin-right:14rpx;
              }
              .in_img{
                float: left;
                width:110rpx;
                height:30rpx;
                img{
                  width:100%;
                  height:100%;
                  display: block;
                }
              }
            }
          }
        }
      }
      .int_cu{
        width:100%;
        height:30rpx;
        display: flex;
        align-items: center;
        margin:10rpx 0;
        .cu_img{
          width:24rpx;
          height:24rpx;
          float: left;
          margin-right:10rpx;
          img{
            width:100%;
            height:100%;
            display: block;
          }
        }
        .cu_con{
          float: left;
          font-size: 24rpx;
        }
      }
      .int_bot_bot{

      }
    }
  }
</style>
