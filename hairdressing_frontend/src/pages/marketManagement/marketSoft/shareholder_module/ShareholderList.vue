<template>
  <div>
    <!-- 筛选 -->
    <div class="filters-line">
      <div class="filters-search">
        <el-form :model="params" label-width="85px" class="query-form">
          <el-form-item :label="'加入时间:'">
            <el-date-picker
              v-model="timeRange"
              type="datetimerange"
              clearable
              unlink-panels
              :default-time="['00:00:00', '23:59:59']"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="权益门店: " v-if="isBrand">
            <el-select v-model="params.storeId" placeholder="请选择" clearable>
              <el-option
                v-for="item in storeList"
                :key="item.storeId"
                :label="item.storeName"
                :value="item.storeId"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="分红方案: ">
            <el-select v-model="params.shareholderPlanId" placeholder="请选择" clearable>
              <el-option
                v-for="item in isBrand ? storeBonusPlanList : storeBonusPlan"
                :key="item.id"
                :label="item.name"
                :value="item.id"
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
    <!-- 列表 -->
    <div class="shareholder-list">
      <div class="table-main">
        <div class="user-defined-tab">
          <el-tabs type="card" v-model="params.status">
            <el-tab-pane
              v-for="item in sendRecords"
              :key="item.value"
              :name="item.value"
              :label="item.label"
            ></el-tab-pane>
          </el-tabs>
        </div>
        <div class="table-box">
          <!-- <el-checkbox-group v-model="batchShareholderIds" @change="handleChecked"> -->
          <el-table stripe :data="shareholderData" height="calc(100vh - 352px)" v-loading="loading">
            <el-table-column label="股东信息" width="180">
              <template slot-scope="scope">
                <div class="client_area">
                  <!-- <el-checkbox :label="scope.row.id" class="check_single"></el-checkbox> -->
                  <div class="client_msg">
                    <div class="client_img">
                      <!-- <img v-if="scope.row.shareholderHeadPortrait" :src="scope.row.shareholderHeadPortrait" /> -->
                      <img
                        :src="utils.formatPicImage(
                          scope.row.shareholderHeadPortrait,
                          'style',
                          40,
                          'someone',
                          scope.row.shareholderSex
                        )"
                      />
                      <img
                        class="sex_icon"
                        v-if="scope.row.shareholderSex == '女'"
                        src="@/assets/img/female_tip.png"
                      />
                      <img class="sex_icon" v-else src="@/assets/img/male_tip.png" />
                    </div>
                    <div class="client_info">
                      <p>{{ scope.row.shareholderRealName }}</p>
                      <p>{{ scope.row.shareholderMobile }}</p>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="parentSellerId" show-overflow-tooltip label="微信昵称" width="100">
              <template slot-scope="{ row }">
                <p>{{row.weName || '-'}}</p>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" show-overflow-tooltip label="加入时间"></el-table-column>
            <el-table-column show-overflow-tooltip label="入股保证金">
              <template slot-scope="{ row }">
                <p
                  v-if="isBrand"
                >{{ row.sumSecurityFund ? "￥" + row.sumSecurityFund.toFixed(2) : '￥0.00' }}</p>
                <p v-else>{{ row.securityFund ? "￥" + row.securityFund.toFixed(2) : '￥0.00' }}</p>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="剩余保证金">
              <template slot-scope="{ row }">
                <p
                  v-if="isBrand"
                >{{ row.sumSurplusSecurityFund ? "￥" + row.sumSurplusSecurityFund.toFixed(2) : '￥0.00' }}</p>
                <p
                  v-else
                >{{ row.surplusSecurityFund ? "￥" + row.surplusSecurityFund.toFixed(2) : '￥0.00' }}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="shareholderPlanId"
              :label=" isBrand ? '权益方案' : '分红方案'"
              :width=" isBrand ? 200 : false"
            >
              <template slot-scope="{ row }">
                <div v-if="isBrand">
                  <div
                    v-if="row.equityStoreInfoList && row.equityStoreInfoList.length"
                    class="plan-container"
                  >
                    <div class="plan-title">
                      <p
                        v-for="item in row.equityStoreInfoList.slice(0, 2)"
                        :key="item.shareholderStoreId"
                      >{{ item.storeCity + ' ' + item.storeName}}</p>
                    </div>
                    <p class="plan-detail" @click="equityDetail(row)">详情</p>
                  </div>
                  <status-text v-else :type="'mred'" :name="'方案已停用'"></status-text>
                </div>
                <div v-else>
                  <div
                    v-if="shareholderPlanFilter(row.shareholderPlanId)"
                  >{{ shareholderPlanFilter(row.shareholderPlanId) }}</div>
                  <status-text v-else :type="'mred'" :name="'方案已停用'"></status-text>
                </div>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="保证金可退" v-if="!isBrand">
              <template slot-scope="{ row }">
                <status-text v-if="row.securityFundCanReturn" :type="'green'" :name="'可退'"></status-text>
                <status-text v-else :type="'mred'" :name="'不可退'"></status-text>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="保证金可消费" v-if="!isBrand">
              <template slot-scope="{ row }">
                <status-text v-if="row.securityFundCanUse" :type="'green'" :name="'可退'"></status-text>
                <status-text v-else :type="'mred'" :name="'不可退'"></status-text>
              </template>
            </el-table-column>
            <el-table-column
              prop="introducerShareholderRealName"
              show-overflow-tooltip
              label="介绍人"
              width="80"
            >
              <template slot-scope="{ row }">
                <p>{{ row.introducerShareholderRealName || '-'}}</p>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="股东来源">
              <template slot-scope="{ row }">
                <p>{{ row.channel == 'pc' ? '后台添加' : row.channel == 'weapp' ? '线上申请' : '未知'}}</p>
              </template>
            </el-table-column>
            <el-table-column label="备注">
              <template slot-scope="{ row }">
                <div class="shareholder-remark">
                  <p class="remark-text">{{ row.remark || '-'}}</p>
                  <i class="el-icon-edit-outline set-single" @click="setRemark(row)"></i>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="操作" width="212">
              <template slot-scope="scope">
                <g-button
                  v-if="scope.row.equityStoreInfoList.some(i => i.status == 'enabled')"
                  :name="'详情'"
                  :type="'green'"
                  :icon="'icon_operate_eyes'"
                  @click="toDetails(scope.row)"
                ></g-button>
                <g-button
                  v-if="scope.row.equityStoreInfoList.some(i => i.status == 'enabled')"
                  :name="'充值'"
                  :type="'mgreen'"
                  :icon="'icon_order_refund'"
                  @click="recharge(scope.row)"
                ></g-button>
                <g-button
                  :name="'启用'"
                  :type="'green'"
                  :icon="'icon_ope_revoke'"
                  @click="toUsing(scope.row)"
                  v-if="toUsingCondition(scope.row)"
                ></g-button>
                <g-button
                  v-if="scope.row.equityStoreInfoList.some(i => i.status == 'enabled')"
                  :name="'停用'"
                  :type="'red'"
                  :icon="'icon_operate_disable'"
                  @click="disable(scope.row)"
                ></g-button>
                <g-button
                  v-if="scope.row.equityStoreInfoList.some(i => i.status == 'enabled')"
                  :name="'退股'"
                  :type="'cancel'"
                  :icon="'icon_operate_down'"
                  @click="withdrawal(scope.row)"
                ></g-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- </el-checkbox-group> -->
        </div>
        <div class="pages-line">
          <div class="batch-btn">
            <!-- <el-checkbox
              v-model="checkAllFlag"
              @change="checkAllChange"
              style="margin-right: 10px;"
              :indeterminate="isAllCheck"
            >全选</el-checkbox>-->
          </div>
          <el-pagination
            style="margin-right: 12px;"
            class="pagination"
            @current-change="handlePageChanged"
            :current-page="params.currentPage"
            :page-size="params.pageSize"
            :pager-count="5"
            layout="total, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>

    <!-- 权益方案详情 -->
    <el-dialog
      title="权益方案详情"
      :visible.sync="equityDialogVisible"
      width="1000px"
      :before-close="equityHandleClose"
      class="equity-dialog"
    >
      <div class="equity-container" v-loading="equityLoad">
        <div class="customer-info">
          <div class="customer-head">
            <div class="client_area">
              <!-- <el-checkbox :label="scope.row.id" class="check_single"></el-checkbox> -->
              <div class="client_msg">
                <div class="client_img">
                  <!-- <img v-if="scope.row.shareholderHeadPortrait" :src="scope.row.shareholderHeadPortrait" /> -->
                  <img
                    v-if="pitchRow.shareholderHeadPortrait"
                    :src="utils.formatPicImage(
                          pitchRow.shareholderHeadPortrait,
                          'style',
                          40,
                          'someone',
                          pitchRow.shareholderSex
                        )"
                  />
                  <img
                    v-else
                    :src="
                        utils.formatPicImage(
                          pitchRow.shareholderHeadPortrait,
                          'style',
                          40,
                          'someone',
                          pitchRow.shareholderSex
                        )
                      "
                  />
                  <img
                    class="sex_icon"
                    v-if="pitchRow.shareholderSex == '女'"
                    src="@/assets/img/female_tip.png"
                  />
                  <img class="sex_icon" v-else src="@/assets/img/male_tip.png" />
                </div>
                <div class="client_info">
                  <p>{{ pitchRow.shareholderRealName }}</p>
                  <p>{{ pitchRow.shareholderMobile }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="customer-name">
            <p>股东昵称：{{pitchRow.weName || '-'}}</p>
          </div>
        </div>
        <div class="equity-table">
          <el-table stripe :data="equityList" :header-cell-style="headerStyle">
            <el-table-column show-overflow-tooltip label="权益门店" width="160">
              <template slot-scope="{ row }">
                <p>{{`${row.storeCity} ${row.storeName}`}}</p>
              </template>
            </el-table-column>

            <el-table-column show-overflow-tooltip label="分红方案">
              <template slot-scope="{ row }">
                <p>{{row.bonusPlanName || '-'}}</p>
              </template>
            </el-table-column>

            <el-table-column show-overflow-tooltip label="毛利分红比例">
              <template slot-scope="{ row }">
                <p>{{row.grossProfitBonusRate ? row.grossProfitBonusRate + '%' : '-'}}</p>
              </template>
            </el-table-column>

            <el-table-column show-overflow-tooltip label="返还保证金比例" width="120">
              <template slot-scope="{ row }">
                <p>{{row.securityFundReturnRate ? row.securityFundReturnRate + '%' : '-'}}</p>
              </template>
            </el-table-column>

            <el-table-column show-overflow-tooltip label="入股保证金">
              <template slot-scope="{ row }">
                <p>{{row.securityFund ? row.securityFund + '元' : '-'}}</p>
              </template>
            </el-table-column>

            <el-table-column show-overflow-tooltip label="剩余保证金">
              <template slot-scope="{ row }">
                <p>{{row.surplusSecurityFund ? row.surplusSecurityFund + '元' : '-'}}</p>
              </template>
            </el-table-column>

            <el-table-column show-overflow-tooltip label="设置">
              <template slot-scope="{ row }">
                <p>{{row.securityFundCanReturn ? '保证金可退还' : '保证金不可退还'}}</p>
              </template>
            </el-table-column>

            <el-table-column show-overflow-tooltip label="启用状态">
              <template slot-scope="{ row }">
                <status-text :type="statusType(row.status)" :name="statusName(row.status)"></status-text>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>

    <!-- 设置备注 -->
    <el-dialog
      title="设置备注"
      :visible.sync="remarkDialogVisible"
      width="576px"
      :before-close="remarkHandleClose"
    >
      <div v-loading="remarkLoad" v-if="pitchRow.shareholderInfo">
        备注：
        <el-input type="textarea" v-model="pitchRow.shareholderInfo.remark" placeholder="请输入备注内容"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="remarkHandleClose">取 消</el-button>
        <el-button type="primary" @click="remarkConfirm" :loading="btnLoad">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 停用 -->
    <g-dialog-with-slot
      v-if="disableDialogVisible"
      :dialogVisible="disableDialogVisible"
      class="disable-dialog"
      :color="'#FF6D61'"
      :icon="'icon_popup_question'"
      :title="'确定结算吗?'"
      @resolve="disableConfirm"
      @close="disableClose"
      :btnLoad="btnLoad"
    >
      <div v-loading="disableLoad" class="disable-container">
        <p style="margin-top: 10px;">停用后，该股东相关权益将即时中止。</p>
        <el-form
          :model="pitchPlanParams"
          :rules="pitchPlanRules"
          ref="pitchPlanParams"
          label-width="85px"
          class="query-form"
          style="margin-top: 20px;"
        >
          <el-form-item label="权益门店: " v-if="isBrand" prop="id">
            <el-select
              v-model="pitchPlanParams.id"
              placeholder="请选择权益门店"
              clearable
              style="width: 200px;"
            >
              <el-option
                v-for="item in pitchPlanList"
                :key="item.shareholderStoreId"
                :label="item.storeName"
                :value="item.shareholderStoreId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="停用原因: " v-if="isBrand" prop="disabledReason">
            <el-input
              type="textarea"
              v-model="pitchPlanParams.disabledReason"
              style="width: 200px;"
              placeholder="请输入停用原因"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </g-dialog-with-slot>

    <!-- 启用 -->
    <g-dialog-with-slot
      v-if="toUsingDialogVisible"
      :dialogVisible="toUsingDialogVisible"
      class="toUsing-dialog"
      :color="'#FF6D61'"
      :icon="'icon_popup_question'"
      :title="'确定结算吗?'"
      @resolve="toUsingConfirm"
      @close="toUsingClose"
      :btnLoad="btnLoad"
    >
      <div v-loading="toUsingLoad" class="toUsing-container">
        <p style="margin-top: 10px;">启用后，该股东相关权益将即时恢复。</p>
        <el-form
          :model="pitchPlanParams"
          :rules="pitchPlanRules"
          ref="pitchPlanParams"
          label-width="85px"
          class="query-form"
          style="margin-top: 20px;"
        >
          <el-form-item label="权益门店: " v-if="isBrand" prop="id">
            <el-select
              v-model="pitchPlanParams.id"
              placeholder="请选择权益门店"
              clearable
              style="width: 200px;"
            >
              <el-option
                v-for="item in pitchPlanList"
                :key="item.shareholderStoreId"
                :label="item.storeName"
                :value="item.shareholderStoreId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </g-dialog-with-slot>

    <!-- 退股 -->
    <el-dialog
      title="股东退股"
      :visible.sync="quitDialogVisible"
      width="1000px"
      :before-close="quitHandleClose"
      class="equity-dialog"
    >
      <div class="equity-container" v-loading="quitLoad">
        <div class="customer-info">
          <div class="customer-head">
            <div class="client_area">
              <!-- <el-checkbox :label="scope.row.id" class="check_single"></el-checkbox> -->
              <div class="client_msg">
                <div class="client_img">
                  <!-- <img v-if="scope.row.shareholderHeadPortrait" :src="scope.row.shareholderHeadPortrait" /> -->
                  <img
                    v-if="pitchRow.shareholderHeadPortrait"
                    :src="utils.formatPicImage(
                          pitchRow.shareholderHeadPortrait,
                          'style',
                          40,
                          'someone',
                          pitchRow.shareholderSex
                        )"
                  />
                  <img
                    v-else
                    :src="
                        utils.formatPicImage(
                          pitchRow.shareholderHeadPortrait,
                          'style',
                          40,
                          'someone',
                          pitchRow.shareholderSex
                        )
                      "
                  />
                  <img
                    class="sex_icon"
                    v-if="pitchRow.shareholderSex == '女'"
                    src="@/assets/img/female_tip.png"
                  />
                  <img class="sex_icon" v-else src="@/assets/img/male_tip.png" />
                </div>
                <div class="client_info">
                  <p>{{ pitchRow.shareholderRealName }}</p>
                  <p>{{ pitchRow.shareholderMobile }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="customer-name">
            <p>股东昵称：{{pitchRow.weName || '-'}}</p>
          </div>
        </div>

        <el-form
          :model="quitForm"
          :rules="quitRules"
          ref="quitForm"
          label-width="120px"
          class="quit-query-form"
          style="margin-top: 20px;"
        >
          <el-form-item label="权益门店: " v-if="isBrand" prop="id">
            <el-select
              v-model="quitForm.id"
              placeholder="请选择权益门店"
              clearable
              style="width: 200px;"
              @change="quitEquityChange"
            >
              <el-option
                v-for="item in quitList"
                :key="item.shareholderStoreId"
                :label="item.storeName"
                :value="item.shareholderStoreId"
              ></el-option>
            </el-select>
          </el-form-item>

          <div class="equity-table">
            <h4>保证金明细</h4>
            <el-table stripe :data="pitchQuitList" :header-cell-style="headerStyle">
              <el-table-column show-overflow-tooltip label="累计充值">
                <template slot-scope="{ row }">
                  <p>{{row.recharge ? row.recharge + row.openAccount + row.modifyAdd + '元' : '-'}}</p>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip label="累计扣除">
                <template slot-scope="{ row }">
                  <p>{{row.modifySubstract ? row.modifySubstract + '元' : '-'}}</p>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip label="累计返还">
                <template slot-scope="{ row }">
                  <p>{{row.returnAmount ? row.returnAmount + '元' : '-'}}</p>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip label="剩余保证金">
                <template slot-scope="{ row }">
                  <p>{{row.surplusSecurityFund ? row.surplusSecurityFund + '元' : '-'}}</p>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <el-form-item label="退股提现方式: " v-if="isBrand" prop="quitType" style="margin-top: 10px;">
            <el-radio v-model="quitForm.quitType" :label="1">现金提现</el-radio>
            <el-radio v-model="quitForm.quitType" :label="2">充值到权益金</el-radio>
          </el-form-item>

          <el-form-item label v-if="isBrand" prop="quitType">
            <el-input
              v-model.number="quitForm.quitSecurityFund"
              placeholder="限数字"
              style="width: 200px;"
            >
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="quitHandleClose">取 消</el-button>
        <el-button type="primary" @click="quitConfirm" :loading="btnLoad">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 充值 -->
    <recharge
      :rechargeDialogVisible="rechargeDialogVisible"
      :pitchRow="pitchRow"
      @close="rechargeDialogVisible = false"
      @success="success"
    ></recharge>
  </div>
</template>

<script>
import "@/assets/css/tab.scss";
import * as axios from "@/util/axios";
import { mapActions, mapState } from "vuex";
import * as utils from "@/assets/js/utils";
import { Base64 } from "js-base64";
import recharge from "./components/recharge";
export default {
  components: { recharge },
  props: {
    storeBonusPlan: {
      type: Array,
      default: () => []
    },
    storeList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      utils,
      params: {
        currentPage: 1,
        pageSize: 10,
        shareholderPlanId: null, // 股东分红方案id
        startJoinTime: "",
        endJoinTime: "",
        status: "enabled",
        storeId: null
      },
      timeRange: [],
      sendRecords: [
        // 表格tags
        {
          label: "已启用",
          value: "enabled"
        },
        {
          label: "已停用",
          value: "disabled"
        },
        {
          label: "已退股",
          value: "quit"
        }
      ],
      storeBonusPlanList: [],
      shareholderData: [], // 股东列表数据
      loading: false,
      batchShareholderIds: [], // 选中的股东ids
      total: null,
      allBonusPlanList: [], // 所有门店的分红方案
      // 自定义全选
      checkAllFlag: false,
      isAllCheck: false,
      pitchRow: {},
      // 总部权益方案
      equityDialogVisible: false,
      equityLoad: false,
      equityList: [],
      remarkDialogVisible: false,
      remarkLoad: false,
      btnLoad: false,
      // 停用
      disableDialogVisible: false,
      disableLoad: false,
      pitchPlanList: [],
      pitchPlanParams: {
        id: null,
        disabledReason: ""
      },
      pitchPlanRules: {
        id: [{ required: true, message: "请选择权益门店", trigger: "change" }]
      },
      // 启用
      toUsingDialogVisible: false,
      toUsingLoad: false,
      // 退股
      quitDialogVisible: false,
      quitLoad: false,
      quitList: [],
      quitForm: {
        id: null,
        quitReason: "",
        quitSecurityFund: null,
        quitType: 1
      },
      quitRules: {
        id: [{ required: true, message: "请选择权益门店", trigger: "change" }],
        quitType: [
          { required: true, message: "请选择权益门店", trigger: "change" }
        ]
      },
      pitchQuitList: [],
      // 充值
      rechargeDialogVisible: false
    };
  },
  mounted() {
    this.getShareholderList();
    if (this.isBrand) {
      this.getStoreBonusPlan(null, "all");
    }
    // 详情页面关闭时，表格数据刷新
    this.$root.$on("needRefreshPage", data => {
      this.success();
    });
  },
  beforeDestroy() {
    this.$root.$off("needRefreshPage");
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    }),
    // 品牌标识
    isBrand() {
      return this.$route.path.indexOf("brand") != -1;
    }
  },
  methods: {
    ...mapActions(["saveShareholderDetail"]),
    // 表头样式设置
    headerStyle({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return "background-color: #F4F5F7;";
      }
    },
    // 检索
    retrieval() {
      this.handlePageChanged(1);
    },
    handleChecked(value) {
      let checkedCount = value.length;
      this.checkAllFlag =
        this.batchShareholderIds.length == this.shareholderData.length;
      this.isAllCheck =
        checkedCount > 0 && checkedCount < this.shareholderData.length;
    },
    // 全选按钮点击
    checkAllChange(checked) {
      // 半选状态取消
      this.isAllCheck = false;
      if (checked) {
        this.shareholderData.forEach((item, index) => {
          if (this.batchShareholderIds.indexOf(item.id) == -1) {
            this.batchShareholderIds.push(item.id);
          }
        });
      } else {
        this.batchShareholderIds = [];
      }
    },
    // 获取股东列表信息
    async getShareholderList() {
      // 门店和品牌的接口不一致
      let url = this.isBrand
        ? "/getBrandShareholderPagedList"
        : "/getShareholderStorePagedList";
      this.loading = true;
      try {
        const res = await axios.post(url, {
          ...this.params,
          brandId: this.currentInfo.brandId,
          storeId: this.isBrand ? this.params.storeId : this.currentInfo.shopId
        });
        this.shareholderData = this.isBrand
          ? res.shareholderListForPageList
          : res.storeInfoForPagedLists;
        this.total = res.total;
      } finally {
        this.loading = false;
      }
    },
    // 获取门店分红方案
    async getStoreBonusPlan(shopId, type) {
      const res = await axios.post("/getShareholderStoreBonusPlanPagedList", {
        brandId: this.currentInfo.brandId,
        currentPage: 0,
        name: null,
        pageSize: 9999,
        storeId: type == "all" ? null : shopId || this.currentInfo.shopId,
        status: "enabled"
      });
      if (type == "all") {
        this.allBonusPlanList = res.planInfoForPagedLists;
      }
      return res;
    },
    // 表格分页切换事件
    handlePageChanged(index) {
      this.params.currentPage = index;
      this.getShareholderList();
      this.batchShareholderIds = [];
      this.checkAllFlag = false;
      this.isAllCheck = false;
    },
    // 设置备注
    async setRemark(row) {
      this.remarkDialogVisible = true;
      let id = this.isBrand ? row.id : row.shareholderId;
      try {
        this.remarkLoad = true;
        const res = await axios.get(`/getShareholderInfoById/${id}`);
        this.pitchRow = res;
      } finally {
        this.remarkLoad = false;
      }
    },
    async remarkConfirm() {
      try {
        this.btnLoad = true;
        const res = await axios.post("/modifyShareholderInfo", this.pitchRow);
        if (!res.success) return this.$message.error("设置失败");
        this.$message.success("设置成功");
        this.remarkDialogVisible = false;
        this.handlePageChanged(this.params.currentPage);
      } finally {
        this.btnLoad = false;
      }
    },
    remarkHandleClose() {
      this.remarkDialogVisible = false;
    },
    // 启用
    toUsing(row) {
      console.log(row);
      this.pitchPlanList = row.equityStoreInfoList.filter(
        i => i.status == "disabled"
      );
      this.toUsingDialogVisible = true;
    },
    toUsingConfirm() {
      this.$refs.pitchPlanParams.validate(async valid => {
        if (!valid) return;
        try {
          this.btnLoad = true;
          const res = await axios.post("/reEnabledShareholderStore", {
            id: this.pitchPlanParams.id
          });
          if (!res.success) this.$message.error("启用失败");
          this.$message.success("启用成功");
          this.toUsingClose();
          this.handlePageChanged(this.params.currentPage);
        } finally {
          this.btnLoad = false;
        }
      });
    },
    toUsingClose() {
      this.$refs.pitchPlanParams.resetFields();
      this.toUsingDialogVisible = false;
    },
    // 详情
    toDetails(row) {
      // // 在品牌中， 股东权益存在开启， 则状态为开启 这个需求设计不合理，暂不计较
      // if (this.isBrand) {
      //   // 存在启用 即为启用
      //   if (row.equityStoreInfoList.some(i => i.status == "enabled")) {
      //     row.status = "enabled";
      //   // 全部禁用 则为禁用。。。
      //   } else if (row.equityStoreInfoList.every(i => i.status == "disabled")) {
      //     row.status = "disabled";
      //   } else {
      //     row.status = "quit";
      //   }
      // }
      row && this.saveShareholderDetail(row);
      // // 在新的标签页中打开推客详情，对id进行加密处理
      // this.toPagesInNewTags(
      //   `/brand-inner/market/market-list/shareholder-detail`
      // );
      window.open(
        `#/brand-inner/market/market-list/shareholder-detail`,
        "_blank"
      );
    },
    // 充值
    recharge(row) {
      this.pitchRow = row;
      this.rechargeDialogVisible = true;
    },
    // 停用
    disable(row) {
      this.pitchPlanList = row.equityStoreInfoList.filter(
        i => i.status == "enabled"
      );
      this.disableDialogVisible = true;
    },
    disableConfirm() {
      this.$refs.pitchPlanParams.validate(async valid => {
        if (!valid) return;
        try {
          this.btnLoad = true;
          const res = await axios.post(
            "/disabledShareholderStore",
            this.pitchPlanParams
          );
          if (!res.success) this.$message.error("停用失败");
          this.$message.success("停用成功");
          this.disableClose();
          this.handlePageChanged(this.params.currentPage);
        } finally {
          this.btnLoad = false;
        }
      });
    },
    disableClose() {
      this.$refs.pitchPlanParams.resetFields();
      this.disableDialogVisible = false;
    },
    // 退股
    withdrawal(row) {
      this.pitchRow = row;
      this.quitList = row.equityStoreInfoList;
      this.quitDialogVisible = true;
      this.$refs.quitForm.clearValidate();
    },
    // 退股权益门店选择
    async quitEquityChange(id) {
      if (id) {
        let pitchQuitList = [];
        this.quitList.map(i => {
          if (i.shareholderStoreId == id) {
            pitchQuitList = [i];
          }
        });
        // 这里还要接口请求数据
        try {
          this.quitLoad = true;
          const res = await axios.post("/getSecurityFundStatistics", {
            shareholderId: this.pitchRow.id,
            storeId: pitchQuitList[0].storeId
          });
          this.pitchQuitList = [
            {
              ...pitchQuitList[0],
              ...res
            }
          ];
          console.log(this.pitchQuitList[0]);
        } finally {
          this.quitLoad = false;
        }
      } else {
        this.pitchQuitList = [];
      }
    },
    quitConfirm() {},
    quitHandleClose() {
      // this.$refs.pitchPlanParams.resetFields();
      this.quitForm.id = null;
      this.pitchQuitList = [];
      this.quitDialogVisible = false;
    },
    equityDetail(row) {
      this.pitchRow = row;
      this.equityList = row.equityStoreInfoList;
      this.equityDialogVisible = true;
    },
    // 权益方案对话框关闭
    equityHandleClose() {
      this.equityDialogVisible = false;
    },
    // 子组件操作完成
    success() {
      this.handlePageChanged(this.params.currentPage);
    },
    shareholderPlanFilter(id) {
      let name;
      this.storeBonusPlan.some(i => {
        if (i.id == id) {
          name = i.name;
          return;
        }
      });
      return name;
    },
    statusType(status) {
      switch (status) {
        case "enabled":
          return "green";
        case "disabled":
          return "orange";
        case "quit":
          return "sgrey";
      }
    },
    statusName(status) {
      switch (status) {
        case "enabled":
          return "已启用";
        case "disabled":
          return "已停用";
        case "quit":
          return "已退股";
      }
    },
    // 启用按钮存在的条件
    toUsingCondition(row) {
      // 只要存在一个停用的权益门店  就显示
      return row.equityStoreInfoList.some(i => i.status == "disabled");
    }
  },
  watch: {
    async "params.storeId"(v, o) {
      this.storeBonusPlanList = [];
      this.params.shareholderPlanId = null;
      if (!v) {
      } else {
        let res = await this.getStoreBonusPlan(v);
        this.storeBonusPlanList = res.planInfoForPagedLists;
      }
    },
    "params.status"(val) {
      this.handlePageChanged(1);
    }
  },
  filters: {}
};
</script>

<style lang="scss" scoped>
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
  overflow: hidden;
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

.table-main {
  width: 100%;
  margin-top: 20px;
  background: #fff;
  box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
  height: calc(100vh - 240px);
  border-radius: 6px;
  .table-box {
    box-sizing: content-box;
    padding: 0 10px;
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

.client_area {
  display: flex;
  .check_single {
    margin: 0 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
  }
  .client_msg {
    display: flex;
    align-items: center;
    width: 80%;
    .client_img {
      margin-left: 5px;
      margin-right: 15px;
      position: relative;
    }
    .client_info {
      width: 95%;
      p {
        text-align: left;
        width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      vertical-align: middle;
    }
    .sex_icon {
      position: absolute;
      width: 14px;
      height: 14px;
      left: 22px;
      top: 0;
    }
  }
}

/deep/ .edit-group {
  span {
    margin-right: 4px;
  }
}

.check_single {
  margin-left: 5px;
  display: inline-block;
  /deep/ .el-checkbox__input {
    margin: 0px 15px 0 0;
  }
  /deep/ .el-checkbox__label {
    display: none;
  }
}

.shareholder-remark {
  display: flex;
  align-items: center;
  .remark-text {
    // 文字两行显示，注意表格的默认提示属性
    max-width: 115px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .set-single {
    margin-left: 5px;
    color: #6ccff3;
    font-size: 16px;
    vertical-align: middle;
    cursor: pointer;
  }
}
.plan-container {
  display: flex;
  align-items: center;
  .plan-title {
    p {
      display: block;
      width: 150px;
      word-break: keep-all;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .plan-detail {
    width: 28px;
    color: #6ccff3;
    cursor: pointer;
  }
}
.equity-dialog {
  /deep/ .el-dialog__header {
    padding-bottom: 20px;
    border-bottom: 1px solid #f4f5f7;
  }
  /deep/ .el-dialog__body {
    padding-top: 10px;
    .equity-container {
      .customer-info {
        height: 62px;
        background-color: #f4f5f7;
        display: flex;
        align-items: center;
        padding-left: 10px;
      }
      .equity-table {
        margin-top: 10px;
      }
    }
  }
}

.disable-container,
.toUsing-container {
  margin-top: 20px;
  margin-left: -50px;
  > p {
    margin-left: 50px;
  }
}

.quit-query-form {
  /deep/ .el-table__empty-block {
    height: 48px !important;
    min-height: 48px !important;
  }
}
</style>