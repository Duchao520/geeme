<template>
    <div class="page">
       <div class="top_page">
           <div class="search_page" @click="searchShop">
             <div class="search_inner">
               <i class="iconfont icon-sousuo"></i>
               <span>搜索商品</span>
             </div>
           </div>
            <div class="page_top">
                <div class="tit_img">
                  <img :src="dataList.supplierLogo" alt="">
                </div>
                <div class="tit_tit">
                    {{dataList.shopName}}
                </div>
            </div>

            <div class="swap_inner">
              <div class="swap_btn">
                 <div class="swap_in_le" :class="showFirst? 'shFi':''" @click="gofirst(1)">
                       首页
                 </div>
                 <div class="swap_in_le" :class="!showFirst?'shFi':''" @click="gofirst(2)">
                       商品
                 </div>
              </div>
            </div>
       </div>

       <div class="banner_img" v-if="showFirst">
         <Swiper :images="images" />
       </div>

      <div class="first_page" v-if="!showFirst">
        <div class="all_goods">
          <div class="add_goods">
            <div class="eve_goods" :key="item.id" v-for="item in dataOther" @click="godetail({id:item.id,dis:item.distanse})">
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

              <div class="eve_bot_con" :class="item.worldDiscount !=0?'':'eve_no_bot'">
                <div class="eve_bot_le" v-if="item.worldDiscount !=0">
                  话呗抵扣￥{{item.worldDiscount}}
                </div>
              </div>

              <div class="eve_money">
                <div class="mon_footer">
                  <span style="color:#F7094D;font-size: 36rpx;">￥{{item.salePriceMin}}</span>
                  <span style="text-decoration:line-through;color:#9A9DA5;font-size: 22rpx;">￥{{item.yuanjia}}</span>
                </div>
              </div>

            </div>
          </div>
        </div>
        <div class="no_more" v-if="noMore">{{notice_mes}}</div>
      </div>

      <div class="first_page" v-if="showFirst">

        <div class="all_goods">
          <div class="add_goods">
            <div class="eve_goods" :key="item.id" v-for="item in fourData" @click="godetail({id:item.id,dis:item.distanse})">
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

              <div class="eve_bot_con" :class="item.worldDiscount !=0 ?'':'eve_no_bot'">
                <div class="eve_bot_le" v-if="item.worldDiscount !=0">
                  话呗抵扣￥{{item.worldDiscount}}
                </div>
              </div>

              <div class="eve_money">
                <div class="mon_footer">
                  <span style="color:#F7094D;font-size: 36rpx;">￥{{item.salePriceMin}}</span>
                  <span style="text-decoration:line-through;color:#9A9DA5;font-size: 22rpx;">￥{{item.yuanjia}}</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    import { getSignIn , getQuery} from '@/common/js/comm';
    import Swiper  from '@/components/newSwiper'
    export default {
        name: "index",
        components: {
          Swiper
        },
        data(){
          return {
            showFirst:true,
            shopId:'',
            dataList:'',
            images:[],
            homepage:'',
            par:{
              pageNum:1,
              pageSize:10,
              shopId:'',
            },
            fourPar:{
              pageNum:1,
              pageSize:4,
              shopId:'',
            },
            dataOther:[],
            fourData:[],
            noMore:false,
            notice_mes:'',
          }
        },
        mounted(){
          var par = getQuery();
          this.shopId = par.shopId;
          this.par.shopId = par.shopId;
          this.fourPar.shopId = par.shopId;
          this.getShopCenter();
          this.getBanner();
          this.getShopP(this.par);
          this.getFourData(this.fourPar);
        },
        methods:{
          getShopP(par){
            var _this =this;
            getSignIn(par).then(sec=>{
                _this.$http.getShopP(par,sec).then(res=>{
                  if(res.state == 1) {
                    if (res.data.length != 0) {
                      for (let i = 0; i < res.data.length; i++) {
                        if(res.data[i]) {
                          res.data[i].yuanjia = res.data[i].originalPriceRange.split("-")[0];
                          res.data[i].worldDiscount =  (((res.data[i].yuanjia)*100 - (res.data[i].salePriceMin)*10000)/10000).toFixed(2);
                        }
                      }
                      _this.dataOther = _this.dataOther.concat(res.data);
                    } else {
                      this.noMore = true;
                      this.notice_mes = '没有更多数据了~';
                      return 1;
                    }
                  }else if(res.state ==10000){
                    const url = `../../pages/loginpage/main`;
                    wx.redirectTo({url})
                  }
                })

              }
            )
          },
          getFourData(par){
            var _this =this;
            getSignIn(par).then(sec=>{
                _this.$http.getShopP(par,sec).then(res=>{
                  if(res.state == 1) {
                    if (res.data.length != 0) {
                      for (let i = 0; i < 4; i++) {
                        if(res.data[i]) {
                          res.data[i].yuanjia = res.data[i].originalPriceRange.split("-")[0];
                          res.data[i].worldDiscount = (((res.data[i].yuanjia)*100 - (res.data[i].salePriceMin)*10000)/10000).toFixed(2);
                        }
                      }
                      _this.fourData = _this.fourData.concat(res.data);
                    }
                  }
                })

              }
            )
          },
          searchShop(){
            const url = '/pages/packageA/pages/searChpage/main'
            wx.navigateTo({ url })
          },
          godetail(par){
            const url = `/pages/shopdetail/main?id=${par.id}&distanse=${par.dis}`
            wx.navigateTo({ url })
          },
          gofirst(par){
            if(par == 1){
              this.showFirst = true;
            }else{
              this.showFirst = false;
            }
          },
          getShopCenter(){
             var _data = {
               token:this.$store.state.token,
               shopId:this.shopId,
             }
             var _this = this;
             getSignIn(_data).then(sec=>{
                _this.$http.getShopCenter(_data,sec).then(res=>{
                  _this.dataList = res.shop;
                })
             })
          },
          getBanner(){
            var _data = {
              token:this.$store.state.token,
              shopId:this.shopId,
            }
            var _this = this;
            getSignIn(_data).then(sec=>{
              _this.$http.getShopText(_data,sec).then(res=>{
                this.images = res.data.banners.split(',');
              })
            })
          }
        },
      async onReachBottom() {
        // 到这底部在这里需要做什么事情
          this.inMes = true;
          this.par.pageNum ++;
          this.notice_mes = '加载中...';
          this.getShopP(this.par);
          if(this.notice_mes == '没有多数据了~') {
            return false;
          }
      },
    }
</script>

<style lang="scss" scoped>
.page{
  width:100%;
  .top_page{
    width:750rpx;
    height:304rpx;
    background:linear-gradient(175deg,rgba(0,0,0,1),rgba(255,255,255,1));
    float: left;
    position: relative;
    .search_page{
      width:690rpx;
      height:60rpx;
      background:rgba(238,238,238,0.3);
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 30rpx;
      margin:10rpx 30rpx;
      margin-top:30rpx;
      .search_inner{
        width:170rpx;
        height:100%;
        display: flex;
        font-size:28rpx;
        line-height: 60rpx;
        i{
          color:#e4e4e4;
          margin-right:10rpx;
        }
        span{
          color: #bfbfbf;
        }
      }
    }
    .page_top{
      width:690rpx;
      margin:0 30rpx;
      display: flex;
      align-items: center;
      margin-top:36rpx;
      .tit_img{
        width:70rpx;
        height:70rpx;
        font-size: 34rpx;
        margin-right:20rpx;
        background:#ff6700;
        border-radius: 6rpx;
        img{
          width:100%;
          height:100%;
          display: block;
          border-radius: 6rpx;
        }
      }
      .tit_tit{
        color:#fff;
      }
    }
    .swap_inner{
       width:100%;
       height:40rpx;
       display: flex;
       justify-content: center;
       align-items: center;
       position: absolute;
       left:0;
       bottom:32rpx;
       .swap_btn{
         width:60%;
         display: flex;
         justify-content: space-between;
         color:#fff;
         font-size: 30rpx;
         .swap_in_le{
            padding-bottom:10rpx;
         }
         .shFi{
           border-bottom:4rpx solid #fff;
         }
       }
    }
  }
  .banner_img{
    width:100%;
    margin-top:20rpx;
    overflow: hidden;
    /*height:;*/
  }
  .first_page{
    width:100%;
    background:#eeeeee;
    padding-top:30rpx;
    .first_inner{
      width:698rpx;
      margin:0 26rpx;
      background:#ffff;
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
        display:grid;
        grid-template-columns: 340rpx 340rpx;
        grid-column-gap:25rpx;
        grid-auto-flow: row dense;
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
            border-top-left-radius: 8rpx;
            border-top-right-radius: 8rpx;
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
        .eve_no_bot{
           margin-bottom:0;
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
  }
  .no_more{
    width:100%;
    height:90rpx;
    text-align: center;
    line-height: 90rpx;
    background:#f2f2f2;
    /*padding-bottom:160rpx;*/
  }
}
</style>
