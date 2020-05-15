<template>
    <div class="find_svip">
        <div class="nav_top">
            <div class="nav_left" @click="cityListShow">
                <img :src="address" alt="" style="margin-right:0.06rem;">
                <span class="txt-ellipsis"
                      style="font-size: .28rem;float: left;color: #858A98;">{{cityName}}</span>
                <i class="iconfont icon-jiantou9" style="float: right;color:#343C53;"></i>
            </div>
            <!--<select v-model="checkedCity">
                <option :value="item.code" v-for="item in cityList" :key="item.code">{{item.name}}</option>
            </select>-->
            <div class="nav_right">
                <div class="nav_href">
                    <div class="nav_href_left">
                        <i class="iconfont icon-sousuo" style="color:#000000;"></i>
                    </div>
                    <div class="nav_href_right">
                        <input class="nav_href" type="text" placeholder="过桥米线" v-model="searchContent"
                               v-on:blur="search(1)" @input="search(1)">
                    </div>
                </div>
            </div>
        </div>
        <transition name="slide">
            <div class="distPicker" v-show="distPicker">
                <div class="province" v-for="(province,province_id) in citys.provinceList" :key="province_id">
                    <div class="province_name" @click="changeCity(province.code,province.name)">
                        {{province.name}}
                    </div>
                    <div class="city">
                        <div class="city_name"  v-for="(city,city_id) in province.city" :key="city_id" @click="changeCity(city.code,city.name)">
                            {{city.name}}
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <div class="bag-scroll" ref="myScroll"  @click="close">
            <div class="scroll-container">
                <div class="all_con">
                    <router-link :to="{name: 'sellerDetail',query:{shopStoreId:item.shopStoreId,distance:item.distance}}" :key="item.id" tag="div" class="nav_bot" v-for="item in cardList">
                        <div class="nav_con_left">
                            <img :src="item.storeImgs" alt="">
                        </div>
                        <div class="nav_con_right">
                            <div class="shop_name txt-ellipsis">{{item.storeName}}</div>
                            <div class="shop_address">
                                <div class="address_img iconfont icon-dizhi3">

                                </div>
                                <div class="address_con txt-ellipsis">
                                    {{item.address}}
                                    <div class="add_interval">{{item.distance}}km <i class="iconfont icon-arrow-right"
                                                                                     style="font-size:.24rem;"></i></div>
                                </div>
                            </div>
                            <div class="shop_agio">
                                <div class="agio_img">
                                    <img src="@/assets/imgs/svip/discount.png" alt="">
                                </div>
                                <div class="agio_con">
                                    SVIP卡最低{{item.shareCardDiscount * 10}}折
                                </div>
                            </div>

                            <div class="shop_agio">
                                <div class="agio_img">
                                    <img src="@/assets/imgs/svip/yong.png" alt="">
                                </div>
                                <div class="agio_con">
                                    分享佣金最高{{item.commissionRate * 100}}%
                                </div>
                            </div>
                        </div>
                    </router-link>
                </div>
            </div>
        </div>

      <no-data :showNoData="noData" :noticeMes="conNot"/>
    </div>
</template>

<script>
    import address from '@/assets/imgs/common/address.png'
    import {cityList, storeList} from "@/assets/js/comm";
    import {getSignIn, getGPS, getCity ,postTitle} from "@/assets/js/jsBridge";
    import BScroll from 'better-scroll';

    import noData from '../common/noData'

    import {citys} from "@/assets/js/citys";

    export default {
        props: ['tokenPromise'],
        components: {noData},
        name: "findSvip",
        data() {
            return {
                address: address,
                token: '',
                cityList: [],
                pageNum: 1,
                pageSize: 20,
                city: '',
                data: {},
                lastContent: '',
                checkedCity: '',
                cityName: '',
                searchContent: '',


                noData:false,
                conNot:'',

                cardList: '',
                citys: citys,
                distPicker:false
            }
        },
        methods: {
            close(){
                var _self = this;
                _self.distPicker = false;
            },
            init() {
                postTitle('周边商家');
                var _self = this;
                _self.getCity();
                _self.storeList();
                setTimeout(() => {
                    _self.initScroll();
                }, 400)
            },
            getCity() {
                var _self = this;
                var _data = {};
                getSignIn(_data).then(sec => {
                    cityList(_data, sec).then(res => {
                        if (res.data.state == 1) {
                            _self.cityList = res.data.data;
                            _self.cityList.forEach(ele => {
                                if (ele.code == _self.checkedCity) {
                                    _self.cityName = ele.name;
                                }
                            })
                        }else{

                        }
                    })
                })
            },
            /*查询内容*/
            search() {
                var _self = this;
                if (_self.lastContent != _self.searchContent) {
                    _self.pageNum = 1;
                    _self.storeList();
                    _self.lastContent = _self.searchContent;
                }
            },
            /*查询*/
            storeList() {
                var _self = this;
                getGPS().then(GPS => {
                    var LONG = GPS.LONG;
                    var LAT = GPS.LAT;
                    var _data = {
                        token: _self.token,
                        Longitude: LONG,
                        latitude: LAT,
                        cityCode: _self.checkedCity,
                        storeName: _self.searchContent,
                        pageNum: String(_self.pageNum),
                        pageSize: String(_self.pageSize)
                    };
                    getSignIn(_data).then(sec => {

                        storeList(_data, sec).then(res => {
                            if (res.data.state == 1) {
                                _self.cardList = res.data.data;
                                if(_self.cardList.length == 0){
                                  this.noData = true;
                                  this.conNot = '暂时无数据';
                                  return false;
                                }else{
                                  this.noData = false;
                                }
                            }
                        })
                    })
                })
            },
            /*切换城市*/
            changeCity(code,name) {
                var _self = this;
                _self.cityName = name;
                _self.checkedCity = code;
                _self.pageNum = 1;
                _self.storeList();
            },
            /*翻页*/
            nextPage() {
                var _self = this;
                _self.pageNum++;
                getGPS().then(GPS => {
                    var LONG = GPS.LONG;
                    var LAT = GPS.LAT;
                    var _data = {
                        token: _self.token,
                        Longitude: LONG,
                        latitude: LAT,
                        cityCode: _self.checkedCity,
                        storeName: _self.searchContent,
                        pageNum: String(_self.pageNum),
                        pageSize: String(_self.pageSize)
                    };
                    getSignIn(_data).then(sec => {
                        storeList(_data, sec).then(res => {
                            if (res.data.state == 1) {
                                _self.cardList = _self.cardList.concat(res.data.data);
                            }
                        })
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
                    _self.nextPage();
                    // this.handleBottomChange();
                    // console.log(this.goods);
                });
            },
            cityListShow(){
                var _self = this;
                _self.distPicker = !_self.distPicker;
            }
        },
        watch: {
            cardList:{
                handler(){
                    // console.log(1);
                    setTimeout(()=>{
                        this.scroll.finishPullUp();
                        this.scroll.finishPullDown();
                        this.scroll.refresh();
                    },100)
                },
                deep:true
            }
        },
        mounted() {
            var _self = this;
            _self.tokenPromise.then(res => {
                _self.token = res;
              console.log(res);
              getCity().then(city => {
                    _self.city = city.areaCode;
                    _self.checkedCity = String(_self.city).slice(0, 4) + '00';
                    _self.init();
                })
            })
        }
    }
</script>

<style lang="scss" scoped>
    .find_svip {
        width: 100%;
        margin: 0 3%;
        .distPicker{
            position: absolute;
            left: 0;
            top: 1rem;
            background: rgba(12,12,12,.4);
            height: 7rem;
            z-index: 999;
            overflow: scroll;
            .province{
                width: 100%;
                margin-bottom: .5rem;
                box-sizing: border-box;
                padding: 0 .3rem;
                .province_name{
                    font-size: .3rem;
                    color: #FFFFFF;
                    margin-bottom: .1rem;
                }
                .city{
                    width: 100%;
                    font-size: .28rem;
                    color: #FFFFFF;
                    display: flex;
                    flex-wrap: wrap;
                    .city_name{
                        margin-right: .3rem;
                    }
                }
            }
        }
        .nav_top {
            width: 100%;
            height: 1.13rem;
            position: fixed;
            z-index: 100;
            left: 0;
            box-sizing: border-box;
            padding: 0 .2rem;
            background: #FFFFFF;
            padding-bottom: .33rem;
            padding-top:.33rem;
            .nav_left {
                width: 1.38rem;
                height: .6rem;
                float: left;
                line-height: .6rem;
                display: flex;
                justify-content: space-around;
                align-items: center;
                img {
                    width: .23rem;
                    height: .29rem;
                    float: left;
                }
            }
            select {
                position: absolute;
                display: block;
                width: 1.38rem;
                height: .6rem;
                left: 3%;
                border: none;
                outline: none;
                overflow: hidden;
                background: none;
                font-size: .3rem;
                appearance: none;
                -moz-appearance: none;
                -webkit-appearance: none;
                opacity: 0;
            }
            .nav_right {
                width: 5.67rem;
                height: .6rem;
                float: left;
                .nav_href {
                    width: 100%;
                    height: .6rem;
                    border-radius: .6rem;
                    background: #F2F2F2;
                    .nav_href_left {
                        width: .6rem;
                        height: .6rem;
                        margin-left: .25rem;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        float: left;
                    }
                    .nav_href_right {
                        float: left;
                        .nav_href {
                            float: left;
                            height: .6rem;
                            font-size: .32rem;
                            padding-left: .2rem;
                        }
                    }
                }
            }
        }
        .bag-scroll {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
        }
        .all_con {
            width: 100%;
            padding-top: 1.12rem;
            .nav_bot {
                width: 100%;
                height: 2.46rem;
                margin-top: .24rem;
                border-bottom: 1px solid #E5E5E5;
                box-sizing: border-box;
                padding: .26rem .2rem;
                .nav_con_left {
                    float: left;
                    width: 2.5rem;
                    height: 1.9rem;
                    /*background: gold;*/
                    img {
                        width: 100%;
                        height: 100%;
                        display: block;
                    }
                }

                .nav_con_right {
                    float: left;
                    margin-left: .14rem;

                    .shop_name {
                        width: 4.2rem;
                        font-size: .33rem;
                        margin-bottom: .12rem;
                    }

                    .shop_address {
                        margin-bottom: .16rem;
                        overflow: hidden;

                        .address_img {
                            float: left;
                            height: .31rem;
                            width: .23rem;
                            font-size: .3rem;
                            color: #8D8E98;
                            /*background: gold;*/
                        }

                        .address_con {
                            float: left;
                            width: 3.88rem;
                            height: .6rem;
                            font-size: .24rem;
                            margin-left: .14rem;
                            position: relative;

                            .add_interval {
                                position: absolute;
                                bottom: 0;
                                right: 0;
                                font-size: .24rem;
                                color: #343C53;
                                line-height: .21rem;
                            }
                        }
                    }

                    .shop_agio {
                        overflow: hidden;
                        margin-bottom: .05rem;

                        .agio_img {
                            width: .27rem;
                            height: .27rem;
                            /*background: gold;*/
                            float: left;
                            img {
                                width: 100%;
                                height: 100%;
                                display: block;
                            }
                        }

                        .agio_con {
                            float: left;
                            color: #343C53;
                            font-size: .22rem;
                            margin-left: .14rem;
                        }
                    }
                }
            }
        }
    }
</style>
