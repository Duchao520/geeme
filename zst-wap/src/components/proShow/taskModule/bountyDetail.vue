<template>
    <div class="bountyDetail">
        <div class="tip">
            共计被打赏{{bountyDetail.count}}次，赏金共计{{bountyDetail.consumeCallfee}}话呗
        </div>
        <ul class="userTask-lists">
            <li class="userTask-item" v-for="item in bountyDetail.rewards" :key="item.id">
                <div class="head">
                    <img :src="item.ico" alt="">
                </div>
                <div class="right">
                    <div class="first">
                        <span>{{item.nick}}</span>
                        <i>+{{item.consumeCallfee}}话呗</i>
                    </div>
                    <div class="second">
                        <span>ID:{{item.username}}</span>
                        <i>{{timeShift(item.createTime)}}</i>
                    </div>
                </div>
            </li>
        </ul>
        <footer @click="editProShow">
            想让更多的人去分享,马上去增大发布范围&gt;&gt;
        </footer>
    </div>
</template>

<script>
    import {rewardDetail} from '@/assets/js/comm';
    import {postTitle,getSignIn,releaseProShow} from "../../../assets/js/jsBridge";

    export default {
        name: "bountyDetail",
        props: ['tokenPromise'],
        data(){
            return{
                showId: this.$route.query.showId,
                token: '',
                bountyDetail: ''
            }
        },
        methods: {
            init(){
                let _self = this;
                _self.getRewardDetail();
                postTitle("赏金明细");
            },
            /*获取赏金明细*/
            getRewardDetail(){
                let _self = this;
                let _data = {
                    token: _self.token,
                    showId: _self.showId
                };
                getSignIn(_data).then(sec => {
                    rewardDetail(_data,sec).then(res => {
                        if(res.data.state == 1){
                            _self.bountyDetail = res.data.data;
                            console.log(_self.bountyDetail);
                        }
                    })
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
            /*编辑产品秀*/
            editProShow(){
                let _self = this;
                let _data = {
                    state: 1,
                    ID: _self.showId
                };
                releaseProShow(_data);
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
    .bountyDetail{
        padding-top: .15rem;
        .tip{
            padding: 0 .43rem;
            width: 5rem;
            height: .5rem;
            line-height: .5rem;
            background: #feb623;
            color: #FFFFFF;
            font-size: .32rem;
            border-radius: .5rem;
            text-align: center;
            margin: 0 auto;
        }
        .userTask-lists{
            width: 100%;
            box-sizing: border-box;
            padding: .32rem .37rem;
            .userTask-item{
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: .19rem 0;
                .head{
                    width: 1.02rem;
                    height: 1.02rem;
                    border-radius: 50%;
                    overflow: hidden;
                    img{
                        display: block;
                        width: 100%;
                        height: 100%;
                        background: #0e90d2;
                    }
                }
                .right{
                    width: 5.53rem;
                    padding: .19rem 0;
                    border-bottom: 1px solid #f9f9f9;
                    .first{
                        display: flex;
                        justify-content: space-between;
                        font-size: .32rem;
                        width: 100%;
                        line-height: .67rem;
                        i{
                            color: #f7094d;
                        }
                    }
                    .second{
                        font-size: .22rem;
                        color: #8d8e98;
                        display: flex;
                        justify-content: space-between;
                    }
                }
            }

        }
        footer{
            width: 100%;
            position: fixed;
            bottom: 0;
            height: 1rem;
            background: #e70545;
            color: #FFFFFF;
            font-size: .28rem;
            text-align: center;
            line-height: 1rem;
        }
    }
</style>