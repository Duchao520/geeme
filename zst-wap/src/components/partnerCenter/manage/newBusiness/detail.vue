<template>
  <div>
    <!--标题栏-->
    <header class="bg-f" :style="'padding-top:'+status_bar_height+'px'">
      <h3 class="border-buttom">联盟商家详情</h3>
      <span class="ico-retrun fz16" @click="back"><i class="left-arrow"></i></span>
    </header>
    <div :style="'height:'+(status_bar_height+44)+'px'"></div>
    <div class="bg-f mb-5 pd-lr-10">
      <!--商家信息-->
      <div class="store-info relative">
        <div class="img">
          <img :src="shopInfo.supplierLogo" width="100%" height="100%" v-if="shopInfo.supplierLogo"/>
          <img src="@/assets/imgs/partnerCenter/head.png" width="100%" v-else/>
        </div>
        <router-link to="/detail">
          <p class="fz14 p-hide name">{{shopInfo.shopName}}</p>
          <p class="fz12 fc-c">联系人：{{shopInfo.contacts }}</p>
          <div class="address relative">
            <p class="fz12 fc-c txt-hide">{{shopInfo.unitAddress || '&nbsp'}}</p>
            <div class="fz10 fc-c distance">{{shopInfo.distance || 0}}km</div>
          </div>
        </router-link>
        <p class="fz10 phone"><a class="fw-6" :href="'tel:'+shopInfo.contactPhone">{{shopInfo.contactPhone}}</a></p>
      </div>
      <div class="clearfix fz12" style="line-height: 3;">
        <span class="fl-l">是否开通收银功能</span>
        <span class="fl-r fc-yellow" v-if="collectingSilverOpenType == 1">是</span>
        <span class="fl-r fc-yellow" v-else-if="collectingSilverOpenType == 0">否</span>
      </div>
    </div>
    <!--活动信息-->
    <!--<div class="bg-f mb-5 fz14 fc-c pd-lr-10">-->
      <!--<p class="head-tip">活动信息</p>-->
      <!--<p class="ico p-hide" v-if="cardcouponactiv.remark"><img src="@/assets/imgs/partnerCenter/ico-zhe.png"/>{{cardcouponactiv.remark-->
        <!--|| ''}}</p>-->
      <!--<p class="ico p-hide" v-if="integralactive.remark"><img src="@/assets/imgs/partnerCenter/ico-man.png"/>{{integralactive.remark-->
        <!--|| ''}}</p>-->
      <!--<p class="ico p-hide" v-if="lotteryactive.remark"><img src="@/assets/imgs/partnerCenter/ico-chong.png"/>{{lotteryactive.remark-->
        <!--|| ''}}</p>-->
      <!--<p class="fz15 fc-black  pd-tb-5" style="text-align: right;">当前商家{{activeNum || 0}}个活动</p>-->
    <!--</div>-->
    <!--经营状况-->
    <div class="bg-f mb-5 pd-lr-10 fz12">
      <p class="head-tip">经营状况</p>
      <p class="clearfix count">
        <span class="fl-l total">累计会员{{directlyMemberCount+indirectMemberCount}}人</span>
        <router-link :to="{path:'/storeMenberCount',query:{shopId:shopId ,shopName:shopInfo.shopName}}" tag="span"
                     class="fl-r fc-r fz14">查看统计数据
        </router-link>
      </p>
      <div class="flex-box border-buttom">
        <div class="item">
          <p>直属会员</p>
          <p class="fw-6 fz14">{{directlyMemberCount}}</p>
        </div>
        <div class="item">
          <p>间接会员</p>
          <p class="fw-6 fz14">{{indirectMemberCount}}</p>
        </div>
      </div>
      <p class="clearfix count">
        <span class="fl-l total">累计购卡{{CardData.totalCardNum || 0}}张</span>
        <router-link :to="{path :'/storeCardCount' ,query:{shopId:shopId ,shopName:shopInfo.shopName}}" tag="span"
                     class="fl-r fc-r fz14">查看统计数据
        </router-link>
      </p>
      <p class="fc-c" style="line-height: 2.5;">
        其中激活<span class="fc-r">{{CardData.actvaNum || 0}}</span>张，激活比例<span class="fc-r">{{activationRatio}}%</span>
      </p>
      <div class="flex-box">
        <div class="item">
          <p>通用卡</p>
          <p class="fw-6 fz14">{{CardData.publicCardNum || 0}}</p>
        </div>
        <div class="item">
          <p>定制卡</p>
          <p class="fw-6 fz14">{{CardData.privateCardNum || 0}}</p>
        </div>
      </div>
    </div>
    <!--收益状况-->
    <div class="bg-f mb-5 pd-lr-10 fz12">
      <p class="head-tip">收益状况</p>
      <p class="clearfix count">
        <span class="fl-l total">累计收益{{(memberRechargeProfit+shopRechargeProfit+memberEstimateProfit) || 0}}元</span>
        <router-link :to="{path:'/storeProfit',query:{shopId:shopId ,shopName:shopInfo.shopName}}" tag="span"
                     class="fl-r fc-r fz14">查看统计数据
        </router-link>
      </p>
      <div class="flex-box">
        <div class="item">
          <p>会员充值收益</p>
          <p class="fw-6 fz14">{{memberRechargeProfit}}</p>
        </div>
        <div class="item">
          <p>商家充值</p>
          <p class="fw-6 fz14">{{shopRechargeProfit}}</p>
        </div>
        <div class="item">
          <p>会员购物预计收益</p>
          <p class="fw-6 fz14">{{memberEstimateProfit}}</p>
        </div>
      </div>
    </div>
    <v-toast :tip="tip" ref="toast"></v-toast>
  </div>
</template>

<script>
  import {getApplyAgentInfo} from '@/assets/js/getData'

  export default {
    props: ['partnerToken'],
    data() {
      return {
        shopId: this.$route.query.id,
        collectingSilverOpenType: '', //是否开通收银1开 0关
        CardData: {}, //购卡信息
        directlyMemberCount: 0, //直属会员
        indirectMemberCount: 0,//间接会员
        shopRechargeProfit: 0,//商家充值收益
        memberRechargeProfit: 0,//会员充值收益
        memberEstimateProfit: 0,//会员购物预收益
        status_bar_height: this.$route.query.status_bar_height ? Number(this.$route.query.status_bar_height) : 0,
        token: '',
        tip: '',
        integralactive: {}, //商家积分活动（说明字段为 remark）
        cardcouponactiv: {}, //商家卡卷活动（说明字段为remark）
        lotteryactive: {}, //商家抽奖活动（说明字段为 remark）
        shopInfo: {},
        activeNum: 0,//商家活动数量
        coord: this.$route.query.coord || '0,0', //经纬度
        activationRatio: 0,//购卡激活比较
      }
    },
    mounted() {

    },
    created: function () {
      let _self = this;
      _self.$getParterToken().then(res => {
        _self.token = res;
        _self.getStoreInfo();
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
      //获取商家详情信息
      getStoreInfo() {
        let _self = this;
        let _data = {
          token: _self.token,
          shopId: _self.shopId, //店铺ID
          coord: _self.coord, // 经纬度
        };
        _self.$getSignIn(_data).then(sec => {
          getApplyAgentInfo(_data,sec).then(res => {
            let _data = res.data;
            if (_data.state == 1) {
              _self.CardData = _data.data.CardData;
              _self.collectingSilverOpenType = _data.data.collectingSilverOpenType;
              _self.shopInfo = _data.data.shopInfo;
              _self.integralactive = _data.data.integralactive[0];
              _self.cardcouponactiv = _data.data.cardcouponactive[0];
              _self.lotteryactive = _data.data.lotteryactive[0];
              _data.data.CardData.totalCardNum == 0 ? _self.activationRatio = 0 : _self.activationRatio = (( _data.data.CardData.actvaNum / _data.data.CardData.totalCardNum) * 100).toFixed(2);
              _self.activeNum = Number(_data.data.integralactive.length) + Number(_data.data.cardcouponactive.length) + Number(_data.data.lotteryactive.length);
            } else {
              _self.toast(decodeURIComponent(_data.msg));
            }
          }).catch(function (error) {
            _self.toast(error);
          });
        })

      },
    }
  }
</script>

<style scoped>
  @import '../../../../assets/css/partner_base.css';
  .store-info {
    padding: 12px 0 10px 120px;
    min-height: 105px;
  }

  .store-info .img {
    position: absolute;
    width: 105px;
    height: 105px;
    overflow: hidden;
    left: 0;
    top: 10px;
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

  .total {
    line-height: 21px;
  }

  /**/
  .head-tip {
    color: #0D0D0D;
    text-align: center;
    font-size: 14px;
    background: url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAANkAAAAsCAMAAADfP+3uAAAAPFBMVEUAAAD6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vo7s5hqAAAAE3RSTlMAFfDbNCbmpIZYz8KxnJF3ZkYKLvDY/gAAAOFJREFUaN7d2VluAyEQANFiBmbf+/53jRTLiZFs/0+9K0AhaGjDqWUNp5UxnEZSOCWkobXAFkYbSEMbQRpaApjCZwJpaBsAZ/icAFzhc/FrDpuZhyFsBpCGdvJwNSFzgTO0mac9XHaecrhk/rhCa/i3hMkC0tB2kIaWwRlaA9LQFl4d4XHwqoRHodKFRUetD4sepKEdIA2tUPEMwVuoaX6bViqiIfhIRTQET+AMrcpMNZsbAJTnfgFAeA3peSfd/+7YJd7Kd39/NpkP8r1Xrct8lO7cWp/4pgzTHfdkMw2F2g8ydZzyiGwK/AAAAABJRU5ErkJggg==) no-repeat center;
    background-size: auto 100%;
    line-height: 22px;
  }

  .ico img {
    width: 16px;
    vertical-align: middle;
    margin: 0 11px 0 15px;
    line-height: 32px;
  }

  .total {
    display: block;
    background: -webkit-gradient(linear, left top, right top, from(#f81854), to(#ff9540));
    background: linear-gradient(to right, #f81854, #ff9540);
    padding: 0 10px;
    color: #fff;
    line-height: 25px;
    border-radius: 5px;
    border-bottom-left-radius: 0;
  }

  .count {
    padding: 16px 0 0;
  }

  .flex-box {
    padding: 20px 0;
  }
</style>
