<template lang="pug">
  .detail-info
    ul.info-list
      li.list-item.odd
        span.title 预约门店
        span.value {{ list.city }}&nbsp;&nbsp;
        span.type {{ list.shopName }}
      li.list-item.evel
        span.title 预约到店
        span.value {{ list.dueTime }}
      li.list-item.odd(
        v-if="!!list.serviceInfoForAppointments"
      )
        span.title 服务者和服务
        span.value {{ list.staffName }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        span.value 
          ul
            li(v-for="item in list.serviceInfoForAppointments" :key="item.id")
              span.service-item.service-name {{item.serviceName}}
              span.service-item.service-sp(v-show="item.specificationName !== '默认'") {{item.specificationName}}
              span.service-item.service-count(style="color:#999;") X{{item.count}}
      li.list-item.evel
        span.title 合计金额
        span.value {{list.totalPrice||0}}元&nbsp;&nbsp;
        span.value(
          :class="[list.payStatus ? 'pay' : 'nopay']"
        ) {{ list.payStatus ? '已支付' : '未支付' }}
      li.list-item.other(
        v-if="list.cancelReason"
      )
        span.title 取消理由
        span.value {{list.cancelReason}}
      li.list-item.other(
        v-if="list.cancelNotes"
      )
        span.title 取消备注
        span.value {{list.cancelNotes}}
      li.list-item.other(
        v-if="list.cancelOperator"
      )
        span.title 取消人
        span.value {{list.cancelOperator}}&nbsp;&nbsp;
          span.exceed {{list.cancelTime}}
</template>
<script>
export default {
  data(){
    return {

    }
  },
  props: {
    list: Object
  },
}
</script>
<style lang="scss" scoped>
.detail-info {
  .info-list {
    width: 100%;
    .list-item {
      // width: 50%;
      display: inline-block;
      &.evel {
        width: 40%;
      }
      &.odd {
        width: 60%;
      }
      font-size: 14px;
      margin-top: 10px; 
      .title {
        text-align: right;
        width: 30%;
        margin-right: 6%;
        color: #999;
        font-size: 14px;
        font-weight: normal;
      }
      .value {
        color: #333333;
        &.nopay {
          color: #FF6D61;
        }
        &.pay {
          color: #75C74F;
        }
      }
      .exceed {
        color: #999999;
        font-size: 12px;
      }
      &.other {
        display: flex;
        width: 100%;
        .title {
          width: 18%;
          height: 100%;
          margin-right: 3.5%;
        }
        .value {
          display: inline-block;
          flex: 1;
          margin-right: 12px;
        }
      }
      ul {
        margin: 10px 0 0 160px;
        li {
          text-align: left;
          height: 24px;
          line-height: 24px;
          .service-item {
            display: inline-block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            &.service-name {
              width: 100px;
              margin-right: 10px;
            }
            &.service-sp {
              max-width: 120px;
              margin-right: 6px;
            }
            &.service-count {
              max-width: 48px;
              text-overflow: clip;
            }
          }
        }
      }
    }
  }
}
  
</style>
