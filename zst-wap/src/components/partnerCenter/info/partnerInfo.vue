<template>
  <div class="bg-c">
    <!--标题栏-->
    <header class="relative bg-r fc-f" :style="'padding-top:'+status_bar_height+'px'">
      <h3>个人中心设置</h3>
      <span class="ico-retrun fz16" @click="back"><i class="left-arrow"></i>返回</span>
    </header>
    <div class="bg-r fc-f relative icon-box">
      <img :src="userIfo.iocImg" class="icon-head" v-if="userIfo.iocImg"/>
      <img src="@/assets/imgs/partnerCenter/head.png" class="icon-head" v-else/>
      <p><span class="ico-vip">服务商</span></p>
      <p class="fz14">ID:{{userIfo.username}}</p>
    </div>
    <!--list-->
    <div class="bg-f fz15 list">
      <div class="border-buttom clearfix">
        <span class="fl-l">名称</span>
        <span class="fl-r">{{userIfo.realname}}</span>
      </div>
      <div class="border-buttom clearfix">
        <span class="fl-l">绑定手机号</span>
        <span class="fl-r">{{userIfo.phone}}</span>
      </div>
      <router-link :to="{path:'/bindPhone',query: {phone: userIfo.phone}}" tag="div" class="clearfix">
        <span class="fl-l">更改绑定手机号</span>
        <span class="fl-r"><i class="right-arrow"></i></span>
      </router-link>
    </div>
    <v-toast :tip="tip" ref="toast"></v-toast>
  </div>
</template>

<script>
  import {postColor} from '@/assets/js/jsBridge'
  import {getUserInfo} from '@/assets/js/getData'

  export default {
    props: ['partnerToken'],
    data() {
      return {
        userIfo: {},
        status_bar_height: this.$route.query.status_bar_height ? Number(this.$route.query.status_bar_height) : 0,
        token: '',
        tip: ''
      }
    },
    methods: {
      toast(tip){
        var _self = this;
        _self.tip = tip;
        _self.$refs.toast.toast();
      },/*返回上一页*/
      back() {
        this.$router.go(-1);//返回上一层
      },
      //获取代理商信息
      getUserInfo() {
        let _self = this;
        let _data = {
          token: _self.token
        };
        _self.$getSignIn(_data).then(sec => {
          getUserInfo(_data,sec).then(res => {
            let _data = res.data;
            _self.presenState = false;
            if (_data.state == 1) {
              _self.userIfo = _data.data;
            } else {
              _self.toast(decodeURIComponent(_data.msg));
            }
          }).catch(function (error) {
            _self.toast(error);
          });
        })

      }
    },
    created: function () {
      let _self = this;
      _self.$getParterToken().then(res => {
        _self.token = res;
        _self.getUserInfo();
      });
    },
    mounted() {
      postColor('F7094D'); //传递顶部的手机导航栏的色值给安卓
    }
  }

</script>

<style scoped>
  @import '../../../assets/css/partner_base.css';
  .ico-vip {
    background: -webkit-gradient(linear, left top, left bottom, from(#ffe551), to(#fda313));
    background: linear-gradient(#ffe551, #fda313);
    color: #910021;
    font-size: 8px;
    padding: 0 5px;
    line-height: 15px;
    margin-right: 7px;
    border-radius: 3px;
  }

  .icon-box {
    padding: 30px 0 30px 130px;
  }

  .icon-head {
    position: absolute;
    width: 75px;
    height: 75px;
    border-radius: 50%;
    top: 10px;
    left: 27px;
  }

  .list {
    line-height: 48px;
    padding-left: 10px;
  }

  .list > div {
    padding: 0 15px 0 10px;
  }
</style>
