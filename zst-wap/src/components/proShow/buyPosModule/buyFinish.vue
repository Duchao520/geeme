<template>
    <div class="buyFinish">
        <div class="successIcon">
            <img src="@/assets/imgs/proShow/success.png" alt="" v-if="query.status == 1">
            <img src="@/assets/imgs/proShow/fail.png" alt="" v-if="query.status !== 1">
        </div>
        <p style="font-size: .36rem">支付{{query.status == 1 ? "成功" : "失败"}}</p>
        <p style="font-size: .57rem;margin-bottom: .96rem"><span style="font-size: .57rem;" v-if="query.status == 1">{{query.totalMoney}}话呗</span><span style="font-size: .3rem;" v-if="query.status !== 1">{{query.msg}}</span></p>
        <ul class="buy-lists">
            <li class="list-item">
                <span>商品名称</span>
                <span>产品位</span>
            </li>
            <li class="list-item">
                <span>购买数量</span>
                <span class="add-sub">{{query.count}}</span>
            </li>
        </ul>
        <button class="submit" @click="release">{{query.status == 1 ? "发布产品秀" : "购买话呗"}}</button>
        <button class="close" @click="enterMineShows">关闭</button>
        <p style="font-size: .28rem">亲,一个产品位对应发布一个产品秀</p>
    </div>
</template>

<script>
    import {postTitle,releaseProShow,Recharge} from "../../../assets/js/jsBridge";
    export default {
        name: "buyFinish",
        data(){
            return{
                query: this.$route.query,
            }
        },
        methods: {
            init(){
                let _self = this;
                console.log(_self.query);
                postTitle("购买产品位");
            },
            release(){
                let _self = this;
                if(_self.query.status == 1){
                    let _data = {
                        state: 0
                    };
                    releaseProShow(_data);
                }else{
                    Recharge();
                }
            },
            /*进入我的产品秀*/
            enterMineShows(){
                let _self = this;
                window.history.go(-2);
            },
        },
        mounted(){
            let _self = this;
            _self.init();
        }
    }
</script>

<style lang="scss" scoped="">
    .buyFinish{
        box-sizing: border-box;
        padding: 0 .32rem;
        .successIcon{
            width: .89rem;
            height: .89rem;
            margin: 0.4rem auto .18rem;
            img{
                display: block;
                width: 100%;
                height: 100%;
            }
        }
        p{
            text-align: center;
        }
        .buy-lists{
            width: 100%;
            .list-item{
                width: 100%;
                display: flex;
                justify-content: space-between;
                font-size: .28rem;

            }
            .list-item:first-child{
                margin-bottom: .8rem;
            }
            .list-item:nth-child(2){
                border-bottom: 1px solid #e5e5e5;
                padding-bottom: .4rem;
                margin-bottom: .85rem;
            }
        }
        button{
            display: block;
            width: 6.57rem;
            height: .92rem;
            color: #FFFFFF;
            font-size: .37rem;
            border-radius: .08rem;
            margin: 0 auto .41rem;
        }
        .submit{
            background: #ff0049;
        }
        .close{
            background: #feb623;
        }
    }
</style>