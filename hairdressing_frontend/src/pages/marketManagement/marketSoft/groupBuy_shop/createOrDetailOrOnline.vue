<template>
  <div class="shop-create-group-buy-main" v-loading="loading">
    <seed-header :title="title" :hasTabs="false" :origin="isDetail ? 'otherTags' : 'editProduct'"></seed-header>
    <div class="create-group-buy-main-box scrollbar">
      <div class="group-buy-container">
        <div class="group-buy-body">
          <el-form :model="form" ref="form" :rules="rules" class="query-form">
            <el-form-item label="活动名称:" prop="activityName">
              <el-input
                :disabled="isDetail"
                v-model.trim="form.activityName"
                style="width: 280px;"
                placeholder="请输入活动名称, 2-16字符"
                maxlength="16"
              ></el-input>
            </el-form-item>
            <el-form-item label="活动时间:" :prop="isDetail ? null : 'startTime'" required>
              <el-date-picker
                :disabled="isDetail"
                size="medium"
                v-model="timeValue"
                unlink-panels
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="changeTimeArea"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="参团限制:" prop="adaptMemberType" required>
              <el-radio-group v-model="form.adaptMemberType" :disabled="isDetail">
                <el-radio label="all_user">所有客户</el-radio>
                <el-radio label="new_user">仅新客户</el-radio>
                <!-- <el-radio label="old_user">仅老客户</el-radio> -->
              </el-radio-group>
            </el-form-item>
            <el-form-item label="商品设置:" required style="margin-bottom: 0;">
              <div class="header-line" v-if="!isDetail">
                <el-button plain class="plain_blue_btn" @click="visable_service = true">选择服务</el-button>
                <el-button plain class="plain_blue_btn" @click="visable_product = true">选择产品</el-button>
              </div>
              <div class="table-box">
                <!-- 服务选中表格 -->
                <el-table
                  stripe
                  :data="form.supServiceTable"
                  :header-cell-style="headerRowStyle"
                  empty-text="请选择至少一个拼团服务或产品"
                >
                  <el-table-column show-overflow-tooltip prop="goodsName" label="服务名称"></el-table-column>
                  <el-table-column show-overflow-tooltip prop="specificationName" label="规格"></el-table-column>
                  <el-table-column prop="shopPrice" label="门店价" :width="isDetail ? null : 120">
                    <template slot-scope="scope">￥{{ scope.row.shopPrice }}</template>
                  </el-table-column>
                  <el-table-column label="会员价" v-if="!isDetail">
                    <template slot-scope="scope">
                      {{
                      scope.row.minMemberPrice
                      ? scope.row.minMemberPrice ===
                      scope.row.maxMemberPrice
                      ? `￥${scope.row.minMemberPrice}`
                      : `￥${scope.row.minMemberPrice}-${scope.row.maxMemberPrice}`
                      : "-"
                      }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="cost" label="成本" width="100" v-if="!isDetail">
                    <template slot-scope="scope">{{ scope.row.cost ? "￥" + scope.row.cost : "-" }}</template>
                  </el-table-column>
                  <el-table-column prop="stock" label="库存" width="120" v-if="!isDetail">
                    <template slot-scope="scope">{{ scope.row.stock || "-" }}</template>
                  </el-table-column>
                  <el-table-column
                    prop="groupCondition"
                    label="拼团条件"
                    :width="isDetail ? null : 100"
                  >
                    <template slot-scope="scope">
                      <el-form-item>
                        <el-radio
                          v-model="scope.row.groupCondition"
                          :label="2"
                          :disabled="isDetail"
                        >2人拼</el-radio>
                        <el-radio
                          v-model="scope.row.groupCondition"
                          :label="3"
                          :disabled="isDetail"
                        >3人拼</el-radio>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <!-- 服务 拼团价格 -->
                  <el-table-column prop="groupPrice" label="拼团价格" :width="isDetail ? null : 160">
                    <template slot-scope="scope">
                      <el-form-item
                        :prop="`supServiceTable.${scope.$index}.groupPrice`"
                        :rules="{
                          required: true,
                          validator: validateGroupPrice,
                          trigger: 'change'
                        }"
                      >
                        <el-input
                          placeholder="请输入"
                          v-model="scope.row.groupPrice"
                          :maxlength="8"
                          :disabled="isDetail"
                        >
                          <template slot="append">元</template>
                        </el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <!-- 服务 团长返现 -->
                  <el-table-column prop="cashReward" label="团长返现" :width="isDetail ? null : 160">
                    <!-- 列表头插槽 -->
                    <template slot="header" slot-scope="scope">
                      团长返现
                      <el-tooltip
                        class="item"
                        effect="dark"
                        content="拼团成功后，返现将自动计入用户的“钱包”；不填写表示无返现"
                        placement="top"
                      >
                        <i @mouseenter="mouseEnt_1 = true" @mouseleave="mouseEnt_1 = false">
                          <i
                            v-if="!mouseEnt_1"
                            style="display: inline-block; margin-left: 4px;"
                            :class="{icon: true, iconfont: true, 'icon-icon_order_question': true}"
                          ></i>
                          <i
                            v-else
                            :class="{icon: true, iconfont: true, 'icon-icon_popup_question': true}"
                            style="display: inline-block; color: #F83F63;"
                          ></i>
                        </i>
                      </el-tooltip>
                    </template>
                    <template slot-scope="scope">
                      <el-form-item
                        :prop="`supServiceTable.${scope.$index}.cashReward`"
                        :rules="{
                          required: true,
                          validator: validateCashReward,
                          trigger: 'change'
                        }"
                      >
                        <el-input
                          placeholder="请输入"
                          v-model.number="scope.row.cashReward"
                          :maxlength="8"
                          :disabled="isDetail"
                        >
                          <template slot="append">元</template>
                        </el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <!-- 服务 单人限购 -->
                  <el-table-column prop="buyNumLimit" label="单人限购" :width="isDetail ? null : 160">
                    <!-- 列表头插槽 -->
                    <template slot="header" slot-scope="scope">
                      单人限购
                      <el-tooltip
                        class="item"
                        effect="dark"
                        content="每个用户可购买的数量；0表示不限制"
                        placement="top"
                      >
                        <i @mouseenter="mouseEnt_2 = true" @mouseleave="mouseEnt_2 = false">
                          <i
                            v-if="!mouseEnt_2"
                            style="display: inline-block; margin-left: 4px;"
                            :class="{icon: true, iconfont: true, 'icon-icon_order_question': true}"
                          ></i>
                          <i
                            v-else
                            :class="{icon: true, iconfont: true, 'icon-icon_popup_question': true}"
                            style="display: inline-block; color: #F83F63;"
                          ></i>
                        </i>
                      </el-tooltip>
                    </template>
                    <template slot-scope="scope">
                      <el-form-item
                        :prop="`supServiceTable.${scope.$index}.buyNumLimit`"
                        :rules="{
                          required: true,
                          validator: validateBuyNumLimit,
                          trigger: 'change'
                        }"
                      >
                        <el-input
                          placeholder="请输入自然数"
                          v-model="scope.row.buyNumLimit"
                          :maxlength="8"
                          :disabled="isDetail"
                        >
                          <template slot="append">份</template>
                        </el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <!-- 服务 限购总数 先不做 -->
                  <!-- <el-table-column prop="buyNumLimit" label="限购总数" width="160"> -->
                  <!-- 列表头插槽 -->
                  <!-- <template slot="header" slot-scope="scope">
                      限购总数
                      <el-tooltip class="item" effect="dark" content="总共可购买的数量；到达后拼团自动下线；不填写表示不限制" placement="top">
                        <i class="icon iconfont icon-icon_popup_question"></i>
                      </el-tooltip>
                    </template>
                    <template slot-scope="scope">
                      <el-form-item
                        :prop="`supServiceTable.${scope.$index}.buyNumLimit`"
                        :rules="{required: true, validator: validateBuyNumLimit, trigger: 'change'}"
                      >
                        <el-input placeholder="请输入自然数" v-model="scope.row.buyNumLimit" :maxlength="8">
                          <template slot="append">份</template>
                        </el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>-->
                  <el-table-column label="操作" width="80" v-if="!isDetail">
                    <template slot-scope="scope">
                      <i
                        class="icon iconfont icon-icon_operate_delete"
                        @click="delSelectedService(scope.$index)"
                        v-if="!isDetail"
                      ></i>
                    </template>
                  </el-table-column>
                </el-table>
                <!-- 产品选中表格 -->
                <el-table
                  stripe
                  style="margin-top: 12px;"
                  :header-cell-style="headerRowStyle"
                  :data="form.supProductTable"
                  empty-text="请选择至少一个拼团服务或产品"
                >
                  <el-table-column show-overflow-tooltip prop="goodsName" label="产品名称"></el-table-column>
                  <el-table-column show-overflow-tooltip prop="specificationName" label="规格"></el-table-column>
                  <el-table-column prop="shopPrice" label="专柜价" :width="isDetail ? null : 120">
                    <template slot-scope="scope">￥{{ scope.row.shopPrice }}</template>
                  </el-table-column>
                  <el-table-column label="会员价" v-if="!isDetail">
                    <template slot-scope="scope">
                      {{
                      scope.row.minMemberPrice
                      ? scope.row.minMemberPrice ===
                      scope.row.maxMemberPrice
                      ? `￥${scope.row.minMemberPrice}`
                      : `￥${scope.row.minMemberPrice}-${scope.row.maxMemberPrice}`
                      : "-"
                      }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="cost" label="成本" width="100" v-if="!isDetail">
                    <template slot-scope="scope">{{ scope.row.cost ? "￥" + scope.row.cost : "-" }}</template>
                  </el-table-column>
                  <el-table-column prop="stock" label="库存" width="120" v-if="!isDetail">
                    <template slot-scope="scope">{{ scope.row.stock || "—" }}</template>
                  </el-table-column>
                  <el-table-column
                    prop="groupCondition"
                    label="拼团条件"
                    :width="isDetail ? null : 100"
                  >
                    <template slot-scope="scope">
                      <el-form-item>
                        <el-radio
                          v-model="scope.row.groupCondition"
                          :label="2"
                          :disabled="isDetail"
                        >2人拼</el-radio>
                        <el-radio
                          v-model="scope.row.groupCondition"
                          :label="3"
                          :disabled="isDetail"
                        >3人拼</el-radio>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <!-- 产品 拼团价格 -->
                  <el-table-column prop="groupPrice" label="拼团价格" :width="isDetail ? null : 160">
                    <template slot-scope="scope">
                      <el-form-item
                        :prop="`supProductTable.${scope.$index}.groupPrice`"
                        :rules="{
                          required: true,
                          validator: validateGroupPrice,
                          trigger: 'change'
                        }"
                      >
                        <el-input
                          placeholder="请输入"
                          v-model="scope.row.groupPrice"
                          :maxlength="8"
                          :disabled="isDetail"
                        >
                          <template slot="append">元</template>
                        </el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <!-- 产品 团长返现 -->
                  <el-table-column prop="cashReward" label="团长返现" :width="isDetail ? null : 160">
                    <!-- 列表头插槽 -->
                    <template slot="header" slot-scope="scope">
                      团长返现
                      <el-tooltip
                        class="item"
                        effect="dark"
                        content="拼团成功后，返现将自动计入用户的“钱包”；不填写表示无返现"
                        placement="top"
                      >
                        <i @mouseenter="mouseEnt_3 = true" @mouseleave="mouseEnt_3 = false">
                          <i
                            v-if="!mouseEnt_3"
                            style="display: inline-block; margin-left: 4px;"
                            :class="{icon: true, iconfont: true, 'icon-icon_order_question': true}"
                          ></i>
                          <i
                            v-else
                            :class="{icon: true, iconfont: true, 'icon-icon_popup_question': true}"
                            style="display: inline-block; color: #F83F63;"
                          ></i>
                        </i>
                      </el-tooltip>
                    </template>
                    <template slot-scope="scope">
                      <el-form-item
                        :prop="`supProductTable.${scope.$index}.cashReward`"
                        :rules="{
                          required: true,
                          validator: validateCashReward,
                          trigger: 'change'
                        }"
                      >
                        <el-input
                          placeholder="请输入"
                          :disabled="isDetail"
                          v-model.number="scope.row.cashReward"
                          :maxlength="8"
                        >
                          <template slot="append">元</template>
                        </el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <!-- 产品 单人限购 -->
                  <el-table-column prop="buyNumLimit" label="单人限购" :width="isDetail ? null : 160">
                    <!-- 列表头插槽 -->
                    <template slot="header" slot-scope="scope">
                      单人限购
                      <el-tooltip
                        class="item"
                        effect="dark"
                        content="每个用户可购买的数量；0表示不限制"
                        placement="top"
                      >
                        <i @mouseenter="mouseEnt_4 = true" @mouseleave="mouseEnt_4 = false">
                          <i
                            v-if="!mouseEnt_4"
                            style="display: inline-block; margin-left: 4px;"
                            :class="{icon: true, iconfont: true, 'icon-icon_order_question': true}"
                          ></i>
                          <i
                            v-else
                            :class="{icon: true, iconfont: true, 'icon-icon_popup_question': true}"
                            style="display: inline-block; color: #F83F63;"
                          ></i>
                        </i>
                      </el-tooltip>
                    </template>
                    <!-- 列内容 -->
                    <template slot-scope="scope">
                      <el-form-item
                        :prop="`supProductTable.${scope.$index}.buyNumLimit`"
                        :rules="{
                          required: true,
                          validator: validateBuyNumLimit,
                          trigger: 'change'
                        }"
                      >
                        <el-input
                          placeholder="请输入自然数"
                          v-model="scope.row.buyNumLimit"
                          :maxlength="8"
                          :disabled="isDetail"
                        >
                          <template slot="append">份</template>
                        </el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="80" v-if="!isDetail">
                    <template slot-scope="scope">
                      <i
                        class="icon iconfont icon-icon_operate_delete"
                        @click="delSelectedProduct(scope.$index)"
                        v-if="!isDetail"
                      ></i>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-form-item>
            <el-form-item label="自动成团:" prop="autoGroupWhenDue" style="margin-bottom: 0;">
              <el-switch
                v-model="form.autoGroupWhenDue"
                active-color="#0099FF"
                inactive-color="#cccccc"
                :disabled="isDetail"
              ></el-switch>
              <p class="indent-text">开启后，有效期到期时未达到成团人数的，将自动成团，按成交处理。</p>
            </el-form-item>
            <el-form-item
              label="参团人数:"
              prop="virtualNumber"
              :rules="{
                required: false,
                validator: validateBuyNumLimit,
                trigger: 'change'
              }"
              style="margin-bottom: 5px;"
            >
              <el-switch
                @change="changeSwitch"
                v-model="virtualNumberFlag"
                active-color="#0099FF"
                inactive-color="#cccccc"
                :disabled="isDetail"
              ></el-switch>实际参团人数+
              <el-input
                placeholder="限制自然数"
                style="width: 120px;"
                maxlength="8"
                :min="1"
                v-model.number="form.virtualNumber"
                :disabled="isDetail"
              ></el-input>虚拟参团(0表示不虚拟参团)
              <p class="indent-text">开启后，拼团页面将展示“已有xx人成功拼团，参团人数为实际参团与虚拟人数之和，实时更新”。</p>
            </el-form-item>
            <el-form-item label="人数累加:" prop="cumulateCustomerCount" style="margin-bottom: 0;">
              <el-switch
                v-model="cumulateCustomerCountFlag"
                active-color="#0099FF"
                inactive-color="#cccccc"
                :disabled="isDetail"
              ></el-switch>
              <p class="indent-text">开启后，同一商品不同时间段的拼团人数将累加显示。</p>
            </el-form-item>
            <!-- <el-form-item
              label="虚拟参团人数:"
              prop="virtualNumber"
              :rules="{
                required: false,
                validator: validateBuyNumLimit,
                trigger: 'change'
              }"
            >
              <el-input
                placeholder="请输入自然数"
                style="width: 200px;"
                maxlength="8"
                v-model.number="form.virtualNumber"
              ></el-input>
            </el-form-item>-->
            <!-- <el-form-item 
              label="生效时间"
              prop="effectiveType"
              :rules="{required: true, validator: validateUpperTime}"
            >
              <el-radio v-model="form.effectiveType" :label="true">即时生效</el-radio>
              <el-radio v-model="form.effectiveType" :label="false">
                指定时间&nbsp;
                <el-date-picker
                  :disabled="form.effectiveType"
                  v-model="form.effectiveTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="setDisabledDate"
                  type="datetime"
                  placeholder="选择日期时间"
                >
                </el-date-picker>
              </el-radio>
            </el-form-item>-->
          </el-form>
          <div class="bottom-line">
            <el-button
              class="normal_blue_btn"
              @click="createScheme"
              :loading="btnLoading"
              v-if="!isDetail"
            >确定</el-button>
            <el-button plain class="plain_gray_btn" @click="cancal" v-if="!isDetail">取消</el-button>
            <el-button plain class="plain_gray_btn" @click="close" v-else>关闭</el-button>
          </div>
        </div>
      </div>
    </div>
    <serviceDialog
      v-if="visable_service"
      :visible="visable_service"
      @close="visable_service = false"
      @suberData="getServiceDataFromSuber"
      :superCheckedGoods="selectedServicesIds"
    />
    <productDialog
      v-if="visable_product"
      :visible="visable_product"
      @close="visable_product = false"
      @suberData="getProductDataFromSuber"
      :superCheckedGoods="selectedProductsIds"
    />
  </div>
</template>
<script>
import * as axios from "@/util/axios";
import { mapActions, mapState } from "vuex";
import productDialog from "./components/productsDialog";
import serviceDialog from "./components/serviceDialog";
import { reg, checkReg } from "@/assets/js/RegExp";
import { Base64 } from "js-base64";
export default {
  data() {
    return {
      headerRowStyle: { background: "#f4f5f7" }, // 表头样式
      timeValue: [], //
      form: {
        activityName: "",
        adaptMemberType: "all_user", // 团员类型 [ new_user, all_user, old_user ]
        startTime: "",
        endTime: "",
        // effectiveType: true, // - v2 废弃
        // effectiveTime: null, // - v2 废弃
        supServiceTable: [], // 本页
        supProductTable: [], // 本页
        autoGroupWhenDue: false,
        virtualNumber: null
      },
      // 人数累加标识
      cumulateCustomerCountFlag: true,
      // 参团人数标识
      virtualNumberFlag: false,
      loading: false,
      // 子组件
      /* 服务选项及选中项 start */
      visable_service: false,
      subServiceTable: [],
      selectedServices: [],
      selectedServicesIds: new Set(),
      selectedServicesObj: {},
      /* 服务选项及选中项 end */
      /* 产品选项及选中项 start */
      visable_product: false,
      subProductTable: [],
      selectedProducts: [],
      selectedProductsIds: new Set(),
      selectedProductsObj: {},
      /* 产品选项及选中项 end */
      rules: {
        activityName: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 2, max: 16, message: "长度在 2 到 16 个字符", trigger: "blur" }
        ],
        startTime: [
          { required: true, message: "请选择活动起止时间", trigger: "change" }
        ]
      },
      btnLoading: false,
      mouseEnt_1: false,
      mouseEnt_2: false,
      mouseEnt_3: false,
      mouseEnt_4: false
    };
  },
  created() {
    if (this.isDetail || this.isReset) {
      // console.log(1)
      this.getActivityInfo();
    }
  },
  methods: {
    changeSwitch(val) {},
    // 详情或重新上线获取活动信息
    async getActivityInfo() {
      console.log(Object.keys(this.$route.query));
      let groupIdTypeEnum =
        Object.keys(this.$route.query)[0] === "all" ? "SETTING_ID" : "RULE_ID";
      let id = Base64.decode(
        this.$route.query[Object.keys(this.$route.query)[0]]
      );
      const res = await axios.post("/getGroupPurchaseInfo", {
        groupIdTypeEnum,
        id
      });
      this.form = res;
      this.form.supServiceTable = [];
      this.form.supProductTable = [];
      res.groupPurchaseRuleList.forEach(item => {
        if (item.goodsType == "service") {
          this.form.supServiceTable.push(item);
        } else {
          this.form.supProductTable.push(item);
        }
      });
      this.timeValue = [res.startTime, res.endTime];
      this.virtualNumberFlag = !!res.virtualNumber;
      this.cumulateCustomerCountFlag = !!res.groupPurchaseRuleList[0]
        .cumulateCustomerCount || false;
      // 子组件也跟随恢复数据
      this.form.supServiceTable &&
        this.form.supServiceTable.map(i => {
          this.selectedServicesIds.add(i.specificationId);
          this.selectedServicesObj[i.specificationId] = i;
        });
      this.form.supProductTable &&
        this.form.supProductTable.map(i => {
          this.selectedProductsIds.add(i.specificationId);
          this.selectedProductsObj[i.specificationId] = i;
        });
      // 老拼团活动重新上线和详情兼容
      this.form.adaptMemberType = this.form.adaptMemberType || "all_user";
      this.form.autoGroupWhenDue = this.form.autoGroupWhenDue || false;
      this.form.groupPurchaseRuleList.forEach(item => {
        item.cumulateCustomerCount = item.cumulateCustomerCount || 0
      })
    },
    createScheme() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let final = this.form.supServiceTable.concat(
            this.form.supProductTable
          );
          final.map(i => {
            i.cashReward = i.cashReward || 0;
            i.storeId = this.currentInfo.shopId;
            i.effectiveType = this.form.effectiveType;
            i.effectiveTime = this.form.effectiveType
              ? null
              : this.form.effectiveTime;
            i.cumulateCustomerCount = this.cumulateCustomerCountFlag ? 1 : 0;
          });
          if (!final.length) {
            this.$message({
              type: "error",
              message: "请至少选择一个拼团项目"
            });
            return false;
          }
          this.loading = true;
          let form = {
            ...this.form,
            storeId: this.currentInfo.shopId,
            groupPurchaseRuleList: final
          };
          // 对参团人数的参数进行处理
          form.virtualNumber = this.virtualNumberFlag
            ? this.form.virtualNumber
            : 0;
          // 参团人员是否累加处理
          form.cumulateCustomerCount = form.groupPurchaseRuleList[0].cumulateCustomerCount
          // 以下包括url 为详情和重新上线的参数或者请求处理
          if (this.isReset || this.isDetail) {
            form.originId = form.id;
            form.groupPurchaseRuleList.forEach(item => {
              item.originId = item.id;
              delete item.status;
              delete item.id;
            });
          }
          delete form.id;
          delete form.supServiceTable;
          delete form.supProductTable;
          this.btnLoading = true;
          let url = this.isReset
            ? "/restartGroupRule"
            : "/saveStoreGroupBuyRuleList";
          axios.post(url, form).then(res => {
            this.$message({
              type: res.success ? "success" : "error",
              message: res.message
            });
            res.success && this.cancal();
            this.loading = false;
            this.btnLoading = false;
          });
        } else {
          this.$message({
            type: "error",
            message: "请先完善拼团数据"
          });
        }
      });
    },
    changeTimeArea(arr) {
      if (arr && arr.length) {
        this.form.startTime = arr[0];
        this.form.endTime = arr[1];
      } else {
        this.form.startTime = null;
        this.form.endTime = null;
      }
    },
    // - 保存服务
    getServiceDataFromSuber(obj) {
      console.log(obj);
      obj.yes.map(i => {
        if (!this.selectedServicesIds.has(i.specificationId)) {
          this.selectedServicesIds.add(i.specificationId);
          this.selectedServicesObj[i.specificationId] = {
            groupCondition: 2, // 拼团条件 默认2?
            groupPrice: null,
            cashReward: null,
            buyNumLimit: 0,
            cumulateCustomerCount: this.cumulateCustomerCountFlag ? 1 : 0,
            ...i
          };
        }
      });
      obj.no.map(i => {
        if (this.selectedServicesIds.has(i.specificationId)) {
          this.selectedServicesIds.delete(i.specificationId);
          delete this.selectedServicesObj[i.specificationId];
        }
      });
      this.form.supServiceTable = Object.values(this.selectedServicesObj);
    },
    // - 删除服务
    delSelectedService(idx) {
      let id = this.form.supServiceTable[idx].specificationId;
      this.selectedServicesIds.delete(id);
      delete this.selectedServicesObj[id];
      this.form.supServiceTable.splice(idx, 1);
    },
    // - 保存产品
    getProductDataFromSuber(obj) {
      obj.yes.map(i => {
        if (!this.selectedProductsIds.has(i.specificationId)) {
          this.selectedProductsIds.add(i.specificationId);
          this.selectedProductsObj[i.specificationId] = {
            groupCondition: 2, // 拼团条件 默认2?
            groupPrice: null,
            cashReward: null,
            buyNumLimit: 0,
            cumulateCustomerCount: this.cumulateCustomerCountFlag ? 1 : 0,
            ...i
          };
        }
      });
      obj.no.map(i => {
        if (this.selectedProductsIds.has(i.specificationId)) {
          this.selectedProductsIds.delete(i.specificationId);
          delete this.selectedProductsObj[i.specificationId];
        }
      });
      this.form.supProductTable = Object.values(this.selectedProductsObj);
    },
    // - 删除产品
    delSelectedProduct(idx) {
      let id = this.form.supProductTable[idx].specificationId;
      this.selectedProductsIds.delete(id);
      delete this.selectedProductsObj[id];
      this.form.supProductTable.splice(idx, 1);
    },
    cancal() {
      this.$router.go(-1);
    },
    close() {
      window.close();
    },

    // 校验生效时间
    validateUpperTime(rule, value, callback) {
      if (this.form.effectiveType) {
        callback();
      } else {
        if (this.form.effectiveTime) {
          callback();
        } else {
          callback(new Error("请选择一个生效时间"));
        }
      }
    },
    // 校验拼团返现
    validateCashReward(rule, value, callback) {
      if (reg.num.test(value) || value === null || value === "") {
        callback();
      } else {
        callback(new Error("请输入0~9999之间的自然数"));
      }
    },
    // 校验拼团价格
    validateGroupPrice(rule, value, callback) {
      if (/^([0-9]{1,8}|[0-9]{1,8}(\.\d{0,2}))$/.test(value)) {
        callback();
      } else {
        callback(new Error("请输入一个数字"));
      }
    },
    // 校验单人限购 / 虚拟参团人数
    validateBuyNumLimit(rule, value, callback) {
      if (!rule.required && !value) {
        return callback();
      }
      if (/^([0-9]{1,8})$/.test(value)) {
        callback();
      } else {
        callback(new Error("请输入一个自然数"));
      }
    }
  },
  watch: {
    "form.effectiveType"(v, o) {
      this.$refs.form.validateField("effectiveType");
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    }),
    setDisabledDate() {
      return {
        disabledDate: time => {
          return time.getTime() < Date.now() - 8.64e7;
        }
      };
    },
    title() {
      if (this.$route.path.indexOf("create") !== -1) {
        return "设置拼团";
      } else if (this.$route.path.indexOf("reset") !== -1) {
        return "重新上线拼团";
      } else {
        return "拼团详情";
      }
    },
    // 详情标识
    isDetail() {
      return this.$route.path.indexOf("detail") !== -1;
    },
    // 重新上线标识
    isReset() {
      return this.$route.path.indexOf("reset") !== -1;
    }
  },
  components: { productDialog, serviceDialog }
};
</script>
<style lang="scss" scoped>
@import "@/assets/css/scrollbar.scss";
.shop-create-group-buy-main {
  display: flex;
  justify-content: center;
  .create-group-buy-main-box {
    width: calc(100vw - 40px);
    height: calc(100vh - 105px);
    padding: 0 20px 20px;
    margin-top: 85px;
    overflow-y: auto;
  }
  .group-buy-container {
    min-height: calc(100vh - 105px);
  }
  .group-buy-body {
    max-width: 1440px;
    box-sizing: border-box;
    padding: 36px 72px 85px;
    margin: 0 auto;
    background: #fff;
    border-radius: 6px;
    /* ==== */
    min-height: calc(100vh - 105px);
  }
}

.plain_blue_btn {
  padding: 9px;
}
.normal_blue_btn {
  padding: 12px 37px;
}
.table-box {
  box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
  margin: 20px 0;
  /deep/ .el-radio,
  /deep/ .el-form-item {
    margin: 0;
  }
  /deep/ .el-input-group__append {
    padding: 0 12px;
  }
}

.icon-icon_popup_question {
  margin-left: 4px;
  cursor: help;
  color: #999;
}

.indent-text {
  text-indent: 60px;
  color: #999;
  font-size: 12px;
}

.mouse-ent {
  display: inline-block;
  border-radius: 50%;
  background-color: #ac7937;
  color: #fff;
}
</style>
