<template>
  <div class="edit-vie-card">
    <card-header :title="title"></card-header>
    <div class="main-con">
      <keep-alive>
        <component :is="active" @vipCardStep="setProcess" :firstUseFlag="firstUseFlag"/>
      </keep-alive>
    </div>
  </div>
</template>
<script>
import cardHeader from "@/pages/goodsManagement/component/cardModuleHeader"
import writeCardInfo from "./WriteCardInfo"
import selectCardCover from "@/components/goodsManagement/addNewVipCardModule/SelectCardCover"
import { mapActions, mapState } from "vuex"
export default {
  components: {
    cardHeader,
    writeCardInfo,
    selectCardCover
  },
  data() {
    return {
      // 鉴别是否为首次使用计时卡
      firstUseFlag: true,
      active: 'write-card-info'
    };
  },
  mounted(){
    console.log(this.firstUseFlag)
  },
  computed: {
    title() {
      if (this.active === 'write-card-info') {
        return `编辑会员卡`;
      } else {
        return `修改会员卡封面`;
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
.edit-vie-card {
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
