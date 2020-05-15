<template>
    <div class="newProshowsList">
        <div class="bag-scroll" ref="myScroll">
            <div class="scroll-container" v-if="applyFlag1">
                <div class="newProducts-item" v-for="item in products" :key="item.id" @click="enterProDetails(item.id)">
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
            </div>
        </div>
        <div class="load" v-if="!applyFlag1">

        </div>
        <div class="showEmpty" v-if="products.length==0 && applyFlag1">
            <div class="empty">
                <img src="@/assets/imgs/proShow/empty.png" alt="">
            </div>
            <p style="font-size: .36rem;margin-bottom: .17rem">还没有产品秀哦~</p>
        </div>
    </div>
</template>

<script>
    import {getListPage} from '@/assets/js/comm';
    import {postTitle , getSignIn} from "@/assets/js/jsBridge";
    import BScroll from 'better-scroll';
    export default {
        name: "newProshowsList",
        props: ['tokenPromise'],
        data(){
            return{
                type:2,
                pageNum:1,
                pageSize:5,
                products:[],
                applyFlag1: false,
                token: ''
            }
        },
        methods: {
            init(){
                let _self = this;
                if(_self.$route.query._type == 1){
                    postTitle(_self.$route.query.typeName);
                    _self.getCateList();
                }else{
                    _self.type = _self.$route.query.type ? _self.$route.query.type : _self.type;
                    _self.getListPage();
                    if(_self.type == 1){
                        postTitle("热门产品");
                    }else{
                        postTitle("最新发布");
                    }
                }
            },
            /*获取产品秀列表*/
            getListPage(){
                let _self = this;
                let _data = {
                    token: _self.token,
                    type: _self.type,
                    pageNum: _self.pageNum,
                    pageSize: _self.pageSize
                };
                getSignIn(_data).then(sec => {
                    getListPage(_data,sec).then(res => {
                        if(res.data.state == 1){
                            _self.products = res.data.data.shows;
                        }
                        _self.applyFlag1 = true;
                    })
                })
            },
            /*按类别查询*/
            getCateList(){
                let _self = this;
                let _data = {
                    token: _self.token,
                    type: 1,
                    pageNum: 1,
                    pageSize: 3,
                    goodsTypeId: _self.$route.query.id
                };
                getSignIn(_data).then(sec => {
                    getListPage(_data,sec).then(res => {
                        // console.log(res.data);
                        if(res.data.state == 1){
                            _self.products = res.data.data.shows;
                            _data = {
                                token: _self.token,
                                type: 2,
                                pageNum: _self.pageNum,
                                pageSize: _self.pageSize,
                                goodsTypeId: _self.$route.query.id
                            };
                            getSignIn(_data).then(sec => {
                                getListPage(_data,sec).then(res => {
                                    if(res.data.state == 1){
                                        _self.products = _self.products.concat(res.data.data.shows);
                                    }
                                    _self.applyFlag1 = true;
                                })
                            })
                        }
                    })
                });
            },
            /*进入产品秀详情页*/
            enterProDetails(id){
                let _self = this;
                _self.$router.push({
                    name: 'proShowsDetails',
                    query: {proId: id}
                })
            },
            /*上拉加载*/
            morePro(){
                let _self = this;
                _self.pageNum++;
                let _data;
                if(_self.$route.query._type == 1){
                    _data = {
                        token: _self.token,
                        type: _self.type,
                        pageNum: _self.pageNum,
                        pageSize: _self.pageSize,
                        goodsTypeId: _self.$route.query.id
                    };
                }else{
                    _data = {
                        token: _self.token,
                        type: _self.type,
                        pageNum: _self.pageNum,
                        pageSize: _self.pageSize
                    }
                }
                getSignIn(_data).then(sec => {
                    getListPage(_data,sec).then(res => {
                        // console.log(res.data);
                        if(res.data.state == 1){
                            _self.products = _self.products.concat(res.data.data.shows);
                        }
                    })
                })
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
                    _self.morePro();
                });
            }
        },
        watch: {
            products:{
                handler(){
                    // console.log(1);
                    setTimeout(()=>{
                        this.scroll.finishPullUp();
                        this.scroll.finishPullDown();
                        this.scroll.refresh();
                    },200)
                },
                deep:true
            }
        },
        mounted(){
            let _self = this;
            _self.tokenPromise.then(res => {
                _self.token = res;
                _self.init();
                setTimeout(()=>{
                    _self.initScroll();
                },200)
            })
        }
    }
</script>

<style lang="scss" scoped="">
    @import '../../assets/css/global.scss';
    .bag-scroll{
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }
    .newProshowsList{
        box-sizing: border-box;
        padding: .24rem .12rem;
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
        .newProducts-item{
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
                    background: #0A4DB7;
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
                        background: red;
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