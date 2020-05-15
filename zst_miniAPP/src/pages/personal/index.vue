<template>
  <div class="page">
    <!--个人中心-->
    <div class="pa_top" v-if="userRo == 0">

      <div class="setting" style="color:#fff;font-size: 40rpx;"  @click="goPer">
        <i class="iconfont icon-shezhi"></i>
      </div>

      <div class="pa_shengjivip" @click="goUpgrade">
         升级会员 获取更多权益
      </div>



      <div class="pa_con">
        <div class="pa_left" style="margin-right: 20rpx">
          <img v-if="imgUrl"  :src="imgUrl" alt="">
          <img  v-else src="https://zhushangtong.oss-cn-hangzhou.aliyuncs.com/guide/2019/8/27/087dba23674a239590e1575db9def49a.png " alt="">
        </div>
        <div class="pa_right" v-if="token">
          <div class="pe_tit">
              <span  style="font-size: 36rpx;">{{nickName}}</span>
              <span style="font-size: 18rpx;background:#DE6A84;padding:4rpx 6rpx;margin-top:10rpx;margin-left:10rpx;border-radius: 6rpx">普通会员</span>
          </div>

          <div class="con_foot">
            <div style="font-size: 28rpx;">ID：{{idCard}}</div>
          </div>
        </div>
        <div class="flex_box align_center"
             style="justify-content:center;background: rgba(255,255,255,.3);border-radius: 60rpx;height: 60rpx;width: 200rpx;float: left"
             @click="goLogin"
             v-else>
          <p class="fz-36 fc-ffffff">登录/</p>
          <p class="fz-36 fc-ffffff">注册</p>
        </div>
      </div>

      <div class="join_personal">
         <div class="join_per">
           累计邀请(人) {{mesData.totalInviteCount}}
         </div>
        <div class="join_pho" v-if="userPhone">
          绑定手机号  {{userPhone}}
        </div>
        <div class="join_pho" @click="goBlinkPage" v-else-if="!userPhone">
          绑定手机号
        </div>
      </div>
      <div class="take_money">
        <div class="ta_money">
            <div class="ta_top">
                <div class="ta_top_le">可提现余额  ￥{{mesData.canPostalAmounts}}</div>
                <div class="ta_top_ri">
                  <div class="ta_btn" @click="tixian">
                   一键提现
                  </div>
                </div>
            </div>

            <div class="ta_mid">
                <div class="ta_mid_inner" @click="todayInvite">
                    <div style="font-size: 38rpx">{{mesData.todayInviteCount ? mesData.todayInviteCount : 0}}</div>
                    <div style="font-size: 28rpx;color:#8D8E98;">今日邀请(人) </div>
                </div>
              <div class="ta_mid_inner" @click="goTodayPri">
                <div style="font-size: 38rpx">￥{{mesData.todayProfit ? mesData.todayProfit : 0}}</div>
                <div style="font-size: 28rpx;color:#8D8E98;">今日收益(元)  </div>
              </div>
              <div class="ta_mid_inner" @click="goTodayPri">
                <div style="font-size: 38rpx">￥{{mesData.thisMthPreincome ? mesData.thisMthPreincome : 0}}</div>
                <div style="font-size: 28rpx;color:#8D8E98;">本月预估收益</div>
              </div>
            </div>

            <div class="ta_bot_inner">
                <div class="ta_bot_top" @click="goTodayPri">
                  上月结算收益 ￥{{mesData.lastMthSettledIncome}}
                </div>

                <div class="ta_bot_bot" @click="goTodayPri">
                  上月预估收益  ￥{{mesData.lastMthUnSettledIncome}}
                </div>
            </div>

        </div>
      </div>
    </div>
    <div class="pa_top" v-else-if="userRo == 1" style="background:#1b1b1b;">

      <div class="setting">
        <i class="iconfont icon-shezhi" style="color:#fff;font-size: 30rpx;" @click="goPer"></i>
      </div>

      <div class="pa_con">
        <div class="pa_left">
          <img v-if="imgUrl"   :src="imgUrl" alt="">
          <img  v-else src="https://zhushangtong.oss-cn-hangzhou.aliyuncs.com/guide/2019/8/27/087dba23674a239590e1575db9def49a.png " alt="">
        </div>
        <div class="pa_right">

          <div class="pe_tit">
            <span  style="font-size: 36rpx;">{{nickName}}</span>
            <span style="font-size: 24rpx;background:#fda109;padding:0rpx 20rpx;margin-top:10rpx;margin-left:10rpx;border-radius: 6rpx">vip会员</span>
          </div>

          <div class="con_foot">
            <div style="font-size: 28rpx;">ID：{{idCard}}</div>
          </div>
          <div class="jindu">
            <div class="weui-progress__bar">
                <progress :percent="totalRate" stroke-width="3" />
            </div>

            <div  class="jindu_ri"  style="font-size: 16rpx;">剩{{leftDate}}天到期</div>
          </div>
        </div>

      </div>

      <div class="join_personal">
        <div class="join_per">
          累计邀请(人) {{mesData.totalInviteCount}}
        </div>
        <div class="join_pho" v-if="userPhone">
          绑定手机号  {{userPhone}}
        </div>
        <div class="join_pho" @click="goBlinkPage" v-else-if="!userPhone">
             绑定手机号
        </div>
      </div>

      <div class="take_money">
        <div class="ta_money">

          <div class="ta_top">
            <div class="ta_top_le">可提现余额 ￥{{mesData.canPostalAmounts}}</div>
            <div class="ta_top_ri">
              <div class="ta_btn" @click="tixian">
                一键提现
              </div>
            </div>
          </div>

          <div class="ta_mid">
            <div class="ta_mid_inner" @click="todayInvite">
              <div style="font-size: 38rpx">{{mesData.todayInviteCount}}</div>
              <div style="font-size: 28rpx;color:#8D8E98;">今日邀请(人) </div>
            </div>
            <div class="ta_mid_inner" @click="goTodayPri">
              <div style="font-size: 38rpx">￥{{mesData.todayProfit}}</div>
              <div style="font-size: 28rpx;color:#8D8E98;">今日收益(元)  </div>
            </div>
            <div class="ta_mid_inner" @click="goTodayPri">
              <div style="font-size: 38rpx">￥{{mesData.thisMthPreincome}}</div>
              <div style="font-size: 28rpx;color:#8D8E98;">本月预估收益</div>
            </div>
          </div>

          <div class="ta_bot_inner">
            <div class="ta_bot_top" @click="goTodayPri">
              上月结算收益 ￥{{mesData.lastMthSettledIncome}}
            </div>

            <div class="ta_bot_bot" @click="goTodayPri">
              上月预估收益  ￥{{mesData.lastMthUnSettledIncome}}
            </div>

          </div>
        </div>
      </div>
    </div>


    <!--第二部分-->

    <!--第三部分-->
    <div class="take_money" style="margin-bottom:22rpx;">
      <div class="ta_money" style="margin-top:20rpx;">

        <div class="ta_top">
          <div class="ta_top_le">我的专区</div>
        </div>

        <div class="ta_mid">
          <div class="ta_mid_inner">
            <div class="ta_mid_in" @click="goSay">

              <div class="ta_mid_le">
                <img src="https://zhushangtong.oss-cn-hangzhou.aliyuncs.com/guide/2019/8/27/9fb11c058d19c7342f2f3163711dfb80.png" alt="">
              </div>

              <div class="ta_mid_ri">
                <div class="ta_title">话呗余额</div>
                <div class="ta_intro">￥{{tot}}</div>
              </div>
            </div>
          </div>
          <div class="ta_mid_inner">
            <div class="ta_mid_in" @click="goSoucang">

              <div class="ta_mid_le">
                <img src="https://zhushangtong.oss-cn-hangzhou.aliyuncs.com/guide/2019/8/27/18bc22f2e343d1cb19146635c630f673.png" alt="">
              </div>

              <div class="ta_mid_ri">
                <div class="ta_title">我的收藏</div>
                <div class="ta_intro">我喜欢的</div>
              </div>
            </div>
          </div>
        </div>
        <div class="ta_mid">
          <div class="ta_mid_inner">
            <div class="ta_mid_in" @click="goMypurhistory">

              <div class="ta_mid_le">
                <img src="/static/img/per_purhistory.png" alt="">
              </div>

              <div class="ta_mid_ri">
                <div class="ta_title">我的账单</div>
                <div class="ta_intro">查看消费记录</div>
              </div>
            </div>
          </div>
          <div class="ta_mid_inner">
            <div class="ta_mid_in" @click="goCutHis">

              <div class="ta_mid_le">
                <img src="/static/img/per_cut.png" alt="">
              </div>

              <div class="ta_mid_ri">
                <div class="ta_title">砍成记录</div>
                <div class="ta_intro">查看中奖记录</div>
              </div>
            </div>
          </div>
        </div>
        <div class="ta_mid">
          <div class="ta_mid_inner">
            <div class="ta_mid_in" @click="golotterRecord">

              <div class="ta_mid_le">
                <img src="/static/img/per_lottery.png" alt="">
              </div>

              <div class="ta_mid_ri">
                <div class="ta_title">抽奖记录</div>
                <div class="ta_intro">点击立即领奖</div>
              </div>
            </div>
          </div>
          <div class="ta_mid_inner">
            <div class="ta_mid_in" @click="gomysvipCard">

              <div class="ta_mid_le">
                <img src="/static/img/per_card.png" alt="">
              </div>

              <div class="ta_mid_ri">
                <div class="ta_title">我的卡包</div>
                <div class="ta_intro">共享卡、主卡</div>
              </div>
            </div>
          </div>
        </div>

        <div class="ta_bot_other">
            <div class="ta_other_img" v-for="item in  imgList" :key="item.id" @click="gomyOrder(item)">
                <div class="oh_img">
                  <img :src="item.imgSrc" alt="">
                </div>
                <div class="oh_con">
                    {{item.imgText}}
                </div>
            </div>
        </div>
      </div>
    </div>
    <!--第五部分-->
    <div class="take_money" style="margin-bottom:22rpx;">
      <div class="ta_money">
        <div class="ta_top">
          <div class="ta_top_le">我的工具</div>
        </div>
        <!--待付款         待发货        待评价          退款       我的订单-->
        <div class="ta_bot_other_other">
          <div class="ta_other_img"  v-for="(item,index) in  fourList" :key="item.id" @click="gohref(item,index)">
            <div class="oh_img">
              <img :src="item.imgSrc" alt="">
            </div>
            <div class="oh_con">
               {{item.imgText}}
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { getSignIn , confirm } from '@/common/js/comm'
import Tips from '@/common/js/tips'
import { mapMutations } from 'vuex'
import { TOTALMONEY , USERPHONE}  from '../../store/mutation-types'

export default {
  components: {

  },
  // 待付款 待发货 待收货 待评价 退款
  data () {
    return {
      perLis:'',
      logs: [],
      // 待付款         待发货        待评价          退款       我的订单
      imgList:[
        {imgSrc:'https://zhushangtong.oss-cn-hangzhou.aliyuncs.com/guide/2019/8/27/81047dc91e676ca3d43ebffee62d8ac7.png ',imgText:'待付款'},
        {imgSrc:'https://zhushangtong.oss-cn-hangzhou.aliyuncs.com/guide/2019/8/27/eefe6afd094d44447f11459e0b3c188d.png ',imgText:'待发货'},
        {imgSrc:'https://zhushangtong.oss-cn-hangzhou.aliyuncs.com/guide/2019/9/16/60f1f66d1eac2863e0d1c94643cb0d1b.png ',imgText:'待收货/待使用'},
        {imgSrc:'https://zhushangtong.oss-cn-hangzhou.aliyuncs.com/guide/2019/8/27/d4715ff0bebe004958c7aff493a36e8d.png ',imgText:'待评价'},
        {imgSrc:'https://zhushangtong.oss-cn-hangzhou.aliyuncs.com/guide/2019/8/27/bc9058f34b85e8e06555e09747a5dafa.png ',imgText:'退款'},
        // {imgSrc:'https://zhushangtong.oss-cn-hangzhou.aliyuncs.com/guide/2019/8/27/2403316724913332d027afc6c6771385.png ',imgText:'我的订单'},
      ],
      fourList:[
        {imgSrc:'https://zhushangtong.oss-cn-hangzhou.aliyuncs.com/guide/2019/8/27/f68126a4785adc33b468d1e788186d9f.png ',imgText:'客服电话'},
        {imgSrc:'https://zhushangtong.oss-cn-hangzhou.aliyuncs.com/guide/2019/8/27/b4c5c6e9a73687175018aa2a55a34f3f.png ',imgText:'常见问题'},
        {imgSrc:'https://zhushangtong.oss-cn-hangzhou.aliyuncs.com/guide/2019/8/27/57f1464cbb689de8f8071e3b88f7d82a.png ',imgText:'版本信息'},
        {imgSrc:'https://zhushangtong.oss-cn-hangzhou.aliyuncs.com/guide/2019/8/27/52fc6fe9d2945c7b89a9852fbf0487c8.png ',imgText:'关于我们'},
      ],
      mesData:'',
      imgUrl:'',
      nickName:'',
      idCard:'',
      userPhone:'',
      userRo:'',
      leftDate:'',
      totalRate:'',
      tot:'',
      token: ''
    }
  },
  onShow: function () {
      var _this = this;
      _this.token = this.$store.state.token;
      if(this.$store.state.token){
        _this.getBalance();
        _this.getPerMes();
        _this.getMesss();
        _this.tot = _this.$store.state.totalMoney;
        _this.leftDate = _this.$store.state.leftDate;
        _this.totalRate = ((_this.$store.state.leftDate) / _this.$store.state.totalDate * 100).toFixed(2);
      }
  },
  mounted () {
    let token = this.$store.state.token;
    if(token) {
      this.idCard = this.$store.state.userId;
      this.userPhone = this.$store.state.userPhone;
      this.leftDate = this.$store.state.leftDate;
      this.totalRate = ((this.$store.state.leftDate) / this.$store.state.totalDate * 100).toFixed(2);
      this.tot = this.$store.state.totalMoney;
    }
  },
  methods:{
    ...mapMutations({
      totalMoney:'TOTALMONEY',
      userPh:'USERPHONE',
    }),
    goLogin(){
      var url = '/pages/loginpage/main';
      wx.navigateTo({url});
    },
    getBalance(){
      var _this = this;
      var _data = {
        token:this.$store.state.token,
      }
      getSignIn(_data).then(sec=>{
        _this.$http.getBalance(_data,sec).then(res=>{
          _this.totalMoney(res.data.totalMoney);
          _this.tot = res.data.totalMoney;
        })
      })
    },
    getPerMes(){
      var _this = this;
      var _data = {
         token:_this.$store.state.token,
      }
      getSignIn(_data).then(sec=>{
        _this.$http.getPerMes(_data,sec).then(res=>{
          if(res.state == 1){
            _this.mesData = res.data;
          }
        })
      })
    },
    getMesss(){
      var _this = this;
      var _data = {
        token:_this.$store.state.token,
      }
      getSignIn(_data).then(sec=>{
         _this.$http.getPerMMss(_data,sec).then(res=>{
           _this.userRo = res.data.userRole;
           _this.imgUrl = res.data.ico == '' ? _this.$store.state.iconImg : res.data.ico;
           _this.nickName = res.data.nick;
           // console.log('看看这个缓存',_this.$store.state.userPhone);
           // _this.userPh(res.data.phone?res.data.phone:_this.$store.state.userPhone);
           _this.userPhone = res.data.phone?res.data.phone:'';
         })
      })
    },
    gomyOrder(par){
      if(this.$store.state.token){
        const url = `../../pages/packageA/pages/allMyDetail/main?imgText=${par.imgText}`;
        wx.navigateTo({ url });
      }else{
        this.goLogin();
      }
    },
    todayInvite(){
      if(this.$store.state.token){
        wx.navigateTo({
          url: '../../pages/packageA/pages/inviter/main'
        })
      }else{
        this.goLogin();
      }

    },
    goTodayPri(){
      if(this.$store.state.token){
        wx.navigateTo({
          url: '../../pages/packageA/pages/incomeDetail/main'
        })
      }else{
        this.goLogin();
      }

    },
    goSay(){
      if(this.$store.state.token){
        wx.navigateTo({
          url: '../../pages/packageA/pages/purHistory/main'
        })
      }else{
        this.goLogin();
      }

    },
    goMyCard(){
      if(this.$store.state.token){
        wx.navigateTo({
          url: '../../pages/packageA/pages/myCardBag/main'
        })
      }else{
        this.goLogin();
      }

    },
    goSoucang(){
      if(this.$store.state.token){
        wx.navigateTo({
          url: '../../pages/packageA/pages/collectPage/main'
        })
      }else{
        this.goLogin();
      }

    },
    goUpgrade(){
      if(this.$store.state.token){
        wx.navigateTo({
          url: '../../pages/packageA/pages/upgradeVip/main'
        })
      }else{
        this.goLogin();
      }

    },
    goMypurhistory(){
      if(this.$store.state.token){
        wx.navigateTo({
          url: '/pages/packageA/pages/mypurhistory/main'
        })
      }else{
        this.goLogin();
      }

    },
    goCutHis() {
      if(this.$store.state.token){
        wx.navigateTo({
          url: '/pages/packageC/pages/cutHistory/main',
        })
      }else{
        this.goLogin();
      }

    },
    gomysvipCard(){
      if(this.$store.state.token){
        wx.navigateTo({
          url: '/pages/packageD/pages/mySvipcard/main?pageFrom=isCarder'
        })
      }else{
        this.goLogin();
      }

    },
    golotterRecord(){
      if(this.$store.state.token){
        wx.navigateTo({
          url: '/pages/packageA/pages/lotterRecord/main'
        })
      }else{
        this.goLogin();
      }

    },
    goBlinkPage(){
      if(this.$store.state.token){
        wx.navigateTo({
          url:'/pages/packageA/pages/replPhone/main'
        })
      }else{
        this.goLogin();
      }

    },
    goPer(){
      if(this.$store.state.token){
        wx.navigateTo({
          url:'../../pages/packageA/pages/perInfo/main'
        })
      }else{
        this.goLogin();
      }

    },
    tixian(){
      if(this.$store.state.token){
        wx.navigateTo({
          url:'/pages/packageD/pages/downApp/main'
        })
      }else{
        this.goLogin();
      }

    },
    gohref(par,ind){
      if(ind == 0){
        wx.makePhoneCall({
          phoneNumber: '400-8090-775',
        })
      }
      //常见问题
      else if(ind == 1){
        wx.navigateTo({
          url:'../../pages/packageA/pages/comPro/main'
        })
      }
      //版本信息
      else if(ind == 2){
        wx.navigateTo({
          url:'../../pages/packageA/pages/verInf/main'
        })
      }
      //关于我们
      else if(ind == 3){
        wx.navigateTo({
           url:'../../pages/packageA/pages/aboutUs/main'
        })
      }
    },
    openConfirm() {
      wx.showModal({
        title: '弹窗标题',
        content: '弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内',
        confirmText: "主操作",
        cancelText: "辅助操作",
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击主操作')
          } else {
            console.log('用户点击辅助操作')
          }
        }
      })
    },
    openAlert() {
      wx.showModal({
        content: '弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page{
  overflow: hidden;
  background:#f6f6f6;
}
.pa_top{
  width:750rpx;
  background:linear-gradient(-39deg,rgba(247,9,77,0.6),rgba(255,139,139,0.4));
  float: left;
  overflow: hidden;
  position: relative;
  .setting{
    position: absolute;
    right:40rpx;
    top:40rpx;
    width:40rpx;
    height:40rpx;
    z-index:999;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .pa_shengjivip{
    position: absolute;
    right:0;
    top:100rpx;
    font-size: 18rpx;
    background:linear-gradient(90deg,rgba(239,152,132,1),rgba(127,80,44,1));
    color:#fff;
    padding:6rpx 10rpx;
    padding-left:40rpx;
    border-bottom-left-radius:20rpx ;
    border-top-left-radius: 20rpx;
  }
  .pa_con{
     width:90%;
     margin:0 5%;
     /*height:149rpx;*/
     margin-top:40rpx;
     display: flex;
     /*justify-content: space-between;*/
     align-items: center;
    .pa_left{
      width:140rpx;
      height:140rpx;
      border-radius: 50%;
      img{
        width:100%;
        height:100%;
        display: block;
        border-radius: 50%;
      }
    }
    .pa_right{
      width:490rpx;
      height:100%;
      overflow: hidden;
      float: left;
      .pe_tit{
        overflow: hidden;
        display: block;
        span{
          display: inline-block;
          float: left;
          color:#fff;
          img{
            width:100%;
            height:100%;
            display: block;
            padding-top:5rpx;
          }
        }
      }
      .con_foot{
        color:#fff;
        font-size: 28rpx;
        display: flex;
        flex-direction: column;
      }
    }
    .jindu{
      display: flex;
      justify-content: space-between;
      align-items: center;
      overflow: hidden;
    }
    .weui-progress{
      background:rgba(255,255,255,1);
      height:6rpx;
      border-radius: 3rpx;
      width:76%;
      align-items: center;
      .js_progress{
        height:6rpx;
        background:linear-gradient(90deg,rgba(239,170,132,1),rgba(127,80,44,1));
      }
    }
    .jindu_ri{
      width:22%;
      font-size: 16rpx;
      color:#fff;
      margin-left:2%;
    }
  }

  .join_personal{
    display: flex;
    justify-content: space-between;
    padding:0 5%;
    margin-bottom:24rpx;
    div{
      font-size: 28rpx;
      color:#fff;
    }
  }
}
/*俩套共用样式*/
.take_money{
  width:100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  .ta_money{
    width:710rpx;
    background:#fff;
    border-top-left-radius: 20rpx;
    border-top-right-radius: 20rpx;
    overflow: hidden;
    .ta_top{
      width:92%;
      height:80rpx;
      border-bottom:1px solid rgba(229,229,229,1);
      padding:0 4%;
      display: flex;
      justify-content: space-between;
      line-height: 80rpx;
      .ta_top_le{
        font-size: 28rpx;
        color:#000;
        font-weight: bold;
      }
      .ta_top_ri{
        font-size: 28rpx;
        color:#ffffff;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        .ta_btn{
          height:50rpx;
          background:linear-gradient(90deg,rgba(239,170,132,1),rgba(127,80,44,1));
          text-align: center;
          line-height: 50rpx;
          border-radius: 6rpx;
          padding:0 14rpx;
        }
      }
    }
    .ta_mid{
      width:100%;
      height:106rpx;
      /*background:purple;*/
      margin-top:13rpx;
      padding-bottom:13rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom:1px dashed #E5E5E5;
      .ta_mid_inner{
        width:50%;
        border-right:1px dashed #E5E5E5;
        display: flex;
        align-items: center;
        flex-direction: column;
        .ta_mid_in{
          width:100%;
          display: flex;
          justify-content: space-around;
          align-items: center;
          .ta_mid_le{
            width:70rpx;
            height:70rpx;
            overflow: hidden;
            margin-right:-30rpx;
            img{
              width:100%;
              height:100%;
              display: block;
            }
          }
          .ta_mid_ri{
            width:152rpx;
            overflow: hidden;
            margin-left:-30rpx;
            .ta_title{
              font-size: 30rpx;
            }
            .ta_intro{
              font-size: 20rpx;
              color:#8D8E98;
            }
          }
        }
      }
      .ta_mid_inner:nth-child(3){
        border-right: 0 ;
      }
    }
    .ta_bot_inner{
      width:100%;
      height:58rpx;
      /*background:purple;*/
      display: flex;
      justify-content: space-between;
      margin:10rpx 0;
      .ta_bot_top{
        width:50%;
        text-align: center;
        line-height: 58rpx;
        border-right:1px dashed #E5E5E5;
        font-size: 24rpx;
      }
      .ta_bot_bot{
        width:50%;
        text-align: center;
        line-height: 58rpx;
        font-size: 24rpx;
      }
    }
    .ta_bot_other{
      width:100%;
      display: flex;
      justify-content: space-between;
      overflow: hidden;
      padding:22rpx 0;
      .ta_other_img{
        padding:0 20rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
          .oh_img{
            width:60rpx;
            height:60rpx;
            margin-bottom:10rpx;
            img{
              width:100%;
              height:100%;
              display: block;
            }
          }
        .oh_con{
          font-size: 24rpx;
        }
      }
    }
    .ta_bot_other_other{
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      padding:20rpx 0;
      .ta_other_img{
        width:25%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin-bottom:20rpx;
        .oh_img{
          width:60rpx;
          height:60rpx;
          margin-bottom:10rpx;
          img{
            width:100%;
            height:100%;
            display: block;
          }
        }
        .oh_con{
          font-size: 24rpx;
        }
      }
    }
  }
}
.red_hu{
  width:750rpx;
  height:21rpx;
  overflow: hidden;
  margin-bottom:26rpx;
  img{
    width:100%;
    height:100%;
    display: block;
  }
}
.pho_con{
  width:90%;
  margin:0 5%;
  overflow: hidden;
  display: flex;
  align-items: center;
  background:#fff;
  .pho_all{
    width:100%;
    height:161rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background:#fff;
    .eve_cc{
      width:80rpx;
      background:#fff;
      display: flex;
      align-items: center;
      flex-direction: column;
      .item_top{
        width:80rpx;
        height:80rpx;
        img{
          width:100%;
          height:100%;
          display: block;
        }
      }
      .item_bot{
          font-size: 24rpx;
      }
    }
  }
}
.ad_img{
  width:100%;
  height:188rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom:14rpx;
  .adv_img{
    width:710rpx;
    height:188rpx;
    img{
      width:100%;
      height:100%;
      display:block;
    }
  }
}

</style>
