<template>
    <div class="taskDetails">
        <transition name="alertMsg">
            <div class="toast" v-show="finishFlag">任务已结束</div>
        </transition>
        <div class="bg">
            <div class="taskCard">
                <button class="taskType">
                    任务类型 : {{taskDetail.taskType == 0 ? '话呗任务' : taskDetail.taskType == 1 ? '现金任务' : '暂无任务'}}
                </button>
                <div class="taskDetail">
                    <span>总投入金额 : {{taskDetail.totalMoney}}{{taskDetail.taskType == 0 ? '话呗' : taskDetail.taskType == 1 ? '元' : ''}}</span>
                    <span>剩余任务金额 : {{taskDetail.unrewardMoney}}{{taskDetail.taskType == 0 ? '话呗' : taskDetail.taskType == 1 ? '元' : ''}}</span>
                </div>
                <div class="progress-total">
                    <div class="progress-now" :style="{width: taskDetail.unrewardMoney/taskDetail.totalMoney*100 + '%'}"></div>
                </div>
                <div class="money">
                    <span>0{{taskDetail.taskType == 0 ? '话呗' : taskDetail.taskType == 1 ? '元' : ''}}</span>
                    <span>{{taskDetail.totalMoney}}{{taskDetail.taskType == 0 ? '话呗' : taskDetail.taskType == 1 ? '元' : ''}}</span>
                </div>
            </div>
        </div>
        <div class="border"></div>
        <div class="finishTask">
            <p class="tips fl-l">完成任务 {{taskDetail.userCount}}人</p>
            <ul class="userTask-lists">
                <li class="userTask-item" v-for="item in taskDetail.receivers" :key="item.userId">
                    <div class="head">
                        <img :src="item.ico" alt="">
                    </div>
                    <div class="right">
                        <div class="first">
                            <span>{{item.nick}}</span>
                            <i>+{{item.rewardMoney}}{{taskDetail.taskType == 0 ? '话呗' : taskDetail.taskType == 1 ? '元' : ''}}</i>
                        </div>
                        <div class="second">
                            <span>ID:{{item.username}}</span>
                            <i>{{timeShift(item.completeTime)}}</i>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div style="height: 1rem"></div>
        <footer @click="finishTask">
            <p>结束任务</p>
            <i>(结束任务后剩余金额将退入可提现账户)</i>
        </footer>
    </div>
</template>

<script>
    import {taskDetail,finishTask} from '@/assets/js/comm';
    import {getSignIn,postTitle,refreshProShow} from "../../../assets/js/jsBridge";

    export default {
        name: "taskDetails",
        props: ['tokenPromise'],
        data(){
            return{
                showId: this.$route.query.showId,
                taskDetail: '',
                finishFlag: false,
                token: ''
            }
        },
        methods: {
            init(){
                let _self = this;
                _self.getTaskDetail();
                postTitle("任务详情");
            },
            /*获取当前任务明细*/
            getTaskDetail(){
                let _self = this;
                let _data = {
                    token: _self.token,
                    showId: _self.showId
                };
                getSignIn(_data).then(sec => {
                    taskDetail(_data,sec).then(res => {
                        if(res.data.state == 1){
                            _self.taskDetail = res.data.data;
                            // console.log(_self.taskDetail);
                        }
                    })
                })
            },
            /*结束任务*/
            finishTask(){
                let _self = this;
                if(!_self.finishFlag){
                    let _data = {
                        token: _self.token,
                        showId: _self.showId
                    };
                    getSignIn(_data).then(sec => {
                        finishTask(_data,sec).then(res => {
                            if(res.data.state == 1){
                                refreshProShow();
                                _self.finishFlag = true;
                                setTimeout(() => {
                                    window.history.go(-1);
                                },1000)
                            }
                        })
                    })
                }
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

<style lang="scss" scoped="">
    @import "../../../assets/css/global";
    .alertMsg-enter-active{
        animation: zoomIn .3s;
    }
    .alertMsg-leave-active{
        animation: zoomOut .3s;
    }
    .taskDetails{
        .toast{
            width: 2rem;
            height: .8rem;
            font-size: .3rem;
            color: #FFFFFF;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            background: rgba(12,12,12,.7);
            text-align: center;
            line-height: .8rem;
        }
        .bg{
            width: 100%;
            box-sizing: border-box;
            padding: .6rem .25rem .18rem;
            background:linear-gradient(180deg,rgba(255,59,59,1),rgba(247,9,77,1));
            .taskCard{
                width: 100%;
                border-radius: .1rem;
                background: #FFFFFF;
                box-sizing: border-box;
                padding: .19rem .11rem;
                .taskType{
                    display: block;
                    background: rgba(27,27,27,1);
                    border-radius: 0 .26rem .26rem 0;
                    color: #FFFFFF;
                    font-size: .3rem;
                    padding: .08rem .21rem .08rem .15rem;
                    margin-bottom: .39rem;
                }
                .taskDetail{
                    display: flex;
                    justify-content: space-between;
                    font-size: .24rem;
                    margin-bottom: .23rem;
                }
                .progress-total{
                    width: 100%;
                    height: .2rem;
                    border-radius: .1rem;
                    background:rgba(238,238,238,1);
                    margin-bottom: .15rem;
                    .progress-now{
                        width: 50%;
                        height: .2rem;
                        border-radius: .1rem;
                        background:rgba(255,195,45,1);
                    }
                }
                .money{
                    display: flex;
                    justify-content: space-between;
                    font-size: .18rem;
                    color:rgba(247,10,77,1);
                }
            }
        }
        .border{
            width: 100%;
            height: .23rem;
            background-image: url($ctxpath + "/static/customImgs/proShow/border.png");
            background-position: top;
            background-repeat: no-repeat;
            background-size: 100%;
        }
        .finishTask{
            padding-top: .44rem;
            .tips{
                display: inline-block;
                padding: .08rem .24rem;
                font-size: .3rem;
                color: #FFFFFF;
                background: #feb623;
                border-top-right-radius: .96rem;
                border-bottom-right-radius: .96rem;
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
        }
        footer{
            width: 100%;
            height: 1rem;
            position: fixed;
            bottom: 0;
            background: #F70A4D;
            color: #FFFFFF;
            display: flex;
            align-items: center;
            flex-direction: column;
            box-sizing: border-box;
            padding-top: .16rem;
            p{
                font-size: .36rem;
            }
            i{
                font-size: .24rem;
            }
        }
    }
</style>