<template>
    <div class="page">
      <div class="score_inject">
        <div class="score_le">
          <span style="margin-right:20rpx;">商家评分</span>
          <div class="star">
             <span v-for="(item,index) in stars" :key="index" @click="scoreIt(item.id)">
               <i class="iconfont icon-shoucang-tianchong" style="margin-right:6rpx;" :class="item.id <= starId?'yesColor':''"></i>
             </span>
          </div>
        </div>
      </div>

      <div class="mes_inner">
          我要评价
      </div>
      <textarea
        placeholder="你的评价至关重要"
        v-model="valuesData"
        @input="inputs"
        class="textareaMes"
      >
      </textarea>
      <div class="currentWordNumber">{{currentWordNumber|0}}/{{max}}</div>
         <!--<text class="hint">{{texts}}</text>-->


      <div class="confirm_btn">
          <div class="btn_confi">
              确定
          </div>
      </div>
    </div>
</template>

<script>
    export default {
        name: "index",
        data(){
          return {
            stars:[{id:1},{id:2},{id:3},{id:4},{id:5}],
            starId:0,
            focus:false,
            texts:"至少5个字",
            min:5,//最少字数
            max: 100, //最多字数 (根据自己需求改变)
            currentWordNumber:'',
            valuesData:''
          }
        },
        mounted(){

        },
        methods:{
          scoreIt(par){
            this.starId = par;
          },
          inputs(e){
            console.log(e.target.value);
            var textNum = e.target.value;
            var len = parseInt(textNum.length);

            //最少字数限制
            if(len <= this.min)
                this.texts = "你的字数必须有5个哦"
            else if(len > this.min)
                this.texts = " "
            //最多字数限制
              if(len > this.max) {
                return
              }else{
                this.currentWordNumber = len //当前字数

              }
            // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行


          }
        }
    }
</script>

<style lang="scss" scoped>
.page{
  .score_inject{
    display: flex;
    justify-content: space-between;
    width: 710rpx;
    padding: 40rpx 20rpx;
    .score_le {
      height: 46rpx;
      display: flex;
      align-items: center;
      font-size: 30rpx;

      .star {
        display: flex;

        span {
          color: #D1D1D1;
        }
      }

      .yesColor {
        color: #FEB623;
      }
    }
    .score_ri{
      height:46rpx;
      padding:0 20rpx;
      background:#F60F51;
      font-size: 28rpx;
      border-radius: 10rpx;
      color:#fff;
    }
  }
  .mes_inner{
    padding:0 20rpx;
    width:710rpx;
    font-size: 30rpx;
    font-weight: bold;
  }
  .textareaMes{
    width:670rpx;
    margin:0 20rpx;
    height:146rpx;
    margin-top:40rpx;
    background:rgba(238,238,238,1);
    border-radius: 10rpx;
    padding:30rpx 20rpx;
    font-size: 30rpx;
    position: relative;
  }
  .currentWordNumber{
    position: absolute;
    right:20rpx;
    bottom:20rpx;
  }
  .confirm_btn{
    width:100%;
    height:88rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top:70rpx;
    .btn_confi{
      width:674rpx;
      height:88rpx;
      background:#F7094D;
      border-radius:10rpx;
      display:flex;
      justify-content: center;
      align-items: center;
      color:#fff;
      font-size: 42rpx;
    }
  }
}
</style>
