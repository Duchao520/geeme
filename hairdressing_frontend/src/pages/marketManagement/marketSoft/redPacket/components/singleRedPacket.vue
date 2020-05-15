<template>
  <div class="card-transform-box">
    <div class="single-red-packet-card">
      <div class="front" :style="{background: customerEntry.type === 3 ? '#b8bdc6' : customerEntry.type === 2 ? '#778ca2' : '#f52d56'}">
        <div class="title" :class="'top0' + customerEntry.type">{{superData.packetTypeName}}</div>
        <div class="price">{{singleData.packetMoney}}<span>元</span></div>
        <!-- 客户中心时间段 -->
        <div class="valid-date small" v-if="customerEntry.type">
          {{new Date(customerEntry.sTime).format('yyyy.MM.dd')}} - {{new Date(customerEntry.eTime).format('yyyy.MM.dd')}}
        </div>
        <!-- 红包详情有效期 -->
        <div class="valid-date small" v-else>领取{{superData.validTimeStrategy|dateFilter}}起{{superData.validDay}}天内有效</div>
        <div class="dot-line"></div>
        <div class="limit-info-box">
          <div class="least-money">{{singleData.packetUseCondition ? `满${singleData.leastMoney}元可用；` : '无门槛；'}}</div>
          <div class="part-service-and-product">可用商品:&nbsp;&nbsp;{{limitGoods(singleData.packetUseStrategy)}}</div>
          <!-- <div class="with-coupons">{{superData.useWithCoupons ? '' : '不'}}可与优惠券同享。</div> -->
        </div>
        <div v-if="hasCover" class="cover-img" :class="'tag0' + customerEntry.type"></div>
      </div>
      <div class="back" :style="{background: customerEntry.type === 3 ? '#b8bdc6' : customerEntry.type === 2 ? '#778ca2' : '#f52d56'}">
        <div class="title" :class="'top0' + customerEntry.type ">{{superData.packetTypeName}}</div>
        <div class="limit-info scrollbar">
          <div class="least-money">{{singleData.packetUseCondition ? `满${singleData.leastMoney}元可用；` : '无门槛；'}}</div>
          <div class="for-scroll-bar">
            <div class="part-service-and-product">可用商品:&nbsp;&nbsp;{{limitGoods(singleData.packetUseStrategy)}}</div>
          </div>
          <!-- <div class="with-coupons">{{superData.useWithCoupons ? '' : '不'}}可与优惠券同享。</div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'single-card',
  props: {
    singleData: {
      type: Object
    },
    superData: {
      type: Object
    },
    customerEntry: {
      type: Object,
      default: () => {
        return {type: 0}
      }
    }
  },
  methods: {
    limitGoods(type) {
      let partGoods = (this.singleData.partServiceUseStrategy || []).concat(this.singleData.partProductUseStrategy || []).map(i => i.typeTwoName).join('、')
      let map = {
        0: '所有服务和产品；',
        1: '所有服务；',
        2: '所有产品；',
        3:  partGoods ? partGoods + '等；' : '无；'
      }
      return map[type]
    }
  },
  computed: {
    hasCover() {
      return this.customerEntry.type > 1 || (this.customerEntry.type === 1 && !this.customerEntry.startValid)
    }
  },
  filters: {
    dateFilter(type) {
      let map = {
        0: '当日',
        1: '次日',
        2: '',
      }
      return map[type]
    },
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
  text-align: center;
  font-family: 'PingFangSC-Regular';
  &:hover .single-red-packet-card {
    transform: rotateY(180deg);
  }
}
.single-red-packet-card {
  width: 165px;
  height: 214px;
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
  }
  .front {
    z-index: 2;
    .cover-img {
      width: 60px;
      height: 45px;
      position: absolute;
      top: 20px;
      left: 10px;
      background: url('../../../../../assets/images/icon_redbag_tag01.png') no-repeat;
      background-size: 100%;
      &.tag02 { background-image: url('../../../../../assets/images/icon_redbag_tag02.png'); }
      &.tag03 { background-image: url('../../../../../assets/images/icon_redbag_tag03.png'); }
    }
  }
  .back {
    transform: rotateY(-180deg);
    color: #eee;
  }
}
.title {
  color: #fff;
  width: 165px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  background-image: url('../../../../../assets/images/img_redbag_top01.png');
  background-repeat: no-repeat;
  background-size: 100%;
  &.top02 { background-image: url('../../../../../assets/images/img_redbag_top02.png'); }
  &.top03 { background-image: url('../../../../../assets/images/img_redbag_top03.png'); }
}
.small {
  font-size: 12px;
}
.price {
  height: 50px;
  margin-top: 11px;
  font-size: 36px;
  color: #fff;
  text-align: center;
  span {
    font-size: 17px;
  }
}
.dot-line {
  height: 6px;
  border-bottom: 1px dashed #fff;
  margin: 0 16px;
}
.limit-info-box {
  width: 134px;
  height: 72px;
  font-size: 12px;
  text-align: left;
  margin: 4px auto auto;
  .least-money, .with-coupons {
    height: 20px;
    line-height: 20px;
  }
  .part-service-and-product {
    min-height: 20px;
    max-height: 40px;
    line-height: 20px;

    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}
.limit-info {
  width: 144px;
  height: 160px;
  margin: 4px 10px 15px;
  text-align: left;
  overflow-y: auto;
  font-size: 12px;
  .part-service-and-product {
    text-align: justify;
  }
  .for-scroll-bar {
    margin-right: 4px;
  }
}
</style>
