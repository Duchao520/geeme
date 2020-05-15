<template>
  <full-single-page :type="'brandManage'" :title="isEdit ? '编辑红包模板' : '新增红包模板'">
    <div class="page-body">
      <el-form :model="form" label-width="110px" :rules="rules" ref="form">
        <el-form-item
          label="模板名称："
          prop="redPacketTemplateInfo.templateName"
          :rules="{
            required: true,
            validator: templateName,
            trigger: 'change'
          }"
        >
          <el-input
            class="red-packet-name"
            v-model="form.redPacketTemplateInfo.templateName"
            placeholder="最多8字符"
            maxlength="8"
          />
        </el-form-item>
        <el-form-item label="红包类型：" :prop="'redPacketTemplateInfo.packetType'" required>
          <el-radio-group v-model="form.redPacketTemplateInfo.packetType">
            <el-radio :label="2">老客红包</el-radio>
            <el-radio :label="3">生日红包</el-radio>
            <el-radio :label="4">活动红包</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="红包明细：" required>
          <div
            class="single-red-packet"
            v-for="(rp, idx) in form.listRedPacketDetailTemplateInfo"
            :key="idx"
          >
            <el-form-item label="红包性质：" required>
              <el-radio-group
                v-model="rp.redPacketDetailType"
                @change="handleMoneyTypeChange(rp.redPacketDetailType, idx)"
              >
                <el-radio :label="1">定额红包</el-radio>
                <el-radio :label="2">随机红包</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="红包金额："
              v-if="rp.redPacketDetailType === 1"
              class="range-money-item"
              required
              style="height: 50px;"
            >
              <el-form-item
                :prop="'listRedPacketDetailTemplateInfo.' + idx + '.packetMoney'"
                :rules="{
                required: true,
                validator: validatePacketMoney,
                trigger: 'change'
              }"
              >
                <el-input
                  v-if="rp.redPacketDetailType === 1"
                  v-model.number="rp.packetMoney"
                  maxlength="9"
                  class="single-packet-money"
                  placeholder="请输入红包金额"
                >
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-form-item>
            <el-form-item
              label="红包金额："
              v-if="rp.redPacketDetailType === 2"
              class="range-money-item"
              required
            >
              <el-form-item
                :prop="
                  'listRedPacketDetailTemplateInfo.' + idx + '.packetMoneyFrom'
                "
                :rules="{
                  required: true,
                  validator: (rule, value, callback) => {validatePacketMoney(rule, value, callback, rp)},
                  trigger: 'change'
                }"
              >
                <el-input
                  v-if="rp.redPacketDetailType === 2"
                  v-model.number="rp.packetMoneyFrom"
                  maxlength="9"
                  class="single-packet-money half"
                  placeholder="请输入"
                >
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>&nbsp;&nbsp;至&nbsp;&nbsp;
              <el-form-item
                :prop="
                  'listRedPacketDetailTemplateInfo.' + idx + '.packetMoneyTo'
                "
                :rules="{
                  required: true,
                  validator: (rule, value, callback) => {validatePacketMoney(rule, value, callback, rp)},
                  trigger: 'change'
                }"
              >
                <el-input
                  v-if="rp.redPacketDetailType === 2"
                  v-model.number="rp.packetMoneyTo"
                  maxlength="9"
                  class="single-packet-money half"
                  placeholder="请输入"
                >
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-form-item>

            <el-form-item label="子红包数量：" :prop="'listRedPacketDetailTemplateInfo.' + idx" required>
              <input-number :max="20" :min="1" v-model="rp.count"></input-number>
            </el-form-item>

            <el-form-item
              label="使用条件："
              :prop="'listRedPacketDetailTemplateInfo.' + idx"
              :rules="{
                required: true,
                validator: validateLeastMoney,
                trigger: 'change'
              }"
            >
              <el-radio-group v-model="rp.packetUseCondition">
                <el-radio :label="0">无门槛</el-radio>
                <el-radio :label="1">
                  满&nbsp;
                  <el-input
                    type="number"
                    v-model.number="rp.leastMoney"
                    maxlength="6"
                    class="single-packet-least-money"
                    :disabled="rp.packetUseCondition !== 1"
                  >
                    <template slot="append">元</template>
                  </el-input>&nbsp;可以使用
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="可用商品："
              :prop="'listRedPacketDetailTemplateInfo.' + idx"
              :rules="{
              required: true,
              validator: validatePacketUseStrategy,
              trigger: 'change'
            }"
            >
              <el-radio-group v-model="rp.packetUseStrategy" class="single-packet-use-strategy">
                <el-radio :label="0">所有服务和产品</el-radio>
                <el-radio :label="1" style="margin-left:0;">所有服务</el-radio>
                <el-radio :label="2" style="margin-left:0;">所有产品</el-radio>
                <el-radio :label="3" style="margin-left:0;">
                  指定服务
                  <el-button
                    @click="openGoodsDialog(idx, 1)"
                    size="small"
                    plain
                    class="plain_blue_btn"
                    :disabled="rp.packetUseStrategy !== 3"
                  >选择服务</el-button>
                  <i style="margin-left: 40px;"></i>
                  指定产品
                  <el-button
                    @click="openGoodsDialog(idx, 2)"
                    size="small"
                    plain
                    class="plain_green_btn"
                    :disabled="rp.packetUseStrategy !== 3"
                  >选择产品</el-button>
                </el-radio>
              </el-radio-group>
            </el-form-item>

            <!-- 指定服务选择的结果 -->
            <el-table
              stripe
              class="red-packet-goods-table"
              :data="rp.partServiceUseStrategy"
              v-if="rp.partServiceUseStrategy.length"
              header-row-class-name="goods-table-herder"
              :height="
                rp.partServiceUseStrategy.length > 4
                  ? 5 * 49 + 65
                  : rp.partServiceUseStrategy.length * 49 + 65
              "
            >
              <el-table-column label="一级服务分类" prop="typeOneName"></el-table-column>
              <el-table-column label="二级服务分类" prop="typeTwoName"></el-table-column>
              <el-table-column label="操作" width="80">
                <template slot-scope="scope">
                  <i
                    class="icon iconfont icon-icon_operate_delete"
                    @click="delSelectedService(scope.$index, idx, 'Service')"
                  ></i>
                </template>
              </el-table-column>
            </el-table>
            <!-- 指定产品选择的结果 -->
            <el-table
              stripe
              class="red-packet-goods-table"
              :data="rp.partProductUseStrategy"
              v-if="rp.partProductUseStrategy.length"
              header-row-class-name="goods-table-herder"
              :height="
                rp.partProductUseStrategy.length > 4
                  ? 5 * 49 + 65
                  : rp.partProductUseStrategy.length * 49 + 65
              "
            >
              <el-table-column label="一级产品分类" prop="typeOneName"></el-table-column>
              <el-table-column label="二级产品分类" prop="typeTwoName"></el-table-column>
              <el-table-column label="操作" width="80">
                <template slot-scope="scope">
                  <i
                    class="icon iconfont icon-icon_operate_delete"
                    @click="delSelectedService(scope.$index, idx, 'Product')"
                  ></i>
                </template>
              </el-table-column>
            </el-table>

            <!-- 删除 -->
            <i
              class="red-packet-del-btn icon iconfont icon-icon_operate_delete"
              v-if="idx"
              @click="delSinglePacket(idx)"
            ></i>
          </div>
          <!-- 增加 -->
          <div
            class="add-single-packet"
            v-if="form.listRedPacketDetailTemplateInfo.length < max"
            @click="addSinglePacket"
          >
            <i class="icon iconfont icon-icon_ope_append"></i>
            增加红包
          </div>
        </el-form-item>
        <el-form-item label="优惠券同享：" prop="redPacketTemplateInfo.useWithCoupons" required>
          <!-- 暂时写死不能和优惠券同享 -->
          <el-radio-group v-model="form.redPacketTemplateInfo.useWithCoupons" disabled>
            <el-radio :label="true">可与优惠券同享</el-radio>
            <el-radio :label="false">不可与优惠券同享</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="会员卡同享：" prop="redPacketTemplateInfo.useWithCustomerCard" required>
          <el-radio-group v-model="form.redPacketTemplateInfo.useWithCustomerCard">
            <el-radio :label="true">可与会员卡同享</el-radio>
            <el-radio :label="false">不可与会员卡同享</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="适用门店："
          :prop="'redPacketTemplateInfo.suitStoreStrategy'"
          :rules="{
          required: true,
          validator: validateLeastMoney,
          trigger: 'change'
        }"
        >
          <el-radio-group v-model="form.redPacketTemplateInfo.suitStoreStrategy">
            <el-radio :label="0">所有门店</el-radio>
            <el-radio :label="1">所有直营店</el-radio>
            <el-radio :label="2">
              指定门店&nbsp;
              <el-button
                size="small"
                plain
                class="plain_blue_btn"
                :disabled="form.redPacketTemplateInfo.suitStoreStrategy !== 2"
                @click="openShopsDialog"
              >选择门店</el-button>
            </el-radio>
          </el-radio-group>
          <!-- 指定门店选择的结果 -->
          <div class="selected-shops">
            <el-table
              stripe
              cell-class-name="shops-cell"
              header-row-class-name="goods-table-herder"
              :data="renderCheckedShops"
              v-if="renderCheckedShops.length"
              :height="
                renderCheckedShops.length > 4
                  ? 5 * 49 + 65
                  : renderCheckedShops.length * 49 + 65
              "
            >
              <el-table-column show-overflow-tooltip label="省份" prop="province"></el-table-column>
              <el-table-column show-overflow-tooltip label="城市" prop="city"></el-table-column>
              <el-table-column show-overflow-tooltip label="门店名称" prop="storeName"></el-table-column>
              <el-table-column show-overflow-tooltip label="门店性质">
                <template slot-scope="scope">{{ scope.row.type === "DIRECT" ? "直营店" : "加盟店" }}</template>
              </el-table-column>
              <el-table-column label="操作" width="48">
                <template slot-scope="scope">
                  <i
                    class="icon iconfont icon-icon_operate_delete"
                    @click="delSelectedShops(scope.$index)"
                  ></i>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
        <el-form-item label="使用说明：">
          <el-input
            type="textarea"
            placeholder="请输入使用说明"
            v-model="form.redPacketTemplateInfo.introduction"
            maxlength="60"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="预览：" style="width: 165px;">
          <singleRedpacket
            :superData="form.redPacketTemplateInfo"
            :singleData="form.listRedPacketDetailTemplateInfo[0]"
            :customerEntry="{
              type: simulatePacket.active,
              sTime: simulatePacket.validStartTime,
              eTime: simulatePacket.validFinishTime,
              startValid: simulatePacket.startValid
            }"
          />
        </el-form-item>
        <el-form-item style="width: 165px;">
          <div class="createTempBtn">
            <el-button
              class="normal_blue_btn"
              :loading="btnLoading"
              @click="saveTemplateRp"
            >{{ isEdit ? '保存' : '添加'}}</el-button>
            <el-button plain class="plain_blue_btn" @click="cancel">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <!-- 选择指定服务/产品 [需要销毁!] -->
    <selectService
      v-if="goodsVisible"
      :goodsVisible="goodsVisible"
      :title="currentGoodsTitle"
      :superList="currentList"
      :superCheckedGoods="renderCheckedGoods"
      @suberData="setGoodsTable"
      @close="goodsVisible = false"
    />
    <!-- 选择适用门店 -->
    <selectShops
      v-if="shopsVisible"
      :shopsVisible="shopsVisible"
      :title="shopsDialogTitle"
      :superCheckedShops="checkedShopIds"
      @suberData="setShopsTable"
      @close="shopsVisible = false"
    />
  </full-single-page>
</template>
<script>
import selectService from "../redPacket/components/selectServices";
import selectShops from "../redPacket/components/selectShops";
import inputNumber from "@/components/common/InputNumber";
import * as axios from "@/util/axios";
import { mapActions, mapState } from "vuex";
import { reg, checkReg } from "@/assets/js/RegExp";
import { types } from "util";
import singleRedpacket from "@/pages/marketManagement/marketSoft/redPacket/components/singleRedPacket";
export default {
  name: "create-red-packet-model",
  data() {
    return {
      // 模拟红包数据
      simulatePacket: {
        customerRedPacketBasicInfo: {
          packetType: 1,
          packetTypeName: "现金红包",
          packetName: "双十一红包",
          useWithCoupons: false,
          suitStoreStrategy: 0,
          partSuitStoreStrategy: null,
          useWithCustomerCard: null
        },
        customerRedPacketDetailInfo: {
          packetMoney: 88,
          packetUseCondition: 5,
          leastMoney: 100,
          packetUseStrategy: 30,
          partProductUseStrategy: null,
          partServiceUseStrategy: null
        },
        active: true,
        validStartTime: "2019-11-18 19:41:06",
        validFinishTime: "2020-02-26 00:00:00",
        startValid: true
      },
      form: {
        // packetType: 4, // 写死的活的红包
        // packetTypeName: "活动红包", // 写死的活的红包
        redPacketTemplateInfo: {
          brandId: null,
          introduction: "", // 使用说明
          packetType: 2, // 红包类型：1-新人，2-老客，3-生日，4-活动
          packetTypeName: "老客红包", // 红包类型名称
          suitStoreStrategy: 0, // 适用门店策略:0-所有门店，1-所有直营店，2指定门店
          partSuitStoreStrategy: {
            // 适用指定门店策略
            type: 0, // 0-指定门店，1-指定区域
            province: "", // 省-指定区域模式
            city: "", // 市-指定区域模式
            storeList: [
              // 指定门店模式，
              {
                storeId: null,
                storeName: ""
              }
            ]
          },
          templateName: "", // 红包模板/红包名称,不创建模板时不用传
          useWithCoupons: false, // 是否可以与优惠券同时使用: false-不可以，true-可以
          useWithCustomerCard: false // 是否可以与会员卡同时使用: false-不可以，true-可以
        },
        listRedPacketDetailTemplateInfo: [
          {
            redPacketDetailType: 1, // 定额 1–定额红包,2–随机红包
            packetMoney: 0, // 固定金额-额度 随机红包时传0
            packetMoneyFrom: null, // 随机金额-小 定额红包时传0
            packetMoneyTo: null, // 随机金额-大 定额红包时传0
            packetUseCondition: 0, // 使用门槛 0-无条件，1-满一定额度
            leastMoney: null, // 满多少元可以使用
            packetUseStrategy: 0, // 红包使用范围策略:0-所有服务和产品，1-所有服务，2-所有产品，3-指定服务，指定产品
            partServiceUseStrategy: [], // 适用服务
            partProductUseStrategy: [], // 适用产品
            count: 1 // 子红包数量
          }
        ] // 子红包数组
      },
      // 1- 指定服务/产品 - begin ->
      goodsVisible: false, // 指定服务/产品模态框
      currentGoodsTitle: "",
      currentGoodsType: 1, // [红包明细]当前打开的模态框: 服务1 产品2
      currentPacketIdx: 0, // [红包明细]对应下标的红包
      renderCheckedGoods: [], // 反向渲染的勾选服务/产品
      currentList: [], // 是下面的服务或者产品
      servicesList: [],
      productsList: [],
      // 1- 指定服务/产品 - end <--
      // 2- 指定门店 - begin ----->
      shopsVisible: false, // 指定门店模态框
      shopsDialogTitle: "", // 指定门店模态框标题
      renderCheckedShops: [], // 反向渲染的勾选指定门店
      checkedShopIds: new Set(), // 选中的门店id
      checkedShopObj: {}, // 键值对化的选中门店 key: shopId, value: shopObj
      // 2- 指定门店 - end <-------
      timer: 0, // 验证码倒计时
      codeBtnLoading: false, // 验证码加载
      pageLoading: false, // 页面加载
      max: 20, // 设置红包最多个数，避免数据量太大
      rules: {
        validTimeStrategy: {
          required: true,
          validator: this.validTimeStrategy
        },
        templateName: { required: true, validator: this.templateName },
        code: { required: true, validator: this.code },
        packetType: { required: true, message: "请完善必填字段" } // 偷个懒，所有带了默认单选框的都用他
      },
      btnLoading: false
    };
  },
  created() {
    this.form.redPacketTemplateInfo.brandId = this.currentInfo.brandId;
    this.getServicesList();
    this.getProductsList();
    if (this.$route.params.id) {
      this.getRedPackTemInfo(this.$route.params.id);
    }
  },
  methods: {
    // 获取红包模板的信息
    async getRedPackTemInfo(id) {
      const res = await axios.post("/getRedPacketTemplateInfo", {
        id
      });
      res.listRedPacketDetailTemplateInfo.forEach(item => {
        item.partProductUseStrategy = item.partProductUseStrategy || [];
        item.partServiceUseStrategy = item.partServiceUseStrategy || [];
      });
      if (res.redPacketTemplateInfo.suitStoreStrategy == 2) {
        res.redPacketTemplateInfo.partSuitStoreStrategy.storeIdList.forEach(
          item => {
            item.type = item.type == 1 ? "JOIN" : "DIRECT";
          }
        );
        this.renderCheckedShops =
          res.redPacketTemplateInfo.partSuitStoreStrategy.storeIdList || [];
        this.renderCheckedShops &&
          this.renderCheckedShops.map(i => {
            this.checkedShopIds.add(i.storeId);
            this.checkedShopObj[i.storeId] = i;
          });
      }
      this.form.redPacketTemplateInfo = res.redPacketTemplateInfo;
      this.form.listRedPacketDetailTemplateInfo =
        res.listRedPacketDetailTemplateInfo;
    },
    // ===这里可能要放到提交的时候再遍历处理===
    handleMoneyTypeChange(type, idx) {
      // 1定额红包 2随机红包
      if (type === 1) {
        this.form.listRedPacketDetailTemplateInfo[idx].packetMoneyFrom = 0;
        this.form.listRedPacketDetailTemplateInfo[idx].packetMoneyTo = 0;
      } else {
        this.form.listRedPacketDetailTemplateInfo[idx].packetMoney = 0;
      }
    },

    // 获取服务数据 --for:指定指定服务/产品--
    getServicesList() {
      axios
        .post("/getStoreSortInfoWithFilter", {
          brandId: this.currentInfo.brandId
        })
        .then(res => {
          if (res.hasData) {
            this.servicesList = res.sortInfos;
          }
        });
    },
    // 获取产品数据 --for:指定指定服务/产品--
    getProductsList() {
      axios
        .post("/getProductSortListByNameAndBrandId", {
          brandId: this.currentInfo.brandId
        })
        .then(res => {
          if (res.hasData) {
            this.productsList = res.sortInfos;
          }
        });
    },
    // 打开指定服务/产品模态框 --for:指定指定服务/产品--
    openGoodsDialog(idx, type) {
      this.currentPacketIdx = idx;
      this.currentGoodsType = type;
      this.currentGoodsTitle = type === 1 ? "选择服务分类" : "选择产品分类";
      this.currentList = type === 1 ? this.servicesList : this.productsList;
      this.goodsVisible = true;
      let tag =
        type === 1 ? "partServiceUseStrategy" : "partProductUseStrategy";
      this.renderCheckedGoods = this.form.listRedPacketDetailTemplateInfo[idx][
        tag
      ];
    },
    // 删除一个指定的服务或产品 --for:指定指定服务/产品--
    delSelectedService(rowIdx, redPacketIdx, type) {
      this.form.listRedPacketDetailTemplateInfo[redPacketIdx][
        `part${type}UseStrategy`
      ].splice(rowIdx, 1);
    },
    // 打开适用门店模态框 --for:指定指定门店--
    openShopsDialog() {
      this.shopsVisible = true;
      this.shopsDialogTitle = "选择适用门店";
    },
    // 模态框适用门店选择交互 --for:指定指定门店--
    setShopsTable(obj) {
      obj.yes.map(i => {
        if (!this.checkedShopIds.has(i.id)) {
          this.checkedShopIds.add(i.id);
          this.checkedShopObj[i.id] = {
            storeId: i.id,
            storeName: i.name,
            province: i.province,
            city: i.city,
            type: i.type
          };
        }
      });
      obj.no.map(i => {
        if (this.checkedShopIds.has(i.id)) {
          this.checkedShopIds.delete(i.id);
          delete this.checkedShopObj[i.id];
        }
      });
      this.renderCheckedShops = Object.values(this.checkedShopObj);
    },
    // 删除一个指定的门店 --for:指定指定门店--
    delSelectedShops(idx) {
      // 先执行删除set/obj
      let id = this.renderCheckedShops[idx].storeId;
      this.checkedShopIds.delete(id);
      delete this.checkedShopObj[id];
      // 再执行删除表格
      this.renderCheckedShops.splice(idx, 1);
    },
    // 删除红包
    delSinglePacket(idx) {
      this.form.listRedPacketDetailTemplateInfo.splice(idx, 1);
    },
    // 添加红包
    addSinglePacket() {
      this.form.listRedPacketDetailTemplateInfo.push({
        redPacketDetailType: 1, // 定额 1–定额红包,2–随机红包
        packetMoney: null, // 固定金额-额度
        packetMoneyFrom: null, // 随机金额-小
        packetMoneyTo: null, // 随机金额-大
        packetUseCondition: 0, // 使用门槛 0-无条件，1-满一定额度
        leastMoney: null, // 满多少元可以使用
        packetUseStrategy: 0, // 红包使用范围策略:0-所有服务和产品，1-所有服务，2-所有产品，3-指定服务，指定产品
        partServiceUseStrategy: [], // 适用服务
        partProductUseStrategy: [], // 适用产品
        count: 1 // 子红包数量
      });
    },
    // 根据模态框的勾选状态展示当前的选择产品/服务到表格 --for:指定指定服务/产品--
    setGoodsTable(list) {
      let type =
        this.currentGoodsType === 1
          ? "partServiceUseStrategy"
          : "partProductUseStrategy";
      let tagTable = (this.form.listRedPacketDetailTemplateInfo[
        this.currentPacketIdx
      ][type] = []);
      for (let i = 0; i < list.length; i++) {
        // 全选或半选的一级类别
        if (list[i].checked || list[i].indeterminate) {
          for (let j = 0; j < list[i].sortTwo.length; j++) {
            list[i].sortTwo[j].checked &&
              tagTable.push({
                typeOneId: list[i].jimeiClassId,
                typeOneName: list[i].sortName,
                typeTwoId: list[i].sortTwo[j].jimeiClassId,
                typeTwoName: list[i].sortTwo[j].sortName
              });
          }
        }
      }
      this.goodsVisible = false;
    },
    saveTemplateRp() {
      this.$refs.form.validate(async valid => {
        if (!valid) return this.$message.error("请正确填写相关信息");
        let errorData = this.form.listRedPacketDetailTemplateInfo.some(i => {
          if (
            i.packetUseStrategy === 3 &&
            !i.partProductUseStrategy.length &&
            !i.partServiceUseStrategy.length
          ) {
            return true;
          } else {
            return false;
          }
        });
        if (errorData) {
          this.$message({
            type: "error",
            message: "红包指定使用范围时，请至少指定一个服务或者产品"
          });
          return;
        }
        let info = JSON.parse(JSON.stringify(this.form));
        this.renderCheckedShops.forEach(item => {
          item.type = item.type === "JOIN" ? 1 : 0;
        });
        // 指定门店参数
        if (info.redPacketTemplateInfo.suitStoreStrategy == 2) {
          info.redPacketTemplateInfo.partSuitStoreStrategy = {
            storeIdList: this.renderCheckedShops
          };
        } else {
          delete info.redPacketTemplateInfo.partSuitStoreStrategy;
        }
        // 子红包类型参数
        info.listRedPacketDetailTemplateInfo.forEach(item => {
          if (item.redPacketDetailType === 1) {
            item.packetMoneyFrom = 0;
            item.packetMoneyTo = 0;
          } else {
            item.packetMoney = 0;
          }
          if (!item.packetUseCondition) {
            item.leastMoney = 0;
          }
        });
        this.btnLoading = true;
        try {
          let url = this.isEdit ? '/updateRedPacketTemplate' : '/createRedPacketTemplate'
          const res = await axios.post(url, info);
          if (!res.success) return this.$message.error( this.isEdit ? '编辑模板失败' :  "新增模板失败");
          this.$message.success(this.isEdit ? '编辑模板成功' :"新增模板成功");
          this.cancel();
        } finally {
          this.btnLoading = false;
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
    },
    /*  ==================================== ▼▼▼ 验证相关 ▼▼▼ ====================================  */
    // 红包金额验证
    validatePacketMoney(rule, value, callback, rp) {
      if (!value) {
        return callback(new Error("红包金额不能为0"));
      }
      if (rp.redPacketDetailType === 2) {
        if (rp.packetMoneyFrom >= rp.packetMoneyTo) {
          return callback(new Error("请输入正确的金额范围"));
        }
      }
      if (!checkReg(/^\d{1,9}$/, value)) {
        // html 中有maxlength需要同步
        callback(new Error("请输入1~9位的自然数!"));
      } else {
        callback();
      }
    },
    // 红包满减金额验证
    validateLeastMoney(rule, obj, callback) {
      if (obj.packetUseCondition === 1) {
        if (!checkReg(/^[1-9]\d{0,5}$/, obj.leastMoney)) {
          // html 中有maxlength需要同步
          callback(new Error("请输入1~6位的正整数!"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    // 红包可用商品验证
    validatePacketUseStrategy(rule, obj, callback) {
      if (obj.packetUseStrategy === 3) {
        if (
          !obj.partServiceUseStrategy.length &&
          !obj.partProductUseStrategy.length
        ) {
          // html 中有maxlength需要同步
          callback(new Error("请至少选择一种服务或产品!"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    // 红包满减金额验证
    validateLeastMoney(rule, obj, callback) {
      if (obj.packetUseCondition === 1) {
        if (!checkReg(/^[1-9]\d{0,5}$/, obj.leastMoney)) {
          // html 中有maxlength需要同步
          callback(new Error("请输入1~6位的正整数!"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    templateName(rule, value, callback) {
      if (!checkReg(/^[A-z0-9_\-\u4e00-\u9fa5]{2,8}$/, value)) {
        callback(new Error("请输入2~8长度的数字、字母、汉字、减号和下划线"));
      } else {
        callback();
      }
    },
    validTimeStrategy(rules, value, callback) {
      if (!checkReg(reg["yearDays"], this.validDay)) {
        callback(new Error("请输入不大于365的自然数!"));
      } else {
        callback();
      }
    },
    code(rule, value, callback) {
      if (!checkReg(/^\d{1,6}$/, value)) {
        callback(new Error("正确的验证码"));
      } else {
        callback();
      }
    }
  },
  watch: {
    "form.redPacketTemplateInfo.packetType"(val) {
      switch (val) {
        case 1:
          this.form.redPacketTemplateInfo.packetTypeName = "新人红包";
          break;
        case 2:
          this.form.redPacketTemplateInfo.packetTypeName = "老客红包";
          break;
        case 3:
          this.form.redPacketTemplateInfo.packetTypeName = "生日红包";
          break;

        default:
          this.form.redPacketTemplateInfo.packetTypeName = "活动红包";
          break;
      }
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo
    }),
    isEdit() {
      return !!this.$route.params.id;
    }
  },
  components: { selectService, selectShops, inputNumber, singleRedpacket }
};
</script>
<style lang="scss" scoped>
@import "@/assets/css/scrollbar.scss";
$blue: #58c9f3;
$gray: #d5dadf;
$bg: #f4f5f7;
.page-body {
  padding: 36px 72px 85px;
}
.red-packet-name {
  width: 217px;
}
.time-length {
  width: 100px;
}
.red-packet-phone-code {
  width: 145px;
}
.red-packet-text-info {
  font-size: 12px;
  color: #999;
}
.form-item-no-waring {
  margin-bottom: 0;
}
.range-money-item {
  /deep/ .el-form-item__content {
    display: flex;
    flex-wrap: nowrap;
    margin-bottom: 0;
  }
}
/deep/ .el-form-item__content {
  margin-bottom: 10px;
}
.single-red-packet {
  position: relative;
  box-sizing: border-box;
  padding: 20px 20px 10px;
  width: 550px;
  margin-bottom: 10px;
  border: 1px solid #f0f1f4;
  border-radius: 2px;
  .single-packet-money {
    width: 200px;
    &.half {
      width: 140px;
    }
  }
  .single-packet-least-money {
    width: 156px;
  }
  .el-form-item {
    margin-bottom: 10px;
  }
  .single-packet-use-strategy {
    height: 80px;
    width: 360px;
    padding-top: 12px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .red-packet-goods-table {
    margin-bottom: 20px;
  }
  .red-packet-del-btn {
    position: absolute;
    bottom: -10px;
    right: -26px;
  }
}
.selected-shops {
  width: 550px;
  margin-top: 12px;
}
.add-single-packet {
  width: 80px;
  color: $blue;
  &:hover {
    cursor: pointer;
  }
}
.footer-line {
  padding-left: 100px;
}
.icon-icon_operate_delete {
  &:hover {
    cursor: pointer;
  }
}
.red-packet-count {
  position: absolute;
  bottom: 25px;
  right: -110px;
}
</style>
<style lang="scss">
$bg: #f4f5f7;
.send-red-packet-box {
  .goods-table-herder {
    background: $bg;
    th {
      background: $bg;
      padding: 0;
    }
  }
}
.el-textarea {
  width: 40%;
  textarea {
    resize: none;
  }
}

.createTempBtn {
  display: flex;
}
</style>
