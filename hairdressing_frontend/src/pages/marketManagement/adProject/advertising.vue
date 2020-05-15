<template>
  <div class="shop-create-group-buy-main" v-loading="loading">
    <seed-header
      :title="activityTitle"
      :hasTabs="false"
      :origin="entry === 'detail' ? 'otherTags' : 'editProduct'"
    ></seed-header>
    <div class="create-group-buy-main-box scrollbar">
      <div class="group-buy-container">
        <div class="group-buy-body">
          <el-form :model="adForm" ref="adFormRef" :rules="rules" class="query-form">
            <!-- 广告位置 -->
            <div class="form-line">
              <div class="form-title">
                <span class="xing">广告位置</span>
              </div>
              <div class="form-con">
                <el-form-item style="width:420px;" prop="position" required>
                  <el-select
                    v-model="adForm.position"
                    placeholder="请选择广告位置"
                    :disabled="entry === 'detail'"
                  >
                    <el-option
                      v-for="item in positionOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
            <!-- 广告主题 -->
            <div class="form-line">
              <div class="form-title">
                <span class="xing">广告主题</span>
              </div>
              <div class="form-con">
                <el-form-item style="width:320px;" prop="title">
                  <el-input
                    :disabled="entry === 'detail'"
                    v-model="adForm.title"
                    placeholder="请输入广告主题，不超过16个中文字符"
                    maxlength="16"
                  ></el-input>
                </el-form-item>
              </div>
            </div>
            <!-- 广告图片 -->
            <div class="form-line">
              <div class="form-title">
                <span class="xing">广告图片</span>
              </div>
              <div class="form-con">
                <el-form-item style="width:800px;" prop="banner">
                  <g-upload-mpic
                    :class="{'banner-pic': true, 'hideUpload': hideFlagBanner}"
                    v-if="entry !== 'detail'"
                    tip="要求图片尺寸为1026*384；支持jpg、png格式，大小不超过3M。"
                    :photo-list="adForm.banner?[adForm.banner] : []"
                    @change="uploadBanner"
                    type="banner"
                    :size="3"
                  ></g-upload-mpic>
                  <g-upload-mpic
                    v-else
                    class="banner-pic"
                    :onlyPreview="true"
                    :photo-list="adForm.banner?[adForm.banner] : []"
                    @change="uploadBanner"
                    type="banner"
                    :size="3"
                  ></g-upload-mpic>
                </el-form-item>
              </div>
            </div>
            <!-- 内页海报 -->
            <div class="form-line">
              <div class="form-title">
                <span class="xing">内页海报</span>
              </div>
              <div class="form-con">
                <el-form-item prop="photo">
                  <g-upload-mpic
                    :class="{'photo-pic': true, 'hideUpload': hideFlagPhoto}"
                    v-if="entry !== 'detail'"
                    tip="要求图片宽边900px以上，高度不限；支持jpg、png格式，大小不超过5M。"
                    :photo-list="adForm.photo?[adForm.photo] : []"
                    @change="uploadPhoto"
                    type="photo"
                    :size="5"
                  ></g-upload-mpic>
                  <g-upload-mpic
                    v-else
                    class="photo-pic"
                    :onlyPreview="true"
                    :photo-list="adForm.photo?[adForm.photo] : []"
                    @change="uploadPhoto"
                    type="photo"
                    :size="5"
                  ></g-upload-mpic>
                  <!-- <img
                    v-else
                    style="display: block; height: 80px; width: 80px;"
                    :src="formatPicImage(adForm.photo, 'style', 146, 'someone')"
                    alt
                  />-->
                </el-form-item>
              </div>
            </div>
            <!-- 链接跳转 -->
            <div class="form-line">
              <div class="form-title">
                <span class="xing">链接跳转</span>
              </div>
              <div class="form-con">
                <div class="href-radio">
                  <el-form-item prop="type">
                    <!-- 编辑的时候不允许改变type -->
                    <el-radio-group v-model="adForm.type" :disabled="entry !== 'add'">
                      <el-radio :label="1" v-if="!isBrand">优选推荐</el-radio>
                      <el-radio :label="2">服务/产品/卡项类别</el-radio>
                      <el-radio :label="3" v-if="!isBrand">单件服务/产品/卡项</el-radio>
                      <el-radio :label="4">指定栏目/菜单</el-radio>
                    </el-radio-group>
                    <el-select
                      v-model="adForm.menu"
                      placeholder="请选择"
                      v-if="adForm.type === 4"
                      :disabled="entry === 'detail'"
                    >
                      <el-option
                        v-for="item in menuOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="header-line" v-if="entry !== 'detail'">
                  <el-button
                    plain
                    class="plain_blue_btn"
                    @click="visable_service = true"
                    :disabled="entry === 'detail'"
                    v-if="adForm.type === 1 || adForm.type ===3"
                  >选择服务</el-button>
                  <el-button
                    plain
                    type="success"
                    class="plain_green_btn"
                    @click="visable_product = true"
                    :disabled="entry === 'detail'"
                    v-if="adForm.type === 1 || adForm.type ===3"
                  >选择产品</el-button>
                  <el-button
                    plain
                    type="warning"
                    class="plain_pink_btn"
                    @click="visable_card = true"
                    :disabled="entry === 'detail'"
                    v-if="adForm.type === 1 || adForm.type ===3"
                  >选择卡项</el-button>
                  <el-button
                    plain
                    class="plain_blue_btn"
                    @click="visable_service = true"
                    :disabled="entry === 'detail'"
                    v-if="adForm.type === 2"
                  >服务类别</el-button>
                  <el-button
                    plain
                    type="success"
                    class="plain_green_btn"
                    @click="visable_product = true"
                    :disabled="entry === 'detail'"
                    v-if="adForm.type === 2"
                  >产品类别</el-button>
                  <el-button
                    plain
                    type="warning"
                    class="plain_pink_btn"
                    @click="visable_card = true"
                    :disabled="entry === 'detail'"
                    v-if="adForm.type === 2"
                  >卡项类别</el-button>
                </div>
                <div class="table-box" v-if="adForm.type !== 4">
                  <!-- 服务选中表格 -->
                  <el-table
                    stripe
                    :data="supServiceTable"
                    style="margin-top: 12px;"
                    :header-cell-style="headerRowStyle"
                    empty-text="请选择至少一个商品"
                    v-if="form.serviceSpecificationList.length"
                  >
                    <el-table-column prop="orderby" label="排序">
                      <template slot-scope="{ row }">
                        <number-input
                          :disabled="entry === 'detail'"
                          v-model="row.orderby"
                          class="input"
                          placeholder="请输入排序"
                          :min="0"
                          :max="999"
                        ></number-input>
                      </template>
                    </el-table-column>
                    <el-table-column
                      show-overflow-tooltip
                      prop="goodsName"
                      label="服务名称"
                      v-if="adForm.type === 1 || adForm.type === 3"
                    ></el-table-column>
                    <el-table-column
                      prop="shopPrice"
                      label="门店价"
                      v-if="adForm.type === 1 || adForm.type === 3"
                    >
                      <template slot-scope="scope">￥{{ scope.row.shopPrice }}</template>
                    </el-table-column>
                    <el-table-column
                      prop="shopPrice"
                      label="会员价"
                      v-if="adForm.type === 1 || adForm.type === 3"
                    >
                      <template slot-scope="scope">￥{{ scope.row.memberPrice }}</template>
                    </el-table-column>
                    <el-table-column
                      show-overflow-tooltip
                      prop="sortOneName"
                      label="类别名称"
                      v-if="adForm.type === 2"
                    ></el-table-column>
                    <el-table-column
                      show-overflow-tooltip
                      prop="sortTwoName"
                      label="归属分类"
                      v-if="adForm.type === 2"
                    ></el-table-column>
                    <el-table-column show-overflow-tooltip label="类别属性" v-if="adForm.type === 2">服务</el-table-column>
                    <el-table-column show-overflow-tooltip label="商品数" v-if="adForm.type === 2">
                      <template slot-scope="{ row }">
                        <p>{{ row.goodsCount ? row.goodsCount : '-'}}</p>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" v-if="entry !== 'detail'">
                      <template slot-scope="scope">
                        <i
                          class="icon iconfont icon-icon_operate_delete"
                          @click="delSelectedService(scope.$index)"
                        ></i>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-pagination
                    @current-change="handleCurrentChangeServe"
                    :current-page="serveListPageNum"
                    :page-size="4"
                    layout="total, prev, pager, next"
                    :total="form.serviceSpecificationList.length"
                    v-if="form.serviceSpecificationList.length"
                  ></el-pagination>
                  <!-- 产品选中表格 -->
                  <el-table
                    stripe
                    style="margin-top: 12px;"
                    :header-cell-style="headerRowStyle"
                    :data="supProductTable"
                    empty-text="请选择至少一个商品"
                    v-if="form.productSpecificationList.length"
                  >
                    <el-table-column prop="orderby" label="排序">
                      <template slot-scope="{ row }">
                        <number-input
                          :disabled="entry === 'detail'"
                          v-model="row.orderby"
                          class="input"
                          placeholder="请输入排序"
                          :min="0"
                          :max="999"
                        ></number-input>
                      </template>
                    </el-table-column>
                    <el-table-column
                      show-overflow-tooltip
                      prop="goodsName"
                      label="产品名称"
                      v-if="adForm.type === 1 || adForm.type === 3"
                    ></el-table-column>
                    <el-table-column
                      prop="shopPrice"
                      label="门店价"
                      v-if="adForm.type === 1 || adForm.type === 3"
                    >
                      <template slot-scope="scope">￥{{ scope.row.shopPrice }}</template>
                    </el-table-column>
                    <el-table-column
                      prop="shopPrice"
                      label="会员价"
                      v-if="adForm.type === 1 || adForm.type === 3"
                    >
                      <template slot-scope="scope">￥{{ scope.row.memberPrice }}</template>
                    </el-table-column>
                    <el-table-column
                      show-overflow-tooltip
                      prop="sortOneName"
                      label="类别名称"
                      v-if="adForm.type === 2"
                    ></el-table-column>
                    <el-table-column
                      show-overflow-tooltip
                      prop="sortTwoName"
                      label="归属分类"
                      v-if="adForm.type === 2"
                    ></el-table-column>
                    <el-table-column show-overflow-tooltip label="类别属性" v-if="adForm.type === 2">产品</el-table-column>
                    <el-table-column show-overflow-tooltip label="商品数" v-if="adForm.type === 2">
                      <template slot-scope="{ row }">
                        <p>{{ row.goodsCount ? row.goodsCount : '-'}}</p>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" v-if="entry !== 'detail'">
                      <template slot-scope="scope">
                        <i
                          class="icon iconfont icon-icon_operate_delete"
                          @click="delSelectedProduct(scope.$index)"
                        ></i>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-pagination
                    @current-change="handleCurrentChangeProduct"
                    :current-page="productListPageNum"
                    :page-size="4"
                    layout="total, prev, pager, next"
                    :total="form.productSpecificationList.length"
                    v-if="form.productSpecificationList.length"
                  ></el-pagination>
                  <!-- 卡项选中表格 -->
                  <el-table
                    stripe
                    style="margin-top: 12px;"
                    :header-cell-style="headerRowStyle"
                    :data="supCardTable"
                    empty-text="请选择至少一个商品"
                    v-if="form.cardSpecificationList.length"
                  >
                    <el-table-column prop="orderby" label="排序">
                      <template slot-scope="{ row }">
                        <number-input
                          :disabled="entry === 'detail'"
                          v-model="row.orderby"
                          class="input"
                          placeholder="请输入排序"
                          :min="0"
                          :max="999"
                        ></number-input>
                      </template>
                    </el-table-column>
                    <el-table-column
                      show-overflow-tooltip
                      prop="goodsName"
                      label="卡项名称"
                      v-if="(adForm.type === 1 || adForm.type === 3)"
                    ></el-table-column>
                    <el-table-column
                      prop="shopPrice"
                      label="价格"
                      v-if="(adForm.type === 1 || adForm.type === 3)"
                    >
                      <template slot-scope="scope">￥{{ scope.row.shopPrice }}</template>
                    </el-table-column>
                    <el-table-column
                      show-overflow-tooltip
                      prop="sortOneName"
                      label="类别名称"
                      v-if="adForm.type === 2"
                    ></el-table-column>
                    <el-table-column
                      show-overflow-tooltip
                      prop="sortOneName"
                      label="归属分类"
                      v-if="adForm.type === 2"
                    ></el-table-column>
                    <el-table-column show-overflow-tooltip label="类别属性" v-if="adForm.type === 2">卡项</el-table-column>
                    <el-table-column show-overflow-tooltip label="商品数" v-if="adForm.type === 2">
                      <template slot-scope="{ row }">
                        <p>{{ row.goodsCount ? row.goodsCount : '-'}}</p>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" v-if="entry !== 'detail'">
                      <template slot-scope="scope">
                        <i
                          class="icon iconfont icon-icon_operate_delete"
                          @click="delSelectedCard(scope.$index)"
                        ></i>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-pagination
                    @current-change="handleCurrentChangeCard"
                    :current-page="cardListPageNum"
                    :page-size="4"
                    layout="total, prev, pager, next"
                    :total="form.cardSpecificationList.length"
                    v-if="form.cardSpecificationList.length"
                  ></el-pagination>
                </div>
              </div>
            </div>
            <!-- 按钮 -->
            <div
              class="form-line"
              :style="adForm.type !== 4 ? 'margin-top: 20px;' : 'margin-top: 80px;'"
            >
              <div class="form-title"></div>
              <div class="form-con">
                <el-button
                  class="normal_blue_btn"
                  @click="createAd"
                  v-if="entry !== 'detail'"
                  :loading="btnLoad"
                >发布</el-button>
                <el-button plain class="plain_gray_btn" @click="cancal">返回</el-button>
              </div>
            </div>
          </el-form>
        </div>
      </div>
    </div>
    <serviceDialog
      :isSort="adForm.type == 2"
      v-if="visable_service"
      :visible="visable_service"
      @close="visable_service = false"
      @suberData="getServiceDataFromSuber"
      :superCheckedGoods="selectedServicesIds"
      :isBrand="isBrand"
    />
    <productDialog
      :isSort="adForm.type == 2"
      v-if="visable_product"
      :visible="visable_product"
      @close="visable_product = false"
      @suberData="getProductDataFromSuber"
      :superCheckedGoods="selectedProductsIds"
      :isBrand="isBrand"
    />
    <!-- 卡项对话框 -->
    <cardDialog
      :isSort="adForm.type == 2"
      v-if="visable_card"
      :visible="visable_card"
      @close="visable_card=false"
      @suberData="getCardDataFromSuber"
      :superCheckedGoods="selectedCardsIds"
    />
  </div>
</template>
<script>
import * as axios from "@/util/axios";
import { mapActions, mapState } from "vuex";
import productDialog from "./components/productsDialog";
import serviceDialog from "./components/serviceDialog";
import cardDialog from "./components/cardDialog";
import { reg, checkReg } from "@/assets/js/RegExp";
import * as utils from "@/assets/js/utils";
export default {
  data() {
    return {
      formatPicImage: utils.formatPicImage, // 有尺寸的图片处理
      // 来自
      entry: null,
      headerRowStyle: { background: "#f4f5f7" }, // 表头样式
      activityTime: null, //活动时间
      // 服务列表当前页码
      serveListPageNum: 1,
      // 产品列表当前页码
      productListPageNum: 1,
      adForm: {
        position: "1",
        title: "",
        banner: "",
        photo: "",
        type: "",
        menu: "" // type 为4 时的指定菜单
      },
      // 广告位置
      positionOptions: [
        {
          label: "品牌中心首页头部",
          value: "1"
        }
      ],
      // 指定栏目分类信息
      menuOptions: [
        {
          label: "推荐美店",
          value: "STORE"
        },
        // {
        //   label: "限时秒杀",
        //   value: "SEC_KILL"
        // },
        {
          label: "新人专享",
          value: "NEWER"
        },
        {
          label: "美物拼团",
          value: "GROUP_BY"
        },
        {
          label: "返佣商品列表",
          value: "SELL_GOODS"
        },
        {
          label: "会员优惠",
          value: "VIP"
        },
        {
          label: "热门动态",
          value: "HOT"
        },
        {
          label: "购物车",
          value: "ORDER_CAR"
        },
        {
          label: "会员中心",
          value: "VIP_HOME"
        }
      ],
      // 发布按钮加载
      btnLoad: false,
      form: {
        id: null, // 编辑或修改时的活动id
        serviceSpecificationList: [], // 活动服务信息
        productSpecificationList: [], // 活动产品信息
        cardSpecificationList: [] // 卡项产品信息
      },
      supServiceTable: [], // 本页
      supProductTable: [], // 本页
      // 卡项本页
      supCardTable: [],
      // supServiceSortTable: [], // 本页
      // supProductSortTable: [], // 本页
      // // 卡项本页
      // supCardSortTable: [],
      loading: false,
      // 子组件
      /* 服务选项及选中项 start */
      visable_service: false,
      subServiceTable: [],
      selectedServicesIds: new Set(),
      selectedServicesObj: {},
      /* 服务选项及选中项 end */
      /* 产品选项及选中项 start */
      visable_product: false,
      subProductTable: [],
      selectedProductsIds: new Set(),
      selectedProductsObj: {},
      /* 产品选项及选中项 end */
      /* 会员卡选项及选中项 start */
      visable_card: false,
      subCardTable: [],
      selectedCardsIds: new Set(),
      selectedCardsObj: {},
      // 会员卡列表当前页码
      cardListPageNum: 1,
      /* 会员卡选项及选中项 end */
      // 表单校验规则
      rules: {
        title: [
          { validator: this.validateActivityName, trigger: "blur" },
          { validator: this.validateActivityName, trigger: "change" }
        ],
        activityTime: [
          { validator: this.validateActivityTime, trigger: "change" }
        ],
        type: [{ validator: this.validateType, trigger: "change" }],
        banner: [
          { required: true, message: "请选择广告图片", trigger: "change" }
        ],
        photo: [
          { required: true, message: "请选择内页海报", trigger: "change" }
        ]
      },
      hideFlagBanner: false,
      hideFlagPhoto: false
    };
  },
  created() {
    this.entry = this.isBrand
      ? this.$route.path.substr(24)
      : this.$route.path.substr(23);
    this.form.id = this.$route.query.id ? this.$route.query.id : null;
    if (this.entry !== "add") {
      this.getAdDetail(this.$store.state.ad.adId);
    }
  },
  methods: {
    // ------------------------------- 校验 ------------------------------
    // 校验活动名称
    validateActivityName(rule, value, callback) {
      if (value == "") {
        return callback(new Error("广告主题名称不能为空"));
      } else if (value.length > 16) {
        return callback(new Error("广告主题名称不能大于16位"));
      } else {
        callback();
      }
    },
    // 校验活动时间
    validateActivityTime(rule, value, callback) {
      if (!this.form.activityFrom || !this.form.activityTo) {
        return callback(new Error("请选择活动时间范围"));
      } else {
        callback();
      }
    },
    // 校验链接跳转
    validateType(rule, value, callback) {
      if (!value) {
        return callback(new Error("请选择链接跳转方式！"));
      } else if (value === 4 && !this.adForm.menu) {
        return callback(new Error("请选择指定栏目/菜单！"));
      } else if (
        value === 1 &&
        !this.form.serviceSpecificationList.length &&
        !this.form.productSpecificationList.length &&
        !this.form.cardSpecificationList.length
      ) {
        return callback(new Error("请选择优选推荐！至少选择一样商品"));
      } else if (
        value === 3 &&
        this.form.serviceSpecificationList.length +
          this.form.productSpecificationList.length +
          this.form.cardSpecificationList.length !=
          1
      ) {
        return callback(new Error("请选择单件商品！只能选择一样商品"));
      } else if (
        value === 2 &&
        !this.form.serviceSpecificationList.length &&
        !this.form.productSpecificationList.length &&
        !this.form.cardSpecificationList.length
      ) {
        return callback(new Error("请选择商品类别！至少选择一样商品"));
      } else {
        callback();
      }
    },
    // ------------------------------- 校验 ------------------------------
    // 服务/产品分页事件堆
    handleCurrentChangeServe(index) {
      index = index <= 0 ? 1 : index;
      this.serveListPageNum = index;
      this.supServiceTable = this.showServeNum(
        this.form.serviceSpecificationList,
        this.supServiceTable,
        index - 1
      );
    },
    handleCurrentChangeProduct(index) {
      index = index <= 0 ? 1 : index;
      this.productListPageNum = index;
      this.supProductTable = this.showServeNum(
        this.form.productSpecificationList,
        this.supProductTable,
        index - 1
      );
    },
    handleCurrentChangeCard(index) {
      index = index <= 0 ? 1 : index;
      this.cardListPageNum = index;
      this.supCardTable = this.showServeNum(
        this.form.cardSpecificationList,
        this.supCardTable,
        index - 1
      );
    },
    // 确定发布广告事件
    createAd() {
      // 做参数
      let form = JSON.parse(JSON.stringify(this.form));
      let adForm = JSON.parse(JSON.stringify(this.adForm));
      // 优选推荐参数
      if (this.adForm.type == 1 || this.adForm.type == 3) {
        form.serviceSpecificationList.forEach(item => {
          item.goodsType = 1;
        });
        form.productSpecificationList.forEach(item => {
          item.goodsType = 2;
        });
        let cardSpecificationList = [];
        form.cardSpecificationList.forEach(item => {
          cardSpecificationList.push({
            goodsId: item.goodsId,
            goodsType: 3,
            orderby: item.orderby,
            goodsName: item.cardName,
            shopPrice:
              item.cardFirstRechargeNum > 0
                ? item.cardFirstRechargeNum + ""
                : item.cardPrice + ""
          });
        });
        adForm.goodsList = [
          ...form.serviceSpecificationList,
          ...form.productSpecificationList,
          ...cardSpecificationList
        ];
      }
      if (this.adForm.type === 2) {
        form.serviceSpecificationList.forEach(item => {
          item.goodsType = 1;
          // delete item["goodsCount"];
        });
        form.productSpecificationList.forEach(item => {
          item.goodsType = 2;
          // delete item["goodsCount"];
        });
        form.cardSpecificationList.forEach(item => {
          item.goodsType = 3;
          // delete item["goodsCount"];
        });
        adForm.sortInfoList = [
          ...form.serviceSpecificationList,
          ...form.productSpecificationList,
          ...form.cardSpecificationList
        ];
      }
      adForm.position = Number(adForm.position);
      // 完成！
      // 表单预校验
      this.$refs.adFormRef.validate(async valid => {
        if (!valid) return this.$message.error("请完成相关信息的填写");
        this.btnLoad = true;
        try {
          const res = await axios.post("/createOrUpdateAd", {
            ...adForm,
            brandId: this.currentInfo.brandId,
            storeId: this.isBrand ? null : this.currentInfo.shopId
          });
          let text = this.entry === "add" ? "创建" : "编辑";
          if (!res.success) return this.$message.error(`${text}广告失败`);
          this.$message.success(`${text}广告成功`);
          // 页面回跳 // 模拟返回
          this.cancal();
        } finally {
          this.btnLoad = false;
        }
      });
    },
    // - 保存服务
    getServiceDataFromSuber(obj) {
      // 区分type2时候的id为分类id
      let idType = this.adForm.type == 2 ? "sortTwo" : "goodsId";
      obj.yes.map(i => {
        if (!this.selectedServicesIds.has(i[idType])) {
          this.selectedServicesIds.add(i[idType]);
          this.selectedServicesObj[i[idType]] = {
            orderby: 99,
            ...i
          };
        }
      });
      obj.no.map(i => {
        if (this.selectedServicesIds.has(i[idType])) {
          this.selectedServicesIds.delete(i[idType]);
          delete this.selectedServicesObj[i[idType]];
        }
      });
      this.form.serviceSpecificationList = Object.values(
        this.selectedServicesObj
      );
      this.handleCurrentChangeServe(1);
      // 优化校验。。在此校验单条form信息
      this.$refs.adFormRef.validateField("type");
    },
    // 每页显示的服务或者产品数量
    showServeNum(father = [], son = [], num = Number) {
      son = father.slice(4 * num, 4 * (num - 1 + 2));
      return son;
    },
    // - 删除服务
    delSelectedService(idx) {
      let idType = this.adForm.type == 2 ? "sortTwo" : "goodsId";
      // 注意此idx要结合页码
      idx = idx + 4 * (this.serveListPageNum - 1);
      let id = this.form.serviceSpecificationList[idx][idType];
      this.selectedServicesIds.delete(id);
      delete this.selectedServicesObj[id];
      this.form.serviceSpecificationList.splice(idx, 1);
      // 删除后表格刷新
      if (this.supServiceTable.length === 1) {
        this.handleCurrentChangeServe(this.serveListPageNum - 1);
      } else {
        this.handleCurrentChangeServe(this.serveListPageNum);
      }
      // 优化校验。。在此校验单条form信息
      this.$refs.adFormRef.validateField("type");
    },
    // - 保存产品
    getProductDataFromSuber(obj) {
      let idType = this.adForm.type == 2 ? "sortTwo" : "goodsId";
      obj.yes.map(i => {
        if (!this.selectedProductsIds.has(i[idType])) {
          this.selectedProductsIds.add(i[idType]);
          this.selectedProductsObj[i[idType]] = {
            orderby: 99,
            ...i
          };
        }
      });
      obj.no.map(i => {
        if (this.selectedProductsIds.has(i[idType])) {
          this.selectedProductsIds.delete(i[idType]);
          delete this.selectedProductsObj[i[idType]];
        }
      });
      this.form.productSpecificationList = Object.values(
        this.selectedProductsObj
      );
      // this.supServiceTable = Object.values(this.selectedProductsObj);
      this.handleCurrentChangeProduct(1);
      // 优化校验。。在此校验单条form信息
      this.$refs.adFormRef.validateField("type");
    },
    // - 删除产品
    delSelectedProduct(idx) {
      let idType = this.adForm.type == 2 ? "sortTwo" : "goodsId";
      // 注意此idx要结合页码
      idx = idx + 4 * (this.productListPageNum - 1);
      let id = this.form.productSpecificationList[idx][idType];
      this.selectedProductsIds.delete(id);
      delete this.selectedProductsObj[id];
      this.form.productSpecificationList.splice(idx, 1);
      // 删除后表格刷新
      if (this.supProductTable.length === 1) {
        this.handleCurrentChangeProduct(this.productListPageNum - 1);
      } else {
        this.handleCurrentChangeProduct(this.productListPageNum);
      }
      // 优化校验。。在此校验单条form信息
      this.$refs.adFormRef.validateField("type");
    },
    // - 保存卡项
    getCardDataFromSuber(obj) {
      let idType = this.adForm.type == 2 ? "sortOne" : "goodsId";
      obj.yes.map(i => {
        if (!this.selectedCardsIds.has(i[idType])) {
          this.selectedCardsIds.add(i[idType]);
          this.selectedCardsObj[i[idType]] = {
            goodsName: i.cardName,
            shopPrice:
              i.cardFirstRechargeNum > 0 ? i.cardFirstRechargeNum : i.cardPrice,
            orderby: 99,
            ...i
          };
        }
      });
      obj.no.map(i => {
        if (this.selectedCardsIds.has(i[idType])) {
          this.selectedCardsIds.delete(i[idType]);
          delete this.selectedCardsObj[i[idType]];
        }
      });
      this.form.cardSpecificationList = Object.values(this.selectedCardsObj);
      this.supCardTable = this.showServeNum(
        this.form.cardSpecificationList,
        this.supCardTable,
        0
      );
      // 优化校验。。在此校验单条form信息
      this.$refs.adFormRef.validateField("type");
    },
    // - 删除卡项
    delSelectedCard(idx) {
      let idType = this.adForm.type == 2 ? "sortOne" : "goodsId";
      // 注意此idx要结合页码
      idx = idx + 4 * (this.cardListPageNum - 1);
      let id = this.form.cardSpecificationList[idx][idType];
      this.selectedCardsIds.delete(id);
      delete this.selectedCardsObj[id];
      this.form.cardSpecificationList.splice(idx, 1);
      // 删除后表格刷新
      if (this.supCardTable.length === 1) {
        this.handleCurrentChangeCard(this.cardListPageNum - 1);
      } else {
        this.handleCurrentChangeCard(this.cardListPageNum);
      }
      // 优化校验。。在此校验单条form信息
      this.$refs.adFormRef.validateField("type");
    },
    cancal() {
      if (this.entry === "detail") {
        window.close();
        return;
      }
      this.$router.go(-1);
    },
    // 获取活动详情
    async getAdDetail(id) {
      const res = await axios.post(`/getAdByIdPC`, { adId: id });
      // 赋值详情信息
      this.adForm = res;
      this.adForm.position = res.position + "";
      // this.adForm.title = res.title
      let listType = this.adForm.type == 2 ? "sortInfoList" : "goodsList";

      this.form.productSpecificationList =
        res[listType] &&
        res[listType].filter(i => {
          return i.goodsType == 2;
        });
      this.form.serviceSpecificationList =
        res[listType] &&
        res[listType].filter(i => {
          return i.goodsType == 1;
        });
      this.form.cardSpecificationList =
        res[listType] &&
        res[listType].filter(i => {
          return i.goodsType == 3;
        });
      this.supProductTable = this.showServeNum(
        this.form.productSpecificationList,
        this.supProductTable,
        0
      );
      this.supServiceTable = this.showServeNum(
        this.form.serviceSpecificationList,
        this.supServiceTable,
        0
      );
      this.supCardTable = this.showServeNum(
        this.form.cardSpecificationList,
        this.supCardTable,
        0
      );
      // 类型2的回显方式另做处理
      if (this.adForm.type == 2) {
        this.form.cardSpecificationList.forEach(item => {
          item.sortTwo = item.sortTwo || item.sortOne;
        });
      }
      let idType = this.adForm.type == 2 ? "sortTwo" : "goodsId";
      // 子组件数据回显
      this.form.serviceSpecificationList &&
        this.form.serviceSpecificationList.map(i => {
          this.selectedServicesIds.add(i[idType]);
          this.selectedServicesObj[i[idType]] = i;
        });
      this.form.productSpecificationList &&
        this.form.productSpecificationList.map(i => {
          this.selectedProductsIds.add(i[idType]);
          this.selectedProductsObj[i[idType]] = i;
        });
      this.form.cardSpecificationList &&
        this.form.cardSpecificationList.map(i => {
          this.selectedCardsIds.add(i[idType]);
          this.selectedCardsObj[i[idType]] = i;
        });
    },
    // 广告图片上传
    uploadBanner(file, type) {
      this.hideFlagBanner = file.length == 1;
      this.adForm[type] = file[0] ? file[0] : null;
    },
    // 广告海报上传
    uploadPhoto(file, type) {
      this.hideFlagPhoto = file.length == 1;
      this.adForm[type] = file[0] ? file[0] : null;
    }
  },
  watch: {
    "adForm.type": {
      immediate: true,
      handler(val, old) {
        // 编辑、详情首次监听 不清空数据
        if (!old) return;
        // 清空信息
        this.form.serviceSpecificationList = [];
        this.form.productSpecificationList = [];
        this.form.cardSpecificationList = [];
        this.selectedServicesIds = new Set();
        this.selectedProductsIds = new Set();
        this.selectedCardsIds = new Set();
        this.subServiceTable = [];
        this.subProductTable = [];
        this.subCardTable = [];
        this.supServiceTable = [];
        this.supProductTable = [];
        this.supCardTable = [];
        this.selectedServicesObj = {};
        this.selectedProductsObj = {};
        this.selectedCardsObj = {};
        this.adForm.menu = "";
      }
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    }),
    // 判断是品牌还是门店的标识
    isBrand() {
      return this.$route.path.indexOf("brand") !== -1;
    },
    // 活动页面title
    activityTitle() {
      switch (this.entry) {
        case "add":
          return "发布广告";
        case "edit":
          return "编辑广告";
        default:
          return "广告预览";
      }
    }
  },
  components: { productDialog, serviceDialog, cardDialog }
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
    padding: 36px 72px 85px 20px;
    margin: 0 auto;
    background: #fff;
    border-radius: 6px;
    /* ==== */
    min-height: calc(100vh - 105px);
  }
}

.plain_blue_btn,
.plain_pink_btn,
.plain_green_btn {
  padding: 9px;
}
.normal_blue_btn {
  padding: 12px 37px;
}
.table-box {
  width: 700px;
  box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
  margin: 20px 0;
  /deep/ .el-radio,
  /deep/ .el-form-item {
    margin: 0;
  }
  /deep/ .el-input-group__append {
    padding: 0 12px;
  }
  .input {
    /deep/ .el-input__inner {
      width: 40px;
      height: 35px;
      text-align: center;
      text-indent: 0;
    }
  }
}

.xing {
  &::before {
    content: "* ";
    color: #ff6d61;
  }
}

.form-line {
  display: flex;
  line-height: 40px;
  min-height: 60px;

  .form-title {
    width: 140px;
    text-align: right;
    box-sizing: border-box;
    padding-right: 20px;
    color: #666666;
    font-size: 14px;
  }

  .form-con {
    flex: auto;
    font-size: 14px;
    color: #333333;

    .button {
      width: 74px;
      margin-right: 56px;
      height: 30 xp;
      box-sizing: border-box;
      padding: 0;
      line-height: 28px;
      border: 1px solid #58c9f3;
      color: #58c9f3;
      border-radius: 5px;
    }

    i {
      color: #58c9f3;
      cursor: pointer;
    }
  }

  .item-number-input {
    width: 70px;
    /deep/ .el-input__inner {
      border-radius: 4px 0 0 4px;
    }
  }
}

.time-card-limit-line {
  display: flex;
}

.count-input {
  width: 120px;
  .el-input__inner {
    transform: translateY(20px);
  }
}

.el-pagination {
  margin-top: 10px;
}

.banner-pic {
  /deep/ .el-upload-list__item {
    width: 267px !important;
    /deep/ div {
      width: 267px;
      height: 100px;
    }
  }
}
.photo-pic {
  /deep/ .el-upload-list__item {
    width: 100px !important;
    /deep/ div {
      width: 100px;
      height: 100px;
    }
  }
}

.hideUpload {
  /deep/ .el-upload--picture-card {
    display: none;
  }
}
</style>
