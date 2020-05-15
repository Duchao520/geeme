<template>
  <div class="actCodeList">
    <v-head :title="'激活码'"
            ref="vHead"
            @shareEvent="showConfirm"></v-head>
    <ul class="box_padding" style="padding: 0 .28rem">
      <li class="flex_box justify_space_between align_center"
          style="padding: .34rem 0; border-bottom: .02rem solid #E5E5E5"
          v-for="(item,index) in codeList" :key="index"
          @click="getCodeList">
        <div>
          <div class="flex_box align_center" style="margin-bottom: .38rem">
            <p class="fz-34" style="margin-right: .28rem">激活码ID：{{item.activeCode}}</p>
            <button class="iconfont icon-fuzhi fz-34 copyBtn"
                    id="copyBtn"
                    style="color: #D2D2D2"
                    :data-clipboard-text="item.activeCode"
                    @click="copy"
                    v-show="!item.state"></button>
          </div>
          <div class="flex_box align_center">
            <p class="fz-28 fc-8D8E98" style="margin-right: .36rem">点击获取激活码状态</p>
            <p class="fc-F7094D fz-34">{{!item.state ? '有效' : '无效'}}</p>
          </div>
        </div>
        <router-link :to="{name: 'actCodeDetail',query: {code: item.activeCode}}" tag="button" class="search">查看详情</router-link>
      </li>
    </ul>

    <v-toast ref="toast" :tip="tip"></v-toast>
    <v-confirm
      :confirmTitle="'重要提示'"
      :confirmDesc="'确认分享激活码给好友?'"
      :confirmSubmit="'去分享'"
      @PassEvent="shareEvent"
      ref="shareConfirm"></v-confirm>
  </div>
</template>

<script>
  import vHead from "@/components/common/v-head";
  import vConfirm from "@/components/common/vConfirm";
  import {getUserAgentType , postShareContentIOS , postTitleAndroid , postStrAndroid , postImgAndroid , shareInterface , callAppMethod,
    postTitle , postUrlAndroid , ctxPath} from "@/assets/js/jsBridge";
  import {getMoreCode} from "@/assets/js/comm";
  import Clipboard from 'clipboard';
  import axios from 'axios';
  import wx from 'weixin-js-sdk'

  export default {
    name: "actCodeList",
    components: {
      vHead,
      vConfirm
    },
    data(){
      return{
        agActivecodeNum: this.$route.query.agActivecodeNum,
        codeList: '',
        tip: '',
        token: '',
        agentId: ''
      }
    },
    methods: {
      shareEvent(){
        shareInterface();
      },
      showConfirm(){
        this.$refs.shareConfirm.showConfirm();
      },
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
      init(){
        var _self = this;
        callAppMethod('19');
        _self.getCodeList();
      },
      getCodeList(){
        var _self =  this;
        var _data = {
          token: String(_self.token),
          agActivecodeNum: String(_self.agActivecodeNum)
        };
        _self.$getSignIn(_data).then(sec => {
          getMoreCode(_data,sec).then(res => {
            if(res.data.state == 1){
              _self.codeList = res.data.data;
              _self.agentId = res.data.agentId;
              _self.shareInit();
            }else{
              _self.toast(decodeURIComponent(res.data.msg))
            }
          })
        })
      },
      shareInit(){
        var _self = this;
        var params = 'beginActiveCode=' + _self.codeList[0].activeCode + '&endActiveCode=' + _self.codeList[_self.codeList.length-1].activeCode + '&agentId=' + _self.agentId;
        var uri = ctxPath + '/zst-wap/index.html#/actCodeList?' + params;
        var _data = {
          title: '助商通联盟商家入驻激活码',
          describe: '助商通-让你的生意更好做',
          imageUrl: 'http://zst-test.tenzhao.com:10087/zst-wap/logo.png',
          url: uri
        };
        postShareContentIOS(_data);
        postTitleAndroid('助商通联盟商家入驻激活码');
        postStrAndroid('助商通-让你的生意更好做');
        postImgAndroid('http://zst-test.tenzhao.com:10087/zst-wap/logo.png');
        postUrlAndroid(uri);
      }
    },
    mounted() {
      var _self = this;
      _self.$refs.vHead.showRight('1');
      postTitle('激活码');
      _self.$getParterToken().then(res => {
        _self.token = res;
        _self.init();
      })
    }
  }
</script>

<style lang="scss" scoped>
  .search{
    display: block;
    width: 1.66rem;
    height: .45rem;
    border-radius: .1rem;
    font-size: .28rem;
    color: #FFFFFF;
    background: #FFA61A;
  }
</style>
