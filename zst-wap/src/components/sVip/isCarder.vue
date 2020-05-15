<template>
    <div class="is_card">
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
        <div class="user_detail">
            <div class="de_mess">
                <div class="img_de">
                    <img :src="userInfo.ico" alt="">
                </div>

                <div class="de_de">
                    <div style="color:#000;font-size: .34rem">{{userInfo.nick}}</div>
                    <div style="color:#8A8A8A;font-size: .24rem">{{userInfo.username}}</div>
                </div>
            </div>
            <div class="de_btn" @click="gocarderText">
                卡主秘籍
            </div>
        </div>

        <div class="card_detail">
            成为卡主，自己和朋友都受益，<span style="color:#FE054C;">还能赚钱！</span>
        </div>

        <div class="card_four">
            <div class="card_num">
                <div class="card_title">我的卡</div>
                <div class="card_con" v-if="showdata"> {{userInfo.main_cards}} 张</div>
                <div class="card_con" v-else>--张</div>
            </div>

            <div class="card_num">
                <div class="card_title">累计使用</div>
                <div class="card_con" v-if="showdata"> {{userInfo.maincard_records}} 次</div>
                <div class="card_con" v-else>--次</div>
            </div>

            <div class="card_num">
                <div class="card_title">累计分享使用</div>
                <div class="card_con" v-if="showdata">{{userInfo.sharecard_records}}次</div>
                <div class="card_con" v-else>--次</div>
            </div>

            <div class="card_num">
                <div class="card_title">累计收益</div>
                <div class="card_con" v-if="showdata">{{(userInfo.profit/100).toFixed(2)}}元</div>
                <div class="card_con" v-else>--元</div>
            </div>
        </div>

        <div class="my_card">
            <div class="my_card_title">
                我的会员卡
            </div>
          <div class="my_con_card" v-if="showdata" style="overflow: hidden;padding-bottom:0.9rem;">
            <div class="my_card_con"  v-for="item in vipcard" @click="godetail(item)">
                <div class="my_card_img">
                    <img :src="item.cardImg ===''?card:item.cardImg" alt="">
                </div>

                <div class="my_card_right">
                    <div class="card_name">{{item.storeName}}</div>
                    <div class="card_address txt-ellipsis">{{item.unitAddress}}</div>
                    <div class="card_type">
                        <div style="float: left;border: 1px solid #FE054C;color: #FE054C;padding:0 0.2rem;margin-right: 0.2rem;">
                            {{item.discountRate * 10}}折
                        </div>
                        <div style="color:#FE054C;float: left;">SVIP折扣</div>
                    </div>
                    <div class="card_money">
                        <span style="float: left;">余额￥ {{(item.money / 100).toFixed(2)}}</span>
                        <span style="float: right;color:#8D8E98;">分享卡{{item.shareCardCount}}张</span>
                    </div>
                </div>
            </div>
        </div>
            <div class="my_card_con" v-if="!showdata">
                <div class="no_data_img">
                    <div class="img_img">
                        <img :src="nodata" alt="">
                    </div>
                </div>
                <div class="nodeta_text">
                    <div>您当前还没有会员卡</div>
                    <div style="font-size: .32rem">查看在招募卡主的周边商家</div>
                </div>
            </div>

        </div>

        <div class="my_card_foot" v-if="showdata" @click="findSvipD">
            看看周边有哪些店在招募卡主，去看看>>
        </div>
        <div class="foot_btn" v-if="!showdata">
            <div class="btn_btn">

                <div @click="goTe" class="f_btn_left">周边商家看看</div>

                <div class="f_btn_right" @click="inviteBusiness">邀请商家</div>

            </div>

            <div class="notice_con">
                注：邀请商家需开通VIP,入驻成功后,<span style="color:#F7094D;">每家奖励300元</span>
            </div>
        </div>

        <no-vip-pop :showNovip="showNov" :title="no_title" :no_con="no_con" @noVipBool="shwonext"/>
    </div>
</template>

<script>
    import card from '@/assets/imgs/common/my_card.png'
    import nodata from '@/assets/imgs/common/nodata.png'

    import {userInfo} from '@/assets/js/comm'

    import noVipPop from '@/components/common/noVipPop'

    import {getSignIn, getToken, getCity , inviteBusiness , getMember , callAppMethod , postTitle} from '@/assets/js/jsBridge'

    export default {
        props: ['tokenPromise'],
        name: "isCarder",
        components:{
          noVipPop
        },
        data() {
            return {
                // 本地图片
                card: card,
                nodata: nodata,
                // 是否有数据
                showdata: true,
                token: '',
                sec: '',
                listQuery: {
                    token: ''
                },
                //数据
                userInfo: {
                    nick: '',
                    username: '',
                    ico: '',
                    main_cards: ''
                },
                vipcard: [],
                showExceptional: false,
                showNov:false,
                no_title:'',
                no_con:''
            }
        },
        mounted() {
            var _self = this;
            postTitle('我是卡主');
            _self.tokenPromise.then(res => {
                _self.token = res;
                _self.getuserInfo();
            })

        },
        methods: {
            close() {
                let _self = this;
                _self.showExceptional = false;
            },
            getuserInfo() {
                var _data = {
                    token: String(this.token)
                }
                getSignIn(_data).then(result => {
                    var sec = result;
                    userInfo(_data, sec).then(res => {
                        console.log(res);
                        this.userInfo = {
                            nick: res.data.data.nick,
                            username: res.data.data.username,
                            ico: res.data.data.ico,
                            main_cards: res.data.data.main_cards,
                            maincard_records: res.data.data.maincard_records,
                            sharecard_records: res.data.data.sharecard_records,
                            profit: res.data.data.profit,
                        };
                        this.vipcard = res.data.data.my_maincards;
                        if (res.data.data.my_maincards.length === 0) {
                            this.showdata = false;
                        }

                    })
                })
            },
            godetail(par) {
                this.$router.push({name: 'svipDetail', query: {maincardId: par.id}});
            },
            findSvipD() {
                callAppMethod('15');
            },
            /*吊起商家二维码*/
            inviteBusiness(){
                var _self = this;
                getMember().then(res => {
                    if(res){
                      //如果是会员的话去下一个页面  如果不是则跳出一个去往支付页面升级会员的一个弹出层
                        if(res == 1){
                          inviteBusiness();
                        }else{
                          this.showNov = true;
                          this.no_title = 'VIP会员专享';
                          this.no_con = '亲，只有VIP会员才能发布产品秀哦~';
                        }
                    }else{
                        _self.showExceptional = true;
                    }
                })
            },
            targetHref(url) {
                window.location.href = url;
            },
            goTe(){
              callAppMethod('15');
            },
            gocarderText(){
               this.$router.push({name:'carderText'})
            },
            shwonext(val){
              this.showNov = val;
            }

        }
    }
</script>

<style lang="scss" scoped>
    .is_card {
        display: block;
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
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
        .user_detail {
            width: 100%;
            height: 1.82rem;
            background: #EEEEEE;
            display: flex;
            /*justify-content: center;*/
            align-items: center;
            margin-bottom: .32rem;
            .de_mess {
                height: .84rem;
                margin-left: .37rem;
                width: 68%;
                /*margin:.46rem .37rem .52rem .37rem;*/
                .img_de {
                    width: .84rem;
                    height: .84rem;
                    background: #fff;
                    float: left;
                    img {
                        width: 100%;
                        height: 100%;
                        display: block;
                    }
                }
                .de_de {
                    float: left;
                    font-size: .34rem;
                    margin-left: .2rem;
                    margin-top: .05rem;
                }
            }
            .de_btn {
                float: right;
                font-size: .28rem;
                width: 1.6rem;
                height: 0.52rem;
                background: linear-gradient(0deg, rgba(247, 9, 77, 1), rgba(255, 85, 93, 1));
                border-radius: .26rem;
                text-align: center;
                line-height: 0.52rem;
                color: #fff;
            }
        }
        .card_detail {
            font-size: .28rem;
            margin-left: .19rem;
            margin-bottom: .42rem;
        }
        .card_four {
            width: 96%;
            margin: 0 2%;
            display: flex;
            justify-content: space-around;
            margin-bottom: .4rem;
            .card_num {
                .card_title {
                    font-size: .24rem;
                    color: #000;
                    margin-bottom: .16rem;
                }
                .card_con {
                    font-size: .28rem;
                    color: #000;
                    text-align: center;
                }
            }
        }
        .my_card {
            width: 94%;
            margin: 0 3%;
            overflow: hidden;
            .my_card_title {
                width: 100%;
                font-size: .34rem;
                color: #000;
                border-bottom: 1PX solid #E5E5E5;
                padding-bottom: .2rem;
                margin-bottom: .23rem;
            }

            .my_card_con {
                width: 100%;
                height: auto;
                overflow: hidden;
                margin-bottom: .23rem;
                .my_card_img {
                    float: left;
                    width: 2.44rem;
                    height: 1.55rem;
                    img {
                        width: 100%;
                        height: 100%;
                        display: block;
                    }
                }
                .my_card_right {
                    float: left;
                    width: 4.5rem;
                    margin-left: .1rem;
                    border-bottom: 1px solid #E5E5E5;
                    padding-bottom: .23rem;
                    .card_name {
                        font-size: .28rem;
                        color: #000;
                    }
                    .card_address {
                        font-size: .24rem;
                        color: #8D8E98;
                    }
                    .card_type {
                        font-size: .2rem;
                        overflow: hidden;
                        display: block;
                        margin-bottom: 0.1rem;
                        div {
                            font-size: .2rem;
                        }
                    }
                    .card_money {
                        font-size: .28rem;
                        color: #FE054C;
                        font-weight: 500;
                    }
                }

                .no_data_img {
                    width: 100%;
                    height: 1.86rem;
                    margin-top: 0.8rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: .74rem;
                    .img_img {
                        width: 2.57rem;
                        height: 1.86rem;
                        img {
                            width: 100%;
                            height: 100%;
                            display: block;
                        }
                    }
                }
                .nodeta_text {
                    width: 100%;
                    text-align: center;
                    font-size: .36rem;
                    color: #000;
                }
            }
        }
        .my_card_foot {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: .9rem;
            background: #FE054C;
            font-size: .28rem;
            color: #fff;
            line-height: .9rem;
            padding-left: .25rem;
            z-index:999;
        }
        .foot_btn {
            position: fixed;
            width: 94%;
            margin: 0 3%;
            height: 1.46rem;
            bottom: 0;
            left: 0;
            .btn_btn {
                width: 100%;
                height: .82rem;
                background: #fff;
                display: flex;
                justify-content: space-between;
                .f_btn_left {
                    width: 3.3rem;
                    height: .82rem;
                    background: #FEB623;
                    font-size: .36rem;
                    border-radius: .1rem;
                    color: #fff;
                    text-align: center;
                    line-height: .82rem;
                }
                .f_btn_right {
                    width: 3.3rem;
                    height: .82rem;
                    background: #F7094D;
                    font-size: .36rem;
                    border-radius: .1rem;
                    text-align: center;
                    line-height: .82rem;
                    color: #fff;
                }
            }
            .notice_con {
                height: .64rem;
                line-height: .64rem;
                text-align: center;
                font-size: .24rem;
                color: #000000;
            }
        }
    }
</style>
