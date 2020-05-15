<template>
  <div class="order-list" ref="myScroll"
       :style="{top: status_bar_height + 1.04 + 'rem'}">
    <ul class="scroll-container box_padding" style="padding: 0 .2rem" v-if="list.length > 0">
      <li class="order-item box_padding"
          v-for="(item,index) in list"
          :key="index">
        <div class="flex_box justify_space_between align_center"
             style="margin-bottom: .24rem">
          <p class="fz-28 fc-8D8E98">订单时间：{{timestampToTime(item.endTime)}}</p>
          <p class="fz-30 fc-F7094D font-weight">{{item.isUse == 1 ? '已消费' : '未消费'}}</p>
        </div>
        <p class="fz-24 flex_box align_center"
           style="margin-bottom: .3rem"><img src="@/assets/imgs/cardFriends/bargain_act.png"
                                             style="display: block;width: .93rem;height: .25rem"
                                             alt="">{{item.biBargain.discount == 0 ? '砍价免费拿' : item.remark}}</p>
        <div class="flex_box"
             style="margin-bottom: .5rem">
          <img v-lazy="item.bargainImg" alt="" class="thumb">
          <div class="detail flex_box flex_column justify_space_between">
            <p class="txt-overflow fz-30 font-weight">{{item.bargainTitle}}</p>
            <div class="flex_box fz-30 justify_space_between">
              <p>X1</p>
              <div class="flex_box align_center">
                <i class="iconfont icon-renminbi fz-38 fc-F7094D">{{Number($accMul($accMul(Number(item.biBargain.price),Number(item.biBargain.discount)),0.1)).toFixed(2)}}元</i>
                <i class="fz-30 fc-8D8E98" style="text-decoration: line-through">{{Number($accMul(Number(item.biBargain.price),1)).toFixed(2)}}元</i>
              </div>
            </div>
          </div>
        </div>
        <p class="fz-30 fc-0D0D0F">订单编号:{{item.orderNo}}</p>
        <p class="fz-30 fc-0D0D0F"
           style="margin-bottom: .36rem">所属店铺：{{item.storeName}}</p>
        <div class="btns">
          <button @click="linkToCheck(item)" class="fz-24"
                  :class="{'fc-8D8E98': item.isUse == 1,'active': item.isUse == 0}" style="margin-right: .12rem">
            {{item.isUse == 1 ? '核销码已核销' : '立即核销'}}
          </button>
          <router-link :to="{name: 'checkSale',query: {bargainTasksId: item.id},params:{detail: item}}" tag="button"
                       class="fz-24 fc-F7094D" v-show="item.isHasComment == 0 && item.isUse == 1">立即评价
          </router-link>
        </div>
      </li>
    </ul>
    <div class="empty" v-else>
      <img src="@/assets/imgs/common/default_empty.png" alt="">
      <p class="fc-8D8E98 fz-36 text-center">抱歉，您还没有砍成记录哦</p>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import {bargainTaskList} from "@/assets/js/comm";
  import {timestampToTime} from "@/assets/js/jsBridge";

  export default {
    name: "order-list",
    props: ['tokenPromise'],
    data() {
      return {
        status_bar_height: this.$route.query.status_bar_height ? Number(this.$route.query.status_bar_height) / 100 : .4,
        scroll: '',
        token: '',
        pageNum: 0,
        limit: 10,
        isUse: '',
        startTime: '',
        endTime: '',
        list: []
      }
    },
    watch: {
      list: {
        handler() {
          setTimeout(() => {
            this.scroll.finishPullUp();
            this.scroll.finishPullDown();
            this.scroll.refresh();
          }, 500)
        },
        deep: true
      }
    },
    mounted() {
      var _self = this;
      _self.tokenPromise.then(res => {
        _self.token = res;
        _self.init();
        setTimeout(() => {
          this.initScroll();
        }, 500)
      });
    },
    methods: {
      timestampToTime(timestamp) {
        return timestampToTime(timestamp)
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
          _self.bargainTaskList();
        });
      },
      init() {
        var _self = this;
        _self.bargainTaskList();
      },
      bargainTaskList() {
        var _self = this;
        _self.pageNum++;
        var _data = {
          token: String(_self.token),
          pageNum: String(_self.pageNum),
          limit: String(_self.limit),
          isUse: String(_self.isUse),
          startTime: String(_self.startTime),
          endTime: String(_self.endTime)
        };
        bargainTaskList(_data).then(res => {
          if (res.data.state == 1) {
            _self.list = _self.list.concat(res.data.data);
          } else {
            _self.$emit('toast', decodeURIComponent(res.data.msg));
          }
        })
      },
      search(isUse, beginTime, endTime) {
        var _self = this;
        if (!(isUse == _self.isUse && beginTime == _self.startTime && endTime == _self.endTime)) {
          _self.isUse = isUse;
          _self.startTime = beginTime;
          _self.endTime = endTime;
          _self.pageNum = 0;
          _self.list = [];
          this.bargainTaskList();
        }
      },
      linkToCheck(item) {
        if (item.isUse == 0) {
          this.$router.push({
            name: 'checkSale',
            query: {bargainTasksId: item.id},
            params: {detail: item}
          })
        } else {
          _self.$emit('toast', '已核销')
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .empty {
    height: 6rem;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;

    img {
      display: block;
      margin: auto;
      width: 4rem;
      height: 4rem;
      margin-bottom: .24rem;
    }
  }

  .order-list {
    position: absolute;
    top: 1.04rem;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;

    .order-item {
      /*border-top: .02rem solid #E5E5E5;*/
      padding: .39rem .2rem;
      border-bottom: .02rem solid #EEEEEE;

      .thumb {
        display: block;
        width: 1.6rem;
        height: 1.6rem;
        border-radius: .1rem;
        margin-right: .27rem;
      }

      .detail {
        width: 5.14rem;
      }

      .btns {
        display: flex;
        justify-content: flex-end;

        button {
          display: block;
          width: 1.66rem;
          height: .5rem;
          border-radius: .25rem;
          border: .02rem solid #8D8E98;
        }

        button:last-child {
          border: .02rem solid #F7094D;
        }

        .active {
          border-color: #F7094D;
          color: #F7094D;
        }
      }
    }
  }
</style>
