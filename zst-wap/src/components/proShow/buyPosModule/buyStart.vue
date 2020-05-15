<template>
    <div class="buyStart">
        <div class="tip">
            当前已拥有{{mineShowCounts.goodsShowCount}}个产品位,还可以购买{{mineShowCounts.canBuyShowCount}}个产品位
        </div>
        <ul class="buy-lists">
            <li class="list-item">
                <span>产品位价格</span>
                <span>{{mineShowCounts.singleMoney}}话呗</span>
            </li>
            <li class="list-item">
                <span>购买数量</span>
                <span class="add-sub"><i @click="sub">-</i><span>{{count}}</span><i @click="add">+</i></span>
            </li>
            <li class="list-item">
                <span>所需话呗</span>
                <span style="color: #e70545">{{count * mineShowCounts.singleMoney}}话呗</span>
            </li>
        </ul>
        <button class="submit" @click="pay">立即支付</button>
    </div>
</template>

<script>
    import {showCounts,buyShowCounts} from '@/assets/js/comm';
    import {postTitle,getSignIn} from "../../../assets/js/jsBridge";

    export default {
        name: "buyStart",
        props: ['tokenPromise'],
        data(){
            return{
                mineShowCounts: '',
                count: 1,
                token: ''
            }
        },
        methods: {
            init(){
                let _self = this;
                _self.getShowCounts();
                postTitle("购买产品位");
            },
            /*获取产品秀-用户产品位个数和金额*/
            getShowCounts(){
                let _self = this;
                let _data = {
                    token: _self.token
                };
                getSignIn(_data).then(sec => {
                    showCounts(_data,sec).then(res => {
                        if(res.data.state == 1){
                            _self.mineShowCounts = res.data.data;
                            console.log(_self.mineShowCounts);
                        }
                    })
                })
            },
            /*购买数量增加*/
            add(){
                let _self = this;
                if(_self.count >= _self.mineShowCounts.canBuyShowCount){
                    alert('超出可购买限制')
                }else{
                    _self.count++;
                }
            },
            /*购买数量减少*/
            sub(){
                let _self = this;
                if(_self.count <=1){
                    alert('最少购买一个产品位')
                }else{
                    _self.count--;
                }
            },
            /*支付*/
            pay(){
                let _self = this;
                let _data = {
                    token: _self.token,
                    count: _self.count,
                    totalMoney: _self.count * _self.mineShowCounts.singleMoney
                };
                getSignIn(_data).then(sec => {
                    buyShowCounts(_data,sec).then(res => {
                        _self.$router.push({
                            name: 'buyFinish',
                            query: {
                                status: res.data.state,
                                msg: res.data.msg,
                                count: _self.count,
                                totalMoney: _self.count * _self.mineShowCounts.singleMoney
                            }
                        })
                    })
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
    .buyStart{
        box-sizing: border-box;
        padding: 0 .32rem;
        .tip{
            width: 100%;
            height: .5rem;
            border-radius: .5rem;
            background: #feb623;
            color: #FFFFFF;
            font-size: .28rem;
            text-align: center;
            line-height: .5rem;
            margin: .22rem 0 .24rem;
        }
        .buy-lists{
            width: 100%;
            margin-bottom: 1.85rem;
            .list-item{
                width: 100%;
                display: flex;
                justify-content: space-between;
                font-size: .28rem;
                .add-sub{
                    border-radius: .08rem;
                    background: #e5e5e5;
                    display: flex;
                    justify-content: space-between;
                    i{
                        padding: 0 .12rem;
                    }
                    span{
                        padding: 0 .12rem;
                        background: #FFFFFF;
                    }
                }
            }
            .list-item:first-child{
                margin-bottom: .8rem;
            }
            .list-item:nth-child(2){
                border-bottom: 1px solid #e5e5e5;
                padding-bottom: .4rem;
                margin-bottom: .4rem;
            }
        }
        .submit{
            display: block;
            width: 6.57rem;
            height: .92rem;
            background: #ff0049;
            color: #FFFFFF;
            font-size: .37rem;
            border-radius: .08rem;
            margin: 0 auto;
        }
    }
</style>