<template>
  <div class="bargin-list">
    <div class="menu flex_box">
      <button class="fz-36"
              :class="{active: type == 1}"
              @click="type = 1">卡友帮
      </button>
      <button class="fz-36"
              :class="{active: type == 2}"
              @click="type = 2">{{$Subtr(biBargain.shareNum,biBargain.surplusShareNum)}}人砍价成功
      </button>
    </div>
    <div style="height: 1rem"></div>
    <div class="scroll" ref="myScroll" @touchstart="stopParentsScroll" @touchend="startParentsScroll">
      <div class="scroll-container">
        <ul v-if="type==1">
          <li v-if="helplist.length > 0">
            <div class="flex_box justify_space_between align_center"
                 style="margin-bottom: .45rem"
                 v-for="(item,index) in helplist"
                 :key="index">
              <div class="flex_box">
                <img :src="item.ico" alt="" class="ico">
                <div class="flex_box flex_column justify_space_between"
                     style="width: 3.6rem">
                  <p class="fz-34 fc-0D0D0F txt-ellipsis">{{item.nick}}</p>
                  <p class="fz-24 fc-8D8E98 txt-ellipsis">{{item.msg}}</p>
                </div>
              </div>
              <p class="fz-34 fc-0D0D0F">砍掉<span class="fc-F7094D">{{$accMul(item.helpPrice,1)}}</span>元</p>
            </div>
          </li>
          <li class="empty" v-else-if="helplist.length == 0">
            <img src="@/assets/imgs/common/default_empty.png" alt="">
            <p class="fc-8D8E98 fz-38 text-center">还没有人帮你砍价,快点去邀请</p>
          </li>
        </ul>
        <ul v-else-if="type==2">
          <li v-if="successList.length > 0">
            <div class="flex_box justify_space_between align_center"
                 style="margin-bottom: .45rem"
                 v-for="(ele,idx) in successList"
                 :key="idx">
              <div class="flex_box">
                <img :src="ele.ico" alt="" class="ico">
                <div class="flex_box flex_column justify_space_between"
                     style="width: 3.6rem">
                  <p class="fz-34 fc-0D0D0F txt-ellipsis">{{ele.nick}}</p>
                  <p class="fz-24 fc-8D8E98 txt-ellipsis">{{timestampToTime(ele.endTime)}}</p>
                </div>
              </div>
              <p class="fz-34 fc-0D0D0F">砍价成功</p>
            </div>
          </li>
          <li class="empty" v-else-if="successList.length == 0">
            <img src="@/assets/imgs/common/default_empty.png" alt="">
            <p class="fc-8D8E98 fz-38 text-center">还没人砍价成功,加油</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import {bargainTaskslogHelp, bargainTaskslogSuccess} from "@/assets/js/comm";
  import {timestampToTime} from "@/assets/js/jsBridge";

  export default {
    name: "bargin-list",
    props: ['tokenPromise'],
    data() {
      return {
        scroll: '',
        type: 1,
        bargainTasksId: '',
        bargainId: '',
        token: '',
        helplist: [],
        successList: [],
        pageNum1: 0,
        pageNum2: 0,
        limit: 10,
        biBargain: ''
      }
    },
    mounted() {
      var _self = this;
      _self.tokenPromise.then(res => {
        _self.token = res;
      })
    },
    watch: {
      helplist: {
        handler() {
          setTimeout(() => {
            this.scroll.finishPullUp();
            this.scroll.finishPullDown();
            this.scroll.refresh();
          }, 300)
        },
        deep: true
      },
      successList: {
        handler() {
          setTimeout(() => {
            this.scroll.finishPullUp();
            this.scroll.finishPullDown();
            this.scroll.refresh();
          }, 300)
        },
        deep: true
      },
      type() {
        setTimeout(() => {
          this.scroll.finishPullUp();
          this.scroll.finishPullDown();
          this.scroll.refresh();
          this.scroll.scrollTo(0, 0, 300)
        }, 300)
      }
    },
    methods: {
      timestampToTime(timestamp) {
        return timestampToTime(timestamp);
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
          if (_self.type == 1) {
            _self.bargainTaskslogHelp();
          } else {
            _self.bargainTaskslogSuccess();
          }
        });
      },
      stopParentsScroll() {
        if (this.type == 1) {
          if (this.helplist.length >= 6) {
            this.$emit('stopScrollEvent')
          }
        } else {
          if (this.successList.length >= 6) {
            this.$emit('stopScrollEvent')
          }
        }
      },
      startParentsScroll() {
        this.$emit('startScrollEvent')
      },
      getGoods(goods) {
        var _self = this;
        this.biBargain = goods.biBargain;
        this.bargainTasksId = goods.id;
        this.bargainId = goods.biBargain.id;
        this.init();
        setTimeout(() => {
          _self.initScroll();
        }, 200);
      },
      init() {
        var _self = this;
        if (this.bargainTasksId) {
          _self.bargainTaskslogHelp();
        }
        _self.bargainTaskslogSuccess();
      },
      bargainTaskslogHelp() {
        var _self = this;
        _self.pageNum1++;
        var _data = {
          token: String(_self.token),
          bargainTasksId: String(_self.bargainTasksId),
          pageNum: String(_self.pageNum1),
          limit: String(_self.limit)
        };
        bargainTaskslogHelp(_data).then(res => {
          if (res.data.state == 1) {
            _self.helplist = _self.helplist.concat(res.data.data);
          } else {
            _self.$emit('toast', decodeURIComponent(res.data.msg));
          }
        })
      },
      bargainTaskslogSuccess() {
        var _self = this;
        _self.pageNum2++;
        var _data = {
          token: String(_self.token),
          pageNum: String(_self.pageNum2),
          limit: String(_self.limit),
          bargainId: String(_self.bargainId)
        };
        bargainTaskslogSuccess(_data).then(res => {
          if (res.data.state == 1) {
            _self.successList = _self.successList.concat(res.data.data);
            _self.pageNum2 == 1 ? _self.$emit('getBargainSucList',_self.successList) : ''
          } else {
            _self.$emit('toast', decodeURIComponent(res.data.msg));
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .bargin-list {
    width: 100%;
    height: 7.67rem;
    border-radius: .2rem;
    background: #FFFFFF;
    box-shadow: 0 .01rem .32rem .06rem rgba(254, 171, 193, 1);
    margin-bottom: .4rem;
    overflow: hidden;
    position: relative;

    .menu {
      width: 100%;
      height: 1rem;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 2;

      button {
        display: block;
        width: 50%;
        height: 100%;
        background: #E7E7E7;
        color: #8D8E98;
      }

      .active {
        background: #FA336C;
        color: #FFFFFF;
      }
    }

    .scroll {
      width: 100%;
      height: 6.67rem;
      box-sizing: border-box;
      padding: .24rem .21rem;
      overflow: hidden;
      z-index: 30;

      .ico {
        display: block;
        width: .8rem;
        height: .8rem;
        border-radius: 50%;
        margin-right: .16rem;
      }

      .empty {
        width: 3rem;
        height: 3rem;
        margin: auto;

        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
    }
  }
</style>
