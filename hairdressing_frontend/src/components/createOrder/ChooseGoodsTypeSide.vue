<template>
  <div class="choose-goods-type-side">
    <div class="type-item">
      <el-button
        class="type-item"
        :class="{active:openGoodsType===item.code}"
        v-for="(item, index) in availableTypeList"
        :disabled="!billInfo.protectedGoodsType?false:(item.mark!==billInfo.protectedGoodsType)"
        @click="chooseServiceType(item)"
        :key="index"
      >
        <i class="icon iconfont" :class="['icon-'+item.icon]"></i>
        <p class="name">{{item.name}}</p>
      </el-button>
    </div>
  </div>
</template>
<script>
  import {mapState, mapActions} from "vuex";

  export default {
    data() {
      return {
        availableTypeList: [
          {
            name: "服务",
            code: "service",
            mark: "goods",
            icon: "icon_choose_service"
          },
          {
            name: "产品",
            code: "product",
            mark: "goods",
            icon: "icon_choose_produce"
          },
          {
            name: "开卡",
            code: "card",
            mark: "card",
            icon: "icon_choose_card"
          },
          {
            name: "续卡",
            code: "cardAdd",
            mark: "card",
            icon: "icon_choose_card2"
          },
          {
            name: "自由卡",
            code: "freeCard",
            mark: "card",
            icon:"icon_choose_card1"
          }
        ],
        inited: false
      }
    },
    computed: {
      ...mapState({
        billInfo: state => state.bill
      }),
      openGoodsType() {
        return this.billInfo.currentChooseTypeAndSortOneId.sortGoodsType;
      }
    },
    methods: {
      ...mapActions(["setCurrentChooseType"]),
      chooseServiceType(data) {
        if (data.code !== this.openGoodsType || !this.inited) {
          this.setCurrentChooseType(data.code);
          this.$emit("choose-goods-type-changed", data);
        }
        this.inited = true
      },
      init(type) {
        type = type || this.openGoodsType;
        let typeInfo = this.availableTypeList.find(item => item.code === type);
        this.chooseServiceType(typeInfo);
      }
    }
  }
</script>
<style lang="scss" scoped>
  .choose-goods-type-side {
    position: absolute;
    top: 0;
    left: 0;
    width: 60px;
    background: #ffffff;
    height: 100%;
    // z-index: 1;

    .type-item.el-button {
      display: block;
      height: 75px;
      width: 100%;
      border: none;
      margin: 0;
      padding: 0;
      border-bottom: 1px solid #DCDFE6;
      color: #A3B2B9;

      .icon {
        line-height: 20px;
        font-size: 20px;
      }

      p {
        line-height: 20px;
        font-size: 12px;
        color: #758C97;
        margin-top: 8px;
      }
    }

    .type-item.el-button.active {
      .icon, p {
        color: #F52D56;
      }
    }
  }
</style>
