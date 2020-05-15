<template>
    <div class="shareprofitIndex">
        <transition name="alertMsg">
            <div class="alert" v-show="showExceptional">
                <div class="exceptional" v-if="showExceptional">
                    <div class="close" @click="close">
                        <img src="@/assets/imgs/common/close.png" alt="">
                    </div>
                    <div class="vip">
                        <img src="@/assets/imgs/shareProfits/vip.png" alt="">
                    </div>
                    <p>亲,只有VIP会员才能邀请哦~</p>
                    <button @click="targetHref('https://zst.tenzhao.com/zst-wap/vipRecharge/index.html?from=singlemessage#/index')">
                        马上升级VIP
                    </button>
                </div>
            </div>
        </transition>
        <swiper class="banners" :options="swiperOption" ref="mySwiper" v-if="banner.layoutMode == 2" :style="{width: banner.width + 'rem',height: banner.height + 'rem'}">
            <swiper-slide class="banner-item" v-for="(item,idx) in banner.modules" :key="idx">
                <img :src="imgDomain + item.moduleImg" alt="" @click="targetHref(banner.modules[0].targetLink)">
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination" v-if="banner.modules.length>1"></div>
        </swiper>
        <div v-if="banner.layoutMode == 6">
            <div class="moduleTitle">
                <span>分享赚钱攻略</span>
                <b></b>
                <i>开启你的赚钱之旅</i>
            </div>
            <div class="course" :style="{width:banner.width + 'rem',height:banner.height + 'rem'}">
                <div class="course-item" v-for="(module,index) in banner.modules" :key="index"
                     @click="targetHref(module.targetLink)"
                     :style="{width:(banner.width-0.36)*module.widthRatio + 'rem'}">
                    <img :src="imgDomain + module.moduleImg" alt="">
                    <!--<div class="right">{{module.moduleName}}</div>-->
                </div>
            </div>
        </div>
        <div class="inviteModule">
            <div class="inviteModule-item" @click="interaction(1)">
            </div>
            <div class="inviteModule-item" @click="interaction(2)">
            </div>
        </div>
        <div v-for="(item,idx) in data" :key="idx">
            <div class="moduleTitle" v-if="idx == 0">
                <span>分享赚钱攻略</span>
                <b></b>
                <i>开启你的赚钱之旅</i>
            </div>
            <swiper class="banners" :options="swiperOption" ref="mySwiper" v-if="item.layoutMode == 2" :style="{width: item.width + 'rem',height: item.height + 'rem'}">
                <swiper-slide class="banner-item" v-for="(ele,idx) in item.modules" :key="idx">
                    <img :src="imgDomain + ele.moduleImg" alt="" @click="targetHref(ele.targetLink)">
                </swiper-slide>
                <div class="swiper-pagination" slot="pagination" v-if="item.modules.length>1"></div>
            </swiper>
            <div class="course" :style="{width:item.width + 'rem',height:item.height + 'rem'}"  v-if="item.layoutMode == 6">
                <div class="course-item" v-for="(module,index) in item.modules" :key="index"
                     @click="targetHref(module.targetLink)"
                     :style="{width:(item.width-0.36)*module.widthRatio + 'rem'}">
                    <img :src="imgDomain + module.moduleImg" alt="">
                    <!--<div class="right">{{module.moduleName}}</div>-->
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import 'swiper/dist/css/swiper.css'
    import * as comm from '@/assets/js/comm';
    import {promoteCode, inviteBusiness, getMember, postTitle, getSignIn, noShare} from "@/assets/js/jsBridge";
    import {swiper, swiperSlide} from 'vue-awesome-swiper'

    export default {
        props:['tokenPromise'],
        name: "shareprofitIndex",
        data() {
            return {
                swiperOption: {
                    loop: true,
                    autoplay: true,
                    pagination: {
                        el: '.swiper-pagination'
                    }
                },
                data: '',
                imgDomain: '',
                banner: '',
                course: '',
                showExceptional: false
            }
        },
        components: {
            swiper,
            swiperSlide
        },
        methods: {
            close() {
                let _self = this;
                _self.showExceptional = false;
            },
            init() {
                let _self = this;
                postTitle('分享赚');
                noShare();
                _self.shareProfit();
            },
            shareProfit() {
                let _self = this;
                _self.tokenPromise.then(result => {
                    let _data = {
                        platform: '3',
                        typeId: '7',
                        token: result
                    };
                    getSignIn(_data).then(res => {
                        let sec = res;
                        comm.shareProfit(_data, sec).then(res => {
                            if (res.data.state == 1) {
                                _self.data = res.data.data;
                                _self.data.forEach(ele => {
                                    let arr = ele.lenToWidth.split(':')
                                    ele.rate = Number(arr[1]) / Number(arr[0]);
                                    ele.width = 7.5;
                                    ele.height = ele.width * ele.rate;
                                });
                                _self.imgDomain = res.data.imgDomain;
                                _self.banner = res.data.data[0];
                                _self.data.shift();
                            }
                        })
                    })
                })
            },
            interaction(type) {
                let _self = this;
                let isMember = getMember();
                isMember.then(function (data) {
                    if (data == 1) {
                        if (type == 1) {
                            promoteCode();
                        } else if (type == 2) {
                            inviteBusiness();
                        }
                    } else {
                        _self.showExceptional = true;
                    }
                })
            },
            targetHref(url) {
                window.location.href = url;
            }
        },
        mounted() {
            let _self = this;
            _self.init();
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/css/global.scss";

    .alertMsg-enter-active {
        animation: zoomIn .3s;
    }

    .alertMsg-leave-active {
        animation: zoomOut .3s;
    }

    .shareprofitIndex {
        .alert {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(12, 12, 12, .3);
            z-index: 100;
            .exceptional {
                width: 6.36rem;
                height: 5.11rem;
                border-radius: .09rem;
                position: absolute;
                top: 4.27rem;
                left: 0;
                right: 0;
                margin-left: auto;
                margin-right: auto;
                box-sizing: border-box;
                padding: 0 0 .26rem;
                background: #FFFFFF;
                .close {
                    width: .55rem;
                    height: .55rem;
                    position: absolute;
                    top: -0.74rem;
                    right: -0.13rem;
                    img {
                        display: block;
                        width: 100%;
                        height: 100%;
                    }
                }
                .vip {
                    width: 100%;
                    height: 2.53rem;
                    img {
                        display: block;
                        width: 100%;
                        height: 100%;
                    }
                }
                p {
                    font-size: .3rem;
                    text-align: center;
                    margin-bottom: .69rem;
                }
                button {
                    display: block;
                    width: 4.56rem;
                    height: .79rem;
                    background: #ff0049;
                    color: #FFFFFF;
                    font-size: .32rem;
                    margin: 0 auto;
                    border-radius: .79rem;
                }
            }
        }
        .banners {
            width: 100%;
            height: 4.23rem;
            margin-bottom: .64rem;
            .banner-item {
                width: 100%;
                height: 100%;
                img {
                    display: block;
                    width: 100%;
                    height: 100%;
                }
            }
        }
        .inviteModule {
            width: 100%;
            box-sizing: border-box;
            padding: 0 .18rem;
            display: flex;
            justify-content: space-between;
            margin-bottom: .58rem;
            .inviteModule-item {
                width: 3.4rem;
                height: 2.22rem;
                border-radius: .1rem;
                position: relative;
            }
            .inviteModule-item:first-child {
                background: url($ctxpath + "/static/customImgs/shareProfits/inviteVip.png") center center no-repeat;
                background-size: 100% 100%;
            }
            .inviteModule-item:last-child {
                background: url($ctxpath + "/static/customImgs/shareProfits/inviteShop.png") center center no-repeat;
                background-size: 100% 100%;
            }
        }
        .moduleTitle {
            display: flex;
            box-sizing: border-box;
            margin-bottom: .35rem;
            padding: 0 .18rem;
            align-items: center;
            span {
                color: rgba(12, 12, 12, 1);
                background: linear-gradient(169deg, rgba(167, 107, 77, 1) 0.2685546875%, rgba(220, 172, 124, 1) 38.8671875%, rgba(149, 80, 68, 1) 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                font-weight: bold;
                font-size: .3rem;
            }
            b {
                width: 1px;
                height: .23rem;
                background: rgba(141, 143, 148, 1);
                margin: 0 .15rem;
            }
            i {
                font-size: .23rem;
                color: rgba(141, 143, 148, 1);
            }
        }
        .course {
            width: 100%;
            box-sizing: border-box;
            padding: 0 .18rem;
            display: flex;
            justify-content: space-between;
            margin-bottom: .3rem;
            .course-item {
                img {
                    display: block;
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
</style>