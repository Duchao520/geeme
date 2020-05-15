<template>
  <div class="goodsDetail">
    <v-head :title="'砍价免费拿'"
            :borderBtm="true"></v-head>
    <swiper :options="swiperOption" class="swiper-container" ref="mySwiper">
      <swiper-slide class="products" v-for="(item,index) in imgs"
                    :key="index">
        <img v-lazy="item" alt="" @click="getIndex(index)">
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>

    <section style="position: relative">
      <div class="bargain_act_title box_padding flex_box" style="padding: .1rem .22rem">
        <i class="iconfont icon-huore fc-FEB623 fz-32"></i>
        <p class="fz-30 fc-ffffff txt-overflow" style="width: 6.35rem">{{biBargain.title}}</p>
      </div>
      <p class="flex_box justify_space_between"
         style="margin-bottom: .24rem">
        <span class="flex_box" style="align-items: flex-end">
          <i class="iconfont icon-renminbi fz-38 fc-F7094D">{{Number($accMul($accMul(Number(biBargain.price),Number(biBargain.discount)),0.1)).toFixed(2)}}</i>
          <i class="iconfont icon-renminbi fz-30 fc-8D8E98" style="text-decoration: line-through">{{Number($accMul(Number(biBargain.price),1)).toFixed(2)}}</i>
        </span>
        <span class="fz-38 fc-F7094D">{{$Subtr(Number(biBargain.shareNum),Number(biBargain.surplusShareNum))}}人已免费拿</span>
      </p>
      <p class="fc-0D0D0F fz-28 txt-overflow"
         style="margin-bottom: .32rem">{{biBargain.copywritingTitle}}</p>
      <p class="box_padding fz-28" style="padding: .31rem .17rem;background: #F4F5F6;margin-bottom: .22rem">
        {{biBargain.description}}
      </p>
      <div class="flex_box align_center justify_space_between" v-if="biBargain.winRule">
        <p class="fz-28 fc-8D8E98">砍价成功，一起get如何领奖攻略</p>
        <router-link :to="{name: 'winRule',params: {winrule: biBargain.winRule}}" tag="button" class="fz-28 fc-ffffff btn_radius bg-F7094D" style="padding: .12rem">领奖说明<i class="iconfont icon-shuomingb"></i></router-link>
      </div>
    </section>
    <section @click="callZSTOnlineShop(detail.biBargain.shopId)">
      <div class="flex_box align_center" style="margin-bottom: .32rem">
        <img :src="detail.shopLogo" alt="" class="logo">
        <div class="flex_box flex_column justify_space_between"
             style="width: 6rem">
          <p class="fz-28 txt-ellipsis">供应商：{{detail.storeName}}</p>
          <p class="fz-28" @click.stop="tel(detail.shopTel)">{{detail.shopTel}} <i class="iconfont icon-tubiao210 fc-F7094D"></i></p>
        </div>
        <i class="iconfont icon-arrow-right fc-8D8E98"></i>
      </div>
      <div class="flex_box justify_space_between align_center">
        <p class="fz-30 fc-0D0D0F">服务</p>
        <i class="iconfont icon-gouxuankuangxuanzhong fz-24" style="color: #F96868"><span class="fc-8D8E98">全国联保</span></i>
        <i class="iconfont icon-gouxuankuangxuanzhong fz-24" style="color: #F96868"><span class="fc-8D8E98">行货正品</span></i>
        <i class="iconfont icon-gouxuankuangxuanzhong fz-24" style="color: #F96868"><span class="fc-8D8E98">包邮</span></i>
        <i class="iconfont icon-gouxuankuangxuanzhong fz-24" style="color: #F96868"><span class="fc-8D8E98">正规发票</span></i>
      </div>
    </section>
    <section v-if="commentList.length > 0">
      <p class="fz-34 fc-0D0D0F" style="margin-bottom: .24rem">砍成晒单</p>
      <div v-for="(item,index) in commentList" :key="index">
        <div class="flex_box align_center"
             style="margin-bottom: .3rem">
          <img v-lazy="item.ico" alt="" class="ico">
          <div class="flex_box flex_column justify_space_between">
            <p class="fz-30 fc-0D0D0F">{{item.nick}}</p>
            <p class="fz-24 fc-8D8E98">{{timestampToTime(item.createTime)}}</p>
          </div>
        </div>
        <p class="fz-28" style="color: #B1B1B1;margin-bottom: .16rem">{{item.comment}}</p>
        <div class="thumbs">
          <img v-lazy="img" alt=""
               class="thumb-item"
               v-for="(img,idx) in item.commentImgs"
               :key="idx">
        </div>
      </div>
    </section>
    <div style="height: 1rem"></div>
    <footer class="flex_box align_center justify_space_between box_padding" style="padding: 0 .2rem">
      <div class="flex_box align_center">
        <i class="iconfont icon-warning fc-ffffff fz-32"></i>
        <p class="fz-28">提示：到店消费即可参加砍价活动</p>
      </div>
      <button class="iconfont icon-fabu fz-30 fc-ffffff" @click="link">去店里</button>
    </footer>
    <album :photos="imgs" ref="album"></album>
    <!--<album :photos="commentImgs" ref="album2"></album>-->
    <v-toast ref="toast" :tip="tip"></v-toast>
  </div>
</template>

<script>
  import vHead from '@/components/common/v-head'
  import album from '@/components/common/album'
  import 'swiper/dist/css/swiper.css';
  import {swiper, swiperSlide} from 'vue-awesome-swiper';
  import {bargainDetail , bargainCommentList} from "@/assets/js/comm";
  import {timestampToTime , callAppMethod , callZSTOnlineShop , enterTheodolite} from "@/assets/js/jsBridge";

  export default {
    name: "goodsDetail",
    components: {
      vHead,album,
      swiper, swiperSlide
    },
    props: ['tokenPromise'],
    data(){
      return{
        bargainId: this.$route.query.bargainId,
        bargainTasksId: this.$route.query.bargainTasksId,
        origin: this.$route.query.origin,
        detail: '',
        biBargain: '',
        imgs: '',
        token: '',
        tip: '',
        commentImgs: '',
        commentList: [],
        swiperOption: {
          pagination: {
            el: '.swiper-pagination',
          },
        }
      }
    },
    created(){
      callAppMethod('17');
    },
    mounted(){
      var _self = this;
      _self.tokenPromise.then(res => {
        _self.token = res;

        _self.init();
      })
    },
    methods: {
      timestampToTime(timestamp){
        return timestampToTime(timestamp);
      },
      getIndex(index) {
        var _self = this;
        _self.$refs.album.showAlbum(index);
      },
      getIndex_2(index) {
        var _self = this;
        _self.$refs.album2.showAlbum(index);
      },
      init(){
        var _self = this;
        _self.bargainDetail();
        _self.bargainCommentList();
      },
      toast(tip){
        this.tip = tip;
        this.$refs.toast.toast();
      },
      tel(phone){
        window.location.href = 'tel:' + phone
      },
      bargainDetail(){
        var _self = this;
        var _data = {
          token: String(_self.token),
          bargainTasksId: String(_self.bargainTasksId ? _self.bargainTasksId : ''),
          bargainId: String(_self.bargainId)
        };
        bargainDetail(_data).then(res => {
          if(res.data.state == 1){
            _self.detail = res.data.data;
            _self.biBargain = res.data.data.biBargain;
            _self.imgs = res.data.data.bargainImgs.split(',')
          }else{
            _self.toast(decodeURIComponent(res.data.msg));
          }
        })
      },
      bargainCommentList(){
        var _self = this;
        var _data = {
          token: String(_self.token),
          bargainId: String(_self.bargainId)
        };
        bargainCommentList(_data).then(res => {
          if(res.data.state == 1){
            _self.commentList = res.data.data;
            res.data.data.forEach(ele => {
              ele.commentImgs = ele.imgs.split(',');
              ele.commentImgs = ele.commentImgs.filter(ele => ele.length!=0);
            })
          }else{
            _self.toast(decodeURIComponent(res.data.msg));
          }
        })
      },
      link(){
        if(this.detail.longitude && this.detail.latitude){
          enterTheodolite(this.detail.longitude,this.detail.latitude);
        }else{
          this.toast('还没有商家位置');
        }
      },
      linkToSvipPay(){
        this.$router.push({
          name: 'svipPayIndex',
          query:{
            shopStoreId: this.biBargain.storeIds,
            distance: 0
          }
        })
      },
      callZSTOnlineShop(shopId){
        callZSTOnlineShop(shopId)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/css/global";
  .goodsDetail{
    .swiper-container{
      width: 100%;
      height: 7.5rem;
      position: relative;
      img{
        display: block;
        width: 100%;
        height: 100%;
        background: #0d0d0f;
      }
      .my-bullet-active{
        background: #FFFFFF;
        opacity: 1;
      }
    }
    section{
      box-sizing: border-box;
      padding: .32rem .2rem;
      border-bottom: .15rem solid #F4F5F6;
      .bargain_act_title{
        width: 100%;
        height: 1rem;
        background: url($ctxpath + "/static/customImgs/cardFriends/bargain_act_title.png") center center no-repeat;
        background-size: 100% 100%;
        position: absolute;
        top: -.99rem;
        left: 0;
        z-index: 20;
      }
      .logo{
        display: block;
        width: .7rem;
        height: .7rem;
        border-radius: .1rem;
        margin-right: .17rem;
      }
      .ico{
        display: block;
        width: .7rem;
        height: .7rem;
        border-radius: 50%;
        margin-right: .09rem;
      }
      .thumbs{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .thumb-item{
          display: block;
          width: 2rem;
          height: 2rem;
          border-radius: .1rem;
          margin-bottom: .1rem;
        }
      }
    }
    footer{
      width: 100%;
      height: 1rem;
      background: #FA336C;
      color: #FFFFFF;
      line-height: 1rem;
      text-align: center;
      position: fixed;
      bottom: 0;
      left: 0;
      button{
        display: block;
        height: .7rem;
        background:linear-gradient(0deg,rgba(53,47,192,1),rgba(79,98,242,1));
        border-radius:.1rem;
        padding: 0 .12rem;
      }
    }
  }
</style>
