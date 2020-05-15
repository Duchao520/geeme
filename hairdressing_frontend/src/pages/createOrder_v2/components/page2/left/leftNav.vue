<template>
  <div class="left-goods-type-nav">
    <div
      class="nav-button"
      v-for="type in billInfo.leftNavBarTypes"
      :key="type"
      :class="{active: type === billInfo.currentLeftType, disabled: disabled(type)}"
      @click="saveGoodsType(type)"
    >
      <i class="icon iconfont" :class="`icon-icon_choose_${typeClassFilter(type)}`"></i>
      <span class="type-info">{{type | typeFilter}}</span>
    </div>
  </div>
</template>
<script>
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {};
  },
  methods: {
    ...mapActions(["setCurrentLeftType", "setCurrentTopStatus"]),
    // 转换iconfont
    typeClassFilter(type) {
      let map = {
        card: "card",
        service: "service",
        product: "produce",
        renewal_card: "card2"
      };
      return map[type];
    },
    saveGoodsType(type) {
      if (this.disabled(type)) return;
      this.setCurrentTopStatus({ product: null, service: null, card: null,renewal_card: null });
      // 刷新或者切换分类时,重置为全部
      this.setCurrentLeftType(type);
    },
    disabled(type) {
      if (["service", "product"].includes(type)) {
        // 服务，产品
        if (this.billInfo.protectedGoodsType === "goods") {
          return false;
        } else if (this.billInfo.protectedGoodsType === "card") {
          return true;
        }
      } else {
        // 开卡，续卡
        if (this.billInfo.protectedGoodsType === "goods") {
          return true;
        } else if (this.billInfo.protectedGoodsType === "card") {
          return false;
        }
      }
    }
  },
  computed: {
    ...mapState({
      billInfo: state => state.bill,
      currentInfo: state => state.manage.currentInfo
    })
  },
  watch: {},
  filters: {
    typeFilter(type) {
      let map = {
        card: "卡项",
        service: "服务",
        product: "产品",
        renewal_card: "续卡"
      };
      return map[type];
    }
  }
};
</script>
<style lang='scss' scoped>
.left-goods-type-nav {
  position: fixed;
  top: 0;
  left: 0;
  margin-top: 65px;
  background: #fff;
  width: 60px;
  height: 100%;
  min-height: 400px;
  display: flex;
  flex-direction: column;
}
.nav-button {
  height: 75px;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-bottom: 1px solid #dcdfe6;
  cursor: pointer;
  &:hover {
    background: #ecf5ff;
  }
  &.disabled:hover {
    cursor: not-allowed;
  }
  .icon {
    font-size: 20px;
    color: #a3b2b9;
  }
  .type-info {
    font-size: 12px;
    color: #758c97;
  }
  &.active {
    background: #ecf5ff;
    .icon,
    .type-info {
      color: #f52d56;
    }
  }
}
</style>
