<template>
  <div class="shop-group-buy-main">
    <div class="search-line">
      <el-button @click="changeRouter" class="normal_red_btn"
        >发布广告</el-button
      >
      <div class="search-box">
        <input-search
          :placeholder="'搜索广告主题'"
          width="auto"
          v-model="adParams.title"
          @search="handleSearch"
        />
      </div>
    </div>
    <div class="table-main">
      <div class="table-box">
        <div class="user-defined-tab">
          <el-tabs type="card" v-model="sendRecordStatus">
            <el-tab-pane
              v-for="item in sendRecords"
              :key="item.value"
              :name="item.value"
              :label="item.label"
            ></el-tab-pane>
          </el-tabs>
        </div>
        <el-table
          stripe
          :data="adData"
          height="calc(100vh - 263px)"
          @selection-change="handleSelectionChange"
          v-loading="loading"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="date" label="排序" width="80">
            <template slot-scope="{ row }">
              <number-input
                @blur="
                  val => {
                    orderNoChange(val, row);
                  }
                "
                v-model="row.orderby"
                class="input"
                placeholder="请输入排序"
                :min="0"
                :max="999"
              ></number-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="publishTime"
            show-overflow-tooltip
            label="发布时间"
          ></el-table-column>
          <el-table-column prop="title" show-overflow-tooltip label="广告主题">
          </el-table-column>
          <el-table-column prop="position" label="广告位置">
            <template slot-scope="{ row }">
              <p v-if="row.position === 1">品牌中心首页头部</p>
            </template>
          </el-table-column>
          <el-table-column prop="orderCount" label="广告图片">
            <template slot-scope="{ row }">
              <img
                style="display: block; height: 73px; width: 146px;"
                :src="formatPicImage(row.banner, 'style', 146, 'someone')"
                alt=""
              />
            </template>
          </el-table-column>
          <el-table-column prop="orderReceived" label="内页海报">
            <template slot-scope="{ row }">
              <img
                style="display: block; height: 73px; width: 73px;"
                :src="formatPicImage(row.photo, 'style', 146, 'someone')"
                alt=""
              />
            </template>
          </el-table-column>
          <el-table-column prop="activityFrom" label="链接跳转">
            <template slot-scope="{ row }">
              <p v-if="row.type == 1">{{ row.goodsList && row.goodsList.length ? `优选推荐：${row.goodsList[0].goodsName}等${row.goodsList.length}项` : '-' }}</p>
              <p v-if="row.type == 2">{{ row.sortInfoList && row.sortInfoList.length ? `类别：${row.sortInfoList[0].sortOneName}等${row.sortInfoList.length}类` : '-' }}</p>
              <p v-if="row.type == 3">{{ row.goodsList && row.goodsList.length ? "单项：" + row.goodsList[0].goodsName : '-' }}</p>
              <p v-if="row.type == 4">指定栏目：{{row.menu | menuFliter }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="activityTo" label="状态">
            <template slot-scope="{ row }">
              <p v-if="row.online">
                <status-text :type="'green'" :name="'已上线'"></status-text>
              </p>
              <p v-else>
                <status-text :type="'mred'" :name="'已下线'"></status-text>
              </p>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="240">
            <template slot-scope="scope">
              <g-button
                :name="'预览'"
                class="text-cant-copy"
                :type="'green'"
                :icon="'icon_operate_eyes'"
                @click="toDetails(scope.row.id,1)"
              ></g-button>
              <g-button
                :name="'编辑'"
                class="text-cant-copy"
                :type="'detail'"
                :icon="'icon_operate_edit'"
                @click="toDetails(scope.row.id,0)"
              ></g-button>
              <g-button
                v-if="!scope.row.online"
                :name="'上线'"
                class="text-cant-copy"
                :type="'detail'"
                :icon="'icon_operate_recover'"
                @click="upOnline(scope.row)"
              ></g-button>
              <g-button
                v-if="scope.row.online"
                :name="'下线'"
                class="text-cant-copy"
                :type="'red'"
                :icon="'icon_ope_revoke'"
                @click="downOnline(scope.row)"
              ></g-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pages-line">
        <div class="batch-btn">
          <g-button
            :name="'批量上线'"
            :type="'mgreenFill'"
            :icon="'icon_operate_recover'"
            @click="batchUp"
          ></g-button>
          <g-button
            :name="'批量下线'"
            :type="'orangeFill'"
            :icon="'icon_ope_revoke'"
            @click="batchDown"
          ></g-button>
        </div>
        <el-pagination
          style="margin-right: 12px;"
          class="pagination"
          @current-change="handlePageChanged"
          :current-page="adParams.pageNum"
          :page-size="adParams.pageSize"
          :pager-count="5"
          layout="total, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <g-del-model
      :delTagDialogVisible="downConfirmVisible"
      @confirm="upOrDownConfirm"
      @close="
        downConfirmVisible = false;
        adIds = [];
      "
      title="确定要下线吗？"
      content="下线后，该广告即时停止展示。"
      icon="icon_popup_question"
      iconColor="#FFC80C"
    ></g-del-model>
    <g-del-model
      :delTagDialogVisible="upConfirmVisible"
      @confirm="upOrDownConfirm"
      @close="
        upConfirmVisible = false;
        adIds = [];
      "
      title="确定要上线吗？"
      content="该广告将按照之前的设置进行展示。"
      icon="icon_popup_question"
      iconColor="#FFC80C"
    ></g-del-model>
  </div>
</template>
<script>
import "@/assets/css/tab.scss";
import * as axios from "@/util/axios";
import { mapActions, mapState } from "vuex";
import { truncate } from "fs";
import * as utils from "@/assets/js/utils";
export default {
  data() {
    return {
      formatPicImage: utils.formatPicImage, // 有尺寸的图片处理
      //tabs 选中标签
      sendRecordStatus: "all",
      // 切换标签列表
      sendRecords: [
        {
          value: "all", // 前端自定义
          label: "全部"
        },
        {
          value: "up",
          label: "已上线"
        },
        {
          value: "down",
          label: "已下线"
        }
      ],
      loading: false,
      downConfirmVisible: false, // 下线对话框
      upConfirmVisible: false, // 上线对话框
      currentRow: {}, // 预删除行的内容
      // 获取体验价的参数
      adParams: {
        online: null, //tabs 选中标签
        title: "",
        pageNum: 1,
        pageSize: 10
      },
      // 广告数据
      adData: [],
      // 广告数据总数
      total: 0,
      // 修改广告地址
      updateUrl: "/createOrUpdateAd",
      // 上下线地址
      upOrDownUrl: "/batchOnlineAd",
      // 选中的广告id
      adIds: [],
      online: true
    };
  },
  created() {
    // this.init()
    this.getAdList();
  },
  methods: {
    ...mapActions(['saveAdId']),
    // 获取广告活动列表
    getAdList() {
      this.loading = true;
      // this.adParams.online = this.sendRecordStatus
      const res = axios
        .post("/getAdListByCondition", {
          ...this.adParams,
          storeId: this.isBrand ? null : this.currentInfo.shopId,
          brandId: this.isBrand ? this.currentInfo.brandId : null
        })
        .then(res => {
          this.adData = res.adInfoList;
          this.total = res.total;
          this.loading = false;
        });
    },
    // 活动详情
    toDetails(id,flag) {
      this.saveAdId(id)
      let url = this.isBrand ? 'brand' : 'shop'
      if(flag) {
        window.open(`#/${url}-inner/ad-project-detail`,'_blank')
      } else {
        this.$router.push(`/${url}-inner/ad-project-edit`)
      }
    },
    // 下线活动
    downOnline(row) {
      this.currentRow = row;
      this.online = !this.currentRow.online;
      this.adIds = [row.id];
      this.downConfirmVisible = true;
    },
    // 上线活动
    upOnline(row) {
      this.currentRow = row;
      this.online = !this.currentRow.online;
      this.adIds = [row.id];
      this.upConfirmVisible = true;
    },
    // 表格多选
    handleSelectionChange(val) {
      this.adIds = val.map(i => i.id);
    },
    // 批量上下线
    batchUp() {
      if (this.adIds.length < 1)
        return this.$message.error("请至少选择1个广告进行批量操作");
      this.online = true;
      this.upConfirmVisible = true;
    },
    batchDown() {
      if (this.adIds.length < 1)
        return this.$message.error("请至少选择1个广告进行批量操作");
      this.online = false;
      this.downConfirmVisible = true;
    },
    // 上下线弹框确定事件
    async upOrDownConfirm() {
      const res = await axios.post(`${this.upOrDownUrl}`, {
        ids: this.adIds,
        online: this.online
      });
      if (res.success !== true)
        return this.$message.error(this.online ? "上线失败" : "下线失败");
      this.$message.success(this.online ? "上线成功" : "下线成功");
      // 关闭对话框
      this.downConfirmVisible = false;
      this.upConfirmVisible = false;
      // 重新获取表格数据
      this.getAdList();
    },
    handleSearch(title) {
      this.handlePageChanged(1);
    },
    handleSelectChange(v) {
      // this.form.groupStatus = v || null //  '' 报错 转 null
      this.handlePageChanged(1);
    },
    handlePageChanged(page) {
      this.adParams.pageNum = page;
      this.getAdList();
    },
    // 发布广告
    changeRouter() {
      let url = this.isBrand ? 'brand' : 'shop'
      this.$router.push({
        path: `/${url}-inner/ad-project-add`
      });
    },
    // 权重排序改变
    async orderNoChange(val, row) {
      // if(row.orderNo.length)
      const res = await axios.post(this.updateUrl, row);
      if (!res.success) this.$message.error("更新失败");
      this.$message.success("更新成功");
      this.handlePageChanged(this.adParams.pageNum);
    }
  },
  filters: {
    menuFliter(val) {
      switch (val) {
        case 'STORE':
          return '推荐美店'
        case 'SEC_KILL':
          return '限时秒杀'
        case 'NEWER':
          return '新人专享'
        case 'GROUP_BY':
          return '美物拼团'
        case 'SELL_GOODS':
          return '返佣商品列表'
        case 'VIP':
          return '会员优惠'
        case 'HOT':
          return '热门动态'
        case 'ORDER_CAR':
          return '购物车'
        default:
          return '会员中心'
      }
    }
  },
  watch: {
    // 监听tabs
    sendRecordStatus(v, o) {
      switch (v) {
        case "all":
          this.adParams.online = null;
          break;
        case "up":
          this.adParams.online = true;
          break;
        default:
          this.adParams.online = false;
          break;
      }
      this.handlePageChanged(1);
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    }),
    // 判断是品牌还是门店的标识
    isBrand() {
      return this.$route.path.indexOf("brand") !== -1;
    },
  }
};
</script>
<style lang="scss" scoped>
.shop-group-buy-main {
  width: calc(100vw - 221px);
  height: calc(100vh - 75px);
  display: flex;
  flex-wrap: wrap;
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
  .search-box {
    width: 280px;
    display: flex;
    // 主轴对齐
    justify-content: flex-end;
    // 交叉轴对齐
    align-items: center;
  }
  .normal_red_btn {
    padding: 9.5px 16px;
  }
}

.table-main {
  width: 100%;
  margin-top: 20px;
  background: #fff;
  box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
  height: calc(100vh - 155px);
  border-radius: 6px;
  .table-box {
    box-sizing: content-box;
    /deep/ .el-table {
      padding: 8px;
      .input {
        /deep/ .el-input__inner {
          width: 40px;
          height: 35px;
          text-align: center;
          text-indent: 0;
        }
      }
    }
  }
  .pages-line {
    height: 82px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .batch-btn {
      margin-left: 30px;
    }
  }
}
.tag-box {
  padding: 1px 8px;
  border: 1px solid #333;
  border-radius: 12px;
  font-size: 12px;
  color: #fff;
  &.open {
    border-color: #a9d86e;
    background: #a9d86e;
  }
  &.close {
    border-color: #e22c37;
    background: #e22c37;
  }
  &.sale_out {
    border-color: #bec3c6;
    background: #bec3c6;
  }
}

.el-tabs {
  background: #dee1e6;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
  height: 32px;
}
</style>
