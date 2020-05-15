<template>
  <div>
    <div class="root-con">
      <div class="top-operation">
        <!-- add card -->
        <!-- 新增会员卡， 改成动态组件后该路由要调整 -->
        <el-button
          class="add-card normal_red_btn"
          v-if="checkHasBtnPermission(`/${currentEntry}-inner/add-new-vip-card`, 'path')"
          @click="add"
        >新增会员卡</el-button>
        <i v-else></i>
        <!-- search card -->
        <input-search :value="queryParam.cardName" @search="onSearch" placeholder="请输入会员卡名称"></input-search>
      </div>

      <div class="top-con">
        <!-- tags bar -->
        <div class="card-tags-bar">
          <ul class="tags-group" v-if="currentStatus != '4'">
            <li
              v-for="item in kindList"
              :key="item.type"
              class="tag"
              :class="{active: currentKind === item.type }"
              @click="changeKind(item.type)"
            >{{ formatCardKind(item.type) }} ({{item.count}})</li>
          </ul>
          <ul class="tags-group" v-else>
            <li
              class="tag active"
            >全部 ({{inBrand ? '4' : '2' }})</li>
          </ul>
        </div>
      </div>
      <div class="main-con">
        <!-- 状态标签 -->
        <div class="user-defined-tab">
          <el-tabs type="card" :value="currentStatus" @tab-click="handleStatusChange">
            <el-tab-pane
              v-for="item in selectStatus"
              :key="item.code"
              :label="item.type"
              :name="item.code"
            ></el-tab-pane>
          </el-tabs>
        </div>

        <!-- 会员卡类型表 -->
        <div class="main-con-con" :style="currentStatus != '4' ? '' : 'padding-bottom: 20px;'">
          <el-checkbox-group
            v-model="checkList"
            @change="handleCardListChange"
            v-if="currentStatus != '4'"
          >
            <el-table
              v-loading="tableLoading"
              :data="cardList"
              tooltip-effect="dark"
              stripe
              style="width: 100%"
              :row-style="rowStyle"
              :header-row-style="headerRowstyle"
              height="calc(100vh - 345px)"
              empty-text="查找为空"
            >
              <!-- checkbox -->
              <el-table-column
                label
                width="25"
                v-if="inBrand && checkHasBtnPermission(`${currentEntry}_goods_card_tableButtons`)"
              >
                <template slot-scope="scope">
                  <el-checkbox :key="scope.row.id" :label="scope.row.id"></el-checkbox>
                </template>
              </el-table-column>
              <!-- 排序 input 少排序字段-->
              <el-table-column
                align="left"
                label="排序"
                width="50"
                v-if="checkHasBtnPermission(`${currentEntry}_goods_card_tableButtons`)"
              >
                <template slot-scope="scope">
                  <number-input :max="99" v-model="scope.row.sortWeight" @blur="reSort(scope.row)"></number-input>
                </template>
              </el-table-column>
              <!-- 会员卡名称 少会员卡封面src， 且需要一个format函数处理它 -->
              <el-table-column align="left" label="卡项名称" width="230">
                <template slot-scope="scope">
                  <div class="card-name">
                    <div class="card-img-wrapper">
                      <img
                        :src="formatPicImage(brandLogo, 'style', 70, 'brandLogo')"
                        class="brand-logo"
                      />
                      <img :src="formatPicImage(scope.row.cardCover, 'style', 70, 'brandLogo')" />
                    </div>
                    <div :title="scope.row.cardName">{{scope.row.cardName}}</div>
                  </div>
                </template>
              </el-table-column>
              <!-- 会员卡分类 -->
              <el-table-column align="left" label="会员卡分类" width="120">
                <template
                  slot-scope="scope"
                >{{ scope.row.giftCard ? '礼品卡' : formatCardType(scope.row.cardType)}}</template>
              </el-table-column>
              <!-- 有效期限 -->
              <el-table-column align="left" label="有效期限" width="80">
                <template slot-scope="scope">{{formatValidNum(scope.row)}}</template>
              </el-table-column>
              <!-- 首次充值/售价 -->
              <el-table-column align="left" label="首次充值/售价" width="120">
                <template slot-scope="scope">
                  <span style="color:#FF6D61;">{{formatPrice(scope.row)}}</span>
                </template>
              </el-table-column>
              <!-- 发售数量 -->
              <el-table-column align="left" label="发售数量" width="80">
                <template slot-scope="scope">{{scope.row.cardSellNum||'不限'}}</template>
              </el-table-column>
              <!-- 单店限售数量 -->
              <el-table-column align="left" label="单店限售数量" width="120">
                <template slot-scope="scope">{{scope.row.cardStoreSellNum||'不限'}}</template>
              </el-table-column>
              <!-- 销量 -->
              <el-table-column align="left" label="销量" width="70">
                <template slot-scope="scope">{{scope.row.sales||0}}</template>
              </el-table-column>
              <!-- 上架时间 -->
              <el-table-column align="left" label="上架时间" width="160">
                <template slot-scope="scope">{{scope.row.upperTime}}</template>
              </el-table-column>
              <!-- 状态 是否换成已封装组件 status-text-->
              <el-table-column align="left" label="状态" width="110">
                <template slot-scope="scope">
                  <div class="card-status">
                    <span
                      class="tags"
                      v-show="scope.row.upperStatus === 0"
                      style="background:#A9D86E;"
                    >已上架</span>
                    <span
                      class="tags"
                      v-show="scope.row.upperStatus !== 0"
                      style="background:#FF6D61;"
                    >未上架</span>
                    <span
                      class="tags"
                      v-show="scope.row.deleteStatus !== 0"
                      style="background:#C1C0C9;"
                    >已删除</span>
                    <span
                      class="tags"
                      v-show="scope.row.superRecommend"
                      style="background:#F52D56;"
                    >超值推荐</span>
                  </div>
                </template>
              </el-table-column>
              <!-- 续卡规则 -->
              <el-table-column align="left" label="续卡规则">
                <template slot-scope="scope">
                  <div class="card-rule" v-if="scope.row.cardType < 2">
                    <div class="rule">
                      <p v-show="showRuleDetail(scope.row)" v-html="formatRule(scope.row)"></p>
                    </div>
                    <!-- 要区分身份卡 和 储值卡 隐藏一个-->
                    <div class="operator">
                      <span
                        @click="beginSetRule(scope.row)"
                        v-show="showAddRuleBtn(scope.row) && checkHasBtnPermission(`${currentEntry}_goods_card_tableButtons`)"
                      >设置</span>
                      <i
                        class="icon iconfont icon-icon_operate_edit"
                        @click="beginSetRule(scope.row)"
                        v-show="showEditRuleBtn(scope.row) && checkHasBtnPermission(`${currentEntry}_goods_card_tableButtons`)"
                      ></i>
                      <span v-show="showNoNeedRule(scope.row)" style="color: #333;">—</span>
                    </div>
                  </div>
                  <span v-else>—</span>
                </template>
              </el-table-column>
              <!-- 操作 -->
              <el-table-column
                align="left"
                label="操作"
                width="220"
                v-if="checkHasBtnPermission(`/${currentEntry}-inner/vip-card-details`, 'path') || checkHasBtnPermission(`/${currentEntry}-inner/edit-vip-card`, 'path') || checkHasBtnPermission(`${currentEntry}_goods_card_tableButtons`)"
              >
                <template slot-scope="scope">
                  <g-button
                    @click="goDetail(scope.row.id)"
                    :name="'详情'"
                    :type="'green'"
                    :icon="'icon_operate_eyes'"
                    v-if="checkHasBtnPermission(`/${currentEntry}-inner/vip-card-details`, 'path')"
                  ></g-button>
                  <g-button
                    :name="'编辑'"
                    type="detail"
                    :icon="'icon_operate_edit'"
                    @click="edit(scope.row)"
                    v-if="scope.row.deleteStatus === 0 && checkHasBtnPermission(`/${currentEntry}-inner/edit-vip-card`, 'path') && (currentEntry === 'shop' && scope.row.cardType > 1 || currentEntry === 'brand' && scope.row.cardType < 2)"
                  ></g-button>
                  <g-button
                    :name="'下架'"
                    type="cancel"
                    :icon="'icon_operate_down'"
                    v-if="scope.row.upperStatus === 0 && checkHasBtnPermission(`${currentEntry}_goods_card_tableButtons`) && (currentEntry === 'shop' && scope.row.cardType > 1 || currentEntry === 'brand' && scope.row.cardType < 2)"
                    @click="cardOperator('offShelf', [scope.row.id])"
                  ></g-button>
                  <g-button
                    :name="'删除'"
                    type="cancel"
                    :icon="'icon_operate_delete'"
                    v-if="scope.row.upperStatus !== 0 && scope.row.deleteStatus === 0 && checkHasBtnPermission(`${currentEntry}_goods_card_tableButtons`) && (currentEntry === 'shop' && scope.row.cardType > 1 || currentEntry === 'brand' && scope.row.cardType < 2)"
                    @click="cardOperator('delete', [scope.row.id])"
                  ></g-button>
                  <g-button
                    :name="'恢复'"
                    :type="'green'"
                    :icon="'icon_operate_recover'"
                    v-if="scope.row.deleteStatus !== 0 && checkHasBtnPermission(`${currentEntry}_goods_card_tableButtons`) && (currentEntry === 'shop' && scope.row.cardType > 1 || currentEntry === 'brand' && scope.row.cardType < 2)"
                    @click="cardOperator('recover', [scope.row.id])"
                  ></g-button>
                </template>
              </el-table-column>
            </el-table>
          </el-checkbox-group>

          <el-table
            v-if="currentStatus == '4' && showCardCover"
            v-loading="tableLoading"
            :data="inBrand ? defaultPicData : defaultPicData_Shop"
            tooltip-effect="dark"
            stripe
            style="width: 100%;"
            :row-style="defaultRowStyle"
            :header-row-style="headerRowstyle"
            height="calc(100vh - 291px)"
          >
            <el-table-column label="会员卡类型">
              <template slot-scope="{row}">
                <p>{{ row.cardType | cardNameFilter }}</p>
              </template>
            </el-table-column>

            <el-table-column label="默认封面">
              <template slot-scope="{row}">
                <div class="card-smallInfo">
                  <div class="card-detail">
                    <p>会员卡名称</p>
                    <p class="card-type">{{ row.giftCard ? '礼品卡' : formatCardType(row.cardType)}}</p>
                  </div>
                  <img
                    :src="formatPicImage(brandLogo, 'style', 70, 'brandLogo')"
                    class="brand-logo"
                  />
                  <img
                    v-if="row.cardCover"
                    class="card-cover"
                    :src="formatPicImage(row.cardCover, 'style', 70, 'brandLogo')"
                  />
                  <img
                    v-if="!row.cardCover && row.cardType == 0"
                    class="card-cover"
                    src="@/assets/img/default_cover_00.png"
                  />
                  <img
                    v-if="!row.cardCover && row.cardType == 1"
                    class="card-cover"
                    src="@/assets/img/default_cover_01.png"
                  />
                  <img
                    v-if="!row.cardCover && row.cardType == 2"
                    class="card-cover"
                    src="@/assets/img/default_cover_02.png"
                  />
                  <img
                    v-if="!row.cardCover && row.cardType == 3"
                    class="card-cover"
                    src="@/assets/img/default_cover_03.png"
                  />
                  <div class="card-price-one" v-if="row.cardType !== 1">
                    <p>￥100</p>
                  </div>
                  <div class="card-price-two" v-if="row.cardType === 1">
                    <p>￥1000</p>
                    <p>
                      <span>含赠送金：</span>￥500
                    </p>
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="操作">
              <template slot-scope="{row}">
                <g-button
                  :name="'编辑'"
                  class="text-cant-copy"
                  :type="'detail'"
                  :icon="'icon_operate_edit'"
                  @click="toEditCardCover(row)"
                ></g-button>
                <g-button
                  v-if="(row.cardCover && inBrand) || (!inBrand && !row.noDefault)"
                  :name="'删除'"
                  type="cancel"
                  :icon="'icon_operate_delete'"
                  @click="toDeleteCardCover(row)"
                ></g-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 底部操作条 -->
        <div class="service_operation" v-if="currentStatus != '4'">
          <!-- 空白占位Dom,用以维持页面结构 -->
          <div v-if="!inBrand"></div>
          <div class="oper_btns" v-if="inBrand">
            <!-- 是否全选 -->
            <el-checkbox
              class="all_check"
              v-model="checkAll"
              @change="changeCheckAll"
              v-if="checkHasBtnPermission(`brand_goods_card_tableButtons`)"
            >全选</el-checkbox>
            <!-- 下架按钮 -->
            <g-button
              :name="'下架'"
              type="offShelf"
              :icon="'icon_operate_down'"
              @click="cardOperator('offShelf')"
              v-if="showOffShelf && checkHasBtnPermission(`brand_goods_card_tableButtons`)"
            ></g-button>
            <!-- 上架按钮 -->
            <g-button
              :name="'上架'"
              :type="'detail'"
              :icon="'icon_operate_up'"
              @click="cardOperator('onShelf')"
              v-if="showOnShelf && checkHasBtnPermission(`brand_goods_card_tableButtons`)"
            ></g-button>
            <!-- 设为超值推荐 -->
            <g-button
              :name="'超值推荐'"
              :type="'recommend'"
              @click="cardOperator('recommend')"
              v-if="showRecommend && checkHasBtnPermission(`brand_goods_card_tableButtons`)"
            ></g-button>
            <!-- 取消超值推荐 -->
            <g-button
              :name="'取消推荐'"
              :type="'lgreyFill'"
              @click="cardOperator('cancel')"
              v-if="showCancelRecommend && checkHasBtnPermission(`brand_goods_card_tableButtons`)"
            ></g-button>
            <!-- 删除 -->
            <g-button
              :name="'删除'"
              type="cancel"
              :icon="'icon_operate_delete'"
              @click="cardOperator('delete')"
              v-if="showDeleteCard && checkHasBtnPermission(`brand_goods_card_tableButtons`)"
            ></g-button>
            <!-- 恢复 -->
            <g-button
              :name="'恢复'"
              :type="'green'"
              :icon="'icon_operate_recover'"
              @click="cardOperator('recover')"
              v-if="showRecover && checkHasBtnPermission(`brand_goods_card_tableButtons`)"
            ></g-button>
          </div>
          <el-pagination
            class="pageNation"
            @current-change="handleCurrentChange"
            :current-page="queryParam.pageNum + 1"
            :page-size="queryParam.pageSize"
            :total="total"
            layout="total, prev, pager, next, jumper"
          ></el-pagination>
        </div>
      </div>
    </div>
    <!-- 设置规则弹窗 -->
    <set-rule
      :setRuleModelVisible="setRuleModelVisible"
      :currentCardInfo="currentCardInfo"
      :currentRuleList="currentRuleList"
      @close="setRuleModelVisible=false"
      @done="setRuleDone"
    ></set-rule>
    <!-- 上架卡项待编辑提示 -->
    <g-del-model
      :delTagDialogVisible="editConfirmVisible"
      @confirm="editConfirmVisible = false"
      @close="editConfirmVisible = false"
      title="该卡项暂时不能编辑！"
      content="该卡项为上架状态，请先将其下架处理。"
      icon="icon_popup_plaint"
      iconColor="#FCB322"
    ></g-del-model>
    <!-- 删除卡项首图 -->
    <g-del-model
      :delTagDialogVisible="deleteCoverConfirmVisible"
      @confirm="deleteCoverConfirm"
      @close="deleteCoverConfirmVisible = false"
      title="确定要删除吗？"
      :content=" inBrand ? '删除后，之前采用默认封面的卡项将采用系统默认封面。' : '删除后，门店将采用总部设置的卡项封面，如果总部没有设置，则采用系统默认封面。'"
      icon="icon_popup_plaint"
      iconColor="#FCB322"
      :btnLoad="btnLoad"
    ></g-del-model>

    <!-- 卡项首图编辑 -->

    <el-dialog
      title="编辑默认封面"
      :visible.sync="editCoverDialogVisible"
      width="800px"
      :destroy-on-close="true"
    >
      <el-form ref="currentRow" :model="currentRow" label-width="120px" :rules="editRule">
        <el-form-item label="会员卡类型：">
          <!-- <el-input v-model="currentRow.cardType" disabled style="width: 200px;"></el-input> -->
          <p style="font-size: 16px; font-weight: 700;">{{ currentRow.cardType | cardNameFilter }}</p>
        </el-form-item>

        <el-form-item label="默认首图：">
          <g-upload-spic
            @change="updateDefaultImg"
            :photo="currentRow.cardCover"
            tipWidth="350px"
            :size="5"
            text="卡设封面时，将采用该图片作为封面，建议像素1600*900px；"
            width="100px"
            height="100px"
          ></g-upload-spic>
        </el-form-item>

        <el-form-item label="效果预览：">
          <div class="card-smallInfo" style="line-height: 1.5;transform: scale(1);">
            <div class="card-detail">
              <p>会员卡名称</p>
              <p
                class="card-type"
              >{{ currentRow.giftCard ? '礼品卡' : formatCardType(currentRow.cardType)}}</p>
            </div>
            <img :src="formatPicImage(brandLogo, 'style', 70, 'brandLogo')" class="brand-logo" />
            <img
              v-if="currentRow.cardCover"
              class="card-cover"
              :src="formatPicImage(currentRow.cardCover, 'style', 70, 'brandLogo')"
            />
            <img
              v-if="!currentRow.cardCover && currentRow.cardType == 0"
              class="card-cover"
              src="@/assets/img/default_cover_00.png"
            />
            <img
              v-if="!currentRow.cardCover && currentRow.cardType == 1"
              class="card-cover"
              src="@/assets/img/default_cover_01.png"
            />
            <img
              v-if="!currentRow.cardCover && currentRow.cardType == 2"
              class="card-cover"
              src="@/assets/img/default_cover_02.png"
            />
            <img
              v-if="!currentRow.cardCover && currentRow.cardType == 3"
              class="card-cover"
              src="@/assets/img/default_cover_03.png"
            />
            <div class="card-price-one" v-if="currentRow.cardType !== 1">
              <p>￥100</p>
            </div>
            <div class="card-price-two" v-if="currentRow.cardType === 1">
              <p>￥1000</p>
              <p>
                <span>含赠送金：</span>￥500
              </p>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCoverDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCoverConfirm" :loading="btnLoad">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import * as utils from "@/assets/js/utils";
import * as api from "@/assets/js/interface";
import setRule from "./component/setRule";
import "@/assets/css/tab.scss";
import { mapActions, mapState } from "vuex";
import * as axios from "@/util/axios";
import util from "@/util/base.js";
import { setTimeout } from "timers";

export default {
  components: {
    "set-rule": setRule
  },
  data() {
    return {
      util,
      formatPicImage: utils.formatPicImage,
      rowStyle: { fontSize: "12px" },
      defaultRowStyle: { height: "150px" },
      headerRowstyle: { lineHeight: "45px" },
      /* 续卡规则弹窗 */
      setRuleModelVisible: false,
      /* 当前弹窗的info */
      currentCardInfo: {},
      currentRuleList: [],
      /* 会员卡数量表 */
      cardCountList: [],
      /* 会员卡列表 */
      cardList: [],
      /* 查询传参 */
      queryParam: {
        cardName: null,
        brandId: this.$store.state.manage.currentInfo.brandId,
        pageNum: 0,
        pageSize: 10,
        queryCondition: 0 /* 0–已上架，1–未上架，2–超值推荐，3–已删除 */,
        queryType: 0 /* 0–全部，1–储值卡，2–身份卡  */
      },
      /* 总条数 */
      total: 0,
      /* 已被选中的卡项 */
      checkList: [],
      /* 会员卡状态列表 */
      selectStatus: [
        { type: "已上架", code: "0" },
        { type: "未上架", code: "1" },
        { type: "超值推荐", code: "2" },
        { type: "已删除", code: "3" },
        { type: "默认封面", code: "4" }
      ],
      currentStatus: "0",
      /* 是否处于全选状态 */
      checkAll: false,

      utils: utils,
      keyword: "",
      /* type tags */
      kindList: [],
      currentKind: 0,
      editConfirmVisible: false,
      tableLoading: false,
      previousPath: "",
      // 默认首图数据
      defaultPicData: [
        {
          cardType: 0,
          cardCover: ""
        },
        {
          cardType: 1,
          cardCover: ""
        },
        {
          cardType: 2,
          cardCover: ""
        },
        {
          cardType: 3,
          cardCover: ""
        }
      ],
      defaultPicData_Shop: [
        {
          cardType: 2,
          cardCover: ""
        },
        {
          cardType: 3,
          cardCover: ""
        }
      ],
      showCardCover: false,
      // 删除提示
      deleteCoverConfirmVisible: false,
      // 选中的开类封面
      currentRow: {},
      btnLoad: false,
      // 编辑对话框
      editCoverDialogVisible: false,
      editRule: {}
    };
  },
  computed: {
    // 判断是否在商家后台
    inBrand() {
      return this.$route.path.search("brand-inner") >= 0;
    },
    // 当前所在品牌/店铺 id
    id() {
      return this.$store.state.manage.currentInfo.brandId;
    },
    shopId() {
      return this.$store.state.manage.currentInfo.shopId;
    },
    /* 当前品牌Logo */
    brandLogo() {
      return this.$store.state.manage.currentInfo.brandLogo;
    },
    totalPage() {
      return Math.ceil(this.total / this.queryParam.pageSize);
    },
    /* 是否展示上架按钮 除了已删除和上架 */
    showOnShelf() {
      return this.currentStatus !== "0" && this.currentStatus !== "3";
    },
    /* 下架 除了已下架和删除 */
    showOffShelf() {
      return this.currentStatus !== "1" && this.currentStatus !== "3";
    },
    /* 超值推荐 只有已上架*/
    showRecommend() {
      return this.currentStatus === "0";
    },
    /* 取消推荐 除了已下架和已删除*/
    showCancelRecommend() {
      return this.currentStatus !== "1" && this.currentStatus !== "3";
    },
    /* 是否显示删除按钮  除了已删除和已上架*/
    showDeleteCard() {
      return this.currentStatus !== "0" && this.currentStatus !== "2";
    },
    /* 是否显示恢复按钮 只有已被删除的 */
    showRecover() {
      return this.currentStatus == "3";
    },
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    })
  },
  filters: {
    cardNameFilter(val) {
      switch (val) {
        case 0:
          return "身份卡";
        case 1:
          return "储值卡";
        case 2:
          return "次卡";
        default:
          return "时间卡";
      }
    }
  },
  watch: {
    currentStatus(val) {
      this.cardList = [];
      this.queryParam.queryCondition = val;
      this.queryParam.pageNum = 0;
      if (val == "4") {
        this.getCardDefaultPic();
      } else {
        this.queryCardKindList(this.queryParam);
      }
    },
    currentKind(val) {
      this.queryParam.queryType = val;
      this.queryParam.pageNum = 0;
      this.queryCardKindList(this.queryParam);
    }
  },
  mounted() {
    this.queryCardKindList(this.queryParam);
    this.queryCardKindCountInfo();
    this.setCardCoverFromStorage("");
    this.setCardCoverUserDefined("");
  },
  methods: {
    ...mapActions([
      "setCardKindId",
      "setEditStatus",
      "setEditCardId",
      "setCardType",
      "setCardCoverUserDefined",
      "storeCardKindInfo",
      "setListStatus",
      "setCardCoverFromStorage",
      "setCardCoverType"
    ]),
    // 获取会员卡默认封面
    async getCardDefaultPic() {
      this.defaultPicData = [
        {
          cardType: 0,
          cardCover: ""
        },
        {
          cardType: 1,
          cardCover: ""
        },
        {
          cardType: 2,
          cardCover: ""
        },
        {
          cardType: 3,
          cardCover: ""
        }
      ];
      this.defaultPicData_Shop = [
        {
          cardType: 2,
          cardCover: ""
        },
        {
          cardType: 3,
          cardCover: ""
        }
      ];
      let defaultPicData = this.inBrand
        ? this.defaultPicData
        : this.defaultPicData_Shop;
      this.tableLoading = true;
      this.showCardCover = false;
      try {
        const res = await axios.post("/getDefaultCardCoverList", {
          brandId: this.currentInfo.brandId,
          storeId: this.currentEntry == "brand" ? 0 : this.currentInfo.shopId
        });
        defaultPicData.forEach((item, index) => {
          res.cardCoverList.forEach(i => {
            if (item.cardType == i.cardType) {
              defaultPicData[index] = i;
            }
          });
        });
        // 如果门店没有设置默认封面， 则使用总部设置的默认封面
        if (!this.inBrand) {
          const response = await axios.post("/getDefaultCardCoverList", {
            brandId: this.currentInfo.brandId,
            storeId: 0
          });
          defaultPicData.forEach((item, index) => {
            if (!item.cardCover) {
              item.noDefault = true;
              response.cardCoverList.forEach(i => {
                if (i.cardType == item.cardType) {
                  defaultPicData[index].cardCover = i.cardCover;
                }
              });
            } else {
              item.noDefault = false;
            }
          });
        }

        this.showCardCover = true;
      } finally {
        this.tableLoading = false;
      }
    },
    // 编辑删除默认封面
    toEditCardCover(row) {
      this.currentRow = JSON.parse(JSON.stringify(row));
      this.editCoverDialogVisible = true;
    },
    toDeleteCardCover(row) {
      this.currentRow = JSON.parse(JSON.stringify(row));
      this.deleteCoverConfirmVisible = true;
    },
    // 确认编辑
    editCoverConfirm() {
      this.queryCover("edit");
    },
    // 确认删除封面
    deleteCoverConfirm() {
      this.queryCover("delete");
    },
    async queryCover(type) {
      this.btnLoad = true;
      try {
        const res = await axios.post("/setDefaultCardCover", {
          brandId: this.currentInfo.brandId,
          storeId: this.currentEntry == "brand" ? 0 : this.currentInfo.shopId,
          cardCover: type == "delete" ? "" : this.currentRow.cardCover,
          cardType: this.currentRow.cardType,
          id: this.currentRow.id
        });
        if (!res.success) return this.$message.error("操作失败");
        this.$message.success("操作成功");
        this.deleteCoverConfirmVisible = false;
        this.editCoverDialogVisible = false;
        this.getCardDefaultPic();
      } finally {
        this.btnLoad = false;
      }
    },
    updateDefaultImg(val) {
      this.currentRow.cardCover = val;
      this.$message.success("图片上传成功");
    },
    // 是否展示续卡规则详情
    showRuleDetail(row) {
      // scope.row.listCardRenewalRule !== null && (scope.row.validPermanent === false || scope.row.cardType !== 0)
      return (
        row.listCardRenewalRule !== null &&
        (row.validPermanent === false || row.cardType !== 0)
      );
    },
    // 是否展示续卡规则新增按钮
    showAddRuleBtn(row) {
      // scope.row.listCardRenewalRule == null && inBrand && (scope.row.validPermanent === false || scope.row.cardType !== 0)
      return (
        row.listCardRenewalRule == null &&
        this.inBrand &&
        (row.validPermanent === false || row.cardType !== 0)
      );
    },
    // 是否展示续卡规则编辑按钮
    showEditRuleBtn(row) {
      // scope.row.listCardRenewalRule !== null && inBrand && (scope.row.validPermanent === false || scope.row.cardType !== 0)
      return (
        row.listCardRenewalRule !== null &&
        this.inBrand &&
        (row.validPermanent === false || row.cardType !== 0)
      );
    },
    // 是否展示无续卡规则标识
    showNoNeedRule(row) {
      // scope.row.validPermanent === true && scope.row.cardType === 0
      return row.validPermanent === true && row.cardType === 0;
    },
    reSort(row) {
      axios
        .post(api.setCardKindsSortWeight.URL, {
          cardKindId: row.id,
          sortWeight: row.sortWeight
        })
        .then(res => {
          if (res.success) {
            this.$message({ type: "success", message: res.message });
            this.queryCardKindList(this.queryParam);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 上架操作
    cardOperator(type, param) {
      if (!param && this.checkList.length === 0) {
        this.$message.error("请选择会员卡");
        return;
      }

      let url;
      switch (type) {
        case "onShelf":
          url = api.upperCardKinds.URL;
          break;
        case "offShelf":
          url = api.offCardKinds.URL;
          break;
        case "recover":
          url = api.recoverCardKinds.URL;
          break;
        case "recommend":
          url = api.recommendCardKinds.URL;
          break;
        case "cancel":
          url = api.cancelRecommendCardKinds.URL;
          break;
        case "delete":
          url = api.deleteCardKinds.URL;
          break;
      }
      axios
        .post(url, { cardKindIds: param || this.checkList })
        .then(res => {
          if (res.success) {
            this.$message({ type: "success", message: res.message });
            this.queryCardKindList(this.queryParam);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    changeKind(kind) {
      this.currentKind = kind;
    },
    // kind type 转中文
    formatCardKind(type) {
      switch (type) {
        case 0:
          return "全部";
        case 1:
          return "储值卡";
        case 2:
          return "身份卡";
        case 3:
          return "次卡";
        case 4:
          return "时间卡";
      }
    },
    // 获取会员卡种类信息
    queryCardKindCountInfo() {
      let url;
      if (this.inBrand) {
        url = `${api.getCardKindCountInfo.URL}/${this.id}`;
      } else {
        url = `${api.getStoreCardKindCountInfo.URL}/${this.id}/${this.shopId}`;
      }
      axios
        .get(url)
        .then(res => {
          console.log(res);
          this.kindList = res.listCardKindCountInfo;
        })
        .catch(err => {
          console.log(err);
        });
    },
    /* 获取会员卡种类列表 并 重置 checkList checkAll */
    queryCardKindList(param) {
      let url;
      let queryParam = param;
      if (this.inBrand) {
        url = "pagedQueryCardKindBasicInfo";
      } else {
        url = "pagedQueryStoreCardKindBasicInfo";
        queryParam.storeId = this.shopId;
      }
      this.tableLoading = true;
      setTimeout(() => {
        axios
          .post(url, queryParam)
          .then(res => {
            this.tableLoading = false;
            this.cardList = res.listCardKindBasicInfo;
            this.total = res.total;
          })
          .catch(err => {
            this.tableLoading = false;
            console.log(err);
          });
        this.checkList = [];
        this.checkAll = false;
      }, 200);
    },
    /* 获取会员卡数量列表 */
    queryCardKindCount() {},
    /* format 会员卡类别 */
    formatCardType(type) {
      switch (type) {
        case 0:
          return "身份卡";
        case 1:
          return "储值卡";
        case 2:
          return "次卡";
        case 3:
          return "时间卡";
      }
    },
    /* format 有效期限 */
    formatValidNum(row) {
      if (row.validPermanent) {
        return `永久有效`;
      } else {
        let Num = row.validNum;
        Num = row.validNum > 0 ? row.validNum : "使用后" + row.validUsedNum;
        switch (row.validUnit) {
          case "year":
            return `${Num}年`;
          case "month":
            return `${Num}月`;
          case "day":
            return `${Num}天`;
        }
      }
    },
    /* format 售价/充值金 */
    formatPrice(row) {
      switch (row.cardType) {
        case 0:
          return `￥${row.cardPrice}`;
        case 1:
          return `￥${row.cardFirstRechargeNum}`;
        default:
          return `￥${row.cardPrice}`;
      }
    },
    formatRule(row) {
      let str = "";
      if (!row.listCardRenewalRule) {
        str = "—";
      } else {
        if (row.cardType === 1) {
          for (let i of row.listCardRenewalRule) {
            str += `充${i.cardRechargeNum}赠${i.cardGiftNum}<br />`;
          }
        } else if (row.cardType === 0) {
          for (let i of row.listCardRenewalRule) {
            str += `续卡费用${i.cardPrice}<br />`;
          }
        } else {
          str = "—";
        }
      }
      return str;
    },
    /* 切换状态标签 */
    handleStatusChange(tab) {
      this.currentStatus = tab.name;
    },
    /* 切换全选状态 */
    changeCheckAll(bool) {
      if (bool) {
        this.checkList = [];
        this.cardList.forEach(i => {
          this.checkList.push(i.id);
        });
      } else {
        this.checkList = [];
      }
    },
    /* 选中卡项变更 */
    handleCardListChange() {
      if (this.checkAll) {
        this.checkAll = false;
      } else {
        if (this.checkList.length === this.cardList.length) {
          this.checkAll = true;
        }
      }
    },
    /* 换页 */
    handleCurrentChange(page) {
      this.queryParam.pageNum = page - 1;
      this.queryCardKindList(this.queryParam);
    },
    beginSetRule(row) {
      let name;
      switch (row.cardType) {
        case 0:
          name = "身份卡";
          break;
        case 1:
          name = "储值卡";
          break;
      }
      this.currentCardInfo = {
        cardTypeName: name,
        cardKindId: row.id,
        brandId: this.id,
        cardType: row.cardType,
        supportRenewal: row.supportRenewal
      };
      this.currentRuleList = row.listCardRenewalRule;
      this.setRuleModelVisible = true;
      //console.log(this.currentCardInfo)
    },
    /* 查看会员卡详情 */
    goDetail(id) {
      /* 只有在进入编辑逻辑前需要记录当前 tag status */
      this.setListStatus(null);
      // this.setCardKindId(id);
      // 新标签打开详情
      this.toPagesInNewTags(`/${this.currentEntry}-inner/vip-card-details`, {
        id: id
      });
    },
    onInputWord(e) {
      console.log(e);
    },
    onSearch(name) {
      this.queryParam.cardName = name === "" ? null : name;
      this.doSearch();
    },
    doSearch: util.debounce(function() {
      this.queryCardKindList(this.queryParam);
    }, 200),
    setRuleDone() {
      this.setRuleModelVisible = false;
      this.queryCardKindList(this.queryParam);
    },
    /* 暂时只能先这么做，最好的方法还是用路由传参 */
    edit(row) {
      // 上架卡项不得编辑
      if (row.upperStatus === 0) {
        this.editConfirmVisible = true;
        return;
      }
      this.setListStatus(this.currentStatus); // 记录下当前的 currentStatus, 已备跳回列表页后做定向
      this.setCardType({ type: row.cardType }); // 记录下待编辑卡的类别
      this.setEditStatus(true); // 设置编辑状态（设 true）
      this.setEditCardId(row.id); // 记录下待编辑卡 Id
      this.$router.push(`/${this.currentEntry}-inner/edit-vip-card`);
    },
    /* 为区分编辑和新增，跳转前需要做一系列清空处理 */
    add() {
      this.setListStatus(null); //只有在进入编辑逻辑前需要记录当前 currentStatus, 为做区别，此处清除
      this.setEditStatus(false); // 取消编辑状态（设 false）// 会员卡是在新增还是编辑状态
      this.setEditCardId(null); // 清空暂存的待编辑卡ID
      this.storeCardKindInfo(null); // 清空待编辑卡的内容
      this.setCardCoverType(1); // 默认卡封面用素材库
      // 门店端可以新增次卡\时间卡了
      this.$router.push(`/${this.currentEntry}-inner/add-new-vip-card`);
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      const status = vm.$store.state.vipCard.editVipCard.currentListStatus;
      if (from.path === "/brand-inner/edit-vip-card" && status !== null) {
        vm.currentStatus = status;
      }
    });
  }
};
</script>
<style lang="scss" scoped>
.root-con {
  overflow: hidden;
  box-sizing: border-box;
  margin: 0 20px;

  .top-operation {
    display: flex;
    justify-content: space-between;
    margin: 20px 0 0 0;

    .add-card {
      padding: 9px 17px;
    }
  }

  .top-con {
    display: flex;
    height: 65px;
    align-items: center;
    justify-content: space-between;
    margin: 20px 0;

    /deep/ .el-input-group__append {
      background: #58c9f3;
      width: 40px;
      padding: 0;
      text-align: center;
      color: white;
      cursor: pointer;

      .iconfont {
        font-size: 24px;
      }
    }

    /* 新增 tag bar */
    .card-tags-bar {
      width: 100%;
      height: 65px;
      background: #ffffff;
      box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
      display: flex;
      border-radius: 6px;
      padding: 0 20px;
      justify-content: space-between;
      align-items: center;

      ul.tags-group {
        font-size: 0;

        li.tag {
          display: inline-block;
          height: 28px;
          padding: 0 20px 0 15px;
          line-height: 28px;
          font-size: 12px;
          color: #6c757d;
          font-size: 12px;
          border: 1px solid rgba(206, 212, 218, 1);
          margin: 0 15px 0 0;
          border-radius: 28px;
          cursor: pointer;

          &.active {
            border-color: #ff6d61;
            color: #ff6d61;
          }
        }
      }
    }
  }

  .main-con {
    min-width: 1100px;
    background: #ffffff;
    box-shadow: 0px -1px 4px 0px rgba(174, 184, 229, 0.3);
    border-radius: 7px;

    .line-box {
      display: flex;

      div {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .checked {
        flex: 0 0 36px;
      }

      .sort {
        min-width: 72px;
        flex: 1 0 72px;

        .el-input-group--append .el-input__inner {
          width: 48px;
          height: 35px;
          padding: 3px;
        }

        /deep/ .el-input-group__append {
          display: none;
        }
      }

      .vip-card {
        flex: 1 0 136px;

        img {
          width: 96px;
          height: 64px;
          border-radius: 4px;
          //border: 1px solid red;
        }
      }

      .vip-card-sort,
      .use-life,
      .first-add,
      .number-sale,
      .sale-volume,
      .time-on-sale,
      .status {
        width: 10%;
        flex: auto;

        .status-btn {
          box-sizing: border-box;
          padding: 0 7px;
          height: 17px;
          line-height: 19px;
          font-size: 12px;
          color: white;
          border-radius: 7px;
          margin-bottom: 5px;
        }
      }

      .status {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .opera {
        min-width: 220px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .titleline {
      height: 60px;
      color: #333333;
      font-size: 14px;
      margin-top: 5px;
      background: #ffffff;
    }

    .line-box-con {
      height: 90px;
      font-size: 12px;
      color: #666666;
    }

    .line-box-con:nth-child(2n) {
      background: #f4f5f7;
    }

    .line-box-con:nth-child(2n + 1) {
      background: #ffffff;
    }

    /* 新增 */
    .main-con-con {
      max-height: calc(100vh - 271px);
      padding: 0 20px;
      /* 覆写原先滚动条样式 */
      /deep/ .el-table__body-wrapper {
        &::-webkit-scrollbar {
          width: 4px;
        }

        &::-webkit-scrollbar-thumb {
          border-radius: 5px;
          -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
          box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
          background: rgba(0, 0, 0, 0.2);
        }

        &::-webkit-scrollbar-track {
          -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
          box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
          border-radius: 0;
          background: rgba(0, 0, 0, 0.1);
        }
      }

      .card-name {
        display: flex;
        align-items: center;
        color: #333333;
        font-size: 14px;

        .card-img-wrapper {
          position: relative;

          .brand-logo {
            position: absolute;
            top: 6px;
            left: 5px;
            width: 15px;
            height: 15px;
            border-radius: 7.5px;
          }
        }

        img {
          width: 78px;
          height: 50px;
          margin: 0 11px 0 0;
          flex-shrink: 0;
          border-radius: 4px;
        }

        span {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .card-status {
        /* width: 70px; */
        word-break: keep-all;

        .tags {
          padding: 2px 7px;
          font-size: 12px;
          border-radius: 10px;
          color: #ffffff;
        }
      }

      .card-rule {
        display: flex;
        align-items: center;

        .rule {
          margin: 0 10px 0 0;
        }

        .operator {
          height: 20px;
          line-height: 20px;
          color: #58c9f3;

          span {
            cursor: pointer;
          }

          i {
            cursor: pointer;
          }
        }
      }
    }
  }

  .service_operation {
    display: flex;
    justify-content: space-between;
    background: #fff;
    align-items: center;
    height: 74px;

    .oper_btns {
      padding-left: 10px;
      margin-top: 25px;
    }

    .pageNation {
      /deep/ .el-pagination .btn-prev,
      /deep/ .el-pagination .btn-next {
        width: 35px;
      }
    }
  }
}

/deep/ .el-pagination .btn-prev,
.el-pagination .btn-next {
  width: 35px;
}

.card-smallInfo {
  display: inline-block;
  position: relative;
  transform: scale(0.8);
  .card-detail {
    position: absolute;
    color: #fff;
    top: 12px;
    left: 45px;
    font-size: 14px;
    .card-type {
      display: inline-block;
      margin-top: 2px;
      padding: 0 5px;
      border: 1px solid #fff;
      border-radius: 10px;
    }
  }
  .card-price-one {
    position: absolute;
    bottom: 15px;
    right: 15px;
    color: #fff;
    font-size: 20px;
    font-weight: 700;
  }
  .card-price-two {
    position: absolute;
    bottom: 10px;
    right: 12px;
    color: #fff;
    font-size: 20px;
    font-weight: 700;
    text-align: right;
    :nth-child(2) {
      font-size: 12px;
      font-weight: normal;
    }
  }
  .brand-logo {
    position: absolute;
    top: 12px;
    left: 10px;
    width: 30px;
    height: 30px;
    border-radius: 15px;
  }
  .card-cover {
    width: 230px;
    height: 145px;
  }
}
</style>
