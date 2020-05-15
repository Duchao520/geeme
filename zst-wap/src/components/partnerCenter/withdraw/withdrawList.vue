<template>
  <div>
    <!--标题栏-->
    <header class=" bg-f" :style="'padding-top:'+status_bar_height+'px'">
      <h3 class=" border-buttom">提现记录</h3>
      <span class="ico-retrun fz16" @click="back"><i class="left-arrow"></i>返回</span>
    </header>
    <div :style="'height:'+(status_bar_height+44)+'px'"></div>
    <!--list-->
    <ul class="bg-f">
      <div class="nullImg" v-if="list.length == 0"><img src="@/assets/imgs/partnerCenter/null.png" width="50%"/></div>
      <li class="border-buttom relative list-con" v-for="item in list" v-else>
        <p class="fz14">{{item.title || '申请提现'}}</p>
        <p class="fz12 fc-c">{{item.transTime}}</p>
        <span class="fz14 money">{{item.transMoney}}</span>
      </li>
    </ul>
    <!--等待-->
    <div class="loading-box" v-show="showLoad">
      <i class="loading"></i>
    </div>
    <v-toast :tip="tip" ref="toast"></v-toast>
  </div>
</template>

<script>
  import {getWithdrawList} from '@/assets/js/getData'
  import {postColor , timestampToTime} from "@/assets/js/jsBridge";

  export default {
    props: ['partnerToken'],
    data() {
      return {
        scrollState: true,
        showLoad: false, //是否显示滚动加载状态
        list: [],//提现记录
        pageNum: 1, //list的页数
        limit: 20,
        status_bar_height: this.$route.query.status_bar_height ? Number(this.$route.query.status_bar_height) : 0,
        tip: '',
        token: ''
      }
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
      getWithdrawList() {
        let _self = this;
        let _data = {
          token: _self.token,
          pageNum: _self.pageNum,
          limit: _self.limit,
        };
        _self.$getSignIn(_data).then(sec => {
          getWithdrawList(_data,sec).then(res => {
            let _data = res.data;
            if (_data.state == 1) {
              if (_data.data.length < _self.limit) { //获取的数据小于每页数量，已到达最后一页
                _self.scrollState = false; //禁止滚动加载
              }
              _data.data.forEach((n) => {
                n.transTime = timestampToTime(n.transTime);
              });
              _self.list = _self.list.concat(_data.data);
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
        _self.getWithdrawList();
      });
      postColor('ff8b8b'); //传递顶部的手机导航栏的色值给安卓
    },
    mounted() {
      let _self = this;
      window.addEventListener('scroll', function () {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        // 判断是否滚动到底部
        if ((scrollTop + window.screen.availHeight) >= (document.body.offsetHeight - 100)) {
          if (_self.scrollState == true) { //加下状态
            _self.scrollState = false;
            _self.showLoad = true;
            _self.pageNum = _self.pageNum + 1;
            setTimeout(() => {
              _self.showLoad = false;
              _self.getWithdrawList();
            }, 1500);
          }
        }

      });
    },
  }
</script>

<style scoped>
  @import '../../../assets/css/partner_base.css';
  .list-con {
    padding: 5px 10px;
  }

  .money {
    position: absolute;
    right: 15px;
    top: 50%;
    margin-top: -10px;
  }
</style>
