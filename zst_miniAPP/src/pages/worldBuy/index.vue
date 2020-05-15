<template>
    <div class="page">

      <div class="vip_con">
        <div class="scroll_box" style="position: fixed;top:0;left:0;padding-left:4%;z-index:999;padding-bottom:10rpx;">
          <div class="search_page" @click="searchShop">
            <div class="search_inner">
                <i class="iconfont icon-sousuo"></i>
                <span>搜索商品</span>
            </div>
          </div>
          <scroll-view class="scroll-view_x" scroll-x style="width: auto;overflow:hidden;">
            <div class="item_list" :key="item.id" v-for="(item,index) in list">
              <div class="item_book_text" :class="{active:num == index}" @click="clickHandle(item.id,index)">{{item.name}}</div>
            </div>
          </scroll-view>
        </div>
      </div>



      <div class="banner_in" v-if="images.length != 0">
          <div class="bann_img">
            <div class="bann_bann">
               <Swiper :images="images" />
            </div>
          </div>
      </div>

      <div class="bran_img"  :style="{ marginTop:marginTop + 'rpx',padding:paddingBottom + 'rpx'}">
         <div class="all_barn">
            <div class="eve_bran" v-for="(item,index) in brandList" :key="item.id" @click="goBrandDetail(item)">
              <div class="ri_bo">
                 <img :src="item.brandLogo" alt=""  :style="{ borderBottom:borderBottom}">
              </div>
            </div>
         </div>
      </div>
      <div class="all_goods"  :style="{ marginTop:allMarginTop + 'rpx'}">
        <div class="add_goods">
          <div class="eve_goods" :key="item.id" v-for="item in dataList" @click="godetail({id:item.id,dis:item.distanse})">
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

            <div class="eve_bot_con" :class="item.worldDiscount!=0 ? '':'eve_no_bot'">
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



      <div class="no_more" v-if="noMore">{{notice_mes}}</div>
    </div>
</template>

<script>
    import Swiper  from '@/components/swiper'

    import { getSignIn } from '@/common/js/comm'
    import { mapMutations } from 'vuex'
    import { TOTALMONEY , AREACODE , LNG, LAT , REGION}  from '../../store/mutation-types'
    export default {
        name: "index",
        data(){
          return {
            num:0,
            index:0,
            // 精品推荐 手机数码 运动鞋包
            list:[],
            thrImg:[],
            dataList:[],
            isactive:false,
            noMore:false,
            // 轮播
            images:[],
            // 传递的参数
            par:{
              pageNum:1,
              pageSize:10,
              typeIdPath:'118000000000',
              isShowInCallfeeArea:1
            },
            notice_mes:'',
            attenAcc:'',
            scrollIn:false,
            moduleVip:[],
            inMes:false,

            dataArr:[],
            innerTitle:'',
            imgData:[],
            marginTop:0,
            borderBottom:'',
            brandList:'',
            paddingBottom:30,
            allMarginTop:'',
            marginBottom:''
          }
        },
        components: {
          Swiper
        },
        mounted(){
            this.attenAcc = this.$store.state.attenAccount;
            this.getShopType();
            this.getShopP(this.par);
            this.getbanner();
            this.getBannMo();
            //获取用户授权信息
            this.getLocations();
            if (this.$store.state.rechargeSwitch == 0 || this.$store.state.rechargeSwitch == -1) {
              this.inMes = true;
            } else {
              this.innerTitle = '推荐商家'
              this.inMes = false;
            }
        },
       methods: {
        ...mapMutations({
          totalMoney:'TOTALMONEY',
          areaCode:'AREACODE',
          lng:'LNG',
          lat:'LAT',
          region:'REGION',
        }),
         goBrandDetail(par){
           wx.navigateTo({
             url:`/pages/packageA/pages/worldDetail/main?brandName=${par.brandName}&id=${par.id}`
           })
         },
        goShop(par){
          wx.navigateTo({
            url:`../../pages/shopRecDet/main?shopStoreId=${par.id}&distance=${par.distance}`
          })
        },

        getLocations(){
          let _this = this
          wx.getSetting({
            success(res) {
              if (!res.authSetting['scope.userLocation']) {
                wx.authorize({
                  scope: 'scope.userLocation',
                  success(res) {
                    _this.wxGetLocation()
                  },
                  fail(err) {
                    console.log('11',err);
                  }
                })
              } else {
                // 授权过
                _this.wxGetLocation();
              }
            },
            fail(err) {
              console.log(err)
            }
          });
        },
        gcj02tobd09(lng, lat){
          // alert(1)
          var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
          var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
          var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
          var bd_lng = z * Math.cos(theta) + 0.0065;
          var bd_lat = z * Math.sin(theta) + 0.006;
          return [bd_lng, bd_lat]
        },
        wxGetLocation(){
          let _this = this;
          wx.getLocation({
            type: 'wgs84',
            success: function (res) {
              let latitude,longitude,lati,long;
              lati = res.latitude.toString();
              long = res.longitude.toString();
              var arr  = _this.gcj02tobd09(long,lati)
              latitude = arr[1];
              longitude = arr[0];
              wx.request({
                header:{
                  "Content-Type": "application/text"
                },
                url:'https://apis.map.qq.com/ws/geocoder/v1/?location='+latitude+','+longitude+'&key=BQ5BZ-KE434-I4CU6-X5WGI-J4MXE-7CFZL',
                success: function(res) {
                  let lng,lat,areaCode,region =[];
                  lng = res.data.result.location.lng;   //纬度
                  lat = res.data.result.location.lat;   //精度
                  areaCode = res.data.result.ad_info.adcode; //所在城市编码
                  region[0] = res.data.result.address_component.province; //省市区
                  region[1] = res.data.result.address_component.city; //省市区
                  region[2] = res.data.result.address_component.district; //省市区
                  _this.areaCode(areaCode);
                  _this.lng(lng);
                  _this.lat(lat);
                  _this.region(region);
                },

              });
            },
            fail: function(err) {
              console.log(err);
            }
          });
        },
        getBalance(){
          var _this = this;
          if(this.$store.state.token){
            var _data = {
              token:this.$store.state.token,
            }
            getSignIn(_data).then(sec=>{
              _this.$http.getBalance(_data,sec).then(res=>{
                if(res.state == 1) {
                  _this.totalMoney(res.data.totalMoney);
                }else{
                  console.log('为什么会提示用户不存在',decodeURIComponent(res.msg))
                }
              })
            })
          }
        },
        getbanner(){
          var _data = {
            platform:3,
            typeId: this.par.typeIdPath
          }
          getSignIn(_data).then(sec=>{
            this.$http.getBannBy(_data,sec).then(res=>{
              if(res.state=1){
                for(let i=0;i<res.data.length;i++){
                    res.data[i].imghref = res.data[i].imgUrl;
                }
                if(res.brandList.length == 0){
                  this.paddingBottom = 0;
                }
                else if(res.brandList.length <= 4){
                  this.borderBottom = 0;
                  this.paddingBottom = 0;
                }else{
                  this.borderBottom = '2rpx solid #E5E5E5';
                  this.paddingBottom = 0;
                }
                this.brandList = res.brandList;

                if(res.data.length == 0){
                  if(this.brandList.length!=0){
                    this.marginTop = 144;
                  }else{
                    this.allMarginTop = 60;
                    this.marginTop = 0;
                  }
                }else{
                  if(this.brandList.length!=0){
                    this.marginTop = 0;
                    this.allMarginTop = 10;
                  }else{
                    this.allMarginTop = 0;
                  }
                }
                this.images = res.data;
              }else{
                console.log('获取轮播图失败');
              }
            })
          })
        },
        getShopP(par){
          var _this =this;
          getSignIn(par).then(sec=>{
              _this.$http.getShopP(par,sec).then(res=>{
                if(res.state == 1) {
                  if (res.data.length != 0) {
                    for (let i = 0; i < res.data.length; i++) {
                      res.data[i].yuanjia = res.data[i].originalPriceRange.split("-")[0];
                      res.data[i].worldDiscount =  ((res.data[i].yuanjia)*10000 - (res.data[i].salePriceMin)*10000)/10000;
                    }
                    _this.dataList = _this.dataList.concat(res.data);
                  } else {
                    this.noMore = true;
                    this.notice_mes = '没有更多数据了~';
                    return 1;
                  }
                }
              })

            }
          )
        },
        getShopType(){
          var _this =this;
          var par = {
            platform:3
          }
          getSignIn(par).then(sec=>{
              _this.$http.getShopType(par,sec).then(res=>{
                _this.par.typeIdPath=res.data[0].id;
                _this.list = res.data;
              })
            }
          )
        },
        bindViewTap () {
          const url = '../logs/main'
          wx.navigateTo({ url })
        },

        godetail(par){
          const url = `../../pages/shopdetail/main?id=${par.id}&distanse=${par.dis}`
          wx.navigateTo({ url })
        },
        goIsCarder(){
          const url = '../../pages/isCarder/main'
          wx.navigateTo({ url })
        },
        searchShop(){
          const url = '/pages/packageA/pages/searChpage/main'
          wx.navigateTo({ url })
        },
        clickHandle (id,par) {
          this.num = par;
          this.par.typeIdPath = id;
          this.dataList = [];
          this.par.pageNum = 1;
          this.getbanner();
          this.getBannMo();
          this.getShopP(this.par);
        },
        getBannMo(){
          var _data = {
            platform:3,
            typeId: this.par.typeIdPath,
            token:this.$store.state.token
          }
          var _this = this;
          getSignIn(_data).then(sec=>{
             _this.$http.getBannMod(_data,sec).then(res=>{

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
            if(this.notice_mes == '没有多数据了~'){
              return false;
            }
        }
    }
</script>

<style lang="scss" scoped>
  .page{
    width:100%;
    height:100%;
    overflow: hidden;
  }
  .search_page{
    width:92%;
    height:60rpx;
    background:#f6f6f6;
    display: flex;
    justify-content: center;
    align-items: center;
    margin:10rpx 0;
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
  .share_app{
    width:100%;
    overflow: hidden;
    float: left;
    .share_title{
      width:100%;
      display: flex;
      align-items: center;
      flex-direction: column;
      margin-top:24rpx;
      margin-bottom:10rpx;
      .sha_img{
        width:211rpx;
        height:22rpx;
        margin-bottom:8rpx;
        img{
          width:100%;
          height:100%;
          display: block;
        }
      }
      .sha_title{
        font-size: 20rpx;
        color:#0D0D0F;
      }

    }
    .share_con{
      margin:0 19rpx;
      overflow: hidden;
      .sh_co_top{
        .sh_left{
          width:48%;
          float: left;
          margin-right:4%;
          margin-bottom:20rpx;
          .sh_le_im{
            width:80rpx;
            height:80rpx;
            float: left;
            img{
              width:100%;
              height:100%;
              display:block;
            }
          }
          .sh_le_con{
            padding-top:16rpx;
            float: left;
            width:76%;
          }
        }
        .sh_left:nth-child(2n){
          margin-right:0;
        }
        .sh_right{
          width:48%;
        }
      }
    }
    .share_bot{
      width:100%;
      display: flex;
      align-items: center;
      flex-direction: column;
      .sh_bot_title{
        font-size:24rpx;
        color:#FE0F53;
        padding:10rpx 0;
      }
      .sh_bot_img{
        width:700rpx;
        height:186rpx;
        margin-bottom:20rpx;
        img{
          width:100%;
          height:100%;
          display: block;
        }
      }
    }
    .fir_bot_bot{
      width:702rpx;
      padding:0 24rpx;
      margin-bottom:10rpx;
    }
  }
  .vip_con{
    width:92%;
    margin:0 4%;
    overflow: hidden;
    .vip_con_title{
      margin-top:52rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 39rpx;
      span{
        display: block;
        overflow: hidden;
      }
    }
    .scroll_box{
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      background:#fff;
      ::-webkit-scrollbar{
        width: 0;
        height: 0;
        color: transparent;
      }
    }
    .svip_con{
      width:100%;
      display: flex;
      justify-content: space-between;
      overflow: hidden;
      .svip_img{
        width:340rpx;
        height:222rpx;
        img {
          width:100%;
          height:100%;
          display: block;
        }
      }
    }
    .scro_con{
      width:100%;
    }
    .item_list{
      height: auto;
      margin-right: 80rpx;
      display: inline-block;
      .item_book_text{
        font-size: 28rpx;
      }
      .active{
        color:#F7094D;
        border-bottom:2px solid #F7094D;
      }
    }
  }
  .banner_in{
    width:100%;
    background:#f2f2f2;
    padding-top:14rpx;
    margin-top:144rpx;
    border-radius: 8rpx;
    .bann_img{
      width:100%;
      background:#fff;
      .bann_bann{
        width:698rpx;
        margin:0 26rpx;
        padding-top:20rpx;
        padding-bottom:20rpx;
      }
    }
  }
  .bran_img{
     width:100%;
     padding:30rpx 0;
     .all_barn{
       width:698rpx;
       overflow: hidden;
       margin:0 26rpx;
       display: grid;
       grid-template-columns: 25% 25% 25% 25%;
       .eve_bran{
         padding:8rpx 0;
         float: left;
         .ri_bo{
            height:62rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            border-right:2rpx solid #E5E5E5;
            padding-right:12rpx;
           img{
             width:140rpx;
             margin:0 15rpx;
             height:80rpx;
             display: block;
             border-bottom:2rpx solid #E5E5E5;
             padding-bottom:4rpx;
           }
         }

       }
       .eve_bran:nth-child(4n){
         .ri_bo{
           border-right:0;
         }

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
  .shop_bot{
    width:710rpx;
    padding:0 20rpx;
    margin-top:60rpx;
    .shop_bot_title{
      margin-top:20rpx;
      font-size:36rpx;
      font-weight:bold;
      color:rgba(0,0,0,1);
      margin-bottom:36rpx;
    }
    .eve_shop_inner{
      width:100%;
      .eve_con{
        width:100%;
        height:190rpx;
        border-bottom:2rpx solid rgba(52,60,83,0.2);
        padding-bottom:56rpx;
        margin-top:30rpx;
        .eve_con_le{
          width:250rpx;
          height:190rpx;
          background: #f2f2f2;
          border-radius: 10rpx;
          float: left;
          img{
            width:100%;
            height:100%;
            display: block;
            border-radius: 10rpx;
          }
        }
        .eve_con_ri{
          float: left;
          width:434rpx;
          margin-left:16rpx;
          .ev_shopName{
            font-size: 32rpx;
            font-weight:400;
            @include jcsb;
            align-items: center;
            .ev_name{
              width:324rpx;
              @include ovh;
            }
            .ev_add{
              font-size:24rpx;
              color:rgba(52,60,83,0.6);
            }
          }
          .intro{
            height:30rpx;
            display: flex;
            align-items: center;
            margin-top:10rpx;
            .in_tit{
              font-size: 24rpx;
              line-height:30rpx;
              float: left;
              margin-right:14rpx;
            }
            .in_img{
              float: left;
              width:110rpx;
              height:30rpx;
              img{
                width:100%;
                height:100%;
                display: block;
              }
            }
          }
        }
      }
    }
    .int_cu{
      width:100%;
      height:30rpx;
      display: flex;
      align-items: center;
      margin:10rpx 0;
      .cu_img{
        width:24rpx;
        height:24rpx;
        float: left;
        margin-right:10rpx;
        img{
          width:100%;
          height:100%;
          display: block;
        }
      }
      .cu_con{
        float: left;
        font-size: 24rpx;
      }
    }
    .int_bot_bot{

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

</style>
