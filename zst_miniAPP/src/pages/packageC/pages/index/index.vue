<template>
  <div class="cardFriendsIndex">
    <div class="top_index">
      <swiper class="swiper_container" vertical="true" autoplay="true" circular="true" interval="5000">
        <block v-for="(item,index) in successMelunbo" :key="index">
          <swiper-item >
            <div class="swiper_item">
              <img :src="item.ico" alt="">
              <p class="fz-24 fc-ffffff txt-ellipsis" style="width: 600rpx">{{item.remark}}</p>
            </div>
          </swiper-item>
        </block>
      </swiper>
    </div>
    <div class="suc_History fz-30 fc-ffffff" @click="goCutHis">砍成记录</div>
    <div class="active-list">
      <p class="text-center fz-30 font-weight" style="color: #FA336C">我正在砍价的({{count}})</p>
      <swiper interval="5000" autoplay="true" circular="true" style="height:244rpx;box-shadow:0 1rpx 32rpx 6rpx rgba(254, 171, 193, 1);" v-if="nodata ==1">
        <block v-for="(item,index) in dataBaring" :key="index" >
          <swiper-item>
            <div class="list-item box_padding bg-FFFFFF flex_box">
              <img :src="item.bargainImg" alt="" class="thumb">
              <div class="detail">
                <div class="txt-ellipsis flex_box align_center">
                  <i class="iconfont icon-shangjia1 fc-F7094D fz-36" style="margin-right: 8rpx"></i>
                  <span class="fz-28" style="color: #010101">{{item.shopName}}</span>
                </div>
                <p class="fz-34 txt-ellipsis font-weight" style="margin-bottom: 12rpx;@include ovhm(1)">{{item.bargainTitle}}</p>
                <div class="flex_box justify_space_between align_center">
                  <div>
                    <p class="fz-24 fc-0D0D0F">还需砍<span class="iconfont icon-renminbi fc-F7094D fz-38">{{item.disPrice}}</span></p>
                  </div>
                  <button class="btn_radius fz-34 fc-ffffff" @click="goCut(item)">继续砍价</button>
                </div>
              </div>
            </div>
          </swiper-item>
        </block>
      </swiper>
      <!--没有更多数据了-->
      <div class="nodata" v-if="nodata ==0" style="display: flex;flex-direction: column;align-items: center;">
        <div>暂无正在参与砍价的活动</div>
      </div>
      <div style="width:100%;text-align: center;color:#FA336C;font-size: 30rpx;" v-if="lookMore==1" @click="goLookMore">查看更多</div>
    </div>
    <div class="head_title fz-36 font-weight box_padding" style="background: #F2F2F2;padding: 20rpx">周边的砍价活动</div>
    <div class="common-list">
      <div class="list-item" v-for="(item,index) in dataList"
           :key="index" style="margin-bottom: 12rpx">
        <div class="flex_box justify_space_between align_center" style="margin-bottom: 12rpx">
          <p class="flex_box align_center txt-ellipsis" style="width: 550rpx">
            <i class="iconfont icon-shangjia1 fc-F7094D fz-36" style="margin-right: 8rpx"></i>
            <span class="fz-28">{{item.storeName}}</span>
          </p>
          <p class="fz-24 fc-8D8E98 flex_box" @click="slideShow(index)">{{item.isSlide ? '收起' : '展开'}}({{item.biBargainsLength}})<i class="iconfont fz-22"
                                                                                                         :class="{'icon-shouqitianchong': item.isSlide,'icon-shouqitianchong-copy': !item.isSlide}"></i></p>
        </div>
        <div style="overflow: hidden">
          <div class="flex_box"
               v-if="item.isSlide || idx == 0"
               v-for="(bargain,idx) in item.biBargains"
               style="margin-bottom: 20rpx;border-bottom: 1rpx solid #E5E5E5;padding-bottom: 20rpx">
            <img :src="bargain.mainImg" alt="" class="thumb">
            <div class="detail">
              <p class="fz-34 txt-ellipsis">{{bargain.title}}</p>
              <div class="flex_box justify_space_between align_center" style="margin-bottom: 12rpx">
                <div style="width: 370rpx">
                  <v-progress :height="'15'" :rate="((bargain.shareNum - bargain.surplusShareNum)/bargain.shareNum*100) + '%'" :progressBg="'#4045D5'"></v-progress>
                </div>
                <p class="fz-22 fc-8D8E98">已砍{{bargain.shareNum - bargain.surplusShareNum}}/{{bargain.shareNum}}份</p>
              </div>
              <div class="flex_box justify_space_between align_center">
                <div class="flex_box flex_column" style="height: 70rpx">
                  <p class="fz-24">已有{{bargain.helperNum}}人参与</p>
                  <p class="flex_box align_center" v-if="bargain.presentPrice != 0">
                    <i class="iconfont icon-renminbi fz-38 fc-F7094D">{{bargain.presentPrice}}</i>
                    <i class="iconfont icon-renminbi fz-30 fc-8D8E98" style="text-decoration: line-through">{{bargain.price}}</i>
                  </p>
                  <p class="fz-38 fc-F7094D" v-else>砍价免费拿</p>
                </div>
                <button class="btn_radius fc-ffffff fz-34"
                        style="background: #FA336C;padding: 0 12rpx" @click="goJoinPrice(bargain)">参与砍价</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="no_more" v-if="nomoreData==1">没有更多数据了~</div>
    </div>
  </div>
</template>

<script>
  import {getSignIn, getQuery, toDate} from '@/common/js/comm';
  import floatTo from '@/common/js/floatTo'
  import Tips from '@/common/js/tips'
  import vProgress from './v-progress'

  export default {
    name: "cardFriendsIndex",
    data() {
      return {
        dataList: [],
        dataBaring: '',
        toast_type1: '1',
        toast_type2: '1',
        lookMore: 1,
        nodata: 1,   //是否有正在砍价的活动  1有  0没有
        pageNum: 1, //分页的数据
        nomoreData: 0,
        count: '',
        successMelunbo: '',
        bargainingCount: '',
        animationData: {},
        slideFlag: false
      }
    },
    components: {
      vProgress
    },
    onShow() {
      this.getBargaining();
      this.getBargain();
      this.lookSuclunbo();
    },
    onHide() {
      this.pageNum = 1;
      this.dataList = [];
      this.dataBaring = '';
    },
    methods: {
      getBargain() {
        var _data = {
          token: this.$store.state.token,
          longitude: this.$store.state.lng,
          latitude: this.$store.state.lat,
          pageNum: this.pageNum,
          limit: 10,
        }
        var _this = this;
        getSignIn(_data).then(sec => {
          _this.$http.getBargain(_data, sec).then(res => {
            if (res.state == 1) {
              if (res.data.length != 0) {
                _this.nomoreData = 0;
                _this.dataList = _this.dataList.concat(res.data);
                _this.dataList.forEach(ele => {
                  ele.isSlide = ele.isSlide ? ele.isSlide : 1;
                  ele.biBargainsLength = ele.biBargains.length;
                  ele.biBargains.forEach(bargain => {
                    bargain.presentPrice = floatTo.multiply(floatTo.multiply(bargain.price,bargain.discount),0.1).toFixed(2);
                  })
                })
              } else {
                _this.nomoreData = 1;
              }
            } else {
              Tips.toast(`${decodeURIComponent(res.msg)}`, 'none');
            }
          })
        })
      },
      goCutFree(par) {
        var _this = this;
        //shopStoreId     shopId  storeIds
        wx.navigateTo({
          url: `/pages/packageB/pages/shopRecDet/main?shopStoreId=${par.id}&shopId=${par.shopId}`,
          success() {
            _this.pageNum = 1;
            _this.dataList = [];
            _this.dataBaring = [];
          }
        })

      },
      getBargaining() {
        var _data = {
          token: this.$store.state.token,
          ingNum: 5
        }
        var _this = this;
        getSignIn(_data).then(sec => {
          _this.$http.getBargaining(_data, sec).then(res => {
            if (res.state == 1) {
              _this.count = res.count;
              if (res.data.length == 0) {
                _this.nodata = 0;
                _this.lookMore = 0;
              } else if (res.data.length > 1) {
                _this.nodata = 1;
                _this.lookMore = 1;
              } else {
                _this.nodata = 1;
                _this.lookMore = 0;
              }
              _this.dataBaring = res.data;
              _this.dataBaring.forEach(ele => {
                ele.disPrice = floatTo.subtract(ele.taskPrice,ele.helpedPrice);
              });
              _this.$forceUpdate();
            } else {
              Tips.toast(`${decodeURIComponent(res.msg)}`);
            }
          })

        })

      },
      goJoinPrice(par){
        wx.navigateTo({
          url:`/pages/packageC/pages/cutFree/main?bargainId=${par.id}&storeId=${par.storeIds}`
        })
      },
      goCut(par) {
        var _this = this;
        wx.navigateTo({
          url: `/pages/packageC/pages/cutFree/main?bargainId=${par.bargainId}&bargainTasksId=${par.id}&storeId=${par.storeId}&fromPage=index`,
          success() {
            _this.pageNum = 1;
            _this.dataList = [];
            _this.dataBaring = [];
          }
        })
      },
      goCutHis() {
        var _this = this;
        wx.navigateTo({
          url: '/pages/packageC/pages/cutHistory/main',
          success() {
            _this.pageNum = 1;
            _this.dataList = [];
            _this.dataBaring = [];
          }
        })
      },
      goactiveRules() {
        var _this = this;
        wx.navigateTo({
          url: '/pages/packageC/pages/activeRules/main',
          success() {
            _this.pageNum = 1;
            _this.dataList = [];
            _this.dataBaring = [];
          }
        })
      },
      lookSuclunbo() {
        var _data = {
          token: this.$store.state.token,
          pageNum: 1,
          limit: 10
        }
        var _this = this;
        getSignIn(_data).then(sec => {
          _this.$http.lookSucMes(_data, sec).then(res => {
            _this.successMelunbo = res.data;
          })
        })
      },
      goLookMore() {
        var _this = this;
        wx.navigateTo({
          url: '/pages/packageC/pages/opingActive/main',
          success() {
            _this.pageNum = 1;
            _this.dataList = [];
            _this.dataBaring = [];
          }
        })
      },
      close() {
        this.toast_type1 = '';
        this.toast_type2 = '';
      },
      slideShow(index){
        if(this.dataList[index].isSlide){
          this.slideUp(index)
        }else{
          this.slideDown(index)
        }

      },
      slideDown(index){
        var that = this;
        that.$set(that.dataList[index],'isSlide',1);
        that.$forceUpdate();
      },
      slideUp(index){
        var that = this;
        that.$set(that.dataList[index],'isSlide',0);
        that.$forceUpdate();
      }
    },
    async onReachBottom() {
      // 到这底部在这里需要做什么事情
      this.pageNum++;
      this.getBargain();
    },
  }
</script>

<style lang="scss" scoped>
.cardFriendsIndex{
  width:100%;
  button{
    margin: 0;
    padding: 0;
  }
  .suc_History{
    position: fixed;
    z-index: 100;
    right: 0;
    top: 90rpx;
    border-top-left-radius: 30rpx;
    border-bottom-left-radius: 30rpx;
    padding: 0 12rpx 0 24rpx;
    background:linear-gradient(0deg,rgba(53,47,192,1),rgba(79,98,242,1));
  }
 .top_index{
   width: 710;
   height: 80rpx;
   background:linear-gradient(0deg,rgba(53,47,192,1),rgba(79,98,242,1));
   padding:0 20rpx;
   display: flex;
   flex-direction: row;
   justify-content: center;
   align-items: center;
   .swiper_container {
     height: 80rpx;
     width: 100%;
   }
   .swiper_item {
     font-size: 26rpx;
     height: 100%;
     color: #666;
     overflow: hidden;
     text-overflow: ellipsis;
     white-space: nowrap;
     letter-spacing: 2px;
     padding-left:10rpx;
     display: flex;
     align-items: center;
     img{
       width:38rpx;
       height:38rpx;
       display: block;
       margin-right:20rpx;
       border-radius: 50%;
     }
   }
   .le_in{
     color:#ffffff;
     display: flex;
     line-height: 50rpx;
     font-size: 30rpx;
     align-items: center;
     i{
       line-height: 50rpx;
       font-size: 28rpx;
       margin-left:10rpx;
     }
   }
   .ri_in{
     background:rgba(0,0,0,0.2);
     display: flex;
     color: #fff;
     font-size:28rpx;
     padding:6rpx 10rpx;
     margin:6rpx 0;
     width:300rpx;
     box-sizing: border-box;
     border-radius: 30rpx;
     align-items: center;
     .ri_in_le{
       width:50%;
       border-right:2rpx solid #fff;
       text-align: center;
     }
     .ri_in_ri{
       width:50%;
       text-align: center;
     }
   }
 }
}
.active-list{
  width: 100%;
  box-sizing: border-box;
  padding: 20rpx 22rpx;
  background: #FEDBE5;
  .module{
    width: 262rpx;
    height: 32rpx;
    margin: 0 auto;
    margin-bottom: 22rpx;
    img{
      width:100%;
      height:100%;
      display: block;
    }
  }
  .list-item{
    padding: 23rpx 13rpx;
    border-radius: 6rpx;
    /*box-shadow:0 1rpx 32rpx 6rpx rgba(254, 171, 193, 1);*/
    margin-bottom:20rpx;
    .thumb{
      display: block;
      width: 200rpx;
      height: 200rpx;
      border-radius: 10rpx;
      margin-right: 17rpx;
    }
    .detail{
      width: 460rpx;
      height:100rpx;
      .time{
        display: block;
        width: 40rpx;
        height: 40rpx;
        border-radius: 10rpx;
        background:linear-gradient(0deg,rgba(247,9,77,1),rgba(252,89,137,1));
        line-height: 40rpx;
      }
      button{
        display: block;
        width: 168rpx;
        height: 70rpx;
        background: #FA336C;
        padding:0;
        line-height: 70rpx;
      }
    }
  }
}
.common-list {
  width: 100%;
  box-sizing: border-box;
  padding: 20rpx;
  background: #FFFFFF;
  .list-item{
    .thumb{
      display: block;
      width: 180rpx;
      height: 180rpx;
      border-radius: 10rpx;
      margin-right: 17rpx;
    }
    .detail{
      width: 520rpx;
      button{
        display: block;
        /*width: 168rpx;*/
        height: 70rpx;
        line-height: 70rpx;
        margin: 0;
      }
    }
  }
  .no_more{
    width:100%;
    height:80rpx;
    text-align: center;
    line-height: 80rpx;
  }
}
</style>
