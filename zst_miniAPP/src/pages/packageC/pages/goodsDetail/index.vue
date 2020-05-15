<template>
  <div class="goodsDetail" style="padding-bottom:100rpx;">
    <div class="top_img">
      <cut-swiper :images="images"/>
    </div>
    <div class="bottom_inner">
      <img src="../../static/img/background.png" alt="">
      <div class="bot_text">
          <i class="iconfont icon-hot"></i>
          <div class="title_inner">
            【{{biBargain.title}}】
          </div>
      </div>
    </div>
    <section>
      <p class="flex_box justify_space_between align_center"
         style="margin-bottom: 24rpx">
        <span class="flex_box" style="align-items: flex-end" v-if="prentPrice != 0">
          <i class="iconfont icon-renminbi fz-38 fc-F7094D" style="margin-right:10rpx;">{{prentPrice}}</i>
          <i class="fz-30 fc-8D8E98" style="text-decoration: line-through">￥{{biBargain.price}}</i>
        </span>
        <span class="flex_box fz-38 fc-F7094D" v-else>砍价免费拿</span>
        <span class="fz-30 fc-8D8E98">{{useNum}}人已免费拿</span>
      </p>
      <p style="font-size: 30rpx;">
        {{biBargain.copywritingTitle}}
      </p>
      <p class="box_padding fz-28 desc" style="padding: 66rpx 17rpx 31rpx;background: #F4F5F6">
        <i class="fz-24 fc-ffffff">活动描述</i>
       {{biBargain.description}}
      </p>
    </section>
    <section>
      <div class="flex_box align_center" @click="goShopDetail(dataDetail)">
        <img :src="dataDetail.shopLogo" alt="" class="logo">
        <div class="flex_box flex_column justify_space_between"
             style="width: 600rpx">
          <p class="fz-28 txt-ellipsis flex_box">供应商：{{dataDetail.shopName}}</p>
          <p class="fz-28 flex_box align_center">
            <i class="iconfont icon-dizhi fz-32 "></i>{{distance}}km |
            <i class="txt-ellipsis" style="width: 350rpx">{{dataDetail.address}}</i>
            <i class="iconfont icon-dianhua fc-F7094D" style="display: inline-block;" @click.stop="phone"></i>
          </p>
        </div>
        <i class="iconfont icon-youjiantou fc-8D8E98" style="color: #D2D2D2"></i>
      </div>
    </section>
    <section v-if="commData.length!=0">
      <p class="fz-34 fc-0D0D0F" style="margin-bottom: 24rpx">砍成晒单</p>
      <div class="eve_list" v-for="(item,index) in commData">
        <div class="flex_box align_center"
             style="margin-bottom: 30rpx">
          <img :src="item.ico" alt="" class="ico">
          <div class="flex_box flex_column justify_space_between">
            <p class="fz-30 fc-0D0D0F">{{item.nick}}</p>
            <p class="fz-24 fc-8D8E98">{{item.createTime}}</p>
          </div>
        </div>
        <p class="fz-28" style="color: #B1B1B1;margin-bottom: 16rpx">{{item.comment}}</p>
        <div class="thumbs">
          <img :src="itm" alt="" v-for="(itm,inx) in  item.imgs" :key="index" class="thumb-item" @click="previewImg(item.imgs)">
        </div>
      </div>
    </section>
    <!--<div style="height: 100rpx"></div>-->
    <footer class="fz-34" @click="link">
      {{dataDetail.id ? '喊好友砍一刀' :  '我要发起砍价'}}
    </footer>
  </div>
</template>

<script>
  import { getSignIn , getQuery , toDate ,calDistance} from '@/common/js/comm';
  import cutSwiper from '@/components/cutSwiper'
  import Tips from '@/common/js/tips'
  import floatTo from '@/common/js/floatTo'
  export default {
    name: "goodsDetail",
    components: {
      cutSwiper
    },
    data(){
      return{
        images:[],
        bargainTasksId:'',
        dataDetail:'',
        useNum:'',
        shareNum:'',
        surplusShareNum:'',
        biBargain:'',
        discount:'',
        prentPrice:'',
        bargainId:'',
        commData:[],
        frompage:'',
        distance: ''
      }
    },
    mounted(){
      var par = getQuery();
      this.bargainTasksId = par.bargainTasksId ? par.bargainTasksId : '';
      this.bargainId = par.bargainId ? par.bargainId : '';
      this.frompage = par.frompage ? par.frompage :'';
      this.getTasksing();
      this.comList();
    },
    methods: {
      getTasksing(){
        var _data ={
          token:this.$store.state.token,
          bargainId: this.bargainId,
          bargainTasksId:this.bargainTasksId,
        };
        var _this = this;
        getSignIn(_data).then(sec=>{
          _this.$http.barDetail(_data,sec).then(res=>{
            console.log('查看详情',res);
            _this.dataDetail = res.data;
            _this.shareNum = res.data.biBargain.shareNum; //总份数
            _this.surplusShareNum = res.data.biBargain.surplusShareNum; //剩余多少份
            _this.useNum = floatTo.subtract(Number(_this.shareNum),Number(_this.surplusShareNum));  //已领多少份
            _this.biBargain = res.data.biBargain;
            _this.discount =floatTo.divide( _this.biBargain.discount,10);
            _this.prentPrice = (floatTo.multiply(_this.biBargain.price, _this.discount)).toFixed(2);
            _this.storeIds = _this.biBargain.storeIds;
            wx.getLocation({//获取当前经纬度
              type: 'wgs84', //返回可以用于wx.openLocation的经纬度，官方提示bug: iOS 6.3.30 type 参数不生效，只会返回 wgs84 类型的坐标信息
              success: function (res) {
                _this.distance = calDistance(_this.dataDetail.latitude,_this.dataDetail.longitude,res.latitude,res.longitude)
              }
            })
            if( _this.dataDetail.bargainImgs){
              var newArr = _this.imgToArr(_this.dataDetail.bargainImgs);
              _this.images = newArr;
            }
          })
        })
      },
      phone(){
        var _this = this;
        if(_this.dataDetail.shopTel){
          wx.makePhoneCall({
            phoneNumber:_this.dataDetail.shopTel  //仅为示例，并非真实的电话号码
          })
        }else{
          Tips.toast('该商家暂未提供手机号','none')
        }
      },
      comList(){
        var _data = {
          token:this.$store.state.token,
          bargainId:this.bargainId,
        }
        var _this = this;
        getSignIn(_data).then(sec=>{
          _this.$http.comList(_data,sec).then(res=>{
            console.log(res);
            for(let i=0;i<res.data.length;i++){
              if(res.data[i].imgs){
                res.data[i].imgs = _this.imgToArr(res.data[i].imgs);
                res.data[i].createTime = toDate(res.data[i].createTime *1000);
              }
            }
            console.log('数组没有循环出来',res.data);
            _this.commData = res.data;
          })
        })
      },
      //图片字符串转对象 传入类型String
      imgToArr(str){
        var arr = str.split(',')
        var newArr = [];
        for(let i=0;i<arr.length;i++){
          if(arr[i] !=''){
            newArr.push(arr[i]);
          }
        }
        console.log(newArr);
        return newArr;
      },
      // 前往开团
      link(){
        var _this = this;
        if(_this.frompage == 'cutFree'){
          wx.navigateBack({
            delta: 1
          })
        }else{
          if(_this.biBargain.state==1) {
            wx.navigateTo({
              url: `/pages/packageC/pages/cutFree/main?bargainId=${_this.bargainId}&storeId=${_this.storeIds}&fromPage=canJoin`
            })
          }else if(_this.biBargain.state == 0){
            Tips.toast(`抱歉，该活动已经结束，感谢你的参与`,'none');
          }
        }
      },
      previewImg(imgs){
         console.log(imgs);
          wx.previewImage({
            current: '', // 当前显示图片的http链接
            urls: imgs // 需要预览的图片http链接列表
          })
      },
      goShopDetail(par){
        wx.navigateTo({
          url:`/pages/packageB/pages/shopRecDet/main?shopStoreId=${par.biBargain.storeIds}`
        })
      },
      goAcRules(par){
        wx.navigateTo({
          url:`/pages/packageC/pages/winRule/main?winRule=${par.biBargain.winRule}`
        })
      },
      formSubmit() {
        var _this = this;
        wx.getLocation({//获取当前经纬度
          type: 'wgs84', //返回可以用于wx.openLocation的经纬度，官方提示bug: iOS 6.3.30 type 参数不生效，只会返回 wgs84 类型的坐标信息
          success: function (res) {
            wx.openLocation({//​使用微信内置地图查看位置。
              latitude: Number(_this.dataDetail.latitude),//要去的纬度-地址
              longitude: Number(_this.dataDetail.longitude),//要去的经度-地址
              name: _this.dataDetail.address,
              address: _this.dataDetail.address
            })
          }
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  .goodsDetail{
    ._swiper {
      height:750rpx;
    }
    .top_img{
      width:750rpx;
      height:750rpx;
      border-bottom:1px solid rgba(229,229,229,1);
      position: relative;
      img{
        width:100%;
        height:100%;
        display: block;
      }
    }
    .bottom_inner{
      width:750rpx;
      height:100rpx;
      position: relative;
      img{
        width:100%;
        height:100%;
        display: block;
        opacity: 1;
      }
      .bot_text{
        position: absolute;
        top: 0;
        left: 0;
        width:710rpx;
        padding:10rpx  20rpx;
        height:80rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        i{
          color:yellow;
          font-size: 40rpx;
          margin-right:16rpx;
        }
        .title_inner{
          width: 680rpx;
          font-size: 30rpx;
          color:#fff;
          line-height: 38rpx;
        }
      }
    }
    section{
      box-sizing: border-box;
      padding: 32rpx 20rpx;
      border-bottom: 15rpx solid #F4F5F6;
      .logo{
        display: block;
        width: 70rpx;
        height: 70rpx;
        background: #0d0d0f;
        border-radius: 10rpx;
        margin-right: 17rpx;
      }
      .ico{
        display: block;
        width: 70rpx;
        height: 70rpx;
        border-radius: 50%;
        background: #0d0d0f;
        margin-right: 9rpx;
      }
      .thumbs{
        display: grid;
        grid-template-columns: 200rpx 200rpx 200rpx;
        grid-column-gap: 34rpx;
        .thumb-item{
          display: block;
          width: 200rpx;
          height: 200rpx;
          border-radius: 10rpx;
          background: #0d0d0f;
          margin-bottom: 10rpx;
          margin-right:20rpx;
        }
      }
      .award_intro{
        width:100%;
        /*margin:0 20rpx;*/
        height:60rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top:32rpx;
        .award_le{
          font-size: 28rpx;
          color:#8D8E98;
        }
        .award_ri{
          width:170rpx;
          height:100%;
          line-height: 60rpx;
          color:#fff;
          background:#F7094D;
          text-align: center;
          font-size: 28rpx;
          border-radius: 10rpx;
        }
      }
      .desc{
        position: relative;
        i{
          position: absolute;
          top: 0;
          left: 11rpx;
          text-align: center;
          line-height: 41rpx;
          display: block;
          width:124rpx;
          height:41rpx;
          background:linear-gradient(0deg,rgba(53,47,192,1),rgba(79,98,242,1));
          border-radius:2rpx 0 10rpx 10rpx;
        }
      }
    }
    footer{
      width: 100%;
      height: 100rpx;
      background:linear-gradient(0deg,rgba(247,9,77,1),rgba(252,89,137,1));
      box-shadow:0 3rpx 19rpx 2rpx rgba(255, 74, 0, 0.35);
      color: #FFFFFF;
      line-height: 100rpx;
      text-align: center;
      position: fixed;
      bottom: 0;
      left: 0;
    }
    .bot_notice{
      width:100%;
      height:98rpx;
      background:#FA336C;
      position: fixed;
      left:0;
      bottom:0;
      display: flex;
      align-items: center;
      justify-content: space-around;
      .goshop_btn{
        width:142rpx;
        height:68rpx;
        color:#fff;
        background:linear-gradient(0deg,rgba(53,47,192,1),rgba(79,98,242,1));
        border-radius:10px;
        text-align: center;
        line-height: 78rpx;
        padding: 0 18rpx;
        display: flex;
        justify-content: space-around;
        align-items: center;
      }
    }
  }
</style>
