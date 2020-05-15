<template>
  <div class="re-store">
    <img src="@/assets/imgs/cardFriends/store_head.png" alt="" class="board">
    <ul class="list">
      <li class="list-item" v-for="(item,index) in list" :key="index">
        <img v-lazy="item.storeLogo" alt="" class="thumb">
        <div class="box_padding flex_box flex_column justify_space_between"
             style="height: 2.28rem;padding: .22rem .16rem;">
          <p class="txt-overflow fz-28">{{item.storeName}}</p>
          <router-link :to="{name: 'sellerDetail',query: {shopStoreId: item.shopStoreId,distance: item.distance}}" tag="button" class="fz-30">到店消费{{$accMul(item.shareCardDiscount,10)}}折</router-link>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import {getGPS,getCity} from "@/assets/js/jsBridge";
  import {storeForBargain} from "@/assets/js/comm";

  export default {
    name: "re-store",
    props: ['tokenPromise'],
    data(){
      return{
        token: '',
        longitude: '',
        latitude: '',
        list: [],
        pageNum: 0,
        limit: 6,
        cityCode: ''
      }
    },
    mounted() {
      var _self = this;
      _self.tokenPromise.then(res => {
        _self.token = res;
        getGPS().then(gps => {
          _self.longitude = gps.LONG;
          _self.latitude = gps.LAT;
          _self.init();
        })
      })
    },
    watch: {
      list: {
        handler(){
          this.$emit('refreshDom')
        },
        deep: true
      }
    },
    methods: {
      init(){
        var _self = this;
        _self.bargainList();
      },
      bargainList(){
        var _self = this;
        _self.pageNum++;
        var _data = {
          token: String(_self.token),
          longitude: String(_self.longitude),
          latitude: String(_self.latitude),
          pageNum: String(_self.pageNum),
          limit: String(_self.limit),
          // cityCode: String(_self.cityCode)
        };
        storeForBargain(_data).then(res => {
          if(res.data.state == 1){
            _self.list = _self.list.concat(res.data.data);
          }else{
            _self.$emit('toast',decodeURIComponent(res.data.msg))
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>

  .re-store{
    width: 100%;
    background: #F2F2F2;
    box-sizing: border-box;
    padding: 0 .22rem;
    .board{
      display: block;
      width: 2.65rem;
      height: .58rem;
      margin: 0 auto;
      margin-bottom: .25rem;
    }
    .list{
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .list-item{
        width: 3.4rem;
        height: 4.84rem;
        background: #FFFFFF;
        border-radius: .2rem;
        overflow: hidden;
        margin-bottom: .23rem;
        .thumb{
          display: block;
          width: 100%;
          height: 2.56rem;
        }
        button{
          display: block;
          width: 100%;
          height: .8rem;
          background: #FA336C;
          color: #FFFFFF;
          border-radius: .2rem;
        }
      }
    }
  }
</style>
