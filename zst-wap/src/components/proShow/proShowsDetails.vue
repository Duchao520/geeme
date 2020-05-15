<template>
    <div class="proShowsDetails" ref="viewScroll" id="viewScroll">
        <div class="load" v-if="!applyFlag1">

        </div>
        <div class="top" v-if="proShowsDetails.isTaskExit && !proShowsDetails.isPublisher">
            <div class="left">领取任务.赚{{proShowsDetails.singleMoney}}{{proShowsDetails.taskType == 1 ? '现金' : '话呗'}}</div>
            <div class="right" @click="getTask"></div>
        </div>
        <div style="height: .8rem" v-if="proShowsDetails.isTaskExit && !proShowsDetails.isPublisher"></div>
        <div class="showsAbout" v-bind="proShowsDetails" v-if="applyFlag1">
            <div class="showTitle"><span>{{proShowsInfo.goodsName}}</span></div>
            <div class="showInfo">
                <div class="category" :class="{
                furniture:proShowsInfo.goodsTypeId==100004,
                skinCare:proShowsInfo.goodsTypeId==100000,
                keepHealth:proShowsInfo.goodsTypeId==100001,
                dress:proShowsInfo.goodsTypeId==100002,
                food:proShowsInfo.goodsTypeId==100003,
                maternal:proShowsInfo.goodsTypeId==100005,
                service:proShowsInfo.goodsTypeId==100006,
                outlineShop:proShowsInfo.goodsTypeId==100007}"
                >{{proShowsInfo.goodsTypeName}}</div>
                <div class="time">{{proShowsInfo.time}}</div>
                <div class="views iconfont icon-liulan">{{proShowsInfo.readCount > 10000 ? Math.floor(proShowsInfo.readCount/10000) : proShowsInfo.readCount}}{{proShowsInfo.readCount > 10000 ? '万' : ''}}</div>
                <div class="praise iconfont icon-dianzan">{{proShowsInfo.praiseCount > 10000 ? Math.floor(proShowsInfo.praiseCount/10000) : proShowsInfo.praiseCount}}{{proShowsInfo.praiseCount > 10000 ? '万' : ''}}</div>
            </div>
            <div class="personInfo">
                <div class="left">
                    <div class="headPortrait">
                        <img :src="proShowsDetails.publishIco" alt="">
                    </div>
                    <div class="nickname">
                        <p>{{proShowsDetails.publishNick}}</p>
                        <span>加我了解更多~</span>
                    </div>
                </div>
                <span class="wechat iconfont icon-8" @click="contact">
                    联系TA
                </span>
            </div>
        </div>
        <div class="contentDetails" v-if="applyFlag1">
            <div v-html="proShowsInfo.goodsRemark" style="width:100%" class="remark" ref="remark"></div>
            <!--<div style="width: 100%;height: 2rem;"></div>-->
        </div>
        <div class="thumb" v-for="thumb in proShowsDetails.imgUrls" :key="thumb" v-if="applyFlag1">
            <img v-lazy="thumb" alt="">
        </div>
        <!--<div style="height: .9rem;"></div>-->
        <transition name="alertMsg" v-if="applyFlag1">
            <div class="alert" v-show="showExceptional||showContact||showTask||exceptSuc||shareSuc||searchTaskFlag">
                <div class="exceptional" v-if="showExceptional">
                    <div class="close" @click="close">
                        <img src="@/assets/imgs/common/close.png" alt="">
                    </div>
                    <div class="title">打赏TA</div>
                    <p>这篇产品很优秀,必须给个赏金啊<br>TA已被打赏了{{proShowsInfo.beRewardMoney}}话呗</p>
                    <div class="moneyInput">
                        打赏<input type="number" @blur="oninput" placeholder="输入数值" v-model="consumeCallfee">话呗
                    </div>
                    <!--<p style="margin-bottom: 0;color:#ff0049;" v-if="successCallfee && tipFlag">成功打赏{{successCallfee}}话呗</p>-->
                    <p style="margin-bottom: 0;color:#ff0049;" v-if="!successCallfee && tipFlag">{{tip}}</p>
                    <div class="btns">
                        <button class="cancel" @click="close">取消</button>
                        <button class="confirm" @click="reward">确认打赏</button>
                    </div>
                </div>
                <div class="contact" v-if="showContact">
                    <div class="close" @click="close">
                        <img src="@/assets/imgs/common/close.png" alt="">
                    </div>
                    <div class="headPic">
                        <img :src="proShowsDetails.publishIco" alt="">
                    </div>
                    <p class="tel">{{proShowsInfo.replacePhone}}</p>
                    <p class="tip">可通过微信或手机联系TA</p>
                    <div class="wechat-phone">
                        <div class="icon wechat">
                            <i class="iconfont icon-8"></i>
                            <span>{{proShowsInfo.wxAccount}}</span>
                        </div>
                        <div class="icon phone">
                            <i class="iconfont icon-shouji"></i>
                            <span>{{proShowsInfo.replacePhone}}</span>
                        </div>
                    </div>
                    <div class="btns">
                        <button class="copyBtn cancel" :data-clipboard-text="proShowsInfo.wxAccount" @click="copy">复制微信号</button>
                        <button class="copyBtn confirm" :class="{confirm:proShowsInfo.phone,notPhone:!proShowsInfo.phone}" @click="tel(proShowsInfo.phone)">立即拨号</button>
                    </div>
                    <transition name="alertMsg">
                        <div class="alertMsg" v-show="copyFlag">{{copyStatus}}</div>
                    </transition>
                </div>
                <div class="getTask" v-if="showTask">
                    <div class="close" @click="close">
                        <img src="@/assets/imgs/common/close.png" alt="">
                    </div>
                    <div class="title">领任务</div>
                    <p>只要分享微信好友或朋友圈,即可获得{{proShowsDetails.singleMoney}}{{proShowsDetails.taskType == 1 ? '现金' : '话呗'}}</p>
                    <p class="existing">已有{{receiverCount}}人领取任务</p>
                    <p class="tip" style="margin-bottom: .2rem">每个产品秀每人只限领取一次任务</p>
                    <p class="tip" style="margin-bottom: 0" v-if="msg">{{msg}}</p>
                    <div class="btns">
                        <button class="cancel" @click="close">以后再说</button>
                        <button class="confirm" @click="share">立即分享</button>
                    </div>
                </div>
                <div class="exceptSuc" v-if="exceptSuc">
                    <div class="close" @click="close">
                        <img src="@/assets/imgs/common/close.png" alt="">
                    </div>
                    <div class="bg">
                        <img src="@/assets/imgs/proShow/exceptSuc.png" alt="">
                    </div>
                    <div class="money">{{successCallfee}}话呗</div>
                    <div class="receive">{{proShowsInfo.replacePhone}}已收到您的打赏</div>
                    <button @click="close">关闭</button>
                </div>
                <div class="shareSuc" v-if="shareSuc">
                    <p>分享成功,恭喜你得到</p>
                    <i>{{proShowsDetails.singleMoney}}{{proShowsDetails.taskType == 1 ? '现金' : '话呗'}}</i>
                    <button @click="close"></button>
                </div>
                <div class="isTask" v-if="searchTaskFlag">
                    <div class="close" @click="close">
                        <img src="@/assets/imgs/common/close.png" alt="">
                    </div>
                    <div class="tipTitle">
                        温馨提示
                    </div>
                    <p>您暂时未设置任务,您可以进入编辑,设置任务</p>
                </div>
            </div>
        </transition>
        <div class="end" v-if="applyFlag1">
            <i></i>
            <span>END</span>
            <i></i>
        </div>
        <div class="content">
            <transition name="slideFoot">
                <div class="foot" v-show="footFlag && openType!==3 && !proShowsDetails.isPublisher">
                    <div class="praiseRate">好评{{proShowsDetails.praiseRate}}</div>
                    <div class="praise iconfont icon-dianzan" @click="evaluate(1)" v-model="proShowsInfo.praiseCount" :class="{zan:proShowsDetails.evaluateType==1}">{{proShowsInfo.praiseCount > 10000 ? Math.floor(proShowsInfo.praiseCount/10000) : proShowsInfo.praiseCount}}{{proShowsInfo.praiseCount > 10000 ? '万' : ''}}</div>
                    <div class="praise iconfont icon-chaping" @click="evaluate(-1)" v-model="proShowsInfo.negativeCount" :class="{bad:proShowsDetails.evaluateType==-1}">{{proShowsInfo.negativeCount > 10000 ? Math.floor(proShowsInfo.negativeCount/10000) : proShowsInfo.negativeCount}}{{proShowsInfo.negativeCount > 10000 ? '万' : ''}}</div>
                    <div class="btns">
                        <button class="exceptional iconfont icon-shujuku" @click="exceptional">打赏TA</button>
                        <button class="contact iconfont icon-8" @click="contact">联系TA</button>
                    </div>
                </div>
            </transition>
            <transition name="slideFoot">
                <footer class="outside" v-show="footFlag && openType==3">
                    <div class="left">
                        <i>
                            <img src="@/assets/imgs/proShow/shopIcon_3.png" alt="">
                        </i>
                        <div class="desc">
                            <p>打造属于自己的产品秀</p>
                            <span>为自己代言</span>
                        </div>
                    </div>
                    <div class="right" @click="enterZST">
                        打开助商通
                    </div>
                </footer>
            </transition>
            <transition name="slideFoot">
                <footer class="mine" v-show="footFlag && openType!==3 && proShowsDetails.isPublisher">
                    <div class="mine-item" @click="clickEvent(1)">
                        <i>
                            <img src="@/assets/imgs/proShow/edit_mine.png" alt="">
                        </i>
                        编辑
                    </div>
                    <div class="mine-item" @click="clickEvent(2)">
                        <i>
                            <img src="@/assets/imgs/proShow/task_mine.png" alt="">
                        </i>
                        看任务
                    </div>
                    <div class="mine-item" @click="clickEvent(3)">
                        <i>
                            <img src="@/assets/imgs/proShow/huabei.png" alt="">
                        </i>
                        看赏金
                    </div>
                    <div class="mine-item" @click="clickEvent(4)">
                        <i>
                            <img src="@/assets/imgs/proShow/share_mine.png" alt="">
                        </i>
                        分享
                    </div>
                </footer>
            </transition>
        </div>
    </div>
</template>

<script>
    import {externalView,getProDetails,evaluate,reward} from '@/assets/js/comm';
    import Clipboard from 'clipboard';
    import BScroll from 'better-scroll';
    import wx from 'weixin-js-sdk';
    import axios from 'axios';
    import {getUserAgentType,proShowReportBtn,getSignIn,shareInterface,postZSTTel,releaseProShow,noReportBtn,
        postImgAndroid,postStrAndroid,postShareContentIOS,postTitle} from "@/assets/js/jsBridge";

    export default {
        name: "proShowsDetails",
        props: ['tokenPromise'],
        data(){
            return{
                showExceptional: false,
                showContact: false,
                showTask: false,
                exceptSuc: false,
                shareSuc:false,
                showId: '',
                proShowsDetails: '',
                proShowsInfo: '',
                token: '',
                consumeCallfee: '',
                successCallfee: '',
                tipFlag: false,
                tip: '',
                msg: '',
                taskFlag: 0,
                openType: '',
                receiverCount: '',
                copyFlag: false,
                copyStatus: '',
                footFlag: false,
                _scrollTop: '',
                timer: false,
                applyFlag1: false,
                searchTaskFlag: false
            }
        },
        methods:{
            exceptional(){
                let _self = this;
                _self.showExceptional = true;
            },
            contact(){
                let _self = this;
                _self.showContact = true;
            },
            getTask(){
                let _self = this;
                _self.showTask = true;
            },
            close(){
                let _self = this;
                _self.showExceptional = false;
                _self.showContact = false;
                _self.showTask = false;
                _self.exceptSuc = false;
                _self.shareSuc = false;
                _self.searchTaskFlag = false;
            },
            init(){
                let _self = this;
                _self.showId = _self.$route.query.proId;
                _self.getProDetails();
            },
            /*获取产品秀详情*/
            getProDetails(){
                let _type = getUserAgentType();
                let _self = this;
                if(_type == 3){
                    let _data = {
                        showId: _self.showId
                    };
                    externalView(_data).then(res => {
                        _self.proShowsDetails = res.data.data;
                        _self.proShowsDetails.imgUrls = _self.proShowsDetails.imgUrls.slice(3);
                        _self.proShowsInfo = res.data.data.show;
                        _self.proShowsInfo.time = _self.timeShift(_self.proShowsInfo.createTime);
                        _self.proShowsInfo.replacePhone = _self.phoneShift(_self.proShowsInfo.phone);
                        _self.proShowsDetails.isTask = 1;
                        window.document.title = _self.proShowsInfo.goodsName;
                        postTitle(_self.proShowsInfo.goodsName);
                        _self.applyFlag1 = true;
                    })
                }else{
                    let _data = {
                        token: _self.token,
                        showId: _self.showId
                    };
                    getSignIn(_data).then(sec => {
                        getProDetails(_data,sec).then(res => {
                            if(res.data.state == 1){
                                _self.proShowsDetails = res.data.data;
                                _self.proShowsDetails.imgUrls = _self.proShowsDetails.imgUrls.slice(3);
                                // console.log(_self.proShowsDetails.imgUrls);
                                _self.proShowsInfo = res.data.data.show;
                                _self.proShowsInfo.time = _self.timeShift(_self.proShowsInfo.createTime);
                                _self.proShowsInfo.replacePhone = _self.phoneShift(_self.proShowsInfo.phone);
                                _self.proShowsDetails.isTask = 1;
                                _self.receiverCount = res.data.data.receiverCount;
                                window.document.title = _self.proShowsInfo.goodsName;
                                postTitle(_self.proShowsInfo.goodsName);
                            }
                            _self.applyFlag1 = true;
                        })
                    })
                }
            },
            /*点赞踩*/
            evaluate(evaluateType){
                let _self = this;
                // console.log(evaluateType);
                if(evaluateType == _self.proShowsDetails.evaluateType){

                }else{
                    let _data = {
                        token: _self.token,
                        showId: _self.proShowsInfo.id,
                        type: evaluateType
                    };
                    getSignIn(_data).then(sec => {
                        evaluate(_data,sec).then(res => {
                            if(res.data.state == 1){
                                if(evaluateType == 1){
                                    if(_self.proShowsDetails.evaluateType==0){
                                        _self.proShowsInfo.praiseCount++;
                                    }else{
                                        _self.proShowsInfo.praiseCount++;
                                        _self.proShowsInfo.negativeCount--;
                                        console.log(_self.proShowsInfo.praiseCount);
                                    }
                                }else{
                                    if(_self.proShowsDetails.evaluateType==0){
                                        _self.proShowsInfo.negativeCount++
                                    }else{
                                        _self.proShowsInfo.negativeCount++;
                                        _self.proShowsInfo.praiseCount--;
                                        console.log(_self.proShowsInfo.praiseCount);
                                    }
                                }
                                _self.proShowsDetails.evaluateType = evaluateType
                            }else{

                            }
                        })
                    })
                }
            },
            enterZST(){
                let _self = this;
                var url = window.location.href;
                window.location.href = 'https://ax4eod.mlinks.cc/ABiL?inviterId=' + _self.proShowsInfo.userId + "&url=" + url
            },
            /*打赏*/
            reward(){
                let _self = this;
                if(_self.consumeCallfee>0){
                    let _data = {
                        token: _self.token,
                        showId: _self.showId,
                        consumeCallfee: _self.consumeCallfee
                    };
                    getSignIn(_data).then(sec => {
                        reward(_data,sec).then(res => {
                            console.log(res.data);
                            if(res.data.state == 1){
                                _self.successCallfee = _self.consumeCallfee;
                                _self.showExceptional = false;
                                setTimeout(() => {
                                    _self.exceptSuc = true;
                                },600);
                                _self.getProDetails();
                                _self.consumeCallfee = '';
                            }else{
                                _self.tip = res.data.msg;
                                _self.successCallfee = '';
                            }
                        })
                    })
                }else{
                    _self.tip = '打赏金额请大于0'
                }
                _self.tipFlag = true;
            },
            /*分享*/
            share(){
                shareInterface();
            },
            shareCallback(status){
                let _self = this;
                if(status){
                    _self.taskFlag = 1;
                }
            },
            oninput(){
                let _self = this;
                if(_self.consumeCallfee == 0){
                    _self.consumeCallfee = ''
                }else{
                    _self.consumeCallfee = Number(_self.consumeCallfee).toFixed(2);
                }
            },
            shareInit(){
                let _self = this;
                let _data = {
                    url: window.location.href.split('#')[0]
                };
                axios.get('https://zst.tenzhao.com/api/voip/wechat/signature',{params:{'url':window.location.href}})
                    .then(res => {
                    var signature = res.data;
                    wx.config({
                        debug: false,
                        appId: signature.appid,
                        timestamp: signature.timestamp,
                        nonceStr: signature.noncestr,
                        signature: signature.signature,
                        jsApiList: [
                            'checkJsApi',
                            'onMenuShareTimeline',
                            'onMenuShareAppMessage',
                            'onMenuShareQQ',
                            'onMenuShareWeibo',
                            'onMenuShareQZone',
                            'hideMenuItems',
                            'showMenuItems'
                        ]
                    });
                    wx.ready(() => {
                        var shareData = {
                            title: _self.proShowsInfo.goodsName,
                            desc: _self.$refs.remark.innerText,
                            link: window.location.href,
                            imgUrl: _self.proShowsDetails.imgUrls[0],
                            success:function(){

                            },
                            cancel: function () {
                                alert('分享到朋友取消');
                            }
                        };
                        wx.onMenuShareAppMessage(shareData);
                        wx.onMenuShareTimeline(shareData);
                        wx.onMenuShareQQ(shareData);
                        wx.onMenuShareWeibo(shareData);
                        wx.onMenuShareQZone(shareData);
                        wx.checkJsApi({
                            jsApiList: [
                                'checkJsApi'
                            ], // 需要检测的JS接口列表，所有JS接口列表见附录2,
                            success: function(res) {
                                // 以键值对的形式返回，可用的api值true，不可用为false
                                // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
                            }
                        });
                    });
                    wx.error(function (res) {
                        alert(res.errMsg);
                    });
                })
            },
            /*时间转换*/
            timeShift(timestamp){
                let _self = this;
                var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                var Y = date.getFullYear() + '-';
                var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                var D = date.getDate() + ' ';
                var h = date.getHours() + ':';
                var m = date.getMinutes() + ':';
                var s = date.getSeconds();
                return Y+M+D+h+m+s;
            },
            /*电话号码处理*/
            phoneShift(phone){
                let _self = this;
                var reg = /1(\d{2})\d{4}(\d{4})/g;
                phone = phone.replace(reg,"1$1****$2");
                return phone
            },
            /*复制至剪贴板*/
            copy() {
                let _self = this;
                let clipboard = new Clipboard('.copyBtn');
                clipboard.on('success', e => {
                    _self.copyStatus = '复制成功';
                    _self.copyFlag = true;
                    setTimeout(() => {
                        _self.copyFlag = false;
                    },1000)
                    clipboard.destroy()
                });
                clipboard.on('error', e => {
                    _self.copyStatus = '复制失败';
                    _self.copyFlag = true;
                    setTimeout(() => {
                        _self.copyFlag = false;
                    },1000)
                    clipboard.destroy()
                })
            },
            tel(phone){
                let _self = this;
                if(phone){
                    if(_self.openType == 3){
                        window.location.href = 'tel:' + phone
                    }else{
                        postZSTTel(String(phone));
                    }
                }
            },
            /*滚动事件*/
            scrollEvent(){
                let _self = this;
                // _self._scrollTop = document.body.scrollTop
                _self.footFlag = false;
                setTimeout(()=>{
                    _self.footFlag = true;
                },2000)
            },
            /*初始化滚动*/
            initScroll(){
                // console.log(this.$refs);
                let _self = this;
                this.scroll = new BScroll(this.$refs['myScroll'],{
                    click:true,
                    pullUpLoad: {
                        threshold: 50
                    }
                });
                this.scroll.on("pullingUp",()=>{
                    // _self.morePro();
                    // this.handleBottomChange();
                    // console.log(this.goods);
                });
            },
            refresh(){
                setTimeout(()=>{
                    this.scroll.finishPullUp();
                    this.scroll.finishPullDown();
                    this.scroll.refresh();
                },100)
            },
            ZSTTargetHrefReport(){
                let _self = this;
                this.$router.push({
                    name: 'report',
                    query:{showId:_self.showId}
                })
            },
            clickEvent(_type){
                let _self = this;
                if(_type == 1){
                    let _data = {
                        state: 1,
                        ID: _self.proShowsInfo.id
                    };
                    releaseProShow(_data);
                }else if(_type == 2){
                    if(_self.proShowsDetails.isTaskExit){
                        _self.$router.push({
                            name: 'taskDetails',
                            query: {
                                showId: _self.proShowsInfo.id
                            }
                        })
                    }else{
                        _self.searchTaskFlag = true;
                    }
                }else if(_type == 3){
                    _self.$router.push({
                        name: 'bountyDetail',
                        query: {showId: _self.proShowsInfo.id}
                    })
                }else if(_type == 4){
                    _self.share();
                }
            }
        },
        watch: {
            proShowsInfo:{
                handler(){
                    // console.log(1);

                },
                deep:true
            },
            taskFlag(){
                let _self = this;
                if(_self.taskFlag == 1){
                    // alert(1)
                    let _data = {
                        token: _self.token,
                        showId: _self.showId
                    };
                    getSignIn(_data).then(sec => {
                        share(_data,sec).then(res => {
                            if(res.data.state == 1){
                                _self.getProDetails();
                                _self.showTask = false;
                                _self.shareSuc = true;
                            }else{
                                _self.msg = res.data.msg
                            }
                        })
                    });
                }
            }
        },
        beforeRouteLeave(to, from , next){
            noReportBtn();
            next();
        },
        created(){
            let _self = this;
            window.shareCallback = _self.shareCallback;
            window.ZSTTargetHrefReport = _self.ZSTTargetHrefReport;
            let _type = getUserAgentType();
            _self.openType = _type;
            if(_type == 3){
                _self.init();
                _self.shareInit();
                setTimeout(() => {
                    _self.footFlag = true;
                },1000)
            }else{
                _self.tokenPromise.then(res => {
                    _self.token = res;
                    _self.init();
                    proShowReportBtn();
                    _self.shareInit();
                    setTimeout(() => {
                        _self.footFlag = true;
                    },1000)
                });
            }
        },
        mounted(){
            let _self = this;
            setTimeout(() => {
                postImgAndroid(String(_self.proShowsDetails.imgUrls[0]));
                postStrAndroid(_self.$refs.remark.innerText);
                let _data = {
                    title: _self.proShowsInfo.goodsName,
                    describe: _self.$refs.remark.innerText,
                    imageUrl: String(_self.proShowsDetails.imgUrls[0])
                };
                postShareContentIOS(_data);
            },3000)
        }
    }
</script>

<style lang="scss" scoped="">
    @import "../../assets/css/global";
    .alertMsg-enter-active{
        animation: zoomIn .3s;
    }
    .alertMsg-leave-active{
        animation: zoomOut .3s;
    }
    .slideFoot-enter-active{
        animation: slideInUp .5s;
    }
    .slideFoot-leave-active{
        animation: slideOutDown .5s;
    }
    .bag-scroll{
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }
    .proShowsDetails{
        width: 100%;
        box-sizing: border-box;
        padding: 0 .12rem;
        margin-bottom: .2rem;
        .load{
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            height: 100%;
            background-image: url($ctxpath + "/static/customImgs/common/loading.gif");
            background-size: 1.2rem 1.2rem;
            background-repeat: no-repeat;
            background-position: center;
        }
        .top{
            width: 100%;
            height: .8rem;
            position: fixed;
            top: 0;
            left: 0;
            background: url($ctxpath + "/static/customImgs/proShow/task.png") center center no-repeat;
            background-size: 100% 100%;
            display: flex;
            justify-content: space-between;
            font-size: .3rem;
            color: #FFFFFF;
            align-items: center;
            .left{
                margin-left: .82rem;
            }
            .right{
                margin-right: .2rem;
                width: 1.6rem;
                height: .6rem;
                border-radius: .6rem;
            }
        }
        .alert{
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(12,12,12,.3);
            z-index: 1;
            .exceptional{
                width: 6.36rem;
                /*height: 6.2rem;*/
                border-radius: .09rem;
                background: #FFFFFF;
                position: absolute;
                top: 3rem;
                left: 0;
                right: 0;
                margin-left: auto;
                margin-right: auto;
                box-sizing: border-box;
                padding: .62rem .44rem .26rem;
                .close{
                    width: .55rem;
                    height: .55rem;
                    position: absolute;
                    top: -0.74rem;
                    right: -0.13rem;
                    img{
                        display: block;
                        width: 100%;
                        height: 100%;
                    }
                }
                .title{
                    font-size: .36rem;
                    font-weight: bold;
                    color: #000000;
                    text-align: center;
                    margin-bottom: .55rem;
                }
                p{
                    font-size: .28rem;
                    text-align: center;
                    margin-bottom: .99rem;
                }
                .moneyInput{
                    font-size: .36rem;
                    font-weight: bold;
                    text-align: center;
                    input{
                        outline: none;
                        background: none;
                        border: 1px solid #e5e5e5;
                        width: 1.94rem;
                        height: .6rem;
                        text-align: center;
                        margin: 0 .15rem;
                        line-height: .6rem;
                    }
                    input::-webkit-input-placeholder{
                        color: #94969b;
                        font-size: .3rem;
                        text-align: center;
                        line-height: .6rem;
                    }
                }
                .btns{
                    width: 100%;
                    height: .8rem;
                    display: flex;
                    justify-content: space-between;
                    margin-top: 1.27rem;
                    button{
                        width: 2.6rem;
                        height: .8rem;
                        border-radius: .8rem;
                        color: #FFFFFF;
                        font-size: .34rem;
                    }
                    .cancel{
                        background: #feb623;
                    }
                    .confirm{
                        background: #ff0049;
                    }
                }
            }
            .contact{
                width: 6.36rem;
                /*height: 6.2rem;*/
                border-radius: .09rem;
                background: #FFFFFF;
                position: absolute;
                top: 3rem;
                left: 0;
                right: 0;
                margin-left: auto;
                margin-right: auto;
                box-sizing: border-box;
                padding: .62rem .44rem .26rem;
                .close{
                    width: .55rem;
                    height: .55rem;
                    position: absolute;
                    top: -0.74rem;
                    right: -0.13rem;
                    img{
                        display: block;
                        width: 100%;
                        height: 100%;
                    }
                }
                .headPic{
                    width: 1.3rem;
                    height: 1.3rem;
                    margin: 0 auto;
                    border-radius: 50%;
                    overflow: hidden;
                    img{
                        display: block;
                        width: 100%;
                        height: 100%;
                        background: #0e90d2;
                    }
                }
                p{
                    font-size: .28rem;
                    margin-bottom: .3rem;
                    text-align: center;
                }
                .tel{
                    color: #ff0049;
                    font-weight: bold;
                }
                .tip{
                    margin-bottom: .25rem;
                }
                .wechat-phone{
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: .37rem;
                    .icon{
                        width: 50%;
                        text-align: center;
                        display: flex;
                        flex-direction: column;
                        padding: .26rem 0 .47rem;
                        i{
                            font-size: .6rem;
                        }
                        span{
                            font-size: .22rem;
                            color: #94969b;
                        }
                    }
                    .wechat{
                        border-right: 1px solid #e5e5e5;
                        i{
                            color: #38be7a;
                        }
                    }
                    .phone{
                        i{
                            color: #feb623;
                        }
                    }
                }
                .btns{
                    width: 100%;
                    height: .8rem;
                    display: flex;
                    justify-content: space-between;
                    button{
                        width: 2.6rem;
                        height: .8rem;
                        border-radius: .8rem;
                        color: #FFFFFF;
                        font-size: .34rem;
                    }
                    .cancel{
                        background: #feb623;
                    }
                    .confirm{
                        background: #ff0049;
                    }
                    .notPhone{
                        background: #e0e0e0;
                    }
                }
                .alertMsg{
                    width: 2.98rem;
                    height: 1.65rem;
                    background: rgba(12,12,12,.4);
                    color: #FFFFFF;
                    font-size: .32rem;
                    text-align: center;
                    line-height: 1.65rem;
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    margin: auto;
                }
            }
            .getTask{
                width: 6.36rem;
                /*height: 6.2rem;*/
                border-radius: .09rem;
                background: #FFFFFF;
                position: absolute;
                top: 3rem;
                left: 0;
                right: 0;
                margin-left: auto;
                margin-right: auto;
                box-sizing: border-box;
                padding: .62rem .44rem .26rem;
                .close{
                    width: .55rem;
                    height: .55rem;
                    position: absolute;
                    top: -0.74rem;
                    right: -0.13rem;
                    img{
                        display: block;
                        width: 100%;
                        height: 100%;
                    }
                }
                .title{
                    font-size: .36rem;
                    font-weight: bold;
                    color: #000000;
                    text-align: center;
                    margin-bottom: .55rem;
                }
                p{
                    font-size: .28rem;
                    text-align: center;
                    margin-bottom: .99rem;
                }
                .existing{
                    margin-bottom: .33rem;
                }
                .tip{
                    font-size: .24rem;
                    color: #ff0049;
                }
                .moneyInput{
                    font-size: .36rem;
                    font-weight: bold;
                    text-align: center;
                    margin-bottom: 1.27rem;
                    input{
                        outline: none;
                        background: none;
                        border: 1px solid #e5e5e5;
                        width: 1.94rem;
                        height: .6rem;
                        text-align: center;
                        margin: 0 .15rem;
                    }
                    input::-webkit-input-placeholder{
                        color: #94969b;
                        font-size: .3rem;
                        text-align: center;
                    }
                }
                .btns{
                    width: 100%;
                    height: .8rem;
                    display: flex;
                    justify-content: space-between;
                    margin-top: .99rem;
                    button{
                        width: 2.6rem;
                        height: .8rem;
                        border-radius: .8rem;
                        color: #FFFFFF;
                        font-size: .34rem;
                    }
                    .cancel{
                        background: #feb623;
                    }
                    .confirm{
                        background: #ff0049;
                    }
                }
            }
            .exceptSuc{
                width: 6rem;
                /*height: 6.2rem;*/
                border-radius: .19rem;
                background: #FFFFFF;
                position: absolute;
                top: 3rem;
                left: 0;
                right: 0;
                margin-left: auto;
                margin-right: auto;
                box-sizing: border-box;
                padding-bottom: .26rem;
                .close{
                    width: .55rem;
                    height: .55rem;
                    position: absolute;
                    top: -0.74rem;
                    right: -0.13rem;
                    img{
                        display: block;
                        width: 100%;
                        height: 100%;
                    }
                }
                .bg{
                    width: 100%;
                    height: 2.43rem;
                    img{
                        display: block;
                        width: 100%;
                        height: 100%;
                    }
                }
                .money{
                    font-size: .42rem;
                    text-align: center;
                    margin-top: .92rem;
                }
                .receive{
                    font-size: .24rem;
                    margin-top: .32rem;
                    text-align: center;
                }
                button{
                    width: 3.34rem;
                    height: .8rem;
                    font-size: .36rem;
                    display: block;
                    margin: 0 auto;
                    border-radius: .8rem;
                    color: #FFFFFF;
                    margin-top: .66rem;
                    background: -webkit-radial-gradient(#0095d8, #007bbd); /* Safari 5.1 - 6.0 */
                    background: -o-radial-gradient(#0095d8, #007bbd); /* Opera 11.6 - 12.0 */
                    background: -moz-radial-gradient(#0095d8, #007bbd); /* Firefox 3.6 - 15 */
                    background: radial-gradient(#0095d8, #007bbd); /* 标准的语法 */
                }
            }
            .shareSuc{
                width: 6.68rem;
                height: 6.98rem;
                background-image: url($ctxpath + "/static/customImgs/proShow/task.png");
                background-size: 100% 100%;
                background-repeat: no-repeat;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                margin: auto;
                color: #010101;
                p{
                    font-size: .3rem;
                    margin-top: 2.99rem;
                    text-align: center;
                }
                i{
                    display: block;
                    text-align: center;
                    font-size: .36rem;
                    font-weight: 600;
                    line-height: .6rem;
                }
                button{
                    display: block;
                    width: 3.33rem;
                    height: .79rem;
                    position: absolute;
                    top: 4.7rem;
                    left: 0;
                    right: 0;
                    margin-left: auto;
                    margin-right: auto;
                }
            }
            .isTask{
                width: 6.36rem;
                border-radius: .09rem;
                background: #FFFFFF;
                position: absolute;
                top: 3rem;
                left: 0;
                right: 0;
                margin-left: auto;
                margin-right: auto;
                box-sizing: border-box;
                padding: .62rem .44rem .26rem;
                .close{
                    width: .55rem;
                    height: .55rem;
                    position: absolute;
                    top: -0.74rem;
                    right: -0.13rem;
                    img{
                        display: block;
                        width: 100%;
                        height: 100%;
                    }
                }
                .tipTitle{
                    font-size: .36rem;
                    text-align: center;
                    margin-bottom: .5rem;
                }
                p{
                    font-size: .28rem;
                    text-align: center;
                }
            }
        }
        .showsAbout{
            width: 100%;
            box-sizing: border-box;
            padding: .33rem .3rem .22rem;
            border-bottom: 1px solid #e5e5e5;
            .personInfo{
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                /*margin-bottom: .47rem;*/
                .left{
                    height: .7rem;
                    display: flex;
                    justify-content: left;
                    .headPortrait{
                        width: .7rem;
                        height: .7rem;
                        border-radius: 50%;
                        overflow: hidden;
                        background: #1a9bb1;
                        margin-right: .2rem;
                        img{
                            display: block;
                            width: 100%;
                            height: 100%;
                        }
                    }
                    .nickname{
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        p{
                            font-size: .3rem;
                            color: #080103;
                        }
                        span{
                            font-size: .24rem;
                            color: #94969b;
                        }
                    }
                }
                .wechat{
                    padding: 0 .2rem;
                    line-height: .5rem;
                    height: .5rem;
                    font-size: .24rem;
                    color: #FFFFFF;
                    background: #38be7a;
                    border-radius: .08rem;
                }
            }
            .showTitle{
                margin-bottom: .24rem;
                font-size: .38rem;
                color: #080103;
                font-weight: bold;
                white-space:nowrap;
                overflow:hidden;
                text-overflow:ellipsis;
            }
            .showInfo{
                display: flex;
                justify-content: space-between;
                margin-bottom: .32rem;
                align-items: center;
                font-size: .24rem;
                color: #94969b;
                .category{
                    border-radius: .08rem;
                    padding: 0 .14rem;
                }
                .time{
                    margin-right: .4rem;
                }
                .views,.praise{
                    font-size: .24rem;
                }

                .furniture{
                    color: rgb(254,191,74);
                    background: rgba(254,191,74,.2);
                }
                .skinCare{
                    color: rgb(250,78,163);
                    background: rgba(250,78,163,.2);
                }
                .keepHealth{
                    color: rgb(56,190,122);
                    background: rgba(56,190,122,.2);
                }
                .dress{
                    color: rgb(253,139,69);
                    background: rgba(253,139,69,.2);
                }
                .food{
                    color: rgb(254,191,74);
                    background: rgba(254,191,74,.2);
                }
                .maternal{
                    color: rgb(82,66,197);
                    background: rgba(82,66,197,.2);
                }
                .service{
                    color: rgb(81,200,249);
                    background: rgba(81,200,249,.2);
                }
                .outlineShop{
                    color: rgb(56,190,122);
                    background: rgba(56,190,122,.2);
                }
            }
        }
        .contentDetails{
            font-size: .34rem;
            color: #000000;
            line-height: .6rem;
            box-sizing: border-box;
            padding: .18rem .3rem;
        }
        .thumb{
            width: 100%;
            /*height: 5.62rem;*/
            background: #0e90d2;
            /*margin-bottom: .8rem;*/
            img{
                display: block;
                width: 100%;
                /*height: 100%;*/
            }
        }
        .end{
            width: 100%;
            height: 1rem;
            padding-bottom: .9rem;
            display: flex;
            justify-content: center;
            align-items: center;
            i{
                width: .8rem;
                height: .01rem;
                background: #8d8e98;
            }
            span{
                font-size: .28rem;
                color: #8d8e98;
                margin: 0 .1rem;
            }
        }
        .content{
            .foot{
                width: 100%;
                height: .9rem;
                position: fixed;
                bottom: 0;
                left: 0;
                background: #FFFFFF;
                box-sizing: border-box;
                padding: .12rem .18rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: .24rem;
                color: #b2b2b2;
                .Task{
                    width: 2.43rem;
                    height: 1.77rem;
                    position: absolute;
                    bottom: .99rem;
                    right: .21rem;
                    img{
                        display: block;
                        width: 100%;
                        height: 100%;
                    }
                    span{
                        position: absolute;
                        display: block;
                        width: 1.8rem;
                        height: .4rem;
                        font-size: .2rem;
                        color: #FFFFFF;
                        top: .42rem;
                        left: .1rem;
                        text-align: center;
                        line-height: .4rem;
                    }
                }
                .praise{
                    font-size: .24rem;
                }
                .praise::before{
                    margin-right: .08rem;
                }
                .zan{
                    color: #ffa71a;
                }
                .bad{
                    color: #f7084c;
                }
                .btns{
                    width: 3.6rem;
                    height: 100%;
                    border-radius: .7rem;
                    display: flex;
                    justify-content: left;
                    overflow: hidden;
                    button{
                        width: 50%;
                        color: #FFFFFF;
                        font-size: .28rem;
                    }
                    button::before{
                        margin-right: .13rem;
                    }
                    .exceptional{
                        background: #ffa61a;
                    }
                    .contact{
                        background: #f7094d;
                    }
                }
            }
            .outside{
                width: 100%;
                height: .9rem;
                position: fixed;
                bottom: 0;
                left: 0;
                display: flex;
                .left{
                    width: 5.1rem;
                    height: 100%;
                    background: rgba(12,12,12,.8);
                    display: flex;
                    align-items: center;
                    i{
                        display: block;
                        width: .48rem;
                        height: .48rem;
                        margin-right: .12rem;
                        margin-left: .2rem;
                        img{
                            display: block;
                            width: 100%;
                            height: 100%;
                        }
                    }
                    .desc{
                        color: #FFFFFF;
                        p{
                            font-size: .24rem;
                        }
                        span{
                            font-size: .2rem;
                            display: block;
                        }
                    }
                }
                .right{
                    width: 2.4rem;
                    height: 100%;
                    background:rgba(247,9,77,1);
                    font-size: .28rem;
                    color: #FFFFFF;
                    text-align: center;
                    line-height: .9rem;
                }
            }
            .mine{
                width: 100%;
                height: .9rem;
                box-sizing: border-box;
                padding: 0 .41rem;
                background: #FFFFFF;
                display: flex;
                justify-content: space-between;
                align-items: center;
                position: fixed;
                bottom: 0;
                left: 0;
                .mine-item{
                    font-size: .24rem;
                    color: #94969B;
                    display: flex;
                    align-items: center;
                    i{
                        display: block;
                        width: .5rem;
                        height: .5rem;
                        img{
                            display: block;
                            width: 100%;
                            height: 100%;
                        }
                    }
                }
            }
        }
    }
</style>