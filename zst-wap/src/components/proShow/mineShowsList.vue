<template>
    <div class="mineShowList">
        <transition name="alertMsg">
            <div class="alert" v-show="tipFlag">
                <div class="confirm" v-if="tipFlag">
                    <div class="close" @click="close">
                        <img src="@/assets/imgs/common/close.png" alt="">
                    </div>
                    <div class="tip">是否{{state == 1 ? '下架' : '上架'}}商品?</div>
                    <div class="btns">
                        <button @click="handPull(0)">取消</button>
                        <button @click="handPull(1)">确认{{state == 1 ? '下架' : '上架'}}</button>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="alertMsg">
            <div class="tipBox" v-show="timer">
                {{tip}}
            </div>
        </transition>
        <div>
            <header>
                <div class="buy">
                    <div class="first">
                        <span>当前产品位{{mineShowInfo.unuseredShowsCount}}个,已发布产品秀{{mineShowInfo.useredShowsCount}}个</span>
                        <button class="btns" @click="enterBuy">购买产品位</button>
                    </div>
                    <p>产品位用于发布产品秀,VIP会员免费赠送5个产品位</p>
                </div>
                <div class="menus">
                    <p :class="{active:active==0}" @click="changeStatus(0)">全&nbsp;部<i></i></p>
                    <p :class="{active:active==1}" @click="changeStatus(1)">上&nbsp;架<i></i></p>
                    <p :class="{active:active==2}" @click="changeStatus(2)">下&nbsp;架<i></i></p>
                </div>
            </header>
            <div style="height: 2.23rem;margin-bottom: .36rem"></div>
            <div class="mineShow-item" v-for="item in mineShowInfoFilter" :key="item.id" @click="enterProEdit(item.id)">
                <span class="status" :class="{putaway: item.state==1}" @click.stop="confirm(item.state,item.id)">{{item.state==1 ? '点击下架' : '点击上架'}}</span>
                <p class="item-title">
                    {{item.state==1 ? '【已上架】' : '【已下架】'}}{{item.goodsName}}
                </p>
                <div class="item-info">
                    <div class="thumb">
                        <img v-lazy="item.imgUrl" alt="">
                    </div>
                    <div class="info-right">
                        <div class="first">
                            <div class="category" :class="{
                                furniture:item.goodsTypeId==100004,
                                skinCare:item.goodsTypeId==100000,
                                keepHealth:item.goodsTypeId==100001,
                                dress:item.goodsTypeId==100002,
                                food:item.goodsTypeId==100003,
                                maternal:item.goodsTypeId==100005,
                                service:item.goodsTypeId==100006,
                                outlineShop:item.goodsTypeId==100007}"
                            >{{item.goodsTypeName}}</div>
                            <div class="views"><i class="iconfont icon-liulan"></i>{{item.readCount > 10000 ?  Math.floor(item.readCount/10000) : item.readCount}}{{item.readCount > 10000 ? '万' : ''}}</div>
                            <div class="praise"><i class="iconfont icon-dianzan"></i>{{item.praiseCount > 10000? Math.floor(item.praiseCount/10000) : item.praiseCount}}{{item.praiseCount > 10000 ? '万' : ''}}</div>
                            <div class="price"><i class="iconfont icon-shujuku"></i>{{item.totalMoney}}</div>
                        </div>
                        <div class="second">
                            <div class="releaseTime">发布时间 : {{timeShift(item.releaseTime)}}</div>
                        </div>
                        <div class="third">
                            <div class="scope">发布范围 : {{item.pushAreaName}}</div>
                            <div class="collect"><i class="iconfont icon-renwu"></i>{{item.receiverCount}}人</div>
                        </div>
                    </div>
                </div>
            </div>
            <button class="issure" v-if="mineShowInfo.shows!=0" @click="releaseProShow">发布产品秀</button>
        </div>
        <div class="showEmpty" v-if="mineShowInfo.shows==0">
            <div class="empty">
                <img src="@/assets/imgs/proShow/empty.png" alt="">
            </div>
            <p style="font-size: .36rem;margin-bottom: .17rem">还没有产品秀哦~</p>
            <p style="font-size: .3rem;margin-bottom: 1.51rem">发布产品秀精准获客~</p>
            <button @click="releaseProShow">发布产品秀</button>
        </div>
    </div>
</template>

<script>
    import {mineShowList,handPull} from '@/assets/js/comm';
    import {postTitle,getSignIn,releaseProShow} from "@/assets/js/jsBridge";

    export default {
        name: "mineShowsList",
        props: ['tokenPromise'],
        data(){
            return{
                mineShowInfo: '',
                mineShowInfoFilter: '',
                active:0,
                tipFlag: false,
                showId: '',
                state: '',
                tip: '',
                timer: false,
                token: ''
            }
        },
        methods:{
            close(){
                let _self = this;
                _self.tipFlag = false;
            },
            init(){
                let _self = this;
                _self.getShowCounts();
                postTitle("我的产品秀");
            },
            /*获取产品秀-用户产品位个数和金额*/
            getShowCounts(){
                let _self = this;
                let _data = {
                    token: _self.token
                };
                getSignIn(_data).then(sec => {
                    mineShowList(_data,sec).then(res => {
                        if(res.data.state == 1){
                            _self.mineShowInfo = res.data.data;
                            _self.mineShowInfoFilter = res.data.data.shows;
                            _self.changeStatus(_self.active);
                            console.log(_self.mineShowInfo);
                        }
                    })
                });
            },
            /*上下架产品秀查询*/
            changeStatus(status){
                let _self = this;
                _self.active = status;
                if(status == 0){
                    _self.mineShowInfoFilter = _self.mineShowInfo.shows;
                }else{
                    _self.mineShowInfoFilter = _self.mineShowInfo.shows.filter(ele => ele.state == status);
                }
            },
            /*进入购买产品位页*/
            enterBuy(){
                let _self = this;
                _self.$router.push({
                    name: 'buyStart'
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
            /*进入产品秀编辑*/
            enterProEdit(id){
                let _self = this;
                _self.$router.push({
                    name: 'proShowsDetails',
                    query: {proId: id}
                })
            },
            /*发布产品秀*/
            releaseProShow(){
                let _self = this;
                let _data = {
                    state: 0
                };
                releaseProShow(_data);
            },
            /*上下架产品秀*/
            confirm(state,id){
                let _self = this;
                _self.showId = id;
                _self.state = state;
                _self.tipFlag = true;

            },
            handPull(status){
                let _self = this;
                if(status){
                    // console.log(status);
                    let _data = {
                        token: _self.token,
                        state: _self.state == 1 ? 2 : 1,
                        showId: _self.showId
                    };
                    getSignIn(_data).then(sec => {
                        handPull(_data,sec).then(res => {
                            if(res.data.state == 1){
                                if(_self.state == 1){
                                    _self.tip = '下架成功'
                                }else{
                                    _self.tip = '上架成功'
                                }
                                _self.getShowCounts();
                                _self.close();
                                _self.state = '';
                                _self.showId = '';
                                _self.timer = true;
                            }
                        })
                    });
                }else{
                    _self.tip = '已取消';
                    _self.close();
                    _self.state = '';
                    _self.showId = '';
                    _self.timer = true;
                }
            }
        },
        watch: {
            timer(){
                let _self = this;
                setTimeout(() => {
                    _self.timer = false;
                },2000)
            }
        },
        mounted(){
            let _self = this;
            _self.tokenPromise.then(res => {
                _self.token = res;
                _self.init();
            });
        }
    }
</script>

<style lang="scss" scoped="">
    .alertMsg-enter-active{
        animation: zoomIn .3s;
    }
    .alertMsg-leave-active{
        animation: zoomOut .3s;
    }
    .mineShowList{
        box-sizing: border-box;
        padding: 0 .12rem;
        .alert{
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(12,12,12,.3);
            z-index:10;
            .confirm{
                width: 5.88rem;
                height: 3.34rem;
                border-radius: .08rem;
                background: #FFFFFF;
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                margin: auto;
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
                .tip{
                    width: 100%;
                    height: 2.44rem;
                    line-height: 2.44rem;
                    text-align: center;
                    font-size: .32rem;
                }
                .btns{
                    width: 100%;
                    height: .9rem;
                    display: flex;
                    border-bottom-left-radius: .08rem;
                    border-bottom-right-radius: .08rem;
                    overflow: hidden;
                    button{
                        display: block;
                        width: 50%;
                        height: 100%;
                        font-size: .36rem;
                    }
                    button:first-child{
                        background: #f0f0f0;
                        color: #a5a6aa;
                    }
                    button:last-child{
                        background: #ff0049;
                        color: #FFFFFF;
                    }
                }
            }
        }
        .tipBox{
            width: 2.61rem;
            height: .8rem;
            font-size: .36rem;
            color: #FFFFFF;
            background: rgba(12,12,12,.5);
            text-align: center;
            position: absolute;
            top: 0;
            right: 0;
            left: 0;
            bottom: 0;
            margin: auto;
            border-radius: .04rem;
            line-height: .8rem;
            z-index: 10;
        }
        header{
            background: #f7094d;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            box-sizing: border-box;
            padding: 0 .12rem;
            z-index: 2;
            .buy{
                width: 100%;
                box-sizing: border-box;
                padding: .2rem .24rem;
                border-radius: .08rem;
                margin: .19rem 0;
                background: #dd0543;
                .first{
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: .19rem;
                    span{
                        font-size: .28rem;
                        color: #FFFFFF;
                    }
                    .btns{
                        width: 1.48rem;
                        height: .45rem;
                        background: #38be7a;
                        color: #FFFFFF;
                        border-radius: .08rem;
                    }
                }
                p{
                    font-size: .24rem;
                    color: #FFFFFF;
                }
            }
            .menus{
                font-size: .3rem;
                color: #FFFFFF;
                display: flex;
                justify-content: space-around;
                margin-bottom: .02rem;
                p{
                    /*letter-spacing: .3rem;*/
                }
                .active{
                    i{
                        display: block;
                        width: 100%;
                        height: .07rem;
                        border-radius: .07rem;
                        background: #FFFFFF;
                    }
                }
            }
        }
        .mineShow-item{
            width: 100%;
            box-sizing: border-box;
            padding: .33rem .18rem;
            box-shadow: 0 0 .42rem .08rem #e9e9e9;
            -webkit-box-shadow: 0 0 .42rem .08rem #e9e9e9;
            -moz-box-shadow: 0 0 .42rem .08rem #e9e9e9;
            border-radius: .08rem;
            margin-bottom: .24rem;
            position: relative;
            overflow: hidden;
            .status{
                font-size: .27rem;
                color: #FFFFFF;
                background: #d9d9d9;
                position: absolute;
                top: 0;
                right: 0;
                padding: 0 .12rem;
            }
            .putaway{
                background: #ffc209;
            }
            .item-title{
                font-size: .34rem;
                color: #080103;
                margin-bottom: .33rem;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
            }
            .item-info{
                width: 100%;
                height: 1.6rem;
                display: flex;
                justify-content: space-between;
                .thumb{
                    width: 2.1rem;
                    height: 100%;
                    border-radius: .04rem;
                    overflow: hidden;
                    img{
                        display: block;
                        width: 100%;
                        height: 100%;
                        /*background: #1a9bb1;*/
                    }
                }
                .info-right{
                    width: 4.5rem;
                    height: 100%;
                    .first{
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: .18rem;
                        .category{
                            border-radius: .08rem;
                            font-size: .24rem;
                            padding: 0 .14rem;
                        }
                        .views,.praise,.price{
                            font-size: .24rem;
                            color: #94969b;
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
                    .second{
                        margin-bottom: .18rem;
                        .releaseTime{
                            font-size: .24rem;
                            color: #94969b;
                        }
                    }
                    .third{
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        font-size: .24rem;
                        color: #94969b;
                        .collect{
                            display: flex;
                            align-items: center;
                            margin-right: .42rem;
                            i{
                                margin-right: .12rem;
                            }
                        }
                    }
                }
            }
        }
        .issure{
            display: block;
            width: 100%;
            height: .8rem;
            background: #ff0030;
            color: #FFFFFF;
            font-size: .36rem;
            position: fixed;
            bottom: 0;
            left: 0;
        }
        .showEmpty{
            width: 100%;
            .empty{
                width: 3.32rem;
                height: 3.32rem;
                margin: 2.17rem auto .61rem;
                img{
                    display: block;
                    width: 100%;
                    height: 100%;
                }
            }
            p{
                text-align: center;
            }
            button{
                display: block;
                width: 4.56rem;
                height: .85rem;
                background: #ff0030;
                color: #FFFFFF;
                font-size: .36rem;
                border-radius: .85rem;
                margin: 0 auto;
            }
        }
    }
</style>