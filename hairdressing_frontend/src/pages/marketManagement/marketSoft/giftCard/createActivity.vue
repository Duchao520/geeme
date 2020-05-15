<template>
  <full-single-page
    type="giftCard"
    :origin="isDetail ? 'otherTags' : 'editProduct'"
    :title="isDetail ? '礼品卡活动详情' : '新增礼品卡活动'"
  >
    <div class="page-body" v-loading="loading">
      <el-form ref="addGiftForm" :model="addGiftForm" :rules="rules" label-width="150px">
        <el-form-item label="活动名称：" prop="name">
          <el-input
            v-model="addGiftForm.name"
            :disabled="isDetail"
            placeholder="请输入活动名称（展示在分享页）"
            style="width: 360px;"
          ></el-input>
        </el-form-item>

        <el-form-item label="活动时间：" prop="startTime">
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

        <el-form-item label="卡项设置：" prop="giftCardName">
          <div class="card-set">
            <span>{{addGiftForm.giftCardName}}</span>
            <span class="set-card-detail" @click="cardDetail">详情</span>
            <el-button
              plain
              class="plain_pink_btn"
              @click="visable_card=true"
              :disabled="isDetail"
            >选择卡项</el-button>
          </div>
        </el-form-item>

        <el-form-item label="卡项归属：" v-if="suitStoreStrategy != null">{{cardStoreName()}}</el-form-item>

        <el-form-item label="卡项原价：">
          <el-input v-model="addGiftForm.cardPrice" disabled style="width: 150px;">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>

        <el-form-item label="活动价：" prop="free">
          <el-radio :disabled="isDetail" v-model="addGiftForm.free" :label="true">免费领取</el-radio>
          <el-radio :disabled="isDetail" v-model="addGiftForm.free" :label="false">售价</el-radio>
          <number-input
            style="display: inline-block;"
            :value="addGiftForm.activityPrice"
            :width="'150px'"
            :slotObj="{ show: true, name: '元'}"
            :placeholder="'限数字'"
            :disabled="addGiftForm.free || isDetail"
            @input="(num) => { addGiftForm.activityPrice = num }"
          ></number-input>
        </el-form-item>

        <el-form-item label="发放总数：" prop="cardCount">
          <number-input
            :disabled="isDetail"
            :value="addGiftForm.cardCount"
            :width="'150px'"
            :slotObj="{ show: true, name: '张'}"
            :decimal="false"
            @input="(num) => { addGiftForm.cardCount = num }"
          ></number-input>
        </el-form-item>

        <el-form-item label="生效期限：" prop="validTimeStrategy">
          <el-radio-group v-model="addGiftForm.validTimeStrategy" :disabled="isDetail">
            <el-row>
              <el-radio :label="2">
                领取当日开始&nbsp;
                <number-input
                  style="display: inline-block;"
                  :value="addGiftForm.days"
                  :width="'150px'"
                  :disabled="addGiftForm.validTimeStrategy !== 2 || isDetail"
                  v-if="addGiftForm.validTimeStrategy == 2"
                  :placeholder="'限数字'"
                  :max="999"
                  :min="0"
                  :decimal="false"
                  @input="(num) => { addGiftForm.days = num }"
                ></number-input>
                <number-input
                  style="display: inline-block;"
                  :width="'150px'"
                  v-else
                  :disabled="addGiftForm.validTimeStrategy !== 2 || isDetail"
                  :placeholder="'限数字'"
                  :max="999"
                  :min="0"
                  :decimal="false"
                ></number-input>&nbsp;天内有效
              </el-radio>
            </el-row>
            <!-- 暂时不开发 -->
            <!-- <el-row style="margin-top: 10px;">
              <el-radio :label="3">
                领取次日开始&nbsp;
                <number-input
                  style="display: inline-block;"
                  :value="addGiftForm.days"
                  :width="'150px'"
                  :disabled="addGiftForm.validTimeStrategy !== 3 || isDetail"
                  v-if="addGiftForm.validTimeStrategy == 3"
                  :placeholder="'限数字'"
                  :max="999"
                  :min="0"
                  :decimal="false"
                  @input="(num) => { addGiftForm.days = num }"
                ></number-input>
                <number-input
                  style="display: inline-block;"
                  :width="'150px'"
                  v-else
                  :disabled="addGiftForm.validTimeStrategy !== 3 || isDetail"
                  :placeholder="'限数字'"
                  :max="999"
                  :min="0"
                  :decimal="false"
                ></number-input>&nbsp;天内有效
              </el-radio>
            </el-row>-->
            <el-row style="margin-top: 10px; height:36px;">
              <el-radio :label="1">
                <span style="line-height: 36px;">即刻起至&nbsp;</span>
                <el-date-picker
                  :disabled="addGiftForm.validTimeStrategy !== 1 || isDetail"
                  size="medium"
                  type="date"
                  placeholder="选择日期"
                  v-model="validTimeValue"
                  @change="changeValidTime"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerOptions"
                ></el-date-picker>
              </el-radio>
            </el-row>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="派发目标用户：" prop="customerStrategy">
          <el-radio v-model="addGiftForm.customerStrategy" :label="1" :disabled="isDetail">新用户</el-radio>
          <br />
          <el-radio v-model="addGiftForm.customerStrategy" :label="2" :disabled="isDetail">指定用户</el-radio>
          <el-select
            style="width: 350px;"
            v-model="addGiftForm.brandCustomerIds"
            :disabled="addGiftForm.customerStrategy == 1 || isDetail"
            filterable
            multiple
            :filter-method="filterCustomer"
            placeholder="请选择或者输入客户手机号查询"
          >
            <el-option
              v-for="item in customerOptions"
              :key="item.brandCustomerId"
              :label="item.customerName"
              :value="item.brandCustomerId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="首次裂变：" prop="splitNum">
          <el-radio v-model="splitType" :label="0" :disabled="isDetail">不裂变</el-radio>
          <el-radio v-model="splitType" :label="1" :disabled="isDetail">
            可裂变成&nbsp;
            <number-input
              style="display: inline-block;"
              :value="addGiftForm.splitNum"
              :width="'150px'"
              :disabled="splitType !== 1 || isDetail"
              :placeholder="'请输入'"
              :max="999"
              :min="0"
              :decimal="false"
              :slotObj="{ show: true, name: '份'}"
              @input="(num) => { addGiftForm.splitNum = num }"
            ></number-input>&nbsp;供分享给好友使用
          </el-radio>
          <p class="split-text">注：直接派发的用户领取之后的裂变，称为首次裂变。</p>
        </el-form-item>

        <el-form-item label="二次裂变：" prop="secondSplitNum" v-if="splitType == 1">
          <el-radio v-model="splitTwoType" :label="0" :disabled="isDetail">不裂变</el-radio>
          <el-radio v-model="splitTwoType" :label="1" :disabled="isDetail">
            可裂变成&nbsp;
            <number-input
              style="display: inline-block;"
              :value="addGiftForm.secondSplitNum"
              :width="'150px'"
              :disabled="splitTwoType !== 1 || isDetail"
              :placeholder="'请输入'"
              :max="999"
              :min="0"
              :decimal="false"
              :slotObj="{ show: true, name: '份'}"
              @input="(num) => { addGiftForm.secondSplitNum = num }"
            ></number-input>&nbsp;供分享给好友使用
          </el-radio>
          <p class="split-text">注：直接派发的用户分享给其他用户之后的裂变，统称为二次裂变（不论裂变多少次）。</p>
        </el-form-item>

        <el-form-item label="分享领取限制：">
          <el-checkbox v-model="addGiftForm.onlyNewer" :disabled="isDetail">仅限新用户领取（派发除外）</el-checkbox>
          <el-checkbox v-model="repeatReceive" disabled>不可重复领取（派发除外）</el-checkbox>
        </el-form-item>

        <el-form-item label="裂变分享奖励：" class="fission" prop="splitAwardStrategy">
          <el-radio
            v-model="addGiftForm.splitAwardStrategy"
            :label="3"
            :disabled="isDetail"
          >&nbsp;不奖励</el-radio>
          <br />
          <el-radio v-model="addGiftForm.splitAwardStrategy" :label="1" :disabled="isDetail">
            固定&nbsp;
            <number-input
              style="display: inline-block;"
              :value="addGiftForm.awardInfoList[0].awardAmount"
              :disabled="addGiftForm.splitAwardStrategy !== 1"
              v-if="addGiftForm.splitAwardStrategy == 1"
              :width="'150px'"
              :placeholder="'限数字'"
              :max="999"
              :min="0"
              :decimal="false"
              :slotObj="{ show: true, name: '元'}"
              @input="(num) => { addGiftForm.awardInfoList[0].awardAmount = num }"
            ></number-input>
            <number-input
              style="display: inline-block;"
              :width="'150px'"
              v-else
              :disabled="addGiftForm.splitAwardStrategy !== 1"
              :placeholder="'限数字'"
              :max="999"
              :min="0"
              :decimal="false"
              :slotObj="{ show: true, name: '元'}"
            ></number-input>&nbsp;
          </el-radio>
          <span class="fission-fixation">注：分享后，好友领取或成功购买，用户才能获得奖励</span>
          <br />
          <el-radio
            v-model="addGiftForm.splitAwardStrategy"
            :label="2"
            :disabled="isDetail"
          >&nbsp;阶梯&nbsp;</el-radio>
          <div class="fission-ladder">
            <div
              class="single-ladder"
              v-for="(item,index) in addGiftForm.awardInfoList"
              :key="index"
            >
              有效分享&nbsp;
              <number-input
                style="display: inline-block;"
                :value="item.countFrom"
                :disabled="addGiftForm.splitAwardStrategy !== 2 || isDetail"
                :width="'150px'"
                :placeholder="'限数字'"
                :decimal="false"
                @input="(num) => { item.countFrom = num }"
              ></number-input>&nbsp;至&nbsp;
              <number-input
                style="display: inline-block;"
                :value="item.countTo"
                :disabled="addGiftForm.splitAwardStrategy !== 2 || isDetail"
                :width="'150px'"
                :placeholder="'限数字'"
                :decimal="false"
                @input="(num) => { item.countTo = num }"
              ></number-input>&nbsp;&nbsp;&nbsp;奖励&nbsp;
              <number-input
                style="display: inline-block;"
                :value="item.awardAmount"
                :disabled="addGiftForm.splitAwardStrategy !== 2 || isDetail"
                v-if="addGiftForm.splitAwardStrategy == 2"
                :width="'150px'"
                :placeholder="'限数字'"
                :max="999"
                :min="0"
                :decimal="false"
                :slotObj="{ show: true, name: '元'}"
                @input="(num) => { item.awardAmount = num }"
              ></number-input>
              <number-input
                style="display: inline-block;"
                :width="'150px'"
                v-else
                :disabled="addGiftForm.splitAwardStrategy !== 2 || isDetail"
                :placeholder="'限数字'"
                :max="999"
                :min="0"
                :decimal="false"
                :slotObj="{ show: true, name: '元'}"
              ></number-input>
              <div class="parameter-icon" v-if="!isDetail">
                <i class="icon iconfont icon-icon_ope_append" @click="addLadder(item,index)"></i>
                <i
                  class="icon iconfont icon-icon_operate_delete"
                  @click="delLadder(item,index)"
                  v-if="addGiftForm.awardInfoList.length > 1"
                ></i>
              </div>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="分享文案标题：">
          <el-input
            :disabled="isDetail"
            v-model="addGiftForm.splitTitle"
            placeholder="请输入分享文案标题名称"
            style="width: 360px;"
          ></el-input>
        </el-form-item>

        <el-form-item label="使用说明：">
          <el-input
            :disabled="isDetail"
            type="textarea"
            :rows="2"
            v-model="addGiftForm.remark"
            placeholder="请输入分享文案标题名称"
            style="width: 360px;"
          ></el-input>
        </el-form-item>

        <el-form-item label>
          <el-button
            v-if="!isDetail"
            type="primary"
            class="normal_blue_btn"
            :loading="btnLoad"
            @click="submitForm"
          >{{'发布'}}</el-button>
          <el-button class="normal_light_gray_btn" @click="cancel">{{isDetail ? '返回' : '取消'}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 卡项对话框 -->
    <cardDialog
      v-if="visable_card"
      :visible="visable_card"
      @close="visable_card=false"
      @suberData="getCardDataFromSuber"
      :superCheckedGoods="selectedCardsIds"
      @changeSingle="changeSingle"
    />
    <el-dialog title="卡项详情" :visible.sync="cardDetailVisible" width="1065px" class="card-detail">
      <card-info v-show="cardDetailVisible" :id="selectedCardsObj.id"></card-info>
    </el-dialog>
  </full-single-page>
</template>

<script>
import cardDialog from "./components/cardDialog";
import cardInfo from "./components/vipCardInfo";
import * as axios from "@/util/axios";
import { mapActions, mapState } from "vuex";
import { Base64 } from "js-base64";
export default {
  components: {
    cardDialog,
    cardInfo
  },
  data() {
    return {
      loading: false,
      addGiftForm: {
        name: "",
        timeFrom: "",
        timeTo: "",
        giftCardName: "",
        cardPrice: 0,
        activityPrice: null,
        cardType: null,
        cardKindSettingId: null,
        cardCount: null,
        validTimeStrategy: 2,
        days: null,
        customerStrategy: 1,
        free: true,
        brandCustomerIds: [],
        splitNum: 0,
        secondSplitNum: 0,
        onlyNewer: true,
        splitAwardStrategy: 3,
        validTimeFrom: "",
        validTimeTo: "",
        awardInfoList: [
          {
            awardAmount: null,
            countFrom: 0,
            countTo: 0
          }
        ],
        remark: "",
        splitTitle: ""
      },
      rules: {
        name: [{ required: true, validator: this.nameValid }],
        free: [{ required: true, validator: this.freeValid }],
        cardCount: [
          { required: true, validator: this.cardCountValid, trigger: "blur" }
        ],
        startTime: [
          {
            required: true,
            validator: this.startTimeValid,
            trigger: "change"
          }
        ],
        validTimeStrategy: [
          {
            required: true,
            validator: this.validTimeStrategyValid,
            trigger: "blur"
          }
        ],
        splitNum: [
          {
            required: true,
            validator: this.splitNumValid,
            trigger: "change"
          }
        ],
        secondSplitNum: [
          {
            required: true,
            validator: this.secondSplitNumValid,
            trigger: "blur"
          }
        ],
        customerStrategy: [
          {
            required: true,
            validator: this.customerStrategyValid,
            trigger: "change"
          }
        ],
        splitAwardStrategy: [
          {
            required: true,
            validator: this.splitAwardStrategyValid,
            trigger: "change"
          }
        ],
        giftCardName: [
          {
            required: true,
            message: "请选择要参与活动的礼品卡",
            trigger: "chang"
          }
        ]
      },
      timeValue: [],
      validTimeValue: null, // 生效日期指定时间
      visable_card: false,
      subCardTable: [],
      selectedCards: [],
      selectedCardsIds: new Set(),
      selectedCardsObj: {},
      // 指定活动价格的具体价
      activityPriceType: 1,
      customerOptions: [
        //指定用户列表
      ],
      // 裂变相关
      splitType: 0,
      splitTwoType: 0,
      // 重复领取，暂时写死
      repeatReceive: true,
      btnLoad: false,
      cardDetailVisible: false,
      suitStoreStrategy: null,
      suitStore: {},
      acId: null, //活动id
      // 生效日期范围设定
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      }
    };
  },
  async created() {
    this.getBrandCustomerList();
    if (this.isDetail) {
      this.acId = this.$route.query.id || null;
      this.getActivityDetail();
    }
  },
  mounted() {
    if (this.isDetail) {
      this.acId = this.$route.query.id || null;
      this.getActivityDetail();
    }
  },
  methods: {
    nameValid(rule, val, cb) {
      if (val.trim().length > 16 || !val) {
        return cb("请输入活动名称，不超过16个中文字符");
      } else {
        cb();
      }
    },
    freeValid(rule, val, cb) {
      if (!val) {
        if (
          !this.addGiftForm.activityPrice ||
          this.addGiftForm.activityPrice > this.addGiftForm.cardPrice
        ) {
          cb("请输入活动售价，大于0且不得大于卡项原价！");
        } else {
          cb();
        }
      } else {
        cb();
      }
      if (!val && !this.addGiftForm.activityPrice) {
        return cb("请输入活动售价");
      } else {
        cb();
      }
    },
    startTimeValid(rule, val, cb) {
      this.timeValue = this.timeValue || [];
      if (this.timeValue.length != 2) {
        return cb("请指定活动时间");
      } else {
        cb();
      }
    },
    // 生效时期校验
    validTimeStrategyValid(rule, val, cb) {
      if (val == 1) {
        // this.validTimeValue = this.validTimeValue || [];
        if (!this.validTimeValue) {
          cb("请选择指定生效的时间");
        } else {
          cb();
        }
      } else if (val == 2) {
        if (this.addGiftForm.days < 1) {
          cb("请输入有效天数，不可以取0");
        } else {
          cb();
        }
      } else {
        if (this.addGiftForm.days < 1) {
          cb("请输入有效天数，不可以取0");
        } else {
          cb();
        }
      }
    },
    splitNumValid(rule, val, cb) {
      if (this.splitType == 1 && val <= 0) {
        cb("请输入首次可裂变数量，不得小于等于0");
      } else {
        cb();
      }
    },
    secondSplitNumValid(rule, val, cb) {
      if (this.splitTwoType == 1 && val <= 0) {
        cb("请输入二次可裂变数量，不得小于等于0");
      } else {
        cb();
      }
    },
    customerStrategyValid(rule, val, cb) {
      if (val == 1) {
        cb();
      } else {
        this.addGiftForm.brandCustomerIds =
          this.addGiftForm.brandCustomerIds || [];
        if (this.addGiftForm.brandCustomerIds.length < 1) {
          cb("请选择指定用户，可多选");
        } else {
          cb();
        }
      }
    },
    splitAwardStrategyValid(rule, val, cb) {
      if (val == 3) {
        cb();
      } else if (val == 1) {
        if (this.addGiftForm.awardInfoList[0].awardAmount <= 0) {
          cb("请输入固定奖励金额");
        } else {
          cb();
        }
      } else {
        this.addGiftForm.awardInfoList.forEach((item, index) => {
          if (!item.countTo || !item.awardAmount || !item.countFrom) {
            return cb("请完善阶梯裂变分享奖励信息，以上信息均须大于0");
          }
        });
        cb();
      }
    },
    cardCountValid(rule, val, cb) {
      if (!val) {
        return cb("请输入礼品卡发放数量");
      } else {
        cb();
      }
    },
    changeTimeArea() {
      this.$refs.addGiftForm.validateField("startTime");
    },
    cardDetail() {
      if (!this.selectedCardsObj.id)
        return this.$message.warning("请先选择礼品卡。");
      this.cardDetailVisible = true;
    },

    // 获取品牌客户信息
    async getBrandCustomerList() {
      this.loading = true;
      try {
        const res = await axios.post("/esBrandCustomerList", {
          brandId: this.currentInfo.brandId,
          currentPage: 0,
          pageSize: 9999,
          tabEnum: "ALL"
        });
        this.customerOptions = res.rows;
        this.customerOptionsCopy = res.rows;
      } finally {
        this.loading = false;
      }
    },
    filterCustomer(val, row, column) {
      console.log(val, row, column);
      // this.addGiftForm.brandCustomerIds = val
      if (val) {
        this.customerOptions = this.customerOptionsCopy.filter(
          i => i.telephone.indexOf(val) != -1
        );
      } else {
        this.customerOptions = this.customerOptionsCopy;
      }
    },
    // - 保存卡项
    async getCardDataFromSuber(i) {
      this.addGiftForm.cardKindSettingId = i.id;
      this.addGiftForm.cardType = i.cardType;
      this.selectedCardsObj = i;
      this.selectedCardsIds = new Set();
      this.selectedCardsIds.add(i.id);
      this.addGiftForm.giftCardName = i.cardName;
      this.addGiftForm.cardPrice =
        i.cardFirstRechargeNum > 0 ? i.cardFirstRechargeNum : i.cardPrice;
      this.visable_card = false;
      this.$refs.addGiftForm.validateField("giftCardName");
      this.$refs.addGiftForm.validateField("free");
      // 获取卡项的归属信息
      try {
        this.loading = true;
        const res = await axios.get(`/getCardKindDetailInfo/${i.id}`);
        this.suitStoreStrategy = res.suitStoreStrategy;
        this.suitStore = res.suitStore;
      } finally {
        this.loading = false;
      }
    },
    cardStoreName() {
      switch (this.suitStoreStrategy) {
        case 0:
          return "所有门店";
        case 1:
          return "所有直营店";
        case 2:
          return `${this.suitStore.storeIdList[0].city || ""} ${
            this.suitStore.storeIdList[0].storeName
          }`;
        default:
          return "";
      }
    },
    changeSingle(id) {
      this.selectedCardsIds = new Set();
      this.selectedCardsIds.add(id);
    },
    // 生效时间改变
    changeValidTime() {},
    addLadder(item, index) {
      this.addGiftForm.awardInfoList.push({
        awardAmount: null,
        countFrom: null,
        countFrom: null
      });
      this.$refs.addGiftForm.validateField("splitAwardStrategy");
    },
    delLadder(item, index) {
      this.addGiftForm.awardInfoList.splice(index, 1);
      this.$refs.addGiftForm.validateField("splitAwardStrategy");
    },
    // 发布
    submitForm() {
      this.$refs.addGiftForm.validate(async valid => {
        if (!valid) return this.$message.error("请完善相关的活动信息");
        try {
          this.btnLoad = true;
          const res = await axios.post("/createOrModifyGiftCardActivity", {
            ...this.addGiftForm,
            // activityPrice: 0.01,
            brandId: this.currentInfo.brandId,
            storeId: this.currentInfo.shopId
          });
          if (!res.success)
            return this.$message.error("发布失败" + res.message);
          this.$message.success("发布成功");
          this.btnLoad = false;
          this.$router.go(-1);
        } finally {
          this.btnLoad = false;
        }
      });
    },
    cancel() {
      if (this.isDetail) {
        window.close();
      } else {
        this.$router.go(-1);
      }
    },
    // 获取活动详情
    async getActivityDetail() {
      this.loading = true;
      try {
        const res = await axios.post("/getGiftCardActivityById", {
          id: Base64.decode(this.acId)
        });
        this.addGiftForm = res.giftCardActivityInfo;
        this.timeValue = [
          res.giftCardActivityInfo.timeFrom,
          res.giftCardActivityInfo.timeTo
        ];
        if (res.giftCardActivityInfo.validTimeStrategy == 1) {
          this.validTimeValue = res.giftCardActivityInfo.validTimeTo.split('T')[0];
        }
        this.$refs.addGiftForm.validateField("validTimeStrategy");
        this.splitType = res.giftCardActivityInfo.splitNum ? 1 : 0;
        this.splitTwoType = res.giftCardActivityInfo.splitAgain ? 1 : 0;
        this.addGiftForm.awardInfoList = res.giftCardActivityInfo.awardInfo;
        const cardInfo = await axios.get(
          `/getCardKindDetailInfo/${res.giftCardActivityInfo.cardKindSettingId}`
        );
        this.getCardDataFromSuber(cardInfo);
      } finally {
        this.$refs.addGiftForm.clearValidate("startTime");
        this.loading = false;
      }
    }
  },
  computed: {
    currentInfo() {
      return this.$store.state.manage.currentInfo;
    },
    isDetail() {
      return this.$route.path.indexOf("detail") !== -1;
    }
  },
  watch: {
    "addGiftForm.free"(val) {
      this.$refs.addGiftForm.validateField("free");
    },
    "addGiftForm.validTimeStrategy"(val) {
      this.validTimeValue = null;
      this.$refs.addGiftForm.validateField("validTimeStrategy");
    },
    "addGiftForm.customerStrategy"(val) {
      this.$refs.addGiftForm.validateField("customerStrategy");
    },
    splitType(val) {
      this.$refs.addGiftForm.validateField("splitNum");
      this.splitTwoType = 0;
      if (val == 0) {
        this.addGiftForm.splitNum = 0;
        this.addGiftForm.secondSplitNum = 0;
      }
    },
    splitTwoType(val) {
      this.$refs.addGiftForm.validateField("secondSplitNum");
      if (val == 0) {
        this.addGiftForm.secondSplitNum = 0;
      }
    },
    timeValue: {
      deep: true,
      handler(val, old) {
        val = val || [];
        this.addGiftForm.timeFrom = val.length == 2 ? val[0] : "";
        this.addGiftForm.timeTo = val.length == 2 ? val[1] : "";
      }
    },
    validTimeValue: {
      deep: true,
      handler(val, old) {
        val = val || null;
        this.addGiftForm.validTimeFrom = "";
        this.addGiftForm.validTimeTo = val ? val + " 23:59:59" : "";
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.plain_pink_btn {
  padding: 9px !important;
}

.page-body {
  margin: 50px 0 30px 80px;
}

.split-text {
  color: #8a8a8a;
}
.fission {
  .fission-fixation {
    color: #8a8a8a;
  }
  br + .el-radio {
    margin-top: 10px;
  }
  .fission-ladder {
    vertical-align: middle;
    margin-top: 10px;
    padding: 10px;
    display: inline-block;
    border: 1px solid #ccc;
    .single-ladder {
      & + .single-ladder {
        margin-top: 10px;
      }
      .parameter-icon {
        width: 45px;
        margin-left: 20px;
        display: inline-block;
        vertical-align: middle;
        :nth-child(1) {
          color: #58c9f3;
          transition: all 0.6s;
          cursor: pointer;
        }
      }
    }
  }
}

.set-card-detail {
  margin: 0 10px;
  color: #409eff;
  cursor: pointer;
}
</style>