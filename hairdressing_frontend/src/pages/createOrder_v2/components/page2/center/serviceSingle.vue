<template>
  <li
    class="single-service-item"
    :class="billInfo.goodsViewWithImg"
    @click="chooseGoodsOrSpecification($event)"
  >
    <img
      class="goods-image"
      v-if="billInfo.goodsViewWithImg === 'card'"
      :src="utils.formatPicImage(service.image, 'style', 146, 'someone', service.sex)"
    />
    <div class="text-info">
      <p class="item-name">{{ service.name }}</p>
      <div class="bottom-text">
        <p class="item-price">
          <span class="member-price">¥{{ service.memberPrice}}</span>
          <span class="shop-price">¥{{ service.shopPrice}}</span>
        </p>
        <div
          class="keyword-info"
          v-if="service.keyword && billInfo.goodsViewWithImg === 'list'"
        >{{service.keyword}}</div>
      </div>
    </div>
    <!-- 2个定位的标记(可能存在) -->
    <!-- 1: keyword 员工店内编号 -->
    <div
      class="keyword-info"
      v-if="service.keyword && billInfo.goodsViewWithImg === 'card'"
    >{{service.keyword}}</div>
    <!-- 2: 开单人可提供的服务 -->
    <img
      class="icon-image-card"
      title="开单人可提供的服务"
      src="@/assets/img/icon_tag_star.png"
      v-if="service.operate && billInfo.billingStaff.staffId && billInfo.goodsViewWithImg === 'card'"
    />

    <img
      class="icon-image-list"
      title="开单人可提供的服务"
      src="@/assets/img/icon_tag_star.png"
      v-if="service.operate && billInfo.billingStaff.staffId && billInfo.goodsViewWithImg === 'list'"
    />

    <!-- 多规格选择组件 -->
    <multipleSpecification
      v-if="specificationVisible"
      :visible="specificationVisible"
      :type="service.goodsType"
      :specificationInfoList="service.specificationInfoList"
      @close="specificationVisible = false"
      @addToCart="handleMultipleSpSelected"
    />
  </li>
</template>
<script>
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import { mapActions, mapState } from "vuex";
import animation from "@/util/animation";
import multipleSpecification from "./multipleSpecification.vue"; // 产品服务多规格选择
export default {
  props: {
    service: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      utils,
      specificationVisible: false, // 多规格选择
      animation: null
    };
  },
  methods: {
    ...mapActions(["setSelectedGoods", "setCompareMemberLevelPrice"]),
    chooseGoodsOrSpecification(event) {
      this.animation = () =>
        animation.animationEvent(event, 100, 0.4, this.billInfo.carPosition);
      if (this.service.specificationInfoList.length === 1) {
        this.saveSpecificationToOrder(0);
      } else {
        this.specificationVisible = true; // 如果是服务,直接打开; 如果是产品,还要看是否有库存
      }
    },
    // 多规格组件处理
    handleMultipleSpSelected(data) {
      this.specificationVisible = false;
      this.saveSpecificationToOrder(data.idx, data.num);
    },
    // 单规格存0， 多规格按下标, 存入购物车
    // 将数据存入vuex, 如果当前购物车已经有这个商品，不叠加数量，只新增一个商品
    saveSpecificationToOrder(idx, num) {
      // 规格下标， 商品数量(多规格时可以选数量)
      // 存入购物车的数量不得大于20,核销的数量可能超过20 ，所以这里限制大于等于20
      if (this.alreadySelectedListsLen >= 20)
        return this.$message.error("开单商品数量不得超过20！");
      let goods = JSON.parse(JSON.stringify(this.service));
      delete goods.specificationInfoList; // 将规格以外的数据存入，需要格式化的再覆盖
      delete goods.levelIds;
      delete goods.id; // 这个会和取单时冲突， 且新增时不需要给后端
      let params = {
        ...goods, // 这行不要写在下方[需覆盖]后面
        count: num || 1, // 商品数量(多规格时可以选数量)
        // sendType: 0, // 物流配送? 服务没有,产品有
        // stock: null, // 库存? 服务没有,产品有
        deleted: false, // 是否删除
        storeRemark: "", // 门店备注
        paymentStatus: false, // 未支付
        storePreference: null, // 门店优惠
        specificationId: this.service.specificationInfoList[idx].id, // 对应的规格的id
        shopPrice: this.service.specificationInfoList[idx].shopPrice, // 对应的规格的门店价， [需覆盖]产品的字段
        snapshotId: this.service.specificationInfoList[idx].snapshotId, // 对应的规格的快照id
        specificationName: this.service.specificationInfoList[idx].name, // 对应的规格的名称
        memberPrice: this.service.specificationInfoList[idx].memberPrice, // 对应的规格的会员价， [需覆盖]产品的字段
        // specificationTime: this.service.specificationInfoList[idx].serviceTime, // 规格服务时长 - 这个应该是不需要的
        enableCardDiscount: this.service.specificationInfoList[idx]
          .enableCardDiscount, // 是否允许卡打折???
        tempFinalPrice:
          this.service.specificationInfoList[idx].memberPrice * num, // 临时最终价 - 同规格会员价(这个数字是要乘数量的)
        staffId: this.billInfo.billingStaff.staffId, // 作为开单人
        staffName: this.billInfo.billingStaff.name, // 作为开单人
        assistantOrSalers: [], // 工位2， 销售人?
        stationThree: [], // 工位3
        stationOne:
          goods.operate && this.billInfo.billingStaff.staffId
            ? [
                // 工位1
                {
                  // 开单人自动加入第一工位
                  ratio: 100, // 业绩比例
                  isChosen: false, // 非指定
                  staffName: this.billInfo.billingStaff.name,
                  staffId: this.billInfo.billingStaff.staffId,
                  shopNum: this.billInfo.billingStaff.shopNum,
                  levelId: this.billInfo.billingStaff.levelId,
                  headPortrait: this.billInfo.billingStaff.image,
                  levelName: this.billInfo.billingStaff.levelName
                }
              ]
            : []
      };
      delete goods.operate;
      // 为该商品创建比对会员成长值价格数据
      if (this.billInfo.customerInfo.id) {
        this.memberPriceCompareInfo(params);
      } else {
        this.setSelectedGoods(params); // 对象是push进入
      }
      // 将商品用动画抛入购物车
      this.animation();
    },
    // 设置并返回该商品的会员价比对信息, 如果已经有存储,不请求
    memberPriceCompareInfo(params) {
      let key = `${params.goodsType}_${params.specificationId}`;
      if (!this.billInfo.compareMemberLevelPrice[key]) {
        // 没有存过的话, 存起来
        let data = {
          goodsSearch: [
            {
              goodsTypeScopeEnum: params.goodsType.toUpperCase(),
              specificationId: params.specificationId
            }
          ],
          storeCustomerId: this.billInfo.customerInfo.id
        };
        axios.post("/getBrandCustomerGoodsLevelPrice", data).then(res => {
          this.setCompareMemberLevelPrice(res.goodsInfo[0]);
          this.setSelectedGoods(params);
        });
      } else {
        this.setSelectedGoods(params);
      }
    }
  },
  computed: {
    ...mapState({
      billInfo: state => state.bill,
      currentInfo: state => state.manage.currentInfo
    }),
    alreadySelectedListsLen() {
      let count = 0;
      let list = ["service", "product"].includes(this.billInfo.currentLeftType)
        ? this.billInfo.selectedGoods || []
        : this.billInfo.selectedCard || [];
      list.forEach(item => {
        if (!item.deleted) {
          count++;
        }
      });
      return count;
    }
  },
  components: { multipleSpecification }
};
</script>
<style lang='scss' scoped>
@import "@/assets/css/order/shadow.scss";
@import "@/assets/css/mixin.scss";
.single-service-item {
  @include goods-shadow-hover;
  @include box-shadow-card();
  border-radius: 6px;
  cursor: pointer;
  margin: 10px 10px;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.keyword-info {
  position: absolute;
  height: 18px;
  line-height: 18px;
  text-indent: 2px;
  max-width: 80%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
  padding-right: 8px;
  border-radius: 0 10px 10px 0;
}
.icon-image-card {
  width: 20px;
  height: 30px;
  position: absolute;
  top: 0;
  right: 10px;
}
.icon-image-list {
  width: 13.33px;
  height: 20px;
  position: absolute;
  top: 0;
  right: 15px;
}
.text-info {
  box-sizing: border-box;
  padding: 0 10px;
  .item-name {
    margin-top: 10px;
    line-height: 30px;
    color: #3a3a3a;
    font-size: 16px;
    width: 80%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    box-sizing: border-box;
  }
}
.bottom-text {
  font-size: 12px;
  color: #999999;
  display: flex;
  justify-content: space-between;
  .item-price {
    .member-price {
      color: #ff6d61;
      font-size: 14px;
      margin-right: 6px;
    }
    .shop-price {
      text-decoration: line-through;
    }
  }
}
// 图片模式
.single-service-item.card {
  width: 170px;
  height: 246px;
  .goods-image {
    width: 170px;
    height: 170px;
    object-fit: cover;
    object-position: center center;
    border-radius: 8px 8px 0 0;
  }
  .text-info {
    flex: 1;
  }
  .keyword-info {
    top: 144px;
  }
}
// 文字模式
.single-service-item.list {
  width: 200px;
  height: 60px;
  .text-info {
    // margin-top: 30px;
    .item-price {
      // margin-bottom: 10px;
      margin-top: -2px;
    }
  }
  .keyword-info {
    // bottom: 5px;
    // right: 0px;
    top: 0px;
    left: 0px;
    border-radius: 0px 0px 6px 0px !important;
    padding: 0 6px !important;
    height: 14px !important;
    line-height: 14px !important;
    text-indent: 0px !important;
  }
}
</style>
