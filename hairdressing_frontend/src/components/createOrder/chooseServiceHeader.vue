<template>
  <section class="order-header-con">
    <div class="header-content">
      <div class="header-left">
        <p class="drop-title">{{title}}</p>
        <div class="back" @click="$router.go(-1)">上一步</div>
      </div>
      <div class="header-middle">
        <tab-pane v-on="$listeners" :list="list"></tab-pane>
      </div>
    </div>
  </section>
</template>
<script>
  import TabPane from "./chooseServiceTabpane";

  export default {
    components: {TabPane},
    props: {
      list: Array
    },
    data() {
      return {
        selectTypeList: [
          {
            name: "选择服务项目",
            code: "service",
            mark: "goods"
          },
          {
            name: "选择产品",
            code: "product",
            mark: "goods"
          },
          {
            name: "选择卡项",
            code: "card",
            mark: "card"
          },
          {
            name: "续卡充值",
            code: "cardAdd",
            mark: "card"
          },
          {
            name: "自由卡",
            code: "freeCard",
            mark: "card",
          }
        ],
      };
    },
    computed: {
      title() {
        let type = this.selectTypeList.filter(item => {
          return item.code === this.openGoodsType;
        })[0];
        return type && type.name
      },
      billInfo() {
        return this.$store.state.bill;
      },
      openGoodsType() {
        return this.billInfo.currentChooseTypeAndSortOneId.sortGoodsType;
      }
    },
  };
</script>
<style lang="scss">
  .order-header-con {
    width: 100%;
    height: 65px;
    background: #ffffff;
    position: fixed;
    top: 0;
    box-shadow: 0px 3px 16px 0px rgba(85, 85, 85, 0.1);

    .header-content {
      display: flex;
      padding-left: 23px;

      .header-left {
        padding-top: 10px;

        .drop-title {
          font-size: 18px;
          color: #333333;
          font-weight: 600;

          .el-icon-arrow-down {
            margin-left: 5px;
          }
        }

        .back {
          position: relative;
          padding-left: 15px;
          font-size: 12px;
          color: #959595;
          cursor: pointer;
          white-space: nowrap;

          &:before {
            content: "";
            width: 7px;
            height: 7px;
            position: absolute;
            left: 3px;
            top: 4px;
            bottom: 0;
            transform: rotate(-45deg);
            border-left: 2px solid #959595;
            border-top: 2px solid #959595;
            border-bottom-left-radius: 2px;
            border-bottom-right-radius: 2px;
          }
        }
      }

      .header-middle {
        height: 65px;
        line-height: 65px;
        margin-left: 40px;
      }

    }
  }

</style>
