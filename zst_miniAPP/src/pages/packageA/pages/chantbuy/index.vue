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
        <label class="weui-search-bar__label" :hidden="inputShowed" @click="showInput">
          <icon class="weui-icon-search" type="search" size="14"></icon>
          <div class="weui-search-bar__text">搜索</div>
        </label>
      </div>
      <div class="weui-search-bar__cancel-btn" :hidden="!inputShowed" @click="hideInput">取消</div>
    </div>
    <div class="weui-cells searchbar-result" v-if="inputVal.length > 0">
      <navigator url="" class="weui-cell" hover-class="weui-cell_active">
        <div class="weui-cell__bd">
          <div>实时搜索文本</div>
        </div>
      </navigator>
      <navigator url="" class="weui-cell" hover-class="weui-cell_active">
        <div class="weui-cell__bd">
          <div>实时搜索文本</div>
        </div>
      </navigator>
      <navigator url="" class="weui-cell" hover-class="weui-cell_active">
        <div class="weui-cell__bd">
          <div>实时搜索文本</div>
        </div>
      </navigator>
      <navigator url="" class="weui-cell" hover-class="weui-cell_active">
        <div class="weui-cell__bd">
          <div>实时搜索文本</div>
        </div>
      </navigator>
    </div>
  </div>

      <div class="scroll_box">

      <scroll-view class="scroll-view_x" scroll-x style="width: auto;overflow:hidden;">
        <div class="item_list" v-for="(item,index) in list">
          <div class="item_book_text" :class="{active:num == index}" @click="clickHandle(index)">{{item.title}}</div>
        </div>
      </scroll-view>

    </div>

    <div class="img_banner">
      <img src="" alt="">
    </div>

    <div class="ad_img">
        <div class="eve_ad_img" v-for="item in dataList">
            <div class="img_con">
              <img src="" alt="">
            </div>
        </div>
    </div>

    <div class="vip_price">
        <div class="vip_price_fir">
          <div class="vip_con">
              <div class="vip_top">

              </div>

              <div class="vip_bot">

                  <div class="vip_bot_con" v-for="item in shopdata">
                    <div class="vip_bot_left">
                      <div class="vip_title">{{item.shopname}}</div>
                      <div class="vip_intro">{{item.shopintro}}</div>
                      <div class="vip_price_price">
                          <div class="pri">
                            <span style="font-size: 24rpx;">￥</span>
                            <span style="font-size: 36rpx;">{{item.pri}}</span></div>
                          <div class="pri_origin" style="font-size: 20rpx;color: #94969B;">
                            <span>原价￥{{item.originpri}}</span>
                          </div>
                      </div>
                    </div>
                    <div class="vip_bot_right">

                    </div>
                  </div>

              </div>
          </div>
        </div>
        <div class="all_goods">
          
          <div class="eve_goods" v-for="item in datanum">
          <div class="eve_g_img">
            <img src="" alt="">
          </div>

          <div class="eve_bot_description">
            <div class="eve_bot_de">
              <img src="/static/img/common/cat.png" alt="">
              <span style="margin-left:8rpx;">Tha 3.8 春季新款重工西装 裤宽松纯色长裤高腰阔腿裤...</span>
            </div>
          </div>

          <div class="eve_bot_con">
            <div class="eve_bot_le">
              话呗抵扣￥50
            </div>
            <div class="arrow_box">
              预估赚￥20.00
            </div>
          </div>

          <div class="eve_money">
            <div class="mon_footer">
              <span style="color:#F7094D;font-size: 36rpx;">￥250.0</span>
              <span style="text-decoration:line-through;color:#9A9DA5;font-size: 22rpx;">￥300.0</span>
            </div>
            <div class="mon_mon">
              销量1050
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
      data() {
        return {
          inputShowed: false,
          inputVal: "",
          list:[
            {title:'VIP专区'},
            {title:'精品推荐'},
            {title:'手机数码'},
            {title:'运动鞋包'},
            {title:'母婴产品'},
          ],
          num:0,

          dataList:[
            {num:1},
            {num:2},
            {num:3},
            {num:4},
            {num:5},
            {num:6},
            {num:7},
            {num:8},
            ],
          datanum:[
            {num:1},
            {num:2},
            {num:2},
            {num:2},
          ],
          shopdata:[
            {shopname:'iPhoneXS Max',shopintro:'6G+124G',pri:'999',originpri:'9999'},
            {shopname:'华为nova3全面屏手机是真牛逼快点加我 ',shopintro:'6G+124G',pri:'999',originpri:'9999'},

          ]
        }
      },
      methods: {
        showInput() {
          this.inputShowed = true;
        },
        hideInput() {
          this.inputVal = '';
          this.inputShowed = false
        },
        clearInput() {
          this.inputVal = '';
        },
        inputTyping(e) {
          console.log(e);
          this.inputVal = e.mp.detail.value
        },
        clickHandle (par) {
          this.num = par;
          console.log(par)
        }
      }
    }
</script>

<style lang="scss" scoped>
  .page__bd{
    margin-bottom:37rpx;
  }
  .scroll_box{
    width: 94%;
    margin:0 3%;
    overflow: hidden;
    white-space: nowrap;
    margin-bottom:14rpx;
    ::-webkit-scrollbar{
      width: 0;
      height: 0;
      color: transparent;
    }
  }
  .item_list{
    height: auto;
    margin-right: 80rpx;
    display: inline-block;
    .item_book_text{
      font-size: 24rpx;
    }
    .active{
      color:#F7094D;
      border-bottom:2px solid #F7094D;
    }
  }
  .img_banner{
    width:100%;
    height:261rpx;
    background: #ff6700;
    img{
      width:100%;
      height:100%;
      display: block;
    }
  }
  .ad_img{
    width:98%;
    margin:0 1%;
    display: flex;
    flex-wrap: wrap;
    overflow:hidden;
    padding-bottom:20rpx;
    .eve_ad_img{
      width:25%;
      height:50rpx;
      border-right:1rpx solid #E5E5E5;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top:20rpx;
      background:gold;
      .img_con{
        width:94%;
        height:46rpx;
        padding-bottom:20rpx;
        border-bottom:1rpx solid #E5E5E5;
        /*background:purple;*/
      }
    }
    .eve_ad_img:nth-child(4n){
      border-right:0;
    }
    .eve_ad_img:nth-child(5){
      .img_con{
        border-bottom:0;
      }
    }
    .eve_ad_img:nth-child(6){
      .img_con{
        border-bottom:0;
      }
    }
    .eve_ad_img:nth-child(7){
      .img_con{
        border-bottom:0;
      }
    }
    .eve_ad_img:nth-child(8){
      .img_con{
        border-bottom:0;
      }
    }

  }
  .vip_price{
    width:98%;
    padding:0 1%;   //750 - 15 = 735;
    background:#f2f2f2;
    overflow: hidden;
    .vip_price_fir{
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom:16rpx;
      .vip_con{
        width:730rpx;
        height:302rpx;
        background:#fff;
        margin-top:30rpx;
        border-radius: 6rpx;
        overflow: hidden;
        .vip_top{
          width:730rpx;
          height:100rpx;
          background:linear-gradient(0deg,rgba(254,115,122,1),rgba(255,167,172,1));
        }
        .vip_bot{
          width:100%;
          display: flex;
          justify-content: space-between;
          .vip_bot_con{
              width:50%;
              border-right:1px solid #E5E5E5;
              height:168rpx;
              margin:22rpx 0;
              display: flex;
              justify-content: space-between;
            .vip_bot_left{
              padding:0 10rpx;
              position: relative;
              width:200rpx;
                .vip_title{
                  font-size: 28rpx;
                  font-weight: bold;
                  margin-bottom:14rpx;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                }
                .vip_intro{
                  font-weight: bold;
                  font-size:24rpx;
                  margin-bottom:10rpx;
                }
                .vip_price_price{
                  overflow: hidden;
                  height:30rpx;
                  display: flex;
                  justify-content: space-between;
                  .pri{
                    float: left;
                    height:30rpx;
                    line-height: 30rpx;
                    overflow: hidden;
                  }
                  .pri_origin{
                    float: left;
                    height:30rpx;
                    margin-left:10rpx;
                    text-decoration: line-through;
                    overflow: hidden;
                    margin-top:5rpx;
                  }
                }
            }
            .vip_bot_right{
              margin-right:10rpx;
              width:120rpx;
              height:168rpx;
              background: #000;
            }
          }
          .vip_bot_con:nth-child(2n){
            border-right:0;
          }
        }
      }
    }
    .all_goods{
      width:98%;  //735 - 14.7 = 720 -340 *2 40
      margin:0 1%;
      overflow: hidden;
      .eve_goods{
        width:340rpx;
        float: left;
        margin-right:40rpx;
        background:#ffffff;
        margin-bottom:14rpx;
        border-radius: 10rpx;
        padding-bottom:24rpx;
        .eve_g_img{
          width:340rpx;
          height:340rpx;
          background:#ff6700;
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
            img{
              width:27rpx;
              height:27rpx;
              display: block;
              float: left;
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
            background:#fff2f6;
            position: relative;
            border: 1px solid rgba(247,9,77,1);
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
</style>
