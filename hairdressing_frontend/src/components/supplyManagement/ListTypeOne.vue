<template>
  <div class="ListTypeOne">
    <div :class="[{item:1,active:index==listOne.length-1}] " v-for="(item,index) in listOne" :key="index">
      <img :src="item.image"/>
      <div class="itembody">
        <div class="des">{{item.dsc}}</div>
        <div class="prices"><span>￥{{item.specialPrice}}</span> <i>￥{{item.price}}</i></div>
        <div class="company">{{item.company}}</div>
        <el-row type="flex">
          <div class="preferential"   v-for="tag in item.tags" :key="tag.id">
            {{tag}}
          </div>
        </el-row>
        <div class="buttons">
          <div class="buttons-left">上线</div>
          <div class="buttons-right">订购</div>
        </div>
      </div>
    </div>
    <!-- <div style="width:190px;"></div>
    <div style="width:190px;"></div>
    <div style="width:190px;"></div>
    <div style="width:190px;"></div>
    <div style="width:190px;"></div>
    <div style="width:190px;"></div>
    <div style="width:190px;"></div>
    <div style="width:190px;"></div>
    <div style="width:190px;"></div>
    <div style="width:190px;"></div>
    <div style="width:190px;"></div> -->
  </div>
</template>

<script>
export default {
    props:{
        listOne:Array
    },
    data(){
        return{

        }
    }
}
</script>

<style lang="scss">
.ListTypeOne {
  width: 100%;
  height: auto;
  display: flex;
  flex-wrap: wrap;
  // padding-bottom: 50px;
  flex-shrink: 0;
  .item {
    width: 190px;
    height: 360px;
    border-radius: 3px;
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
    margin-right: 20px;
    margin-bottom: 17px;
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
    // &.active{
    //   margin-left: auto;
    // }
    img {
      width: 100%;
      height: 190px;
    //   background-color: black;
    }
    .itembody {
      width: 100%;
      height: auto;
      padding: 8px 8px 11px;
      box-sizing: border-box;
        .des {
            width: 100%;
            max-height: 40px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            color: #333333;
            font-size: 14px;
        }
        .prices {
            margin: 5px 0 7px;
            display: flex;
            flex-wrap: nowrap;
            justify-content: flex-start;
            span{
                line-height: 25px;
                color: #FF6D61;
                font-size: 18px;
                display: block;
                margin-right: 6px;
            }
            i{
                color: #999999;
                font-size: 14px;
                font-style: normal;
                text-decoration: line-through;
                display: block;
                line-height: 25px;
            }
        }
        .company {
            text-align: left;
            color: #999999;
            font-size: 12px;
            margin-bottom: 5px;
        }
        .preferential {
          display: inline-block;
            padding: 1px 3px;
            border-radius: 3px;
            background-color: #FCB322;
            text-align: center;
            line-height: 20px;
            font-size: 12px;
            color: white;
            margin-bottom: 8px;
            margin-right: 7px;
        }
        .buttons {
            width: 100%;
            height: 25px;
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-between;
            border-radius: 2px;
            // background-color: rgba(255, 255, 255, 1);
            box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
            overflow: hidden;
            text-align: center;
            line-height: 25px;
            .buttons-left {
                width: 50%;
                height: 100%;
                color: white;
                font-size: 14px;
                background-color: #FF6D61;
            }
            .buttons-right {
                width: 50%;
                height: 100%;
                color: white;
                font-size: 14px;
                border: 1px solid #FF6D61;
                color: #FF6D61;
      box-sizing: border-box;

            }
        }
    }
  }
}
</style>