<template>
  <div class="page">
    <div class="zst_img">
      <img src="https://zhushangtong.oss-cn-hangzhou.aliyuncs.com/guide/26/cc4369ddcd1bf5d17fb91ad15744186b.png" alt="">
    </div>
    <!--<div class="zst-wel">-->
    <!--欢迎来到助商通-->
    <!--</div>-->
    <div class="zst_intro">
      <div>为提供优质的服务，助商通需要获取以下信息</div>
      <div style="font-size: 28rpx;color:#9c9c9c;">· 你的公开信息（昵称，头像等）</div>
    </div>

    <div class="confirm_btn">
      <button class="btn_con" open-type="getUserInfo" @getuserinfo="bindGetUserInfo" @click="getUserInfo1">同意
      </button>
    </div>

    <div class="confirm_btn">
      <button class="btn_con_cancel" @click="back">取消
      </button>
    </div>
  </div>
</template>

<script>

    import { mapMutations } from 'vuex'
    import { getQuery } from '@/common/js/comm'
    import {  AVATAR , NICKNAME , GENDER ,PROVINCE , CITY , TOKEN , APPVERSION , ICONIMG , NICKCNAME ,
      USERID , USERPHONE , USERROLE , LEFTDATE , TOTALDATE ,USERLIID , ATTENACCOUNT , RECHARGESWITCH , CITYNAME , UNIONID ,NEWSHOPID}  from '../../store/mutation-types'
    import Tips from '@/common/js/tips'
    export default {
        name: "loginpage",
        data() {
          return {

          }
        },
        mounted(){
          this.getSetting();
        },
        methods:{
          ...mapMutations({
              avatar:'AVATAR',
              nickname:'NICKNAME',
              gender:'GENDER',
              province:'PROVINCE',
              city:'CITY',
              token:'TOKEN',
              // 版本号
              appVersion:'APPVERSION',
              iconImg:'ICONIMG',
              nickCname:'NICKCNAME',
              userId:'USERID',
              userPhone:'USERPHONE',
              // joinPer:'JOINPER',
              userRole:'USERROLE',
              leftDate:'LEFTDATE',
              totalDate:'TOTALDATE',
              userLiId:'USERLIID',
              attenAccount:'ATTENACCOUNT',
              rechargeSwitch:'RECHARGESWITCH',
              cityName:'CITYNAME',
              unionid:'UNIONID',
              newShopId:'NEWSHOPID'
          }),
          //用户同意授权之后用用户信息换取token
          getSetting(){
            var _this = this;
            wx.getSetting({
              success: function(res){
                if (res.authSetting['scope.userInfo']) {
                  wx.getUserInfo({
                    success: function(res) {
                      let r = {"iv":res.iv,"encryptedData":res.encryptedData,'sessionKey':_this.$store.state.sessionkey};
                      _this.avatar(res.userInfo.avatarUrl);
                      _this.nickname(res.userInfo.nickName);
                      _this.gender(res.userInfo.gender);
                      _this.province(res.userInfo.province);
                      _this.city(res.userInfo.city);
                      var par = getQuery();
                      const pages = getCurrentPages();
                      var sceneArr = (decodeURIComponent(par.scene)).split(',');
                      var biStaffUserName,shareUsername,bargainId;
                      if(par.scene){
                        if(pages[0].route.indexOf('payMoney')>-1){
                          biStaffUserName = sceneArr[0];
                        }
                        if(pages[0].route.indexOf('shareCardDetail')>-1){
                          if(sceneArr[2]){
                            shareUsername = sceneArr[2];
                          }else if(par.inviterId){
                            shareUsername = par.inviterId;
                          }
                        }
                        if(pages[0].route.indexOf('shopRecDet')>-1){
                          biStaffUserName = sceneArr[2];
                        }
                        if(pages[0].route.indexOf('shopdetail')>-1){
                          shareUsername = sceneArr[0];
                        }
                        if(pages[0].route.indexOf('currentStoreAct') >-1){
                           biStaffUserName = sceneArr[1];
                        }
                        if(sceneArr[0] == 'cF'){
                          biStaffUserName = sceneArr[4];
                          bargainId = sceneArr[2];
                        }
                      }
                      else if(par.q){
                        par.q = decodeURIComponent(par.q);
                        var newObj = par.q.split('?');
                        var newObjMes = newObj[1].split('=');
                        var newTwo = newObjMes[1].split(',');
                        biStaffUserName = newTwo[0];
                      }
                      else {
                        biStaffUserName = par.biStaffUserName;
                        bargainId = par.bargainId;
                      }
                      var data = {
                        nick: res.userInfo.nickName,
                        ico: res.userInfo.avatarUrl,
                        gender: res.userInfo.gender,
                        province: res.userInfo.province,
                        city: res.userInfo.city,
                        wxUnionId: _this.$store.state.unionid ? _this.$store.state.unionid :'',
                        noLoginType: 5,
                        openid: _this.$store.state.openId,
                        device: 'mini-program',
                        version: '2.1.1',
                        inviterId: par.inviterId ? par.inviterId : '',
                        biStaffUserName: biStaffUserName ? biStaffUserName : '',
                        shopStoreId: par.shopStoreId ? par.shopStoreId : '',
                        miniPragramEncryptedData:_this.$store.state.unionid ? '' : JSON.stringify(r),
                        shareUsername:shareUsername?shareUsername:'',
                        bargainId:bargainId ? bargainId:'',
                      }
                      _this.$http.postLogin(data).then(res=>{
                        if(res.state==1) {
                          if (res.userinfo.wxUnionId) {
                            if (!_this.$store.state.unionid) {
                              _this.unionid(res.userinfo.wxUnionId);
                            }
                          } else {
                            console.log('wxunionid不存在', res.userinfo.wxUnionId);
                          }
                          if (res.token) {
                            if (pages[0].route.indexOf('index') > -1) {
                              const url = `../../${pages[0].route}`;
                              wx.reLaunch(
                                {
                                  url: url,
                                  success: function (e) {
                                    let page = getCurrentPages().pop()
                                    if (page == undefined || page == null) {
                                      return
                                    }
                                    page.onLoad()
                                  }
                                },
                              );
                            }
                            else if (pages[0].route.indexOf('isCarder') > -1) {
                              const url = `../../${pages[0].route}`;
                              wx.reLaunch(
                                {
                                  url: url,
                                  success: function (e) {
                                    let page = getCurrentPages().pop()
                                    if (page == undefined || page == null) {
                                      return
                                    }
                                    page.onLoad()
                                  }
                                },
                              );
                            }
                            else if (pages[0].route.indexOf('shareCardDetail') > -1) {
                              let url;
                              if (par.scene) {
                                url = `../../${pages[0].route}?scene=${par.scene}`;
                              } else {
                                url = `../../${pages[0].route}?distance=${par.distance}&shareid=${par.shareid}&shopStoreId=${par.shopStoreId}&userId=${par.inviterId}`;
                              }
                              wx.reLaunch({url});
                            }
                            else if (pages[0].route.indexOf('shopRecDet') > -1) {
                              const url = `../../${pages[0].route}?distance=${par.distance}&shopStoreId=${par.shopStoreId}&userId=${par.inviterId}&shopId=${par.shopId}&scene=${par.scene}`;
                              wx.reLaunch({url});
                            }
                            else if (pages[0].route.indexOf('payMoney') > -1) {
                              let biStaffUserName;
                              if (par.scene) {
                                biStaffUserName = sceneArr[0];
                                const url = `../../${pages[0].route}?scene=${par.scene}`;
                                wx.reLaunch({url});
                              }
                              else if(par.q){
                                par.q = decodeURIComponent(par.q);
                                var newObj = par.q.split('?');
                                var newObjMes = newObj[1].split(',');
                                biStaffUserName = newObjMes[0];
                                var scene = newObj[1];
                                const url = `../../${pages[0].route}?${newObj[1]}`;
                                wx.reLaunch({url});
                              }else{
                                wx.navigateBack({delta:1})
                              }
                            }
                            else if(pages[0].route.indexOf('shopdetail') > -1){
                               if(par.scene){
                                 const url = `../../${pages[0].route}?scene=${par.scene}`;
                                 wx.reLaunch({url});
                               }else{
                                 const url = `../../${pages[0].route}?id=${par.id}&userId=${par.inviterId}`;
                                 wx.reLaunch({url});
                               }
                            }
                            else if(pages[0].route.indexOf('cutFree') > -1){
                              const url = `../../${pages[0].route}?status=${par.status}&bargainId=${par.bargainId}&bargainTasksId=${par.bargainTasksId}&storeId=${par.storeId}&userId=${par.userId}&biStaffUserName=${par.biStaffUserName}`;
                              wx.reLaunch({url});
                            }
                            else if(pages[0].route.indexOf('currentStoreAct') > -1){
                               if(par.scene){
                                 const url = `../../${pages[0].route}?scene=${par.scene}`;
                                 wx.reLaunch({url});
                               }
                            }
                            else if(sceneArr[0] == 'cF'){
                              const url = `../../pages/packageC/pages/cutFree/main?status=${sceneArr[1]}&bargainId=${sceneArr[2]}&bargainTasksId=${sceneArr[3]}`;
                              wx.reLaunch({url});
                            }
                            else if(pages[0].route.indexOf('currentStoreLink') > -1){
                              const url = `/pages/packageA/pages/currentStoreLink/main?scene=${par.scene}`;
                              wx.reLaunch({url});
                            }
                            else if(pages[0].route.indexOf('paySuc') > -1){
                              wx.navigateBack({delta:1})
                            }
                            else {
                              const url = `../../${pages[0].route}?id=${par.id}&userId=${par.inviterId}`;
                              wx.reLaunch({url});
                            }
                          } else {
                            console.log('token不存在')
                          }
                          // 在这里保存一下用户的信息  用户的图片  用户的昵称  用户的ID  手机号  邀请人
                          var icon = res.userinfo.ico;
                          var nickCname = res.userinfo.nick;   //昵称
                          var userCname = res.userinfo.username;  //id
                          var userPhone = res.userinfo.phone;
                          var userRole = res.userinfo.userRole;
                          var cityName = res.userinfo.cityName;

                          var leftDate = res.userinfo.memberRestDay;   //剩余多少天
                          var totalDate = res.userinfo.memberScale;    //总天数

                          var attenAccount = res.userinfo.wxServiceNumOpenId;
                          var adzone = res.userinfo.adzone.userId;
                          var rechargeSwitch = res.sysprop.rechargeSwitch;
                          var shopId = res.userinfo.shopId;
                          var phone = res.userinfo.phone;
                          _this.iconImg(icon);
                          _this.nickCname(nickCname);
                          _this.userId(userCname);
                          _this.userPhone(userPhone);
                          _this.userRole(userRole);
                          _this.cityName(cityName);
                          _this.newShopId(shopId);
                          _this.leftDate(leftDate);
                          _this.totalDate(totalDate);
                          _this.token(res.token);
                          _this.appVersion(res.sysprop.appVersion);
                          _this.userLiId(adzone);
                          _this.attenAccount(attenAccount);
                          _this.rechargeSwitch(rechargeSwitch);
                        }else{
                            Tips.toast(`${decodeURIComponent(res.msg)}`,'none');
                        }

                      })
                    }
                  })
                }else{
                  console.log('用户还未授权过');
                }
              }
            })

          },
          back(){
            wx.navigateBack({delta:1});
          },
          getUserInfo1(){
            // 判断小程序的API，回调，参数，组件等是否在当前版本可用。  为false 提醒用户升级微信版本
            if(wx.canIUse('button.open-type.getUserInfo')){
                console.log('用户版本可用');
            }else{
              console.log('请升级微信版本')
            }
          },
          bindGetUserInfo(e) {

            if (e.mp.detail.rawData) {
              //用户按了允许授权按钮
              console.log('用户按了允许授权按钮')
              this.getSetting();
            } else {
              //用户拒绝之后
              console.log('用户按了拒绝按钮')
            }
          }
        }
    }
</script>

<style lang="scss" scoped>
.page{
  width:96%;
  margin:0 2%;
  .zst_img{
    width:100%;
    height:99rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top:120rpx;
    margin-bottom:102rpx;
    img{
      width:299rpx;
      height:100%;
      display: block;
    }
  }
  .zst-wel{
    width:100%;
    text-align: center;
    margin-bottom:84rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size:35rpx;
  }
  .zst_intro{
    overflow: hidden;
    font-size:30rpx;
    margin-bottom:156rpx;
  }
  .confirm_btn{
    width:100%;
    height:96rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 28rpx;
    .btn_con{
      width:500rpx;
      height:100%;
      background:#18ac18;
      border-radius: 20rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #e4e4e4;
      font-size:35rpx;

    }
    .btn_con_cancel{
      width:500rpx;
      height:100%;
      background:#e4e4e4;
      border-radius: 20rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #18ac18;
      font-size:35rpx;

    }
  }
}
</style>
