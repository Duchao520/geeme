<template>
  <div class="vip-details">
    <!-- header -->
    <div class="vip-detail-header">
      <div class="header-content">
        <div class="header-title">卡项详情</div>
        <div class="back" @click="back">
          <i class="icon iconfont icon-icon_back"></i>关闭
        </div>
      </div>
    </div>

    <!-- nav -->
    <div class="detail-card">
      <!-- 标签 -->
      <div class="nav">
        <el-tabs type="card" v-model="currentTag" @tab-click="handleTagChange">
          <el-tab-pane
            v-for="item in selectStatus"
            :key="item.code"
            :label="item.type"
            :name="item.code"
          ></el-tab-pane>
        </el-tabs>
      </div>

      <div class="detail-content">
        <!-- info -->
        <card-info v-show="currentTag == 'current'" :id="cardKindId" :cacheMaxId="cacheMaxId" @refreshTabs="handleSubRefreshed"></card-info>
        <!-- history -->
        <card-history :id="cardKindId" @change="changeCurrentId" v-show="currentTag == 'history'"></card-history>
      </div>
    </div>

    <!-- record -->
    <sales-record class="footer" :id="cardKindId" v-show="currentTag == 'current'"></sales-record>
  </div>
</template>

<script>
import cardInfo from "./component/vipCardInfo";
import salesRecord from "./component/salesRecord";
import cardHistory from "./component/cardHistory";
export default {
  components: {
    "card-info": cardInfo,
    "sales-record": salesRecord,
    "card-history": cardHistory
  },
  data() {
    return {
      // cardKindId: this.$store.state.vipCard.addNewVipCard.cardKindId,
      cardKindId: this.$route.query.id * 1,
      cacheMaxId: 0,
      currentTag: "current",
      selectStatus: [
        { type: "最新卡项", code: "current" },
        { type: "历史卡项列表", code: "history" }
      ]
    };
  },
  mounted() {},
  methods: {
    handleTagChange(data) {
      //console.log(data.name);
    },
    changeCurrentId(data) {
      console.log(data)
      this.cardKindId = data.id;
      this.cacheMaxId = data.cacheMaxId;
      this.currentTag = "current";
      if (data.id === data.cacheMaxId) {
        this.selectStatus = [
          { type: "最新卡项", code: "current" },
          { type: "历史卡项列表", code: "history" }
        ]
      } else {
        this.selectStatus = [
          { type: "历史卡项", code: "current" },
          { type: "历史卡项列表", code: "history" }
        ]
      }
    },
    handleSubRefreshed(id) {
      this.cardKindId = id
      this.selectStatus = [
        { type: "最新卡项", code: "current" },
        { type: "历史卡项列表", code: "history" }
      ]
    },
    back() {
      // this.$router.go(-1);
      window.close()
    }
  }
};
</script>

<style lang="scss" scoped>
.vip-details {
  background: #f1f2f7;
  .vip-detail-header {
    position: fixed;
    z-index: 10;
    top: 0;
    width: 100%;
    height: 65px;
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 8px 0px rgba(174, 184, 229, 0.3);
    padding: 10px 0 0 0;
    box-sizing: border-box;
    .header-content {
      width: calc(100% - 40px);
      margin: 0 auto;
      .header-title {
        font-size: 18px;
        color: #000;
        font-weight: 600;
      }
      .back {
        line-height: 29px;
        font-size: 13px;
        color: #959595;
        cursor: pointer;
        i {
          font-size: 13px;
        }
      }
    }
  }
  .detail-card {
    width: calc(100% - 40px);
    margin: 20px auto;
    margin-top: 90px;
    background: #ffffff;
    left: 19px;
    border-radius: 8px 8px 0 0;
    box-shadow: 0px -1px 4px 0px rgba(174, 184, 229, 0.3);
    .nav {
      /deep/ .el-tabs--card {
        background: rgba(174, 184, 229, 0.3);
        border-radius: 8px 8px 0 0;
        overflow: hidden;
        height: 32px;
        .el-tabs__nav {
          border: 0;
        }
        .el-tabs__header {
          border: 0;
        }
        .el-tabs__item {
          border: 0;
          height: 32px;
          line-height: 32px;
          box-sizing: border-box;
        }
        .el-tabs__header .el-tabs__item.is-active {
          background: #fff;
          border-radius: 8px 8px 0 0;
          position: relative;
          &::before {
            content: "";
            display: block;
            position: absolute;
            width: 8px;
            height: 8px;
            background: url("../../assets/images/bgImages/icon_tab_left.png");
            background-size: 100%;
            left: -8px;
            bottom: 0;
          }
          &::after {
            content: "";
            display: block;
            position: absolute;
            width: 8px;
            height: 8px;
            background: url("../../assets/images/bgImages/icon_tab_right.png");
            background-size: 100%;
            right: -8px;
            bottom: 0;
          }
        }
      }
    }
  }
  .footer {
    width: calc(100% - 40px);
    margin: 20px auto;
  }

  @media screen and (min-width: 1440px) {
    .vip-detail-header .header-content {
      width: 1400px;
    }
    .detail-card {
      width: 1400px;
    }
    .footer {
      width: 1400px;
    }
  }
}
</style>
