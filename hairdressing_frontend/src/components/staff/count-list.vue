<template lang="pug">
.count-list
  ul.header-list.list
    li.list-item(
      v-for="(item, index) in tHeader",
      :key="index"
    ) {{ item }}
  .body-list
    ul.list(
      v-for="(item, index) in dataList",
      :key="index"
    )
      li.list-item {{ item.period }}
      li.list-item {{ item.lastTime }}
      li.list-item {{ item.singlePrice }}
      li.list-item {{ item.time }}
      li.list-item {{ item.sumprice }}
      li.list-item {{ item.integral }}
      li.list-item {{ item.level }}
</template>
<script>
export default {
  props: {
    // list: Array
  },
  data() {
    return {
      tHeader: ['消费周期', '上次消费', '单客价', '累计消费数', '累计消费金额', '积分', '成长值'],
      dataList: [
        {
          period: '45天', // 消费周期
          lastTime: '2018-12-12', // 上次消费
          singlePrice: '950元', // 单客价
          time: '20次', // 累计消费数
          sumprice: '15680元', // 累计消费金额
          integral: '302105', // 积分
          level: '6015' // 成长值
        }, {
          period: '45天', // 消费周期
          lastTime: '2018-12-12', // 上次消费
          singlePrice: '950元', // 单客价
          time: '20次', // 累计消费数
          sumprice: '15680元', // 累计消费金额
          integral: '302105', // 积分
          level: '6015' // 成长值
        }, {
          period: '45天', // 消费周期
          lastTime: '2018-12-12', // 上次消费
          singlePrice: '950元', // 单客价
          time: '20次', // 累计消费数
          sumprice: '15680元', // 累计消费金额
          integral: '302105', // 积分
          level: '6015' // 成长值
        }, {
          period: '45天', // 消费周期
          lastTime: '2018-12-12', // 上次消费
          singlePrice: '950元', // 单客价
          time: '20次', // 累计消费数
          sumprice: '15680元', // 累计消费金额
          integral: '302105', // 积分
          level: '6015' // 成长值
        }, {
          period: '45天', // 消费周期
          lastTime: '2018-12-12', // 上次消费
          singlePrice: '950元', // 单客价
          time: '20次', // 累计消费数
          sumprice: '15680元', // 累计消费金额
          integral: '302105', // 积分
          level: '6015' // 成长值
        }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
.count-list {
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
      padding: 0 10px 0 0;
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
      padding-top: 20px;
      color: #333333;
    } 
  }
  
}
  
  
</style>