<template>
  <div class="drawRecord">
    <div class="mask" v-if="award_show">
      <div class="tan_box">
        <div class="img_bac">
          <img src="../../static/img/lottery_bac.png" alt="">
          <div class="img_other">
            <img :src="award.img" alt="">
          </div>
          <p style="position:absolute;top:368rpx;width:100%;text-align: center;">{{award.name}}</p>
          <div class="btn" @click="get_award(award.id)">立即领取</div>
          <div class="close" @click="close_cli">
            <img src="/static/img/close.png" alt="">
          </div>
        </div>
      </div>
    </div>

    <div class="drawRecord-item" v-for="(item,index) in list" v-if="list.length!=0" :key="index" @click="targetHref(item)">
      <div class="thumb">
        <img  :src="item.img" alt="">
      </div>
      <div class="detail">
        <div class="first">
          <div class="awardName txt-overflow">{{item.name}}</div>
          <div class="status" :class="{notGet: !item.receiveState}">{{item.receiveState ? '已领取' : '未领取'}}</div>
        </div>
        <div class="second">抽奖时间 : {{item.createTime}}</div>
      </div>
    </div>
    <div class="noData" v-if="list.length==0">
      <img style="margin-bottom:30rpx;" src="../../static/img/empty.png" alt="">
      <div style="font-size:30rpx;text-align: center">暂无数据</div>
    </div>
  </div>
</template>

<script>
    import { getSignIn ,toDate} from '@/common/js/comm'
    import Tips from '@/common/js/tips'
    export default {
        name: "drawRecord",
        data(){
            return{
                list: [],
                award_show: false,
                award: '',
                imgDomain: '',
            }
        },
        mounted(){
            let _self = this;
            _self.init();
        },
        methods: {
            close_cli() {
                this.award_show = false;
            },
            init(){
                let _self = this;
                _self.getRecord();
            },
            /*获取抽奖记录*/
            getRecord(){
                let _self = this;
                let _data = {
                    token:_self.$store.state.token,
                };
                getSignIn(_data).then(sec=>{
                    _self.$http.getTurnRecord(_data,sec).then(res=>{
                        console.log(res);
                        if(res.state == 1){
                            _self.list =  _self.list.concat(res.data);
                            _self.list.forEach(ele => {
                                ele.img = res.imgDomain + ele.img;
                                ele.createTime = toDate(Number(ele.createTime)*1000)
                            })
                        }
                    })
                })
            },
            /*点击*/
            targetHref(item){
                console.log(item);
                let _self = this;
                if(!item.receiveState){
                    if(item.itemTypeId == 0 || item.itemTypeId == 1){
                        _self.award = item;
                        _self.award_show = true;
                    }else if(item.itemTypeId == 3){
                        _self.$router.push({
                            name: 'orderPush',
                            query: {
                                img: item.img,
                                remark: item.remark,
                                name: item.name,
                                lotteryuserId: item.id,
                                id: item.lotteryItemId
                            }
                        })
                    }else if(item.itemTypeId == 4){
                        window.location.href = item.targetHref;
                    }
                }
            },
            get_award(lotteryuserId) {
                let _self = this;
                let _data = {
                    token: this.$store.state.token,
                    lotteryuserId: lotteryuserId
                };
                getSignIn(_data).then(sec=>{
                    _self.$http.getTurn(_data,sec).then(res => {
                        let data = res.data;
                        if (data.state == 1) {
                            _self.award_show = false;
                            _self.list=[];
                            _self.getRecord();
                        } else {
                            _self.award_show = false;
                            alert(data.msg);
                        }
                    });
                })

            }
        },
        async onReachBottom() {
            this.pageNum ++;
            this.getRecord();
        },
    }
</script>

<style lang="scss" scoped>
  .drawRecord{
    .mask {
      position: fixed;
      left:0;
      top:0;
      right:0;
      bottom:0;
      width:100vw;
      height:100vh;
      background-color: rgba(0, 0, 0, 0.6);
      z-index: 8;
      display: flex;
      justify-content: center;
      align-items: center;
      .tan_box {
        width: 660rpx;
        height: 732rpx;
        position: relative;
        .img_bac{
          position: absolute;
          width:660rpx;
          height:732rpx;
          left:0;top:0;
          right:0;bottom:0;
          img{
            width:100%;
            height:100%;
            display: block;
          }
          .img_other{
            width:170rpx;
            height:170rpx;
            position: absolute;
            left:0;top:100rpx;right:0;
            margin:0 auto;
            img{
              width:100%;
              height:100%;
              display: block;
            }
          }
          .btn{
            position: absolute;
            background: #fe054c;
            color: #fff;
            bottom:84rpx;
            left:0;right:0;
            margin:0 auto;
            font-size: 14px;
            width: 300rpx;
            height: 80rpx;
            line-height: 80rpx;
            text-align: center;
          }
          .close {
            position: absolute;
            height: 56rpx;
            width: 56rpx;
            top: -28rpx;
            right: 0rpx;
            z-index: 9;
            img{
              width:100%;
              height:100%;
              display: block;
            }
          }
        }
        /*img {*/
        /*display: block;*/
        /*width: 260rpx;*/
        /*height: 310rpx;*/
        /*margin: 220rpx auto 0;*/
        /*}*/

        p {
          font-size: 16px;
          margin: 15px 0 5px;
        }

      }
    }
    .drawRecord-item{
      box-sizing: border-box;
      padding: 22rpx;
      border-bottom: 10rpx solid #f6f6f6;
      display: flex;
      justify-content: space-between;
      .thumb{
        width: 138rpx;
        height: 138rpx;
        border: 1px solid #e5e5e5;
        img{
          display: block;
          width: 100%;
          height: 100%;
        }
      }
      .detail{
        width: 550rpx;
        height: 140rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .first{
          width: 100%;
          display: flex;
          justify-content: space-between;
          .awardName{
            width: 407rpx;
            height: 82rpx;
            font-size: 28rpx;
            font-weight: bold;
          }
          .status{
            color: #f7094d;
            font-size: 28rpx;
          }
          .notGet{
            color: #8d8e98;
          }
        }
        .second{
          font-size: 28rpx;
          color: #8d8e98;
        }
      }
    }
  }
  .noData{
    width:100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top:330rpx;
    flex-direction: column;
    img{
      width:400rpx;
      height:400rpx;
      display: block;
    }
  }
</style>
