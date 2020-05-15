<template>
    <div class="drawRecord" :class="{bg : list.length==0}">
        <div class="notData" v-if="list.length==0">暂无中奖记录~</div>
        <transition name="alertMsg">
            <div class="mask" v-show="award_show">
                <div class="tan_box">
                    <img :src="award.img" alt="">
                    <p>{{award.goodsName}}</p>
                    <div class="btn" @click="get_award(award.goodsId)">立即领取</div>
                    <div class="close" @click="close_cli"></div>
                </div>
            </div>
        </transition>
        <transition name="alertMsg">
            <toast :tip="tip" ref="toast"></toast>
        </transition>
        <div class="drawRecord-item" v-for="(item,index) in list" :key="index" @click="targetHref(item)">
            <div class="thumb">
                <img v-lazy="item.inventoryImg" alt="">
            </div>
            <div class="detail">
                <div class="first">
                    <div class="awardName txt-overflow">{{item.goodsName}}</div>
                    <div class="right">
                        <div class="status" :class="{notGet: !item.state}">{{item.state   ? '已领取' : '未付款'}}</div>
                        <div class="state">{{item.stateMsg}}</div>
                    </div>
                </div>
                <div class="second">抽奖时间 : {{String(item.createDate).substr(0,4)+'-'+String(item.createDate).substr(4,2)+'-'+String(item.createDate).substr(6,2)}}</div>
            </div>
        </div>
    </div>
</template>

<script>
    import * as comm from '@/assets/js/comm';
    import {getSignIn , getToken  , postTitle , ctxPath} from "@/assets/js/jsBridge";
    import toast from '@/components/common/toast'
    export default {
        name: "drawRecord",
        props:['tokenPromise'],
        components: {
            toast
        },
        data(){
            return{
                list: [],
                award_show: false,
                award: '',
                imgDomain: '',
                token: '',
                tip: ''
            }
        },
        methods: {
            close_cli() {
                this.award_show = false;
            },
            init(){
                let _self = this;
                _self.getRecord();
                postTitle('话呗抽免单抽奖记录');
            },
            /*获取抽奖记录*/
            getRecord(){
                let _self = this;
                let _data = {
                    token:_self.token
                };
                getSignIn(_data).then(sec => {
                    comm.getConverRecord(_data,sec).then(res => {
                        if(res.data.state == 1){
                            _self.list = res.data.data;
                            if(_self.list.length == 0){
                                _self.$refs.toast.toast();
                                _self.tip = '暂无中奖记录'
                            }
                            _self.list.forEach(ele => {
                                switch (ele.orderState) {
                                    case 0:
                                        ele.stateMsg = '已取消';
                                        break;
                                    case 1:
                                        ele.stateMsg = '待付款';
                                        break;
                                    case 2:
                                        ele.stateMsg = '待发货';
                                        break;
                                    case 3:
                                        ele.stateMsg = '待收货';
                                        break;
                                    case 4:
                                        ele.stateMsg = '交易成功';
                                        break;
                                    case 5:
                                        ele.stateMsg = '交易完成';
                                        break;
                                    case 6:
                                        ele.stateMsg = '申请退货';
                                        break;
                                    case 7:
                                        ele.stateMsg = '退款成功';
                                        break;
                                    case 8:
                                        ele.stateMsg = '退款关闭';
                                        break;
                                }
                            })
                            /*_self.list.forEach(ele => {
                                ele.img = res.data.imgDomain + ele.img;
                            })*/
                            // _self.imgDomain = res.data.imgDomain;
                        }
                    })
                })
            },
            /*点击*/
            targetHref(item){
                let _self = this;
                if(item.orderState == 1){
                    /*_self.award = item;
                    _self.award_show = true;*/
                    window.location.href = ctxPath + '/zst-wap/app-shop/index.html#/awardOrder?orderNum=' + item.orderNum;
                }
            },
            get_award(goodsId) {
                let _self = this;
                let _data = {
                    token: _self.token,
                    id: goodsId
                };
                getSignIn(_data).then(sec => {
                    comm.goodsDetail(_data,sec).then(res => {
                        if(res.data.state == 1){
                            var data = res.data;
                            setStore('goodsDetail' , data);
                            setStore('orderGoods' , data.lstBiGoodsInventory[0]);
                            window.location.href = 'https://zst.tenzhao.com/zst-wap/app-shop/index.html#/awardOrder'
                        }
                    });
                })
            }
        },
        mounted(){
            let _self = this;
            _self.tokenPromise.then(res => {
                _self.token = res;
                _self.init();
            })
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/css/global.scss";
    .alertMsg-enter-active{
        animation: zoomIn .3s;
    }
    .alertMsg-leave-active{
        animation: zoomOut .3s;
    }
    .bg{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url($ctxpath + "/static/customImgs/common/empty.png") center 3rem no-repeat;
        background-size: 3.32rem 3.32rem;
        .notData{
            font-size: .32rem;
            position: absolute;
            top: 7rem;
            left: 0;
            right: 0;
            margin-left: auto;
            margin-right: auto;
            text-align: center;
        }
    }
    .drawRecord{
        .mask {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.6);
            z-index: 8;
            font-size: 12px;
            .tan_box {
                position: absolute;
                top: 15%;
                left: 6%;
                z-index: 2;
                width: 6.58rem;
                height: 8.43rem;
                background: url($ctxpath + "/static/customImgs/drawRecord/tan_bg.png") no-repeat;
                background-size: contain;
                text-align: center;
                img {
                    display: block;
                    width: 2.6rem;
                    height: 3.1rem;
                    margin: 2.2rem auto 0;
                }
                .close {
                    position: absolute;
                    height: 0.56rem;
                    width: 0.56rem;
                    top: 0.8rem;
                    right: 0.2rem;
                    z-index: 9;
                    background: url("../../assets/imgs/common/close.png");
                    background-size: 100%;
                }
                p {
                    box-sizing: border-box;
                    padding: 0 .5rem;
                    font-size: 16px;
                    margin: 15px 0 5px;
                }
                .btn {
                    background: #fe054c;
                    color: #fff;
                    font-size: 14px;
                    width: 3rem;
                    height: 0.8rem;
                    line-height: 0.8rem;
                }
            }
        }
        .drawRecord-item{
            box-sizing: border-box;
            padding: .22rem;
            border-bottom: .1rem solid #f6f6f6;
            display: flex;
            justify-content: space-between;
            .thumb{
                width: 1.38rem;
                height: 1.38rem;
                border: 1px solid #e5e5e5;
                img{
                    display: block;
                    width: 100%;
                    height: 100%;
                }
            }
            .detail{
                width: 5.5rem;
                height: 1.4rem;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                .first{
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    .awardName{
                        width: 4.07rem;
                        height: .75rem;
                        font-size: .28rem;
                        font-weight: bold;
                    }
                    .right{
                        display: flex;
                        flex-direction: column;
                        .status{
                            color: #f7094d;
                            font-size: .28rem;
                        }
                        .state{
                            font-size: .28rem;
                            color: #f7094d;
                        }
                    }
                    .notGet{
                        color: #8d8e98;
                    }
                }
                .second{
                    font-size: .28rem;
                    color: #8d8e98;
                }
            }
        }
    }
</style>
