<template>
    <div class="pay">
        <div class="pay_money">
            支付金额
        </div>
        <div class="money">80元</div>
        <div class="payWay-item">
            <div class="left iconfont icon-goumaiweixin wechat"></div>
            <div class="mid">
                <p>微信支付</p>
                <span>跳转到微信首页，再打开付款码页面</span>
            </div>
            <div class="right iconfont icon-gouxuan"></div>
        </div>
        <div class="payWay-item">
            <div class="left iconfont icon-zhifubao ali"></div>
            <div class="mid">
                <p>微信支付</p>
                <span>跳转到支付宝付款码页面</span>
            </div>
            <div class="right iconfont icon-gouxuan"></div>
        </div>
        <button>前往支付</button>
    </div>
</template>

<script>
    export default {
        name: "pay"
    }
</script>

<style lang="scss" scoped>
    .pay{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        box-sizing: border-box;
        padding: .83rem .21rem;
        .pay_money{
            font-size: .34rem;
            text-align: center;
            box-sizing: border-box;
            padding: 0 .44rem;
            margin-bottom: .2rem;
        }
        .money{
            font-size: .6rem;
            text-align: center;
            font-weight: bold;
            margin-bottom: 1.45rem;
        }
        .payWay-item{
            box-sizing: border-box;
            padding: .28rem .12rem;
            display: flex;
            align-items: center;
            border-bottom: .01rem solid rgba(229,229,229,1);
            .left{
                width: .99rem;
                height: .99rem;
                font-size: .99rem;
            }
            .wechat{
                color: #39AD2D;
            }
            .ali{
                color: #08A1F8;
            }
            .mid{
                width: 5rem;
                box-sizing: border-box;
                padding: .15rem .18rem;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                p{
                    font-size: .34rem;
                }
                span{
                    font-size: .24rem;
                    color: #8D8E98;
                }
            }
            .right{
                width: .35rem;
                height: .35rem;
                box-sizing: border-box;
                border: .01rem solid #E4E1E1;
                border-radius: 50%;
                font-size: .35rem;
                color: #FFA61A;
                line-height: .35rem;
                text-align: center;
            }
        }
        button{
            margin: 1.49rem auto 0;
            display: block;
            width: 6.69rem;
            height: .91rem;
            color: #FFFFFF;
            font-size: .41rem;
            background:rgba(247,9,77,1);
            border-radius: .07rem;
        }
    }
</style>