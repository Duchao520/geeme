<template>
  <div class="gift-card-main" v-loading="loading">
    <div class="search-line">
      <div class="table-title">
        <el-radio-group v-model="componentId">
          <!-- 隐藏的模块暂不开发 -->
          <el-radio-button border class="table-btns" label="giftCard">礼品卡</el-radio-button>
          <el-radio-button border class="table-btns" label="getTheRecord">领取记录</el-radio-button>
          <el-radio-button border class="table-btns" label="usageRecord" v-if="false">使用记录</el-radio-button>
          <el-radio-button border class="table-btns" label="newClientList" v-if="false">新客列表</el-radio-button>
          <el-radio-button border class="table-btns" label="resultAnalyze" v-if="false">效果分析</el-radio-button>
          <el-radio-button border class="table-btns" label="awardGrant">奖励发放</el-radio-button>
        </el-radio-group>
        <el-button
          @click="createGiftCard"
          class="normal_red_btn"
          v-if="componentId === 'giftCard'"
        >新增礼品卡</el-button>
      </div>
      <!-- <div class="search-box"> -->
      <!-- 礼品卡搜索匹配 -->
      <input-search
        v-if="componentId === 'giftCard'"
        :placeholder="'搜索活动/卡项名称'"
        width="auto"
        v-model="giftForm.activityName"
        @search="handleSearchGiftCard"
      />
      <!-- 领取记录搜索匹配 -->
      <input-search
        v-if="componentId === 'getTheRecord'"
        :placeholder="'搜索活动/卡项名称'"
        width="300px"
        v-model="giftForm.keyword"
        @search="handleSearchGetTheRecord"
      />
      <!-- 奖励发放搜索匹配 -->
      <input-search
        v-if="componentId === 'awardGrant'"
        :placeholder="'搜索卡项名称'"
        width="300px"
        v-model="giftForm.keyword"
        @search="handleSearchAwardGrant"
      />
      <!-- </div> -->
    </div>

    <div class="filters-line">
      <div class="filters-search">
        <el-form :model="giftForm" label-width="85px" class="query-form">
          <el-form-item :label="componentId === 'giftCard' ? '创建时间 :' : componentId === 'getTheRecord' ? recordText : '领取时间 :'">
            <el-date-picker
              v-model="timeRange"
              type="datetimerange"
              clearable
              unlink-panels
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="创建人: " v-if="componentId === 'giftCard'">
            <el-select v-model="giftForm.userId" placeholder="请选择" clearable>
              <el-option
                v-for="item in createPeople"
                :key="item.userId"
                :label="item.username"
                :value="item.userId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              style="margin-left: -60px;"
              id="retrieval"
              @click="retrieval"
            >检索</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 动态表格组件-->
    <component :is="componentId" ref="componentRef" :createPeople="createPeople" :giftForm="giftForm" @changeTimeValueText="changeTimeValueText"></component>
  </div>
</template>

<script>
import * as axios from "@/util/axios";
import { mapActions, mapState } from "vuex";
import giftCard from "./components/giftCard";
import getTheRecord from "./components/getTheRecord";
import usageRecord from "./components/usageRecord";
import newClientList from "./components/newClientList";
import resultAnalyze from "./components/resultAnalyze";
import awardGrant from "./components/awardGrant";
export default {
  components: {
    giftCard,
    getTheRecord,
    usageRecord,
    newClientList,
    resultAnalyze,
    awardGrant
  },
  data() {
    return {
      componentId: "giftCard",
      timeRange: [],
      recordText: '派发时间 :',
      // 活动列表参数
      giftForm: {
        activityName: "",
        end: '',
        start: '',
        userId: null,
        keyword: '',
        storeId: null
      },
      createPeople: [],
      loading:false
    };
  },
  created() {
    console.log(this.$store.state.giftCard.menuStatus)
    // 实现页面刷新保留顶部导航信息
    this.componentId =
      this.$route.params.tab ||
      this.$store.state.giftCard.menuStatus ||
      "giftCard";
    this.giftForm.storeId = this.currentInfo.shopId
    this.getCreatorsInfo()
  },
  methods: {
    ...mapActions(["saveGiftCardMenu"]),
    // 获取礼品卡创建人信息
    async getCreatorsInfo() {
      this.loading = true
      try {
        const res  = await axios.post('/getGiftCardActivityCreators', {
          brandId: this.currentInfo.brandId,
        })
        this.createPeople = res.userInfoSet
      } finally {
        this.loading = false
      }
    },
    handleSearchGiftCard(val) {
      // 调用子组件事件
      this.$refs.componentRef.handleCurrentChange(1)
    },
    handleSearchGetTheRecord(val) {
      // 调用子组件事件
      this.$refs.componentRef.handleCurrentChange(1)
    },
    handleSearchAwardGrant(val) {
      // 调用子组件事件 // 不同子组件中的事件名相同。。。 所以这里三个方法还是做了区分
      this.$refs.componentRef.handleCurrentChange(1)
    },
    // 新增礼品卡活动
    createGiftCard() {
      this.$router.push("/shop-inner/gift-vip-card-add");
    },
    // 检索
    retrieval() {
      this.giftForm.userId = this.giftForm.userId || null
      this.$refs.componentRef.handleCurrentChange(1)
      // switch (this.componentId) {
      //   case 'giftCard':
      //     this.$refs.componentRef.getGiftCardActivityList()
      //     break;
      //   case 'getTheRecord':
      //     this.$refs.componentRef.getTheRecord()
      //     break;
      //   case 'awardGrant':
      //     this.$refs.componentRef.getTheRecord()
      //     break;
      //   default:
      //     break;
      // }
    },
    changeTimeValueText(val) {
      this.recordText = val == '1' ? '派发时间 :' : '分享时间 :'
    }
  },
  computed: {
    currentInfo() {
      return this.$store.state.manage.currentInfo;
    }
  },
  watch: {
    'timeRange'(val) {
      val = val || []
      if (val.length) {
        this.giftForm.start = val[0]
        this.giftForm.end = val[1]
      } else {
        this.giftForm.start = ''
        this.giftForm.end = ''
      }
    },
    'componentId'(val) {
      // 清空搜索框的值
      this.giftForm.keyword = "";
      this.giftForm.activityName = "";
      this.timeRange = null
      // 将导航信息存入vuex
      this.saveGiftCardMenu(val);
    }
  },
  destroyed() {
    // 离开页面时，将数据重置
    this.saveGiftCardMenu("giftCard");
  },
};
</script>

<style lang="scss" scoped>
.gift-card-main {
  width: calc(100vw - 221px);
  min-height: calc(100vh - 75px);
  display: flex;
  align-content: center;
  flex-direction: column;
}

.search-line {
  height: 35px;
  width: 100%;
  display: flex;
  // 主轴对齐
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  .search-box {
    width: 280px;
    display: flex;
    // 主轴对齐
    justify-content: flex-end;
    // 交叉轴对齐
    align-items: center;
  }
  .table-title {
    display: flex;
    justify-content: center;
    align-items: center;
    .normal_red_btn {
      padding: 9.5px 16px;
      margin-left: 20px;
    }
  }
}

.filters-line {
  // margin-top: 15px;
  height: 76px;
  width: 100%;
  background: #fff;
  box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  .filters-search {
    .query-form {
      display: flex;
      align-items: center;
      /deep/ .el-form-item {
        margin-bottom: 0;
      }
    }
  }
}
</style>