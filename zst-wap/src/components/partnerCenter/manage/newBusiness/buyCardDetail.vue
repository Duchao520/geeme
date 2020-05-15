<template>
  <div>
    <!--标题栏-->
    <header class="bg-r fc-f" :style="'padding-top:'+status_bar_height+'px'">
      <h3 class="border-buttom ">购卡明细</h3>
      <span class="ico-retrun fz16" @click="back"><i class="left-arrow"></i>返回</span>
      <i class="icon ico-select" @click="showSelect"></i>
    </header>
    <div :style="'height:'+(status_bar_height+44)+'px'"></div>
    <!---->
    <div class="bg-c pd-lr-10 pd-tb-5">
      <p class="fz15 p-hide">当前商家：{{shopName || ''}}</p>
      <p class="clearfix">
        <span class="fl-l fz14 fw-6">累计购卡</span>
        <span class="fl-r fc-r fw-6 fz17">{{totalCount || 0}}张</span>
      </p>
    </div>
    <!--list-->
    <ul class="bg-f">
      <div class="nullImg" v-if="list.length == 0">
        <img src="@/assets/imgs/partnerCenter/null.png" width="50%"/>
      </div>
      <div class="list-con relative border-buttom" v-else v-for="item in list">
        <img src="@/assets/imgs/partnerCenter/card1.png" v-if="item.cardType ==1"/>
        <img src="@/assets/imgs/partnerCenter/card2.png" v-else/>
        <p class="fz14">订购{{item.cardCount || 0}}张</p>
        <p class="fc-c fz12">订卡时间：{{item.createTimeStr || ''}}</p>
      </div>
    </ul>
    <!--等待-->
    <div class="loading-box" v-show="showLoad">
      <i class="loading"></i>
    </div>
    <!--筛选弹窗（选择时间分类）-->
    <div v-show="selectShow">
      <div class="mask" @click="hideSelect"></div>
      <div class="select-box bg-f fz14" :style="'top:'+(status_bar_height+44)+'px'">
        <!--tab-->
        <!--<div class="flex-box border-buttom tab-box">
                    <div class="item">
                        <input type="radio" name="tabType" id="tabType1" value="0" checked="checked" v-model="tabCon"/>
                        <label for="tabType1">状态</label>
                    </div>
                    <div class="item">
                        <input type="radio" name="tabType" id="tabType3" value="1" v-model="tabCon"/>
                        <label for="tabType3">时间</label>
                    </div>
                </div>-->
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

  export default {
    props: ['partnerToken'],
    data() {
      return {
        list: [],
        status_bar_height: this.$route.query.status_bar_height ? Number(this.$route.query.status_bar_height) : 0,
        token: '',
        tip: '',
        pageNum: 1,
        limit: 20,
        scrollState: true,
        showLoad: false, //是否显示滚动加载状态
        shopId: this.$route.query.shopId,
        shopName: this.$route.query.shopName,
        selectShow: false,
        tabCon: 1,
        totalCount: 0, //总购卡数
        cardType: '',
      }
    },
    mounted() {

    },
    created: function () {
      let _self = this;
      _self.$getParterToken().then(res => {
        _self.token = res;
        _self.getStoreCardDetail();
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
      showSelect() {
        this.selectShow = true;
      },
      hideSelect() {
        this.selectShow = false;
      },
      //选择筛选条件后获取数据
      selectType() {
        let _self = this;
        _self.pageNum = 1;
        _self.getStoreCardDetail();
        _self.selectShow = false;
      },
      //获取商家购卡详情
      getStoreCardDetail() {
        let _self = this;
        let _data = {
          token: _self.token,
          pageNum: _self.pageNum, //list的页数
          limit: _self.limit,
          startTime: _self.startTime, // 开始时间
          endTime: _self.endTime, // 开始时间
          cardType: _self.cardType, //筛选的卡类型
          shopName: _self.search, //搜索框的输入内容
          shopId: _self.shopId
        };
        if (_self.pageNum == 1) {
          _self.list = [];
        }
        _self.$getSignIn(_data).then(sec => {
          getAgentCardList(_data,sec).then(res => {
            let _data = res.data;
            _self.totalCount = _data.data.cardTotal;
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
  @import '../../../../assets/css/partner_base.css';
  .ico-select {
    width: 13px;
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAlCAMAAACEemK6AAAAM1BMVEUAAAD///////////////////////////////////////////////////////////////+3leKCAAAAEHRSTlMA75uAkxP5qIh7BaENMBrn+IJ8jQAAAH5JREFUOMvd0GEOgjAQROHH0hYQUO5/WhNNNpbpXMD5+/I16RJtGq8F5+V2wmJSAE/TKiRU1kFhsA9S4btqWEJhDraDXNzaChYmS6hMYXvQrQgTmMzAjfsOZQqVQZ0+6ZVM/zgzWpEnxf1tW3xjzWaga0TX9NwbbvNVsNt/2hvT6hhadxnp7gAAAABJRU5ErkJggg==) no-repeat center;
    background-size: 13px 18px;
  }

  .list-con {
    padding: 22px 10px 15px 90px;
  }

  .list-con img {
    position: absolute;
    width: 71px;
    left: 13px;
    top: 15px;
  }

  .select-box {
    position: fixed;
    top: 44px;
    width: 100%;
    z-index: 8;
  }

  input[type="radio"]:checked + label:after {
    content: none;
  }
</style>
