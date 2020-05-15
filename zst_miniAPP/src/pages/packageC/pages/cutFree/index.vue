<template>
  <div class="bargain">
    <poster :detail="dataDetail" ref="poster"></poster>
    <v-share ref="vShare"
             @createPoster="createPoster"></v-share>
    <div class="scroll" ref="scroll">
      <div class="scroll-container">
        <div class="bg">
          <div class="new_top">
            <div class="swiper_le">
              <div class='view_notice_contain'>
                <!--<img src="" alt="">-->
                <swiper class="swiper_container" vertical="true" autoplay="true" circular="true" interval="5000">
                  <block v-for="(item,index) in successMelunbo" :key="index">
                    <swiper-item>
                      <div class="swiper_item">
                        <img :src="item.ico" alt="">
                        <div class="txt-ellipsis" style="width: 650rpx">{{item.remark}}</div>
                      </div>
                    </swiper-item>
                  </block>
                </swiper>
              </div>
            </div>
          </div>
          <div class="bargin-goods">
            <div class="commander_goods" v-if="showSelf && bargainTasksId">
              <div class="comman_le">
                <img :src="dataDetail.ico" alt="">
              </div>
              <div class="comman_ri">
                <div class="comman_ri_top">
                  你的好友【{{dataDetail.nick}}】
                </div>
                <div class="comman_ri_bot">
                  {{dataDetail.openUserSlogan}}
                </div>
              </div>
            </div>

            <div class="all_con">
              <div class="goods flex_box justify_space_between"
                   style="margin-bottom: 16rpx" @click="goDetil(dataDetail)">
                <img :src="bargainImg" alt="" class="thumb">
                <div class="detail flex_box flex_column">
                  <p class="txt-ellipsis fz-30 font-weight">{{title}}</p>
                  <p class="txt-ellipsis fz-24 fc-0D0D0F" style="margin-bottom: 8rpx">{{biBargain.copywritingTitle}}</p>
                  <div class="flex_box justify_space_between align_center"
                       style="margin-bottom: 30rpx">
                    <div style="width: 320rpx">
                      <v-progress :rate="topRateMes"
                                  :height="'15'"
                                  :progressBg="'#4045D5'"></v-progress>
                    </div>
                    <p class="fc-8D8E98" style="font-size: 20rpx">已砍{{useNum}}/{{shareNum}}</p>
                  </div>
                  <div class="flex_box justify_space_between" style="align-items: flex-end">
                    <p class="flex_box" style="align-items: flex-end" v-if="prentPrice != 0">
                        <span class="iconfont icon-renminbi fz-38 fc-F7094D"
                              style="margin-right: 12rpx">{{prentPrice}}</span>
                      <span class="fz-30 fc-8D8E98"
                            style="text-decoration: line-through">￥{{biBargain.price}}</span>
                    </p>
                    <p class="fz-38 fc-F7094D" v-else>砍价免费拿</p>
                    <p class="fz-24 fc-8D8E98">已有{{biBargain.helperNum}}人参与</p>
                  </div>
                </div>
              </div>
              <div class="box_padding" style="background: #F4F5F6;padding: 53rpx 25rpx 37rpx;position: relative">
                <i class="slogan fz-24 fc-ffffff">活动描述</i>
                <p class="descFlag fc-8D8E98 fz-24 flex_box align_center"
                   @click="descFlag = !descFlag">{{descFlag ? '收起' : '展开'}}
                  <i class="iconfont fz-30"
                     :class="{'icon-shouqitianchong': descFlag,'icon-shouqitianchong-copy': !descFlag}"></i>
                </p>
                <span class="fz-28 fc-0D0D0F"
                      :class="{'txt-overflow': !descFlag}">{{biBargain.description}}</span>
              </div>

              <!--团长自己进来活动进行中-->
              <div v-if="bargainTasksId">
                <p class="fz-38 text-center font-weight"
                   style="margin-bottom: 18rpx" v-if="btn_type == 2 || btn_type == 1">
                  已砍<span class="fc-F7094D">{{dataDetail.helpedPrice}}</span>元,还差<span
                  class="fc-F7094D">{{reMaining}}</span>元
                </p>
                <!--团长自己进来活动砍价成功-->
                <p class="fz-38 text-center font-weight"
                   style="margin-bottom: 18rpx" v-if="btn_type == 3 || btn_type == 5">
                  人多“利”量大，成功砍到底价
                </p>
                <!--团长自己进来任务已结束3-->
                <p class="fz-38 text-center font-weight"
                   style="margin-bottom: 18rpx" v-if="btn_type == 4">
                  少侠晚来一步，该活动已结束
                </p>

                <v-progress :rate="botRateMes"
                            :height="15"
                            :progressBg="'#F7094D'"></v-progress>
              </div>

              <button class="fz-34 fc-ffffff"
                      :animation="btnAnimationData"
                      style="margin-top: 52rpx;line-height: 72rpx;"
                      @click="btnEvent(btn_type)">{{btns[btn_type].remark}}
              </button>
              <div v-if="showSelf"
                   style="width:100%;text-align: center;color:#8D8E98;font-size:24rpx;padding-top:15rpx;">砍价成功，可在 <span
                style="color:#F7094D;">【首页】-【卡友帮】</span> 查看
              </div>
              <div class="line" style="width: 100%;height: 1rpx;background: #EEEEEE;margin-bottom: 20rpx"></div>
              <div class="flex_box justify_space_between align_center">
                <div class="flex_box align_center">
                  <p class="fz-24 font-weight text-center"
                     style="width:127rpx;height:50rpx;line-height:50rpx;background:linear-gradient(90deg,rgba(251,217,186,1),rgba(202,142,98,1));border-radius:10rpx 10rpx 0 0;">活动规则</p>
                  <p class="slogan_bg fc-F7094D fz-24">卡友帮低折扣砍价，好礼免费拿</p>
                </div>
                <p class="fz-24 fc-8D8E98 flex_box align_center" @click="ruleSlide">{{ruleFlag ? '收起' : '展开'}}
                  <i class="iconfont"
                     :class="{'icon-shouqitianchong': ruleFlag,'icon-shouqitianchong-copy': !ruleFlag}"></i>
                </p>
              </div>
              <div style="overflow: hidden">
                <div :animation="animationData" v-if="ruleFlag" style="background:rgba(255,247,233,1);border-radius:10rpx;">
                  <p class="rule_title flex_box align_center fz-24 font-weight">获得免费机会</p>
                  <p class="fc-8D8E98 fz-24 box_padding" style="padding-left: 20rpx">开团通过微信邀请好友进行砍价，砍成即可免费获得活动产品。</p>
                  <p class="rule_title flex_box align_center fz-24 font-weight">获得全国打折卡</p>
                  <p class="fc-8D8E98 fz-24 box_padding" style="padding-left: 20rpx">
                    帮好友砍价即可获得全国打折卡，通过全国打折卡即可在助商通联盟商家支持打折商家享受折扣；使用助商通APP或小程序付款或扫码助商通收款码即可自动核算优惠金额。
                  </p>
                  <p class="rule_title flex_box align_center fz-24 font-weight">获得现金优惠券</p>
                  <p class="fc-8D8E98 fz-24 box_padding" style="padding-left: 20rpx">
                    帮好友砍价即可获得该门店的现金抵扣券，使用现金抵扣券到活动商家消费即可抵扣现金，优惠券面额根据活动有商家进行设置。
                  </p>
                  <p class="fc-8D8E98 fz-24 box_padding" style="padding-left: 20rpx">
                    了解更多可在各大应用市场搜索【助商通】.更多会员优惠福利惊喜等着您！
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="bargin-list">
            <div class="menu flex_box">
              <div class="fz-36 btn"
                      style="border-radius:0;border-top-right-radius:0;border-bottom-right-radius:0;line-height: 100rpx"
                      :class="{active: type == 1}" v-if="yesBtn==1 && bargainTasksId"
                      @click="type = 1">卡友帮{{dataDetail.helperNum + '/' + dataDetail.taskNeedNum}}
              </div>
              <div class="fz-36 btn"
                      style="border-radius:0;border-top-right-radius:0;border-bottom-right-radius:0;line-height: 100rpx"
                      :class="{active: type == 1}" v-if="yesBtn==0 && bargainTasksId">卡友帮{{dataDetail.helperNum + '/' + dataDetail.taskNeedNum}}
              </div>
              <div class="fz-36 btn"
                      style="border-radius:0;border-top-left-radius:0;border-bottom-left-radius:0;line-height: 100rpx"
                      :class="{active: type == 2,maxWidth: type == 2 && !bargainTasksId}"
                      @click="type = 2" v-if="noBtn==1">{{useNum}}人砍价成功
              </div>
              <div class="fz-36 btn"
                      style="border-radius:0;border-top-left-radius:0;border-bottom-left-radius:0;line-height: 100rpx"
                      :class="{active: type == 2,maxWidth: type == 2 && !bargainTasksId}" v-if="noBtn ==0">{{useNum}}人砍价成功
              </div>
            </div>
            <div style="height: 100rpx"></div>
            <scroll-view scroll-y class="scroll" ref="myScroll" style="padding-bottom:40px;" @scrolltolower="helpLower">
              <ul class="scroll-container" style="padding-bottom:40rpx;">
                <div v-for="item in helpMe" v-if="type==1" :key="index">
                  <li class="flex_box justify_space_between align_center"
                      style="margin-bottom: 45rpx">
                    <!--                  <div class="flex_box" style="align-items: center">-->
                    <div class="flex_box">
                      <img :src="item.ico" alt="" class="ico">
                      <div class="flex_box flex_column justify_space_between"
                           style="width: 360rpx">
                        <p class="fz-34 fc-0D0D0F txt-ellipsis">{{item.nick}}</p>
                        <p class="fz-24 fc-8D8E98">{{item.msg}}</p>
                      </div>
                    </div>
                    <p class="fz-34 fc-0D0D0F flex_box align_center"><img style="display: block;width: 38rpx;height: 38rpx;" src="../../static/img/icon_cut.png" alt="">砍掉<span class="fc-F7094D">{{item.helpPrice}}</span>元</p>
                  </li>
                </div>

                <div v-if="type==2" v-for="(itm,ind) in successMe">
                  <li class="flex_box justify_space_between align_center"
                      style="margin-bottom: 46rpx" v-if="successMe.length!=0">
                    <div class="flex_box">
                      <img :src="itm.ico" alt="" class="ico">
                      <div class="flex_box flex_column justify_space_between"
                           style="width: 360rpx">
                        <p class="fz-34 fc-0D0D0F txt-ellipsis">{{itm.nick}}</p>
                        <p class="fz-24 fc-8D8E98 txt-ellipsis">{{itm.endTime}}</p>
                      </div>
                    </div>
                    <p class="fz-34 fc-0D0D0F">砍价成功</p>
                  </li>
                </div>
                <div v-if="showNoData==1"
                     style="display: flex;flex-direction: column;align-items: center;padding:180rpx 0;">
                  <img src="/static/img/common/empty.png" style="width:160rpx;height:160rpx;margin-bottom:10rpx;"
                       alt="">
                  <div>暂无数据</div>
                </div>
              </ul>
            </scroll-view>
          </div>
        </div>

        <div class="re-store">
          <img src="../../static/img/shopPage.png" alt="" class="board">
          <div class="list-item flex_box" v-for="(iem,inx) in dataList" :key="inx" @click="gostoreDetail(iem)">
            <img :src="iem.storeLogo" alt="" class="thumb" style="margin-right: 12rpx">
            <div class="box_padding flex_box flex_column justify_space_between">
              <p class="txt-overflow fz-28">{{iem.storeName}}</p>
              <p class="flex_box justify_space_between align_center fz-24 fc-8D8E98">
                <span class="iconfont icon-dizhi txt-ellipsis fz-24" style="display: block;width: 410rpx">{{iem.address}}</span>
                <span class="fz-24">{{iem.distance}}km</span>
              </p>
              <p class="fz-30 fc-F7094D">到店消费最低享{{iem.shareCardDiscount}}折</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--弹出层-->
    <div class="toast-gather" v-if="toast_type1">
      <div class="toast-container">
        <div style="position: relative">
          <img src="/static/img/close.png" alt=""
               class="close"
               @click="close">
          <section class="box_padding toast-common" style="padding-top: 100rpx;background:#fff;" v-if="showHead == 1">
            <img src="../../static/img/toast_head.png" alt="" class="head">
            <main class="box_padding" style="padding: 0 50rpx 52rpx" v-if="toast_type1 == 2">
              <p class="fz-36 font-weight text-center"
                 style="margin-bottom: 65rpx">
                少侠好刀法！砍掉<span class="fc-F7094D">{{currPrice}}</span>元
              </p>
              <p class="fz-30 text-center" style="margin-bottom: 38rpx">
                已砍<span class="fc-F7094D">{{dataDetail.helpedPrice}}</span>元,还差<span class="fc-F7094D">{{reMaining}}</span>元
              </p>
              <div style="width: 500rpx;margin: 0 auto 70rpx;">
                <v-progress :rate="botRateMes"
                            :height="'15'"
                            :progressBg="'#F7094D'"></v-progress>
              </div>
              <p class="fz-36 text-center font-weight">邀请好友，可多砍一刀</p>
              <button class="fz-34 fc-ffffff" @click="btnEvent(2)">喊好友砍一刀</button>
            </main>
            <!--砍价砍到底价-->
            <main class="box_padding" style="padding: 0 50rpx 52rpx" v-if="toast_type1 == 3">
              <p class="fz-36 font-weight text-center"
                 style="margin-bottom: 45rpx">恭喜你成功砍到了底价</p>
              <button class="fz-34 fc-ffffff">查看订单详情</button>
            </main>
            <!--好友砍价成功 ok-->
            <main class="box_padding" style="padding: 0 50rpx 30rpx" v-if="toast_type1 == 5 || toast_type1 == 8">
              <p class="fz-36 font-weight text-center"
                 style="margin-bottom: 45rpx">
                少侠好刀法！帮好友砍掉<span class="fc-F7094D">{{currPrice}}</span>元
              </p>
              <button class="fz-34 fc-ffffff" @click="btnEvent(0)">我也要开团</button>
            </main>
            <!--好友进来如果砍价已经成功-->
            <main class="box_padding" style="padding: 0 50rpx 52rpx" v-if="toast_type1 == 6">
              <p class="fz-36 font-weight text-center"
                 style="margin-bottom: 45rpx">
                你的好友砍价成功，0元获得该奖品，你也试一试吧！
              </p>
              <button class="fz-34
               fc-ffffff" @click="btnEvent(0)">我也要开团
              </button>
            </main>
            <!--砍价失败-->
            <main class="box_padding" style="padding: 0 50rpx 52rpx" v-if="toast_type1 == 7">
              <p class="fz-36 font-weight text-center"
                 style="margin-bottom: 45rpx">
                砍价活动已结束
              </p>
              <button class="fz-34 fc-ffffff" @click="close">知道了</button>
            </main>
          </section>
          <!--砍价好友进来本次活动结束多少-->
          <!--砍价好友进来砍价成功推送优惠券 1具备  0不具备-->
          <section class="coupon box_padding" style="padding-top: 40rpx" v-if="toast_type1 == 8 && hasCoupon == 1">
            <p class="fz-36 fc-ffffff font-weight text-center" style="margin-bottom: 60rpx">{{coupon.couponType == 1 ? '领取满减券' : '领取无门槛优惠券'}}</p>
            <p class="fc-F7094D fz-48 font-weight text-center" style="margin-bottom: 8rpx">{{couponMoney}}</p>
            <p class="fc-0D0D0F fz-24 text-center" >适用门店：{{dataDetail.storeName}}</p>
            <p class="fc-8D8E98 fz-24 text-center" style="margin-bottom: 60rpx">有效期至{{coupon.remark ? coupon.remark : ''}}</p>
            <div class="flex_box fc-ffffff box_padding align_center justify_space_between"
                 style="padding: 0 44rpx 0 84rpx;margin-bottom: 55rpx">
              <p class="fz-24 txt-overflow" style="width: 370rpx;">{{distance ? distance + 'km' : ''}} {{dataDetail.address}}</p>
              <p class="fz-24" @click="navStore">去店里</p>
            </div>
            <div class="btn fc-ffffff fz-36 text-center"
                 style="margin-bottom: 6rpx;border: 8rpx solid #F7094D;background:linear-gradient(0deg,rgba(247,9,77,1),rgba(252,89,137,1));box-shadow:0 3rpx 19rpx 2rpx rgba(255, 74, 0, 0.35);"
                 @click="lookCoupon">查看优惠券</div>
            <p class="fz-24 fc-8D8E98 text-center" style="margin-bottom: 12rpx">可在<span class="fc-F7094D">【首页优惠券】</span>板块或<span>【砍价记录】</span>中查看</p>
            <div class="btn fc-ffffff fz-36 text-center"
                 style="margin-bottom: 6rpx;border:8rpx solid rgba(76,93,237,1);background:linear-gradient(0deg,rgba(53,47,192,1),rgba(79,98,242,1));"
                 @click="btnEvent(4)">查看更多砍价活动</div>
          </section>

          <!--是否推荐卡主分享卡-->
          <section class="box_padding shareCard" v-if="showActive == 1">
            <p class="fz-36 font-weight text-center"
               style="margin-bottom: 50rpx">
              商家送您一张<span class="fc-F7094D">{{mainCardDiscount}}折</span>共享卡
            </p>
            <p class="fz-30 text-center"
               style="margin-bottom: 16rpx">
              可在<span class="fc-F7094D">卡主-我的会员卡-收藏的卡</span>中查看
            </p>
            <button class="fz-34 fc-ffffff"
                    style="margin-bottom: 12rpx" @click="goLookShare">查看共享卡
            </button>
            <p class="fz-24 text-center">{{biSvipcardshare.shopName}}</p>
          </section>
        </div>
      </div>
    </div>

    <div class="toast-gather" v-if="phoneFlag">
      <div class="phone-toast box_padding" style="padding-top: 79rpx;">
        <img src="https://zhushangtong.oss-cn-hangzhou.aliyuncs.com/guide/2019/9/26/445307ba0e30f1c9aaf2c1712d01c808.png " alt="" class="welcome">
        <img src="/static/img/close.png" alt=""
             class="close" @click="phoneFlag = false">
        <p class="text-center fz-34" style="margin-bottom: 33rpx;">助商通小程序</p>
        <img src="https://zhushangtong.oss-cn-hangzhou.aliyuncs.com/guide/2019/9/26/c0263f9bd04a7936e0b69f262eae7562.png " alt="" class="cat">
        <div class="flex_box justify_space_between">
          <button class="bg-FEB623 fz-36 fc-ffffff" style="display: block;width: 245rpx;height: 80rpx;border-radius: 10rpx;" @click="openBarginTasks();phoneFlag = false">暂不绑定</button>
          <button class="bg-F7094D fz-36 fc-ffffff" style="display: block;width: 245rpx;height: 80rpx;border-radius: 10rpx;" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">绑定手机</button>
        </div>
      </div>
    </div>

    <div class="back_index" @click="backIndex">
      <img src="/static/img/common/back_index.png" alt="">
    </div>
  </div>
</template>

<script>
  import vProgress from './v-progress'
  import { getSignIn , getQuery , toDate ,calDistance} from '@/common/js/comm';
  import Tips from '@/common/js/tips'
  import floatTo from '@/common/js/floatTo'
  import round from '@/common/js/round'
  import poster from '../cutFree/components/poster'
  import vShare from '../cutFree/components/vShare'
  import { mapMutations } from 'vuex'
  import { USERPHONE }  from '../../../../store/mutation-types'
  export default {
    name: "bargain",
    components:{
      vProgress,
      poster,
      vShare
    },
    data() {
      return {
        scroll: '',
        toast_type1: '',
        toast_type2: '1',
        btn_type:0,  //0开团 1砍价 2邀请好友 3核销 4查看更多 5好友查看砍价成功
        btns: [
          {remark: '我要发起砍价'},
          {remark: '帮他砍一刀'},
          {remark: '喊好友砍一刀'},
          {remark: '查看兑换码'},
          {remark: '查看更多砍价活动'},
          {remark: '查看更多砍价活动'}
        ],
        type: 1,
        bargainId:'',
        bargainTasksId:'',
        dataDetail:'',
        distance: '',
        fromPage:'',
        storeId:'',
        shareNum:'',  //总份数
        surplusShareNum:'', //还剩多少
        useNum:'',    //砍成多少
        biBargain:{},
        prentPrice:'', //物品折扣后的价格
        reMaining:'',
        topRateMes:'',
        botRateMes:'',
        helpMe:[],
        successMe:[],
        dataList:[],
        showHead:'', //是否显示顶部信息
        showActive:0,
        openDetail:'',
        currentRate:'',
        currPrice:'',
        helpedPrice:'',
        bargainImg:'',
        status:'',
        mainCardDiscount:'', //卡的折扣率
        biSvipcardshare:'',  //分享卡的数据

        coupon: '',
        couponMoney:'',   //优惠券的面额
        id:'',   //优惠券id
        couponNum:'', //优惠券活动

        showNoData:0,
        pageNum:1,  //帮助我砍价的人的分页码
        sucNum:1,  //砍价成功的分页码
        shopNum:1,
        hasCoupon:0,  //是否具备优惠券推送 1 局别  0不具备

        yesBtn:1,
        noBtn:1,
        taskPrice:'',
        helperNum:'',

        biStaffUserName:'',
        outUserId:'',
        innerUserId:'',
        title:'',
        isBargain: '', //是否已砍价

        activityShareNum:'',
        successMelunbo:'',
        noticeList: [],
        out_btn_type:'',
        showSelf:true,
        ruleFlag: false,
        descFlag: false,
        animationData: '',
        btnAnimationData: '',
        phoneFlag: false
      }
    },
    mounted() {
      //如果是从参加开团的页面进来  那么先调开团 然后调明细
        var par = getQuery();
      let token = this.$store.state.token;
        this.innerUserId = this.$store.state.userLiId;
        this.bargainId = par.bargainId;
        this.bargainTasksId = par.bargainTasksId ? par.bargainTasksId:'';
        this.storeId = par.storeId;
        this.fromPage = par.fromPage ? par.fromPage : '';
        this.status = par.status ? par.status : '';
        this.outUserId = par.userId ? par.userId :'';
        this.biStaffUserName = par.biStaffUserName ? par.biStaffUserName :'';
        this.type = this.bargainTasksId ? 1 : 2;
        this.btnScale();
      if(token) {
        this.getTasksing();
        this.getBargain();
        this.lookSuclunbo();
      }else{
        var _this = this;
        const url = `/pages/loginpage/main?status=${_this.status}&bargainId=${_this.bargainId}&bargainTasksId=${_this.bargainTasksId}&storeId=${_this.storeId}&userId=${_this.outUserId}&biStaffUserName=${_this.biStaffUserName}`;
        wx.navigateTo({url})
      }
    },
    watch: {
      type(){

          if(this.type == 1){
            if(this.bargainTasksId){
              this.pageNum = 1;
              this.helpMe = [];
              this.lookHelper();
            }
          }else{
            this.sucNum = 1;
            this.lookSucMes(function () {
              this.successMe = [];
            }.bind(this));
          }
      },

      bargainTasksId(){
        if(this.bargainTasksId){
          if(this.type == 1){
            this.pageNum = 1;
            this.helpMe = [];
            this.lookHelper();
          }else{
            this.sucNum = 1;
            this.successMe = [];
            this.lookSucMes(function () {
              this.successMe = [];
            }.bind(this));
          }
        }
      }
    },
    methods: {
      ...mapMutations({
        userPhone:'USERPHONE',
      }),
      close(){
        this.showHead = 0;
        this.toast_type1 = '';
      },
      getPhoneNumber(e){
        var _self = this;
        console.log(e);
        var _data = {
          iv: e.mp.detail.iv,
          encryptedData: e.mp.detail.encryptedData,
          sessionKey: _self.$store.state.sessionkey
        }
        getSignIn(_data).then(sec => {
          _self.$http.decodeWxData(_data,sec).then(res => {
            if(res.state == 1){
              var userPhone = {
                token: _self.$store.state.token,
                phone: res.data.phoneNumber
              }
              getSignIn(userPhone).then(sec_1 => {
                _self.$http.bindPhone(userPhone,sec_1).then(result => {
                  if(result.state == 1){
                    Tips.toast('绑定成功','none');
                    _self.userPhone(userPhone.phone);
                    _self.phoneFlag = false;
                  }else{
                    Tips.toast(decodeURIComponent(result.msg),'none')
                  }
                })
              })
            }else{
              Tips.toast(decodeURIComponent(res.msg),'none')
            }
          })
        })

      },
      backIndex(){
        wx.switchTab({
          url:'../../../../pages/index/main'
        })
      },
      //获取详情
      //查看优惠券
      lookCoupon(){
         wx.navigateTo({
           url:'/pages/packageA/pages/couponList/main'
         })
      },
      // 戳我参与砍价
      goDetail(){
        var _this = this;
        wx.navigateTo({
          url:`/pages/packageC/pages/goodsDetail/main?bargainId=${_this.bargainId}&bargainTasksId=${_this.bargainTasksId}`
        })
      },
      btnEvent(index){
        var _self = this;
        _self.close();
        switch (index) {
          case 0:
            if(!this.$store.state.userPhone){
              _self.phoneFlag = true;
            }else{
              _self.openBarginTasks();
            }
            break;
          case 1:
            this.bargainTaskslog();
            this.showSelf = true;
            break;
          case 2:
            this.shareShow();
            break;
          case 3:
            this.getCode();
            break;
          case 4:
            this.gocanJoin();
            break;
          case 5:
            this.gocanJoin();
            break;
        }
      },
      goDetil(){
        var _this = this;
        wx.navigateTo({
          url:`/pages/packageC/pages/goodsDetail/main?bargainId=${_this.bargainId}&bargainTasksId=${_this.bargainTasksId}&frompage=cutFree`
        })
      },
      // pages/packageC/pages/canJoin/main
      canJoin(){
        wx.navigateTo({
          url:'/pages/packageC/pages/canJoin/main'
        })
      },
      navStore() {
        var _this = this;
        wx.getLocation({//获取当前经纬度
          type: 'wgs84', //返回可以用于wx.openLocation的经纬度，官方提示bug: iOS 6.3.30 type 参数不生效，只会返回 wgs84 类型的坐标信息
          success: function (res) {
            wx.openLocation({//​使用微信内置地图查看位置。
              latitude: Number(_this.dataDetail.latitude),//要去的纬度-地址
              longitude: Number(_this.dataDetail.longitude),//要去的经度-地址
              name: _this.dataDetail.address,
              address: _this.dataDetail.address
            })
          }
        })
      },
      getTasksing(){
        var _data ={
          token:this.$store.state.token,
          bargainTasksId:this.bargainTasksId,
          bargainId:this.bargainId,
        }
        var _this = this;
        getSignIn(_data).then(sec=>{
          _this.$http.barDetail(_data,sec).then(res=>{
            if(res.state ==1) {
              try {
                _this.dataDetail = res.data;
                _this.biBargain = res.data.biBargain;
                _this.shareNum = _this.biBargain.shareNum; //总份数
                _this.surplusShareNum = _this.biBargain.surplusShareNum; //剩余多少份
                _this.useNum = floatTo.subtract(_this.shareNum, _this.surplusShareNum);  //已领多少份
                _this.topRateMes = `${(floatTo.divide(Number(_this.useNum), _this.shareNum)) * 100}%`;
                _this.title = _this.biBargain.title;
                _this.discount = floatTo.divide(Number(_this.biBargain.discount), 10);
                _this.prentPrice = (floatTo.multiply(_this.biBargain.price, _this.discount)).toFixed(2);  // 现价
                _this.biStaffUserName = res.data.biStaffUserName;
                var taskPrice = _this.dataDetail.taskPrice ? _this.dataDetail.taskPrice : 0;   //需砍金额
                var helpedPrice = _this.dataDetail.helpedPrice ? _this.dataDetail.helpedPrice : 0;   //当前已经砍掉多少
                _this.reMaining = floatTo.subtract(taskPrice, helpedPrice);  //还剩多少没有砍价
                _this.botRateMes = `${(1 - floatTo.divide(_this.reMaining, taskPrice)) * 100}%`;
                _this.bargainImg = _this.biBargain.mainImg;
                _this.helperNum =res.data.helperNum;
                _this.activityShareNum =res.data.activityShareNum;
                _this.showSelf = _this.dataDetail.isOpenUser=='1' ? false : true;
                _this.getQr();
                wx.getLocation({
                  type: 'wgs84',
                  success(gps) {
                    _this.distance = calDistance(gps.longitude,gps.latitude,_this.dataDetail.longitude,_this.dataDetail.latitude);
                  }
                })
                // 0砍价中    1朋友帮砍成功   2砍价失败，活动已经结束？
                var LEADER_STATUS = 1;
                if(!_this.isBargain){
                  if(_this.dataDetail.isOpenUser == LEADER_STATUS || !_this.dataDetail.isOpenUser){   //表明身份为团长
                    _this.bargainTasksId = _this.dataDetail.id ? _this.dataDetail.id : _this.bargainTasksId;
                    _this.ruleFlag = _this.bargainTasksId ? 0 : 1;
                    switch (true) {
                      case (_this.dataDetail.isSuccess == 0):
                        _this.btn_type = 2;
                        break;
                      case (_this.dataDetail.isSuccess == 1):
                        _this.btn_type = 3;
                        break;
                      case (_this.dataDetail.isSuccess == 2):
                        _this.btn_type = 4;
                        break;
                      case (!_this.bargainTasksId):
                        _this.btn_type = 0;
                        break;
                      default:
                        _this.btn_type = 4;
                    }
                  }else{                      //身份为团员
                    _this.ruleFlag = 1;
                    switch (true) {
                      case (_this.dataDetail.isSuccess == 0):
                        _this.btn_type = 1;
                        break;
                      case (_this.dataDetail.isSuccess == 1):
                        _this.btn_type = 5;
                        break;
                      default:
                        _this.btn_type = 4;
                    }
                  }
                }else{

                }
              }catch (e) {
                console.log(e);
              }

            }else if(res.state == 10000){
              const url = `../../../../pages/loginpage/main?status=${_this.status}&bargainId=${_this.bargainId}&bargainTasksId=${_this.bargainTasksId}&storeId=${_this.storeId}&userId=${_this.outUserId}&biStaffUserName=${_this.biStaffUserName}`;
              wx.navigateTo({url})
            }else{
              Tips.toast(`${decodeURIComponent(res.msg)}`,'none');
            }
          })
        })
      },

      getQr(){
        var _self = this;
        var _data = {
          scene: `cF,4,${_self.bargainId},${_self.bargainTasksId},${_self.biStaffUserName}`,
          qrCodeType: 6
        };
        getSignIn(_data).then(sec => {
          _self.$http.getMiniQr(_data,sec).then(res => {
            if(res.state == 1){
              _self.dataDetail.qrCode = res.qrCode;
            }else{
              Tips.toast(`${decodeURIComponent(res.msg)}`,'none');
            }
          })
        })
      },
      //开团
      openBarginTasks(){
        var _data = {
          token:this.$store.state.token,
          bargainId:this.bargainId,
          storeId:this.storeId,
          isTaskslog:0,
        }
        var _this = this;
        getSignIn(_data).then(sec=>{
          _this.$http.openBarginTasks(_data,sec).then(res=>{
            switch (String(res.state)) {
              case '1':
                _this.isBargain = '';
                _this.bargainTasksId = res.data.bargainTasksId;
                _this.currPrice = floatTo.multiply(res.data.helpPrice,1).toFixed(2);
                _this.showHead = 1;
                _this.toast_type1 = 2;
                _this.getTasksing();
                _this.getBargain();
                break;
              case '916411':
                _this.isBargain = '';
                _this.bargainTasksId = res.data;
                _this.getTasksing();
                _this.getBargain();
                Tips.toast(`${decodeURIComponent(res.msg)}`,'none');
                break;
              default:
                Tips.toast(`${decodeURIComponent(res.msg)}`,'none');
            }
          })
        })
      },
      //查看帮自己砍过价格的人
      lookHelper(){
        this.showNoData =0;
        this.yesBtn=0;
        this.noBtn =1;
        this.sucNum =1;
        this.successMe =[];
        var _data = {
          token:this.$store.state.token,
          bargainTasksId:this.bargainTasksId,
          pageNum:this.pageNum,
          limit:10,
        }
        var _this = this;
        getSignIn(_data).then(sec=>{
          _this.$http.lookHelper(_data,sec).then(res => {
            if(res.data.length!=0) {
              _this.helpMe = _this.helpMe.concat(res.data);
            }
          })
        })
      },
      // 到了底部是否触发了按钮
      helpLower(){
        if(this.bargainTasksId){
          if(this.type==1) {
            this.pageNum++;
            this.lookHelper();
          }else if(this.type ==2){
            this.sucNum++;
            this.lookSucMes();
          }
        }
      },
      //查看砍价成功的人员
      lookSucMes(callback){
        this.type=2;
        this.yesBtn=1;
        this.noBtn =0;
        this.helpMe =[];
        this.pageNum =1;
        var _data = {
            token:this.$store.state.token,
            pageNum:this.sucNum,
            limit:10,
            bargainId:this.bargainId,
        }
        var _this = this;
        getSignIn(_data).then(sec=>{
           _this.$http.lookSucMes(_data,sec).then(res=>{
             callback ? callback() : '';
             for(let i=0;i<res.data.length;i++){
               res.data[i].endTime = toDate(res.data[i].endTime *1000);
             }
             _this.successMe = _this.successMe.concat(res.data);
             console.log(_this.successMe);
             if(_this.successMe.length==0){
                _this.showNoData =1
             }
           })
        })
      },
      goactiveRules(){
        var _this =this;
        wx.navigateTo({
          url:'/pages/packageC/pages/activeRules/main',
          success(){
            _this.pageNum =1;
            _this.dataList = [];
            _this.dataBaring=[];
          }
        })
      },
      lookSuclunbo(){
        var _data = {
          token:this.$store.state.token,
          pageNum:1,
          limit:10
        }
        var _this = this;
        getSignIn(_data).then(sec=>{
          _this.$http.lookSucMes(_data,sec).then(res=>{
            _this.successMelunbo = res.data;
          })
        })
      },
      //查看周边商家信息
      getBargain(){
        var _data = {
          token:this.$store.state.token,
          longitude:this.$store.state.lng,
          latitude:this.$store.state.lat,
          pageNum:this.shopNum,
          limit:10,
        }
        var _this = this;
        getSignIn(_data).then(sec=>{
          _this.$http.getnearByshop(_data,sec).then(res=>{
            if(res.data.length!='') {
              for(let i=0;i<res.data.length;i++){
                res.data[i].shareCardDiscount = floatTo.multiply(res.data[i].shareCardDiscount,10);
              }
              _this.dataList = _this.dataList.concat(res.data);
            }
          })
        })
      },
      strToimg(str){
        let arr = [];
        let newarr = str.split(',');
        for(let i=0;i<newarr.length;i++){
          if(newarr[i]!=''){
             arr.push(newarr);
          }
        }
        return arr;
      },
      //砍价都是和砍价的人相关的
      bargainTaskslog(){
        var _data = {
          token:this.$store.state.token,
          bargainId:this.bargainId,
          bargainTasksId:this.bargainTasksId,
        }
        var _this = this;
        getSignIn(_data).then(sec=>{
          _this.$http.bargainTaskslog(_data,sec).then(res=>{
            switch (String(res.state)) {
              case '1':
                _this.isBargain = 1;
                _this.btn_type = 0;
                _this.taskPrice = res.data.taskPrice;   //需砍金额
                _this.helpedPrice = res.data.helpedPrice;   //当前已经砍掉多少
                _this.currPrice = res.data.helpPrice;   //本次砍掉多少
                _this.reMaining = floatTo.subtract(_this.taskPrice,_this.helpedPrice);  //还剩多少没有砍掉
                _this.currentRate = floatTo.subtract(1,`${(floatTo.divide( _this.reMaining,_this.taskPrice))*100}%`);
                _this.showHead = 1;
                _this.toast_type1=5;
                _this.getTasksing();
                _this.pageNum = 1;
                _this.getBargain();
                //判断共享卡
                if(JSON.stringify(res.data.biSvipcardshare) =='{}'){
                  _this.showActive = 0;
                }else{
                  _this.showActive = 1;
                  _this.mainCardDiscount = floatTo.multiply(res.data.biSvipcardshare.shareCardDiscount,10);
                  _this.biSvipcardshare = res.data.biSvipcardshare;
                }
                //判断是否有优惠券
                if(JSON.stringify(res.data.biCardcoupon)=='{}'){
                  _this.hasCoupon = 0;
                }else{
                  _this.showHead = 1;
                  _this.hasCoupon = 1;
                  _this.toast_type1 = 8;
                  _this.coupon = res.data.biCardcoupon;
                  const couponType =  res.data.biCardcoupon.couponType;
                  if( couponType ==1) {
                    _this.couponMoney = `满${res.data.biCardcoupon.consumeMoney}减${res.data.biCardcoupon.couponMoney}券`;
                  }else if(couponType ==2){
                    _this.couponMoney = `${res.data.biCardcoupon.couponMoney}元现金券`;
                  }
                }
                break;
              case '916410':             //活动已经结束
                _this.isBargain = 1;
                _this.btn_type = 4;
                _this.showHead = 1;
                _this.toast_type1=7;
                _this.getTasksing();
                _this.getBargain();
                break;
              case '916414':          //砍价活动已完成
                _this.isBargain = 1;
                _this.btn_type = 5;
                _this.showHead = 1;
                _this.toast_type1 = 6;
                _this.getTasksing();
                _this.getBargain();
                break;
              case '916413':         //已经帮砍过了
                _this.isBargain = 1;
                _this.btn_type = 0;
                _this.showHead = 0;
                Tips.toast(`${decodeURIComponent(res.msg)}`,'none');
                _this.getTasksing();
                _this.getBargain();
                break;
              case '916417':
                _this.showHead = 0;
                wx.showToast({
                  title: `${decodeURIComponent(res.msg)}`,
                  icon: 'none',
                  duration: 2000,
                  success:function(){
                    setTimeout(function () {
                      _this.getTasksing();
                      _this.getBargain();
                    }, 2000) //延迟时间
                  }
                });
                break;
              case '10000':
                var userId = _this.$store.state.userLiId;
                const url = `../../../../pages/loginpage/main?status=${_this.status}&bargainId=${_this.bargainId}&bargainTasksId=${_this.bargainTasksId}&storeId=${_this.storeId}&userId=${userId}&biStaffUserName=${_this.biStaffUserName}`;
                wx.navigateTo({url});
                break;
              default:
                Tips.toast(`${decodeURIComponent(res.msg)}`,'none');
            }
          })
        })
      },
      goLookShare(){
        // shareid  shopStoreId
        var _this = this;
        wx.navigateTo({
           url:`/pages/packageB/pages/shareCardDetail/main?shareid=${_this.biSvipcardshare.id}&shopStoreId=${_this.biSvipcardshare.shopStoreId}&distance=0`
        })
      },
      //跳转到我也要免费拿
      goShopDetail(){
          wx.navigateTo({
            url:`/pages/packageC/pages/goodsDetail/main?bargainTasksId=${this.bargainTasksId}&bargainId=${this.bargainId}&fromPage=cutFree`
          })
      },
      // gocanJoin  查看更多砍价活动
      gocanJoin(){
        wx.navigateTo({
           url:'/pages/packageC/pages/index/main'
        })
      },
      // 领取核销码
      getCode(){
        var _this = this;
        wx.navigateTo({
          url:`/pages/packageC/pages/cutHistory/main?bargainTasksId=${_this.bargainTasksId}&bargainTitle=${_this.dataDetail.bargainTitle}&bargainImg=${_this.bargainImg}&helperNum=${_this.activityShareNum}&price=${_this.biBargain.price}&prentPrice=${_this.prentPrice}`
        })
      },
      // 去往门店详情信息
      gostoreDetail(par){
        wx.navigateTo({
           url:`/pages/packageB/pages/shopRecDet/main?shopStoreId=${par.shopStoreId}&shopStoreId=${par.shopStoreId}&distance=${par.distance}`
        })
      },
      shareShow(){
        var _self = this;
        _self.$refs.vShare.show();
      },
      createPoster(){
        var _self = this;
        _self.$refs.poster.show();
        _self.$refs.poster.get2D();
      },
      ruleSlide(){
        if(this.ruleFlag){
          this.slideUp(250,function () {
            this.ruleFlag = false;
          }.bind(this))
        }else{
          this.slideDown(250,function () {
            this.ruleFlag = true;
          }.bind(this))
        }
      },
      btnScale(){
        var _self = this;
        var animation = wx.createAnimation({
          duration: 1000,
          timingFunction: 'ease'
        });
        var scaleFlag = false;
        var timer = setInterval(() => {
          scaleFlag ? animation.scale(0.9).step() : animation.scale(1).step();
          _self.btnAnimationData = animation.export();
          scaleFlag = !scaleFlag;
        },1000)

      },
      slideDown(height,callback){
        var that = this;
        callback ? callback() : '';
        var animation = wx.createAnimation({
          duration: 200,
          timingFunction: 'ease'
        });
        that.animation = animation;
        animation.height(0).translateY(-height).step();
        that.animationData = animation.export();
        setTimeout(() => {
          animation.height(height).translateY(0).step();
          that.animationData = animation.export();
        },200);
      },
      slideUp(height,callback){
        var that = this;
        var animation = wx.createAnimation({
          duration: 200,
          timingFunction: 'ease'
        });
        that.animation = animation;
        animation.height(0).translateY(-height).step();
        that.animationData = animation.export();
        setTimeout(() => {
          callback ? callback() : '';
        },200)
      }
    },
    getPhoneNumber(e){
      var _self = this;
      console.log(e);
    },
    async onReachBottom() {
      // 到这底部在这里需要做什么事情
      this.shopNum ++;
      this.getBargain();
    },
    onShareAppMessage(res){
      var _this = this;
      var userId = _this.$store.state.userLiId;
      if (res.from === 'button') {
        // 来自页面内转发按钮
      }
      return {
        title:`【帮我砍一刀】${_this.title}`,
        path:`pages/packageC/pages/cutFree/main?status=4&bargainId=${_this.bargainId}&bargainTasksId=${_this.bargainTasksId}&storeId=${_this.storeId}&userId=${userId}&biStaffUserName=${_this.biStaffUserName}`,
        imageUrl:`${_this.bargainImg}`,
        success:function(res){
        },
        fail:function(res){
        }
      }
    },
  }
</script>

<style lang="scss" scoped>
  .swiper_ri{
    position: fixed;
    width:170rpx;
    height:50rpx;
    background:linear-gradient(0deg,rgba(53,47,192,1),rgba(79,98,242,1));
    border-radius:25rpx 0 0 25rpx;
    right:0;
    top:20rpx;
    z-index: 3;
    color:#fff;
    font-size:30rpx;
    text-align: center;
    line-height: 50rpx;
  }
  .back_index{
    position: fixed;
    width:116rpx;
    height:116rpx;
    display: block;
    right:40rpx;
    bottom:104rpx;
    z-index:999;
    img{
      width:100%;
      height:100%;
      display: block;
    }
  }
  .bargain {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .bg {
    background: #FEDBE5;
    box-sizing: border-box;
    padding: 20rpx;
    padding-top: 10rpx;
    .new_top{
      width:100%;
      height:50rpx;
      margin-bottom:10rpx;
      overflow: hidden;
      position: relative;
      .swiper_le{
        width:100%;
        height:50rpx;
        .view_notice_contain {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          height: 50rpxrpx;
          font-size: 26rpx;
          line-height: 50rpx;
        }
        .image_notice {
          margin-left: 5rpx;
        }
        .swiper_container {
          height: 120rpx;
          width: 100%;
        }
        .swiper_item {
          font-size: 26rpx;
          color: #666;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          letter-spacing: 2px;
          padding-left:10rpx;
          display: flex;
          align-items: center;
          img{
            width:38rpx;
            height:38rpx;
            display: block;
            margin-right:20rpx;
            border-radius: 50%;
          }
        }
      }
    }
  }
  .bargin-goods{
    width: 100%;
    border-radius: 20rpx;
    background: #FFFFFF;
    box-shadow:0 1rpx 32rpx 6rpx rgba(254, 171, 193, 1);
    box-sizing: border-box;
    margin-bottom: 40rpx;
    .all_con{
      padding: 38rpx 18rpx;
      .rule_title{

      }
      .rule_title::before{
        content: '';
        display: block;
        width: 8rpx;
        height: 8rpx;
        border-radius: 50%;
        background: #FA336C;
        margin-right: 12rpx;

      }
    }
    .commander_goods{
      width:674rpx;
      background:rgba(231,231,231,0.6);
      border-top-left-radius: 20rpx;
      border-top-right-radius: 20rpx;
      display: flex;
      padding:0 18rpx;
      align-items: center;
      .comman_le{
        width:60rpx;
        height:60rpx;
        border-radius: 50%;
        margin-right:10rpx;
        img{
          width:100%;
          height:100%;
          display: block;
          background:#ff6700;
          border-radius: 50%;
        }
      }
      .comman_ri{
         width:600rpx;
         height:80rpx;
         font-size:24rpx;
        .comman_ri_bot{
          color: #5b6064;
        }
      }
    }
    .active_title{
      display: flex;
      padding-bottom:20rpx;
      .active_le{
        margin-right:10rpx;
      }
    }
    .slogan{
      width: 124rpx;
      height: 41rpx;
      background:linear-gradient(0deg,rgba(53,47,192,1),rgba(79,98,242,1));
      border-radius:2rpx 0 10rpx 10rpx;
      position: absolute;
      top: 0;
      left: 30rpx;
      text-align: center;
      line-height: 41rpx;
    }
    .descFlag{
      position: absolute;
      right: 30rpx;
      top: 10rpx;
    }
    .slogan_bg{
      height: 28rpx;
      line-height: 28rpx;
      border-radius:5rpx;
    }
    .goods{
      .thumb{
        display: block;
        width: 200rpx;
        height: 200rpx;
        border: 2rpx solid #EEEEEE;
      }
      .detail{
        width: 454rpx;
      }

    }
    button{
      display: block;
      width: 100%;
      border-radius: 20rpx;
      box-sizing: border-box;
      border: 8rpx solid #F7094D;
      background:linear-gradient(0deg,rgba(237, 41, 102, 1),rgba(252, 83, 133, 1));
      box-shadow:0 1rpx 32rpx 6rpx rgba(254, 216, 227, 1);
    }
  }
  .bargin-list{
    width: 100%;
    height: 767rpx;
    border-radius: 20rpx;
    background: #FFFFFF;
    box-shadow:0 2rpx 32rpx 6rpx rgba(254, 171, 193, 1);
    margin-bottom: 40rpx;
    overflow: hidden;
    position: relative;
    .menu{
      width: 100%;
      height: 100rpx;
      position: absolute;
      border-radius: 20rpx 20rpx 0 0;
      overflow: hidden;
      top: 0;
      left: 0;
      z-index: 2;
      .btn{
        display: block;
        width: 50%;
        height: 100%;
        background: #E7E7E7;
        color: #8D8E98;
        text-align: center;

      }
      .active{
        background: #FA336C;
        color: #FFFFFF;
      }
      .maxWidth{
        width: 100%;
      }
    }
    .scroll{
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      padding: 24rpx 21rpx;
      z-index: 30;
      .ico{
        display: block;
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        margin-right: 16rpx;
      }
    }
  }
  .re-store{
    width: 100%;
    box-sizing: border-box;
    padding: 0 22rpx;
    .board{
      display: block;
      width: 265rpx;
      height: 58rpx;
      margin: 0 auto;
      margin-bottom: 25rpx;
    }
    .list-item{
      background: #FFFFFF;
      overflow: hidden;
      border-bottom: 1rpx solid #EEEEEE;
      padding-bottom: 24rpx;
      margin-bottom: 24rpx;
      .thumb{
        display: block;
        width: 215rpx;
        height: 161rpx;
        border-radius: 10rpx;
      }
    }
  }
  .toast-gather {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 50;
    background: rgba(12, 12, 12, .5);
    .phone-toast{
      width: 540rpx;
      height: 560rpx;
      background: #FFFFFF;
      border-radius: 20rpx;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      .welcome{
        display: block;
        width: 335rpx;
        height: 115rpx;
        position: absolute;
        left: 0;
        right: 0;
        margin-left: auto;
        margin-right: auto;
        top: -42rpx;
      }
      .close {
        display: block;
        width: 55rpx;
        height: 55rpx;
        position: absolute;
        top: -55rpx;
        right: -60rpx;
      }
      .cat{
        display: block;
        width: 178rpx;
        height: 243rpx;
        margin: 0 auto 26rpx;
      }
    }
    .toast-container {
      position: absolute;
      top: 0rpx;
      left: 0;
      right: 0;
      bottom:0;
      margin: auto;
      display: flex;
      justify-content: center;
      align-items: center;
      width:600rpx;
      flex-direction: row;
      flex-wrap: wrap;
      z-index:999;
      .close {
        display: block;
        width: 55rpx;
        height: 55rpx;
        position: absolute;
        top: 0;
        right: -60rpx;
      }
      .toast-common {
        border-radius: 20rpx;
        background: #FFFFFF;
        width:600rpx;
        margin: 0 auto;
        .head {
          display: block;
          width: 198rpx;
          height: 177rpx;
          position: absolute;
          top: -93rpx;
          left: 0;
          right: 0;
          margin-left: auto;
          margin-right: auto;
        }


        button {
          display: block;
          width: 100%;
          height: 90rpx;
          border-radius: 20rpx;
          box-sizing: border-box;
          border: 8rpx solid #F7094D;
          background: linear-gradient(0deg, rgba(237, 41, 102, 1), rgba(252, 83, 133, 1));
          box-shadow: 0 1rpx 32rpx 6rpx rgba(254, 216, 227, 1);
        }
        .bg-4F62F2-352FC0 {
          background: linear-gradient(0deg, rgba(53, 47, 192, 1), rgba(79, 98, 242, 1));
          border: 8rpx solid #4C5DED;
          box-shadow: none;
        }
      }
      .coupon{
        width: 639rpx;
        height: 761rpx;
        background: url("https://zhushangtong.oss-cn-hangzhou.aliyuncs.com/guide/2019/8/16/6729245a366ea94f19a58d214e640a96.png") center center no-repeat;
        background-size: 100% 100%;
        .btn{
          width: 500rpx;
          height: 90rpx;
          line-height: 74rpx;
          border-radius: 20rpx;
          box-sizing: border-box;
          margin: 0 auto;
        }
      }
      .shareCard {
        width: 100%;
        height: 376rpx;
        background: url("../../static/img/share_card_bg.png") center center no-repeat;
        background-size: 100% 100%;
        padding: 40rpx 50rpx 0;

        button {
          display: block;
          width: 100%;
          height: 90rpx;
          border-radius: 20rpx;
          box-sizing: border-box;
          border: 8rpx solid #F7094D;
          background: linear-gradient(0deg, rgba(237, 41, 102, 1), rgba(252, 83, 133, 1));
          box-shadow: 0 1rpx 32rpx 6rpx rgba(254, 216, 227, 1);
        }
      }
    }

  }
</style>
