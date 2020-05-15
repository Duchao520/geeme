<template>
  <div class="page">
    <div class="top_bac"></div>
    <div class="back_index" @click="backIndex">
      <img src="/static/img/common/back_index.png" alt="">
    </div>
    <div class="page_btn">
      <div style="float:right;font-size: 24rpx;color:rgba(52,60,83,0.6);width:30%;display: flex;flex-direction: column;justify-content: center;align-items: center;" @click="shoucan">
        <i v-if="detaildata.isCollection == 0" class="iconfont icon-shoucang-tianchong" style="float: left;color:#D2D2D2;font-size: 36rpx;line-height: 36rpx;margin-bottom:6rpx;">
        </i>
        <i v-else class="iconfont icon-shoucang-tianchong" style="float: left;color:#F7094D;font-size: 36rpx;line-height: 36rpx;margin-right:10rpx;margin-bottom:6rpx;">
        </i>
        {{collectState}}
      </div>
      <!--<div class="page_left">-->
      <!--<div class="left_icon">-->
      <!--<i class="iconfont icon-fenxiang"></i>-->
      <!--</div>-->
      <!--<div class="right_icon" @click="shareIt(detaildata)">-->
      <!--<div style="font-size: 36rpx;color:#fff;">分享好友</div>-->
      <!--<div style="font-size: 24rpx;color:#fff;">分享赚{{(shareCard.commissionRate * 1000)/10}}%佣金</div>-->
      <!--</div>-->

      <!--</div>-->
      <div class="page_right" @click="goPayMoney">
        <div style="font-size: 36rpx;color:#fff;">立即付款</div>
      </div>
    </div>


    <div class="share_card_top">
      <div class="new_share_card">
        <div class="new_share_top">
          <div class="sh_ca_mid">
            <div class="all_le">
              <div class="card_img">
                <img :src="detaildata.storeLogo" alt="">
              </div>
              <div class="card_name" style="color:#353535;">
                {{detaildata.storeName}}
              </div>
            </div>
            <div class="sh_ca_ri" @click="showuse">
              <div style="float: left;margin-right:8rpx;">如何使用卡主</div>
              <i class="iconfont icon-ziyuan2"></i>
            </div>
          </div>
          <div class="new_all_ri" style="line-height: 74rpx;">
            <div class="text_new_all">
              <span style="font-size: 140rpx;color:#fff;font-weight:bold;">{{shareCard.shareCardDiscount * 1000/100 ?shareCard.shareCardDiscount * 1000/100:''}}</span>
              <span style="font-size: 30rpx;color:#fff;margin-left:16rpx;">折</span>
              <span class="notice" style="font-size: 24rpx;border:2rpx solid #72421B;color:#fff;padding:4rpx 8rpx;">会员折扣</span>
            </div>
          </div>
          <div style="width:100%;text-align: center;color:#353535;">可打折余额：{{shareCard.money}}元 </div>
          <div class="sh_ca_bot">
            <div style="width: 480rpx;display: flex;color:#353535;">
              <div style="width:320rpx;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;margin-right:20rpx;">持卡人:{{shareCard.realName}}</div>
              <div style="width:240rpx;">使用次数：{{detaildata.consumeAmount}}</div>
            </div>
            <div class="card_Type" style="width:160rpx;height:48rpx;">
              <img style="width:100%;height:100%;display: block;" src="../../static/img/card_logo.png" alt="">
            </div>
          </div>
        </div>
      </div>

      <div class="new_share_bot">
        <div class="card_bot">
          <div class="ca_bot_le">
            <i class="iconfont icon-dizhi2" style="float: left;font-size: 46rpx;color:rgba(229,229,229,1);margin-right:10rpx;"></i>
            <div style="float: left;color:#000;width:500rpx;padding-right:16rpx;" @click="goShopMap">
              <div style="float: left;font-size: 24rpx;">
                <span style="margin-right:14rpx;"> {{detaildata.address}}</span>  {{distance}}km
                <i class="iconfont icon-iconfontjiantou5" style="display:inline;font-size: 24rpx;"></i>
              </div>
            </div>
          </div>
          <div class="ca_bot_ri" @click="ordPhone">
            <i class="iconfont icon-dianhua2" style="color:#666666;"></i>
          </div>
        </div>
      </div>
      <div class="text_me">
        使用分享会员卡付款，非储值会员也能享受会员折扣价
      </div>
      <div class="sec_me">
        分享会员卡使用流程
      </div>
      <div class="thr_img">
        <img src="https://zhushangtong.oss-cn-hangzhou.aliyuncs.com/guide/2019/9/5/64ca8db0aef5ed02e83decde90bbc034.png " alt="">
      </div>
      <div class="text_me">
        分享会员卡给好友，好友可享受会员折扣，您还有奖金
      </div>
      <div class="thr_img" style="height:132rpx;">
        <img src="https://zhushangtong.oss-cn-hangzhou.aliyuncs.com/guide/2019/9/5/18c3df8a9dabc107e9b6ac85a9800a9c.png " alt="">
        <div class="four_num">{{(shareCard.commissionRate * 1000)/10}}%</div>
      </div>
      <div class="sec_me">
        会员卡使用流程
      </div>
      <div class="top_inner" style="background: #55AE21;">
        <div class="ico_inn">
          <i style="color:#fff;margin-right:10rpx;" class="iconfont icon-wechat"></i>
          <span style="font-size: 20rpx;color:#fff;">分享给微信好友</span>
        </div>
        <div class="no_notice">
          <span style="width:500rpx;">直接点击通过微信分享给好友或微信群，好友消费您即可获得奖励。</span>
          <button class="no_re_btn" style="background:linear-gradient(0deg,rgba(85,174,33,1),rgba(116,209,52,1));padding:0;margin-left:16rpx;" open-type="share"><i>去分享</i></button>
        </div>
      </div>
      <div class="top_inner" style="background: #F29B76;margin-top:136rpx;margin-bottom:136rpx;">
        <div class="ico_inn">
          <i style="color:#fff;margin-right:10rpx;" class="iconfont icon-icon1"></i>
          <span style="font-size: 20rpx;color:#fff;">面对面扫码</span>
        </div>
        <div class="no_notice">
          <span style="width:500rpx;">点击获取二维码，好友当面扫码，消费后您即可获得奖励</span>
          <button class="no_re_btn" style="background:linear-gradient(0deg,rgba(242,155,118,1),rgba(255,181,149,1));padding:0;margin-left:16rpx;" @click="faceScan(detaildata)"><i>去扫码</i></button>
        </div>
      </div>
      <div class="top_inner" style="background: #5EA0D9;margin-top:136rpx;margin-bottom:400rpx;">
        <div class="ico_inn">
          <i style="color:#fff;margin-right:10rpx;" class="iconfont icon-tupian"></i>
          <span style="font-size: 20rpx;color:#fff;">获取分享海报</span>
        </div>
        <div class="no_notice">
          <span style="width:500rpx;">点击获取【推广海报】，保存到相册，可通过微信发给好友或群，也可分享朋友圈，您的好友消费您就会获得。</span>
          <button class="no_re_btn" style="background:linear-gradient(0deg,rgba(94,160,217,1),rgba(136,195,247,1));padding:0;margin-left:16rpx;" @click.stop="postGene(detaildata)"><i>去分享</i></button>
        </div>
      </div>
    </div>
    <!--使用说明的弹出层-->
    <div class="use_intro_pop" v-if="showBool">
      <div class="pop_con">
        <div class="close_img" @click="closePop">
          <img src="/static/img/close.png" alt="">
        </div>
        <div class="pop_title">
          <div>如何使用卡主</div>
          <div class="heng_xian"></div>
        </div>

        <div class="pop_con_con">
          <div class="pop_con_fir">
            <div class="img_fir">
              1
            </div>
            <div class="con_con_con">
              <div class="fir_title">关于使用时间</div>
              <div class="fir_con">{{useintro.useDateStr===''? '无':useintro.useDateStr}}</div>
            </div>
          </div>

          <div class="pop_con_fir">
            <div class="img_fir">
              2
            </div>
            <div class="con_con_con">
              <div class="fir_title">关于使用时间段</div>
              <div class="fir_con">{{useintro.useTimeRange === ''? '无':useintro.useTimeRange}}</div>
            </div>
          </div>

          <div class="pop_con_fir">
            <div class="img_fir">
              3
            </div>
            <div class="con_con_con">
              <div class="fir_title">关于活动使用说明</div>
              <div class="fir_con">{{useintro.remark == ''? '无':useintro.remark}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--弹出层-->
    <div class="sha_mask" v-if="showItMask" :animation="slide_up1"  @click="showItEve">
    </div>
    <!--微信小程序二维码分享按钮-->
    <div class="ewm_mask" v-if="showEwm">

      <div class="sha_bot">
        <div class="close_ewm" @click="closeEwm">
          <img src="/static/img/close.png" alt="">
        </div>
        <div class="sha_tit_top">
          <div class="tit_img">
            <img :src="currentPar.storeLogo" alt="">
          </div>
          <div class="tit_tit">{{currentPar.storeName}}</div>
        </div>

        <div class="sha_tit_mid">
          <div class="ewm_img">
            <img :src="qrCode" alt="">
          </div>
        </div>
        <div class="sha_tit_bot">
          微信扫码卡主付款享{{currentPar.shareCard.shareCardDiscount * 1000/100}}折
        </div>
      </div>
    </div>

    <!--生成海报-->
    <div class="creatPos_mask"  v-if="showPos">
      <canvas class="canvas-hide" canvas-id="myCanvas" :style="{width: width +'px', height: height + 'px'}"></canvas>
      <div class="sha_bot">
        <div class="close_ewm" @click="closePos">
          <img src="/static/img/close.png" alt="">
        </div>
        <div class="poster_img">
          <div class="inner_pos">
            <img :src="bjtempFilePath" alt="">
          </div>

          <div class="save_img" @click="saveImgs">
            <div class="save_inner">
              保存图片
            </div>
          </div>
          <div class="save_tex">保存图片到相册，分享给好友</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import { getSignIn , getQuery ,base64src,base64Name} from '@/common/js/comm';
    import Tips from '@/common/js/tips';
    var amapFile = require('@/utils/amap-wx');
    import { mapMutations } from 'vuex'
    import { SHARECARDID , ISCOUPON ,ISSELECTCARD ,ISSVIPCARD ,COLLECTION}  from '@/store/mutation-types'
    import Exif from '@/common/js/myexif'
    var myAmapFun;
    export default {
        name: "index",
        data(){
            return {
                shareid:'',
                shopStoreId:'',
                distance:'',
                collection:'',
                useintro:'',
                detaildata:'',
                shareCard:'',
                token:'',
                showBool:false,
                longitude:'',
                latitude:'',
                currentItemId:0,
                images:[],
                indicatorDots: false,
                vertical: false,
                autoplay: false,
                interval: 3000,
                duration: 1000,
                imgNum:2,
                inviterId:'',
                discountInfo:'',

                showItMask:false,
                showEwm:false,
                showPos:false,
                width:375,
                height:667,
                currentPar:'',
                qrCode:'',
                bjtempFilePath:'',
                shareUsername:'',
                shareuserId:'',
                scene:'',
                collectState:'收藏此卡'
            }
        },
        mounted(){
            this.newcollection(2);
            console.log(this.$store.state.collection);
            var par = getQuery();
            if(par.scene) {
                this.scene = par.scene;
                par.scene = decodeURIComponent(par.scene);
                let newArr = par.scene.split(',');
                this.shopStoreId = newArr[0];
                this.shareid = newArr[1];
                this.shareUsername = newArr[2];
            }else{
                this.shareid = par.shareid;
                this.shopStoreId = par.shopStoreId;
                this.distance = par.distance ? par.distance:'';
            }
            this.token = this.$store.state.token;
            if(par.inviterId) {
                this.inviterId = par.inviterId;
            }
            else if(par.userId){
                this.inviterId = par.userId;
            }else{
                this.inviterId ='';
            }
            if(this.token){
                this.getDetail();
                this.getLocations();
            }else{
                let url;
                if(par.scene) {
                    url = `../../../../pages/loginpage/main?scene=${par.scene}`;
                }else{
                    url = `../../../../pages/loginpage/main?distance=${this.distance}&shareid=${this.shareid}&shopStoreId=${this.shopStoreId}&inviterId=${this.inviterId}&shareUsername=${this.shareUsername}`;
                }
                wx.navigateTo({url})
            }
            myAmapFun = new amapFile.AMapWX({key:'9bf5c08983bd73953f73c20b89899b33'});
        },
        onUnload(){

        },
        methods:{
            ...mapMutations({
                shareCardMes:'SHARECARDID',
                isCoupon:'ISCOUPON',
                isSelectCard:'ISSELECTCARD',
                isSvipCard:'ISSVIPCARD',
                newcollection:'COLLECTION'
            }),
            goShopMap(){
                this.formSubmit();
            },
            formSubmit() {
                var _this = this;
                wx.getLocation({//获取当前经纬度
                    type: 'wgs84', //返回可以用于wx.openLocation的经纬度，官方提示bug: iOS 6.3.30 type 参数不生效，只会返回 wgs84 类型的坐标信息
                    success: function (res) {
                        wx.openLocation({//​使用微信内置地图查看位置。
                            latitude: Number(_this.latitude),//要去的纬度-地址
                            longitude: Number(_this.longitude),//要去的经度-地址
                            name: _this.detaildata.address,
                            address: _this.detaildata.address
                        })
                    }
                })
            },
            backIndex(){
                wx.switchTab({
                    url:'../../../../pages/index/main'
                })
            },
            closePop(){
                this.showBool = false;
            },
            goPayMoney(){
                var _this = this;
                _this.shareCardMes(_this.shareid);
                _this.isCoupon(0);
                _this.isSelectCard(3);
                if(_this.shopId != '1554363195') {
                    wx.navigateTo({
                        url: `../../pages/payMoney/main?sharecardId=${_this.shareid}&shopStoreId=${_this.shopStoreId}&inviterId=${_this.inviterId}&identification=svipCard&shareuserId=${_this.shareuserId}`
                    })
                }else{
                    let userId = _this.inviterId ?_this.inviterId : _this.shareuserId;
                    Tips.confirm('该商家需要扫结算二维码结算(结算商家打印小票上的二维码)','提示',{}).then(res=>{
                        wx.scanCode({
                            success (res) {
                                wx.navigateTo({
                                    url:`/pages/packageA/pages/lakeWater/main?result=${res.result}&shareCardId=${_this.shareid}&shareuserId=${userId}`
                                })
                                console.log(res.result)
                            }
                        })
                    })
                }
            },
            getImgDetail(par){
                var _this = this;
                wx.previewImage({
                    current: par, // 当前显示图片的http链接
                    urls: _this.images // 需要预览的图片http链接列表
                })
            },
            nameToespe(str,frontLen,endLen) {
                var len = str.length-frontLen-endLen;
                var xing = '';
                for (var i=0;i<len;i++) {
                    xing+='*';
                }
                return str.substring(0,frontLen)+xing+str.substring(str.length-endLen);
            },
            getDetail(){
                var _this = this;
                var _data = {
                    token:_this.token,
                    shareCardId:_this.shareid,
                    shopStoreId:_this.shopStoreId,
                    shareUsername:_this.shareUsername?_this.shareUsername :'',
                }
                getSignIn(_data).then(sec=>{
                    _this.$http.getShDetail(_data,sec).then(res=>{
                        if(res.state ==1) {
                            _this.collection = res.data.isCollection;
                            if(_this.collection==0){
                                _this.collectState = '收藏此卡'
                            }else{
                                _this.collectState = '取消收藏'
                            }
                            _this.useintro = res.data.svipCardActives[0];
                            _this.detaildata = res.data;
                            _this.currentPar = res.data;
                            _this.shareIt();
                            _this.shopId = res.data.shopId;
                            _this.longitude = res.data.longitude;
                            _this.latitude = res.data.latitude;
                            _this.discountInfo = res.data.discountInfo;
                            res.data.shareCard.money = (res.data.shareCard.money / 100).toFixed(2);
                            res.data.shareCard.realName = _this.nameToespe(String(res.data.shareCard.realName),1,0);
                            console.log(res.data.shareCard.realName);
                            _this.shareCard = res.data.shareCard;
                            _this.shareuserId = res.data.shareuserId;
                            let images = res.data.storeImgs.split(',');
                            if(images[images.length-1] == ""){
                                _this.images = [];
                                for (let i=0;i<images.length-1;i++) {
                                    _this.images.push(images[i]);
                                }
                            }else if(images[images.length-1] != ""){
                                _this.images = [];
                                for (let i=0;i<images.length;i++) {
                                    _this.images.push(images[i]);
                                }
                            }
                            if (_this.images.length == 1) {
                                _this.imgNum = 1;
                            }
                        }else if(res.state == '900284'){
                            wx.redirectTo(
                                {
                                    url:`/pages/packageD/pages/notFound/main?msg=${res.msg}`
                                }
                            )
                        }else if(res.state=='10000'){
                            if(this.scene) {
                                const url = `../../../../pages/loginpage/main?scene=${this.scene}`;
                                wx.navigateTo({url})
                            }else{
                                const url = `../../../../pages/loginpage/main?distance=${this.distance}&shareid=${this.shareid}&shopStoreId=${this.shopStoreId}&inviterId=${this.inviterId}`;
                                wx.navigateTo({url})
                            }
                        }else{
                            Tips.toast(`${res.msg}`,'none');
                        }
                    })
                })
            },
            getLocations(){
                let _this = this
                wx.getSetting({
                    success(res) {
                        // 判断用户是否授权过，
                        // 未授权过、
                        if (!res.authSetting['scope.userLocation']) {
                            wx.authorize({
                                scope: 'scope.userLocation',
                                success(res) {
                                    _this.wxGetLocation()
                                },
                                fail(err) {
                                    // 当用户拒绝 查看自己的位置的时候  统计数据
                                    // 统计数据  地理位置为空

                                }
                            })
                        } else {
                            // 授权过    百度地图转火星
                            _this.bd_decrypt(Number(_this.longitude),Number(_this.latitude));
                        }
                    },
                    fail(err) {
                        console.log(err)
                    }
                });
            },
            bd_decrypt(bd_lon,bd_lat) {
                var X_PI = Math.PI * 3000 / 180;
                var x = bd_lon - 0.0065;
                var y = bd_lat - 0.006;
                var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
                var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
                var gg_lon = z * Math.cos(theta);
                var gg_lat = z * Math.sin(theta);
                this.wxGetLocation(gg_lon,gg_lat);
            },
            wxGetLocation(lng,lat){
                var _this = this;
                wx.getLocation({
                    type: 'wgs84',
                    success: function (res) {
                        let latitude,longitude;
                        latitude = res.latitude.toString();
                        longitude = res.longitude.toString();
                        myAmapFun.getDrivingRoute({
                            origin: `${longitude},${latitude}`,
                            destination: `${lng},${lat}`,
                            success: function(data){
                                _this.distance = (data.paths[0].distance /1000).toFixed(2);
                            }
                        })
                    },
                    fail: function(err) {
                        console.log(err);
                    }
                });
            },
            ordPhone(){
                var _this = this;
                wx.makePhoneCall({
                    phoneNumber:_this.detaildata.mobilePhone  //仅为示例，并非真实的电话号码
                })
            },
            shoucan(){
                var _this =this;
                var collectState;
                if(_this.collection === 1){
                    collectState = '0';
                    _this.collectState = '收藏此卡'
                }else{
                    collectState = '1';
                    _this.collectState = '取消收藏'
                }
                var _data = {
                    token:_this.$store.state.token,
                    collection:collectState,
                    shopStoreId:_this.shopStoreId,
                    shareCardId:_this.shareid
                }
                getSignIn(_data).then(res=>{
                    var sec = res;
                    _this.$http.collectionPag(_data,sec).then((res)=>{
                        if(res.state ==1) {
                            if(collectState ==1){
                                Tips.toast('收藏成功','success');
                            }else{
                                Tips.toast('已取消收藏','none')
                            }
                            this.getDetail();
                        }else{
                            Tips.toast(`${res.msg}`,'none');
                        }
                    })
                })
            },
            showuse(){
                this.showBool = true;
            },
            shareIt(par){
                var _this = this;
                _this.getMinMes();
            },
            postGene(par){
                this.showPos = true;
                var _this = this;
                _this.currentPar = par;
                Tips.loading('生成中...');
                var ctx= wx.createCanvasContext('myCanvas');
                ctx.setFillStyle('#ffffff');
                ctx.fillRect(0, 0, _this.width, _this.height);
                wx.downloadFile({
                    url: 'https://zhushangtong.oss-cn-hangzhou.aliyuncs.com/guide/2019/9/16/aff44efea53e27a2d5fb471408db026f.png',
                    success(res) {
                        console.log(res);
                        if(res.statusCode== 200){
                            ctx.drawImage(res.tempFilePath, 0 , 0, _this.width, _this.height);
                            ctx.setFontSize(14);
                            ctx.fillStyle="#ffffff";
                            ctx.fillText(`你的好友 ${_this.$store.state.nickCname} 分享给您一张会员共享卡`,30,30);
                            ctx.save();
                            _this.downloadLogoFile(par.storeLogo,ctx);
                        }
                    }
                })
            },
            downloadLogoFile(imghref,ctx){
                var _this = this;
                wx.downloadFile({
                    url: imghref,
                    success(res){
                        if(res.statusCode== 200) {
                            _this.shopLogo = res.tempFilePath;
                            ctx.setFontSize(13);
                            ctx.fillStyle="#000000";
                            ctx.fillText(`${_this.currentPar.storeName}`, 100, 110);

                            ctx.setFontSize(12);
                            ctx.fillStyle="#666666";
                            // ctx.fillText(`${_this.currentPar.address}`, 100, 140);
                            _this.wrapText(ctx,`${_this.currentPar.address}`,100,136,136,20)



                            ctx.font = 'normal bold 70rpx sans-serif';
                            var grd = ctx.createLinearGradient(30, 10, 120, 10);
                            ctx.setFillStyle('#613817');
                            if((String(_this.shareCard.shareCardDiscount*10)).indexOf('.') >-1) {
                                ctx.fillText(`${_this.shareCard.shareCardDiscount * 1000 / 100}`, 230, 140);
                            }else{
                                ctx.fillText(`${_this.shareCard.shareCardDiscount * 1000 / 100}`, 280, 140);
                            }

                            ctx.setFontSize(12);
                            ctx.setFillStyle('#613817');
                            ctx.fillText(`折`,330,140);
                            console.log('没有这俩个信息',_this.currentPar);
                            //持卡人
                            ctx.setFontSize(15);
                            ctx.fillStyle="#353535";
                            _this.wrapText(ctx,`共享人：${_this.currentPar.shareCard.realName}(${_this.currentPar.shareCard.username})`,30,210,340,20)

                            ctx.arc(60, 120, 30, 0 , Math.PI * 2, false);
                            ctx.fill();
                            ctx.clip();
                            ctx.drawImage(_this.shopLogo, 30 , 90, 60, 60);
                            _this.dowloadEwmFile(_this.qrCode,ctx)

                        }
                    },
                    fail(res){
                        return res;
                    }
                })
            },
            dowloadEwmFile(imghref,ctx){
                var _this = this;
                wx.downloadFile({
                    url: imghref,
                    success(res){
                        if(res.statusCode == 200){
                            ctx.restore();
                            ctx.drawImage(res.tempFilePath, 204 , 514, 120, 120);
                            ctx.draw(true,_this.canvaToimg);
                        }
                    }
                })
            },
            getMinMes(){
                var _this = this;
                var _data = {
                    token:_this.$store.state.token,
                    sharecardId:_this.shareid,
                    distance:_this.currentPar.distance,
                    shopStoreId:_this.shopStoreId
                }
                getSignIn(_data).then(sec=>{
                    _this.$http.getMinMes(_data,sec).then(res=>{
                        if(res.state==1){
                            _this.qrCode = res.data.qrCode;
                        }else{
                            Tips.toast(`${res.msg}`,'none');
                        }
                    })
                })
            },
            //自动唤行
            wrapText(context,text, x, y, maxWidth, lineHeight) {
                if (typeof text != 'string' || typeof x != 'number' || typeof y != 'number') {
                    return;
                }

                var canvas = context.canvas;
                if (typeof maxWidth == 'undefined') {
                    maxWidth = (canvas && canvas.width) || 300;
                }
                if (typeof lineHeight == 'undefined') {
                    lineHeight = (canvas && parseInt(window.getComputedStyle(canvas).lineHeight)) || parseInt(window.getComputedStyle(document.body).lineHeight);
                }

                // 字符分隔为数组
                var arrText = text.split('');
                var line = '';
                var second_height = y + lineHeight;
                var ry = y;

                for (var n = 0; n < arrText.length; n++) {
                    var testLine = line + arrText[n];
                    var metrics = context.measureText(testLine);
                    var testWidth = metrics.width;
                    if (testWidth > maxWidth && n > 0) {
                        ry += lineHeight;
                        if (ry > second_height) {
                            line = line.slice(0, -1);
                            line = line + ' ...';
                            context.fillText(line, x, y);
                            return;
                        }
                        context.fillText(line, x, y);
                        line = arrText[n];
                        y += lineHeight;
                    } else {
                        line = testLine;
                    }
                }
                context.fillText(line, x, y);
            },

            showItEve(){
                this.showItMask = false;
            },
            closeMask(){
                this.showItMask = false;
            },
            faceScan(par){
                this.showEwm = true;
            },
            closeEwm(){
                this.showEwm = false;
                this.showItMask = false;
            },
            closePos(){
                this.showPos = false;
                this.showItMask = false;
            },
            //绘制canvas

            //下载logo图片到本地  并且绘制
            canvaToimg(){
                var _this = this;
                wx.canvasToTempFilePath({
                    x: 0,
                    y: 0,
                    width: 375,
                    height: 667,
                    destWidth: 1125,
                    destHeight: 2001,
                    canvasId: "myCanvas",
                    success: function(e) {
                        _this.bjtempFilePath = e.tempFilePath;  // 拿到要保存的图片路径
                        Tips.loaded();
                    },
                    fail: function(e) {
                        console.log(e);
                    }
                })
            },
            saveImgs(){
                var _this = this;
                wx.saveImageToPhotosAlbum({
                    filePath: _this.bjtempFilePath,
                    success(result) {
                        if(result.errMsg == "saveImageToPhotosAlbum:ok"){
                            Tips.toast('保存成功','none')
                        }
                    },
                    fail(res){
                        Tips.toast('保存失败','none');
                    }
                })

            },
        },
        onShareAppMessage(res){
            if (res.from === 'button') {
                console.log('啦啦啦德玛西亚',res.target);
            }
            return {
                title:`【${this.detaildata.storeName}】点击卡主付款,最低享受${this.shareCard.shareCardDiscount * 1000/100}折优惠`,
                path:`pages/packageB/pages/shareCardDetail/main?distance=${this.distance}&shareid=${this.shareid}&shopStoreId=${this.shopStoreId}&inviterId=${this.$store.state.userLiId}`,
                imageUrl:`${this.images[0]}`,
                success:function(res){
                    console.log('成功转发的消息',res)
                },
                fail:function(res){
                    console.log('失败转发的消息',res)
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
  .page{
    width:100%;
    position: absolute;
    left:0;
    right:0;
    overflow-x:hidden ;
    .top_bac{
      width:750px;
      height:410px;
      background:rgba(247,9,77,1);
      border-radius:50%;
      position: absolute;
      left:-375rpx;
      top:-506rpx;
    }
    .sha_mask{
      width:100vw;
      height:100vh;
      background:rgba(0,0,0,0.2);
      position: fixed;
      left:0;
      top:0;
      z-index: 1;
      .sha_bot{
        position: absolute;
        width:100%;
        bottom:0;
        left:0;
        height:334rpx;
        background:#fff;
        border-radius:20rpx 20rpx 0 0;
        .sha_bot_top{
          width:100%;
          height:232rpx;
          border-bottom:2rpx solid rgba(229,229,229,1);
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius:20rpx 20rpx 0 0;
          .sha_bot_inner{
            width:630rpx;
            height:233rpx;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .eve_inner{
              display: flex;
              align-items: center;
              flex-direction: column;
              .eve_img{
                width:100rpx;
                height:100rpx;
                border-radius: 50%;
                margin-bottom:30rpx;
                display: flex;
                justify-content: center;
                align-items: center;
                i{
                  color:#fff;
                  font-size: 48rpx;
                }
                img{
                  width:100%;
                  height:100%;
                  display: block;
                }
              }
              .eve_tit{
                font-size: 24rpx;
                color:#8D8E98;
              }
            }
          }
        }
        .sha_bot_bot{
          width:100%;
          height:98rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          color:#8D8E98;
          font-size: 36rpx;
        }
      }
    }
    .ewm_mask{
      width:100vw;
      height:100vh;
      background:rgba(0,0,0,0.3);
      position: fixed;
      left:0;
      top:0;
      z-index: 2;
      .sha_bot{
        position: absolute;
        width:100%;
        bottom:0;
        left:0;
        height:848rpx;
        background:#fff;
        border-radius:20rpx 20rpx 0 0;
        .close_ewm{
          position: absolute;
          right:36rpx;
          top:-80rpx;
          width:54rpx;
          height:54rpx;
          img{
            width:100%;
            height:100%;
            display: block;
          }

        }
        .sha_tit_top{
          width:630rpx;
          padding:0 60rpx;
          height:80rpx;
          display: flex;
          align-items: center;
          margin-bottom:96rpx;
          margin-top:40rpx;
          .tit_img{
            width:80rpx;
            height:80rpx;
            background:#ff6700;
            border-radius: 50%;
            margin-right:40rpx;
            img{
              width:100%;
              height: 100%;
              display:block;
              border-radius: 50%;
            }
          }
          .tit_tit{
            font-size:36rpx;
          }
        }
        .sha_tit_mid{
          width:100%;
          height:450rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          .ewm_img{
            width:450rpx;
            height:450rpx;
            background:yellowgreen;
            img{
              width:100%;
              height:100%;
              display: block;
            }
          }
        }
        .sha_tit_bot{
          width:100%;
          text-align: center;
          color:#AF7651;
          font-size:36rpx;
          margin-top:56rpx;
        }
      }
    }

    .creatPos_mask{
      width:100vw;
      height:100vh;
      background:rgba(0,0,0,0.3);
      position: fixed;
      left:0;
      top:0;
      z-index: 2;
      .canvas-hide{
        position: fixed;
        left:-375px;
        top:0;
        z-index: 999;
      }
      .sha_bot{
        position: absolute;
        width:100%;
        bottom:0;
        left:0;
        height:1046rpx;
        background:#EEEEEE;
        border-radius:20rpx 20rpx 0 0;
        .close_ewm{
          position: absolute;
          right:36rpx;
          top:-80rpx;
          width:54rpx;
          height:54rpx;
          img{
            width:100%;
            height:100%;
            display: block;
          }

        }
      }
      .poster_img{
        width:100%;
        height:780rpx;
        margin-top:50rpx;
        .inner_pos{
          width:426rpx;
          margin:0 162rpx;
          background:#fff;
          border-radius: 10rpx;
          height:100%;
          margin-bottom:40rpx;
          img{
            width:100%;
            height:100%;
            display: block;
            border-radius: 10rpx;
          }
        }
        .save_img{
          width:100%;
          height:90rpx;
          display: flex;
          justify-content: center;
          align-items:center;
          margin-bottom:16rpx;
          .save_inner{
            width:470rpx;
            height:90rpx;
            background:#F7094D;
            font-size: 40rpx;
            color:#FFFFFF;
            line-height: 90rpx;
            text-align:center;
            border-radius: 6rpx;
          }
        }
        .save_tex{
          width:100%;
          text-align: center;
          font-size: 30rpx;
          color:#8D8E98;
        }
      }
    }
    .back_index{
      position: fixed;
      width:116rpx;
      height:116rpx;
      display: block;
      left:40rpx;
      bottom:104rpx;
      z-index:1;
      img{
        width:100%;
        height:100%;
        display: block;
      }
    }
    .li{
      width: 340rpx;
      height: 210rpx;
    }
    .li1{
      width: 346rpx;
      margin: 0 auto;
      border-radius: 10rpx;
      height: 196rpx;
      transform: scale(0.9);
      img{
        width:316rpx;
        height:196rpx;
        border-radius: 10rpx;
      }
    }
    .share_card_top{
      width:710rpx;
      margin:0 20rpx;
      position: relative;
      .new_share_card{
        width:100%;
        /*height:390rpx;*/
        box-shadow:0 3rpx 15rpx 3rpx rgba(0, 0, 0, 0.17);
        opacity:1;
        border-radius:10rpx;
        overflow: hidden;
        margin-top: 44rpx;
        .new_share_top{
          width:100%;
          background:linear-gradient(270deg,rgba(255,197,90,1),rgba(255,206,99,1),rgba(255,221,114,1));
          border-radius: 10rpx 10rpx 0 0;
          float: left;
          padding-bottom:20rpx;
          .sh_ca_top{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top:24rpx;
            margin-bottom:16rpx;
            padding:0 20rpx;
            .sh_ca_le{
              font-size: 36rpx;
              color:#fff;
              font-weight: bold;
              background:linear-gradient(85deg,rgba(213,156,57,1) 0.2685546875%, rgba(247,236,162,1) 53.1005859375%, rgba(206,144,46,1) 96.8994140625%);
              -webkit-background-clip:text;
              -webkit-text-fill-color:transparent;
            }

          }
          .sh_ca_mid{
            width:670rpx;
            height:100rpx;
            padding:0 20rpx;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom:40rpx;
            padding-top:20rpx;
            .all_le{
              display: flex;
              align-items: center;
              .card_img{
                width:100rpx;
                height:100rpx;
                background:#F7094D;
                border-radius: 50%;
                margin-right:10rpx;
                img{
                  display: block;
                  width:100%;
                  height:100%;
                  border-radius: 50%;
                }
              }
              .card_name{
                color:#fff;
                font-size: 36rpx;
                width:280rpx;
                @include ovh
              }
            }
            .sh_ca_ri{
              color:#fff;
              background:rgba(0,0,0,0.1);
              height:58rpx;
              padding:0 30rpx;
              font-size: 24rpx;
              display: flex;
              align-items: center;
              border-radius: 24rpx;
              i{
                font-size: 30rpx;
                font-weight: bold;
                float: left;
              }
            }

          }
          .new_all_ri{
            width:100%;
            display: flex;
            justify-content: center;
            align-items: center;

            .text_new_all{
              line-height: 76rpx;
              position: relative;
              span{
                background:linear-gradient(0deg,rgba(114,66,27,1) 0%, rgba(208,146,66,1) 100%);
                -webkit-background-clip:text;
                -webkit-text-fill-color:transparent;
              }
              .notice{
                display: block;
                position: absolute;
                right:-88rpx;
                top:12rpx;
                line-height: 32rpx;
              }
            }
          }
          .sh_ca_bot{
            display:flex;
            justify-content: space-between;
            color:#fff;
            padding:0 20rpx;
            font-size: 28rpx;
          }
        }

      }
      .new_share_bot{
        width:100%;
        /*height:80rpx;*/
        overflow: hidden;
        margin-top:30rpx;
        box-shadow:0 0 10rpx 0 rgba(210,210,210,0.54);
        border-radius:20rpx;
        .card_bot{
          width:100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding:8rpx 0;
          border-bottom:2rpx solid rgba(229,229,229,1);
          .ca_bot_le{
            display: flex;
            align-items: center;
          }
          .ca_bot_ri{
            width:100rpx;
            height:58rpx;
            display:flex;
            justify-content: center;
            align-items: center;
            border-left:2rpx solid rgba(229,229,229,1);
            i{
              color:#FE054C;
              font-size: 50rpx;
            }
          }
        }
      }
      .sh_title{
        width:100%;
        height:80rpx;
        display: flex;
        align-items: center;
        .sh_tit_img{
          width:80rpx;
          height:80rpx;
          background:#f6f6f6;
          border-radius: 50%;
          margin-right:26rpx;
          img{
            width:100%;
            height:100%;
            display: block;
            border-radius: 50%;
          }
        }
        .sh_tit_ri{
          font-size: 36rpx;
          font-weight:400;
        }
      }
      .text_me{
        width:680rpx;
        padding:0 15rpx;
        font-size: 26rpx;
        color:#8F5C28;
        font-weight:bold;
        margin-top:30rpx;
      }
      .sec_me{
        font-size: 22rpx;
        color:#C18765;
        padding-left:15rpx;
        margin-top:30rpx;
        margin-bottom:24rpx;
      }
      .top_inner{
        width:220rpx;
        height: 74rpx;
        background:#5EA0D9;
        border-radius:16rpx;
        position: relative;
        .ico_inn{
          display: flex;
          align-items: center;
          line-height: 38rpx;
          padding-left:10rpx;
        }
      }
      .no_notice{
        position: absolute;
        left:0;
        top: 20rpx;
        width:670rpx;
        font-size: 24rpx;
        margin-top:20rpx;
        padding:20rpx;
        background:rgba(255,247,233,1);
        border-radius: 10rpx;
        line-height:48rpx;
        margin-bottom:40rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .btn_right{
          background:linear-gradient(0deg,rgba(94,160,217,1),rgba(136,195,247,1));
          box-shadow:0px 2px 5px 0px rgba(210,210,210,0.54);
          border-radius:25px;
          font-size: 24rpx;
          color:rgba(255,255,255,1);
          padding:4rpx 26rpx;
        }
      }
      .no_re_btn{
        height:60rpx;
        background:rgba(246,15,81,1);
        box-shadow:0 1px 3px 0 rgba(206,11,47,0.43);
        border-radius:30rpx;
        display: flex;
        justify-content: space-around;
        align-items: center;
        font-size: 24rpx;
        width:170rpx;
        i{
          line-height:60rpx;
          color:#fff;
          align-items: center;
          margin-right:8rpx;
        }
        div{
          color:#fff;
          margin-left:-8rpx;
        }
      }
      .thr_img{
        width:700rpx;
        height:114rpx;
        margin-left:5rpx;
        position: relative;
        img{
          width:100%;
          height:100%;
          display: block;
        }
        .four_num{
          position: absolute;
          right:66rpx;
          top:10rpx;
          font-size: 50rpx;
          background:linear-gradient(180deg,rgba(255,255,255,1) 0%, rgba(252,226,178,1) 100%);
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          font-weight: bold;
        }
      }
      .card_bot{
        width:100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding:16rpx 0;
        border-bottom:2rpx solid rgba(229,229,229,1);
        .ca_bot_le{
          display: flex;
          align-items: center;
        }
        .ca_bot_ri{
          width:100rpx;
          height:58rpx;
          display:flex;
          justify-content: center;
          align-items: center;
          border-left:2rpx solid rgba(229,229,229,1);
          i{
            color:#FE054C;
            font-size: 50rpx;
          }
        }
      }
      .share_card{
        width:610rpx;
        height:212rpx;
        background:linear-gradient(0deg,rgba(169,110,255,1),rgba(128,195,250,1));
        border:1px solid rgba(196, 235, 255, 1);
        border-radius:20rpx;
        margin:28rpx 0;
        padding:0 50rpx;
        .sh_ca_top{
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top:24rpx;
          margin-bottom:16rpx;
          .sh_ca_le{
            font-size: 36rpx;
            color:#fff;
            font-weight: bold;
          }
          .sh_ca_ri{
            color:#fff;
            background:rgba(112,58,233,0.1);
            padding:0 30rpx;
            font-size: 24rpx;
            display: flex;
            align-items: center;
            border-radius: 24rpx;
            i{
              font-size: 30rpx;
              font-weight: bold;
              float: left;
            }
          }
        }
        .sh_ca_bot{
          width:100%;
          height:96rpx;
          display: flex;
          justify-content: space-between;

          .sh_bot_le{
            .ca_top{
              position: relative;
              width:186rpx;
              height:8rpx;
              background:rgba(64,57,151,1);
              .ca_bot{
                position: absolute;
                top:4rpx;
                left:6rpx;
                width:174rpx;
                height:94rpx;
                background:rgba(85,110,235,1);
                border-bottom-left-radius:10rpx;
                border-bottom-right-radius:10rpx;
                display:flex;
                justify-content: center;
                align-items: center;
                color:#fff;
                .ca_dis{
                  font-size: 74rpx;
                  margin-right:6rpx;
                }
                .ca_title{
                  font-size: 36rpx;
                  margin-bottom:-10rpx;
                }
              }
            }


          }
          .sh_bot_ri{
            .top_title{
              font-size: 28rpx;
              color:#fff;
              overflow: hidden;
              span{
                display: block;
                float: left;
                @include ovh;
              }
            }
            .top_con{
              font-size: 28rpx;
              color:#fff;
            }
          }
        }
      }
      .sha_peo{
        width:100%;
        height:48rpx;
        /*display: flex;*/
        /*align-items: center;*/
        /*justify-content: space-between;*/
        margin-bottom:28rpx;
        .sha_peo_le{
          font-size: 28rpx;
          float: left;
          margin-left:20rpx;
        }
        .sha_peo_ri{
          float: right;
          margin-right:20rpx;
          height:48rpx;
          background:rgba(255,180,21,1);
          box-shadow:0 4rpx 16rpx 0 rgba(206,11,47,0.43);
          border-radius:10rpx;
          display:flex;
          justify-content: space-around;
          align-items: center;
          padding:0 10rpx;
          i{
            margin-left:14rpx;
            line-height: 48rpx;
          }
        }
      }
      .carder_pay{
        width:710rpx;
        height:80rpx;
        background:#F60F51;
        color:#fff;
        box-shadow:0 1px 3px 0 rgba(206,11,47,0.43);
        border-radius:10rpx;
        line-height: 80rpx;
        text-align: center;
        margin-bottom:40rpx;
      }
    }
    .use_intro_pop{
      position: fixed;
      left:0;
      right:0;
      bottom:0;
      top:0;
      background:rgba(0,0,0,0.6);
      z-index: 100;
      .close_img{
        width:56rpx;
        height:54rpx;
        position: absolute;
        right:-30rpx;
        top:-80rpx;
        z-index: 102;
        img{
          display: block;
          width:100%;
          height:100%;
        }
      }
      .pop_con{
        position: fixed;
        left:0;right:0;
        bottom:224rpx;
        width:600rpx;
        height:700rpx;
        background:#fff;
        margin:auto;
        z-index: 999;
        border-radius: 20rpx;
        .pop_title{
          width:100%;
          height:52rpx;
          /*background:#ff6700;*/
          margin-top:52rpx;
          font-size: 36rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          div{
            background:linear-gradient(0deg,rgba(239,170,132,1) 0.2685546875%, rgba(127,80,44,1) 100%);
            -webkit-background-clip:text;
            -webkit-text-fill-color:transparent;
            font-weight: 700;
          }
          .heng_xian{
            width:200rpx;
            height:2rpx;
            background:linear-gradient(0deg,rgba(239,170,132,1) 0.2685546875%, rgba(127,80,44,1) 100%);
            margin-top:2rpx;
          }
        }

        .pop_con_con{
          width:560rpx;
          margin-top:72rpx;
          margin-left:20rpx;
          .pop_con_fir{
            overflow: hidden;
            margin-bottom:66rpx;
            .img_fir{
              width:36rpx;
              height:36rpx;
              float: left;
              line-height:36rpx;
              background:linear-gradient(0deg,rgba(239,170,132,1) 0.2685546875%, rgba(127,80,44,1) 100%);
              display: flex;
              justify-content: center;
              align-items: center;
              border-radius: 50%;
              font-size: 24rpx;
              color:#fff;
              img{
                width:100%;
                height:100%;
                display: block;
              }
            }
            .con_con_con{
              float: left;
              margin-left:20rpx;
              width:480rpx;
              .fir_title{
                font-size: 34rpx;
                color:#000;
              }
              .fir_con{
                font-size: 28rpx;
                color:#000;
              }
            }
          }
        }
      }
    }
    .page_btn{
      width:100%;
      height:100rpx;
      display: flex;
      justify-content: space-between;
      position: fixed;
      bottom:0;
      left: 0;
      z-index: 1;
      background:#fff;
      .page_left{
        width:30%;
        background:#FDB300;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .left_icon{
          padding-left:30rpx;
          i{
            color:#fff;
            font-size: 44rpx;
          }
        }
        .right_icon{
          padding-right:36rpx;
          display: flex;
          align-items: center;
          flex-direction: column;
          flex-wrap: wrap;
          color:#fffff;
        }
      }
      .page_right{
        width:500rpx;
        height:80rpx;
        background:#F7094D;
        display: flex;
        align-items: center;
        justify-content: center;
        color:#fffff;
        margin-top:10rpx;
        border-radius: 20rpx;
        margin-right:30rpx;
      }
    }
  }
</style>
