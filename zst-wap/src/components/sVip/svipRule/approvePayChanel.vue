<template>
  <div class="approvePayChanel">
    <img src="@/assets/imgs/svip/approveTeach.png" alt="" class="content-img">
    <div class="flex_box box_padding justify_space_between align_center" style="padding: .2rem .14rem">
      <p class="fz-24 font-weight" style="width: 3.27rem">具体如何开通可致电客服热线或者助商通微信客服</p>
      <div class="flex_box btns" style="width: 3.5rem">
        <button class="fz-28 fc-ffffff font-weight copyBtn" :data-clipboard-text="wx" @click="copy">复制微信号</button>
        <button class="fz-28 fc-ffffff font-weight" @click="telPhone">联系客服</button>
      </div>
    </div>
    <v-toast ref="toast" :tip="tip"></v-toast>
  </div>
</template>

<script>
  import Clipboard from 'clipboard';
  import {postTitle} from "@/assets/js/jsBridge";

  export default {
    name: "approvePayChanel",
    data(){
      return{
        wx: 'zhushangtong01',
        contact: '400-8090-775',
        tip: ''
      }
    },
    methods: {
      toast(tip){
        this.tip = tip;
        this.$refs.toast.toast();
      },
      /*复制至剪贴板*/
      copy() {
        let _self = this;
        let clipboard = new Clipboard('.copyBtn');
        clipboard.on('success', e => {
          _self.toast('复制成功')
          clipboard.destroy()
        });
        clipboard.on('error', e => {
          _self.toast('复制失败')
          clipboard.destroy()
        })
      },
      telPhone(){
        window.location.href = 'tel:' + this.contact;
      }
    },
    mounted() {
      postTitle('如何开通收银')
    }
  }
</script>

<style lang="scss" scoped>
  .approvePayChanel{
    .content-img{
      display: block;
      width: 100%;
    }
    .btns{
      border-radius: .35rem;
      overflow: hidden;
      button{
        width: 50%;
        height: .7rem;
      }
      button:first-child{
        background: #F7A09D;
      }
      button:last-child{
        background: #20528B;
      }
    }
  }
</style>
