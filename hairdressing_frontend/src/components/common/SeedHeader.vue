<template lang="pug">
  el-row.seed_eader-wrap(
    type="flex",
    justify="center"
  )
    el-row.seed-header(
      type="flex"
    )
      .header-left
        .title {{ title }}
        .back(
          @click="close"
        ) 关闭
      .header-right(
        v-if="hasTabs"
      )
        g-tabs(
          :tabname="'ROUTER_SUB_TABS'"
        )

</template>
<script>
import { mapActions, mapState } from "vuex";
export default {
  props: {
    title: String,
    hasTabs: {
      type: Boolean,
      default: true
    },
    origin: String
  },
  methods: {
    close() {
      // 新标签模式...
      // window.close()
      // return

      if (this.origin === "editProduct") {
        this.$router.go(-1);
        return;
      }
      if (this.origin === "otherTags") {
        window.close();
        return;
      }
      if (this.title == "员工档案") {
        this.$router.replace(`/${this.currentEntry}-inner/staff/staff-list`);
      } else if (this.title == "新增推广商品") {
        // 保留导航信息
        this.$router.push({
          name: "/shop-inner/market/market-list/promotion-commission",
          params: { tab: "PromotionGoods" }
        });
      } 
      else if (this.title.indexOf("红包模板") !== -1) {
        this.$router.push({
          name: "/brand-inner/market/market-list/activity-red-packet",
          params: {
            isTem: true
          }
        });
      } 
      /* else if (this.title == '美丽档案') {
        this.$router.replace(`/${this.currentEntry}-inner/customer/customer-list`)
      }*/ else {
        this.$router.go(-1);
      }
    }
  },
  computed: {
    ...mapState({
      currentEntry: state => state.authRouter.currentEntry
    })
  }
};
</script>
<style lang="scss">
.seed_eader-wrap {
  width: 100%;
  background: #fff;
  box-shadow: 0px 3px 16px 0px rgba(85, 85, 85, 0.1);
  position: fixed;
  top: 0;
  z-index: 999;
  padding: 0 20px;
  height: 65px;
}
.seed-header {
  max-width: 1440px;
  flex: auto;
  height: 100%;
  .header-left {
    padding-top: 10px;
    .title {
      font-size: 18px;
      color: #000;
      font-weight: 600;
    }
    .back {
      position: relative;
      padding-left: 15px;
      font-size: 14px;
      color: #959595;
      width: 100px;
      cursor: pointer;
      &:before {
        content: "";
        width: 7px;
        height: 7px;
        position: absolute;
        left: 3px;
        top: 6px;
        bottom: 0;
        transform: rotate(-45deg);
        border-left: 2px solid #959595;
        border-top: 2px solid #959595;
        border-bottom-left-radius: 2px;
        border-bottom-right-radius: 2px;
      }
    }
  }
  .header-right {
    position: absolute;
    top: 0;
    left: 100px;
    height: 65px;
    line-height: 65px;
    &.tab-left {
    }
  }
}
</style>
