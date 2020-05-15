<template>
  <div>
    <!--标题栏-->
    <header class="bg-f" :style="'padding-top:'+status_bar_height+'px'">
      <h3 class="border-buttom ">我推荐的联盟商家</h3>
      <span class="ico-retrun fz16" @click="back"><i class="left-arrow"></i></span>
      <i class="icon ico-search" @click="showSearch"></i>
      <!--搜索-->
      <div class="search-box bg-f" v-show="searchState">
        <form action="javascript:return true;">
          <input type="search" placeholder="请输入商家名称" @keyup.13="searchStore" v-model="search" ref="input1"/>
          <button type="button" class="fz15" @click="hideSearch">取消</button>
        </form>
      </div>
    </header>
    <div :style="'height:'+(status_bar_height+44)+'px'"></div>
    <!--list-->
    <div class="bg-f">
      <div class="nullImg" v-show="list.length == 0 && showNull">
        <img src="@/assets/imgs/partnerCenter/noBusslist.png" width="50%"/>
        <p class="fz20">亲，您当前还没有邀请的商家</p>
        <!--<a class="btn btn-invitation" href="/zst-wap/vipCenter/vipCenter.html">马上邀请</a>-->
      </div>
      <div v-show="list.length != 0" v-for="n in headList">
        <div class="bg-c pd-lr-10 pd-tb-5">
          <p class="clearfix title-p fz-36">
            <span class="fl-l">{{n.createDateStr}}</span>
            <span class="fl-r fc-r">共{{n.todayShopCount}}家</span>
          </p>
        </div>
        <div class="list-con bg-f mb-5" v-for="(item,k) in list" v-if="n.createDateStr == item.createDateStr">
          <!--商家信息-->
          <div class="store-info relative">
            <div class="img">
              <img :src="item.supplierLogo" width="100%" v-if="item.supplierLogo"/>
              <img src="@/assets/imgs/partnerCenter/no.png" width="100%" v-else/>
            </div>
            <router-link :to="{path:'/detail',query: {id: item.id , coord:coord}}">
              <p class="fz14 txt-hide name">{{item.shopName}}</p>
              <p class="fc-c fz12">入驻时间：{{item.createTimeStr}}</p>
              <div class="address relative">
                <p class="fz12 fc-c txt-hide">{{item.unitAddress}}</p>
                <div class="fz10 fc-c distance">{{item.distance}}km</div>
              </div>
            </router-link>
            <p class="fz10 phone"><a class="fw-6" :href="'tel:'+item.contactPhone">{{item.contactPhone}}</a></p>
          </div>
          <!--审核状态-->
        </div>
      </div>
    </div>
    <!--等待-->
    <div class="loading-box" v-show="showLoad">
      <i class="loading"></i>
    </div>
    <v-toast :tip="tip" ref="toast"></v-toast>
  </div>
</template>

<script>
  import {rule} from "@/assets/js/deal";
  import {getRefereeList} from '@/assets/js/getData'
  import {getGPS} from "@/assets/js/jsBridge";
  import {postColor} from "@/assets/js/jsBridge";

  export default {
    props: ['partnerToken'],
    data() {
      return {
        searchState: false,//搜索框
        list: [], //商家列表
        headList: [], //顶部统计列表
        scrollState: true,
        showLoad: false, //是否显示滚动加载状态
        pageNum: 1, //list的页数
        limit: 20,
        search: '', //搜索框输入的搜索内容
        status_bar_height: this.$route.query.status_bar_height ? Number(this.$route.query.status_bar_height) : 0,
        token: '',
        tip: '',
        lastRecordTime: 0,
        //longitude : 0, //经度
        //latitude : 0 ,//纬度
        coord: '', //经纬度
        time: this.$route.query.time || 0, //time为0时为全部，传入对应时间，查询对应时间内列表
        showNull: false,//第一次进入页面，不能先显示无记录图
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
      //输入内容搜索商家
      searchStore() {
        let _self = this;
        _self.$refs.input1.blur();
        if (rule.empty(_self.search, "搜索内容不能为空")) {
          _self.pageNum = 1;
          //_self.activeIndex = -1 ;
          _self.getRefereeList();
        }
      },
      //点击显示搜索框
      showSearch() {
        this.searchState = true;
      },
      //点击隐藏搜索框
      hideSearch() {
        this.searchState = false;
        this.search = '';
        this.pageNum = 1;
        this.getRefereeList();
      },
      //获取信息列表
      getRefereeList() {
        let _self = this;
        let _data = {
          token: _self.token,
          time: _self.time,
          pageNum: _self.pageNum,
          limit: _self.limit,
          shopName: _self.search,
          coord: _self.coord,
          lastRecordTime: _self.lastRecordTime, //最后一个数据的时间戳
        };
        _self.$getSignIn(_data).then(sec => {
          getRefereeList(_data,sec).then(res => {
            let _data = res.data;
            if (_data.state == 1) {
              let _len = _data.data.thisMtnNewsShopList.length;
              if (_len < _self.limit) {
                _self.scrollState = false;
              }
              if (_self.pageNum == 1) {
                _self.list = []; //清空列表内容
                _self.headList = [];
              }
              _self.showNull = true;
              _self.lastRecordTime = _data.data.thisMtnNewsShopList[_data.data.thisMtnNewsShopList.length - 1].createTime;
              _self.headList = _self.headList.concat(_data.data.thisMtnNewsShopCount);
              _self.list = _self.list.concat(_data.data.thisMtnNewsShopList);
            } else {
              _self.toast(decodeURIComponent(_data.msg));
            }
          })
        })

      },
      /*筛选状态*/
      selectType(i) {
        this.pageNum = 1;
        this.state = i;
        this.getRefereeList();
      },
      /*获取经纬度*/
      getGPS() {
        var _self = this;
        getGPS().then(res => {
          _self.coord = res.LONG + ',' + res.LAT;
          _self.getRefereeList();
        })
      }
    },
    created: function () {
      let _self = this;
      _self.$getParterToken().then(res => {
        _self.token = res;
        _self.getGPS();
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
              _self.showLoad = false;
              _self.getRefereeList();
            }, 1500);
          }
        }
      });
    }
  }
</script>

<style scoped>
  @import '../../../../assets/css/partner_base.css';
  /*头部搜索*/
  header .search-box input {
    background: rgba(0, 0, 0, .1) url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAdVBMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////li2ZAAAAAJnRSTlMA+UjGQjwO9uzZ0K1PBeODZAnovXdvWzAj8LWimlc1HheWj4h6KvgzptoAAAEFSURBVDjLvZJZjoMwEETdOICx2XdIWLLV/Y84mihmjLGi+cr7qlY92Q0ye1PEZyko5VnHXKzZAIQRTwHI6dj7AmnzfB10uhGqwOonokeyTUuFaNn1HQmfmVwRFcaYRKR7zYizMdWomUVQUv83hEPBbHLjiBZ3dqQctq0VZodwgaejDJmDFo2OInIJPm46knQJHa46pqVL8JDpyBE4hAa5jtkWTTh6HWfwY7+QsbpE7PgNrblPam/R0e5UBbXve0FPcy74/g35ArS/NahQbp+yXigMbSPJQghVT15+5wS1+geDBQ+JFzTOv7cQyGMWfdzUrf9+BidtOPi2cfpoeP8xFPtsjMkPA9ARTv/b5CUAAAAASUVORK5CYII=) no-repeat left 10px center;
    background-size: 18px;
  }


  .ico-search {
    width: 20px;
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAoCAMAAABKKxPSAAAAP1BMVEUAAAANDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8NDQ8I3WivAAAAFXRSTlMA/Q/db8x/smVWPyzppRuPIrs1Spxgy9eAAAABOUlEQVQ4y82T23KFIAxF2SQhXERF/f9v7ZS26ggefex+0sxyAQmaPTY6lQGDqIvW3CYo4S+k4YZcNgIoO/bscn1cujIB1Mf522LnyApIaDFPIJdOheQI5BsbQdZ2BboYF4FEc00USDoXbK5fNlkJ+bKqM70whnjSKTR1uSRQe9az6ccDh2ECxRtuGXD0RpHHG25UTPvC9RT9WAfdHQCbu3jIfHD+gXvve95f2fdXPpw3Y7NH/+Suf+k8gvBxHvHNfAuKNc9CD4TL/Vs7WCSovRTK0l6CAlma30jj1VaA7dpPHiB+PlVmLwCkmSgTkEOyP5+lkFHTHnBVADJxCIEnAaAbdUHLgiPCo+G+0djVKQGgMq114q6C3rTkOKclzaP9fa3gwOY+/wa0j+BUQWfegTDvQDIvQDcIfwFXcgn8c9H55QAAAABJRU5ErkJggg==) no-repeat center;
    background-size: 100% auto;
  }

  .list-con {
    padding: 0 10px 5px;
  }

  .store-info {
    padding: 12px 0 10px 120px;
    overflow: hidden;
  }

  .store-info .img {
    position: absolute;
    width: 105px;
    height: 105px;
    overflow: hidden;
    left: 0;
  }

  .address {
    padding-right: 60px;
  }

  .distance {
    position: absolute;
    right: 0;
    top: 0;
    padding-top: 18px;
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAARVBMVEUAAADx8/nn6e7n6e7n6e7n6e7p7PHo6u/o6e/n6e7o6u7o6u/o6vDn6e7n6e7n6e7s7vbn6e7o6vDm7PPn6e7m6O/n6e61PIedAAAAFnRSTlMADNmnxI0hZk27eFhB47KBGfE2KOmbDNWSmwAAANZJREFUOMt1UlkWhCAMgwrIIrgO9z/qPEem0CL5M4lNrBUNjHeQMzhvkCJyyoj0YvGZwDNZpsyQJDG43GFqdZ1fMDf9kIwKqmNDw1QYCHedADxEFkLJ8qwK8e9p+citEJZWXAVifRhNK5zVcNISChNZK4UTBgZHE201WNphqQMxlL4S2W7n53knX4UO1LOunfZCgQ5LAPwXo2vBARXy6vVILsb2hkUQTIODqiGR6lADcFsEp+gwt3pgIq/xYRK/fSXeIYEX5DC/lV9GDHHchoNQ3AHANvgFgyIl2qkpxx4AAAAASUVORK5CYII=) no-repeat center top;
    background-size: 15px auto;
  }

  .phone {
    margin: 15px 0 0 0;
    padding-left: 42px;
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAMAAACf4xmcAAABEVBMVEUAAAD9bHj5GVP8Vm/5Ilf4ElH9fYD8bHj5JFn/n4//nI7/iob/lYv5HVX/lov5J1r/n4//kor7UGz/kYn4F1P4IFb4E1H7Rmj5HFX7R2j4GlT7VG76OmL5NmH7UGz9d336O2L8YHP7VW/6PGP+kYj/n4/4ElD+jof5I1n8Znb/nY79en74FVL+f4H4E1H/no/9gYL5MV76RGf9c3z/nI7+kYn3D0/9hoT8bnn6Smn5LVz9iIX/nY74FFL5LV37U236P2T8cHr7WXD9c3z7VW76Qmb9en/5JFn4FVH5LVz7RGf/oJD6PmT9dn3+jIf8ZHX8a3j6OWL6Q2b7Tmv5KFr5MV79dXz7XXL8ZXX9g4P+ioaY8mXSAAAAUXRSTlMADXEqJ+v+/vHrcSg6OC8U0JpxbC7az5uXX1s6M/ns6urk2NfVqamnpnFbW05K+vns6+jk497az8/Pz8G9u7m4raillZCMgYFkY1VNSjfqumbCdHB7AAAB20lEQVQ4y3WS6VraQBSGT4YESYBshB0Lyo51X+tWl2rV2lYIgnj/F+JMJjEz5vD9mXxn3udsGZBkGl1b397W7a5hwhIpRufQGZkK/TJHzoFtKBhV+NfPiT7X1Y0ElD0+SyVi53ZWjmzuFNAK+h/RbjT/AqqcPhJyNaWCUuE4X2o/zIXni/o7eQkjTsdB+rP5OfzPz9vF4v19M8mdG8FW13hj97N0erE4Q9o7YHt2b7hbmc0YmE1yfZZuvc7N20oA3iNTdOiY66FZewvAfUjq0AS3DFw/53MGXiOYU4CrKnBV/TkFh4Boow/tRmR8n4KAyTyGlhUZ16f6hWHKDqzGbm9CuTrGpUXseTKZ+N8UFNu1YlceU/AHUrQJpw3Bt8cULCew1AkMaoK3VscUvGM3KXEh10AqICj/+krBO6jTmeMmb4fgFUHU45SB7WCYpyjI3lAxL3G/pwE4ZmDYZZ39djKAL1wM8siNy6bVVJkj00+Qz8lXSS5A1vdMCF7xp+PycOkBZFmVDNMlfznRvlUtD0vV2FM/q7D2cKmt59jUluVrtKpS19oDRj3uPn1JXrpQEwUvT5PNEK0nVc4PMgR9yuToqFLzLADLq1WKRaLAEnmkV9K2trRSj3jSxQcsjURt4FWcsgAAAABJRU5ErkJggg==) no-repeat left center;
    background-size: auto 100%;
    line-height: 2;
    position: relative;
  }

  .phone:after {
    content: '';
    display: block;
    height: 80%;
    width: 1px;
    background: #dcdcdc;
    position: absolute;
    left: 30px;
    top: 10%;
  }

  .phone a {
    display: block;
  }

  .title-p {
    line-height: 21px;
  }


  /*没有邀请的商家*/
  .nullImg {
    text-align: center;
  }

  .nullImg p {
    padding: 50px 0;
  }

  .btn-invitation {
    width: 50%;
    margin-top: 180px;
    border-radius: 44px;
  }
</style>
