<template>
  <div class="head" v-show="type !== 3">
    <header class="flex_box justify_space_between align_center"
            :class="{'border-btm': !borderBtm}"
            :style="{paddingTop: .26 + status_bar_height + 'rem'}">
      <i class="iconfont icon-zuojiantou1 fz-38 fc-343C53" @click="replaceEvent" v-if="replace == 1"></i>
      <i class="iconfont icon-zuojiantou1 fz-38 fc-343C53" @click="back" v-else></i>
      <p class="title fc-070707 fz-38">{{title}}</p>
      <i class="iconfont icon-fenxiang fz-38 fc-343C53" v-if="shareBtnIsShow" @click="share"></i>
      <i class="iconfont icon-select fz-38 fc-343C53" v-else-if="selectBtnIsShow" @click="callBack"></i>
      <i v-else></i>
    </header>
    <div :style="{height: 1.04 + status_bar_height + 'rem'}"></div>
  </div>
</template>

<script>
  import {getUserAgentType} from "@/assets/js/jsBridge";

  export default {
    name: "v-head",
    props: ['title','replace','borderBtm'],
    data(){
      return{
        status_bar_height: this.$route.query.status_bar_height ? Number(this.$route.query.status_bar_height)/100 : .4,
        shareBtnIsShow: false,
        selectBtnIsShow: false,
        type: ''
      }
    },
    methods: {
      back(){
        window.history.back();
      },
      showRight(type){
        if(type == 1){                //1显示分享按钮
          this.shareBtnIsShow = true;
        }else if(type == 2){
          this.selectBtnIsShow = true;
        }
      },
      share(){
        this.$emit('shareEvent')
      },
      callBack(){
        this.$emit('callBackEvent')
      },
      replaceEvent(){
        this.$emit('replaceEvent')
      }
    },
    mounted() {
      // this.type = getUserAgentType();
      this.type = 1;
    }
  }
</script>

<style scoped>
  header{
    width: 100%;
    position: fixed;
    padding: .26rem .13rem;
    top: 0;
    left: 0;
    z-index: 48;
    background: #FFFFFF;
    box-sizing: border-box;
  }
  .border-btm{
    border-bottom: .02rem solid #C5C5C5;
  }
  .fc-343C53{
    color: #343C53;
  }
  .fc-070707{
    color: #070707;
  }
</style>
