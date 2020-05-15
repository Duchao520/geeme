<template>
  <full-single-page :type="'brandManage'" :title="'派发红包'">
    <div class="page-body">
      <el-form ref="sendForm" :model="sendForm" label-width="110px">
        <el-form-item label="红包类型">
          <h3>{{ templateTypeName() }}</h3>
        </el-form-item>

        <el-form-item
          label="派发时间"
          prop="upperImmediately"
          :rules="{ required: true, validator: validateSendTime, trigger: 'change' }"
        >
          <el-radio-group v-model="sendForm.upperImmediately">
            <el-radio :label="true">即时派发</el-radio>
            <el-radio :label="false">
              指定时间
              <el-date-picker
                :disabled="sendForm.upperImmediately"
                v-model="sendForm.appointUpperTime"
                type="datetime"
                placeholder="选择日期时间"
                :value-format="'yyyy-MM-dd HH:mm:ss'"
                default-time="00:00:00"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          label="生效期限"
          prop="validTimeStrategy"
          :rules="{ required: true, validator: validateDateType, trigger: 'change' }"
        >
          <div class="box-line">
            <el-radio-group v-model="sendForm.validTimeStrategy">
              <el-radio :label="2">
                指定日期
                <!-- <el-date-picker
                v-model="sendForm.validStartTime"
                type="datetimerange"
                range-separator="至"
                unlink-panels
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :value-format="'yyyy-MM-dd HH:mm:ss'"
                :default-time="['00:00:00', '23:59:59']"
                :picker-options="pickerOptions"
              >
                </el-date-picker>-->
                <el-date-picker
                  :disabled="sendForm.validTimeStrategy != 2"
                  v-model="sendForm.validStartTime"
                  type="datetime"
                  placeholder="选择日期时间"
                  :value-format="'yyyy-MM-dd HH:mm:ss'"
                  default-time="00:00:00"
                  :picker-options="pickerOptions"
                ></el-date-picker>开始
                <el-input
                  v-if="sendForm.validTimeStrategy == 2"
                  style="width: 100px;"
                  v-model.number="sendForm.validDay"
                  maxlength="3"
                  placeholder="1-365天"
                ></el-input>
                <el-input v-else disabled style="width: 100px;" maxlength="3" placeholder="1-365天"></el-input>天内有效
              </el-radio>
              <br />
              <el-radio :label="0" style="margin-top: 12px;">
                领取当日开始
                <el-input
                  v-if="sendForm.validTimeStrategy == 0"
                  style="width: 100px;"
                  v-model.number="sendForm.validDay"
                  maxlength="3"
                  placeholder="1-365天"
                ></el-input>
                <el-input v-else disabled style="width: 100px;" maxlength="3" placeholder="1-365天"></el-input>天内有效
              </el-radio>
              <br />
              <el-radio :label="1" style="margin-top: 12px;">
                领取次日开始
                <el-input
                  v-if="sendForm.validTimeStrategy == 1"
                  style="width: 100px;"
                  v-model.number="sendForm.validDay"
                  maxlength="3"
                  placeholder="1-365天"
                ></el-input>
                <el-input v-else disabled style="width: 100px;" maxlength="3" placeholder="1-365天"></el-input>天内有效
              </el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
        <!-- 活动红包目标用户 -->
        <el-form-item
          v-if="this.templateInfo.packetType == 4"
          label="目标用户"
          prop="redPacketSalesInfo.redPacketCustomerStrategy"
          :rules="[
          { required: true, validator: validateRedPacketCustomerStrategy, trigger: 'change' },
          { required: true, validator: validateRedPacketCustomerStrategy, trigger: 'blur' }
          ]"
        >
          <el-radio-group v-model="sendForm.redPacketSalesInfo.redPacketCustomerStrategy">
            <el-radio :label="1">所有用户</el-radio>
            <el-radio :label="2">
              指定用户
              <el-select
                v-model="sendForm.redPacketSalesInfo.customerIds"
                multiple
                placeholder="请选择客户"
                :disabled="sendForm.redPacketSalesInfo.redPacketCustomerStrategy !== 2"
              >
                <el-option
                  v-for="item in custOptions"
                  :key="item.brandCustomerId"
                  :label="item.customerName"
                  :value="item.brandCustomerId"
                ></el-option>
              </el-select>
            </el-radio>
            <br />
            <el-radio :label="3" style="margin-top: 20px;">
              高级筛选
              <br />
              <div
                class="box-line"
                style="margin-top: 20px;"
                v-if="sendForm.redPacketSalesInfo.redPacketCustomerStrategy === 3"
              >
                <el-form-item label="所在城市" prop="address">
                  <el-cascader
                    style="width: 222px;"
                    placeholder="不选不限制城市"
                    :options="options"
                    :props="prop"
                    v-model="sendForm.address"
                  ></el-cascader>
                </el-form-item>
                <el-form-item label="性别">
                  <el-select v-model="sendForm.redPacketSalesInfo.sex" placeholder="请选择性别">
                    <el-option
                      v-for="item in sexOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="年龄">
                  <el-input
                    style="width: 80px;"
                    v-model.number="sendForm.redPacketSalesInfo.ageFrom"
                    maxlength="3"
                  ></el-input>至
                  <el-input
                    style="width: 80px;"
                    v-model.number="sendForm.redPacketSalesInfo.ageTo"
                    maxlength="3"
                    placeholder="不限"
                  ></el-input>
                </el-form-item>
                <el-form-item label="注册时长">
                  <el-select
                    v-model="sendForm.redPacketSalesInfo.registerTime"
                    placeholder="请选择注册时长"
                  >
                    <el-option
                      v-for="item in registerTimeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="会员级别">
                  <el-select
                    v-model="sendForm.redPacketSalesInfo.memberLevel"
                    placeholder="请选择会员级别"
                  >
                    <el-option :key="0" :label="'不限'" :value="null"></el-option>
                    <el-option
                      v-for="item in memberLevelOptions"
                      :key="item.id"
                      :label="item.levelName"
                      :value="item.levelName"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 老客红包目标用户 -->
        <el-form-item
          v-if="this.templateInfo.packetType == 2"
          label="目标用户"
          prop="redPacketSalesInfo.redPacketCustomerStrategy"
          :rules="{ required: true, trigger: 'blur' }"
        >
          <div class="box-line">
            <el-form-item label="所在城市" prop="address">
              <el-cascader
                style="width: 222px;"
                placeholder="不选不限制城市"
                :options="options"
                :props="prop"
                v-model="sendForm.address"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="性别">
              <el-select v-model="sendForm.regularCustomerInfo.sex" placeholder="请选择性别">
                <el-option
                  v-for="item in sexOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="注册时长">
              <el-select v-model="sendForm.regularCustomerInfo.registerTime" placeholder="请选择注册时长">
                <el-option
                  v-for="item in registerTimeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="会员级别">
              <el-select v-model="sendForm.regularCustomerInfo.memberLevel" placeholder="请选择会员级别">
                <el-option :key="0" :label="'不限'" :value="null"></el-option>
                <el-option
                  v-for="item in memberLevelOptions"
                  :key="item.id"
                  :label="item.levelName"
                  :value="item.levelName"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- 数据库中还未存储客户的消费时间数据，故先不做以下筛选条件 -->
            <!-- <el-form-item
              label="首次消费时间"
              prop="firstBillTimeFlag"
              :rules="{ required: true, validator: validateFirstBillTime, trigger: 'change' }"
            >
              <el-radio-group v-model="sendForm.firstBillTimeFlag">
                <el-radio :label="true">不限</el-radio>
                <el-radio :label="false">
                  <el-input
                    :disabled="sendForm.firstBillTimeFlag"
                    style="width: 150px;"
                    v-model.number="sendForm.regularCustomerInfo.firstBillTime"
                    maxlength="3"
                  >
                    <template slot="append">天</template>
                  </el-input>以上
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="上次消费时间"
              prop="lastBillTimeFlag"
              :rules="{ required: true, validator: validateLastBillTime, trigger: 'change' }"
            >
              <el-radio-group v-model="sendForm.lastBillTimeFlag">
                <el-radio :label="true">不限</el-radio>
                <el-radio :label="false">
                  <el-input
                    :disabled="sendForm.lastBillTimeFlag"
                    style="width: 150px;"
                    v-model.number="sendForm.regularCustomerInfo.lastBillTime"
                    maxlength="3"
                  >
                    <template slot="append">天</template>
                  </el-input>以上
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <p class="text">说明：随着时间推移，该红包将自动派发给符合上述条件的用户。</p>-->
          </div>
        </el-form-item>
        <!-- 生日红包目标用户 -->
        <el-form-item
          v-if="this.templateInfo.packetType == 3"
          label="目标用户"
          prop="redPacketBirthdayInfo.beforeBirthday"
          :rules="{ required: true, validator: validateBeforeBirthday, trigger: 'blur' }"
        >
          未来
          <el-input
            style="width: 100px;"
            v-model.number="sendForm.redPacketBirthdayInfo.beforeBirthday"
            maxlength="3"
            placeholder="1-365天"
          ></el-input>天之后当天过生日的用户
        </el-form-item>

        <!-- 生效方式 -->
        <el-form-item label="生效方式" prop="autoSend" :rules="{ required: true }">
          <el-radio-group v-model="sendForm.autoSend">
            <el-radio :label="true">自动派发</el-radio>
            <el-radio :label="false">手动领取</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 派发数量 -->
        <el-form-item
          label="派发数量"
          prop="limitCount"
          :rules="[
        { required: true, validator: validLimitCount, trigger: 'blur' },{ required: true, validator: validLimitCount, trigger: 'change' }]"
        >
          <el-radio-group v-model="limitCountFlag" :disabled="sendForm.autoSend">
            <el-radio :label="true">不限</el-radio>
            <el-radio :label="false">
              派发数量&nbsp;<el-input v-model.number="limitCount" style="width: 150px;" placeholder="限填数字">
                <template slot="append">个</template>
              </el-input>
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          label="审核验证码"
          prop="code"
          :rules="{ required: true, validator: validateCode, trigger: 'blur' }"
        >
          <el-input
            style="width: 160px;"
            v-model.trim="sendForm.code"
            maxlength="6"
            placeholder="请输入验证码"
          ></el-input>
          <el-button
            class="normal_blue_btn"
            :loading="codeBtnLoading"
            @click="getCode"
          >{{codeBtnLoading ? `${timer}s` : '获取验证码'}}</el-button>
          <p class="red-packet-text-info">说明：短信验证码将发送至审核人员手机：{{phone}}，请及时查收。</p>
        </el-form-item>

        <el-form-item>
          <div class="createTempBtn">
            <el-button class="normal_blue_btn" :loading="btnLoading" @click="confirm">确定派发</el-button>
            <el-button plain class="plain_blue_btn" @click="cancel">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </full-single-page>
</template>
<script>
import * as axios from "@/util/axios";
import { mapActions, mapState } from "vuex";
import { reg, checkReg } from "@/assets/js/RegExp";
import Axios from "axios"; // 高德用
export default {
  data() {
    return {
      // 派发参数
      sendForm: {
        templateId: null,
        upperImmediately: true, // 是否立即派发
        appointUpperTime: "", // 指定上架时间
        validTimeStrategy: 0, // 指定有效期策略
        validStartTime: "", // 指定有效期开始时间
        validDay: "", // 有效期
        autoSend: true, // 自动派发
        limitCount: -1, // 派发数量  -1 表示不限
        redPacketSalesInfo: {
          // 活动红包参数
          redPacketCustomerStrategy: 1, // 指定用户策略
          customerIds: [], // 指定用户id 为2的时候传
          ageFrom: 0,
          ageTo: null,
          customerIds: [],
          sex: null,
          registerTime: 1,
          memberLevel: null
        },
        redPacketBirthdayInfo: {
          beforeBirthday: null
        },
        regularCustomerInfo: {
          sex: null,
          registerTime: 1,
          firstBillTime: 0,
          lastBillTime: 0,
          memberLevel: null
        },
        code: "", // 验证码
        address: "",
        firstBillTimeFlag: true,
        lastBillTimeFlag: true
      },
      limitCount: null,
      limitCountFlag: true,
      phone: "",
      codeBtnLoading: false,
      timer: 0, // 验证码倒计时
      pickerOptions: {
        disabledDate: function(date) {
          return new Date().getTime() - 8.64e7 > date;
        }
      },
      btnLoading: false,
      templateInfo: {},
      options: [],
      // 地址级联配置项
      prop: {
        label: "name",
        value: "name",
        children: "districts"
      },
      sexOptions: [
        {
          label: "不限",
          value: null
        },
        {
          label: "男",
          value: "男"
        },
        {
          label: "女",
          value: "女"
        }
      ],
      registerTimeOptions: [
        {
          label: "不限",
          value: 1
        },
        {
          label: "一周以内",
          value: 2
        },
        {
          label: "三个月以内",
          value: 3
        },
        {
          label: "半年以内",
          value: 4
        },
        {
          label: "一年以内",
          value: 5
        }
      ],
      memberLevelOptions: [],
      custOptions: []
    };
  },
  created() {
    this.templateInfo = this.$route.params.row || {};
    // if (!this.templateInfo.packetType) {
    //   this.$router.go(-1)
    // }
    axios
      .get("/getBrandOwnerPhoneInfo/" + this.currentInfo.brandId)
      .then(res => {
        this.phone = res;
      });
    if (
      this.templateInfo.packetType === 2 ||
      this.templateInfo.packetType === 4
    ) {
      this.getCityData();
      this.getMemberLevel();
    }
    if (this.templateInfo.packetType === 4) {
      this.getCustomerInfo();
    }
  },
  mounted() {},
  methods: {
    // ---------------------- 校验 ----------------------
    // -指定派发时间校验
    validateSendTime(rule, value, cb) {
      if (!value && !this.sendForm.appointUpperTime) {
        cb("请指定日期");
      } else {
        cb();
      }
    },
    // -生效时间校验
    validateDateType(rule, value, cb) {
      if (value == 2 && !this.sendForm.validStartTime) {
        cb("请指定日期");
      }
      if (
        this.sendForm.validDay == "" ||
        this.sendForm.validDay > 365 ||
        this.sendForm.validDay < 1
      ) {
        cb("请输入正确的有效天数");
      }
      if (!checkReg(/^\d{1,3}$/, this.sendForm.validDay)) {
        // html 中有maxlength需要同步
        cb(new Error("请输入1~3位的自然数!"));
      } else {
        cb();
      }
    },
    // -目标用户校验-活动红包
    validateRedPacketCustomerStrategy(rule, value, cb) {
      if (value == 1) {
        cb();
      } else if (value == 2) {
        if (this.sendForm.redPacketSalesInfo.customerIds.length < 1) {
          cb("请选择指定的客户");
        } else {
          cb();
        }
      } else if (value == 3) {
        if (!this.sendForm.redPacketSalesInfo.ageTo) {
          cb();
        }
        if (
          !checkReg(/^\d{1,3}$/, this.sendForm.redPacketSalesInfo.ageFrom) ||
          !checkReg(/^\d{1,3}$/, this.sendForm.redPacketSalesInfo.ageTo)
        ) {
          // html 中有maxlength需要同步
          cb(new Error("年龄请输入1~3位的自然数!"));
        }
        if (
          this.sendForm.redPacketSalesInfo.ageFrom < 0 ||
          this.sendForm.redPacketSalesInfo.ageTo < 0
        ) {
          cb("请填写正确的年龄范围");
        } else if (
          this.sendForm.redPacketSalesInfo.ageFrom >
          this.sendForm.redPacketSalesInfo.ageTo
        ) {
          cb("年龄最小值不能大于年龄最大值");
        } else {
          cb();
        }
      } else {
        cb();
      }
    },
    // -生日目标校验
    validateBeforeBirthday(rule, value, cb) {
      if (!value || value > 365 || value < 1) {
        cb("请输入正确的时间");
      } else {
        cb();
      }
    },
    // -派发数量校验
    validLimitCount(rule, value, cb) {
      if (!this.limitCountFlag && !this.limitCount) {
        cb('请输入派发数量，限制填数字！')
      } else {
        cb()
      }
    },
    // -验证码
    validateCode(rule, value, cb) {
      if (value && value.length === 6) {
        cb();
      } else {
        cb("请输入短信验证码");
      }
    },
    // -地址
    validateAddress(rule, value, cb) {
      if (value) {
        cb();
      } else {
        cb("请选择地址信息");
      }
    },
    // -老客红包上次使用校验
    validateLastBillTime(rule, value, cb) {
      let time = this.sendForm.regularCustomerInfo.lastBillTime;
      let firstTime = this.sendForm.regularCustomerInfo.firstBillTime;
      if (!value) {
        if (time < 1) {
          cb("请填写大于1的整数");
        } else if (/^[1-9]\d*$/.test(time)) {
          cb();
        } else {
          cb("请填写大于1的整数");
        }
      } else {
        cb();
      }
    },
    // -老客红包首次使用校验
    validateFirstBillTime(rule, value, cb) {
      let time = this.sendForm.regularCustomerInfo.firstBillTime;
      if (!value) {
        if (time < 1) {
          cb("请填写大于1的整数");
        } else if (/^[1-9]\d*$/.test(time)) {
          cb();
        } else {
          cb("请填写大于1的整数");
        }
      } else {
        cb();
      }
    },
    // ---------------------- 校验 ----------------------
    // 模板类型名称
    templateTypeName() {
      let type = this.templateInfo.packetType;
      switch (type) {
        case 1:
          return "新人红包";
          break;
        case 2:
          return "老客红包";
          break;
        case 3:
          return "生日红包";
          break;
        default:
          return "活动红包";
          break;
      }
    },
    // 从高德地图拉取城市数据
    getCityData() {
      Axios.get(
        `//restapi.amap.com/v3/config/district?key=f211857599047852b425815b7d4a29e7&keywords=&subdistrict=3&extensions=base`
      ).then(res => {
        if (res.data.status == "1") {
          this.options = res.data.districts[0].districts;
          this.forEachCityData(this.options);
        }
      });
    },
    //遍历城市数据
    forEachCityData(data) {
      data.forEach(res => {
        if (res.districts.length == 0) {
          res.districts = null;
        } else {
          this.forEachCityData(res.districts);
        }
      });
    },
    // 获取会员级别
    async getMemberLevel() {
      const res = await axios.post("/getBrandMemberLevelDiscount", {
        brandId: this.currentInfo.brandId
      });
      this.memberLevelOptions = res.discountInfoList;
    },
    // 获取品牌客户信息
    async getCustomerInfo() {
      const res = await axios.post("/esBrandCustomerList", {
        brandId: this.currentInfo.brandId,
        tabEnum: "ALL",
        currentPage: 0,
        pageSize: 9999
      });
      this.custOptions = res.rows;
    },
    // 获取验证
    getCode() {
      let packetTypeName = this.templateTypeName();
      console.log(packetTypeName);
      axios
        .post("/getPublishRedPacketVerifycationCode", {
          brandId: this.currentInfo.brandId,
          packetTypeName
        })
        .then(res => {
          if (res.success) {
            this.$message.success("获取验证码成功");
            this.timer = 60;
            this.codeBtnLoading = true;
            let t = setInterval(() => {
              this.timer--;
              if (this.timer <= 0) {
                this.codeBtnLoading = false;
                clearInterval(t);
                t = null;
              }
            }, 1000);
          } else {
            this.$message({ type: "error", message: res.message });
          }
        });
    },
    // 派发
    async confirm() {
      // console.log(this.$route.params.id)
      this.$refs.sendForm.validate(async valid => {
        if (!valid) return this.$message.error("请完成相关信息的填写");
        let sendForm = JSON.parse(JSON.stringify(this.sendForm));
        sendForm.templateId = this.templateInfo.id;
        // 生效方式，派发数量处理
        if (this.limitCountFlag) {
        sendForm.limitCount = -1 
      } else {
        sendForm.limitCount = this.limitCount
      }
        switch (this.templateInfo.packetType) {
          // 老客
          case 2:
            sendForm.regularCustomerInfo.firstBillTime = sendForm.firstBillTimeFlag
              ? 0
              : sendForm.regularCustomerInfo.firstBillTime;
            sendForm.regularCustomerInfo.lastBillTime = sendForm.lastBillTimeFlag
              ? 0
              : sendForm.regularCustomerInfo.lastBillTime;
            if (
              sendForm.regularCustomerInfo.lastBillTime >
              sendForm.regularCustomerInfo.firstBillTime
            ) {
              this.$message.error("上次消费时间不得早于首次消费时间");
              return;
            }
            sendForm.regularCustomerInfo.province = sendForm.address[0] || null;
            sendForm.regularCustomerInfo.city = sendForm.address[1] || null;
            sendForm.regularCustomerInfo.district = sendForm.address[2] || null;
            delete sendForm.redPacketSalesInfo;
            delete sendForm.redPacketBirthdayInfo;
            delete sendForm.address;
            delete sendForm.firstBillTimeFlag;
            delete sendForm.lastBillTimeFlag;
            break;
          // 生日
          case 3:
            delete sendForm.redPacketSalesInfo;
            delete sendForm.regularCustomerInfo;
            delete sendForm.address;
            delete sendForm.firstBillTimeFlag;
            delete sendForm.lastBillTimeFlag;
            break;
          // 活动
          default:
            sendForm.redPacketSalesInfo.province = sendForm.address[0] || null;
            sendForm.redPacketSalesInfo.city = sendForm.address[1] || null;
            sendForm.redPacketSalesInfo.district = sendForm.address[2] || null;
            delete sendForm.regularCustomerInfo;
            delete sendForm.redPacketBirthdayInfo;
            delete sendForm.address;
            delete sendForm.firstBillTimeFlag;
            delete sendForm.lastBillTimeFlag;
            break;
        }
        this.btnLoading = true;
        const res = await axios.post("/publishRedPacket", sendForm);
        if (!res.success)
          return this.$message.error(res.message + "验证码不正确");
        this.$message.success("派发红包成功");
        this.btnLoading = false;
        if (this.templateInfo.packetType == 4) {
          this.$router.push(
            "/brand-inner/market/market-list/activity-red-packet"
          );
        } else {
          this.$router.push("/brand-inner/market/market-list/red-packet");
        }
      });
    },
    cancel() {
      this.$router.push({
        name: "/brand-inner/market/market-list/activity-red-packet",
        params: {
          isTem: true
        }
      });
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo
    })
  },
  watch: {
    "sendForm.validTimeStrategy"(val) {
      this.sendForm.validDay = "";
    },
    // 生效方式为自动派发时， 派发数量只能选择不限
    'sendForm.autoSend'(val) {
      if (val) {
        this.limitCountFlag = true
      }
    },
  }
};
</script>
<style lang='scss' scoped>
.page-body {
  margin: 32px 78px 20px;
  /deep/ .el-form-item {
    margin-bottom: 20px;
    .box-line {
      display: inline-block;
      padding: 30px 60px 30px 30px;
      border: 1px solid #eee;
      .text {
        margin-left: 40px;
        color: #ccc;
        font-size: 14px;
      }
    }
  }
}
</style>
