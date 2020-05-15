<template>
    <div class="indexContainer">
        <div class="loading" v-if="!applyFlag1 && !applyFlag2 && !applyFlag3">

        </div>
        <transition name="alertMsg">
            <div class="alert" v-show="showExceptional">
                <div class="exceptional" v-if="showExceptional">
                    <div class="close" @click="close">
                        <img src="@/assets/imgs/common/close.png" alt="">
                    </div>
                    <div class="vip">
                        <img src="@/assets/imgs/proShow/vip.png" alt="">
                    </div>
                    <p>亲,只有VIP会员才能发布产品哦~</p>
                    <button @click="targetHref">马上升级VIP</button>
                </div>
            </div>
        </transition>
        <!--<ul class="products" v-for="group in proCategories">
            <li class="products-item" v-for="item in group" @click="queryCategory(item.id,item.typeName)">
                <img :src="item.ico" alt="">
                <p>{{item.typeName}}</p>
            </li>
        </ul>-->
        <div v-if="applyFlag1 && applyFlag2 && applyFlag3">
            <swiper :options="swiperOption"  ref="mySwiper" >
                <swiper-slide class="products" v-for="(group,index) in proCategories" :key="index">
                    <div class="products-item" v-for="item in group" @click="queryCategory(item.id,item.typeName)" :key="item.id">
                        <img :src="item.ico" alt="">
                        <p>{{item.typeName}}</p>
                    </div>
                </swiper-slide>
                <!--<div class="swiper-pagination" slot="pagination"></div>-->
            </swiper>
            <div class="hotProducts">
                <div class="titleLine">
                    <p class="left-title"><i></i>热门产品</p>
                    <p class="right-title" @click="enterProLists(1)">更多热门&gt;</p>
                </div>
                <div class="hotProducts-item" v-for="item in hotProducts" :key="item.id" @click="enterProDetails(item.id)">
                    <div class="item-title">
                        <div class="left">{{item.goodsName}}</div>
                        <div class="item-award" v-if="item.singleMoney">
                            <i class="iconfont icon-shujuku"></i>
                            <span>分享赚{{item.singleMoney}}{{item.taskType == 1 ? '现金' : '话呗'}}</span>
                        </div>
                    </div>
                    <!--<img :src="item.sort" alt="" class="top">-->
                    <div class="thumbsContainer">
                        <div class="thumb" v-for="thumb in item.imgUrls" :key="thumb">
                            <img v-lazy="thumb" alt="">
                        </div>
                    </div>
                    <div class="productInfo">
                        <div class="author">
                            <img :src="item.ico" alt="">
                            <span>{{item.nick}}</span>
                        </div>
                        <div class="category">
                            {{item.goodsTypeName}}
                        </div>
                        <div class="views">
                            <i class="iconfont icon-liulan"></i>
                            <span>{{item.readCount > 10000 ?  Math.floor(item.readCount/10000) : item.readCount}}{{item.readCount > 10000 ? '万' : ''}}</span>
                        </div>
                        <div class="praise">
                            <i class="iconfont icon-dianzan"></i>
                            <span>{{item.praiseCount > 10000? Math.floor(item.praiseCount/10000) : item.praiseCount}}{{item.praiseCount > 10000 ? '万' : ''}}</span>
                        </div>
                    </div>
                </div>
                <p class="morePro" @click="enterProLists(1)">更多热门产品...</p>
            </div>
            <div class="hotProducts">
                <div class="titleLine">
                    <p class="left-title"><i></i>最新发布</p>
                    <p class="right-title" @click="enterProLists(2)">更多新品&gt;</p>
                </div>
                <div class="hotProducts-item" v-for="item in newProducts" :key="item.id" @click="enterProDetails(item.id)">
                    <div class="item-title">
                        <div class="left">{{item.goodsName}}</div>
                        <div class="item-award" v-if="item.singleMoney">
                            <i class="iconfont icon-shujuku"></i>
                            <span>分享赚{{item.singleMoney}}{{item.taskType == 1 ? '现金' : '话呗'}}</span>
                        </div>
                    </div>
                    <div class="thumbsContainer">
                        <div class="thumb" v-for="thumb in item.imgUrls" :key="thumb">
                            <img v-lazy="thumb" alt="">
                        </div>
                    </div>
                    <div class="productInfo">
                        <div class="author">
                            <img :src="item.ico" alt="">
                            <span>{{item.nick}}</span>
                        </div>
                        <div class="category">
                            {{item.goodsTypeName}}
                        </div>
                        <div class="views">
                            <i class="iconfont icon-liulan"></i>
                            <span>{{item.readCount > 10000 ?  Math.floor(item.readCount/10000) : item.readCount}}{{item.readCount > 10000 ? '万' : ''}}</span>
                        </div>
                        <div class="praise">
                            <i class="iconfont icon-dianzan"></i>
                            <span>{{item.praiseCount > 10000? Math.floor(item.praiseCount/10000) : item.praiseCount}}{{item.praiseCount > 10000 ? '万' : ''}}</span>
                        </div>
                    </div>
                </div>
                <p class="morePro" @click="enterProLists(2)">更多最新产品...</p>
            </div>
            <div style="width: 100%;height: 1.22rem"></div>
            <footer>
                <button class="btns btn-release" @click="releaseProShow">发布产品秀</button>
                <button class="btns btn-mine" @click="enterMineShows">我的产品秀</button>
            </footer>
        </div>
    </div>
</template>
<script>
    import {getListPage , getProCategory} from '@/assets/js/comm';
    import 'swiper/dist/css/swiper.css';
    import { swiper, swiperSlide } from 'vue-awesome-swiper';
    import {getCity,proShowBtn , noProShowBtn , getSignIn , postTitle , releaseProShow} from "@/assets/js/jsBridge";

    export default {
        name: "index",
        props:['tokenPromise'],
        components:{
            swiper,
            swiperSlide
        },
        data(){
            return{
                showExceptional: false,
                hotProducts: '',
                newProducts: '',
                proCategories: [],
                applyFlag1: false,
                applyFlag2: false,
                applyFlag3: false,
                isVIP: 0,
                vipThump: require('@/assets/imgs/proShow/vip.png'),
                token: '',
                areaCode: '330100',
                swiperOption: {
                    // autoplay: true,
                    // speed: 500,
                    // loop: true
                }
            }
        },
        methods:{
            close(){
                let _self = this;
                _self.showExceptional = false;
            },
            init(){
                let _self = this;
                _self.getHotPro();
                _self.getNewPro();
                _self.getProCategory();
                postTitle("产品秀");
            },
            /*获取热门产品列表*/
            getHotPro(id){
                let _self = this;
                let _data;
                if(id){
                    _data = {
                        token: _self.token,
                        type: 1,
                        pageNum: 1,
                        pageSize: 3,
                        goodsTypeId: id,
                        areaCode: _self.areaCode
                    };
                }else{
                    _data = {
                        token: _self.token,
                        type: 1,
                        pageNum: 1,
                        pageSize: 3,
                        areaCode: _self.areaCode
                    };
                }
                getSignIn(_data).then(sec => {
                    getListPage(_data,sec).then(res => {
                        if(res.data.state == 1){
                            setTimeout(() => {
                                _self.isVIP = res.data.data.isVIP;
                                // console.log(res.data.data);
                                _self.hotProducts = res.data.data.shows;
                                let sortNum = 1;
                                _self.hotProducts.forEach(ele => {
                                    ele.sort = require('@/assets/imgs/proShow/' + sortNum + '.png');
                                    sortNum++;
                                })
                                _self.applyFlag1 = true;
                            },100)
                        }
                    })
                });
            },
            /*获取最新发布产品列表*/
            getNewPro(id){
                let _self = this;
                let _data;
                if(id){
                    _data = {
                        token: _self.token,
                        type: 2,
                        pageNum: 1,
                        pageSize: 3,
                        goodsTypeId: id,
                        areaCode: _self.areaCode
                    };
                }else{
                    _data = {
                        token: _self.token,
                        type: 2,
                        pageNum: 1,
                        pageSize: 3,
                        areaCode: _self.areaCode
                    };
                }
                getSignIn(_data).then(sec => {
                    getListPage(_data,sec).then(res => {
                        if(res.data.state == 1){
                            setTimeout(() => {
                                _self.newProducts = res.data.data.shows;
                                _self.applyFlag2 = true;
                            },100)
                            // alert(JSON.stringify(res.data.data.shows))
                        }
                    })
                })
            },
            /*获取产品秀分类*/
            getProCategory(){
                let _self = this;
                let _data = {
                    token: _self.token,
                };
                getSignIn(_data).then(sec => {
                    getProCategory(_data,sec).then(res => {
                        if(res.data.state == 1){
                            setTimeout(() => {
                                let data = res.data.data;
                                let length = Math.ceil(data.length/8);
                                for(let i=0;i<length;i++){
                                    let arr = [];
                                    data.forEach((ele,index) => {
                                        if(index >= i*8 && index < (i+1)*8){
                                            arr.push(ele);
                                        }
                                    });
                                    _self.proCategories.push(arr);
                                }
                                _self.applyFlag3 = true;
                            },100)
                        }
                    })
                })
            },
            /*分类查询*/
            queryCategory(id,typeName){
                let _self = this;
                _self.$router.push({
                    name: 'newProshowsList',
                    query: {
                        _type: 1,
                        id: id,
                        typeName: typeName
                    }
                })
            },
            /*进入产品秀列表页*/
            enterProLists(type){
                let _self = this;
                _self.$router.push({
                    name : 'newProshowsList',
                    query : {type:type}
                })
            },
            /*进入产品秀详情页*/
            enterProDetails(id){
                let _self = this;
                _self.$router.push({
                    name: 'proShowsDetails',
                    query: {proId: id}
                })
            },
            /*进入我的产品秀*/
            enterMineShows(){
                let _self = this;
                if(_self.isVIP){
                    _self.$router.push({
                        name: 'mineShowList'
                    })
                }else{
                    _self.showExceptional = true;
                }
            },
            /*发布产品秀*/
            releaseProShow(){
                let _self = this;
                if(_self.isVIP){
                    let _data = {
                        state: 0
                    };
                    releaseProShow(_data);
                }else{
                    _self.showExceptional = true;
                }
            },
            /*进入VIP充值页面*/
            targetHref(){
                window.location.href = 'https://zst.tenzhao.com/zst-wap/vipRecharge/index.html?from=singlemessage#/index'
            }
        },
        beforeRouteLeave(to,from,next){
            noProShowBtn();
            next();
        },
        created(){
            proShowBtn();
            let _self = this;
            _self.tokenPromise.then(res => {
                _self.token = res;
                getCity().then(city => {
                    _self.areaCode = city.cityCode;
                    if(_self.areaCode){
                        _self.init();
                    }else{
                        _self.areaCode = '330100';
                        _self.init();
                    }
                })
            });
        },
        mounted(){

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
    .indexContainer{
        width: 100%;
        box-sizing: border-box;
        padding: 0 .12rem;
        .loading{
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
        }
        .alert {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(12, 12, 12, .3);
            z-index: 50;
            .exceptional {
                width: 6.36rem;
                height: 5.11rem;
                border-radius: .09rem;
                position: absolute;
                top: 3rem;
                left: 0;
                right: 0;
                margin-left: auto;
                margin-right: auto;
                box-sizing: border-box;
                padding: 0 0 .26rem;
                background: #FFFFFF;
                z-index: 51;
                .close {
                    width: .55rem;
                    height: .55rem;
                    position: absolute;
                    top: -0.74rem;
                    right: -0.13rem;
                    z-index: 51;
                    img {
                        display: block;
                        width: 100%;
                        height: 100%;
                    }
                }
                .vip{
                    width: 100%;
                    height: 2.53rem;
                    img{
                        display: block;
                        width: 100%;
                        height: 100%;
                    }
                }
                p{
                    font-size: .3rem;
                    text-align: center;
                    margin-bottom: .69rem;
                }
                button{
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
        .products{
            width: 100%;
            box-sizing: border-box;
            padding: .3rem .52rem;
            display: flex;
            flex-wrap: wrap;
            /*flex-direction: column;*/
            align-content: space-between;
            justify-content: space-between;
            .products-item{
                width: 1.04rem;
                /*height: 1.04rem;*/
                /*background: #1a9bb1;*/
                margin-bottom: .5rem;
                margin-right: .5rem;
                img{
                    display: block;
                    width: .8rem;
                    height: .8rem;
                    margin: 0 auto;
                }
                p{
                    font-size: .24rem;
                    color: #5d5d5e;
                }
            }
            .products-item:nth-child(4n){
                margin-right: 0;
            }
        }
        .hotProducts{
            border-top: 1px solid #e5e5e5;
            .tips{
                font-size: .24rem;
                color: #94969b;
                text-align: center;
                margin: .5rem 0;
            }
            .titleLine{
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: .32rem;
                margin-bottom: .21rem;
                .left-title{
                    font-size: .3rem;
                    color: #000000;
                    display: flex;
                    justify-content: left;
                    i{
                        display: block;
                        width: .08rem;
                        height: .48rem;
                        background: #f7094d;
                        border-radius: .08rem;
                        margin-right: .15rem;
                        margin-left: .05rem;
                    }
                }
                .right-title{
                    font-size: .24rem;
                    color: #94969b;
                }
            }
            .hotProducts-item{
                width: 100%;
                /*height: 3.24rem;*/
                border-radius: .08rem;
                background: #FFFFFF;
                box-shadow: 0 0 .42rem .08rem #e9e9e9;
                -webkit-box-shadow: 0 0 .42rem .08rem #e9e9e9;
                -moz-box-shadow: 0 0 .42rem .08rem #e9e9e9;
                box-sizing: border-box;
                padding: 0 .28rem;
                margin-bottom: .17rem;
                position: relative;
                .item-title{
                    width: 100%;
                    padding-top: .37rem;
                    padding-bottom: .33rem;
                    display: flex;
                    justify-content: space-between;
                    .item-award{
                        display: flex;
                        align-items: center;
                        i{
                            font-size: .27rem;
                            color: #FFA61A;
                        }
                        span{
                            font-size: .18rem;
                            background: #EEEEEE;
                            border-radius: .18rem;
                            padding: 0 .1rem;
                        }
                    }
                    .left{
                        width: 4.72rem;
                        font-size: .3rem;
                        color: #080103;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                    }
                }
                .top{
                    display: block;
                    width: .55rem;
                    height: .79rem;
                    position: absolute;
                    right: .25rem;
                    top: 0;
                }
                .thumbsContainer{
                    width: 100%;
                    height: 1.6rem;
                    display: flex;
                    justify-content: space-between;
                    padding-bottom: .08rem;
                    .thumb{
                        width: 2.1rem;
                        height: 100%;
                        /*background: #0A4DB7;*/
                        border-radius: .04rem;
                        overflow: hidden;
                        img{
                            width: 100%;
                            height: 100%;
                            display: block;
                        }
                    }
                }
                .productInfo{
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-bottom: .16rem;
                    .author{
                        height: .36rem;
                        display: flex;
                        justify-content: left;
                        img{
                            width: .36rem;
                            height: .36rem;
                            /*background: red;*/
                            margin-right: .09rem;
                        }
                        span{
                            /*line-height: .36rem;*/
                            color: #080103;
                            font-size: .18rem;
                        }
                    }
                    .category{
                        font-size: .24rem;
                        color: #94969b;
                        margin-right: 1.5rem;
                    }
                    .views{
                        font-size: .24rem;
                        color: #94969b;
                    }
                    .praise{
                        font-size: .24rem;
                        color: #94969b;
                    }
                }
            }
            .morePro{
                font-size: .24rem;
                color: #94969b;
                text-align: center;
                margin-bottom: .3rem;
            }
        }
        footer{
            width: 100%;
            box-sizing: border-box;
            padding: .18rem .25rem;
            display: flex;
            justify-content: space-between;
            box-shadow: 0 0 .42rem .08rem #e9e9e9;
            -webkit-box-shadow: 0 0 .42rem .08rem #e9e9e9;
            -moz-box-shadow: 0 0 .42rem .08rem #e9e9e9;
            position: fixed;
            bottom: 0;
            left: 0;
            background: #FFFFFF;
            .btns{
                width: 3.2rem;
                height: .88rem;
                border-radius: .08rem;
                color: #FFFFFF;
                margin: 0;
                font-size: .3rem;
            }
            .btn-release{
                background: #ffa61a;
            }
            .btn-mine{
                background: #f7094d;
            }
        }
    }
</style>
