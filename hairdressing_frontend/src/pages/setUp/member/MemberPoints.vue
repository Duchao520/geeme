<template>
  <div class="point-main" v-loading.fullscreen="pageLoading">
    <el-form label-width="0px" ref="form" :model="form">
      <!-- 统计 -->
      <div class="total-line" v-loading="totalLoading">
        <totalDataInPiece :list="list" />
      </div>
      <!-- 获取规则 -->
      <div class="get-rule-box">
        <div class="title-line">
          <span class="red">*</span>
          <span class="bold">获得规则:</span>
        </div>
        <el-table
          stripe
          :data="form.tableData"
          :span-method="arraySpanMethod"
          header-cell-class-name="bold-cell-text"
        >
          <el-table-column label="获取行为" prop="behaviour"></el-table-column>
          <el-table-column label="附件条件" prop="condition"></el-table-column>
          <el-table-column label="获得积分" prop="intVal">
            <template slot-scope="{row}">
              <!-- int 纯整数，可不校验 -->
              <el-input
                style="width: 100px;"
                size="small"
                :maxlength="5"
                v-model.number="row.intVal"
                placeholder="限填数字"
              ></el-input>
              {{row.intValPad}}
            </template>
          </el-table-column>
          <el-table-column label="获得上限">
            <template slot-scope="{row}">
              <el-form-item>
                <div>
                  <el-radio-group v-model="row.limitType" v-if="!row.limitFlag">
                    <el-radio label="UN_LIMIT">无上限</el-radio>
                    <el-radio label="LIMIT">
                      <!-- int 纯整数，可不校验 -->
                      <el-input
                        :disabled="row.limitType === 'UN_LIMIT'"
                        style="width: 100px;"
                        :maxlength="5"
                        size="small"
                        v-model.number="row.limitVal"
                        placeholder="限填数字"
                      ></el-input>
                      {{row.limitValPad}}
                    </el-radio>
                  </el-radio-group>
                  <p v-else>{{row.intVal ? row.intVal + '点' : '-'}}</p>
                </div>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 使用场景 -->
      <div class="use-scene-box">
        <div class="title-line">
          <span class="red">*</span>
          <span class="bold">使用规则:</span>
        </div>
        <el-table stripe :data="form.sceneTableData" header-cell-class-name="bold-cell-text">
          <el-table-column label="使用场景" prop="allowed">
            <template slot-scope="{row}">
              <el-checkbox v-model="row.allowed">{{row.usageScenarios | usageScenariosFilter}}</el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="积分抵扣金额上限" prop="orderPointsUsePercent" class-name="flex-line">
            <template slot-scope="scope">
              不能超过应付金额的&nbsp;
              <!-- 后端是int 不能超过100% -->
              <el-form-item
                :prop="`sceneTableData.${scope.$index}.orderPointsUsePercent`"
                :rules="{required: scope.row.allowed, validator: percentValidator, trigger: 'change'}"
              >
                <el-input
                  v-model.number="scope.row.orderPointsUsePercent"
                  style="width: 120px;"
                  size="small"
                  :maxlength="3"
                >
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="积分抵扣折算比例" prop="pointsValueMoney" class-name="flex-line">
            <template slot-scope="scope">
              1积分 = &nbsp;
              <!-- 后端是number -->
              <el-form-item
                :prop="`sceneTableData.${scope.$index}.pointsValueMoney`"
                :rules="{required: scope.row.allowed, validator: moneyValidator, trigger: 'change'}"
              >
                <el-input
                  v-model="scope.row.pointsValueMoney"
                  style="width: 120px;"
                  size="small"
                  :maxlength="5"
                >
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 扣减规则 -->
      <div class="use-rule-box">
        <div class="title-line">
          <span class="red">*</span>
          <span class="bold">扣减规则:</span>
        </div>
        <div class="use-rule-list">
          <div class="use-rule-line">
            <el-checkbox v-model="form.useRule.orderRefundReducePoints">订单退款时，按退款金额比例扣减对应订单积分</el-checkbox>
          </div>
          <div class="use-rule-line">
            <el-checkbox v-model="form.useRule.consumerOrderCancelReducePoints">消费账单撤单时，扣减对应账单积分</el-checkbox>
          </div>
          <div class="use-rule-line">
            <el-checkbox v-model="form.useRule.deleteEvaluateReducePoints">完成订单评价后删除评价时，扣减对应评价积分</el-checkbox>
          </div>
          <div class="use-rule-line">
            <el-checkbox v-model="form.useRule.deleteCommentReducePoints">动态评论后删除评论时，扣减对应评论积分</el-checkbox>
          </div>
          <div class="use-rule-line">
            <el-checkbox v-model="form.useRule.pointsToCash" disabled>积分不找零，不折现</el-checkbox>
          </div>
          <el-form-item label="备注:" label-width="40px">
            <inputWithCount
              v-model.trim="remarks"
              placeholder="如需备注，请输入。"
              style="width: 300px; margin-top: 12px;"
            />
          </el-form-item>
        </div>
      </div>
      <!-- 有效期限 -->
      <div class="exceed-rule-box">
        <div class="title-line">
          <span class="red">*</span>
          <span class="bold">有效期设置:</span>
        </div>
        <div class="exceed-rule-list">
          <el-radio-group v-model="form.exceedRule">
            <el-radio label="next_year">次年年底清零</el-radio>
            <el-radio label="current_year">当年年底清零</el-radio>
            <el-radio label="permanent">永久有效</el-radio>
          </el-radio-group>
        </div>
      </div>

      <!-- 启用设置 -->
      <div class="exceed-rule-box">
        <div class="title-line">
          <span class="red">*</span>
          <span class="bold">启用设置:</span>
        </div>
        <div class="exceed-rule-list">
          <el-radio-group v-model="form.enabled">
            <el-radio :label="true">
              启用
              <span class="exceed-rule-small-text">(上述规则即时生效)</span>
            </el-radio>
            <el-radio :label="false">获取规则停用</el-radio>
          </el-radio-group>
        </div>
      </div>

      <el-button class="normal_red_btn" @click="submit">保存修改</el-button>
    </el-form>
    <!-- 生效提示框 -->
    <g-del-model
      :delTagDialogVisible="integralTakeHintVisible"
      @close="integralTakeHintVisible=false"
      @confirm="integralTakeHintVisible=false"
      :title="'会员积分功能未生效！'"
      :content="'如需启用积分功能，请在页面下方“启用设置”处，选择“启用”选框，并点击“保存修改”按钮。'"
      :icon="'icon_popup_plaint'"
      :iconColor="'#FCB322'"
    ></g-del-model>
  </div>
</template>
<script>
import * as axios from "@/util/axios";
import { mapState } from "vuex";
export default {
  data() {
    return {
      firstColSpan: [], // 使用规格合并
      form: {
        sceneTableData: [
          {
            ruleId: null,
            brandId: null,
            usageScenarios: 1,
            pointsValueMoney: 0.01,
            orderPointsUsePercent: 10,
            allowed: true
          },
          {
            ruleId: null,
            brandId: null,
            usageScenarios: 2,
            pointsValueMoney: 0.01,
            orderPointsUsePercent: 10,
            allowed: true
          }
        ], // 使用场景
        // 获得规则
        tableData: [
          {
            behaviour: "首次登陆网店并绑定手机号", // 行为名称(用于合并单元格及显示第一列)
            condition: "无", // 附件条件
            intKey: "loginAndBindPhoneIntegral", // 获取积分的字段
            limitTypeKey: "loginAndBindPhoneIntegralLimitType", // 是否限制
            limitValKey: "loginAndBindPhoneIntegralLimitVal", // 限制后的值
            intVal: 10, // 默认值 - 获得积分
            limitVal: null, // 默认值 - 积分上限
            limitType: "UN_LIMIT", // 默认值 - 是否上限
            intValPad: "积分",
            limitValPad: "点/天",
            limitFlag: true
          },
          {
            behaviour: "完善个人资料", // 行为名称(用于合并单元格及显示第一列)
            condition: "头像/昵称/性别/生日/居住地", // 附件条件
            intKey: "improvementOfPersonalDataIntegral", // 获取积分的字段
            limitTypeKey: "improvementOfPersonalDataIntegralLimitType", // 是否限制
            limitValKey: "improvementOfPersonalDataIntegralLimitVal", // 限制后的值
            intVal: 10, // 默认值 - 获得积分
            limitVal: null, // 默认值 - 积分上限
            limitType: "UN_LIMIT", // 默认值 - 是否上限
            intValPad: "积分",
            limitValPad: "点/天",
            limitFlag: true
          },
          // 线上服务
          {
            behaviour: "线上购买服务", // 行为名称(用于合并单元格及显示第一列)
            condition: "储值卡支付", // 附件条件
            intKey: "onlineBuyServiceByCardIntegral", // 获取积分的字段
            limitTypeKey: "onlineBuyServiceByCardIntegralLimitType", // 是否限制
            limitValKey: "onlineBuyServiceByCardIntegralLimitVal", // 限制后的值
            intVal: 1, // 默认值 - 获得积分
            limitVal: null, // 默认值 - 积分上限
            limitType: "UN_LIMIT", // 默认值 - 是否上限
            intValPad: "积分/元",
            limitValPad: "点/天"
          },
          {
            behaviour: "线上购买服务", // 行为名称(用于合并单元格及显示第一列)
            condition: "现金类支付", // 附件条件
            intKey: "onlineBuyServiceByCashIntegral", // 获取积分的字段
            limitTypeKey: "onlineBuyServiceByCashIntegralLimitType", // 是否限制
            limitValKey: "onlineBuyServiceByCashIntegralLimitVal", // 限制后的值
            intVal: 1, // 默认值 - 获得积分
            limitVal: null, // 默认值 - 积分上限
            limitType: "UN_LIMIT", // 默认值 - 是否上限
            intValPad: "积分/元",
            limitValPad: "点/天"
          },
          // 线上产品
          {
            behaviour: "线上购买产品", // 行为名称(用于合并单元格及显示第一列)
            condition: "储值卡支付", // 附件条件
            intKey: "onlineBuyProductByCardIntegral", // 获取积分的字段
            limitTypeKey: "onlineBuyProductByCardIntegralLimitType", // 是否限制
            limitValKey: "onlineBuyProductByCardIntegralLimitVal", // 限制后的值
            intVal: 1, // 默认值 - 获得积分
            limitVal: null, // 默认值 - 积分上限
            limitType: "UN_LIMIT", // 默认值 - 是否上限
            intValPad: "积分/元",
            limitValPad: "点/天"
          },
          {
            behaviour: "线上购买产品", // 行为名称(用于合并单元格及显示第一列)
            condition: "现金类支付", // 附件条件
            intKey: "onlineBuyProductByCashIntegral", // 获取积分的字段
            limitTypeKey: "onlineBuyProductByCashIntegralLimitType", // 是否限制
            limitValKey: "onlineBuyProductByCashIntegralLimitVal", // 限制后的值
            intVal: 1, // 默认值 - 获得积分
            limitVal: null, // 默认值 - 积分上限
            limitType: "UN_LIMIT", // 默认值 - 是否上限
            intValPad: "积分/元",
            limitValPad: "点/天"
          },
          // 线上卡项 - 新购
          {
            behaviour: "线上购买卡项", // 行为名称(用于合并单元格及显示第一列)
            condition: "储值卡支付", // 附件条件
            intKey: "onlineBuyCardByCardIntegral", // 获取积分的字段
            limitTypeKey: "onlineBuyCardByCardIntegralLimitType", // 是否限制
            limitValKey: "onlineBuyCardByCardIntegralLimitVal", // 限制后的值
            intVal: 1, // 默认值 - 获得积分
            limitVal: null, // 默认值 - 积分上限
            limitType: "UN_LIMIT", // 默认值 - 是否上限
            intValPad: "积分/元",
            limitValPad: "点/天"
          },
          {
            behaviour: "线上购买卡项", // 行为名称(用于合并单元格及显示第一列)
            condition: "现金类支付", // 附件条件
            intKey: "onlineBuyCardByCashIntegral", // 获取积分的字段
            limitTypeKey: "onlineBuyCardByCashIntegralLimitType", // 是否限制
            limitValKey: "onlineBuyCardByCashIntegralLimitVal", // 限制后的值
            intVal: 1, // 默认值 - 获得积分
            limitVal: null, // 默认值 - 积分上限
            limitType: "UN_LIMIT", // 默认值 - 是否上限
            intValPad: "积分/元",
            limitValPad: "点/天"
          },
          // 线上卡项 - 续卡
          {
            behaviour: "线上续卡充值", // 行为名称(用于合并单元格及显示第一列)
            condition: "储值卡支付", // 附件条件
            intKey: "onlineRenewCardByCardIntegral", // 获取积分的字段
            limitTypeKey: "onlineRenewCardByCardIntegralLimitType", // 是否限制
            limitValKey: "onlineRenewCardByCardIntegralLimitVal", // 限制后的值
            intVal: 1, // 默认值 - 获得积分
            limitVal: null, // 默认值 - 积分上限
            limitType: "UN_LIMIT", // 默认值 - 是否上限
            intValPad: "积分/元",
            limitValPad: "点/天"
          },
          {
            behaviour: "线上续卡充值", // 行为名称(用于合并单元格及显示第一列)
            condition: "现金类支付", // 附件条件
            intKey: "onlineRenewCardByCashIntegral", // 获取积分的字段
            limitTypeKey: "onlineRenewCardByCashIntegralLimitType", // 是否限制
            limitValKey: "onlineRenewCardByCashIntegralLimitVal", // 限制后的值
            intVal: 1, // 默认值 - 获得积分
            limitVal: null, // 默认值 - 积分上限
            limitType: "UN_LIMIT", // 默认值 - 是否上限
            intValPad: "积分/元",
            limitValPad: "点/天"
          },
          // 线上预约并开单
          {
            behaviour: "线上预约并完成开单", // 行为名称(用于合并单元格及显示第一列)
            condition: "无", // 附件条件
            intKey: "onlineAppointmentAndOrderIntegral", // 获取积分的字段
            limitTypeKey: "onlineAppointmentAndOrderIntegralLimitType", // 是否限制
            limitValKey: "onlineAppointmentAndOrderIntegralLimitVal", // 限制后的值
            intVal: 10, // 默认值 - 获得积分
            limitVal: 50, // 默认值 - 积分上限
            limitType: "LIMIT", // 默认值 - 是否上限
            intValPad: "积分/次",
            limitValPad: "点/天"
          },
          // 线上拼团并成团
          {
            behaviour: "线上发起拼团并成团", // 行为名称(用于合并单元格及显示第一列)
            condition: "2人拼团", // 附件条件
            intKey: "onlineGroupBuyAndComplete2Integral", // 获取积分的字段
            limitTypeKey: "onlineGroupBuyAndComplete2IntegralLimitType", // 是否限制
            limitValKey: "onlineGroupBuyAndComplete2IntegralLimitVal", // 限制后的值
            intVal: 1.5, // 默认值 - 获得积分
            limitVal: null, // 默认值 - 积分上限
            limitType: "UN_LIMIT", // 默认值 - 是否上限
            intValPad: "积分/元",
            limitValPad: "点/天"
          },
          {
            behaviour: "线上发起拼团并成团", // 行为名称(用于合并单元格及显示第一列)
            condition: "3人拼团", // 附件条件
            intKey: "onlineGroupBuyAndComplete3Integral", // 获取积分的字段
            limitTypeKey: "onlineGroupBuyAndComplete3IntegralLimitType", // 是否限制
            limitValKey: "onlineGroupBuyAndComplete3IntegralLimitVal", // 限制后的值
            intVal: 2, // 默认值 - 获得积分
            limitVal: null, // 默认值 - 积分上限
            limitType: "UN_LIMIT", // 默认值 - 是否上限
            intValPad: "积分/元",
            limitValPad: "点/天"
          },
          // 推广商品给好友成功购买
          {
            behaviour: "推广商品给好友成功购买", // 行为名称(用于合并单元格及显示第一列)
            condition: "无", // 附件条件
            intKey: "successfulProductPromotionIntegral", // 获取积分的字段
            limitTypeKey: "successfulProductPromotionIntegralLimitType", // 是否限制
            limitValKey: "successfulProductPromotionIntegralLimitVal", // 限制后的值
            intVal: 2, // 默认值 - 获得积分
            limitVal: null, // 默认值 - 积分上限
            limitType: "UN_LIMIT", // 默认值 - 是否上限
            intValPad: "积分/元",
            limitValPad: "点/天"
          },
          // 线上消费账单买单
          {
            behaviour: "线上消费账单买单", // 行为名称(用于合并单元格及显示第一列)
            condition: "储值卡支付", // 附件条件
            intKey: "onlineConsumerOrderPayByCardIntegral", // 获取积分的字段
            limitTypeKey: "onlineConsumerOrderPayByCardIntegralLimitType", // 是否限制
            limitValKey: "onlineConsumerOrderPayByCardIntegralLimitVal", // 限制后的值
            intVal: 1.5, // 默认值 - 获得积分
            limitVal: null, // 默认值 - 积分上限
            limitType: "UN_LIMIT", // 默认值 - 是否上限
            intValPad: "积分/元",
            limitValPad: "点/天"
          },
          {
            behaviour: "线上消费账单买单", // 行为名称(用于合并单元格及显示第一列)
            condition: "现金类支付", // 附件条件
            intKey: "onlineConsumerOrderPayByCashIntegral", // 获取积分的字段
            limitTypeKey: "onlineConsumerOrderPayByCashIntegralLimitType", // 是否限制
            limitValKey: "onlineConsumerOrderPayByCashIntegralLimitVal", // 限制后的值
            intVal: 1.5, // 默认值 - 获得积分
            limitVal: null, // 默认值 - 积分上限
            limitType: "UN_LIMIT", // 默认值 - 是否上限
            intValPad: "积分/元",
            limitValPad: "点/天"
          },
          // 门店收银台买单
          {
            behaviour: "门店收银台买单", // 行为名称(用于合并单元格及显示第一列)
            condition: "储值卡支付", // 附件条件
            intKey: "shopCheckstandPayByCardIntegral", // 获取积分的字段
            limitTypeKey: "shopCheckstandPayByCardIntegralLimitType", // 是否限制
            limitValKey: "shopCheckstandPayByCardIntegralLimitVal", // 限制后的值
            intVal: 1, // 默认值 - 获得积分
            limitVal: null, // 默认值 - 积分上限
            limitType: "UN_LIMIT", // 默认值 - 是否上限
            intValPad: "积分/元",
            limitValPad: "点/天"
          },
          {
            behaviour: "门店收银台买单", // 行为名称(用于合并单元格及显示第一列)
            condition: "现金类支付", // 附件条件
            intKey: "shopCheckstandPayByCashIntegral", // 获取积分的字段
            limitTypeKey: "shopCheckstandPayByCashIntegralLimitType", // 是否限制
            limitValKey: "shopCheckstandPayByCashIntegralLimitVal", // 限制后的值
            intVal: 1, // 默认值 - 获得积分
            limitVal: null, // 默认值 - 积分上限
            limitType: "UN_LIMIT", // 默认值 - 是否上限
            intValPad: "积分/元",
            limitValPad: "点/天"
          },
          // 完成订单评价
          {
            behaviour: "完成订单评价", // 行为名称(用于合并单元格及显示第一列)
            condition: "评价满20字", // 附件条件
            intKey: "orderEvaluation20Integral", // 获取积分的字段
            limitTypeKey: "orderEvaluation20IntegralLimitType", // 是否限制
            limitValKey: "orderEvaluation20IntegralLimitVal", // 限制后的值
            intVal: 10, // 默认值 - 获得积分
            limitVal: null, // 默认值 - 积分上限
            limitType: "UN_LIMIT", // 默认值 - 是否上限
            intValPad: "积分/单",
            limitValPad: "点/天"
          },
          {
            behaviour: "完成订单评价", // 行为名称(用于合并单元格及显示第一列)
            condition: "评价未满20字", // 附件条件
            intKey: "orderEvaluationIntegral", // 获取积分的字段
            limitTypeKey: "orderEvaluationIntegralLimitType", // 是否限制
            limitValKey: "orderEvaluationIntegralLimitVal", // 限制后的值
            intVal: 5, // 默认值 - 获得积分
            limitVal: null, // 默认值 - 积分上限
            limitType: "UN_LIMIT", // 默认值 - 是否上限
            intValPad: "积分/单",
            limitValPad: "点/天"
          },
          // 评论动态
          {
            behaviour: "评论动态", // 行为名称(用于合并单元格及显示第一列)
            condition: "评论满10字", // 附件条件
            intKey: "commentDynamic10Integral", // 获取积分的字段
            limitTypeKey: "commentDynamic10IntegralLimitType", // 是否限制
            limitValKey: "commentDynamic10IntegralLimitVal", // 限制后的值
            intVal: 2, // 默认值 - 获得积分
            limitVal: 100, // 默认值 - 积分上限
            limitType: "LIMIT", // 默认值 - 是否上限
            intValPad: "积分/次",
            limitValPad: "点/天"
          }
        ],
        // 扣减规则
        useRule: {
          orderRefundReducePoints: true, // 订单退款
          consumerOrderCancelReducePoints: true, // 消费账单撤单
          deleteEvaluateReducePoints: true, // 删除订单评价
          deleteCommentReducePoints: true, // 删除动态评论
          pointsToCash: true, // 兑现，找零 （后端无该字段）
          remarks: "" // 这玩意没有用
        },
        exceedRule: "next_year", // current_year, next_year, permanent
        enabled: false // 规则启用停用
      },

      pageLoading: false, //
      id: null, // 主表id 新增时没有
      remarks: "", // 主表备注

      // 统计
      totalLoading: false,
      list: [
        {
          name: "发放总额",
          value: 0
        },
        {
          name: "待使用",
          value: 0
        },
        {
          name: "已使用",
          value: 0
        },
        {
          name: "已过期",
          value: 0
        }
      ],
      integralTakeHintVisible: false,
      ruleId: null
    };
  },
  created() {
    this.setSpanData(this.form.tableData, this.firstColSpan, "behaviour");
    this.form.sceneTableData.map(i => {
      i.brandId = this.currentInfo.brandId;
    });
    this.init();
  },
  methods: {
    init(type) {
      this.getTotalData(); // 顺便刷新统计数据
      this.pageLoading = true;
      axios
        .post("/getBrandPointsRuleInfos", { brandId: this.currentInfo.brandId })
        .then(res => {
          if (res.brandPointsGetRuleInfo) {
            // 有数据的情况， 在这里处理所有的数据， 且确保前端初始化的数据在后端没给出时不被覆盖
            this.form.enabled = res.brandPointsGetRuleInfo.enabled;
            this.form.useRule = {
              ...this.form.useRule,
              ...res.brandPointsOtherRuleInfos
            }; // 扣减规则对象, 这里的 ruleId 就不要再另外存储了
            this.form.sceneTableData =
              res.listBrandPointsUseRuleInfo || this.form.sceneTableData; // 使用场景数组, 这里的 ruleId 就不要再另外存储了
            let brandPointsGetRuleInfo = res.brandPointsGetRuleInfo;
            this.id = brandPointsGetRuleInfo.id; // 主表id 存储备用
            this.ruleId = brandPointsGetRuleInfo.ruleId || null; // 主表id 存储备用
            this.remarks = brandPointsGetRuleInfo.remarks; // 主表备注
            // 将主表的对象数组化
            this.form.tableData.map(i => {
              i.intVal = brandPointsGetRuleInfo[i.intKey];
              i.limitVal = brandPointsGetRuleInfo[i.limitValKey];
              i.limitType = brandPointsGetRuleInfo[i.limitTypeKey];
            });
            // 如果没生效页面出现提示框
            if (!this.form.enabled && type != "sub")
              return (this.integralTakeHintVisible = true);
          } else {
            this.integralTakeHintVisible = true;
          }
        })
        .then(() => {
          this.pageLoading = false;
        });
    },
    getTotalData() {
      this.totalLoading = true;
      axios
        .get(`/getBrandIntegralStatisticalInfo/${this.currentInfo.brandId}`)
        .then(res => {
          this.list[0].value = res.integralSum; // 发放总额
          this.list[1].value = res.integralUnusedSum; // 待使用
          this.list[2].value = res.integralUsedSum; // 已使用
          this.list[3].value = res.integralOverdueSum; // 已过期
          this.totalLoading = false;
        });
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let listBrandPointsUseRuleInfo = this.form.sceneTableData; // 使用场景数组 for api
          let brandPointsOtherRuleInfos = {
            brandId: this.currentInfo.brandId,
            ...this.form.useRule
          }; // 扣减规则对象 for api
          let brandPointsGetRuleInfo = {
            id: this.id,
            ruleId: this.ruleId,
            remarks: this.remarks,
            brandId: this.currentInfo.brandId,
            integralOverdueType: this.form.exceedRule,
            enabled: this.form.enabled
          }; // 设置规则对象 for api
          // pointsValidStrategy 这个字段， 和integralOverdueType同样的功能， 仅给主表传即可
          this.form.tableData.map(i => {
            brandPointsGetRuleInfo[i.intKey] = i.intVal;
            brandPointsGetRuleInfo[i.limitValKey] = i.limitVal;
            brandPointsGetRuleInfo[i.limitTypeKey] = i.limitType;
          });
          this.pageLoading = true;
          axios
            .post("/setBrandPointsRuleInfos", {
              brandPointsGetRuleInfo,
              brandPointsOtherRuleInfos,
              listBrandPointsUseRuleInfo
            })
            .then(res => {
              if (res.success) {
                this.$message.success("保存成功");
                this.init("sub");
              } else {
                this.$message.error(res.message);
              }
            })
            .then(() => {
              this.pageLoading = false;
            });
        } else {
          this.$message.error("检测到非法输入，请修正后再保存");
        }
      });
    },

    // 校验使用场景部分 start
    percentValidator(rule, value, cb) {
      if (/^(\d{1,2}|100)$/.test(value)) {
        cb();
      } else {
        cb("请输入0-100自然数");
      }
    },
    moneyValidator(rule, value, cb) {
      if (/^[0-9]+(\.[0-9]{0,2})?$/.test(value)) {
        cb();
      } else {
        cb("请输入正数，最多2位小数");
      }
    },
    // 校验使用场景部分 end

    // 合并单元格用的
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      let _row = 1;
      let _col = 1;
      if (columnIndex === 0) {
        _row = this.firstColSpan[rowIndex];
      }
      _col = _row > 0 ? 1 : 0;
      return {
        rowspan: _row,
        colspan: _col
      };
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo
    })
  },
  filters: {
    usageScenariosFilter(val) {
      let map = {
        1: "线上商城购买服务/产品/卡项",
        2: "线上消费账单买单"
      };
      return map[val];
    }
  }
};
</script>
<style lang="scss" scoped>
.point-main {
  padding: 0 10px 20px;
  background: #fff;
  margin-bottom: 20px;
}
/deep/ .el-form-item {
  margin-bottom: 0;
}
/deep/ .bold-cell-text {
  .cell {
    font-weight: bold;
    font-size: 14px;
    color: #333;
  }
  background: #eee;
}
.title-line {
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  border-bottom: 2px solid #ddd;
  .red {
    color: red;
  }
  .bold {
    font-weight: bold;
  }
}

.use-scene-box {
  width: 80%;
  margin-top: 12px;
}

/deep/ .flex-line .cell {
  display: flex;
  align-items: center;
}
.use-rule-box {
  margin-top: 12px;
}
.use-rule-list {
  display: flex;
  flex-direction: column;
  padding: 8px 12px;
  .use-rule-line {
    height: 36px;
    line-height: 36px;
  }
}

.exceed-rule-list {
  padding: 8px 12px;
  /deep/ .exceed-rule-small-text {
    color: #979398;
  }
}

.normal_red_btn {
  margin: 12px;
}
</style>
