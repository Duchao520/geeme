<template>
  <div class="card-transform-box">
    <div class="single-coupon-card">
      <!-- 正面 -->
      <div class="front" :class="[status.toLowerCase()]">
        <div class="price-box">
          <div class="pid"></div>
          <div class="left-box">
            <span class="middle">￥</span>
            <span class="big">{{singleData.money}}</span>
          </div>
          <div class="pid"></div>
          <div class="right-box">
            <div class="info-box">
              <p v-if="singleData.useUnLimited">无门槛</p>
              <p v-if="!singleData.useUnLimited">满{{singleData.purchaseAboveMoney}}可用</p>
              <template v-if="status === 'creating'">
                <p v-if="superData.validDateType === 'APPOINT_DATE'">
                  {{
                    superData.beforeComputedTimes && superData.beforeComputedTimes.length ? 
                    new Date(superData.beforeComputedTimes[0]).format('yyyy.MM.dd') : 
                    (superData.appointDateFrom && new Date(superData.appointDateFrom).format('yyyy.MM.dd') || '?年-?月-?日')
                  }}
                  -
                  {{
                    superData.beforeComputedTimes && superData.beforeComputedTimes.length ? 
                    new Date(superData.beforeComputedTimes[1]).format('yyyy.MM.dd') : 
                    (superData.appointDateTo && new Date(superData.appointDateTo).format('yyyy.MM.dd') || '?年-?月-?日')
                  }}
                </p>
                <p v-if="superData.validDateType === 'COUPON_GET_DAY'">
                  领取后 {{superData.validDays || '?'}} 天内有效
                </p>
              </template>
              <template v-if="status !== 'creating'">
                <p>
                  {{superData.validDateFrom.slice(0, 10)}} 至 {{superData.validDateTo.slice(0, 10)}}
                </p>
              </template>
            </div>
          </div>
        </div>
        <div class="range-for-use">
          <p>
            {{userRange}}
          </p>
          <p>
            限时抢购、拼团类等特价商品不可使用。
          </p>
        </div>
        <div v-if="hasCover" class="cover-img" :class="'tag0' + type"></div>
      </div>
      <!-- 背面 -->
      <div class="back" :class="[status.toLowerCase()]">
        <div class="limit-info scrollbar">
          <div class="least-money"></div>
          <div class="for-scroll-bar">
            <p>{{userRange}}</p>
            <p>{{singleData.serviceLevelTwoNameList.join(',')}}</p>
            <p>{{singleData.productLevelTwoNameList.join(',')}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { deflate } from 'zlib'
export default {
  props: {
    singleData: {
      type: Object
    },
    superData: {
      type: Object
    },
    status: {
      type: String,
      // default: 'UN_USE',
      default: 'creating',
    }
  },
  methods: {

  },
  computed: {
    userRange() {
      if (this.singleData.allProductPromote && this.singleData.allServicePromote) {
        return '全场通用;'
      } else {
        let str = ''

        if (this.singleData.allServicePromote) {
          str += '全部服务可用; '
        } else if (this.singleData.serviceList.length) {
          str += '部分服务可用; '
        }

        if (this.singleData.allProductPromote) {
          str += '全部产品可用;'
        } else if (this.singleData.productList.length) {
          str += '部分产品可用;'
        }
        return str
      }
    },
    hasCover() {
      return this.type > 1 || this.superData.unenforced
    },
    type() {
      switch (this.status) {
        // case 'UN_USE':
        //   return 1
        case 'USED':
          return 2
        case 'INVALID':
          return 3
        default:
          return 1 // 新增时使用
      }
    }
  },
  filters: {
    
  }
}
</script>

<style scoped lang="scss">
@import "@/assets/css/scrollbar.scss";
.card-transform-box {
  perspective: 1000;
  transform-style: preserve-3d;
  color: #eee;
  font-size: 14px;
  font-family: 'PingFangSC-Regular';
  &:hover .single-coupon-card {
    transform: rotateY(180deg);
  }
}
.single-coupon-card {
  width: 314px;
  height: 150px;
  margin: 10px 20px 10px 0;
  position: relative;
  border-radius: 4px;
  transition: 1.2s;
  transform-style: preserve-3d;
  .front, .back {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 4px;
    backface-visibility: hidden;
    // &.un_use {
      background-image: url('./coupon_un_use.png');
    // }
    &.used {
      background-image: url('./coupon_used.png');
    }
    &.invalid {
      background-image: url('./coupon_invalid.png');
    }
    background-size: cover;
    background-position: center;
  }
  .front {
    z-index: 2; // 注释这里就可以优先展示背面 1/2
    .cover-img {
      width: 60px;
      height: 45px;
      position: absolute;
      bottom: 20px;
      right: 10px;
      background: url('../../../../../assets/images/icon_redbag_tag01.png') no-repeat;
      background-size: 100%;
      &.tag02 { background-image: url('../../../../../assets/images/icon_redbag_tag02.png'); }
      &.tag03 { background-image: url('../../../../../assets/images/icon_redbag_tag03.png'); }
    }
  }
  .back {
    transform: rotateY(-180deg); // 注释这里就可以优先展示背面 2/2
    color: #eee;
  }
  .price-box {
    height: 94px;
    display: flex;
    flex-wrap: nowrap;
    // .pid {
    //   flex: 1;
    // }
    .left-box {
      line-height: 94px;
      padding: 0 12px;
    }
    .right-box {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: left;
    }
  }
  .range-for-use {
    height: 56px;
  }
}
.big {
  font-size: 24px;
  color: #fff;
}
.middle {
  font-size: 18px;
  color: #fff;
}
.range-for-use {
  display: flex;
  flex-direction: column;
  justify-content: center;
  p {
    text-align: left;
    text-indent: 12px;
  }
}
.limit-info {
  // width: 314px;
  // height: 150px;

  width: 280px;
  height: 120px;
  margin: 15px 11px;
  text-align: justify;
  overflow-y: auto;
  .part-service-and-product {
    text-align: justify;
  }
  .for-scroll-bar {
    margin-right: 4px;
  }
}
</style>
