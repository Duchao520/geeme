<template>
  <div class="payment-type-list scrollbar">
    <div 
      class="pay-type"
      :class="{active: active.id === payType.id, disabled: disabled}"
      v-for="payType in list"
      :key="payType.id"
      @click="handleChangedPayType(payType)"
    >
      <img :src="payType.billType === 1 ? require(`@/assets/images/icon_pay_ali.png`) : utils.formatPicImg(payType.image,'style',40)">
      <span :title="payType.billTypeName">
        {{payType.billTypeName}}
      </span>
    </div>
  </div>
</template>
<script>
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import { mapActions, mapState } from "vuex";
export default {
  props: {
    list: {
      type: Array,
      required: true
    },
    active: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      utils,
    }
  },
  methods: {
    handleChangedPayType(payType) {
      if (this.disabled) return false
      this.$emit('changed', payType)
    }
  },
  computed: {
    disabled() {
      return false // 收款台结算再做...
    },
  }
}
</script>
<style lang='scss' scoped>
@import "@/assets/css/scrollbar.scss";
.payment-type-list {
  margin-top: 90px;
  // margin-bottom: 90px;
  min-height: 600px;
  height: calc(100vh - 369px);
  width: 240px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  user-select: none;
}
.pay-type {
  box-sizing: border-box;
  width: 182px;
  background: #fff;
  display: flex;
  cursor: pointer;
  align-items: center;
  border-radius: 5px;
  position: relative;
  border-radius: 5px;
  img {
    width: 50px;
    height: 50px;
    border-radius: 5px 0 0 5px;
  }
  span {
    line-height: 50px;
    text-indent: 20px;
    font-size: 18px;
    color: #333;
    flex: 1;
    margin-right: 12px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border-radius: 5px;
    -webkit-transition: all 0.15s;
    transition: all 0.15s;
    border: 2px solid transparent;
  }
  &.active:before {
    border-color: #fcb322;
  }
  &.disabled {
    cursor: not-allowed;
  }
}
.pay-type + .pay-type {
  margin-top: 30px;
}
</style>
