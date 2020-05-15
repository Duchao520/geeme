<template>
  <li
    class="item-detail"
    :class="goodsViewWithImg"
    @click="chooseGoodsItem(detail, index,$event)"
  >
    <img class="goods-image" :src="utils.formatPicImage(detail.image, 'style', 146, 'someone', detail.sex)">
    <div 
      class="goods-image-background"
      :style="{backgroundImage:`url(${utils.formatPicImage(detail.image, 'style', 146, 'someone', detail.sex)})`}"
    >
      <div class="keyword-info" v-if="detail.keyword">{{detail.keyword}}</div>
    </div>
    <img src="@/assets/img/icon_tag_star.png" v-if="detail.operate && billInfo.billingStaff.staffId" class="icon-image" title="开单人可提供的服务">
    <div class="keyword-info" v-if="detail.keyword && goodsViewWithImg === 'list'">{{detail.keyword}}</div>
    <div class="detail">
      <p class="service" :title="detail.name">{{ detail.name }}</p>
      <div class="bottom-text">
        <p class="two-price">
          <span class="new-price">¥{{ detail.memberPrice}}</span>
          <span class="shop-price">¥{{ detail.shopPrice }}</span>
        </p>
        <p class="stock" v-if="detail.goodsType==='production'">库存&nbsp;{{detail.stockAll}}</p>
      </div>
    </div>
    <choose-specification
      :visible="showChooseSpecification"
      :type="detail.goodsType"
      :specificationInfoList="detail.specificationInfoList"
      @close="showChooseSpecification = false"
      @confirm="confirmSelectSpecification"
    ></choose-specification>
  </li>
</template>
<script>
  import animation from "@/util/animation";
  import * as utils from "@/assets/js/utils";
  import ChooseSpecification from "@/components/createOrder/chooseSpecification";
  import {mapActions, mapGetters, mapState} from "vuex";
  export default {
    components: {ChooseSpecification},
    props: {
      detail: Object,
      index: Number,
      selectedServiceList: Array
    },
    data() {
      return {
        utils,
        showChooseSpecification: false,
        animation: null,

      }
    },
    computed:{
      billInfo() {
        return this.$store.state.bill;
      },
      carPosition() {
        return this.billInfo.carPosition;
      },
      goodsViewWithImg: {
        get() {
          return this.$store.state.bill.goodsViewWithImg
        },
        // set(str) {
        //   this.setGoodsViewWithImg(str) // 'card' => img; 'list' => text
        // }
      }
    },
    methods: {
      ...mapActions([
        "setSelectedVipCardId", // 加入产品或者服务的时候 清空已经选的卡，避免新加的东西不能用该卡支付 | 订单生产的id可能触发了这里的重置
      ]),
      chooseGoodsItem(item, index, event) {
        // 多规格的总规格数量为0 不能加入
        if ((item.stockAll <= 0 || item.goodsType === "production" && !this.checkCanAdd(item, 1)) && !this.billInfo.consumerServiceOrderInfo.serialCode) {
          this.$message({ type: 'error', message: '库存不足' })
          return
        }
        let len = this.detail.specificationInfoList.length;
        this.animation = ()=> animation.animationEvent(event, 100, 0.4, this.carPosition);
        // 规格数量判断
        if (len === 1) {
          let specification = this.detail.specificationInfoList[0];
          let chooseGoodsInfo = this.getTransData(specification);
          Object.assign(chooseGoodsInfo, {workStationCount: this.detail.workStationCount, serviceId: this.detail.serviceId}) // 注入工位
          // 追加商品了， 已经选择的卡可能不能用了 肯定要清空
          this.setSelectedVipCardId({})
          this.$emit("chooseGoodsItem", chooseGoodsInfo);
          animation.animationEvent(event, 100, 0.4, this.carPosition);
        } else {
          this.showChooseSpecification = true;
        }
      },
      confirmSelectSpecification(specification) {
        // console.log('')
        // console.log('~~~~~~')
        // console.log(this.detail.goodsType === "production")
        // console.log(!this.checkCanAdd(specification, 2))
        // console.log(this.billInfo.consumerServiceOrderInfo.serialCode)
        // console.log(!this.billInfo.consumerServiceOrderInfo.serialCode)
        if (this.detail.goodsType === "production" && !this.checkCanAdd(specification, 2) && !this.billInfo.consumerServiceOrderInfo.serialCode) {
          this.$message({ type: 'error', message: '库存不足' })
          return
        }
        let chooseGoodsInfo = this.getTransData(specification);
        // console.log('')
        // console.log('我选了一个服务或者产品。可能是多规格的...')
        // console.log(chooseGoodsInfo)
        Object.assign(chooseGoodsInfo, {workStationCount: this.detail.workStationCount, serviceId: this.detail.serviceId}) // 注入工位
        // 追加商品了， 已经选择的卡可能不能用了 肯定要清空
        this.setSelectedVipCardId({})
        this.$emit("chooseGoodsItem", chooseGoodsInfo);
        this.showChooseSpecification = false;
        this.animation()
      },
      getTransData(specification) {
        let goodsDetail = this.detail;
        // 暂时取消主销售人 start
        // let chooseCurrentStaffOk = goodsDetail.operate || goodsDetail.goodsType==="production"; //表示该服务是否可以由当前的开单人来做，不可以则选不了默认服务者，需手动选择,是产品的话则直接赋值
        let chooseCurrentStaffOk = goodsDetail.operate && goodsDetail.goodsType !=="production" && this.billInfo.billingStaff.staffId; //表示该服务是否可以由当前的开单人来做，不可以则选不了默认服务者，需手动选择,是产品的话则直接赋值
        // 暂时取消主销售人 end
        let _data = {
          serviceIndex: this.index, // 服务列表下标
          id: goodsDetail.id, // 服务id
          image: goodsDetail.image, // 服务头像
          memberPrice: specification.memberPrice, // 规格的会员价单价
          enableCardDiscount: specification.enableCardDiscount, // 规格的是否持卡会员价设置 new
          cardConstantPrice: specification.cardConstantPrice, // 规格的持卡会员价 new
          name: goodsDetail.name, // 服务名称
          num: specification.num || 1, // 服务规格的数量
          shopPrice: specification.shopPrice, // 旧价格
          staffName: this.billInfo.billingStaff.name, // 新版 开单人专用
          staffId: this.billInfo.billingStaff.staffId, // 新版 开单人专用
          // 旧版 - 主服务者用
          /* staffName: chooseCurrentStaffOk
            ? this.billInfo.billingStaff.name
            : null, // 服务者姓名
          staffId: chooseCurrentStaffOk
            ? this.billInfo.billingStaff.staffId
            : null, // 所选择的员工id */
          paymentStatus: false, //是否付过款
          assist: [], // 服务者-辅助工位
          goodsType: goodsDetail.goodsType, //商品的类型
          specificationId: specification.id, // 规格的规格id
          snapshotId: specification.snapshotId, //规格的快照id
          specificationName: specification.name, // 规格名称
          stock: specification.stock, // 规格的库存
          specificationTime: specification.serviceTime, // 记录服务的服务时长
          assistantOrSalers: null, ///  这个该死的东西要监听啊！！！ 服务第2工位 \ 产品销售人
          tempFinalPrice: 0, ///  这个该死的东西要监听啊！！！ 
          // stationOne: null, ///  服务第1工位 , 未加入开单人
          // -> 服务第一工位 ，  加入开单人
          stationOne: chooseCurrentStaffOk ? [{
            staffId: this.billInfo.billingStaff.staffId,
            headPortrait: this.billInfo.billingStaff.image,
            staffName: this.billInfo.billingStaff.name,
            // postId: this.billInfo.billingStaff.levelId, // 这里的转换放在挂单和结算内
            // postName: this.billInfo.billingStaff.levelName, // 这里的转换放在挂单和结算内
            levelId: this.billInfo.billingStaff.levelId,
            levelName: this.billInfo.billingStaff.levelName,
            shopNum: this.billInfo.billingStaff.shopNum,
            ratio: 100,
            isChosen: false,
            workStation: 1,
          }] : null,
          stationThree: null, ///  服务第3工位
          // selfPickUp: true, // 清坤的默认自提 用于订单列表，订单详情 *&……%￥ 
          sendType: 0, // 国轩的默认自提 用于开单，取单，挂单 *&……%￥  0=门店自提,1=物流配送 /createConsumerOrder
          workStationCount: specification.workStationCount, // 工位数
        };
        return _data;
      },
      checkCanAdd(item, n) {
        // console.log(n) // n 只是测试用, item 可能是整个产品 可能是一个子规格
        if (this.detail.goodsType === 'production') {
          let r = false
          let tag = {}
          if (item.specificationInfoList && item.specificationInfoList.length === 1) {
            tag = item.specificationInfoList[0]
          } else {
            tag = item
          }
          if (this.selectedServiceList.length) {
            for (let i = 0; i < this.selectedServiceList.length; i++) {
              if (this.selectedServiceList[i].goodsType === "production") {    
                let goods = this.selectedServiceList[i]
                if (tag.id === goods.specificationId) {
                  r = goods.num >= tag.stock
                  break
                }
              }
            }
          }
          // console.log('------1')
          // console.log('tag')
          // console.log(tag)
          // console.log('鉴定结果', n)
          // console.log(!r)
          return !r
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
@import "@/assets/css/order/shadow.scss";
@import "@/assets/css/mixin.scss";
// 图片模式
.item-detail.card {
  cursor: pointer;
  width: 170px;
  height: 246px;
  display: inline-block;
  @include goods-shadow-hover;
  border-radius: 6px;
  @include box-shadow-card();
  overflow: hidden;
  margin-left: 20px;
  margin-bottom: 20px;
  box-sizing: content-box;
  position: relative;
  .icon-image {
    width: 20px;
    height: 30px;
    position: absolute;
    top: 0;
    right: 10px;
  }
  .goods-image {
    width: 100%;
    height: 170px;
    display: none;
  }
  .goods-image-background {
    width: 170px;
    height: 170px;
    background-position: center center;
    background-size: cover;
    position: relative;
    .keyword-info {
      position: absolute;
      height: 18px;
      line-height: 18px;
      text-indent: 2px;
      max-width: 80%;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      font-size: 12px;
      color: #fff;
      background: rgba(0, 0, 0, .5);
      padding-right: 8px;
      border-radius: 0 10px 10px 0;
      bottom: 10px;
    }
  }
  .detail {
    box-sizing: border-box;
    padding: 0 10px;
    .service {
      line-height: 40px;
      color: #3a3a3a;
      font-size: 16px;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      box-sizing: border-box;
    }
    .bottom-text {
      font-size: 12px;
      color: #999999;
      display: flex;
      justify-content: space-between;
      .two-price {
        .new-price {
          color: #ff6d61;
          font-size: 14px;
          margin-right: 6px;
        }
        .shop-price {
          text-decoration: line-through;
        }
      }
    }
  }
}

// 文本模式
.item-detail.list {
  cursor: pointer;
  // width: 170px;
  // height: 246px;
  width: 200px;
  height: 96px;
  display: inline-block;
  @include goods-shadow-hover;
  border-radius: 6px;
  @include box-shadow-card();
  overflow: hidden;
  margin-left: 20px;
  margin-bottom: 20px;
  box-sizing: content-box;
  position: relative;
  .keyword-info {
    position: absolute;
    height: 18px;
    line-height: 18px;
    text-indent: 2px;
    max-width: 80%;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    font-size: 12px;
    color: #999;
    background: rgba(220, 223, 230, 1);
    padding-right: 8px;
    border-radius: 0 10px 10px 0;
    top: 10px;
  }
  .icon-image {
    width: 20px;
    height: 30px;
    position: absolute;
    top: 0;
    right: 10px;
  }
  .goods-image {
    width: 100%;
    height: 170px;
    display: none;
  }
  .goods-image-background {
    width: 170px;
    height: 170px;
    background-position: center center;
    background-size: cover;
    display: none;
  }
  .detail {
    box-sizing: border-box;
    margin-top: 30px;
    padding: 0 10px;
    .service {
      line-height: 40px;
      color: #3a3a3a;
      font-size: 16px;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      box-sizing: border-box;
    }
    .bottom-text {
      font-size: 12px;
      color: #999999;
      display: flex;
      justify-content: space-between;
      .two-price {
        .new-price {
          color: #ff6d61;
          font-size: 14px;
          margin-right: 6px;
        }
        .shop-price {
          text-decoration: line-through;
        }
      }
    }
  }
}

</style>
