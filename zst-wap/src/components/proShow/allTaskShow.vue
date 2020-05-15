<template>
    <div class="newProshowsList">
        <div class="toggle_btn">
            <div class="cash-task">
                <div class="cash" :class="{'border-font':listQuery.taskType ==1}" @click="toggle(1)">现金任务</div>
            </div>
            <div class="word-task">
                <div class="word" :class="{'border-font':listQuery.taskType ==0}" @click="toggle(2)">话呗任务</div>
            </div>
        </div>
        <div class="bag-scroll" ref="myScroll">
            <div class="scroll-container">
                <div class="newProducts-item" v-for="item in products" :key="item.id" @click="enterProDetails(item.id)">

                    <div class="item-title">
                        <div class="left">{{item.goodsName}}</div>
                        <div class="item-award" v-if="item.singleMoney">
                            <i class="iconfont icon-shujuku"></i>
                            <span v-if="listQuery.taskType ==0">分享赚{{item.singleMoney}}话呗</span>
                            <span v-if="listQuery.taskType ==1">分享赚{{item.singleMoney}}现金</span>
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
                        <div class="complete">
                            <i class="iconfont icon-renwuwanchengqingkuangyujing"></i>
                            <span>{{item.completeNum > 10000 ?  Math.floor(item.completeNum/10000) : item.completeNum}}{{item.completeNum > 10000 ? '万' : ''}}</span>
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

            <div class="showEmpty" v-if="products.length==0">
                <div class="empty">
                    <img src="@/assets/imgs/proShow/empty.png" alt="">
                </div>
                <p style="font-size: .36rem;margin-bottom: .17rem;font-weight: 500;">还没有悬赏任务哦~</p>
                <p style="font-size: .32rem;margin-bottom: .17rem">发布产品秀，让你的产品快速火爆朋友圈~</p>
                <div class="btn_style">
                    <router-link to="/mineShowList" tag="div" class="go_product">
                        我的产品秀
                    </router-link>

                </div>
            </div>

        </div>

    </div>
</template>

<script>
    import {moneyTask,getListPage} from '@/assets/js/comm';
    import BScroll from 'better-scroll';

    import {getToken, getCity,getSignIn,postTitle} from '@/assets/js/jsBridge'

    export default {
        name: "newProshowsList",
        props: ['tokenPromise'],
        data() {
            return {
                type: 2,
                pageNum: 1,
                pageSize: 5,
                products: [],
                showMoney: true,
                showWord: false,
                listQuery: {
                    taskType: 1
                }
            }
        },
        mounted() {
            let _self = this;
            _self.init();
            _self.tokenPromise.then((res) => {
                _self.listQuery.token = res;
                // console.log(res);
                getCity().then((result) => {
                    _self.listQuery.areaCode = result.areacode;
                    _self.getListPage(_self.listQuery);
                    setTimeout(() => {
                        _self.initScroll();
                    }, 400)
                })
            });
        },
        methods: {
            init() {
                var _self = this;
                if (_self.type == 1) {
                    postTitle("热门产品");
                } else {
                    postTitle("最新发布");
                }
            },
            cansheng() {
                alert(1)
            },
            /*获取产品秀列表*/
            getListPage(listquery) {
                var _self = this;
                _self.listQuery.showType = _self.type;
                getSignIn(listquery).then(sec => {
                    moneyTask(listquery,sec).then(res => {
                        if (res.data.state == 1) {
                            _self.products = res.data.data.shows;
                        }
                    })
                })
            },
            /*进入产品秀详情页*/
            enterProDetails(id) {
                let _self = this;
                _self.$router.push({
                    name: 'proShowsDetails',
                    query: {proId: id}
                })
            },
            /*上拉加载*/
            morePro() {
                let _self = this;
                _self.pageNum++;
                // console.log(_self.pageNum);
                let _data;
                if (_self.$route.query._type == 1) {
                    _data = {
                        token: _self.listQuery.token,
                        type: _self.type,
                        pageNum: _self.pageNum,
                        pageSize: _self.pageSize,
                        goodsTypeId: _self.$route.query.id
                    };
                } else {
                    _data = {
                        token: _self.listQuery.token,
                        type: _self.type,
                        pageNum: _self.pageNum,
                        pageSize: _self.pageSize
                    }
                }
                getSignIn(_data).then(sec => {
                    getListPage(_data,sec).then(res => {
                        if (res.data.state == 1) {
                            _self.products = _self.products.concat(res.data.data.shows);
                        }
                    })
                })
            },
            /*初始化滚动*/
            initScroll() {
                // console.log(this.$refs);
                let _self = this;
                this.scroll = new BScroll(this.$refs['myScroll'], {
                    click: true,
                    pullUpLoad: {
                        threshold: 50
                    }
                });
                this.scroll.on("pullingUp", () => {
                    _self.morePro();
                });
            },
            toggle(num) {
                if (num == 1) {
                    this.showWord = false;
                    this.showMoney = true;
                    this.listQuery.taskType = 1;
                    console.log('看看切换时穿的参数', this.listQuery);
                    this.getListPage(this.listQuery)

                }
                if (num == 2) {
                    this.showWord = true;
                    this.showMoney = false;
                    this.listQuery.taskType = 0;
                    console.log('参数', this.listQuery)
                    this.getListPage(this.listQuery)
                }
            }
        },
        watch: {
            products: {
                handler() {
                    // console.log(1);
                    setTimeout(() => {
                        this.scroll.finishPullUp();
                        this.scroll.finishPullDown();
                        this.scroll.refresh();
                    }, 100)
                },
                deep: true
            }
        },
    }
</script>

<style lang="scss" scoped="">
    .bag-scroll {
        position: absolute;
        top: 0.8rem;
        bottom: 0;
        left: 0;
        right: 0;
    }

    .border-font {
        border-bottom: 0.04rem solid #F7094D;
        color: #F7094D;
    }

    .toggle_btn {
        width: 100%;
        height: 0.7rem;
        background: #fff;
        display: flex;
        margin-bottom: 0.04rem;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 999;
        .cash-task {
            width: 50%;
            height: 0.7rem;
            font-size: 0.28rem;
            display: flex;
            justify-content: center;
            align-items: center;
            .cash {
                height: 0.7rem;
                line-height: 0.7rem;
                /*border-bottom:0.04rem solid #F7094D;*/
                /*color:#F7094D;*/
            }
        }
        .word-task {
            width: 50%;
            height: 0.7rem;
            font-size: 0.28rem;
            display: flex;
            justify-content: center;
            align-items: center;
            .word {
                height: 0.7rem;
                line-height: 0.7rem;
                /*border-bottom:0.04rem solid #F7094D;*/
                /*color:#F7094D;*/
            }
        }
    }

    .newProshowsList {
        box-sizing: border-box;
        padding: .24rem .12rem;
        .newProducts-item {
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
            .item-title {
                width: 100%;
                padding-top: .37rem;
                padding-bottom: .33rem;
                display: flex;
                justify-content: space-between;
                .item-award {
                    display: flex;
                    align-items: center;
                    i {
                        font-size: .27rem;
                        color: #FFA61A;
                    }
                    span {
                        font-size: .18rem;
                        background: #EEEEEE;
                        border-radius: .18rem;
                        padding: 0 .1rem;
                    }
                }
                .left {
                    width: 4.72rem;
                    font-size: .3rem;
                    color: #080103;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
            .top {
                display: block;
                width: .55rem;
                height: .79rem;
                position: absolute;
                right: .25rem;
                top: 0;
            }
            .top {
                display: block;
                width: .55rem;
                height: .79rem;
                position: absolute;
                right: .25rem;
                top: 0;
            }
            .thumbsContainer {
                width: 100%;
                height: 1.6rem;
                display: flex;
                justify-content: space-between;
                padding-bottom: .08rem;
                .thumb {
                    width: 2.1rem;
                    height: 100%;
                    background: #0A4DB7;
                    border-radius: .04rem;
                    overflow: hidden;
                    img {
                        width: 100%;
                        height: 100%;
                        display: block;
                    }
                }
            }
            .productInfo {
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-bottom: .16rem;
                .author {
                    height: .36rem;
                    display: flex;
                    justify-content: left;
                    img {
                        width: .36rem;
                        height: .36rem;
                        background: red;
                        margin-right: .09rem;
                    }
                    span {
                        /*line-height: .36rem;*/
                        color: #080103;
                        font-size: .18rem;
                    }
                }
                .category {
                    font-size: .24rem;
                    color: #94969b;
                    margin-right: 1.5rem;
                }
                .complete {
                    font-size: .24rem;
                    color: #94969b;
                }
                .views {
                    font-size: .24rem;
                    color: #94969b;
                }
                .praise {
                    font-size: .24rem;
                    color: #94969b;
                }
            }
        }
        .showEmpty {
            width: 100%;
            .empty {
                width: 3.32rem;
                height: 3.32rem;
                margin: 2.17rem auto .61rem;
                img {
                    display: block;
                    width: 100%;
                    height: 100%;
                }
            }
            p {
                text-align: center;
            }
            button {
                display: block;
                width: 4.56rem;
                height: .85rem;
                background: #ff0030;
                color: #FFFFFF;
                font-size: .36rem;
                border-radius: .85rem;
                margin: 0 auto;
            }
            .btn_style {
                width: 100%;
                height: 0.85rem;
                /*background:#ff6700;*/
                margin-top: 1.5rem;
                display: flex;
                justify-content: center;
                align-items: center;
                .go_product {
                    width: 4.55rem;
                    height: 0.85rem;
                    background: #F7094D;
                    border-radius: 0.43rem;
                    font-size: 0.36rem;
                    color: #fff;
                    line-height: 0.85rem;
                    text-align: center;
                }
            }
        }
    }
</style>
