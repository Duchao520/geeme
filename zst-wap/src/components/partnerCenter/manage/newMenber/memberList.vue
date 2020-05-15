<template>
  <div>
    <!--标题栏-->
    <header class="bg-f" :style="'padding-top:'+status_bar_height+'px'">
      <h3 class="border-buttom">会员列表</h3>
      <span class="ico-retrun" @click="back"><i class="left-arrow"></i></span>
    </header>
    <div :style="'height:'+(status_bar_height+44)+'px'"></div>
    <!--list-->
    <!--等待加载-->
    <div class="timeout" v-show="!showNull && timeoutState">
      <i class="loading"></i>
    </div>
    <div>
      <div class="nullImg" v-show="list.length == 0 && showNull"><img src="@/assets/imgs/partnerCenter/null.png"
                                                                      width="50%"/></div>
      <div v-show="list.length != 0" v-for=" (n,index) in hradList" :key="index">
        <div class="bg-c pd-lr-10 pd-tb-5 clearfix">
          <span class="fl-l fz-36">{{n.createDateStr}}</span><span class="fl-r fc-r fz-36">共{{n.totalUser || 0}}人</span>
        </div>
        <router-link :to="{path:'/memberDetail',query:{id:item.id}}"
                     tag="div"
                     class="bg-f border-buttom list-con relative fz13"
                     v-for="(item,idx) in list" :key="idx"
                     v-if="item.createDateStr.indexOf(n.createDateStr)>= 0">
          <img :src="imgDomain+item.ico" v-show="item.ico"/>
          <img src="@/assets/imgs/partnerCenter/head.png" v-show="!item.ico"/>
          <p class="clearfix">
						<span class="fl-l fz16">
							<i class="p-hide member-name">{{item.nick}}</i>
							<i :class=" item.gender == 1 ? 'ico-man' : 'ico-girl' "></i> 
							<i :class=" item.userRole == 1 ? 'ico-vip' : ''"></i>
						</span>
            <span class="fl-r fc-c">活跃次数{{item.logonCount }}</span>
          </p>
          <p class="p-hide">{{item.cityName || '&nbsp'}}</p>
        </router-link>
      </div>
      <!--等待-->
      <div class="loading-box" v-show="showLoad">
        <i class="loading"></i>
      </div>
    </div>
    <v-toast :tip="tip" ref="toast"></v-toast>
  </div>
</template>

<script>
  import {getMembeList} from '@/assets/js/getData'
  import {postColor,closeWebView} from "@/assets/js/jsBridge";

  export default {
    props: ['partnerToken'],
    data() {
      return {
        hradList: [],
        list: [],
        status_bar_height: this.$route.query.status_bar_height ? Number(this.$route.query.status_bar_height) : 0,
        token: '',
        tip: '',
        lastRecordTime: 0,
        pageNum: 1,
        limit: 20,
        count: 0,
        showNull: false,//第一次进入页面，不能先显示无记录图
        scrollState: true,
        showLoad: false, //是否显示滚动加载状态
        imgDomain: '', //图片域名
        month: '', //当前月份
        time: this.$route.query.time || 0, //time为0时为全部，传入对应时间，查询对应时间内列表
        timeoutState: true, // 请求超时
      }
    },
    mounted() {
      let _self = this;
      _self.$getParterToken().then(res => {
        _self.token = res;
        _self.getMembeList();
        if (_self.thisMonth) {//假如是从当月会员记录
          _self.getTime();
        }
      });
      postColor('ffffff'); //传递顶部的手机导航栏的色值给安卓
      window.addEventListener('scroll', function () {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        // 判断是否滚动到底部
        if ((scrollTop + window.screen.availHeight) >= (document.body.offsetHeight - 100)) {
          if (_self.scrollState == true) { //加下状态
            _self.scrollState = false;
            _self.showLoad = true;
            _self.pageNum = _self.pageNum + 1;
            setTimeout(() => {
              _self.scrollState = true;
              _self.showLoad = false;
              _self.getMembeList();
            }, 1500);
          }
        }
      });
    },
    created: function () {
      let _self = this;
    },
    methods: {
      toast(tip){
        var _self = this;
        _self.tip = tip;
        _self.$refs.toast.toast();
      },
      //获取当前月份
      getTime() {
        let date = new Date();
        let y = date.getFullYear();
        let m = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        this.month = y + '-' + m;
      },
      /*返回上一页*/
      back() {
        if (window.history.length <= 1) {
          closeWebView(); //关闭webview
        } else {
          this.$route.query.close == 1 ? closeWebView() : this.$router.go(-1);//返回上一层
        }
        //上面都没执行就说明卡在当前页不是最后一条， histroy记录数量大于1，又没有回退记录，只能返关闭webview
        //如果上面都执行了 页面都跳走了，这个也就不用管了
        /*setTimeout(() => {
            comm.closeWebView(); //关闭webview
        },500);*/
      },
      //获取会员列表详情
      getMembeList() {
        let _self = this;
        let data = {
          token: _self.token,
          time: _self.time,
          pageNum: _self.pageNum,
          limit: _self.limit,
          lastRecordTime: _self.lastRecordTime, //最后一个数据的时间戳
        };
        //_self.hradList = [] ; //因为头部时间循环清空
        _self.$getSignIn(data).then(sec => {
          getMembeList(data,sec).then(res => {
            let _data = res.data;
            if (_data.state == 1) {
              _self.timeoutState = false ;
              _self.showNull = false;
              _self.imgDomain = _data.data.imgDomain;
              _self.showLoad = false;
              let _len = _data.data.spUserInfoList.length;
              if (_len < _self.limit) {
                _self.scrollState = false;
              }
              if (_self.pageNum == 1) {
                _self.list = [];
                _self.hradList = [];
              }
              _self.hradList = _self.hradList.concat(_data.data.spUserInfoCount);
              _self.lastRecordTime = _data.data.spUserInfoList[_data.data.spUserInfoList.length - 1].createtime;
              //_self.count =  _data.data.count ;
              _self.list = _self.list.concat(_data.data.spUserInfoList);
            } else {
              _self.toast(decodeURIComponent(_data.msg));
            }
          })
        })

      }
    }
  }
</script>


<style scoped>
  @import '../../../../assets/css/partner_base.css';
  .list-con {
    padding: 15px 15px 15px 80px;
  }

  .list-con img {
    position: absolute;
    left: 22px;
    top: 10px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }

  .member-name {
    /*max-width: 50%;
      display: inline-block;*/
  }

  .timeout {
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: -15px;
    margin-top: -15px;
  }
</style>
