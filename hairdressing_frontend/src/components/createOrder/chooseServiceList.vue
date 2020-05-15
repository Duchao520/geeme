<template>
  <div class="choose-service-list">
    <service-and-product-cards
      v-if="list&&list.length>0&&(sortGoodsType === 'service' || sortGoodsType === 'product')"
      :list="list"
      :selectedServiceList="selectedServiceList"
      :type="sortGoodsType"
      @chooseGoodsItem="chooseSpecification"
    ></service-and-product-cards>
    <select-card-lists
      :list="list"
      :selectedCardIds="selectedCardIds"
      v-if="list&&list.length>0&&['card','freeCard'].includes(sortGoodsType)"
      @chooseCard="chooseCard"
    ></select-card-lists>
    <add-card-lists v-if="sortGoodsType === 'cardAdd'" @chooseCard="chooseCard"></add-card-lists>
    <g-nolist
      class="no-list"
      v-if="showNoList"
      :img="nolistbg"
      :tip="sortGoodsType==='card'?'还没有卡项，赶快找品牌总部新增一个吧～':`该分类还没有${sortGoodsType==='service'?'服务':'产品'}，赶快新增一个`"
      :btnname="sortGoodsType==='service'?'新增服务':'新增产品'"
      :showBtn="sortGoodsType!=='card'"
      @todo="addGoods"
    ></g-nolist>
    <search-default class="search-default" v-if="showSearchDefault" v-on="$listeners"></search-default>
  </div>
</template>
<script>
  import * as utils from "@/assets/js/utils";
  import * as datas from "@/assets/js/datas";
  import animation from "@/util/animation";
  import {mapState} from "vuex";
  import ServiceAndProductCards from "@/components/createOrder/goodsCard/ServiceAndProductCards";
  import SelectCardLists from "@/components/createOrder/goodsCard/SelectCardLists";
  import AddCardLists from "@/components/createOrder/goodsCard/AddCardLists";

  export default {
    components: { ServiceAndProductCards, SelectCardLists, AddCardLists},
    props: {
      list: Array,
      selectedCardList: Array,
      selectedServiceList: Array, // 选中的服务或者产品
      showDefault: Boolean,
      initTotal: [Number, Object]
    },
    data() {
      return {
        nolistbg: datas.defaultImg.noservicelist,
        formatPicImage: utils.formatPicImage,
        leftServiceList: [],
        serviceIndex: null,
        animationFn: null,
        utils: utils,
        searchPhone: null
      };
    },
    computed: {
      ...mapState({
        billInfo: state => state.bill,
        sortGoodsType: state => state.bill.currentChooseTypeAndSortOneId.sortGoodsType,
        carPosition: state => state.bill.carPosition
      }),
      selectedCardIds() {
        return this.selectedCardList
          .filter(item => {
            return !item.deleted;
          })
          .map(item => item.cardKindId);
      },
      showSearchDefault() {
        return this.initTotal && this.list.length === 0;//后方的代码为polyfill，后期删除之
      },
      showNoList() {
        return this.list && this.list.length === 0 && this.showDefault && (this.sortGoodsType !== 'cardAdd') && !this.showSearchDefault
      }
    },
    watch: {
      list(val) {
        this.leftServiceList = val;
      }
    },
    methods: {
      chooseSpecification(_data) {
        // 是服务的或者是产品的第一次添加，则生成一个新的 已选服务、产品项目
        if (this.selectedServiceList.length === 0 || _data.goodsType === 'service') {
          this.selectedServiceList.push(_data);
          this.$emit("change", this.selectedServiceList);
        } else {
          /**
           * currentIndex:当前要新加的商品所匹配到的下标（可能为-1）；
           * currentGoods：当前压迫新家的商品所匹配到的商品（可能并没有）
           * */
          let currentIndex = -1;
          for (let i = 0; i < this.selectedServiceList.length; i++) {
            let item = this.selectedServiceList[i];
            if (
              !item.deleted && //不处于删除状态
              !item.paymentStatus && //不处于已付款状态
              item.specificationId === _data.specificationId && //规格id一样
              item.goodsType === _data.goodsType //都是产品或者都是服务
            ) {
              currentIndex = i;
              break;
            }
          }
          if (currentIndex !== -1) {
            // 库存不足,不能再加
            if (
              this.selectedServiceList[currentIndex].goodsType === 'service' || 
              this.billInfo.consumerServiceOrderInfo.serialCode ||
              this.selectedServiceList[currentIndex].goodsType === 'production' && this.selectedServiceList[currentIndex].num < this.selectedServiceList[currentIndex].stock
            ) {
              // 如果是取单状态， 库存暂时没法处理， 且后端会出错!!!
              if (this.billInfo.consumerServiceOrderInfo.serialCode) {
                this.selectedServiceList[currentIndex].num += _data.num;
              } else {
                // 如果是新开单状态，修正最大值为库存
                let old = this.selectedServiceList[currentIndex].num
                let add = _data.num
                this.selectedServiceList[currentIndex].num = old + add > _data.stock ? _data.stock : old + add
              }
              Object.assign(this.selectedServiceList[currentIndex], {stock: _data.stock}) // 取单来的需要这么补充一下
            } else {
              this.$message({
                type: 'error',
                message: '库存不足'
              })
            }
            this.$emit("change", this.selectedServiceList);
          } else {
            this.selectedServiceList.push(_data);
            this.$emit("change", this.selectedServiceList);
          }
        }
      },
      chooseCard(item, event, bool) {
        if (bool) {
          return;
        } else {
          // 暂时取消主销售人  <= 类似业务请搜它 start
          // 加入主销售人字段
          // Object.assign(item, {
            //   staffId: this.billInfo.billingStaff.staffId,
          //   staffName: this.billInfo.billingStaff.name,
          // })
          // 暂时取消主销售人  <= 类似业务请搜它  end
          let selectedCardList = JSON.parse(
            JSON.stringify(this.selectedCardList)
          );

          selectedCardList.push(item);
          this.$emit("changeSelectedCard", selectedCardList);
          animation.animationEvent(event, 100, 0.4, this.carPosition)
        }
      },
      addGoods() {
        switch (this.sortGoodsType) {
          case "service":
            this.$router.push("/shop-inner/service-add");
            break;
          case "product":
            this.$router.push("/shop-inner/product-add");
            break;
          case "card":
            // this.pagedQueryStoreCardKindBasicInfo();
            break;
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  .no-list {
    margin: 0;
  }
</style>
