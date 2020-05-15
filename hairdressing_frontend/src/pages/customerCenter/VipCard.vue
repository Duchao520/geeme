<template>
  <div class="pages-main-box scrollbar">
    <div class="pages-edit-container">
      <el-row type="flex" justify="center" class="v-c-wrap" v-loading="pageLoading">
        <el-row type="flex" align="middle" class="v-c-wrap__cantainer">
          <template v-for="(item, index) in cardTypesData">
            <div :key="index" v-if="item.length" class="vcard-wrap">
              <table-card
                :tableType="index"
                :hasCards="hasCards"
                :tableData="item"
                class="vcard-wrap__main"
                @changeStatus="handleSubStatusChange"
                @init="init"
              />
            </div>
          </template>
          <div class="no-info" v-if="!hasCards">
            <img :src="require('@/assets/img/bg_default_goods.png')" />
            <p>该客户暂无会员卡哦～</p>
          </div>
        </el-row>
      </el-row>
    </div>
    <g-dialog-with-slot
      :color="'#FF6D61'"
      :icon="'icon_popup_question'"
      :title="'确定要禁用该会员卡吗？'"
      :dialogVisible="dialogVisible"
      @resolve="startApi"
      @close="dialogVisible=false"
    >
      <div>禁用后，该客户将不能使用该会员卡。</div>
    </g-dialog-with-slot>
  </div>
</template>
<script>
// 这是客户档案的会员卡
import tableCard from "@/components/customerCenter/CustomerTable.vue";
import * as axios from "@/util/axios";
import { mapActions, mapState } from "vuex";
import { isArray } from "util";
export default {
  name: "vipcard",
  data() {
    return {
      cardTypesData: [[], [], [], [], []], // ...数据处理下,增加一个礼品卡模块
      hasCards: true, // 是否拥有
      pageLoading: false,
      dialogVisible: false,
      currentCard: {}
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      let data = {};
      if (this.currentEntry === "shop") {
        data = {
          brandId: this.currentInfo.brandId,
          // customerId: this.queryParams.beautyRecordId,
          customerId: this.$route.params.id * 1,
          storeId: this.currentInfo.shopId
        };
      } else {
        // 总部 500
        data = {
          brandId: this.currentInfo.brandId,
          // customerId: this.queryParams.beautyRecordId
          brandCustomerId: this.$route.params.id * 1,
          customerId: this.$route.params.id * 1
        };
      }
      this.pageLoading = true;
      this.cardTypesData = [[], [], [], [], []];
      axios.post("/getBrandCustomerCardByStoreCustomerId", data).then(res => {
        this.pageLoading = false;
        this.hasCards =
          Array.isArray(res.listCustomerCardDetail) &&
          !!res.listCustomerCardDetail.length;
        this.hasCards &&
          res.listCustomerCardDetail.forEach(card => {
            if (card.giftCard) {
              this.cardTypesData[4].push(card);
            }
            this.cardTypesData[card.cardType].push(card);
          });
      });
    },
    // 子组件切换卡状态
    handleSubStatusChange(card) {
      this.currentCard = card;
      if (card.status === 0 || card.status === 3) {
        this.dialogVisible = true;
      } else {
        this.startApi();
      }
    },
    async startApi() {
      let card = this.currentCard;
      // 0 正常 1禁用 2删除 3未开始
      let url =
        card.status == 1 || card.status == 2
          ? "/recoverMembershipCard"
          : "/disableMembershipCard";
      let res = await axios.post(url, { consumerCardIds: [card.id] });
      this.dialogVisible = false;
      this.init();
    }
  },
  computed: {
    ...mapState({
      currentEntry: state => state.authRouter.currentEntry,
      currentInfo: state => state.manage.currentInfo
      // queryParams: state => state.queryParams
    })
  },
  components: { tableCard }
};
</script>
<style lang="scss" scoped>
@import "@/assets/css/scrollbar.scss";
.pages-main-box {
  width: calc(100vw - 40px);
  height: calc(100vh - 105px);
  padding: 0 20px 20px;
  margin-top: 85px;
  overflow-y: auto;
  box-sizing: content-box;
  .pages-edit-container {
    min-height: calc(100vh - 105px);
  }
}
.v-c-wrap {
  // width: 100%;
  max-width: 1440px;
  min-height: 100%;
  box-sizing: border-box;
  margin: 0 auto;
  background: #fff;
  border-radius: 6px;
  &__cantainer {
    width: 100%;
    max-width: 1440px;
    background: #fff;
    min-height: calc(100vh - 165px);
    box-sizing: content-box;
    border-radius: 8px;
    flex-flow: column nowrap;
    padding: 26px 0;
  }
  .vcard-wrap:first-child {
    margin-top: 0;
  }
  .vcard-wrap {
    width: 92%;
    margin-top: 20px;
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 8px 0px rgba(174, 184, 229, 0.3);
    border-radius: 8px;
    padding: 5px 25px 15px 25px;
  }
  .no-info {
    img {
      width: 276px;
      margin-top: 200px;
    }
    p {
      color: rgba(153, 153, 153, 1);
      font-size: 16px;
      text-align: center;
      margin-top: 40px;
    }
  }
}
</style>
