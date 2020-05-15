<template>
  <div>
    <!--标题栏-->
    <header class="bg-f" :style="'padding-top:'+status_bar_height+'px'">
      <h3 class="border-buttom ">购卡明细</h3>
      <span class="ico-retrun fz16" @click="back"><i class="left-arrow"></i></span>
      <span class="icon">
				<i class=" ico-select" @click="showSelect"></i>
				<i class=" ico-search" @click="showSearch"></i>
			</span>
      <!--搜索-->
      <div class="search-box bg-r" v-show="searchState">
        <form action="javascript:return true;">
          <input type="search" placeholder="请输入商家名称" @keyup.13="searchCard" v-model="search" ref="input1"/>
          <button type="button" class="fc-f fz15" @click="hideSearch">取消</button>
        </form>
      </div>
    </header>
    <div :style="'height:'+(status_bar_height+44)+'px'"></div>
    <!--list-->
    <div class="bg-f">
      <div class="nullImg" v-if="list.length == 0"><img src="@/assets/imgs/partnerCenter/null.png" width="50%"/></div>
      <div class="list-con border-buttom fc-c fz12" v-else v-for="item in list">
        <p class="clearfix title">
          <span class="fl-l fc-black">{{item.shopName}}</span>
          <span class="fl-r">{{item.createTimeStr}}</span>
        </p>
        <div class="flex-box">
          <div class="item">
            <img src="@/assets/imgs/partnerCenter/card2.png" width="80%" v-if="item.cardType ==0"/>
            <img src="@/assets/imgs/partnerCenter/card1.png" width="85%" v-else-if="item.cardType ==1"/>
          </div>
          <div class="item">
            <p class="fw-6 fc-black fz16">￥{{item.unitPrice || 0}}</p>
            <p class="fz10">购卡单价</p>
          </div>
          <div class="item">
            <p class="fw-6 fc-black fz16">{{item.cardCount || 0}}</p>
            <p class="fz10">购卡数量</p>
          </div>
          <div class="item">
            <p class="fw-6 fc-black fz16">￥{{(item.unitPrice * item.cardCount).toFixed(2)}}</p>
            <p class="fz10">购卡总额</p>
          </div>
        </div>
        <p>订单编号：{{item.orderNum || ''}}</p>
        <p>商家电话：{{item.advertiserContactPhone || '' }}</p>
        <p>卡号开始值：{{item.cardStartNum || ''}}</p>
        <p>卡号结束值：{{item.cardEndNum || ''}}</p>
      </div>
    </div>
    <!--等待-->
    <div class="loading-box" v-show="showLoad">
      <i class="loading"></i>
    </div>
    <!--筛选条件-->
    <div v-show="selectShow">
      <div class="mask" @click="hideSelect"></div>
      <div class="select-box bg-f fz14">
        <!--性别-->
        <ul class="tab-con">
          <li class="relative">
            <input type="radio" name="cardType" id="cardType0" value="" @change="selectType" v-model="cardType"/>
            <label for="cardType0">全部</label>
            <i class="icon-gou"></i>
          </li>
          <li class="relative">
            <input type="radio" name="cardType" id="cardType1" value="0" @change="selectType" v-model="cardType"/>
            <label for="cardType1">通用卡</label>
            <i class="icon-gou"></i>
          </li>
          <li class="relative">
            <input type="radio" name="cardType" id="scardType2" value="1" @change="selectType" v-model="cardType"/>
            <label for="cardType2">定制卡</label>
            <i class="icon-gou"></i>
          </li>
        </ul>
      </div>
    </div>
    <v-toast :tip="tip" ref="toast"></v-toast>
  </div>
</template>

<script>
  import * as comm from '@/assets/js/comm'
  import {getAgentCardList} from '@/assets/js/getData'
  import {postColor} from "@/assets/js/jsBridge";
  import {rule} from "@/assets/js/deal";

  export default {
    props: ['partnerToken'],
    data() {
      return {
        selectShow: false, //筛选框
        searchState: false,//搜索框
        scrollState: true,
        showLoad: false, //是否显示滚动加载状态
        list: [1],//提现记录
        pageNum: 1, //list的页数
        limit: 20,
        startTime: '', // 开始时间
        endTime: '', // 开始时间
        cardType: '', //筛选的卡类型
        search: '', //搜索框的输入内容
        status_bar_height: this.$route.query.status_bar_height ? Number(this.$route.query.status_bar_height) : 0,
        token: '',
        tip: ''
      }
    },
    created: function () {
      let _self = this;
      _self.$getParterToken().then(res => {
        _self.token = res;
        _self.getAgentCardList();
      });
    },
    mounted() {
      let _self = this;
      postColor('F7094D'); //传递顶部的手机导航栏的色值给安卓
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
              _self.getAgentCardList();
            }, 1500);
          }
        }
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
      //点击显示选择框
      showSelect() {
        this.selectShow = true;
      },
      //点击隐藏选择框
      hideSelect() {
        this.selectShow = false;
      },
      //点击显示搜索框
      showSearch() {
        this.searchState = true;
        this.selectShow = false;
      },
      //点击隐藏搜索框
      hideSearch() {
        this.searchState = false;
      },
      //选择筛选条件后
      selectType() {
        let _self = this;
        _self.pageNum = 1;
        _self.getAgentCardList();
        _self.selectShow = false;
      },
      //点击键盘搜索键，搜索内容
      searchCard() {
        let _self = this;
        _self.$refs.input1.blur();
        if (rule.empty(_self.nameOrPhone, "搜索内容不能为空")) {
          _self.pageNum = 1;
          _self.getAgentCardList();
        }
      },
      //获取购卡明细列表信息
      getAgentCardList() {
        let _self = this;
        let _data = {
          token: _self.token,
          pageNum: _self.pageNum, //list的页数
          limit: _self.limit,
          startTime: _self.startTime, // 开始时间
          endTime: _self.endTime, // 开始时间
          cardType: _self.cardType, //筛选的卡类型
          shopName: _self.search, //搜索框的输入内容
        };
        if (_self.pageNum == 1) {
          _self.list = [];
        }
        _self.$getSignIn(_data).then(sec => {
          getAgentCardList(_data,sec).then(res => {
            let _data = res.data;
            if (_data.state == 1) {
              if (_data.data.length < _self.limit) { //获取的数据小于每页数量，已到达最后一页
                _self.scrollState = false; //禁止滚动加载
              }
              _self.list = _self.list.concat(_data.data.cardorderInfoList);
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
  @import '../../../assets/css/partner_base.css';
  /*head筛选*/
  header {
    background: #F7094D;
  }

  .ico-select {
    display: inline-block;
    width: 14px;
    height: 100%;
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAlCAMAAACEemK6AAAAM1BMVEUAAAD///////////////////////////////////////////////////////////////+3leKCAAAAEHRSTlMA75uAkxP5qIh7BaENMBrn+IJ8jQAAAH5JREFUOMvd0GEOgjAQROHH0hYQUO5/WhNNNpbpXMD5+/I16RJtGq8F5+V2wmJSAE/TKiRU1kFhsA9S4btqWEJhDraDXNzaChYmS6hMYXvQrQgTmMzAjfsOZQqVQZ0+6ZVM/zgzWpEnxf1tW3xjzWaga0TX9NwbbvNVsNt/2hvT6hhadxnp7gAAAABJRU5ErkJggg==) no-repeat center;
    background-size: 100% auto;
    margin-right: 10px;
  }

  .ico-search {
    display: inline-block;
    width: 18px;
    height: 100%;
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAdVBMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////li2ZAAAAAJnRSTlMA+UjGQjwO9uzZ0K1PBeODZAnovXdvWzAj8LWimlc1HheWj4h6KvgzptoAAAEFSURBVDjLvZJZjoMwEETdOICx2XdIWLLV/Y84mihmjLGi+cr7qlY92Q0ye1PEZyko5VnHXKzZAIQRTwHI6dj7AmnzfB10uhGqwOonokeyTUuFaNn1HQmfmVwRFcaYRKR7zYizMdWomUVQUv83hEPBbHLjiBZ3dqQctq0VZodwgaejDJmDFo2OInIJPm46knQJHa46pqVL8JDpyBE4hAa5jtkWTTh6HWfwY7+QsbpE7PgNrblPam/R0e5UBbXve0FPcy74/g35ArS/NahQbp+yXigMbSPJQghVT15+5wS1+geDBQ+JFzTOv7cQyGMWfdzUrf9+BidtOPi2cfpoeP8xFPtsjMkPA9ARTv/b5CUAAAAASUVORK5CYII=) no-repeat center;
    background-size: 100% auto;
  }

  .list-con {
    padding: 0 14px 5px 18px;
  }

  .list-con .title {
    line-height: 3;
    margin-bottom: 10px;
  }

  .list-con > p:not(.title) {
    padding-left: 10px;
  }

  .list-con .flex-box {
    margin-bottom: 8px;
  }

  /*筛选条件*/
  .select-box {
    position: fixed;
    width: 100%;
    top: 44px;
    z-index: 8;
  }

  .select-box ul {
    padding: 10px 0;
  }

  .select-box li {
    padding: 0 10px;
  }

  .select-box li input[type="radio"]:checked + label:after {
    content: none;
  }

  .tab-con input[type="radio"] {
    width: 100%;
    height: 100%;
    position: absolute;
  }

  .select-box li input[type="radio"]:checked ~ .icon-gou {
    display: inline-block;
    width: 14px;
    height: 14px;
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAANlBMVEUAAAD3CEz3CEz/AE7/AEr3CEz5Bkz2CUz3CEz4B0z5Bkz3CE33CEv3CEz3CEz4B0v2CUz3CU0WS5bBAAAAEXRSTlMA9uUJFZpPz8OMJXta2qhtsgEYyOEAAADMSURBVDjLhZNbDsUgCEQHEfX27f43exNtxLYa5qdNziAiABWHIzoiF4/A+MoL5SYS/8K8VqyWlR/hKX+UvPLF5YHc0uIr/zr8nT/miWK9xy9P9SsJaG4gD0DGsWe5mAA8PGAD1nIEI0w4rvIXICOumQXprpl6rqUl7OV7sW+vEfrSd9TIFfBxwDOB2rtzUq6GkkIdFFAL1BQpd45LebukvLt75l6C0PdfuZbEpA7/4cSPZrnt3Xox220NjDly1tCaY28vjr169vKa6/8HLvot+ZG8C7AAAAAASUVORK5CYII=) no-repeat center;
    background-size: cover;
    position: absolute;
    right: 10px;
    top: 7px;
  }
</style>
