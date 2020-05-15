<template lang="pug">
  .choose-info
    ul.choose-list
      li.list-item(
        v-for="(item, index) in list"
      )
        .c-header.clearfix
          .number 订单号: {{ item.orderno }}
          .time {{ item.dued}}
        .c-container 
          el-checkbox-group.check-container(
            v-model="checkArr",
            @change="checkChange"
          )
            .check-box.col-item
              el-checkbox(
                :key="item.appoId",
                :label="item.appoId",
                :name="'sss'"
              ) &nbsp;
            .col-item
              img.avatar(
                :src="formatPicImage(item.img, 'style', 146, 'someone')"
              )
            .content.col-item
              .name {{ item.server }}
              .type {{ item.type }} &nbsp;&nbsp;&nbsp; {{ item.time }}分钟
            .col-item.price {{ item.price }}
            .col-item.count X{{ item.count}}
            .col-item.status
                status-text(
                  :type="bgColor[item.status]"
                  :name="item.status"
                )
                
              
            
</template>
<script>
import * as utils from '@/assets/js/utils'
import * as datas from '@/assets/js/datas'
export default {
  data() {
    return {
      formatPicImage: utils.formatPicImage, // 有尺寸的图片处理
      bgColor: datas.SERVER_STATUS, // 预约状态
      list: [
        {
          appoId: 1, // 订单id
          orderno: 'J201811070100358', // 订单编号
          dued: '2018-11/07 22:30:69', // 预约时间
          img: '', // 客户头像
          server: '欧莱雅负离子烫日式剪发OL高级烫染不伤发柔顺光泽', // 服务名称
          type: '沁雅套装', // 服务类型
          time: 60, // 服务时长
          price: 999, // 服务价格
          count: 1, // 服务数量
          status: '待付款' // 服务状态
        },
        {
          appoId: 2, // 订单id
          orderno: 'J201811070100358', // 订单编号
          dued: '2018-11/07 22:30:69', // 预约时间
          img: '', // 客户头像
          server: '欧莱雅负离子烫日式剪发OL高级烫染不伤发柔顺光泽', // 服务名称
          type: '沁雅套装', // 服务类型
          time: 60, // 服务时长
          price: 999, // 服务价格
          count: 1, // 服务数量
          status: '待付款' // 服务状态
        },
        {
          appoId: 3, // 订单id
          orderno: 'J201811070100358', // 订单编号
          dued: '2018-11/07 22:30:69', // 预约时间
          img: '', // 客户头像
          server: '欧莱雅负离子烫日式剪发OL高级烫染不伤发柔顺光泽', // 服务名称
          type: '沁雅套装', // 服务类型
          time: 60, // 服务时长
          price: 999, // 服务价格
          count: 1, // 服务数量
          status: '待付款' // 服务状态
        },
        {
          appoId: 4, // 订单id
          orderno: 'J201811070100358', // 订单编号
          dued: '2018-11/07 22:30:69', // 预约时间
          img: '', // 客户头像
          server: '欧莱雅负离子烫日式剪发OL高级烫染不伤发柔顺光泽', // 服务名称
          type: '沁雅套装', // 服务类型
          time: 60, // 服务时长
          price: 999, // 服务价格
          count: 1, // 服务数量
          status: '待付款' // 服务状态
        },
        {
          appoId: 5, // 订单id
          orderno: 'J201811070100358', // 订单编号
          dued: '2018-11/07 22:30:69', // 预约时间
          img: '', // 客户头像
          server: '欧莱雅负离子烫日式剪发OL高级烫染不伤发柔顺光泽', // 服务名称
          type: '沁雅套装', // 服务类型
          time: 60, // 服务时长
          price: 999, // 服务价格
          count: 1, // 服务数量
          status: '待付款' // 服务状态
        },
        {
          appoId: 6, // 订单id
          orderno: 'J201811070100358', // 订单编号
          dued: '2018-11/07 22:30:69', // 预约时间
          img: '', // 客户头像
          server: '欧莱雅负离子烫日式剪发OL高级烫染不伤发柔顺光泽', // 服务名称
          type: '沁雅套装', // 服务类型
          time: 60, // 服务时长
          price: 999, // 服务价格
          count: 1, // 服务数量
          status: '待付款' // 服务状态
        }
      ],
      checkArr: [], // 选择的预约单
    }
  },
  methods: {
    checkChange(data) {
      console.log(data)
    }
  },
}
</script>
<style lang="scss" scoped>
  .choose-info {
    .choose-list {
      width: 100%;
      max-height: 400px;
      margin-top: 10px;
      overflow-y: auto;
      /*滚动条样式*/
      &::-webkit-scrollbar {/*滚动条整体样式*/
        width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
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
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        overflow: hidden;
        font-size: 12px;
        border: 1px solid #DEE1E6;
        margin-top: 20px;
        .c-header {
          height: 36px;
          background: #DEE1E6;
          line-height: 36px;
          padding: 0 20px;
          .number,
          .time {
            display: inline-block;
          }
          .time {
            float: right;
          }
        }
        .c-container {
          padding: 10px 0px;
          .check-container {
            display: flex;
            -webkit-display: flex;
            -moz-display: flex;
            -ms-display: flex;
            -o-display: flex;
            font-size: 12px;
            .col-item {
              &.check-box {
                padding: 0 5px 0px 20px;
                line-height: 70px;
                font-size: 12px;
              }
              .avatar {
                width: 70px;
                height: 70px;
                margin-right: 10px;
              }
              &.content {
                vertical-align: top;
                width: 174px;
                margin-right: 10px;
                .name {
                  color: #333333;
                  height: 32px;
                  text-overflow: -o-ellipsis-lastline;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  line-clamp: 2;
                  -webkit-box-orient: vertical;
                }
                .type {
                  color: #999999;
                  margin-top: 10px;
                }
              }
              &.price,
              &.count,
              &.status {
                flex: 1;
                text-align: center;
                line-height: 70px;
              }
            }
          }
        }
      }
    }
  }
</style>