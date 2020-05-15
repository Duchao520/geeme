<template>
  <div>
    <!--标题栏-->
    <header class="bg-f" :style="'padding-top:'+status_bar_height+'px'">
      <h3 class="border-buttom ">购卡明细</h3>
      <span class="ico-retrun fz16" @click="back"><i class="left-arrow"></i></span>
      <div class="icon flex-box" style="display: flex">
				<i class=" ico-select" @click="showSelect"></i>
				<i class=" ico-search" @click="showSearch"></i>
			</div>
      <!--搜索-->
      <div class="search-box bg-f" v-show="searchState">
        <form action="javascript:return true;">
          <input type="search" placeholder="请输入商家名称" @keyup.13="searchCrad" v-model="search" ref="input1"/>
          <button type="button" class="fz15" @click="hideSearch">取消</button>
        </form>
      </div>
    </header>
    <div :style="'height:'+(status_bar_height+44)+'px'"></div>
    <!--list-->
    <div class="nullImg" v-show="list.length == 0 && showNull"><img src="@/assets/imgs/partnerCenter/null.png"
                                                                    width="50%"/></div>
    <div v-show="list.length != 0" v-for="(n,index) in headList" :key="index">
      <div class="bg-c pd-lr-10 pd-tb-5 clearfix fz15 fw-6">
        <span class="fl-l">{{n.createDateStr}} </span>
        <span class="fl-r">共{{n.todayCount}}单</span>
      </div>
      <ul class="bg-f fz15">
        <router-link
          :to="{path:'/orderDetail',query:{orderNum:item.orderNum }}"
          tag="li"
          class="border-buttom list-con relative"
          v-for="(item,idx) in list" :key="idx"
          v-if="item.createDateStr == n.createDateStr">
          <img src="@/assets/imgs/partnerCenter/card2.png" v-if="item.cardType == 0"/>
          <img src="@/assets/imgs/partnerCenter/card1.png" v-else-if="item.cardType == 1"/>
          <p class="clearfix fw-6 ">
            <span class="fl-l name p-hide">{{item.shopName}}</span>
            <span class="fl-r num">{{item.cardCount}}张</span>
          </p>
          <p class="fc-c fz12">购卡时间{{item.createTimeStr}}</p>
        </router-link>
      </ul>
    </div>
    <!--等待-->
    <div class="loading-box" v-show="showLoad">
      <i class="loading"></i>
    </div>
    <!--筛选弹窗-->
    <div v-show="selectShow">
      <div class="mask" @click="hideSelect"></div>
      <div :style="'top:' +(44+status_bar_height)+'px'" class="select-box bg-f fz14">
        <!--tab-->
        <!--<div class="flex-box border-buttom tab-box">
                    <div class="item">
                        <input type="radio" name="tabType" id="tabType1" checked="checked" value="1" v-model="tabCon"/>
                        <label for="tabType1">卡类型</label>
                    </div>
                    <div class="item">
                        <input type="radio" name="tabType" id="tabType2" value="2" v-model="tabCon"/>
                        <label for="tabType2">时间</label>
                    </div>
                </div>-->
        <!---->
        <div v-if="tabCon == 1" class="pd-lr-10 pd-tb-5">
          <ul>
            <li class="relative">
              <input type="radio" name="select" id="select0" value="" @change="selectType" v-model="cardType"/>
              <label for="select0">全部</label>
              <i class="icon-gou"></i>
            </li>
            <li class="relative">
              <input type="radio" name="select" id="select1" value="1" @change="selectType" v-model="cardType"/>
              <label for="select1">定制卡</label>
              <i class="icon-gou"></i>
            </li>
            <li class="relative">
              <input type="radio" name="select" id="select2" value="0" @change="selectType" v-model="cardType"/>
              <label for="select2">通用卡</label>
              <i class="icon-gou"></i>
            </li>
          </ul>
        </div>
        <div class="select-time" v-else>
          <div class="clearfix">
            <input class="" type="datetime" placeholder="请选择开始时间" v-model="startTime"/>
            ———
            <input class="" type="datetime" placeholder="请选择结束时间" v-model="endTime"/>
          </div>
          <div class="clearfix">
            <button type="button" class="btn fl-l" @click="resetTime">重置</button>
            <button type="button" class="btn fl-r" @click="selectType">完成</button>
          </div>
        </div>
      </div>
    </div>
    <v-toast :tip="tip" ref="toast"></v-toast>
  </div>
</template>

<script>
  import {getAgentCardList} from '@/assets/js/getData'
  import {rule} from "@/assets/js/deal";
  import {postColor} from "@/assets/js/jsBridge";

  export default {
    props: ['partnerToken'],
    data() {
      return {
        headList: [],
        list: [],
        status_bar_height: this.$route.query.status_bar_height ? Number(this.$route.query.status_bar_height) : 0,
        token: '',
        tip: '',
        lastRecordTime: 0,
        searchState: false,
        search: '',
        scrollState: true,
        showLoad: false,
        pageNum: 1,
        limit: 20,
        startTime: '',
        endTime: '',
        cardType: '',
        tabCon: 1,
        selectShow: false,
        totalPage: 0,
        totalCount: 0,
        mouth: '', //当前月份
        time: this.$route.query.time || 0,
        showNull: false,
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
      //输入内容搜索
      searchCrad() {
        let _self = this;
        _self.$refs.input1.blur();
        if (rule.empty(_self.search, "搜索内容不能为空")) {
          _self.pageNum = 1;
          _self.getAgentCardList();
          _self.search = "";
        }
      },
      //重置时间输入框内容
      resetTime() {
        this.startTime = '';
        this.endTime = '';
      },
      //选择筛选条件查询订单
      selectType() {
        let _self = this;
        _self.pageNum = 1;
        _self.getAgentCardList();
        _self.selectShow = false;
      },
      //隐藏弹窗
      hideSelect() {
        this.selectShow = false;
      },
      showSelect() {
        this.selectShow = true;
      },
      showSearch() {
        this.searchState = true;
      },
      hideSearch() {
        this.searchState = false;
      },
      //获取服务商购卡明细列表
      getAgentCardList() {
        let _self = this;
        let _data = {
          token: _self.token,
          time: _self.time,
          pageNum: _self.pageNum, //list的页数
          limit: _self.limit,
          lastRecordTime: _self.lastRecordTime,
          //orderNum: '' ,
          //startTime  : _self.startTime , // 开始时间
          //endTime  : _self.endTime , // 开始时间
          cardType: _self.cardType, //筛选的卡类型
          shopName: _self.search, //搜索框的输入内容
        };
        if (_self.pageNum == 1) {
          _self.list = []; //清空列表内容
          _self.headList = [];
        }
        _self.$getSignIn(_data).then(sec => {
          getAgentCardList(_data,sec).then(res => {
            let _data = res.data;
            if (_data.state == 1) {
              _self.showNull = true;
              let _len = _data.data.cardorderInfoList.length;
              if (_len < _self.limit) { //获取的数据小于每页数量，已到达最后一页
                _self.scrollState = false; //禁止滚动加载
              }
              _self.headList = _self.headList.concat(_data.data.cardorderInfoListCount);
              _self.lastRecordTime = _data.data.cardorderInfoList[_data.data.cardorderInfoList.length - 1].createtime;
              //_self.headList = _self.headList.concat(_data.data.cardorderInfoListCount) ;
              _self.list = _self.list.concat(_data.data.cardorderInfoList);
              console.log(_self.list)
            } else {
              _self.toast(decodeURIComponent(_data.msg));
            }
          })
        })

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
              _self.getAgentCardList();
            }, 1500);
          }
        }
      });
    }
  }
</script>

<style scoped>
  @import '../../../../assets/css/partner_base.css';
  .list-con {
    margin-left: 10px;
    padding: 20px 10px 20px 82px;
  }

  .list-con img {
    position: absolute;
    width: 72px;
    left: 0;
    top: 14px;
  }

  .ico-search {
    display: block;
    width: 20px;
    height: 44px;
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAoCAMAAABKKxPSAAAAP1BMVEUAAAANDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8I3WivAAAAFXRSTlMA/Q/db8x/smVWPyzppRuPIrs1Spxgy9eAAAABOUlEQVQ4y82T23KFIAxF2SQhXERF/f9v7ZS26ggefex+0sxyAQmaPTY6lQGDqIvW3CYo4S+k4YZcNgIoO/bscn1cujIB1Mf522LnyApIaDFPIJdOheQI5BsbQdZ2BboYF4FEc00USDoXbK5fNlkJ+bKqM70whnjSKTR1uSRQe9az6ccDh2ECxRtuGXD0RpHHG25UTPvC9RT9WAfdHQCbu3jIfHD+gXvve95f2fdXPpw3Y7NH/+Suf+k8gvBxHvHNfAuKNc9CD4TL/Vs7WCSovRTK0l6CAlma30jj1VaA7dpPHiB+PlVmLwCkmSgTkEOyP5+lkFHTHnBVADJxCIEnAaAbdUHLgiPCo+G+0djVKQGgMq114q6C3rTkOKclzaP9fa3gwOY+/wa0j+BUQWfegTDvQDIvQDcIfwFXcgn8c9H55QAAAABJRU5ErkJggg==) no-repeat center;
    background-size: 100% auto;
  }

  .ico-select {
    display: block;
    width: 24px;
    height: 44px;
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAtCAMAAAANxBKoAAAANlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC3dmhyAAAAEXRSTlMA74CakxOf+ah7BYYNMBrnjP0BhAEAAACUSURBVEjH7dJBDsIwDETRaeo4gbZA739ZJDaoxmbqDUJq/3r0FCnGwdI2+DXFZ8satcCpB2OF1y1YV7h1SnO8IkidsSCqEprghmZ4m/Gl0awfQALf0AyfgP14u4Ikhia4T3P8At5saIq/aV4dXuP7hmbXUrAvcR7C/rOc6x+te2o9mTXDU2uMqTXEXBWprIJEKvjnng2uGd6bbMyqAAAAAElFTkSuQmCC) no-repeat center;
    background-size: 100% auto;
    margin-right: 10px;
  }

  header .search-box input {
    background: rgba(0, 0, 0, .1) url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAdVBMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////li2ZAAAAAJnRSTlMA+UjGQjwO9uzZ0K1PBeODZAnovXdvWzAj8LWimlc1HheWj4h6KvgzptoAAAEFSURBVDjLvZJZjoMwEETdOICx2XdIWLLV/Y84mihmjLGi+cr7qlY92Q0ye1PEZyko5VnHXKzZAIQRTwHI6dj7AmnzfB10uhGqwOonokeyTUuFaNn1HQmfmVwRFcaYRKR7zYizMdWomUVQUv83hEPBbHLjiBZ3dqQctq0VZodwgaejDJmDFo2OInIJPm46knQJHa46pqVL8JDpyBE4hAa5jtkWTTh6HWfwY7+QsbpE7PgNrblPam/R0e5UBbXve0FPcy74/g35ArS/NahQbp+yXigMbSPJQghVT15+5wS1+geDBQ+JFzTOv7cQyGMWfdzUrf9+BidtOPi2cfpoeP8xFPtsjMkPA9ARTv/b5CUAAAAASUVORK5CYII=) no-repeat left 10px center;
    background-size: 18px;
  }

  .name {
    width: 75%;
  }

  .num {
    width: 25%;
    text-align: right;
  }

  .select-box {
    position: fixed;
    left: 0;
    width: 100%;
    z-index: 8;
  }

  .select-box li input[type="radio"]:checked + label:after {
    content: none;
  }

  .select-time {
    padding: 10px;
    text-align: center;
  }

  .select-time input[type='datetime'] {
    border: 1px solid #808080;
    border-radius: 5px;
    height: 34px;
    line-height: 34px;
    width: 40%;
  }

  .select-time button {
    width: 100px;
    height: 32px;
    line-height: 32px;
  }
</style>
