<template>
    <div class="page">
        <div class="page_top">
           <div class="eve_page">
              <div class="eve_inner" v-for="(item,index) in dataList" @click="priceSequen(item,index)" :class="index == currentId?'colorInn':''">
                <span>{{item.textInn}}</span>
                <i class="iconfont" :class="index == currentId && !showIt? 'icon-paixu-shengxu':'icon-paixu-jiangxu'">
                </i>
              </div>

              <div class="eve_inner" @click="chageSequen"><i class="iconfont icon-liebiao"></i></div>
           </div>
        </div>

        <div class="pa_eve" v-for="item in shopData" @click="godetail({id:item.id,dis:item.distanse})" v-if="stylefir">
        <div class="pa_eve_le">
          <img :src="item.cover" alt="">
        </div>
        <div class="pa_eve_ri">
          <div class="par_ev_top">
            <img src="../../static/img/zstLogo.png" alt="">
            {{item.goodsName}}
          </div>
          <div class="par_price">
            供应商：{{item.shopName}}
          </div>
          <div class="flex_box">
            <div class="disc_par">
              <div class="disc_le" v-if="item.isMemberArea ==1">
                VIP会员特卖
              </div>
              <div class="disc_ri">
                话呗抵扣{{item.yuanjia - item.salePriceMin}}元
              </div>
            </div>
          </div>


          <div class="eve_money">
            <div class="mon_footer">
              <span style="color:#F7094D;font-size: 36rpx; margin-right:20rpx;">￥{{item.salePriceMin}}</span>
              <span style="text-decoration:line-through;color:#9A9DA5;font-size: 22rpx;">原价￥{{item.yuanjia}}</span>
            </div>
          </div>


          <div class="par_ev_bot">
            <div style="margin-right:20rpx;" v-if="item.isFreefreight ==1">包邮</div>
            <div>{{item.commentCount}}条评论</div>
            <div>{{item.goodCommentRate}}%好评</div>
          </div>
        </div>
      </div>

        <div class="all_goods" v-if="!stylefir">
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

            <div class="par_ev_bot" style="margin:0 20rpx;">
              <div style="margin-right:20rpx;" v-if="item.isFreefreight ==1">包邮</div>
              <div>{{item.commentCount}}条评论</div>
              <div>{{item.goodCommentRate}}%好评</div>
            </div>

            <div class="par_price" style="margin:0 20rpx;margin-bottom:20rpx;">
              供应商：{{item.shopName}}
            </div>

            <div class="eve_money">
              <div class="mon_footer">
                <span style="color:#F7094D;font-size: 36rpx;">￥{{item.salePriceMin}}</span>
                <span style="text-decoration:line-through;color:#9A9DA5;font-size: 22rpx;">￥{{item.yuanjia}}</span>
              </div>
            </div>

            <div class="flex_box">
              <div class="disc_par">
              <span class="disc_le" v-if="item.isMemberArea ==1">
                VIP会员特卖
              </span>
                <span class="disc_ri">
                话呗抵扣{{item.yuanjia - item.salePriceMin}}元
              </span>
              </div>
            </div>

          </div>
        </div>
      </div>
      <div class="no_more" v-if="noMore">{{notice_mes}}</div>
    </div>
</template>

<script>
    import { getSignIn , getQuery} from '@/common/js/comm';

    export default {
      name: "index",
      data() {
        return {
          showIt: true,
          innerColor: false,
          dataList: [
            {textInn: '价格'},
            {textInn: '销量'},
            {textInn: '话呗抵扣'},
          ],
          currentId: 0,
          par: {
            sort: 0,
            sortby: 'desc',
            pageNum: 1,
            pageSize: 20,
            // keyword: '',
            brandId: '',       //商标id
            // typeIdPath: '',   //类目id
            // shopId: '',      //商家id
            // isMemberArea: '',
            token: this.$store.state.token,
            isShowInCallfeeArea: 1
          },
          shopData: [],
          notice_mes:'',
          noMore:false,
          stylefir:true,
        }
      },
      mounted() {
        let par = getQuery();
        wx.setNavigationBarTitle({
          title: `${par.brandName}`
        })
        this.par.brandId = par.id;
        this.getList(this.par);
        console.log(par.brandName);
        console.log(par.id);
      },
      methods: {
        chageSequen(){
          this.stylefir = ! this.stylefir;
        },
        priceSequen(par, index) {
          console.log(par, index);
          this.innerColor = true;
          this.currentId = index;
          /*
            * 默认为升序
            * **/

            if (this.showIt == true) {
              this.showIt = false;    //降序
              if(par.textInn == '价格') {
                this.par.sort = 0;
              }else if(par.textInn == '销量'){
                this.par.sort = 5;
              }else if(par.textInn == '花呗抵扣'){
                this.par.sort = 4;
              }
              this.par.sortby = 'asc';
              this.par.pageNum =1;
              this.shopData = [];
              this.getList(this.par);
            } else {
              this.showIt = true;    //降序
              if(par.textInn == '价格') {
                this.par.sort = 0;
              }else if(par.textInn == '销量'){
                this.par.sort = 5;
              }else if(par.textInn == '花呗抵扣'){
                this.par.sort = 4;
              }
              this.par.sortby = 'desc';
              this.par.pageNum =1;
              this.shopData = [];
              this.getList(this.par);
            }

        },
        getList(par) {
          var _this = this;
          getSignIn(par).then(sec => {
            _this.$http.getShopP(par, sec).then(res => {
              if (res.state == 1) {
                if (res.data.length != 0) {
                  for (let i = 0; i < res.data.length; i++) {
                    res.data[i].yuanjia = res.data[i].originalPriceRange.split("-")[0];
                  }
                  _this.shopData = _this.shopData.concat(res.data);
                } else {
                  this.noMore = true;
                  this.notice_mes = '没有更多数据了~';
                  return 1;
                }
              } else if (res.state == 10000) {
                const url = `../../pages/loginpage/main`;
                wx.redirectTo({url})
              }
            })
          })


        },
        godetail(par){
          const url = `/pages/shopdetail/main?id=${par.id}&distanse=${par.dis}`
          wx.navigateTo({ url })
        },
      },
      async onReachBottom() {
        console.log(1111);
        // 到这底部在这里需要做什么事情
        this.par.pageNum ++;
        this.noMore = true;
        this.notice_mes = '加载中...';
        this.getList(this.par);
        if(this.notice_mes == '没有多数据了~'){
          return false;
        }
      }
    }


</script>

<style lang="scss" scoped>
.page_top{
  width:100%;
  height:72rpx;
  border-bottom:2rpx solid #e5e5e5;
  .eve_page{
    width:710rpx;
    margin:0 20rpx;
    display: flex;
    justify-content: space-between;
    .colorInn{
      color:#F7094D;
    }
    .eve_inner{
       font-size: 30rpx;
      span{
        float: left;
        font-size: 30rpx;
        margin-right:10rpx;
      }
      i{
        float: left;
      }
    }
  }

}

.pa_eve{
  width:710rpx;
  margin:0 20rpx;
  overflow: hidden;
  border-bottom:2rpx solid #E5E5E5;
  padding:20rpx 0;
  .pa_eve_le{
    width:200rpx;
    height:200rpx;
    background:#daf3ff;
    float: left;
    margin-right:20rpx;
    img{
      width:100%;
      height:100%;
      display: block;
    }
  }
  .pa_eve_ri{
    float: left;
    width:490rpx;
    .par_ev_top{
      font-size: 30rpx;
      line-height: 40rpx;
      width:490rpx;
      img{
        width:25rpx;
        height:25rpx;
        display: block;
        float: left;
        margin-top:10rpx;
        margin-right:10rpx;
      }

    }

    .eve_money{
      height:29rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom:18rpx;
      .mon_footer{
        overflow: hidden;
      }
      .mon_mon{
        font-size: 24rpx;
        color:#9A9DA5;
      }
    }
    .par_ev_mid{
      width:100%;
      height:30rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top:20rpx;
      margin-bottom:36rpx;
    }
  }
}
.par_price{
  font-size: 24rpx;
  color:#9A9DA5;
  margin-top:12rpx;
}
.par_ev_bot{
  display:flex;
  justify-content: space-between;
  div{
    float: left;
    font-size: 20rpx;
    color:#9A9DA5;
  }
}

.disc_par{
  /*max-width:290rpx;*/
  height:30rpx;
  border:2rpx solid #FFA61A;
  border-radius: 6rpx;
  display: flex;
  justify-content: space-between;
  margin-top:28rpx;
  margin-bottom:10rpx;
  overflow: hidden;
  .disc_le{
    font-size: 18rpx;
    color:#fff;
    background:#FFA61A;
    text-align: center;
    line-height: 30rpx;
    padding:0 10rpx;
  }
  .disc_ri{
    font-size: 20rpx;
    color:#FFA61A;
    text-align: center;
    line-height: 30rpx;
    padding:0 10rpx;
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
.no_more{
   width:100%;
   height:90rpx;
   text-align: center;
   line-height: 90rpx;
   background:#f2f2f2;
   /*padding-bottom:160rpx;*/
 }
</style>
