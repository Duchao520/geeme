
<template>
  <div class="seller-setting">
    <div class="table-main">
      <div class="table-box">
        <div class="user-defined-tab">
          <el-form
            :model="formData"
            :rules="rules"
            ref="formRef"
            label-width="135px"
            class="demo-form"
            v-if="formData"
          >
            <div class="seller-recruit-manage">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span>推客的招募与管理</span>
                </div>
                <el-form-item label="推客招募:" prop="canApply">
                  <el-radio v-model="formData.canApply" :label="true" :disabled="true">
                    开启
                    <span>用户可通过公开招募页面提交推客申请</span>
                  </el-radio>
                  <br />
                  <el-radio v-model="formData.canApply" :label="false" :disabled="true">
                    关闭
                    <span>用户无法通过公开招募页面申请，只能在管理台添加</span>
                  </el-radio>
                </el-form-item>
                <el-form-item label="是否审核:" prop="needVerify">
                  <el-radio v-model="formData.needVerify" :label="true" :disabled="true">
                    开启
                    <span>用户申请后须通过管理台审核，才能获得推客身份</span>
                  </el-radio>
                  <br />
                  <el-radio v-model="formData.needVerify" :label="false" :disabled="true">
                    关闭
                    <span>用户申请后即可自动成为推客，无须审核</span>
                  </el-radio>
                </el-form-item>
              </el-card>
            </div>
            <div class="client-setting">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span>客户关系设置</span>
                </div>
                <el-form-item label="客户绑定方式:" prop="bindType">
                  <el-radio v-model="formData.bindType" :label="1" :disabled="true">
                    浏览/注册绑定
                    <span>老用户浏览推广链接即可被绑定（登录之前离开浏览页除外）</span>
                    <span>新用户通过推客链接进入网店，完成注册并绑定手机号，即可绑定</span>
                  </el-radio>
                  <br />
                  <el-radio v-model="formData.bindType" :label="2" :disabled="true">
                    下单绑定
                    <span>用户通过推客链接在网店内完成下单并支付，即可成功绑定</span>
                  </el-radio>
                </el-form-item>
                <el-form-item label="老客户限制:" prop="canBind">
                  <!-- 之前的需求 -->
                  <!-- <el-radio v-model="formData.canBind" :label="false">
                    老客用户不可以被绑定
                    <span></span>
                  </el-radio>
                  <br />
                  <el-radio v-model="formData.canBind" :label="true">
                    老客用户可以被绑定
                    <span>店内已有的客户都可以被绑定为推客的客户</span>
                  </el-radio>-->
                  <el-checkbox v-model="formData.canBind">店铺已有客户不可被绑定</el-checkbox>
                </el-form-item>
                <el-form-item label="下级自动绑定:" prop="canChildBand">
                  <!-- 之前的需求 -->
                  <!-- <el-radio v-model="formData.canChildBand" :label="false">
                    好友申请成为下级推客后不会被绑定为客户
                    <span></span>
                  </el-radio>
                  <br />
                  <el-radio v-model="formData.canChildBand" :label="true" style="margin-top: 12px;">
                    好友申请成为下级推客后被自动绑定为客户
                    <br />
                    <br />
                    <br />
                    <span>以下情况除外：</span>
                    <br />
                    <br />
                    <span>1. 申请人已经是其他推客的客户</span>
                    <br />
                    <br />
                    <span>2. 申请人已经成为推客或被清除</span>
                  </el-radio>-->
                  <el-checkbox v-model="formData.canChildBand">用户被添加为其他推客的下级时，自动绑定为其上级推客的客户</el-checkbox>
                  <br />
                  <em>（该用户已是其他推客的客户的情况除外）</em>
                </el-form-item>
              </el-card>
            </div>
            <div class="commission-setting">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span>佣金结算设置</span>
                </div>
                <el-form-item label="钱包余额支付:" prop="canWalletMoney">
                  <el-radio v-model="formData.canWalletMoney" :label="false">不计算佣金</el-radio>
                  <el-radio v-model="formData.canWalletMoney" :label="true">计算佣金</el-radio>
                </el-form-item>
                <el-form-item label="储蓄卡支付:" prop="canPrepaidCard">
                  <el-radio v-model="formData.canPrepaidCard" :label="false">不计算佣金</el-radio>
                  <el-radio v-model="formData.canPrepaidCard" :label="true">计算佣金</el-radio>
                </el-form-item>
                <el-form-item label="次卡/时间卡支付:" prop="canOtherCard">
                  <el-radio v-model="formData.canOtherCard" :label="false">不计算佣金</el-radio>
                  <el-radio v-model="formData.canOtherCard" :label="true">计算佣金</el-radio>
                  <br />
                  <em>（次卡/时间卡购买按比例计算佣金的商品时，将无法获取佣金！）</em>
                </el-form-item>
              </el-card>
            </div>
            <div class="else-setting">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span>其他设置</span>
                </div>
                <el-form-item label="客户端开启:" prop="canOpen">
                  <el-radio v-model="formData.canOpen" :label="true">
                    开启
                    <span>开启后，客户端小程序可显示推广返佣入口</span>
                  </el-radio>
                  <br />
                  <el-radio v-model="formData.canOpen" :label="false">
                    关闭
                    <span>如果您不想让所有顾客知道您有推广员制度，可选择关闭</span>
                  </el-radio>
                </el-form-item>
                <el-form-item label="推客名称:" prop="defineSellerName">
                  <el-input
                    v-model="formData.defineSellerName"
                    placeholder="请输入名称"
                    style="width: 200px;"
                  ></el-input>
                </el-form-item>
                <p>可自定义推客名称，例如代理人、合伙人；不可超过6个字</p>
              </el-card>
            </div>
            <el-button type="primary" @click="saveEdit" class="save-button" v-if="!formData.id">新增设置</el-button>
            <el-button type="primary" @click="saveEdit" class="save-button" v-else>修改设置</el-button>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as axios from "@/util/axios";
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      // 设置表单数据
      formData: {
        id: null,
        brandId: null,
        needVerify: true, // 是否审核
        defineSellerName: "", // 推广员名称
        bindType: 1, // 绑定方式
        canApply: false, // 是否可以提交推客申请
        canBind: true, // 老客是否可以绑定
        canChildBand: true, // 下级是否自动成为其客户
        canWalletMoney: true, // 余额支付是否付佣
        canPrepaidCard: true, // 储值卡支付是否付佣
        canOtherCard: true, // 次卡/时间卡支付是否付佣
        canOpen: true // 小程序推广中心是否开启
      },
      rules: {
        needVerify: [{ required: true }],
        defineSellerName: [
          { required: true, message: "请输入推广员名称", trigger: "blur" },
          {
            min: 1,
            max: 6,
            message: "推客名称在1~6个字符之间",
            trigger: "blur"
          }
        ],
        bindType: [{ required: true }],
        canApply: [{ required: true }],
        canBind: [{ required: true }],
        canChildBand: [{ required: true }],
        canWalletMoney: [{ required: true }],
        canPrepaidCard: [{ required: true }],
        canOtherCard: [{ required: true }],
        canOpen: [{ required: true }]
      }
    };
  },
  mounted() {
    this.formData.brandId = this.currentInfo.brandId;
    this.querySetting();
  },
  methods: {
    // 查询是否已经拥有设置信息
    async querySetting() {
      const res = await axios.post(`/getSellSettingByBrandId`, {
        brandId: this.formData.brandId
      });
      if (res.id) {
        this.formData = res;
      }
    },
    // 保存修改
    saveEdit() {
      console.log(this.formData);
      // 表单预校验
      this.$refs.formRef.validate(async valid => {
        if (!valid) return;
        const res = await axios.post(
          `/createOrUpdateSellSetting`,
          this.formData
        );
        if (!res.success) return this.$message.error("创建或修改设置失败");
        this.$message.success("创建/修改设置成功");
      });
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
  min-height: calc(100vh - 310px);
  margin-top: 20px;
  margin-bottom: 20px;
  background: #fff;
  box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
  border-radius: 6px;
  .table-box {
    box-sizing: content-box;
  }
}

.seller-recruit-manage,
.client-setting,
.commission-setting,
.else-setting {
  padding: 18px 16px 0;
  /deep/ .box-card {
    .el-card__header {
      padding: 10px 8px 10px;
      background-color: #f1f2f7;
    }
    .el-card__body {
      padding: 20px 10px 0;
      .el-form-item {
        .el-form-item__label {
          padding-right: 15px;
        }
        .el-form-item__content {
          .el-radio__label {
            span {
              padding-left: 10px;
              color: #c1c1c1;
            }
          }
          em {
            font-style: normal;
            padding-left: 10px;
            color: #c1c1c1;
          }
        }
      }
      p {
        font-size: 14px;
        margin-left: 130px;
        margin-bottom: 20px;
        color: #c1c1c1;
      }
    }
  }
}
.else-setting {
  padding-bottom: 18px;
}
.save-button {
  margin: 0 0 20px 160px;
}
</style>