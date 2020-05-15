<template>
  <div>
    <!--标题栏-->
    <header class="bg-f" :style="'padding-top:'+status_bar_height+'px'">
      <h3 class="border-buttom ">在线购卡</h3>
      <span class="ico-retrun fz16" @click="back"><i class="left-arrow"></i></span>
      <span class="icon ico-search" @click="showSearch"></span>
      <!--搜索-->
      <div class="search-box bg-f" v-show="searchState">
        <form action="javascript:return true;">
          <input type="search" placeholder="请输入商家名称" @keyup.13="searchStore" v-model="search" ref="input1"/>
          <button type="button" class="fz15" @click="hideSearch">取消</button>
        </form>
      </div>
    </header>
    <div :style="'height:'+(status_bar_height+44)+'px'"></div>
    <!--代理商下的商家列表-->
    <div>
      <div class="nullImg" v-if="list.length == 0"><img src="@/assets/imgs/partnerCenter/null.png" width="50%"/></div>
      <div class="bg-f pd-lr-10 pd-tb-5 border-buttom" v-for="item in list" v-else>
        <P class="fz16 pd-tb-5 clearfix"
           @click="goBuyCard(item.id,item.contacts,item.receiverPhone,item.receiverAddress,item.shopName)"
           data-id='item.id'
           data-contacts='item.contacts'
           data-receiverPhone='item.receiverPhone'
           data-receiverAddress='item.receiverAddress'>
          <span class="fl-l">{{item.shopName}}</span>
          <span class="fl-r right-arrow"></span>
        </P>
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
  import {getAgentStoreList} from '@/assets/js/getData'
  import {rule} from "@/assets/js/deal";

  export default {
    props: ['partnerToken'],
    data() {
      return {
        searchState: false,//搜索框
        status_bar_height: this.$route.query.status_bar_height ? Number(this.$route.query.status_bar_height) : 0,
        token: '',
        tip: '',
        name: this.$route.query.name, //收货人姓名
        phone: this.$route.query.phone, //收货人电话
        address: this.$route.query.address, //收货人地址
        search: '', //搜索查询内容
        limit: 50,
        pagenum: 1,
        scrollState: true,
        showLoad: false,
        list: []
      }
    },
    created: function () {
      let _self = this;
      _self.$getParterToken().then(res => {
        _self.token = res;
        _self.getShopList();
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
      //输入内容搜索商家
      searchStore() {
        let _self = this;
        _self.$refs.input1.blur();
        if (rule.empty(_self.search, "搜索内容不能为空")) {
          _self.pageNum = 1;
          //_self.activeIndex = -1 ;
          _self.getShopList();
          //_self.search = "" ;
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
        this.getShopList();
      },
      //获取代理商下的商家列表
      getShopList() {
        let _self = this;
        let _data = {
          token: _self.token,
          shopName: _self.search,
          limit: _self.limit,
          pagenum: _self.pagenum,
        }
        if (_self.pagenum == 1) {
          _self.list = [];
        }
        _self.$getSignIn(_data).then(sec => {
          getAgentStoreList(_data,sec).then(res => {
            let _data = res.data;
            if (_data.state == 1) {
              if (_data.data.length < _self.limit) {//已经是数据最后一页
                _self.scrollState = false;
              }
              _self.list = _self.list.concat(_data.data.shopInfoList);
            } else {
              _self.toast(decodeURIComponent(_data.msg));
            }
          }).catch(function (error) {
            _self.toast(error);
          });
        })

      },
      //选择商家，跳转购买页面
      goBuyCard(id, contacts, receiverPhone, receiverAddress, shopName) {
        this.$router.push({
          path: '/buyCard',
          query: {id: id, name: contacts, phone: receiverPhone, address: receiverAddress, shopName: shopName}
        });
      }
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
            _self.pagenum = _self.pagenum + 1;
            setTimeout(() => {
              _self.showLoad = false;
              _self.getShopList();
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
</style>
