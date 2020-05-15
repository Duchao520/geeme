<template>
  <div class="add-new-vip-card">
    <!-- <seed-header :title="title" :hasTabs="false"></seed-header> -->
    <card-header :title="title"></card-header>
    <div class="main-con">
      <order-steps class="step" :steps="process"></order-steps>
      <!-- <div class="router-view">
        <router-view></router-view>
      </div> -->
      <keep-alive>
        <component :is="active" @vipCardStep="setProcess" :firstUseFlag="firstUseFlag"/>
      </keep-alive>
    </div>
  </div>
</template>
<script>
/* import SeedHeader from "@/components/common/SeedHeader"; */
import cardHeader from "@/pages/goodsManagement/component/cardModuleHeader"

import selectCard from "@/components/goodsManagement/addNewVipCardModule/selectCard"
import writeCardInfo from "./WriteCardInfo"
import selectCardCover from "@/components/goodsManagement/addNewVipCardModule/SelectCardCover"
import { mapActions, mapState } from "vuex"
export default {
  components: {
    /* "seed-header": SeedHeader, */
    selectCard,
    cardHeader,
    writeCardInfo,
    selectCardCover
  },
  data() {
    return {
      active: 'select-card',
      // 首次使用功能标识
      firstUseFlag:Boolean
    };
  },
  computed: {
    /* 根据路由变化改变process: 方法可以精简但管用 */
    process() {
      return [
        {
          name: "选择卡类型",
          completed: true,
          icon: "icon-icon_order_success"
        },
        {
          name: "编辑卡详情",
          completed: this.active === 'write-card-info' || this.active === 'select-card-cover',
          icon: "icon-icon_order_success"
        },
        {
          name: "设置卡封面",
          completed: this.active === 'select-card-cover',
          icon: "icon-icon_order_success"
        }
      ]
    },
    title() {
      if (this.active === 'write-card-info' || this.active === 'select-card-cover') {
        let label = this.$store.state.vipCard.addNewVipCard.cardType.label;
        return `新增会员卡—${label}`;
      } else {
        return `新增会员卡`;
      }
    },
  },
  watch: {},
  methods: {
    setProcess(data) {
      this.active = data.data
      this.firstUseFlag = data.firstUseFlag
    }
  }
};
</script>
<style lang="scss" scoped>
.add-new-vip-card {
  box-sizing: border-box;
  padding-top: 75px;
  .main-con {
    box-sizing: border-box;
    background: #ffffff;
    box-shadow: 0px -1px 4px 0px rgba(174, 184, 229, 0.3);
    overflow-y: auto;
    overflow-x: hidden;
    padding: 20px;
    height: calc(100vh - 95px);
    max-width: 1400px;
    margin: 0 auto;
    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: rgba(0, 0, 0, 0.2);
    }
    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 0;
      background: rgba(0, 0, 0, 0.1);
    }
    .step {
      width: 100%;
      box-sizing: border-box;
      padding: 0 120px;
      border: 1px solid #f0f1f4;
      border-radius: 4px;
      padding-bottom: 20px;
      flex: 0;
      min-height: 100px;
      /deep/ .title {
        transform: translateY(55px);
      }
    }
  }
}
</style>
