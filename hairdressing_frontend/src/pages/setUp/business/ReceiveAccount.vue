<template>
  <div class="root-con-bankAccount" v-loading="loading">
    <div class="bankAccount-head">
      <div class="head-left">
        <el-radio-group
          v-model="queryForm.queryType"
          size="medium"
          v-if="isBrand"
          style="margin-right: 20px;"
        >
          <el-radio-button label="brand">总部账号</el-radio-button>
          <el-radio-button label="store">门店账号</el-radio-button>
        </el-radio-group>
        <el-select
          v-model="storeSort"
          placeholder="请选择"
          size="medium"
          v-if="isBrand && queryForm.queryType == 'store'"
        >
          <el-option :label="'所有门店'" :value="null"></el-option>
          <el-option :label="'直营店'" :value="'DIRECT'"></el-option>
          <el-option :label="'加盟店'" :value="'JOIN'"></el-option>
        </el-select>
      </div>
      <div class="head-right" v-if="isBrand && queryForm.queryType == 'store'">
        <input-search
          :placeholder="'搜索门店名称'"
          width="auto"
          v-model="searchWord"
          @search="searchData"
        />
      </div>
    </div>
    <div class="account-list" :style=" isBrand ? '': 'margin-top: 0'">
      <h4>账号列表</h4>
      <el-checkbox
        v-model="useBrand"
        style="margin-left: 20px;"
        v-if="queryForm.queryType == 'store' && hasAccount"
        @change="storeUseBrand"
      >使用总部的收款账号</el-checkbox>
    </div>
    <el-table
      :data="payMethodDetailInfos"
      row-class-name="row-class"
      style="width: 100%"
      :height=" isBrand ? queryForm.queryType == 'store' ?  'calc(100vh - 296px)' : 'calc(100vh - 580px)' : 'calc(100vh - 240px)'"
    >
      <el-table-column prop="name" label="门店名称" v-if="queryForm.queryType == 'store'">
        <template slot-scope="{ row }">
          <p>{{ row.name }}</p>
          <div v-if="row.name">
            <status-text v-if=" row.storeType == '直营店'" name="直营" type="orange"></status-text>
            <status-text v-else name="加盟" type="blue"></status-text>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="payMethod" label="支付方式" width="100"></el-table-column>
      <el-table-column label="开户名称/商户名称">
        <template slot-scope="scope">
          <p
            class="bankAccount-name"
            v-if="scope.row.payMethodId === 1"
          >{{scope.row.accountName || '-'}}</p>
          <p class="bankAccount-name" v-else>{{scope.row.merchantName || '-'}}</p>
        </template>
      </el-table-column>
      <el-table-column label="银行账号/支付宝账号">
        <template slot-scope="scope">
          <span v-if="scope.row.payMethodId === 1">{{scope.row.bankAccount || "-"}}</span>
          <span v-else>{{scope.row.aliPayAccount || "-"}}</span>
        </template>
      </el-table-column>
      <el-table-column label="开户行">
        <template slot-scope="scope">
          <span>{{scope.row.openBank + scope.row.bankBranch || "-"}}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请时间">
        <template slot-scope="scope">{{scope.row.applyTime || "-"}}</template>
      </el-table-column>
      <el-table-column width="100" label="审核状态">
        <template slot-scope="scope">
          <status-text v-if="scope.row.status==='CHECK_WAITING'" name="审核中" type="blue"></status-text>
          <status-text v-if="scope.row.status==='CHECK_FAIL'" name="已驳回" type="orange1"></status-text>
          <status-text v-if="scope.row.status==='CHECK_PASS'" name="已通过" type="blue"></status-text>
          <status-text v-if="scope.row.status==='WAITING_AUTH'" name="待授权" type="orange1"></status-text>
          <span v-if="scope.row.status===null">-</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <!-- 支付宝&微信通用: CHECK_PASS(审核通过) CHECK_WAITING(正在审核) CHECK_FAIL(审核未通过) -->
          <!-- 支付宝额外: WAITING_AUTH(等待授权) -->
          <!-- 品牌不可以给门店设置收款账号的条件 需要的话直接插入下文代码中想if && (isBrand && queryForm.queryType == 'brand') || ( !isBrand ) -->
          <div
            v-if="scope.row.available && (isBrand && queryForm.queryType == 'brand') || ( !isBrand )"
          >
            <!-- 微信&支付宝 - 品牌未认证 -->
            <g-button
              v-if="scope.row.status===null"
              name="申请开通"
              :noIcon="true"
              type="detail"
              @click="applyForOpening(scope.row)"
            ></g-button>
            <!-- 支付宝 - 授权扫码 -->
            <g-button
              v-if="scope.row.status==='WAITING_AUTH'"
              :name="'申请授权'"
              :noIcon="true"
              type="detail"
              @click="goToAuthAlipay(scope.row)"
            ></g-button>
            <!-- 微信&支付宝 重新申请-信息录入 -->
            <!-- <router-link 
              :to="{
                path: scope.row.payMethodId === 1 ? '/brand-inner/open-up-pay' : '/brand-inner/ali-pay-info', 
                query: { detail: true, id: scope.row.id }
              }"
            >-->
            <g-button
              v-if="scope.row.status === 'CHECK_FAIL'"
              name="修改"
              icon="icon_operate_edit"
              type="detail"
              @click="editInfo(scope.row)"
            ></g-button>
            <!-- </router-link> -->
            <!-- 微信&支付宝 - 详情 -->
            <g-button
              v-if="['CHECK_PASS','CHECK_WAITING'].includes(scope.row.status)"
              name="详情"
              icon="icon_operate_eyes"
              type="green"
              @click="toDetail(scope.row)"
            ></g-button>
          </div>
          <p v-else-if="!scope.row.available" class="un-open">暂未开放</p>
          <p v-else>-</p>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-line" v-if="queryForm.queryType == 'store'">
      <div></div>
      <el-pagination
        style="margin: 5px 20px 0 0;"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-size="pageSize"
        :pager-count="5"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <div class="purview-set" v-if="queryForm.queryType == 'brand'">
      <h4>权限设置</h4>
    </div>
    <div class="purview-content" v-if="queryForm.queryType == 'brand'">
      <div class="shop-impower">
        <span style="vertical-align: top;" class="impower-text">门店授权：</span>
        <span>
          <el-radio-group v-model="accountForm.accountAuthType">
            <el-radio label="onlyBrand">仅限总部可进行收款账号设置</el-radio>
            <br />
            <el-radio label="includeLeague">加盟店可独立进行收款账号设置</el-radio>
            <br />
            <el-radio label="all">直营店，加盟店均可独立进行收款账号设置</el-radio>
          </el-radio-group>
        </span>
      </div>
      <div class="shop-impower" style="margin-top: 10px;">
        <span
          style="vertical-align: top; display: inline-block; margin-top: 2px;"
          class="impower-text"
        >默认账号：</span>
        <span style="display: inline-block;">
          <el-checkbox
            v-model="accountForm.defaultBrandAccount"
            @change="changeAccountCheck"
            :true-label="1"
            :false-label="0"
            class="default-check"
          >门店未设置收款账号时，默认采用总部账号</el-checkbox>
        </span>
      </div>
      <el-button @click="saveEdit" :loading="saveLoad" class="normal_red_btn save-edit">{{ '保存修改' }}</el-button>
    </div>
    <!-- 未认证品牌, 申请开通支付宝、微信扫码支付 -->
    <g-del-model
      :delTagDialogVisible="modelVisible"
      title="暂时不能申请！"
      icon="icon_popup_plaint"
      iconColor="#FCB322"
      confirmButton="前往认证"
      @close="modelVisible=false"
      @confirm="$router.push('/brand-inner/center/auth-brand')"
    >
      <p slot="content">
        按照国家相关规定，申请开通{{payMethod}}支付之前，须先完成品牌
        <span
          class="auth-real-name"
          @click="$router.push('/brand-inner/center/auth-brand')"
        >实名认证</span>。
      </p>
    </g-del-model>

    <!-- 支付宝授权 -->
    <g-dialog-with-slot
      :dialogVisible="slotDialogVisible"
      v-if="slotDialogVisible"
      :color="'#FF6D61'"
      :icon="'icon_popup_question'"
      :title="'确定申请开通吗？'"
      :resolveInfo="'确定开通'"
      @close="handleClose"
      @resolve="handleResolve"
    >
      <div class="dialog-body-container">
        <p class="red-font">开通后，该品牌所有门店的结算支付宝收款账号将发生更改。请谨慎操作！</p>
        <p>
          <el-input
            class="red-packet-phone-code"
            :maxlength="6"
            placeholder="请输入短信验证码"
            v-model="form.code"
          />
          <el-button
            class="normal_blue_btn"
            :loading="codeBtnLoading"
            @click="getCode"
          >{{codeBtnLoading ? `${timer}s` : '获取验证码'}}</el-button>
        </p>
        <p>验证码将发送至手机号：+86{{hiddenPhone}}</p>
        <p>
          <el-checkbox v-model="form.agree">已知晓风险，一切后果由本人自行承担</el-checkbox>
        </p>
      </div>
    </g-dialog-with-slot>
  </div>
</template>
<script>
import * as axios from "@/util/axios";
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      loading: false,
      payMethodDetailInfos: [],
      receiveAccountSetVisible: false,
      accountType: "",
      brandAuthenticated: false,
      modelVisible: false,
      statusTransfer: {
        CHECK_PASS: "已通过",
        CHECK_WAITING: "审核中",
        CHECK_PREPARE: "待审核",
        CHECK_FAIL: "已驳回"
      },
      slotDialogVisible: false, // alipay
      timer: 0, // 验证码倒计时
      codeBtnLoading: false, // 验证码加载
      phone: 0,
      hiddenPhone: "",
      form: {
        code: null,
        agree: false
      },
      payMethod: "", // 1微信&2支付宝 . 未认证时显示提示框用
      queryForm: {
        queryType: "brand"
      },
      saveLoad: false,
      accountForm: {
        accountAuthType: "onlyBrand",
        defaultBrandAccount: 1
      },
      pageNum: 1,
      pageSize: 10,
      total: 0,
      storeSort: null,
      searchWord: "",
      shopType: "",
      useBrand: null,
      hasAccount: false
    };
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo
    }),
    isBrand() {
      return this.$route.path.indexOf("brand") !== -1;
    }
  },
  mounted() {
    this.queryForm.queryType = this.isBrand ? "brand" : "store";
    if (this.isBrand) {
      // 门店端通过监听器调用
      this.getPayMethodDetailInfo();
    } else {
      this.getShopInfo();
    }
    // 品牌权限查询
    this.getBrandInfo();
    axios.get("/getBrandOwnerMobile/" + this.currentInfo.brandId).then(res => {
      this.phone = res;
      let h = (res + "").slice(0, 3);
      let e = (res + "").slice(-4);
      this.hiddenPhone = `${h}****${e}`;
    });
  },
  methods: {
    ...mapActions(["authAliPay", "authWechatPay"]),
    // 获取品牌是否认证， 未认证品牌不能申请开通支付
    getBrandInfo() {
      axios
        .post("/getBrandInfo", { brandId: this.currentInfo.brandId })
        .then(res => {
          // "0未认证，1已认证，2认证中，3认证失败"
          this.brandAuthenticated = res.auth === 1;
          this.accountForm.accountAuthType = res.accountAuthType;
          this.accountForm.defaultBrandAccount = res.defaultBrandAccount;
        });
    },
    getShopInfo() {
      axios.get(`/getShopInfoById/${this.currentInfo.shopId}`).then(res => {
        this.shopType = res.type;
        this.useBrand = !res.useStoreAccount;
      });
    },
    // 获取支付方式列表
    getPayMethodDetailInfo(type) {
      let params = {
        brandId: this.currentInfo.brandId,
        queryType: this.queryForm.queryType
      };
      if (type == "store" || !this.isBrand) {
        params.storeId = this.isBrand ? null : this.currentInfo.shopId;
        params.pageSize = this.pageSize;
        params.currentPage = this.pageNum - 1;
        params.storeType = this.storeSort;
        params.storeName = this.searchWord;
      }
      this.loading = true;
      axios.post("/getPaymethodDetailPaged", params).then(res => {
        this.payMethodDetailInfos = [];
        // 暂时写死两种支付方式 后端数据 搞得前端很尴尬。。。
        res.storeBrandInfoList.forEach(item => {
          this.payMethodDetailInfos.push(
            {
              ...item.aliPayMethod,
              name: item.name,
              storeType: item.storeType
            },
            { ...item.wxPayMethod }
          );
        });
        // 在门店端， 获取门店是否存在已经开通的账号
        if (!this.isBrand) {
          this.hasAccount =
            res.storeBrandInfoList[0].aliPayMethod.status == "CHECK_PASS" ||
            res.storeBrandInfoList[0].wxPayMethod.status == "CHECK_PASS";
        }
        // if (this.hasAccount) {
        //   this.useBrand = true
        // }
        this.total = res.total;
        this.$nextTick(() => {
          this.loading = false;
        });
      });
    },
    // 判断门店有无操作权限
    judgeStoreRight() {
      if (this.queryForm.queryType == "brand") return true;
      if (this.accountForm.accountAuthType == "onlyBrand") {
        return false;
      } else if (this.accountForm.accountAuthType == "includeLeague") {
        return this.shopType == "JOIN";
      } else {
        return true;
      }
    },
    // 申请开通支付 微信&支付宝 未认证的判断
    applyForOpening(row) {
      if (!this.judgeStoreRight())
        return this.$message.warning("品牌总部不允许该门店进行账户操作！");
      if (!this.brandAuthenticated) {
        this.payMethod = row.payMethodId === 1 ? "微信" : "支付宝"; // 未认证弹窗用 其他无需
        this.modelVisible = true;
        return;
      }
      if (row.payMethodId === 1) {
        // 微信
        this.authWechatPay({
          id: null, // 新增没有id
          operate: "create",
          brandId: this.currentInfo.brandId,
          isShop: !!(this.queryForm.queryType == "store")
        });
        if (this.isBrand) {
          this.$router.push("/brand-inner/open-up-pay");
        } else {
          this.$router.push("/shop-inner/open-up-pay");
        }
      } else {
        //  支付宝
        this.authAliPay({
          id: null, // 新增没有id
          operate: "create",
          brandId: this.currentInfo.brandId,
          isShop: !!(this.queryForm.queryType == "store")
        });
        if (this.isBrand) {
          this.$router.push("/brand-inner/ali-pay-info");
        } else {
          this.$router.push("/shop-inner/ali-pay-info");
        }
      }
    },
    editInfo(row) {
      if (!this.judgeStoreRight()) {
        this.$message.warning("品牌总部不允许该门店进行账户操作！");
        return;
      }
      if (row.payMethodId === 1) {
        // 微信
        this.authWechatPay({
          id: row.id,
          operate: "edit",
          brandId: this.currentInfo.brandId,
          isShop: !!(this.queryForm.queryType == "store")
        });
        if (this.isBrand) {
          this.$router.push("/brand-inner/open-up-pay");
        } else {
          this.$router.push("/shop-inner/open-up-pay");
        }
      } else {
        //  支付宝
        this.authAliPay({
          id: row.id,
          operate: "edit",
          brandId: this.currentInfo.brandId,
          isShop: !!(this.queryForm.queryType == "store")
        });
        if (this.isBrand) {
          this.$router.push("/brand-inner/ali-pay-info");
        } else {
          this.$router.push("/shop-inner/ali-pay-info");
        }
      }
    },
    toDetail(row) {
      if (row.payMethodId === 1) {
        // 微信
        this.authWechatPay({
          id: row.id,
          operate: "detail",
          brandId: this.currentInfo.brandId,
          isShop: !!(this.queryForm.queryType == "store")
        });
        if (this.isBrand) {
          this.$router.push("/brand-inner/open-up-pay");
        } else {
          this.$router.push("/shop-inner/open-up-pay");
        }
      } else {
        //  支付宝
        this.authAliPay({
          id: row.id,
          operate: "detail",
          brandId: this.currentInfo.brandId,
          isShop: !!(this.queryForm.queryType == "store")
        });
        if (this.isBrand) {
          this.$router.push("/brand-inner/ali-pay-info");
        } else {
          this.$router.push("/shop-inner/ali-pay-info");
        }
      }
    },
    goToAuthAlipay(row) {
      if (!this.judgeStoreRight()) {
        this.$message.warning("品牌总部不允许该门店进行账户操作！");
        return;
      }
      this.authAliPay({
        aliPayAccount: row.aliPayAccount
      });
      // -> 跳转授权页面 - 改成待授权状态处理
      this.slotDialogVisible = true;
    },
    // 支付宝支付认证 获取品牌创建者短信验证码
    getCode() {
      axios.post("/bindAliPayCode").then(res => {
        if (res.success) {
          this.$message({
            type: "success",
            message: "短信已发送,长时间未收到请重新获取"
          });
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
    // 支付宝支付  短信验证码校验
    handleResolve() {
      if (this.form.agree) {
        if (/^\d{4,6}$/.test(this.form.code)) {
          this.loading = true;
          axios
            .post("/getAliAuthLink", {
              brandId: this.currentInfo.brandId,
              code: this.form.code,
              mobile: this.phone
            })
            .then(res => {
              if (res.success) {
                // 扫码用的数据存储
                this.authAliPay({
                  // 长链接: authUrl ; 短链接: shortUrl 。
                  authUrl: res.shortUrl, // 该url在页面离开时要清空, 且在进入页面时判断 如果无字段则不能进入
                  brandId: this.currentInfo.brandId, // 强校验品牌id, 避免浏览器回退事件多品牌切换导致的bug
                  // - 这两个是缓存赋值用的，上面两个离开页面会清除
                  cacheURL: res.shortUrl
                });
                this.$router.push("/brand-inner/auth-ali-pay");
              } else {
                this.$message({
                  type: "error",
                  message: res.message
                });
              }
              this.loading = false;
            })
            .catch(err => {
              this.loading = false;
            });
        } else {
          this.$message({
            type: "error",
            message: "请输入验证码"
          });
        }
      } else {
        this.$message({
          type: "error",
          message: "请确认知晓风险并勾选选项框"
        });
      }
    },
    // 支付宝验证码弹窗关闭
    handleClose() {
      this.slotDialogVisible = false;
      this.form = {
        code: null,
        agree: false
      };
    },
    // 点击默认账号复选框
    changeAccountCheck(val) {
      if (!val) {
        this.accountForm.defaultBrandAccount = 1;
      }
      // this.$message.warning("该选项功能暂不可取消！");
      this.$message({
        message: "该选项功能暂不可取消！",
        type: "warning"
      });
    },
    storeUseBrand(val) {
    },
    async saveEdit() {
      try {
        this.saveLoad = true;
        const res = await axios.post("/updateBrandAccountAuthInfo", {
          ...this.accountForm,
          brandId: this.currentInfo.brandId
        });
        if (!res.success) this.$message.error("修改失败" + res.message);
        this.$message.success("修改成功");
        this.saveLoad = false;
      } finally {
        this.saveLoad = false;
      }
    },
    // 门店列表分页
    handleCurrentChange(index, type) {
      let typeFlag = type || this.queryForm.queryType;
      this.pageNum = index;
      this.getPayMethodDetailInfo(typeFlag);
    },
    searchData(val) {
      this.searchWord = val;
      this.handleCurrentChange(1);
    }
  },
  filters: {},
  watch: {
    "queryForm.queryType"(val) {
      this.handleCurrentChange(1, val);
    },
    storeSort(val) {
      this.handleCurrentChange(1, "store");
    },
    useBrand(val, old) {
      if (!this.hasAccount) return;
      if (old === null) return;
      // if (!val && old) {
      //   if (!this.hasAccount) {
      //     this.$message.error('您还没有开通账户，不能取消使用总部账户！')
      //     this.useBrand = true
      //     return
      //   }
      // }
      axios
        .post("/updateStoreUseStoreAccount", {
          storeId: this.currentInfo.shopId,
          useStoreAccount: val ? 0 : 1
        })
        .then(res => {
          if (!res.success) return this.$message.error("设置失败");
          this.$message.success("设置成功");
          this.getShopInfo();
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.root-con-bankAccount {
  box-sizing: border-box;
  padding: 20px 40px 0;

  .el-table {
    color: #333333;

    .row-class {
      .un-open {
        color: #999999;
      }

      .btn.detail {
        margin: 0;
      }

      .bankAccount-name {
        line-height: 36px; /* 为了撑开行高至设计高度 */
      }
    }

    /deep/ td {
      vertical-align: middle;
      border: none;
    }

    /deep/ tr:nth-child(2n + 1) {
      background: #f4f5f7;
    }
  }

  .auth-real-name {
    color: #58c9f3;
    cursor: pointer;
  }
}
.dialog-body-container {
  width: 277px;
  p {
    margin-bottom: 12px;
  }
  .red-font {
    color: #ff6d61;
  }
  .red-packet-phone-code {
    width: 145px;
  }
}

.bankAccount-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .head-left {
    display: flex;
    align-items: center;
  }
}

.account-list {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.account-list,
.purview-set {
  margin-top: 20px;
  border-bottom: 1px solid #b6b4b6;
}
.shop-impower {
  padding: 0 20px;
  margin-top: 30px;
  .impower-text {
    color: #b6b4b6;
    font-size: 15px;
  }
  > span {
    .el-radio-group {
      margin-top: 4px;
      /deep/ .el-radio {
        margin-bottom: 20px;
      }
    }
  }
}

.save-edit {
  margin: 50px 0 0 20px;
}

.default-check {
  /deep/ .el-checkbox__label {
    display: inline-block;
    vertical-align: -6%;
  }
}

.page-line {
  height: 65px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .foot-btn {
    padding: 8px 18px;
  }
}
</style>
