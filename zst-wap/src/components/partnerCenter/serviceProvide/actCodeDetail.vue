<template>
  <div class="actCodeDetail">
    <v-head :title="'激活码详情'"></v-head>
    <toast ref="toast" :tip="tip"></toast>
    <div class="copyCode">
      <p>激活码ID：{{code}}</p>
      <button class="copyBtn" :data-clipboard-text="code" @click="copy">复制激活码</button>
    </div>
    <p class="help">用助商通商家版进行扫一扫获取激活码</p>
    <div class="code">
      <img :src="qrCode" alt="">
    </div>
    <div class="ID"><span>ID：{{code}}</span></div>
    <div class="btns justify_center">
      <!--<button @click="saveImg(qrCode)">保存图片</button>-->
      <button @click="shareInterface" v-if="type!=3">分享微信好友</button>
    </div>
    <div class="tip">可保存图片到相册分享给好友，或者直接分享给微信好友</div>
  </div>
</template>

<script>
  import QRCode from 'qrcode';
  import vHead from "@/components/common/v-head";
  import {activeCode} from "@/assets/js/comm";
  import {getSignIn,postTitle,callAppMethod,shareInterface , getUserAgentType , postShareContentIOS , postStrAndroid ,
    postTitleAndroid , postImgAndroid , postUrlAndroid} from "@/assets/js/jsBridge";
  import toast from "@/components/common/toast";
  import clipBoard from 'clipboard';
  import logo from '@/assets/imgs/common/logo.png'

  import axios from 'axios'
  import wx from 'weixin-js-sdk'

  export default {
    name: "actCodeDetail",
    components: {
      toast,
      vHead
    },
    data() {
      return {
        token: '',
        qrCode: '',
        code: this.$route.query.code,
        tip: '',
        type: getUserAgentType()
      }
    },
    methods: {
      /*复制至剪贴板*/
      copy() {
        let _self = this;
        let clipboard = new clipBoard('.copyBtn');
        clipboard.on('success', e => {
          _self.toast('复制成功');
          clipboard.destroy()
        });
        clipboard.on('error', e => {
          _self.toast('复制失败');
          clipboard.destroy()
        })
      },
      toast(tip){
        var _self = this;
        _self.tip = tip;
        _self.$refs.toast.toast();
      },
      saveImg(url){
        var _self = this;
        if(url){
          var dtask = plus.downloader.createDownload(url, {}, function (d, status) {
            // 下载完成
            if (status == 200) {
              //                      mui.toast("下载成功,文件保存在"+d.filename)
              plus.gallery.save(d.filename, function () {//保存到相册方法
                plus.nativeUI.closeWaiting()
                _self.toast('已保存到手机相册');
              }, function () {
                plus.nativeUI.closeWaiting()
                _self.toast('保存失败，请重试！');
              });
            } else {
              _self.toast("下载失败")
            }
          });
          dtask.start();
          /*var a = document.createElement("a");
          a.href = url;
          var date = new Date();
          a.download = "激活码" + date.getFullYear() + (date.getMonth()+1) + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds();
          a.click();*/
        }else{
          _self.toast('图片信息不能为空')
        }

      },
      shareInterface(){
        shareInterface();
      },
      init(){
        var _self = this;
        postTitle('激活码详情');
        _self.createQrCode(_self.code);
        _self.shareInit();
        _self.secondShare();
      },
      /*生成二维码*/
      createQrCode(msg){
        var _self = this;

        QRCode.toDataURL(msg,{margin:0}, function (err, url) {
          console.log(url);
          _self.qrCode = url;
        })
      },
      shareInit(){
        var _self = this;
        var _data = {
          title: '助商通联盟商家入驻激活码',
          describe: '助商通-让你的生意更好做',
          imageUrl: logo,
          url: window.location.href
        };
        postShareContentIOS(_data);
        postTitleAndroid('助商通联盟商家入驻激活码');
        postStrAndroid('助商通-让你的生意更好做');
        postImgAndroid('http://zst-test.tenzhao.com:10087/zst-wap/logo.png');
        postUrlAndroid(window.location.href);
      },
      /*二次分享*/
      secondShare(){
        var _self = this;
        let _data = {
          url: window.location.href.split('#')[0]
        };
        axios.get('https://zst.tenzhao.com/api/voip/wechat/signature',{params:{'url':window.location.href}}).then(res => {
          var signature = res.data;
          /*alert(signature.appid)*/
          console.log(signature);
          wx.config({
            debug: false,
            appId: signature.appid,
            timestamp: signature.timestamp,
            nonceStr: signature.noncestr,
            signature: signature.signature,
            jsApiList: [
              'checkJsApi',
              'onMenuShareTimeline',
              'onMenuShareAppMessage',
              'onMenuShareQQ',
              'onMenuShareWeibo',
              'onMenuShareQZone',
              'hideMenuItems',
              'showMenuItems'
            ]
          });
          wx.ready(() => {
            var shareData = {
              title: `助商通联盟商家入驻激活码`,
              desc: `助商通-让你的生意更好做`,
              link: signature.url,
              imgUrl: logo,
              success:function(){
              },
              cancel: function () {
              }
            };
            wx.onMenuShareAppMessage(shareData);
            wx.onMenuShareTimeline(shareData);
            wx.onMenuShareQQ(shareData);
            wx.onMenuShareWeibo(shareData);
            wx.onMenuShareQZone(shareData);
            wx.checkJsApi({
              jsApiList: [
                'checkJsApi'
              ], // 需要检测的JS接口列表，所有JS接口列表见附录2,
              success: function(res) {
                // 以键值对的形式返回，可用的api值true，不可用为false
                // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
              }
            });
          });
          wx.error(function (res) {
            alert(res.errMsg);
          });

        })
      }
    },
    mounted() {
      var _self = this;
      _self.init();
      callAppMethod('19');
    }
  }
</script>

<style lang="scss" scoped>
  .actCodeDetail {
    box-sizing: border-box;
    padding: .21rem .2rem;

    .copyCode {
      width: 100%;
      height: 1.02rem;
      background: #FFF4CB;
      border-radius: .1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 .2rem;
      box-sizing: border-box;
      margin-bottom: .88rem;

      p {
        font-size: .34rem;
        color: #3C1703;
      }

      button {
        display: block;
        width: 1.85rem;
        height: .49rem;
        color: #FFFFFF;
        background: linear-gradient(87deg, rgba(102, 33, 6, 1), rgba(24, 0, 1, 1));
        border-radius: .1rem;
      }
    }

    .help {
      font-size: .34rem;
      text-align: center;
      margin-bottom: .81rem;
    }

    .code {
      width: 3.78rem;
      height: 3.78rem;
      margin: 0 auto;

      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }

    .ID {
      text-align: center;
      margin-bottom: 1.15rem;

      span {
        padding: .08rem .54rem;
        font-size: .36rem;
        border-radius: .6rem;
        background: #E5E5E5;
      }
    }
    .btns {
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-bottom: .52rem;

      button {
        display: block;
        width: 3.21rem;
        height: .92rem;
        color: #FFFFFF;
        font-size: .36rem;
        border-radius: .1rem;
      }

      button:first-child {
        background: #FFA61A;
      }

      button:last-child {
        background: #F7094D;
      }
    }
    .justify_center{
      justify-content: center;
    }
    .tip {
      font-size: .28rem;
    }
  }
</style>
