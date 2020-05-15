<template>
  <div>
    <el-row v-if="bannertype === 1" class="bannerList" type="flex" justify="space-between">
      <el-col  v-for="(item, index) in bannerList" :key="index" class="item-wrap">
        <div class="b-l-item">
          <img class="b-l-left" :src="item.image"/>
          <div class="b-r-right">
            <p>{{item.dsc}}</p>
            <div>
              <span>{{item.specialPrice}}</span>
              <i>{{item.price}}</i>
            </div>
            <span class="tag">{{item.discount}}</span>
          </div>
          <div class="orderButton" v-if="btnType">
            <i class="icon iconfont icon-icon_shoppingcart"></i>
            订购
          </div>
          <div class="orderButton" v-else>
            <i class="icon iconfont icon-icon_operate_up"></i>
            上线
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row v-if="bannertype === 2" class="bannerList" type="flex" justify="space-between">
      <el-col :span="7"  v-for="(item, index) in bannerList" :key="index" class="item-wrap">
        <div class="a-l-item">
          <img class="a-l-left" :src="item.image"/>
          <div class="a-r-right">
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
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  props:{
    bannerList: Array,
    btnType: Boolean,
    bannertype: Number
  },
}
</script>
<style lang="scss" scoped>
.bannerList {
  width: 100%;
  .item-wrap{
    margin-right: 20px;
  }
  .item-wrap:last-child{
    margin-right: 0px;
  }
  .b-l-item:last-child{
    margin-right: 0;
  }
  .a-l-item {
    min-width: 250px;
    height: 124px;
    background-color: white;
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
    position: relative;
    .a-l-left {
      width: 93px;
      height: 124px;
      margin-right: 8px;
      border-radius: 6px;
    }
    .a-r-right {
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
  .b-l-item {
    // width: 100%;
    min-width: 250px;
    height: 118px;
    background-color: white;
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
    position: relative;
    margin-right: 20px;
    .b-l-left {
      width: 98px;
      height: 98px;
      // background-color: black;
      margin-right: 8px;
    }
    .b-r-right {
      p {
        width: 100%;
        height: 40px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        font-size: 14px;
        margin-bottom: 2px;
        color: rgba(51, 51, 51, 1);
        font-size: 14px;
        font-family: PingFangSC-Regular;
      }
      div {
        line-height: 25px;
        text-align: left;
        margin-bottom: 9px;
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
      .tag {
        border-radius: 4px;
        padding: 4px;
        color: white;
        font-size: 12px;
        background-color: #fcb322;
        text-align: center;
      }
    }
    .orderButton {
      width: 78px;
      height: 32px;
      border: 1px solid rgba(255, 109, 97, 1);
      border-radius: 3px;
      color: #ff6d61;
      font-size: 14px;
      position: absolute;
      right: 6px;
      bottom: 10px;
      text-align: center;
      line-height: 32px;
      cursor: pointer;
      &:hover,&:active{
        background: #e4e7ed36;
      }
    }
  }
}
</style>