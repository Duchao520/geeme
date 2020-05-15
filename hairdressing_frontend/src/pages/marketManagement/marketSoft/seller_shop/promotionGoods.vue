<template>
  <div class="goods-list">
    <div class="table-main">
      <div class="table-box">
        <div class="user-defined-tab">
          <el-tabs type="card" v-model="goodsParams.goodsType">
            <el-tab-pane
              v-for="item in sendRecords"
              :key="item.value"
              :name="item.value"
              :label="item.label"
            ></el-tab-pane>
          </el-tabs>
        </div>
        <el-checkbox-group v-model="sellGoodsIds" @change="handleChecked">
          <el-table stripe v-loading="loading" :data="goodsData" height="calc(100vh - 261px)">
            <!-- <el-table-column type="selection"></el-table-column> -->
            <el-table-column prop="goodsName" label="商品名称" :width="300">
              <template slot-scope="{ row }">
                <div class="service_msg">
                  <el-checkbox :label="row.id" class="check_single"></el-checkbox>
                  <div class="service_img" v-if="row.goodsType !== 3" @click="goodsDetail(row)">
                    <img
                      :src="
                      utils.formatPicImage(
                        row.cycleImageList[0],
                        'style',
                        70,
                        'brandLogo'
                      )
                    "
                    />
                  </div>
                  <div class="card_img" v-else @click="goodsDetail(row)">
                    <!-- <img :src="utils.formatPicImage(row.cycleImageList[0], 'style', 70, 'brandLogo')" /> -->

                    <img
                      :src="
                      utils.formatPicImage(brandLogo, 'style', 70, 'brandLogo')
                    "
                      class="brand-logo"
                    />
                    <img
                      :src="
                      utils.formatPicImage(
                        row.cycleImageList[0],
                        'style',
                        70,
                        'brandLogo'
                      )
                    "
                    />
                  </div>
                  <div class="service_info" @click="goodsDetail(row)">
                    <el-tooltip class="item" effect="dark" :content="row.goodsName" placement="top">
                      <p class="ser_name">{{ row.goodsName }}</p>
                    </el-tooltip>
                    <!-- <p class="ser_code">{{row.goodsId}}</p> -->
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="specificationName"
              label="规格"
              width="150"
              v-if="goodsParams.goodsType !== '3'"
            >
              <template slot-scope="{ row }">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="row.specificationName || '-'"
                  placement="top"
                >
                  <P class="specification-text">{{ row.specificationName || '-'}}</P>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
            <el-table-column prop="modifyTime" label="修改时间" show-overflow-tooltip></el-table-column>
            <el-table-column prop="price" label="展示价">
              <template slot-scope="{ row }">
                <p>{{ "￥" + row.price.toFixed(2) }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="sellCount" label="销量" show-overflow-tooltip width="80"></el-table-column>
            <el-table-column prop="sellPercent" label="推广提成/邀请奖励" width="200">
              <template slot-scope="{ row }">
                <!-- <p>{{ row.sellPercent }}</p>
                <p>{{ row.sellMoney }}</p>-->
                <div class="each-group" v-for="item in row.groupInfoList" :key="item.sellGroupId">
                  <p class="each-group-name">{{ item.sellGroupName }}:</p>
                  <p
                    :class="{'each-group-scale': true, 'hasVacancy': !item.active, 'noVacancy': item.active}"
                    v-if="item.awardType && item.active"
                  >
                    {{ item.awardType == 1 ? `${item.sellPercent}%/${item.invitePercent}%` : `${item.sellMoney}元/${item.inviteMoney}元` }}
                    <i
                      class="el-icon-edit-outline set-single"
                      @click="setSingleGood(row, item)"
                    ></i>
                  </p>
                  <p
                    :class="{'each-group-scale': true, 'hasVacancy': !item.active, 'noVacancy': item.active}"
                    v-else
                  >
                    {{ '--' }}
                    <i
                      class="el-icon-edit-outline set-single"
                      @click="setSingleGood(row, item)"
                    ></i>
                  </p>
                </div>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="invitePercent" label="邀请奖励" show-overflow-tooltip>
            <template slot-scope="{ row }">
              <p>{{ row.invitePercent }}</p>
              <p>{{ row.inviteMoney }}</p>
            </template>
            </el-table-column>-->

            <!-- <el-table-column label="提成空缺" show-overflow-tooltip>
            <template slot-scope="{ row }">
              <p v-if="isVacancy(row)" class="vacancy">
                <el-tag type="warning">有空缺</el-tag>
              </p>
              <p v-else class="trans">
                <el-tag type="warning">无空缺</el-tag>
              </p>
            </template>
            </el-table-column>-->

            <el-table-column label="状态">
              <template slot-scope="{ row }">
                <!-- <p v-if="row.deleted">已删除</p>
                <p v-else>生效中</p>-->
                <p v-if="row.deleted" class="reject">
                  <el-tag type="warning">已失效</el-tag>
                </p>
                <p v-else class="trans">
                  <el-tag type="warning">生效中</el-tag>
                </p>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="{ row }">
                <g-button :name="'设置'" :type="'detail'" :icon="'info_set'" @click="setGood(row)"></g-button>
                <g-button
                  :name="'删除'"
                  :type="'cancel'"
                  :icon="'icon_operate_delete'"
                  @click="deleteGood(row.id)"
                ></g-button>
              </template>
            </el-table-column>
          </el-table>
        </el-checkbox-group>
      </div>
      <div class="pages-line">
        <div class="batch-btn">
          <el-checkbox
            v-model="checkAllFlag"
            @change="checkAllChange"
            style="margin-right: 10px;"
            :indeterminate="isAllCheck"
          >全选</el-checkbox>
          <g-button :name="'批量设置'" :type="'detail'" :icon="'info_set'" @click="batchSetGoods"></g-button>
          <g-button
            :name="'批量删除'"
            :type="'cancel'"
            :icon="'icon_operate_delete'"
            @click="batchDelteGoods"
          ></g-button>
        </div>
        <el-pagination
          style="margin-right: 12px;"
          class="pagination"
          @current-change="handlePageChanged"
          :current-page="goodsParams.pageNum"
          :page-size="goodsParams.pageSize"
          :pager-count="5"
          layout="total, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <!-- 删除 -->
    <g-del-model
      :delTagDialogVisible="deleteGoodVisible"
      @confirm="deleteConfirm"
      @close="deleteGoodVisible = false; sellGoodsIds = []"
      title="确定要将该商品删除吗？"
      content="删除后，该商品将不再参与推广。"
      icon="icon_ope_cancel"
      iconColor="red"
    ></g-del-model>
    <!-- 批量删除 -->
    <g-del-model
      :delTagDialogVisible="batchDeleteGoodVisible"
      @confirm="batchDeleteConfirm"
      @close="batchDeleteGoodVisible = false"
      title="确定要将这些商品删除吗？"
      content="删除后，这些商品将不再参与推广。"
      icon="icon_ope_cancel"
      iconColor="red"
    ></g-del-model>
    <!-- 设置提成对话框 -->
    <el-dialog
      title="设置提成与奖励"
      :visible.sync="setGoodDialogVisible"
      @close="setGoodClose"
      width="900px"
    >
      <el-form :model="setGoodForm" :rules="setGoodRules" ref="setGoodRef">
        <el-table
          :data="setGoodForm.sellPerformanceSettingInfoList"
          style="width: 100%"
          :height=" isSetSingle ? '165' : '50vh'"
          class="create-seller"
          :header-cell-style="headerRowStyle"
          v-loading="setGoodLoad"
          :empty-text="'错误的分组信息'"
        >
          <el-table-column
            :type="setGoodForm.sellPerformanceSettingInfoList.length > 1 ? 'index' : '-'"
            width="50"
          ></el-table-column>
          <el-table-column label="推客分组" prop="groupName" width="180">
            <template slot-scope="scope">
              <p>{{scope.row.groupName}}</p>
            </template>
          </el-table-column>
          <el-table-column label="设置方式" width="160">
            <template slot-scope="scope">
              <el-form-item>
                <el-radio-group
                  v-model="
                    setGoodForm.sellPerformanceSettingInfoList[scope.$index]
                      .awardType
                  "
                >
                  <el-radio :label="1">比例</el-radio>
                  <el-radio :label="2">固定</el-radio>
                </el-radio-group>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="推广提成" width="180">
            <template slot-scope="scope">
              <el-form-item
                :prop="
                  'sellPerformanceSettingInfoList.' +
                    scope.$index +
                    '.sellPercent'
                "
                :rules="{
                  required: true,
                  validator: sellProValidator,
                  trigger: 'blur'
                }"
                v-if="
                  scope.row
                    .awardType !== 2
                "
              >
                <el-input
                  type="number"
                  placeholder="请输入比例"
                  v-model.number="
                    scope.row
                      .sellPercent
                  "
                  size="mini"
                >
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
              <el-form-item
                :prop="
                  'sellPerformanceSettingInfoList.' +
                    scope.$index +
                    '.sellMoney'
                "
                :rules="{
                  required: true,
                  validator: sellValidator,
                  trigger: 'blur'
                }"
                v-else
              >
                <el-input
                  type="number"
                  placeholder="请输入金额"
                  v-model.number="
                    scope.row
                      .sellMoney
                  "
                  size="mini"
                >
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="邀请奖励" width="180">
            <template slot-scope="scope">
              <el-form-item
                :prop="
                  'sellPerformanceSettingInfoList.' +
                    scope.$index +
                    '.invitePercent'
                "
                :rules="{
                  required: true,
                  validator: sellProValidator,
                  trigger: 'blur'
                }"
                v-if="
                  scope.row
                    .awardType !== 2
                "
              >
                <el-input
                  type="number"
                  placeholder="请输入比例"
                  v-model.number="
                    scope.row
                      .invitePercent
                  "
                  size="mini"
                >
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
              <el-form-item
                :prop="
                  'sellPerformanceSettingInfoList.' +
                    scope.$index +
                    '.inviteMoney'
                "
                :rules="{
                  required: true,
                  validator: sellValidator,
                  trigger: 'blur'
                }"
                v-else
              >
                <el-input
                  type="number"
                  placeholder="请输入金额"
                  v-model.number="
                    scope.row
                      .inviteMoney
                  "
                  size="mini"
                >
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="是否生效" width="100">
            <template slot-scope="scope">
              <el-form-item>
                <el-switch v-model="scope.row
                      .active"></el-switch>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setGoodDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmSetGood" :loading="setGoodLoad">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as axios from "@/util/axios";
import { mapActions, mapState } from "vuex";
import * as utils from "@/assets/js/utils";
export default {
  props: {
    sellerform: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      brandLogo: "brandLogo",
      loading: false,
      utils,
      goodsParams: {
        goodsType: "0",
      },
      // tab栏可选数组
      sendRecords: [
        {
          value: "0",
          label: "全部"
        },
        {
          value: "1",
          label: "产品"
        },
        {
          value: "2",
          label: "服务"
        },
        {
          value: "3",
          label: "卡项"
        }
      ],
      // 分组信息
      sellerGroup: [],
      // 表格数据
      goodsData: [],
      // 商品id数组
      goodsIds: [],
      // 表格数据总数
      total: null,
      // 禁用推客提示框标识
      banConfirmVisible: false,
      // 表格复选框选中的ids
      sellGoodsIds: [],
      // 删除弹框
      deleteGoodVisible: false,
      // 批量删除弹框
      batchDeleteGoodVisible: false,
      // 设置提成对话框标识
      setGoodDialogVisible: false,
      // 对话框头部样式
      headerRowStyle: { background: "#f4f5f7" },
      // 设置提成表单即提交参数
      setGoodForm: {
        sellGoodsIdList: [],
        sellPerformanceSettingInfoList: []
      },
      // 设置提成校验规则
      setGoodRules: {},
      // 设置提成表格数据
      setGoodTableData: [],
      setGoodLoad: false,
      isSetSingle: false,
      // 自定义全选
      checkAllFlag: false,
      isAllCheck: false
    };
  },
  mounted() {
    this.getBelongGroup();
    this.brandLogo = this.$store.state.manage.currentInfo.brandLogo;
    this.goodsParams = {
      ...this.goodsParams,
      brandId: this.currentInfo.brandId,
      pageNum: this.sellerform.pageNum,
      pageSize: this.sellerform.pageSize
    };
    this.getSellerGoodsList();
  },
  methods: {
    // 全选按钮点击
    checkAllChange(checked) {
      this.isAllCheck = false;
      if (checked) {
        this.goodsData.forEach((item, index) => {
          if (this.sellGoodsIds.indexOf(item.id) == -1) {
            this.sellGoodsIds.push(item.id);
          }
        });
      } else {
        this.sellGoodsIds = [];
      }
    },
    handleChecked(value) {
      let checkedCount = value.length;
      this.checkAllFlag = this.sellGoodsIds.length == this.goodsData.length;
      this.isAllCheck =
        checkedCount > 0 && checkedCount < this.goodsData.length;
    },
    // 获取隶属分组列表
    async getBelongGroup() {
      const res = await axios.post("/getSellerGroupByBrandId", {
        brandId: this.currentInfo.brandId
      });
      //根分组id排序
      res.sellerGroupInfoList.sort(function(a, b) {
        if (a.id < b.id) {
          return -1;
        } else if (a.id == b.id) {
          return 0;
        } else {
          return 1;
        }
      });
      this.sellerGroup = res.sellerGroupInfoList;
    },
    // 获取推广商品列表
    async getSellerGoodsList() {
      let params = JSON.parse(JSON.stringify(this.goodsParams));
      params.goodsType = params.goodsType == "0" ? null : params.goodsType;
      this.loading = true;
      const res = await axios.post("/getSellerGoodsList", params);
      this.loading = false;
      this.total = res.total;
      this.goodsData = res.sellGoodsInfoForListList;
      this.goodsIds = res.specificationIdList;
    },
    // 商品详情
    goodsDetail(row) {
      // 产品
      if (row.goodsType == 1) {
        window.open("#/shop-inner/product-detail?id=" + Base64.encode(row.goodsId), "_blank");
      } else if (row.goodsType == 2) {
        window.open(
          "#/shop-inner/service-detail?serviceId=" + Base64.encode(row.goodsId),
          "_blank"
        );
      } else {
        // 新标签打开详情
        this.toPagesInNewTags(`/shop-inner/vip-card-details`, {id: row.goodsId})
      }
    },
    // 表格分页切换事件
    handlePageChanged(index) {
      this.goodsParams.pageNum = index;
      this.getSellerGoodsList();
      this.sellGoodsIds = [];
      this.checkAllFlag = false;
      this.isAllCheck = false;
    },
    // 设置商品
    async setGood(row, data) {
      this.isSetSingle = false;
      // this.setGoodTableDataComplete();
      this.setGoodForm.sellGoodsIdList = [row.id];
      this.setGoodLoad = true;
      this.setGoodDialogVisible = true;
      // 根据商品id获取提成方案
      const res = await axios.post("/getSellerGoodsSettingByGoodsId", {
        brandId: this.currentInfo.brandId,
        sellGoodsId: row.id
      });
      // 如果还没有分组信息， 则新建比例为0的默认分组
      if (this.sellerGroup.length == 0) {
        const resDefaultGroup = await axios.post("/createOrUpdateSellerGroup", {
          brandId: this.currentInfo.brandId,
          deleted: false,
          invitePercent: 0,
          name: "默认分组",
          sellPercent: 0
        });
        await this.getBelongGroup();
        // 再次调用
        this.setGood(row);
      } else {
        // 区分各组首次设置提成 还是 数据回显
        this.setGoodForm.sellPerformanceSettingInfoList = [];
        res.sellPerformanceSettingInfoList.forEach((item, index) => {
          this.sellerGroup.forEach(i => {
            if (item.sellGroupId == i.id) {
              if (item.active) {
                this.$set(
                  this.setGoodForm.sellPerformanceSettingInfoList,
                  index,
                  {
                    groupName: i.name,
                    ...item
                  }
                );
              } else {
                this.$set(
                  this.setGoodForm.sellPerformanceSettingInfoList,
                  index,
                  {
                    groupName: i.name,
                    brandId: this.currentInfo.brandId,
                    active: false,
                    sellGroupId: i.id,
                    awardType: 1,
                    invitePercent: i.invitePercent,
                    inviteMoney: 0,
                    sellPercent: i.sellPercent,
                    sellMoney: 0
                  }
                );
              }
            }
          });
        });
      }
      // 单个分组的设置
      if (data) {
        this.isSetSingle = true;
        this.setGoodForm.sellPerformanceSettingInfoList = this.setGoodForm.sellPerformanceSettingInfoList.filter(
          item => item.sellGroupId == data.sellGroupId
        );
      }
      this.setGoodLoad = false;
    },
    setSingleGood(row, data) {
      this.setGood(row, data);
    },
    // 提成表格数据实现
    setGoodTableDataComplete() {
      this.setGoodTableData = [];
      this.setGoodForm.sellPerformanceSettingInfoList = [];
      this.sellerGroup.forEach(item => {
        this.setGoodForm.sellPerformanceSettingInfoList.push({
          groupName: item.name,
          brandId: this.currentInfo.brandId,
          // 对于批量设置，没有回显需求，默认全部生效
          active: true,
          sellGroupId: item.id,
          awardType: 1,
          invitePercent: item.invitePercent,
          inviteMoney: 0,
          sellPercent: item.sellPercent,
          sellMoney: 0
        });
      });
    },
    // 确认设置提成
    confirmSetGood() {
      this.$refs.setGoodRef.validate(async valid => {
        if (!valid) return this.$message.error("数据填写有错误");
        this.setGoodLoad = true;
        axios
          .post("/batchSetSellerGoodsSetting", this.setGoodForm)
          .then(res => {
            if (!res.success) return this.$message.error("设置失败");
            this.$message.success("设置成功");
            this.getSellerGoodsList();
            this.setGoodDialogVisible = false;
            this.setGoodLoad = false;
          })
          .catch(() => {
            this.setGoodLoad = false;
          });
      });
    },
    // 关闭设置提成对话框
    setGoodClose() {
      this.$refs.setGoodRef.resetFields();
      // this.setGoodForm.sellPerformanceSettingInfoList = [];
    },
    // 提成是否空缺
    isVacancy(row) {
      return (
        row.groupInfoList.some(i => !i.active) || row.groupInfoList.length == 0
      );
    },
    // 提成表单校验
    sellValidator(r, v, cb) {
      if (/^\d+(\.\d{1,2})?$/.test(v)) {
        cb();
      } else {
        cb("请输入正确的金额，可带两小数");
      }
    },
    sellProValidator(r, v, cb) {
      if (/^\d+(\.\d{1,2})?$/.test(v) && v <= 100) {
        cb();
      } else {
        cb("不大于100，可带两小数");
      }
    },
    // 批量设置
    async batchSetGoods() {
      if (this.sellGoodsIds.length < 1)
        return this.$message.error("请至少选中1个商品进行批量设置");
      this.setGoodLoad = true;
      if (!this.sellerGroup.length) {
        this.setGoodDialogVisible = false;
        const resDefaultGroup = await axios.post("/createOrUpdateSellerGroup", {
          brandId: this.currentInfo.brandId,
          deleted: false,
          invitePercent: 0,
          name: "默认分组",
          sellPercent: 0
        });
        await this.getBelongGroup();
      }
      this.setGoodTableDataComplete();
      this.setGoodForm.sellGoodsIdList = this.sellGoodsIds;
      this.setGoodLoad = false;
      this.setGoodDialogVisible = true;
    },
    // 删除商品
    deleteGood(id) {
      this.deleteGoodVisible = true;
      this.sellGoodsIds = [id];
    },
    // 删除确认
    async deleteConfirm() {
      const res = await axios.post("/batchDeleteSellerGoods", {
        sellGoodsIds: this.sellGoodsIds
      });
      if (this.sellGoodsIds.length < 2) {
        if (!res.success) return this.$message.error("删除产品失败");
        this.$message.success("删除产品成功");
        this.deleteGoodVisible = false;
      } else {
        if (!res.success) return this.$message.error("批量删除产品失败");
        this.$message.success("批量删除产品成功");
        this.batchDeleteGoodVisible = false;
      }
      this.getSellerGoodsList();
    },
    // 批量删除
    batchDelteGoods() {
      if (this.sellGoodsIds.length < 1)
        return this.$message.error("请至少选中1个商品进行批量删除");
      this.batchDeleteGoodVisible = true;
    },
    // 批量删除确认
    batchDeleteConfirm() {
      this.deleteConfirm();
    },
    // 表格复选框选中
    handleSelectionChange(arr) {
      this.sellGoodsIds = arr.map(i => i.id);
    },
    // 单个分组比例设置
    async setSinglePercent(data) {
      await this.setGood(data.sellGoodsId, "single");
      let arr = this.setGoodForm.sellPerformanceSettingInfoList;
      let flag = false;
      arr.forEach(item => {
        if (item.sellGroupId == data.sellGroupId) {
          flag = true;
          this.setGoodForm.sellPerformanceSettingInfoList = [item];
        }
      });
      if (!flag) {
        this.setGoodForm.sellPerformanceSettingInfoList = [];
      }
      this.setGoodLoad = false;
    }
  },
  watch: {
    "goodsParams.goodsType"(val) {
      this.handlePageChanged(1);
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    })
  }
};
</script>

<style lang="scss" scoped>
.table-main {
  width: 100%;
  margin-top: 20px;
  background: #fff;
  box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
  height: calc(100vh - 149px);
  border-radius: 6px;
  .table-box {
    box-sizing: content-box;
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

.el-tabs {
  background: #dee1e6;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
  height: 32px;
}

.user-defined-tab /deep/ .el-tabs--card .el-tabs__item {
  border: 0;
  height: 32px;
  line-height: 32px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border: none !important;
}

.trans {
  span {
    color: #fff;
    background-color: #75c74f;
    border-radius: 20px;
    height: 20px;
    line-height: 18px;
  }
}

.reject {
  span {
    color: #fff;
    background-color: #f19e3a;
    border-radius: 20px;
    height: 20px;
    line-height: 18px;
  }
}

.vacancy {
  span {
    color: #fff;
    background-color: #fb3d63;
    border-radius: 20px;
    height: 20px;
    line-height: 18px;
  }
}

.service_msg {
  display: inline-block;
  display: flex;
  .service_img {
    margin-right: 10px;
    cursor: pointer;
    img {
      width: 64px;
      height: 62px;
    }
  }
  .card_img {
    position: relative;
    margin-right: 10px;
    cursor: pointer;
    .brand-logo {
      position: absolute;
      top: 6px;
      left: 5px;
      width: 15px;
      height: 15px;
      border-radius: 7.5px;
    }
    img {
      display: block;
      width: 100px;
      height: 62px;
      border-radius: 5px;
    }
  }
  .service_info {
    display: flex;
    align-items: center;
    cursor: pointer;
    // flex: 1;
    .ser_name {
      &:hover {
        color: #409eff;
      }
      color: #333333;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}

.each-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .each-group-name {
    width: 75px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
  .hasVacancy {
    color: #fb3d63;
    .set-single {
      color: #6CCFF3;
      font-size: 16px;
      vertical-align: middle;
      cursor: pointer;
    }
  }
  .noVacancy {
    color: #75c74f;
    .set-single {
      color: #6CCFF3;
      font-size: 16px;
      vertical-align: middle;
      cursor: pointer;
    }
  }
}

.check_single {
  margin-left: 5px;
  display: inline-block;
  /deep/ .el-checkbox__input {
    margin: 24px 15px 0 0;
  }
  /deep/ .el-checkbox__label {
    display: none;
  }
}

.specification-text {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
