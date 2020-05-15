<template>
  <div>
    <!--标题栏-->
    <header class="bg-f" :style="'padding-top:'+status_bar_height+'px'">
      <h3 class="border-buttom">会员详情</h3>
      <span class="ico-retrun fz16" @click="back"><i class="left-arrow"></i></span>
    </header>
    <div :style="'height:'+(status_bar_height+44)+'px'"></div>
    <!--list-->
    <div class="mb-5 bg-f relative head-box">
      <div class="img-box">
        <img :src="imgDomain+memberInfo.ico" width="100%" v-if="memberInfo.ico"/>
        <img src="@/assets/imgs/partnerCenter/head.png" width="100%" v-else/>
      </div>
      <p class="fz20 p-hide">{{memberInfo.nick || '&nbsp'}}</p>
      <p class="fz13 fc-c">ID:{{memberInfo.username || '&nbsp'}}</p>
    </div>
    <ul class="bg-f list fz15">
      <li class="border-buttom clearfix">
        <span class="fl-l">性别</span>
        <span class="fl-r " :class="memberInfo.gender == 1 ? 'ico-man' : 'ico-girl'"></span>
      </li>
      <li class="border-buttom clearfix">
        <span class="fl-l">所属地区</span>
        <span class="fl-r fc-c">{{memberInfo.cityName}}</span>
      </li>
      <li class="border-buttom clearfix">
        <span class="fl-l">VIP</span>
        <span class="fl-r fc-c" v-if="memberInfo.userRole == 1">是</span>
        <span class="fl-r fc-c" v-else>否</span>
      </li>
      <li class="border-buttom clearfix">
        <span class="fl-l">注册时间</span>
        <span class="fl-r fc-c">{{memberInfo.createTimeStr}}</span>
      </li>
      <li class="border-buttom clearfix">
        <span class="fl-l">会员来源 </span>
        <span class="fl-r fc-c">{{memberInfo.registeSource || '&nbsp'}}</span>
      </li>
      <li class="clearfix">
        <span class="fl-l">推荐人 </span>
        <span class="fl-r fc-c">助商通(ID:{{memberInfo.inviterId || "&nbsp"}})</span>
      </li>
    </ul>
    <v-toast :tip="tip" ref="toast"></v-toast>
  </div>
</template>

<script>
  import {getMembeStatistics} from '@/assets/js/getData'

  export default {
    props: ['partnerToken'],
    data() {
      return {
        memberInfo: {},
        status_bar_height: this.$route.query.status_bar_height ? Number(this.$route.query.status_bar_height) : 0,
        token: '',
        tip: '',
        userId: this.$route.query.id,
        imgDomain: '',//图片域名
      }
    },
    mounted() {

    },
    created: function () {
      let _self = this;
      _self.$getParterToken().then(res => {
        _self.token = res;
        _self.getMembeDetail();
      });
    },
    methods: {
      toast(tip){
        var _self = this;
        _self.tip = tip;
        _self.$refs.toast.toast();
      },
      /*返回上一页*/
      back() {
        this.$router.go(-1);//返回上一层
      },
      //获取当前会员详情
      getMembeDetail() {
        let _self = this;
        let data = {
          token: _self.token,
          time: '',
          userId: _self.userId,
        };
        if (_self.pageNum == 1) {
          _self.list = [];
        }
        _self.$getSignIn(data).then(sec => {
          getMembeStatistics(data,sec).then(res => {
            let _data = res.data;
            if (_data.state == 1) {
              _self.imgDomain = _data.data.imgDomain;
              _self.memberInfo = _data.data.spUserInfoList[0];
              //'注册来源 0应用市场app 1推广海报 2卡淘商城注册 3商家推广链接 4微信平台  5QQ平台  6新浪平台  7阿里平台  8应用市场糖公鸡 9糖公鸡推广海报 10微信公众号  11我的会员',
              if (_self.memberInfo.registeSource == 0) {
                _self.memberInfo.registeSource = '应用市场app';
              } else if (_self.memberInfo.registeSource == 1) {
                _self.memberInfo.registeSource = '推广海报';
              } else if (_self.memberInfo.registeSource == 2) {
                _self.memberInfo.registeSource = '卡淘商城注册';
              } else if (_self.memberInfo.registeSource == 3) {
                _self.memberInfo.registeSource = '商家推广链接';
              } else if (_self.memberInfo.registeSource == 4) {
                _self.memberInfo.registeSource = '微信平台';
              } else if (_self.memberInfo.registeSource == 5) {
                _self.memberInfo.registeSource = 'QQ平台';
              } else if (_self.memberInfo.registeSource == 6) {
                _self.memberInfo.registeSource = '新浪平台';
              } else if (_self.memberInfo.registeSource == 7) {
                _self.memberInfo.registeSource = '阿里平台';
              } else if (_self.memberInfo.registeSource == 11) {
                _self.memberInfo.registeSource = '我的会员';
              } else if (_self.memberInfo.registeSource == 10) {
                _self.memberInfo.registeSource = '微信公众号';
              } else {
                _self.memberInfo.registeSource = '未知来源';
              }
            } else {
              _self.toast(decodeURIComponent(_data.msg));
            }
          }).catch(function (error) {
            _self.toast(error);
          });
        })


      }
    }
  }
</script>

<style scoped>
  @import '../../../../assets/css/partner_base.css';
  .head-box {
    padding: 20px 10px 26px 138px;
  }

  .head-box .fz20 {
    line-height: 2;
  }

  .head-box .img-box {
    width: 65px;
    height: 65px;
    border-radius: 50%;
    overflow: hidden;
    position: absolute;
    left: 36px;
    top: 23px;
  }

  .list {
    padding-left: 16px;
    line-height: 58px;
  }

  .list li {
    padding-right: 23px;
  }

  .ico-man, .ico-girl {
    margin-top: 21px;
  }

</style>
