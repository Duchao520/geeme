<template>
    <div class="index">
        <toast ref="toast" :tip="tip"></toast>
        <div class="pay">
            <div class="business">
                {{storeName}}
            </div>
            <div class="remainMoney">
                当前SVIP卡余额：{{money/100}}元
            </div>
            <div class="inputContainer">
                ￥<input type="tel" pattern="\d*" name="shortprice" v-model="totalMoney" placeholder="请咨询商家后输入">
            </div>
            <div class="payMoney">
                SVIP折扣{{discount*10}}折，实需支付{{(actPay/100).toFixed(2)}}元
            </div>
            <button class="affirm" @click="isSubmit">确认支付</button>
            <div class="tip">注:请与商家收银人员确认消费金额后输入“消费金额”自动享受折扣</div>
        </div>
        <transition name="alertMsg">
            <div class="alert" v-show="orderFlag || remainDef || success || QRCodeFlag">
                <div class="order" v-if="orderFlag">
                    <div class="close" @click="close">
                        <img src="@/assets/imgs/close.png" alt="">
                    </div>
                    <div class="title">订单详情</div>
                    <div class="order-item">消费总金额：{{totalMoney}}元</div>
                    <div class="order-item">SVIP折扣：{{discount*10}}折</div>
                    <div class="order-item">优惠：{{((totalMoney*100-actPay)/100).toFixed(2)}}元</div>
                    <div class="orderMoney">实需支付: <span>{{(actPay/100).toFixed(2)}}元</span></div>
                    <div class="btns">
                        <button>取消</button>
                        <button @click="orderSubmit">立即支付</button>
                    </div>
                </div>
                <div class="remainDef" v-if="remainDef">
                    <div class="close" @click="close">
                        <img src="@/assets/imgs/close.png" alt="">
                    </div>
                    <div class="title">余额不足</div>
                    <p>
                        SVIP卡余额不足
                    </p>
                    <div class="btns">
                        <button @click="qrShow">放弃</button>
                        <button @click="originalPay">原价支付</button>
                    </div>
                </div>
                <div class="success" v-if="success">
                    <div class="close" @click="close">
                        <img src="@/assets/imgs/close.png" alt="">
                    </div>
                    <div class="title">支付成功</div>
                    <div class="order-item">支付方式：会员卡消费</div>
                    <div class="order-item">SVIP卡余额：{{cardDetail.money/100}}元</div>
                    <button @click="close">关闭</button>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import toast from '../toast'
    import QRCode from 'qrcode'
    import axios from 'axios';
    import {svipDetail} from "../../assets/js/comm";
    import {request , chineseFromUtf8Url} from "../../assets/js/jsBridge";
    import * as weixinAliJsBridge from "../../assets/js/weixinAliJsBridge"
    export default {
        name: "index",
        components: {
            toast
        },
        data(){
            return{
                orderFlag: false,
                remainDef: false,
                success: false,
                QRCodeFlag: false,
                totalMoney: '',
                actPay: 0,
                tip:'',
                renewalQR: '',
                appId: '',
                merCid: '',
                wxAppIdKey: '',
                trmNO: '',
                storeName: '',
                storeId: '',
                shopId: '',
                no: '',
                sharecardId: '',
                shareuserId: '',
                code: '',
                money: '',
                discount: '',
                userId: '',
                openid: '',
                cardDetail: ''
            }
        },
        methods: {
            close(){
                var _self = this;
                _self.orderFlag = false;
                _self.remainDef = false;
                _self.success = false;
                _self.QRCodeFlag = false;
            },
            init(){
                var _self = this;
                _self.urlStringInit();
            },
            urlStringInit(){
                var _self = this;
                _self.appId = request['wxAppId'];
                _self.mercId = request['mercId'];
                _self.wxAppIdKey = request['wxAppIdKey'];
                _self.trmNO = request['trmNO'];
                _self.storeName = chineseFromUtf8Url(request['storeName']);
                _self.storeId = request['storeId'];
                _self.shopId = request['shopId'];
                _self.no = request['no'];
                _self.sharecardId = request['sharecardId'];
                _self.shareuserId = request['shareuserId'];
                _self.userId = request['userId'];
                _self.code = request['code'];
                _self.money = request['money'];
                _self.discount = request['discount'] * 100 / 100;
                axios.post('https://sy.tenzhao.com/checkstand/api/userinfo/' + _self.code).then(res => {
                    if(res.data.state == 1){
                        _self.openid = res.data.openId
                    }
                })
            },
            isSubmit(){
                var _self = this;
                if(_self.totalMoney){
                  if(_self.totalMoney <= 1){
                    _self.tip = '支付金额不能小于1元';
                    _self.$refs.toast.toast();
                  }else{
                    _self.orderFlag = true;
                  }
                }else if(!isNaN(_self.totalMoney)){
                    _self.tip = '请输入正确金额';
                    _self.$refs.toast.toast();
                }else{
                    _self.tip = '请输入付费金额';
                    _self.$refs.toast.toast();
                }
            },
            /*支付转交——与微信——支付宝交互*/
            orderSubmit(){
                var _self = this;
                var _type = weixinAliJsBridge.getPayType();
              if(_type == 1){
                    var url = "https://shopapi.tenzhao.com/sapi/svip/aliScanPay?mercId=" + _self.mercId + "&storeId=" + _self.storeId + "&trmNo=" + _self.trmNO + "&no=" + _self.no+ "&amount=" + Number(_self.actPay) + "&totalAmount=" + _self.totalMoney*100 + "&subject=" + "SVIP用户消费" + "&shareuserId=" + _self.shareuserId + "&sharecardId=" + _self.sharecardId + "&userId=" + _self.userId;
                    axios.post(url).then(res => {
                        if(res.data.state == 1){
                            window.location.href = res.data.aliPayUrl;
                        }else if(res.data.state == 900260){
                            _self.close();
                            setTimeout(() => {
                                _self.remainDef = true;
                            },200)
                        }else{
                          _self.tip = res.data.msg;
                          _self.$refs.toast.toast();
                        }
                    })
                }else if(_type == 2){
                    /*var params = "mercId=" + _self.mercId + "&storeId=" + _self.storeId + "&trmNo=" + _self.trmNO + "&no=" + _self.no + "&amount=" + Number(_self.actPay) + "&totalAmount=" + _self.totalMoney*100 + "&subject=" + "SVIP用户消费" + "&shareuserId=" + _self.shareuserId + "&sharecardId=" + _self.sharecardId + "&userId=" + _self.userId + "&openid=" + _self.openid;
                    var redirect_uri = 'https://wechat.tenzhao.com/newland/svipPay/svipPay.html?' + params;
                    window.location.href = redirect_uri;*/
                    var url = "https://shopapi.tenzhao.com/sapi/svip/pubSigPay?storeId="+ _self.storeId+"&trmNo="+ _self.trmNO + "&amount=" + Number(_self.actPay)+ "&totalAmount=" + _self.totalMoney*100 + "&mercId=" +
                        _self.mercId +"&openid=" + _self.openid+'&subject=SVIP用户消费' + "&no=" + _self.no + "&shareuserId=" + _self.shareuserId + "&sharecardId=" + _self.sharecardId + "&userId=" + _self.userId;
                    axios.post(url).then(res => {
                        if(res.data.state == 1){
                            var data = res.data;
                            _self.wxPay(data);
                        }else if(res.data.state == 900260){
                            _self.close();
                            setTimeout(() => {
                                _self.remainDef = true;
                            },200)
                        }else{
                          _self.tip = res.data.msg;
                          _self.$refs.toast.toast();
                        }

                    })
                }else if(_type == 3){

                }
            },
            originalPay(){
                var _self = this;
                var _type = weixinAliJsBridge.getPayType();
                if(_type == 1){
                    var url = "https://shopapi.tenzhao.com/sapi/svip/aliScanPay?mercId=" + _self.mercId + "&storeId=" + _self.storeId + "&trmNo=" + _self.trmNO + "&no=" + _self.no+ "&amount=" + _self.totalMoney*100 + "&totalAmount=" + _self.totalMoney*100 + "&subject=" + "SVIP用户消费" + "&shareuserId=" + _self.shareuserId + "&sharecardId=" + _self.sharecardId + "&userId=" + _self.userId;
                    axios.post(url).then(res => {
                        if(res.data.state == 1){
                            window.location.href = res.data.aliPayUrl;
                        }else if(res.data.state == 900260){
                            _self.close();
                            setTimeout(() => {
                                _self.remainDef = true;
                            },200)
                        }else{
                          _self.tip = res.data.msg;
                          _self.$refs.toast.toast();
                        }
                    })
                }else if(_type == 2){
                    /*var params = "mercId=" + _self.mercId + "&storeId=" + _self.storeId + "&trmNo=" + _self.trmNO + "&no=" + _self.no + "&amount=" + Number(_self.actPay) + "&totalAmount=" + _self.totalMoney*100 + "&subject=" + "SVIP用户消费" + "&shareuserId=" + _self.shareuserId + "&sharecardId=" + _self.sharecardId + "&userId=" + _self.userId + "&openid=" + _self.openid;
                    var redirect_uri = 'https://wechat.tenzhao.com/newland/svipPay/svipPay.html?' + params;
                    window.location.href = redirect_uri;*/
                    var url = "https://shopapi.tenzhao.com/sapi/svip/pubSigPay?storeId="+ _self.storeId+"&trmNo="+ _self.trmNO + "&amount=" + _self.totalMoney*100+ "&totalAmount=" + _self.totalMoney*100 + "&mercId=" +
                        _self.mercId +"&openid=" + _self.openid+'&subject=SVIP用户消费' + "&no=" + _self.no + "&shareuserId=" + _self.shareuserId + "&sharecardId=" + _self.sharecardId + "&userId=" + _self.userId;
                    axios.post(url).then(res => {
                        if(res.data.state == 1){
                            var data = res.data;
                            _self.wxPay(data);
                        }else if(res.data.state == 900260){
                            _self.close();
                            setTimeout(() => {
                                _self.remainDef = true;
                            },200)
                        }else{
                          _self.tip = res.data.msg;
                          _self.$refs.toast.toast();
                        }
                    })
                }else if(_type == 3){

                }
            },
            getCardDetail(){
                var _self = this;
                var _data = {
                    shareCardId: _self.sharecardId
                };
                axios.get('https://shopapi.tenzhao.com/sapi/voip/cashier/svip/balance?shareCardId=' + _self.sharecardId).then(res => {
                    if(res.data.state == 1){
                        _self.cardDetail = res.data.data;
                        _self.success = true;
                    }
                })
            },
            wxPay(_data){
                var _self = this;
              if(_data.state == 1) {
                    var data = _data.data;
                    var _appId = data.apiAppid;
                    var timeStamp = data.apiTimestamp;
                    var nonceStr = data.apiNoncestr;
                    var package1 = data.apiPackage;
                    var signType = data.apiSigntype;
                    var paySign = data.apiPaysign;
                    var pay_time = data.sysTime;
                    var order_no = data.orderNo;
                    function onBridgeReady() {
                        WeixinJSBridge.invoke(
                            'getBrandWCPayRequest', {
                                "appId": _appId, //公众号名称，由商户传入
                                "timeStamp": timeStamp, //时间戳，自1970年以来的秒数
                                "nonceStr": nonceStr, //随机串
                                "package": package1,
                                "signType": signType, //微信签名方式：
                                "paySign": paySign //微信签名
                            },
                            function(res) {

                                if(res.err_msg == "get_brand_wcpay_request:ok") {
                                    //TODO 成功后的页面跳转
                                    _self.close();
                                    _self.getCardDetail();
                                } else if(res.err_msg == "get_brand_wcpay_request:cancel") {
                                  _self.tip = '取消支付';
                                  _self.$refs.toast.toast();
                                    /*WeixinJSBridge.invoke('closeWindow', {}, function(res) {

                                    });*/
                                } else {
                                    console.log(res.err_msg)
                                    console.log(res.err_desc)
                                    console.log("失败")
                                    alert("失败");
                                }
                            }
                        );
                    }
                    if(typeof WeixinJSBridge == "undefined") {
                        if(document.addEventListener) {
                            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                        } else if(document.attachEvent) {
                            document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                        }
                    } else {
                        onBridgeReady();
                    }
                }
            },
            qrShow(){
                var _self = this;
                _self.close();
            }
        },
        watch: {
            totalMoney(){
                var _self = this;
                _self.actPay = Math.round(_self.totalMoney * _self.discount * 10000/100);
              if(_self.actPay <= 0.01){
                  _self.actPay = _self.totalMoney * 100
                }
            }
        },
        mounted(){
            var _self = this;
            _self.init();
            QRCode.toDataURL('188701', {errorCorrectionLevel: 'H'}, function (err, url) {
                _self.renewalQR = url;
            })
        }
    }
</script>

<style lang="scss" scoped>
    .index{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #F1F1F1;
        box-sizing: border-box;
        padding: .28rem .15rem;
        .pay{
            width: 100%;
            height: 6.85rem;
            background: #FFFFFF;
            .business{
                font-size: .33rem;
                padding: .22rem .45rem .48rem;
            }
            .remainMoney{
                font-size: .25rem;
                padding: 0 .45rem .5rem;
            }
            .inputContainer{
                width: 6.79rem;
                margin: 0 auto;
                border-bottom: .02rem solid #EBECEE;
                box-sizing: border-box;
                padding: .29rem .32rem;
                display: flex;
                font-size: .4rem;
                align-items: flex-end;
                font-weight: bold;
                input{
                    font-size: .5rem;
                    display: block;
                    width: 100%;
                }
                input::placeholder{
                    font-size: .4rem;
                    text-align: center;
                }
            }
            .payMoney{
                font-size: .3rem;
                color:rgba(13,13,15,1);
                padding: .22rem .5rem .65rem;
            }
            .affirm{
                width: 6.69rem;
                height: .91rem;
                border-radius: .07rem;
                display: block;
                background:rgba(247,9,77,1);
                color: #FFFFFF;
                font-size: .41rem;
                margin: 0 auto;
            }
            .tip{
                font-size: .28rem;
                box-sizing: border-box;
                padding: .2rem;
            }
        }
        .alert{
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(12,12,12,.5);
            .order{
                width: 6rem;
                height: 7.3rem;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                margin: auto;
                background: #FFFFFF;
                border-radius: .2rem;
                box-sizing: border-box;
                padding: .88rem .28rem;
                .close{
                    width: .55rem;
                    height: .54rem;
                    position: absolute;
                    top: -.79rem;
                    right: -.28rem;
                    img{
                        display: block;
                        width: 100%;
                        height: 100%;
                    }
                }
                .title{
                    font-size: .38rem;
                    font-weight: bold;
                    text-align: center;
                    margin-bottom: .8rem;
                }
                .order-item{
                    font-size: .34rem;
                    padding-left: .31rem;
                }
                .orderMoney{
                    font-size: .34rem;
                    margin-top: .9rem;
                    padding-left: .31rem;
                    margin-bottom: .71rem;
                    span{
                        font-weight: bold;
                    }
                }
                .btns{
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    button{
                        display: block;
                        width: 2.5rem;
                        height: .8rem;
                        border-radius: .1rem;
                        font-size: .36rem;
                        color: #FFFFFF;
                    }
                    button:first-child{
                        background: #FEB623;
                    }
                    button:last-child{
                        background: #F7094D;
                    }
                }
            }
            .remainDef{
                width: 6rem;
                height: 4.36rem;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                margin: auto;
                background: #FFFFFF;
                border-radius: .2rem;
                box-sizing: border-box;
                padding: .88rem .28rem 0;
                .close{
                    width: .55rem;
                    height: .54rem;
                    position: absolute;
                    top: -.79rem;
                    right: -.28rem;
                    img{
                        display: block;
                        width: 100%;
                        height: 100%;
                    }
                }
                .title{
                    font-size: .38rem;
                    font-weight: bold;
                    text-align: center;
                    margin-bottom: .51rem;
                }
                p{
                    box-sizing: border-box;
                    padding: 0 .31rem;
                    font-size: .34rem;
                    margin-bottom: .37rem;
                }
                .btns{
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    button{
                        display: block;
                        width: 2.5rem;
                        height: .8rem;
                        border-radius: .1rem;
                        font-size: .36rem;
                        color: #FFFFFF;
                    }
                    button:first-child{
                        background: #FEB623;
                    }
                    button:last-child{
                        background: #F7094D;
                    }
                }
            }
            .success{
                width: 6rem;
                height: 5.14rem;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                margin: auto;
                background: #FFFFFF;
                border-radius: .2rem;
                box-sizing: border-box;
                padding: .88rem .28rem 0;
                .close{
                    width: .55rem;
                    height: .54rem;
                    position: absolute;
                    top: -.79rem;
                    right: -.28rem;
                    img{
                        display: block;
                        width: 100%;
                        height: 100%;
                    }
                }
                .title{
                    font-size: .38rem;
                    font-weight: bold;
                    text-align: center;
                    margin-bottom: .51rem;
                }
                .order-item{
                    font-size: .34rem;
                    padding-left: .31rem;
                }
                button{
                    display: block;
                    width: 4rem;
                    height: .8rem;
                    background: #F7094D;
                    color: #FFFFFF;
                    font-size: .36rem;
                    border-radius: .1rem;
                    margin: 1.04rem auto 0;
                }
            }
            .QRCode{
                width: 4rem;
                height: 4rem;
                border-radius: .08rem;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                margin: auto;
                background: #FFFFFF;
                img{
                    display: block;
                    width: 100%;
                    height: 100%;
                    border-radius: .08rem;
                }
                .close{
                    width: .55rem;
                    height: .54rem;
                    position: absolute;
                    top: -.79rem;
                    right: -.28rem;
                    img{
                        display: block;
                        width: 100%;
                        height: 100%;
                    }
                }
            }
        }
    }
</style>
