<template lang="pug">
.card-list
  ul.header-list.list
    li.list-item(
      v-for="(item, index) in tHeader",
      :key="index"
    ) {{ item }}
    li.opera-item 操作
  .body-list
    ul.list(
      v-for="(item, index) in dataList",
      :key="index"
    )
      li.list-item {{ item.name }}
      li.list-item {{ item.getCard }}
      li.list-item {{ item.cellPrice }}
      li.list-item {{ item.chargePrice }}
      li.list-item {{ item.giftPrice }}
      li.list-item {{ item.remainChargeprice }}
      li.list-item {{ item.remainGiftprice }}
      li.list-item {{ item.status }}
      li.opera-item 
        <g-button :name="'续卡'"  type="detail" :icon="'icon_operate_edit'"></g-button>
        <g-button :name="'禁用'" :type="'green'" :icon="'icon_operate_file'" ></g-button>
</template>
<script>
export default {
  props: {
    // list: Array
  },
  data() {
    return {
      tHeader: ['卡名', '办卡时间', '售卡金额', '充值卡金', '赠送卡金', '剩余充值卡金', '剩余赠送卡金', '状态'],
      dataList: [
        {
          name: '至尊卡', // 卡名
          getCard: '2018-12-12', // 办卡时间
          cellPrice: '8000元', // 售卡金额
          chargePrice: '10000元', // 充值卡金
          giftPrice: '2000元', // 赠送卡金
          remainChargeprice: '5000元', // 剩余充值卡金
          remainGiftprice: '5000元', // 剩余赠送卡金
          status: true // 状态
        }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
.card-list {
  margin: 20px 0;
  -webkit-box-shadow: 0px 3px 16px 0px rgba(85, 85, 85, 0.1);
  -o-box-shadow: 0px 3px 16px 0px rgba(85, 85, 85, 0.1);
  -ms-box-shadow: 0px 3px 16px 0px rgba(85, 85, 85, 0.1);
  box-shadow: 0px 3px 16px 0px rgba(85, 85, 85, 0.1);
  .list {
    width: 100%;
    display: flex;
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flex;
    display: -o-flex;
    text-align: center;
    color: #666666;
    .list-item {
      font-size: 12px;
      padding: 10px;
      line-height: 26px;
      margin-right: 10px;
      flex: 1;
      -webkit-flex: 1;
      -moz-flex: 1;
      -ms-flex: 1;
      -o-flex: 1;
      .time {
        margin-right: 10px;
      }
    }
    .opera-item {
      padding: 10px;
      font-size: 12px;
      width: 150px;
      color: #333333;
    }
    .icon {
      color: #58C9F3;
    }
  }
  .body-list {
    max-height: 100px;
    overflow-y: auto;
    /*滚动条样式*/
    &::-webkit-scrollbar {/*滚动条整体样式*/
        width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
        height: 4px;
    }
    &::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
        border-radius: 5px;
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        background: rgba(0,0,0,0.2);
    }
    &::-webkit-scrollbar-track {/*滚动条里面轨道*/
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        border-radius: 0;
        background: rgba(0,0,0,0.1);
    }
    .list-item {
      color: #333333;
    } 
    
  }
  
}
  
  
</style>