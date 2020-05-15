<template>
  <div class="dynamicWork-root">
    <div class="dynamicWork-root__top">
      <el-radio-group class="btn-group" v-model="worksType">
        <el-radio-button
          v-for="(item,index) in [{name:'动态列表',value:'WorkStatus'},{name:'排行榜',value:'StaffRanking'}]"
          :key="index"
          :label="item.value"
        >{{item.name}}</el-radio-button>
      </el-radio-group>
      <input-search
        placeholder="搜索发布人/动态内容"
        @search="search"
        width="280px"
        v-if="worksType==='WorkStatus'"
        :value="keyword"
      ></input-search>
    </div>
    <div class="search">
      <search-header
        @changeTime="limitTime"
        :worksType="worksType"
        :currentEntry="currentEntry"
        @changeTableType="changeTableType"
        @changeTab="changeTab"
        ref="searchHeader"
        @hasTags="hasTags"
      ></search-header>
    </div>
    <div class="dynamicWork-root__content">
      <div class="user-defined-tab container_normal">
        <div class="staff_list_container" v-if="tableComponentId=='WorkStatus'">
          <el-tabs type="card" @tab-click="getWorkList()" v-model="activeName">
            <el-tab-pane
              v-for="(item, index) in selectStatus"
              :key="index"
              :label="item.value"
              :name="item.code"
            ></el-tab-pane>
          </el-tabs>
        </div>
        <el-row
          type="flex"
          justify="center"
          align="middle"
          class="table-con default"
          v-if="noData&&tableData.length===0"
        >
          <search-default style="margin:11% 0" @clear-back="clearBack"></search-default>
        </el-row>
        <div class="table" v-show="!noData || tableData.length>0" v-loading="tableLoading">
          <component
            :chageVal="chageVal"
            @settotal="setTotal"
            :is="tableComponentId"
            :ref="tableComponentId"
            :activeName="activeName"
            :params="computed_params"
            @sendData="getChildrenData"
            @resetCheckAll="changeCheckAll"
            :isTall="isTall"
          ></component>
        </div>
        <div class="bottom-page">
          <div class="buttons" v-if="tableComponentId==='WorkStatus'">
            <el-checkbox
              v-model="allChecked"
              style="margin:0 15px 0 12px;"
              @change="changeAllChecked"
            >全选</el-checkbox>
            <g-button
              :name="'恢复'"
              :type="'greenFill'"
              :icon="'icon_operate_recover'"
              v-if="activeName === 'DELETED'"
              class="delete-btn"
              @click="delWorks(false)"
            ></g-button>
            <el-row type="flex" v-else>
              <div v-if="currentEntry==='brand'">
                <!-- <g-button
                  :name="'设为热门'"
                  type="blueFill"
                  :icon="''"
                  @click="setHot(true)"
                ></g-button>-->
                <el-button
                  class="normal_blue_btn"
                  style="padding:8.5px 9px"
                  @click="setHot(true)"
                  size="small"
                >设为热门</el-button>
                <!-- <g-button
                  :name="'取消热门'"
                  type="greyFill"
                  :icon="''"
                  @click="setHot(false)"
                ></g-button>-->
                <el-button
                  class="normal_silvery_gray_btn"
                  style="padding:8.5px 9px"
                  @click="setHot(false)"
                  size="small"
                >取消热门</el-button>
              </div>
              <g-button
                :name="'删除'"
                type="cancel"
                :icon="'icon_operate_delete'"
                @click="delWorks(true,'many')"
                class="delete-btn"
              ></g-button>
            </el-row>
          </div>
          <el-pagination
            class="page"
            @current-change="handleCurrentChange"
            :current-page="pageParam.currentPage"
            :page-size="pageParam.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="pageParam.totalCount"
            id="pagination"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SearchHeader from "@/components/staff/dynamicWork/SearchHeader"; /* 搜索头 */
import WorkRanking from "@/components/staff/dynamicWork/WorkRanking"; /* 作品榜单 */
import StaffRanking from "@/components/staff/dynamicWork/StaffRanking"; /* 员工榜单 */
import WorkStatus from "@/components/staff/dynamicWork/WorkStatus"; /* 员工表格 */
import * as utils from "@/assets/js/utils";
import { mapState } from "vuex";
import util from "@/util/base.js";
import "@/assets/css/tab.scss";
import { setTimeout } from "timers";
export default {
  components: {
    SearchHeader,
    WorkRanking,
    WorkStatus,
    StaffRanking
  },
  data() {
    return {
      searchComponentId: "",
      tableComponentId: "WorkStatus" /* 动态组件所加载的 */,
      worksType: "WorkStatus" /* 本业内切换 */,
      rankingType: "StaffRanking" /* 由搜索框推送过来的 */,
      keyword: "",
      pageParam: {
        currentPage: 1,
        pageSize: 10,
        totalCount: 0
      },
      allChecked: false,
      params: {},
      activeName: "ALL",
      noData: false,
      tableData: [],
      tableLoading: false,
      chageVal: false,
      isTall: false
    };
  },
  mounted() {
   
  },
  watch: {
    worksType(worksType) {
      this.tableComponentId = worksType;
      // worksType === "WorkStatus" ? "WorkStatus" : this.rankingType;
    }
  },
  computed: {
    ...mapState({
      currentEntry: state => state.authRouter.currentEntry
    }),
    computed_params() {
      let params = this.params;
      let pageParam = this.pageParam;
      let shopId,
        brandId = null;
      this.chageVal = !this.chageVal;
      if (this.currentEntry === "shop") {
        shopId = this.currentInfo.shopId;
        brandId = this.currentInfo.brandId;
      } else {
        brandId = this.currentInfo.brandId;
      }
      let searchKeyword;
      if (this.worksType === "WorkStatus") {
        searchKeyword = this.keyword;
      } else {
        searchKeyword = null;
      }
      let obj = {
        brandId: brandId,
        endDate: params.end
          ? params.end
          : utils.formatDateTimeFromYearToSecond(new Date()),
        pageNum: pageParam.currentPage,
        pageSize: pageParam.pageSize,
        searchKeyword: this.worksType === "WorkStatus" ? this.keyword : null,
        startDate: params.begin ? params.begin : "",
        storeId: shopId,
        tabCondition: this.activeName,
        tagId: params.scope ? params.scope : -2
      };

      return obj;
    },
    currentInfo() {
      return this.$store.state.manage.currentInfo;
    },
    selectStatus() {
      return [
        //tab切换
        { code: "ALL", value: "全部" },
        { code: "HOT", value: "热门" },
        { code: "DELETED", value: "已删除" }
      ];
    }
  },
  methods: {
    limitTime(data) {
      this.keyword = "";
      this.params = data;
      this.tableLoading = true;
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs[this.tableComponentId].query(this.computed_params);
          this.tableLoading = false;
        }, 400);
      });
    },
    search(text) {
      this.keyword = text;
      this.pageParam.currentPage = 1;
      this.noData = true;
      this.$refs[this.tableComponentId].query(this.computed_params);
    },
    changeTableType(rankingType) {
      if (rankingType) {
        this.tableComponentId = rankingType;
        this.rankingType = rankingType;
      }
    },
    changeTab() {
      this.params = {
        end: "",
        begin: "",
        scope: -2
      };
    },
    handleCurrentChange(num) {
      this.pageParam.currentPage = num;
      this.tableLoading = true;
      setTimeout(() => {
        this.$refs[this.tableComponentId].query(this.computed_params);
        this.tableLoading = false;
      }, 460);
    },
    changeAllChecked(bool) {
      if (this.$refs.WorkStatus) {
        this.$refs.WorkStatus.checkAll(bool);
      }
    },
    setHot(bool) {
      if (this.$refs.WorkStatus) {
        this.$refs.WorkStatus.setStaffDynamicWorksIsHotByIds(bool);
      }
    },
    delWorks(bool) {
      this.$refs.WorkStatus.staffDynamicWorksStatusChangeByIds(bool);
    },
    setTotal(num) {
      this.pageParam.totalCount = num;
    },
    getWorkList() {
      this.keyword = "";
    },
    /** 从子组件获取data */
    getChildrenData(val) {
      this.tableData = [...val];
    },
    clearBack() {
      this.noData = false;
      this.keyword = "";
      setTimeout(() => {
        this.$refs[this.tableComponentId].query(this.computed_params);
      }, 200);
    },
    changeCheckAll(data) {
      this.allChecked = data;
    },
    hasTags() {
      this.isTall = true
    },
  }
};
</script>
<style lang="scss" scoped>
.dynamicWork-root {
  box-sizing: border-box;
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
  .table {
    // height: calc(100% - 70px);
  }
  &__top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    /deep/ .el-radio-button__inner {
      height: 35px;
      line-height: 35px;
      padding-top: 0;
      padding-bottom: 0;
      border: none;
    }
    /deep/ .el-radio-button.is-active {
      .el-radio-button__inner {
        background: #58c9f3;
        border: none;
      }
    }
  }
  .search {
    margin-top: 20px;
    box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
    border-radius: 8px;
  }
  .bottom-page {
    background: #ffffff;
    display: flex;
    box-sizing: border-box;
    justify-content: space-between;
    transform: translateY(15px);
    position: relative;
    .buttons {
      display: flex;
      align-items: center;
      /deep/ .delete-btn {
        margin-left: 10px;
      }
    }
    .page {
      position: absolute;
      right: 20px;
    }
  }
  .bottom-pagenation {
    background: #ffffff;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 15px 20px;
    border-radius: 8px;
    position: absolute;
    right: 0;
    .page {
      /deep/ .btn-prev,
      /deep/ .btn-next {
        width: 35px;
      }
    }
  }
}
.dynamicWork-root__content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.container_normal {
  flex: 1;
  // height: calc(100vh - 301px);
  border-radius: 8px;
}
.table-con {
  background: #fff;
  margin-top: 20px;
  width: 100%;
  //height: calc(100vh - 298px);
}
</style>
