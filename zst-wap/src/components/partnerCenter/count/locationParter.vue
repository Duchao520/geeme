<template>
  <div class="locationPartner">
    <v-head :title="agentType == 1 ? '推荐的运营商' : agentType == 3 ? '推荐的区域服务商' : ''"
            ref="vHead"></v-head>
    <div class="bag-scroll"
         :style="{top: 1.02 + status_bar_height + 'rem'}"
         ref="myScroll">
      <ul class="scroll-container" style="padding: .38rem .33rem">
        <li class="flex_box"
            v-for="(item,index) in list"
            :key="index"
            @click="linkToDetail(item)">
          <img :src="item.ico" alt="" class="headImg">
          <div class="detail flex_box flex_column" style="justify-content: center">
            <p class="fz-34 fc-0D0D0F flex_box align_center txt-ellipsis">
              <span class="txt-ellipsis" style="display: block;max-width: 5rem">{{item.realName}}</span>
              <i class="ico" :class="{'ico-man': item.gender == 1,'ico-girl': item.gender == 0}"></i></p>
            <p class="flex_box fc-8D8E98 fz-28 justify_space_between">
              <span>{{item.shortName}}</span>
              <span>加盟时间:{{item.createTimeStr}}</span>
            </p>
          </div>
        </li>
      </ul>
    </div>
    <v-toast ref="toast" :tip="tip"></v-toast>
  </div>
</template>

<script>
  import vHead from '@/components/common/v-head';
  import BScroll from 'better-scroll';
  import {getParterToken} from "@/assets/js/jsBridge";
  import {getAgentlist} from "@/assets/js/getData";
  import {AGENTINFO} from "@/assets/js/deal";

  export default {
    name: "locationParter",
    components: {
      vHead
    },
    data(){
      return{
        status_bar_height: this.$route.query.status_bar_height ? Number(this.$route.query.status_bar_height)/100 : 0,
        agentType: this.$route.query.agentType,
        token: '',
        pageSize: 10,
        pageNum: 0,
        tip: '',
        list: []
      }
    },
    mounted(){
      var _self = this;
      getParterToken().then(res => {
        _self.token = res;
        _self.init();
        _self.initScroll();
      })
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
    methods: {
      initScroll() {
        let _self = this;
        this.scroll = new BScroll(this.$refs['myScroll'], {
          click: true,
          pullUpLoad: {
            threshold: 50
          }
        });
        this.scroll.on("pullingUp", () => {
          _self.getList();
        });
      },
      init(){
        var _self = this;
        _self.getList();
      },
      toast(tip){
        var _self = this;
        _self.tip = tip;
        _self.$refs.toast.toast();
      },
      getList(){
        var _self = this;
        _self.pageNum++;
        var _data = {
          token: _self.token,
          pageNum: String(_self.pageNum),
          pageSize: String(_self.pageSize),
          agentType: String(_self.agentType)
        };
        _self.$getSignIn(_data).then(sec => {
          getAgentlist(_data,sec).then(res => {
            if(res.data.state == 1){
              console.log(res.data.data);
              _self.list = _self.list.concat(res.data.data);
              console.log(_self.list);
            }else{
              _self.toast(decodeURIComponent(res.data.msg))
            }
          })
        })
      },
      linkToDetail(item){
        AGENTINFO.realName = item.realName;
        AGENTINFO.shortName = item.shortName;
        AGENTINFO.createTimeStr = item.createTimeStr;
        AGENTINFO.id = item.id;
        AGENTINFO.ico = item.ico;
        this.$router.push({name: 'partnerDetail',query:{agentType: this.agentType}})
      }
    }
  }
</script>

<style lang="scss" scoped>
  .locationPartner{
    .headImg{
      display: block;
      width: 1.02rem;
      height: 1.02rem;
      border-radius: 50%;
      background: #0d0d0d;
      margin-right: .27rem;
    }
    .detail{
      width: 5.5rem;
      padding-bottom: .32rem;
      border-bottom: .02rem solid #F5F5F5;
      margin-bottom: .2rem;
    }
    .ico{
      display: block;
      width: .25rem;
      height: .31rem;
      margin-left: .15rem;
    }
    .ico-girl {
      background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAoCAMAAABKKxPSAAAARVBMVEUAAAD/i4v/i4v/i4v/i4v/i4v/i4v/i4v/i4v/i4v/i4v/i4v/i4v/i4v/i4v/i4v/i4v/i4v/i4v/i4v/i4v/i4v/i4tAlKIwAAAAFnRSTlMAv7AN9SdA4Y6aWMpq0oFionJNGuoykD4KbAAAAPlJREFUOMvdkttyhCAQRGG4CCjgbfv/PzVgmWzUgcpr9rxIFYe2aqbFh2ImGqN0q+paahlwoMn2wka8WdpaDZMOJ67lRRTMgm8yrx1BWoQfT2+ctmkUBiE8un+eUEnlFOj0Bm46MwpSnVOUNV2/GE+WC/8OML6YgfFG0PW51chsXrotR2NlPA8pLlhow3gBMLeHI9uBAfNli8AkOPLlQkVEwUO/xE0CttW+ckdHQ03a6/Ca+LosSVGXjxUdLO2ojEmJPpsNeX11lSwL5J1zM9Xj0urpnZnTzEPjJ5MYz7Nre7IrpgYcgakpBz0GDBZtnx34UyAaDOJ/8AUAzh+TTx9NgwAAAABJRU5ErkJggg==) no-repeat center;
      background-size: auto 100%;
    }

    .ico-man {
      background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAoCAMAAABKKxPSAAAASFBMVEUAAAAHheAHheAHheAHheAHheAHheAHheAHheAHheAHheAHheAHheAHheAHheAHheAHheAHheAHheAHheAHheAHheAHheAHheDjj8WMAAAAF3RSTlMAyL2tCOGOXzgm96FpVkpC79KYhHEZEgtRKNwAAADDSURBVDjL3dPLEoMgDIVhIAS8IN7N+79pO25syZFx2/4rF9/EmQDmT2sT2dmF7KvKbyxnHTW1YVautnvG8tl699NZvovYBSnqdsT2ScoCcklUjLbTa9eh5TjRDcBZ4OLDeRm4RbOpBW7QzsLjYOWSQcWSzd7AqHCNwXmrl4LhcinOptJIfCq7HqbePg4xN1WSnHWOlhBCT+79vT28p9Ij1opuBG5VCg48GLjpQKf26KJa6MiXC1YEvxASHBVObmLzG70AZiYt8xZFIsYAAAAASUVORK5CYII=) no-repeat center;
      background-size: auto 100%;
    }
    .bag-scroll{
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
</style>
