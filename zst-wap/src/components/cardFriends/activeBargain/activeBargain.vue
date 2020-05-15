<template>
  <div class="activeBargain">
    <v-head :title="'可参与的砍价'" :borderBtm="true"></v-head>
    <div class="active-list" ref="myScroll" :style="{top: status_bar_height + 1.04 + 'rem'}" v-if="list.length > 0">
      <div class="scroll-container">
        <div class="list-item box_padding bg-FFFFFF flex_box"
             style="margin-bottom: .35rem"
             v-for="(item,index) in list" :key="index">
          <img v-lazy="item.mainImg" alt="" class="thumb">
          <div class="detail flex_box flex_column justify_space_between">
            <p class="fz-30 flex_box align_center"><i class="iconfont icon-shangjia fz-42" style="color: #FA336C"></i>{{item.shopName}}提供</p>
            <p class="fz-30 txt-overflow font-weight">{{item.title}}</p>
            <div class="flex_box justify_space_between align_center">
              <p class="fz-30 fc-8D8E98">
                <span class="fz-38 fc-F7094D iconfont icon-renminbi">{{Number($accMul($accMul(Number(item.price),Number(item.discount)),0.1)).toFixed(2)}}</span>
                <span style="text-decoration: line-through">{{Number($accMul(item.price,1)).toFixed(2)}}</span>
              </p>
              <router-link :to="{name: 'bargain',query: {status: 2,bargainId: item.id,storeId: item.storeIds}}" tag="button" class="btn_radius fz-34 fc-ffffff">参与砍价</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="empty" v-else>
      <img src="@/assets/imgs/common/default_empty.png" alt="">
      <p class="fc-8D8E98 fz-36 text-center">抱歉，您还没有可参与的砍价活动</p>
    </div>
    <v-toast ref="toast" :tip="tip"></v-toast>
  </div>
</template>

<script>
  import vHead from '@/components/common/v-head';
  import {bargainCanTaskList} from "@/assets/js/comm";
  import {callAppMethod} from "@/assets/js/jsBridge";
  import BScroll from 'better-scroll';

  export default {
    name: "activeBargain",
    props: ['tokenPromise'],
    components: {
      vHead,
    },
    data(){
      return{
        scroll: '',
        status_bar_height: this.$route.query.status_bar_height ? Number(this.$route.query.status_bar_height)/100 : .4,
        token: '',
        pageNum: 0,
        limit: 10,
        tip: '',
        list: []
      }
    },
    watch: {
      list: {
        handler(){
          setTimeout(()=>{
            this.scroll.finishPullUp();
            this.scroll.finishPullDown();
            this.scroll.refresh();
          },200)
        },
        deep: true
      }
    },
    created(){
      callAppMethod('17');
    },
    mounted() {
      var _self = this;
      _self.tokenPromise.then(res => {
        _self.token = res;
        _self.init();
        setTimeout(() => {
          _self.initScroll();
        },200)
      })
    },
    methods: {
      init(){
        var _self = this;
        _self.bargainCanTaskList();
      },
      initScroll() {
        let _self = this;
        this.scroll = new BScroll(this.$refs['myScroll'], {
          click: true,
          pullUpLoad: {
            threshold: 50
          }
        });
        this.scroll.on("pullingUp", () => {
          _self.bargainCanTaskList();
        });
      },
      toast(tip){
        this.tip = tip;
        this.$refs.toast.toast();
      },
      bargainCanTaskList(){
        var _self = this;
        _self.pageNum++;
        var _data = {
          token: String(_self.token),
          pageNum: String(_self.pageNum),
          limit: String(_self.limit)
        };
        bargainCanTaskList(_data).then(res => {
          if(res.data.state == 1){
            _self.list = _self.list.concat(res.data.data);
          }else{
            _self.toast(decodeURIComponent(res.data.msg));
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .empty{
    height: 6rem;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    img{
      display: block;
      margin: auto;
      width: 4rem;
      height: 4rem;
      margin-bottom: .24rem;
    }
  }
  .active-list {
    position: absolute;
    top: 1.04rem;
    bottom: 0;
    left: 0;
    right: 0;
    box-sizing: border-box;
    padding: .22rem .2rem;
    background: #FEDBE5;

    .list-item {
      padding: .23rem .13rem;
      border-radius: .1rem;
      box-shadow: 0 .01rem .32rem .06rem rgba(254, 171, 193, 1);

      .thumb {
        display: block;
        width: 2rem;
        height: 2rem;
        border-radius: .1rem;
        margin-right: .17rem;
      }

      .detail {
        width: 4.6rem;
        height: 2rem;

        .time {
          display: block;
          width: .4rem;
          height: .4rem;
          border-radius: .1rem;
          background: linear-gradient(0deg, rgba(247, 9, 77, 1), rgba(252, 89, 137, 1));
        }

        button {
          display: block;
          width: 1.8rem;
          height: .65rem;
          background: #FA336C;
        }
      }
    }
  }
</style>
