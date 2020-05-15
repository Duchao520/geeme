<template>
  <div class="activity-red-packet-main">
    <div class="arp-radio-line">
      <div class="left-btns">
        <el-radio-group v-model="activity">
          <el-radio-button label="history">派发记录</el-radio-button>
          <el-radio-button label="modelList">红包模板</el-radio-button>
        </el-radio-group>
        <el-button class="normal_red_btn" @click="handleCreateModel" v-if="showAddTem">新增红包模板</el-button>
        <el-button v-else class="normal_red_btn" @click="toSendRedPacket(1)">新人红包</el-button>
      </div>
      <div class="search-box">
        <g-search ref="search" :placeholder="'搜索红包名称'" v-on:search="handleSearch"></g-search>
      </div>
    </div>
    <component class="bottom-component" :packetName="name" :is="activity"></component>
  </div>
</template>
<script>
import "@/assets/css/tab.scss";
import history from "./components/history";
import modelList from "./components/modelList";
export default {
  name: "activity-red-packet",
  data() {
    return {
      activity: "history",
      name: ""
    };
  },
  created() {
    if (this.$route.params.isTem) {
      this.activity = "modelList";
    }
  },
  methods: {
    handleSearch(key) {
      this.name = key;
    },
    handleCreateModel() {
      this.$router.push(
        "/brand-inner/market/market-list/create-red-packet-model"
      );
    },
    // 派发红包
    toSendRedPacket(type) {
      this.$router.push({
        path: "/brand-inner/market/market-list/send-red-packet",
        query: {
          type
        }
      });
    }
  },
  computed: {
    showAddTem() {
      return this.activity === "modelList";
    }
  },
  watch: {
    activity: {
      handler: function(v, o) {
        this.name = "";
        this.$refs["search"].resetKeyWord();
      }
    }
  },
  components: {
    history,
    modelList
  }
};
</script>
<style lang='scss' scoped>
.activity-red-packet-main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  .arp-radio-line {
    height: 35px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    /deep/ .el-radio-button {
      .el-radio-button__inner {
        padding: 9.5px 20px;
        &:hover {
          color: #58c9f3;
        }
      }
      &.is-active {
        .el-radio-button__inner {
          padding: 9.5px 20px;
          background: #58c9f3;
          border-color: #58c9f3;
          color: #fff;
        }
      }
    }
    .normal_red_btn {
      padding: 9.5px 20px;
      margin-left: 20px;
    }
  }
  .bottom-component {
    flex: 1;
  }
}
</style>
