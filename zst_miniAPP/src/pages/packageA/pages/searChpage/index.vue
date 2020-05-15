<template>
  <div class="page">
    <div class="page__bd">
      <div class="weui-search-bar">
        <div class="weui-search-bar__form">
          <div class="weui-search-bar__box">
            <icon class="weui-icon-search_in-box" type="search" size="14"></icon>
            <input type="text" class="weui-search-bar__input" placeholder="搜索" v-model="inputVal" :focus="inputShowed" @input="inputTyping" />
            <div class="weui-icon-clear" v-if="inputVal.length > 0" @click="clearInput">
              <icon type="clear" size="14"></icon>
            </div>
          </div>


        </div>
        <div class="weui-search-bar__cancel-btn"  @click="searchInput">搜索</div>
      </div>

      <div class="hotSeach" v-if="showSearch">
          <div class="hotS_title">热门搜索</div>
          <div class="hot_world">
             <div class="eve_inner" v-for="(item,index) in dataList" @click="getHotGoods(item)">
                    {{item}}
             </div>
          </div>
      </div>
      <!--什么时候不显示 -->
      <div class="hotSeach" v-if="!(hisMes.length== 0 || !showHisMes)">
        <div class="hotS_title">
          <div>搜索历史</div>

          <div @click="enterHis">
            <i class="iconfont icon-shanchu" style="float: left;font-size: 24rpx;"></i>
            <span style="float: left;font-size: 24rpx;margin-left:10rpx;">清除历史记录</span>
          </div>
        </div>

        <div class="hot_world">
          <div class="eve_inner" v-for="(item,index) in hisMes" @click="getHisMes(item)">
             <div><span>{{item}}</span></div>
          </div>
        </div>
      </div>

    </div>

    <div class="all_goods" v-if="shopShow">
      <div class="add_goods">
        <div class="eve_goods" :key="item.id" v-for="item in shopData" @click="godetail({id:item.id,dis:item.distanse})">
          <div class="eve_g_img">
            <img :src="item.cover" alt="">
          </div>

          <div class="eve_bot_description">
            <div class="eve_bot_de">
              <div class="over_hid" style="margin-left:8rpx;">
                <img src="/static/img/common/cat.png" alt="">{{item.goodsName}}
              </div>
            </div>
          </div>

          <div class="eve_bot_con" :class="item.worldDiscount!=0?'':'eve_no_style'">
            <div class="eve_bot_le" v-if="item.worldDiscount!=0">
              话呗抵扣￥{{item.worldDiscount}}
            </div>
          </div>

          <div class="eve_money">
            <div class="mon_footer">
              <span style="color:#F7094D;font-size: 36rpx;">￥{{item.salePriceMin}}</span>
              <span style="text-decoration:line-through;color:#9A9DA5;font-size: 22rpx;" v-if="item.worldDiscount!=0">￥{{item.yuanjia}}</span>
            </div>

          </div>
        </div>
      </div>
    </div>

    <div class="eve_shop_inner" v-if="shopData.length == 0 && shopShow">
       没有找到符合条件的商品
    </div>
    <div class="no_more" v-if="noMore">{{notice_mes}}</div>
  </div>
</template>


<script>
  import { getSignIn , getQuery } from '@/common/js/comm'
  import Tips from '@/common/js/tips'

  export default {
    data() {
      return {
        inputShowed: true,   //控制的是是否获取焦点
        inputVal: "",
        dataList:[],
        storMes:'',
        hisMes:[],
        showSearch:true,
        showHisMes:true,
        shopShow:false,
        shopData:[],
        par: {
          sort: 0,
          sortby: 'desc',
          pageNum: 1,
          pageSize: 20,
          // keyword: '',
          // brandId: '',       //商标id
          // typeIdPath: '',   //类目id
          // shopId: '',      //商家id
          // isMemberArea: '',
          token: this.$store.state.token,
          isShowInCallfeeArea:''
        },
        notice_mes:'',
        noMore:false,
      }
    },
    mounted(){
      const pages = getCurrentPages();
      console.log(pages[0].route);
      if(pages[0].route.indexOf('worldBuy')>-1){
        this.par.isShowInCallfeeArea = 1;
      }else{
        this.par.isShowInCallfeeArea = '';
      }
      this.getHot();
      this.getStor();
    },
    methods: {
      showInput() {
        this.inputShowed = true;
      },
      searchInput() {
        console.log('是不是这里有缓存',this.storMes);
        /*
        * 点击搜索以后  俩个都消失  热门搜索 showSearch    历史记录 showHisMes  是否显示商品 shopShow
        *
        * */
        if(this.inputVal ==''){
          Tips.toast('请输入搜索商品','none')
          return false;
        }else{
          this.showSearch = false;
          this.showHisMes = false;
          this.shopShow = true;
          var newStr = this.inputVal;
          this.storMes += `${newStr},`;
          this.par.keyword = this.inputVal;
          this.shopData = [];
          this.par.pageNum = 1;
          this.getList(this.par);
          wx.setStorage({
            key: 'inner',//自己去的key名，必须有，因为调用时会用到
            data: `${this.storMes}` //及接收储图片或文件地址的变量
          })
        }
      },
      clearInput() {
        this.inputVal = '';
        this.showSearch = true;
        this.shopShow = false;
        this.showHisMes = true;
        this.storMes = '';
        this.noMore = false;
        this.getStor();
      },
      godetail(par){
        const url = `/pages/shopdetail/main?id=${par.id}&distanse=${par.dis}`
        wx.navigateTo({ url })
      },
      getStor(){
        var _this = this;
        wx.getStorage({
          key: 'inner',//对应存储的key名
          success: function (res) {
            _this.storMes = res.data;
            let newArr=[],m =[];
            newArr = _this.storMes.split(',')
            for(let i=0;i<newArr.length-1;i++){
              m.push(newArr[i]);
            }
            _this.hisMes = m;
          }
        })
      },
      inputTyping(e) {
        this.inputVal = e.mp.detail.value;
        if(this.inputVal==''){
          this.noMore =false;
          this.showSearch = true;
          this.shopShow = false;
          this.showHisMes = true;
          this.getStor();
        }
      },
      getHot(){
        var _data = {
          token:this.$store.state.token
        }
        var _this = this;
        getSignIn(_data).then(sec=>{
           _this.$http.getHotpage(_data,sec).then(res=>{
                console.log(res);
                this.dataList = res.data;
           })
        })
      },
      enterHis(){
        this.hisMes = [];
        wx.setStorage({
          key: 'inner',
          data: ''
        })
      },
      //获取热门商品信息
      getHotGoods(par){
          this.par.keyword = par;
          this.inputVal = par;
          this.showSearch = false;
          this.shopShow = true;
          this.showHisMes = false;
          this.shopData = [];
          this.par.pageNum = 1;
          this.getList(this.par);
      },
      getHisMes(par){
        this.par.keyword = par;
        this.inputVal = par;
        this.showSearch = false;
        this.shopShow = true;
        this.showHisMes = false;
        this.shopData = [];
        this.par.pageNum = 1;
        this.getList(this.par);
      },
      getList(par) {
        var _this = this;
        getSignIn(par).then(sec => {
          _this.$http.getShopP(par, sec).then(res => {
            if (res.state == 1) {
              if (res.data.length != 0) {
                for (let i = 0; i < res.data.length; i++) {
                  res.data[i].yuanjia = res.data[i].originalPriceRange.split("-")[0];
                  res.data[i].worldDiscount =  ((res.data[i].yuanjia)*100 - (res.data[i].salePriceMin)*100)/100;
                }
                _this.shopData = _this.shopData.concat(res.data);
                console.log('看看这里的价格',_this.shopData);
              } else {
                if( _this.shopData.length==0){
                  _this.noMore = false;
                }else{
                  _this.noMore = true;
                  _this.notice_mes = '没有更多数据了~';
                  return 1;
                }
              }

            } else if (res.state == 10000) {
              const url = `../../pages/loginpage/main`;
              wx.redirectTo({url});
            }
          })
        })
      }
    },
    async onReachBottom() {
         // 到这底部在这里需要做什么事情

        this.par.pageNum ++;
        this.notice_mes = '加载中...';
        this.getList(this.par);
        if(this.notice_mes == '没有多数据了~'){
          return false;
        }
    },

  }
</script>

<style lang="scss" scoped>
  .searchbar-result {
    margin-top: 0;
    font-size: 14px;
  }
  .searchbar-result:before {
    display: none;
  }
  .weui-cell {
    padding: 12px 15px 12px 35px;
  }
  .hotSeach{
    padding:2%;
    .hotS_title{
      font-size: 30rpx;
      display:flex;
      justify-content: space-between;
      align-items: center;
    }
    .hot_world{
      width:100%;
      padding:10rpx 0;
      display: flex;
      flex-wrap: wrap;
      .eve_inner{
        height:40rpx;
        border:2rpx solid #bfbfbf;
        border-radius: 6rpx;
        font-size: 24rpx;
        line-height: 40rpx;
        padding:0 10rpx;
        margin-right:20rpx;
        margin-bottom:20rpx;
        color:#898989;
        overflow: hidden;
      }
    }
  }

  .all_goods{
    padding-top:14rpx;
    width:100%;
    overflow: hidden;
    background:#f2f2f2;
    .add_goods{
      width:94%;
      margin:0 3%;
      overflow: hidden;
    }
    .eve_goods{
      width:340rpx;
      margin-right:25rpx;
      margin-bottom:14rpx;
      border-radius: 10rpx;
      padding-bottom:24rpx;
      background: #fff;
      float: left;
      .eve_g_img{
        width:340rpx;
        height:340rpx;
        background: #f2f2f2;
        border-radius: 8rpx;
        img{
          width:100%;
          height:100%;
          display: block;
        }
      }
      .eve_bot_description{
        margin:0 12rpx;
        font-size: 24rpx;
        margin-top:14rpx;
        margin-bottom:36rpx;
        overflow: hidden;
        .eve_bot_de{
          .over_hid{
            width:312rpx;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            img{
              width:27rpx;
              height:27rpx;
              margin-right:10rpx;
            }

          }

        }
      }
      .eve_bot_con{
        margin:0 12rpx;
        height:30rpx;
        display: flex;
        justify-content: space-between;
        overflow: hidden;
        margin-bottom:24rpx;
        .eve_bot_le{
          height:30rpx;
          text-align: center;
          background:#F7094D;
          font-size: 20rpx;
          color:#fff;
          border-radius: 6rpx;
          padding:0 16rpx;
          line-height: 30rpx;
        }
        .arrow_box {
          height:26rpx;
          font-size: 20rpx;
          background:#f2f2f2;
          position: relative;
          border: 1px solid #F7094D;
          line-height: 28rpx;
          padding:0 6rpx;
        }
        .arrow_box:after, .arrow_box:before {
          right: 100%;
          top: 50%;
          border: solid transparent;
          content: " ";
          height: 0;
          width: 0;
          position: absolute;
          pointer-events: none;
        }

        .arrow_box:after {
          border-color: rgba(136, 183, 213, 0);
          border-right-color: #fff2f6;
          border-width: 8rpx;
          margin-top: -8rpx;
        }
        .arrow_box:before {
          border-color: rgba(194, 225, 245, 0);
          border-right-color: #F7094D;
          border-width: 12rpx;
          margin-top: -12rpx;
        }
      }
      .eve_no_style{
        margin-bottom: 0;
      }
      .eve_money{
        margin:0 14rpx;
        height:29rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .mon_footer{
          overflow: hidden;
        }
        .mon_mon{
          font-size: 24rpx;
          color:#9A9DA5;
        }
      }
    }
    .eve_goods:nth-child(2n){
      margin-right:0;
    }
  }
  .eve_shop_inner{
    margin-top:300rpx;
    width:100%;
    height:60rpx;
    line-height: 60rpx;
    text-align: center;
  }
  .no_more{
    width:100%;
    height:90rpx;
    text-align: center;
    line-height: 90rpx;
    background:#f2f2f2;
    /*padding-bottom:160rpx;*/
  }
</style>
