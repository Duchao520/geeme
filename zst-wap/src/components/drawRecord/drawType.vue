<template>
    <ul class="drawType">
      {{returnValue}}{{src}}
        <li class="drawType-item" @click="signDraw">
            <div class="left">
                <span>平台活动</span>
                <i>大转盘、砸金蛋、刮刮乐、签到中奖记录</i>
            </div>
            <div class="right">
                未领取({{counts.spLotteryCount}})<i class="iconfont icon-youjiantou"></i>
            </div>
        </li>
        <li class="drawType-item" @click="actDraw">
            <div class="left">
                <span>商家活动</span>
                <i>由商家发起的抽奖活动中奖记录</i>
            </div>
            <div class="right">
                未领取({{counts.biLotteryCount}})<i class="iconfont icon-youjiantou"></i>
            </div>
        </li>
        <li class="drawType-item" @click="drawItem">
            <div class="left">
                <span>话呗抽免单</span>
                <i>参加话呗抽免单活动的中奖记录</i>
            </div>
            <div class="right">
                未领取({{counts.biGoodsLotteryCount}})<i class="iconfont icon-youjiantou"></i>
            </div>
        </li>
    </ul>
</template>
<script>

    import * as comm from '@/assets/js/comm';
    import {getSignIn , postTitle , callAppMethod ,ctxPath , getUserAgentType} from "@/assets/js/jsBridge";
    import wx from 'weixin-js-sdk';
    export default {
        name: "drawType",
        props:['tokenPromise'],
        data(){
            return{
                token: '',
                counts: '',
                returnValue:'',
                src:''
            }
        },
        methods: {
            init(){
                var _self = this;
                _self.getDrawType();
            },
            getDrawType(){
                var _self = this;
                var _data = {
                    token: _self.token
                };
                getSignIn(_data).then(sec => {
                    comm.getDrawType(_data,sec).then(res => {
                        if(res.data.state == 1){
                            _self.counts = res.data.data;
                        }
                    })
                })
            },
            actDraw(){
              var _type = getUserAgentType();
              if(_type == 4){
                try {
                  wx.miniProgram.navigateTo({url:'/pages/packageA/pages/minLottery/main'})
                }catch (e) {
                  alert(e);
                }
              }else{
                callAppMethod('12');
              }
            },
            signDraw(){
              var _type = getUserAgentType();
              if(_type == 4){
                try {
                  wx.miniProgram.navigateTo({url:'/pages/packageA/pages/minDrawRecord/main'})
                }catch (e) {
                  alert(e);
                }
              }else{
                 window.location.href = ctxPath + '/zst-wap/signIn/index.html#/drawRecord'
              }
            },
            drawItem(){
              var _type = getUserAgentType();
              if(_type == 4){
                try {
                  wx.miniProgram.navigateTo({url:'/pages/packageA/pages/drawItem/main'})
                }catch (e) {
                  alert(e);
                }
              }else{
                this.$router.push({path:'/converRecord'})
              }
            }
        },
        mounted(){
            var _self = this;
              _self.tokenPromise.then(token => {
                _self.token = token;
                _self.init();
              })
        }
    }
</script>

<style lang="scss" scoped>
    .drawType{
        width: 100%;
        height: 100%;
        background: #F6F6F6;
        .drawType-item{
            box-sizing: border-box;
            padding: .45rem .38rem .33rem;
            background: #FFFFFF;
            margin-bottom: .1rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .left{
                display: flex;
                flex-direction: column;
                span{
                    font-size: .28rem;
                    margin-bottom: .15rem;
                }
                i{
                    font-size: .24rem;
                    color: #8D8E98;
                }
            }
            .right{
                font-size: .3rem;
                i{
                    font-size: .28rem;
                }
            }
        }
    }
</style>
