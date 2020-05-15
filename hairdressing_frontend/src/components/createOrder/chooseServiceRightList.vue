<template>
  <div>
    <transition-group v-if="!isInOpenCard" name="goods-item" class="service-list" tag="ul">
      <service-or-product-item
        v-for="(item,index) in list"
        v-show="!item.deleted"
        :style="{marginBottom:index!==list.length-1?'10px':''}"
        :key="`${item.specificationId}${index}` || `${item.id}${index}`"
        :detail="item"
        :index="index"
        @deleteGoods="deleteGoods(item,index)"
      ></service-or-product-item>
    </transition-group>
    <transition-group v-if="isInOpenCard" name="goods-item" class="service-list" tag="ul">
      <selected-card
        v-for="(item,index) in list"
        :style="{marginBottom:index!==list.length-1?'10px':''}"
        :key="`${item.cardKindSnapshotId}${index}` || `${item.id}${index}`"
        :index="index"
        :detail="item"
        :sortGoodsType="sortGoodsType"
        @deleteGoods="deleteGoods(item,index)"
        v-show="!item.deleted"
      ></selected-card>
    </transition-group>
  </div>
</template>
<script>
  import ServiceOrProductItem from "@/components/createOrder/rightListGoods/ServiceOrProductItem";
  import SelectedCard from "@/components/createOrder/rightListGoods/SelectedCard";

  import {mapState} from "vuex";

  export default {
    components: {ServiceOrProductItem, SelectedCard},
    props: {
      list: Array
    },
    mounted() {
      console.log(this.list)
    },
    computed: {
      ...mapState({
        currentInfo: state => state.manage.currentInfo
      }),
      billInfo() {
        return this.$store.state.bill;
      },
      sortGoodsType() {
        return this.billInfo.currentChooseTypeAndSortOneId.sortGoodsType;
      },
      cardType(id) {
        switch (id) {
          case 0:
            return "身份卡";
            break;
          case 1:
            return "储值卡";
            break;
          case 2:
            return "次卡";
            break;
          case 3:
            return "时间卡";
            break;
        }
      },
      isInOpenCard() {
        return ["card", "cardAdd","freeCard"].includes(this.sortGoodsType);
      }
    },
    methods: {
      deleteGoods(item, index) {
        
        // let list = JSON.parse(JSON.stringify(this.list)); // 尝试不改变原数组 - 删除已选会员卡
        if (item.orderId || item.consumerOrderId) { // consumerOrderId是卡的挂单里的id， orderId 暂时还没看是哪里转来的服务或产品的订单id
          // list[index].deleted = true; // 尝试不改变原数组 - 删除已选会员卡
          this.list[index].deleted = true;
        } else {
          // list.splice(index, 1); // 尝试不改变原数组 - 删除已选会员卡
          this.list.splice(index, 1);
        }
        this.$emit("change", this.list); // 尝试不改变原数组 - 删除已选会员卡;  傻逼玩意  父组件的数据不能监听变化的话用这样再发上去处理先
      },
      clearService() {
        let tempList = JSON.parse(JSON.stringify(this.list));
        let emptyArr = [];
        for (let index = 0; index < tempList.length; index++) {
          const element = tempList[index];
          if (element.orderId || element.cardOrderId) {
            element.deleted = true;
            emptyArr.push(element);
          }
        }
        
        this.$emit("change", emptyArr);
      },
    }
  };
</script>

<style lang="scss" scoped>
  .assist {
    display: flex;
    flex-wrap: nowrap;
  }

  .assist-items {
    max-height: 40px;
    overflow: hidden;
    display: -webkit-box;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }

  .goods-item-enter-active {
    transition: all 0.3s ease 0.4s;
  }

  .goods-item-leave-active {
    transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
  }

  .goods-item-enter {
    transform: translateY(-20%) scaleY(0.5);
    opacity: 0;
  }

  .goods-item-leave-to {
    transform: translateY(-20%) scaleY(0.5);
    opacity: 0;
  }
</style>
