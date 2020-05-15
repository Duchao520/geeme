<template>
  <el-row type="flex" class="ListTypeTwo">
      <div :class="[{item:1,active:index==listOne.length-1}] " v-for="(item, index) in listOne" :key="index">
          <img class="left" :src="item.image"/>
          <div class="right">
            <p  class="text-overflow">{{item.title}}</p>
            <p class="text-overflow">{{item.motto}}</p>
            <p class="text-overflow">{{item.info}}</p>
            <div>
              <span>{{item.specialPrice}}</span>
              <i>{{item.price}}</i>
            </div>
            <span class="chip">{{item.discount}}</span>
            <span class="chip" :class="item.online?'online':'outline'">{{item.online?'线上':'线下'}}</span>
          </div>
      </div>
      <div v-for="item in arr" style="width:190px;height:240px;" :key="item">
      </div>
  </el-row>
</template>

<script>
export default {
    props:{
        listOne:Array
    },
    data(){
        return{
          arr: new Array(4)
        }
    }
}
</script>

<style lang="scss">
.ListTypeTwo {
  width: 100%;
  height: auto;
  flex-wrap: wrap;
  padding-bottom: 50px;
  flex-shrink: 0;
  .item {
    width: 190px;
    height: 240px;
   border-radius: 3px;
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
    margin-right: 20px;
    margin-bottom: 17px;
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
    .left {
      width:100%;
      height: 104px;
      margin-right: 8px;
    }
    .right {
      padding-left: 10px;
      p{
        height: 25px;
      }
      p:first-child {
        width: 100%;
        font-size: 14px;
        margin-bottom: 2px;
        color: rgba(51, 51, 51, 1);
        font-size: 14px;
        font-family: PingFangSC-Regular;
      }
      p:nth-child(2){
        color: rgba(102, 102, 102, 1);
        font-size: 13px;
        text-align: left;
        font-family: PingFangSC-Regular;
      }
      p:nth-child(3){
        color: rgba(138, 144, 154, 1);
        font-size: 12px;
        text-align: left;
        font-family: PingFangSC-Regular;
      }
      div {
        line-height: 25px;
        text-align: left;
        span {
          color: #ff6d61;
          font-size: 18px;
        }
        i {
          color: #999999;
          font-size: 14px;
          text-decoration: line-through;
          font-style: normal;
        }
      }
      .online{
        display: inline-block;
        background-color: rgba(112, 147, 243, 0.1) !important;
        border: 0.5px solid rgba(112, 147, 243, 0.5) !important;
      }
      .outline{
        background-color: rgba(0, 207, 130, 0.1) !important;
        border: 0.5px solid rgba(0, 207, 130, 0.5) !important;
      }
      .chip{
        display: inline-block;
        padding: 0 8px;
        border-radius: 15px;
        color: white;
        font-size: 10px;
        text-align: center;
        background-color: rgba(245, 45, 86, 0.1);
        border: 0.5px solid rgba(245, 45, 86, 0.5);
        left: 319px;
        color: rgba(245, 45, 86, 1);
        line-height: 20px;
      }
    }
  }
}
</style>