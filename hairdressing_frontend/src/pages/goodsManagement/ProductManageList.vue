<template>
  <div class="gm-service-box">
    <div class="top">
      <el-button
        class="normal_pink_btn normal_red_btn"
        size="medium"
        @click="$router.push('/shop-inner/product-add')"
        v-if="checkHasBtnPermission('/shop-inner/product-add', 'path')"
        >新增产品
      </el-button>
      <span
        v-if="!checkHasBtnPermission('/shop-inner/product-add', 'path')"
      ></span>
      <input-search
        v-model="keyword"
        @search="esProductList"
        placeholder="请输入产品名称"
      ></input-search>
    </div>
    <div id="gm_service_list" class="margin_main">
      <el-form
        class="service_list_condition"
        ref="form"
        :model="searchData"
        label-width="84px"
        :rules="searchDataRules"
      >
        <separate-button-groups
          name="name"
          count="tagCount"
          :list="tags"
          label="id"
          v-model="productTag"
          @change="
            () => {
              pages.currentPage = 1;
              esProductList();
            }
          "
        ></separate-button-groups>
        <div class="service-filters-box">
          <div class="left-area">
            <div class="select_condition">
              <div class="label-area-single">
                <el-form-item label="产品品牌：" prop="productBrandId">
                  <el-select v-model="searchData.productBrandId">
                    <el-option
                      v-for="(item, index) in productBrandInfo"
                      :key="index"
                      :label="item.productBrandName"
                      :value="item.productBrandId"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="产品分类：" prop="productSort">
                  <el-select v-model="searchData.productSort" no-data-text="请先选择产品品牌">
                    <el-option
                      v-for="item in productSorts"
                      :key="item.id"
                      :label="item.sortName"
                      :value="item.jimeiClassId"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="库存数量：" prop="quantityInStock">
                  <el-select v-model="searchData.quantityInStock">
                    <el-option
                      :label="item.cn"
                      :value="item.value"
                      v-for="(item, index) in quantityInStocks"
                      :key="index"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <div class="three-section">
                  <el-form-item
                    label="产品价格："
                    prop="priceFrom"
                    class="left-input"
                  >
                    <number-input
                      width="60px"
                      v-model="searchData.priceFrom"
                    ></number-input>
                  </el-form-item>
                  <span class="span">至</span>
                  <el-form-item prop="priceTo" class="right-input">
                    <number-input
                      width="60px"
                      v-model="searchData.priceTo"
                    ></number-input>
                  </el-form-item>
                </div>
                <div class="three-section">
                  <el-form-item
                    label="累计销量："
                    prop="salesVolumeFrom"
                    class="left-input"
                  >
                    <number-input
                      width="60px"
                      v-model="searchData.salesVolumeFrom"
                    ></number-input>
                  </el-form-item>
                  <span class="span">至</span>
                  <el-form-item prop="salesVolumeTo" class="right-input">
                    <number-input
                      width="60px"
                      v-model="searchData.salesVolumeTo"
                    ></number-input>
                  </el-form-item>
                </div>
                <el-form-item label="评价数量：" prop="commentAmount">
                  <el-select v-model="searchData.commentAmount">
                    <el-option
                      v-for="(item, index) in commentAmount"
                      :key="index"
                      :label="item.mark"
                      :value="item.range"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="评价得分：" prop="assistantScore">
                  <el-select v-model="searchData.assistantScore">
                    <el-option
                      v-for="(item, index) in [
                        { mark: '0-3', range: [0, 3] },
                        { mark: '3-4', range: [3, 4] },
                        { mark: '4-5', range: [4, 5] }
                      ]"
                      :key="index"
                      :label="item.mark"
                      :value="item.range"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="right-area">
            <div class="clear-filters" @click="clearFilters">清空条件</div>
            <el-tooltip
                      class="item"
                      effect="dark"
                      content="模板不支持查询"
                      placement="top"
                      v-if="fromBrand"
                    >
            <div class="filter-btn" @click="esProductList">
              查询
            </div>
          </el-tooltip>
              <div class="filter-btn" @click="esProductList" v-else>
                查询
              </div>
          </div>
        </div>
      </el-form>
      <div
        class="user-defined-tab container-normal-list"
        style="margin-top:20px;"
        v-loading="tableLoading"
      >
        <el-tabs type="card" v-model="productQueryType" @tab-click="changeTab">
          <el-tab-pane
            v-for="(item, index) in selectStatus"
            :key="index"
            :label="item.value"
            :name="`${item.code}`"
          ></el-tab-pane>
        </el-tabs>
        <div class="main-con">
          <div v-if="!initTotal || pages.totalCount !== 0">
            <el-checkbox-group v-model="checkArr" @change="handleChecked">
              <el-table
                :data="tableData"
                tooltip-effect="dark"
                stripe
                style="width: 100%;"
                class="table-data-list"
                height="calc(100vh - 430px)"
              >
                <el-table-column
                  align="right"
                  label="排序"
                  width="90"
                  v-if="
                    checkHasBtnPermission('shop_goods_product_tableButtons') &&
                      !fromBrand
                  "
                >
                  <template slot-scope="scope">
                    <div class="sort-area">
                      <el-checkbox
                        :key="scope.row.productId"
                        :label="scope.row.productId"
                        class="check_single"
                      ></el-checkbox>
                      <number-input
                        style="margin-left:10px"
                        @blur="changeNO(scope.row.productId, scope.row.order)"
                        v-model.number="scope.row.order"
                        :max="9999"
                      ></number-input>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column width="250" label="产品名称">
                  <template slot-scope="scope">
                    <div class="service-message">
                      <el-checkbox
                        :key="scope.row.productTempId"
                        :label="scope.row.productTempId"
                        class="check_single"
                        style="margin-right: 5px;"
                        v-if="fromBrand"
                      ></el-checkbox>
                      <div
                        class="image-box"
                        @click="fromBrand ? toTemplateDetail(scope.row) : toEditServer(scope.row.productId, true)"
                      >
                        <img
                          :src="
                            formatPicImage(
                              scope.row.image,
                              'style',
                              70,
                              'brandLogo'
                            )
                          "
                          class="image"
                        />
                      </div>
                      <div class="service-info-text">
                        <div
                          class="product-name"
                          @click="fromBrand ? toTemplateDetail(scope.row) : toEditServer(scope.row.productId, true)"
                        >
                          <p class="ser_name">{{ scope.row.name }}</p>
                          <p class="ser_code" v-if="fromBrand">
                            {{
                              scope.row.code
                                ? scope.row.code
                                : "引用到门店后生成编码"
                            }}
                          </p>
                          <p class="ser_code" v-else>{{ scope.row.code }}</p>
                        </div>
                        <p
                          class="ser_tag"
                          :title="
                            (scope.row.tags || [])
                              .map(item => item.name)
                              .join('/')
                          "
                        >
                          <span>{{
                            (scope.row.tags || [])
                              .map(item => item.name)
                              .join("/")
                          }}</span>
                        </p>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="产品分类">
                  <template slot-scope="scope">{{
                    scope.row.productLevelOneName
                  }}</template>
                </el-table-column>
                <el-table-column label="专柜价">
                  <template slot-scope="scope">
                    <span class="price"
                      >¥{{
                        utils.formatPrice(
                          scope.row.minPrice,
                          scope.row.maxPrice
                        )
                      }}</span
                    >
                  </template>
                </el-table-column>
                <el-table-column
                  label="库存"
                  prop="stock"
                  v-if="!fromBrand"
                ></el-table-column>
                <el-table-column label="销量" v-if="!fromBrand">
                  <template slot-scope="scope">{{
                    scope.row.saleCount
                  }}</template>
                </el-table-column>
                <el-table-column
                  label="上架时间"
                  prop="shelvesDate"
                >
                <template slot-scope="scope">
                <p v-if="fromBrand">{{ scope.row.shelvesDate ? scope.row.shelvesDate.split('T')[0] + ' ' + scope.row.shelvesDate.split('T')[1] : '' }}</p>
                  <p v-else>{{ scope.row.shelvesDate }}</p>
                </template>
              </el-table-column>
                <el-table-column label="状态" v-if="!fromBrand">
                  <template slot-scope="scope">
                    <p
                      v-for="(item, index) in statusText(
                        scope.row.shelvesStatus
                      )"
                      :key="index"
                    >
                      <status-text
                        :type="item.type"
                        :name="item.cn"
                      ></status-text>
                    </p>
                  </template>
                </el-table-column>
                <!-- <el-table-column label="促销">
                  <template slot-scope="scope">
                    <p>{{scope.row.salePromotion?scope.row.salePromotion:'-'}}</p>
                  </template>
                </el-table-column>-->
                <el-table-column label="评价数" v-if="!fromBrand">
                  <template slot-scope="scope">{{
                    scope.row.evaluationCount
                  }}</template>
                </el-table-column>
                <el-table-column label="评分" v-if="!fromBrand">
                  <template slot-scope="scope">{{
                    scope.row.evaluationScore
                  }}</template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  :width="
                    productQueryTypeInt === 1 ||
                    productQueryTypeInt === 2 ||
                    productQueryTypeInt === 5
                      ? 220
                      : productQueryTypeInt === 0 || productQueryTypeInt === 3
                      ? 140
                      : 80
                  "
                  v-if="
                    checkHasBtnPermission('shop_goods_product_tableButtons') &&
                      checkHasBtnPermission('/shop-inner/product-edit', 'path')
                  "
                >
                <!-- template 不吃v-if 这里用div -->
                  <div slot-scope="scope" v-if="!fromBrand">
                    <div
                      v-if="
                        productQueryTypeInt === 4 &&
                          checkHasBtnPermission(
                            'shop_goods_product_tableButtons'
                          )
                      "
                    >
                      <g-button
                        name="恢复"
                        type="green"
                        :icon="'icon_operate_recover'"
                        @click="recoverProduct([scope.row.productId])"
                      ></g-button>
                    </div>
                    <div v-else>
                      <g-button
                        v-if="
                          productQueryTypeInt !== 4 &&
                            checkHasBtnPermission(
                              '/shop-inner/product-edit',
                              'path'
                            )
                        "
                        :name="'编辑'"
                        type="detail"
                        :icon="'icon_operate_edit'"
                        @click="toEditServer(scope.row.productId)"
                      ></g-button>
                      <g-button
                        v-if="
                          (productQueryTypeInt === 2 ||
                            productQueryTypeInt === 0) &&
                            checkHasBtnPermission(
                              'shop_goods_product_tableButtons'
                            )
                        "
                        name="补货"
                        type="orange"
                        icon="icon_ope_repair"
                        @click="addMore(scope.row.productId)"
                      ></g-button>
                      <g-button
                        v-if="
                          productQueryTypeInt === 0 &&
                            checkHasBtnPermission(
                              'shop_goods_product_tableButtons'
                            )
                        "
                        :name="'虚拟'"
                        :type="'mgreen'"
                        :icon="'icon_operate_fictit'"
                        @click="setVirtualNum(scope.row)"
                      ></g-button>
                      <g-button
                        v-if="
                          productQueryTypeInt === 1 &&
                            checkHasBtnPermission(
                              'shop_goods_product_tableButtons'
                            )
                        "
                        :name="'上架'"
                        :type="'detail'"
                        :icon="'icon_operate_up'"
                        @click="
                          handleShop(
                            [scope.row.productId],
                            'offShelfProduct',
                            true
                          )
                        "
                      ></g-button>
                      <g-button
                        v-if="
                          productQueryTypeInt === 0 &&
                            checkHasBtnPermission(
                              'shop_goods_product_tableButtons'
                            )
                        "
                        :name="'下架'"
                        type="cancel"
                        :icon="'icon_operate_down'"
                        @click="
                          handleShop(
                            [scope.row.productId],
                            'offShelfProduct',
                            false
                          )
                        "
                      ></g-button>
                      <g-button
                        v-if="
                          productQueryTypeInt !== 0 &&
                            productQueryTypeInt !== 4 &&
                            checkHasBtnPermission(
                              'shop_goods_product_tableButtons'
                            )
                        "
                        :name="'删除'"
                        type="cancel"
                        :icon="'icon_operate_delete'"
                        @click="delServer([scope.row.productId])"
                      ></g-button>
                    </div>
                  </div>
                  <div slot-scope="scope" v-else>
                    <!-- 品牌模板独享按钮 -->
                    <g-button
                      :name="'详情'"
                      type="detail"
                      :icon="'icon_operate_eyes'"
                      @click="toTemplateDetail(scope.row)"
                    ></g-button>
                    <el-tooltip
                    class="item"
                    effect="dark"
                    content="使用总部模板新增商品"
                    placement="top"
                    v-if="fromBrand"
                  >
                    <g-button
                      :name="'使用'"
                      type="detail"
                      :icon="'icon_operate_down'"
                      @click="useTemplate(scope.row)"
                    ></g-button>
                  </el-tooltip>
                    <!-- 品牌模板独享按钮 -->
                  </div>
                </el-table-column>
              </el-table>
            </el-checkbox-group>
            <div class="service_operation">
              <div
                class="manage-buttons"
                v-if="checkHasBtnPermission('shop_goods_product_tableButtons') && !fromBrand"
              >
                <el-checkbox v-model="checkAllFlag" @change="checkAllChange"
                  >全选</el-checkbox
                >
                <add-tags-pop
                  v-if="productQueryTypeInt <= 2"
                  ref="addTag"
                  :addNewTagPopVisible="addNewTagPopVisible"
                  :availableTags="availableTags"
                  @close="addNewTagPopVisible = false"
                  @delTags="delTags"
                  @addNewTagFn="addNewTagFn"
                  @confirmAddTagToService="confirmAddTagToService"
                  @makeTag="makeTag"
                ></add-tags-pop>
                <g-button
                  v-if="productQueryTypeInt === 1"
                  :name="'上架'"
                  :type="'recommend'"
                  :icon="'icon_operate_up'"
                  @click="handleShop(checkedIds, 'offShelfProduct', true)"
                ></g-button>
                <g-button
                  v-if="productQueryTypeInt === 0"
                  :name="'下架'"
                  type="grey"
                  :icon="'icon_operate_down'"
                  @click="handleShop(checkedIds, 'offShelfProduct', false)"
                ></g-button>
                <g-button
                  v-if="productQueryTypeInt === 0"
                  :name="'首页推荐'"
                  :type="'recommend'"
                  :icon="''"
                  @click="handleShop(checkedIds, 'recommandInFirstPage', true)"
                ></g-button>
                <g-button
                  v-if="productQueryTypeInt === 0"
                  :name="'取消推荐'"
                  :type="'grey'"
                  :icon="''"
                  @click="handleShop(checkedIds, 'recommandInFirstPage', false)"
                ></g-button>
                <g-button
                  v-if="productQueryTypeInt === 0"
                  :name="'网店展示'"
                  :type="'recommend'"
                  :icon="''"
                  @click="handleShop(checkedIds, 'productShowInShop', true)"
                ></g-button>
                <g-button
                  v-if="productQueryTypeInt === 0"
                  :name="'网店隐藏'"
                  :type="'grey'"
                  :icon="''"
                  @click="handleShop(checkedIds, 'productShowInShop', false)"
                ></g-button>
                <g-button
                  v-if="productQueryTypeInt < 4 && productQueryTypeInt !== 0"
                  :name="'删除'"
                  type="delete"
                  :icon="'icon_operate_delete'"
                  @click="delServer(checkedIds)"
                ></g-button>
                <g-button
                  v-if="productQueryTypeInt === 4"
                  name="恢复"
                  type="greenFill"
                  :icon="'icon_operate_recover'"
                  @click="recoverProduct(checkedIds)"
                ></g-button>
              </div>
              <div v-if="fromBrand" class="manage-buttons">
                <el-checkbox v-model="checkAllFlag" @change="checkAllChange"
                  >全选</el-checkbox
                >
                <g-button
                  name="批量使用"
                  :type="'mgreenFill'"
                  :icon="'icon_operate_down'"
                  @click="batchUseTem(checkedIds)"
                  v-loading="btnLoad"
                ></g-button>
              </div>
              <div
                v-if="!checkHasBtnPermission('shop_goods_product_tableButtons')"
              ></div>
              <el-pagination
                class="pageNation"
                @current-change="handleCurrentChange"
                :current-page="pages.currentPage"
                :page-size="pages.pageSize"
                :pager-count="pages.pageNum"
                layout="total, prev, pager, next, jumper"
                :total="pages.totalCount"
              ></el-pagination>
            </div>
          </div>
          <search-default
            class="search-default"
            v-if="initTotal && pages.totalCount === 0"
            @clear-back="resetForm"
          ></search-default>
        </div>
      </div>

      <el-dialog
        :closeOnClickModal="false"
        title="设置虚拟销量"
        :visible.sync="dialogVisibleSetVirtual"
        width="500px"
      >
        <div class="virtual-number">
          <label>虚拟销量：</label>
          <number-input
            v-model="virtualNum"
            :decimal="false"
            width="200px"
            :big="true"
            placeholder="请输入虚拟销量"
            :min="1"
            :max="10000"
          ></number-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleSetVirtual = false">取 消</el-button>
          <el-button type="primary" @click="setVirtualSale">确 定</el-button>
        </span>
      </el-dialog>
      <g-del-model
        :delTagDialogVisible="delTagDialogVisible"
        @close="delTagDialogVisible = false"
        @confirm="modelConfirm"
        :title="modelInfo.title"
        :content="modelInfo.content"
        :icon="modelInfo.icon"
        :iconColor="modelInfo.iconColor"
      ></g-del-model>
      <add-more-product ref="addMore" @update="init()"></add-more-product>
    </div>
  </div>
</template>
<script>
import * as api from "@/assets/js/interface";
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import * as datas from "@/assets/js/datas";
import MyDialog from "@/components/commonModal/modal/dialog";
import SubHeader from "@/components/common/SubHeader";
import InputFromTo from "@/components/goodsManagement/InputFromTo";
import addTagsPop from "@/components/common/addTagsPop";
import AddMoreProduct from "@/components/goodsManagement/serviceManage/AddMoreProduct";
import "@/assets/css/tab.scss";
import { mapActions } from "vuex";
import { Base64 } from 'js-base64'

export default {
  components: {
    "my-dialog": MyDialog,
    "sub-header": SubHeader,
    "input-from-to": InputFromTo,
    "add-tags-pop": addTagsPop,
    "add-more-product": AddMoreProduct
  },
  data() {
    return {
      utils,
      tableLoading: true,
      keyword: "",
      productQueryType: '0',
      formatPicImage: utils.formatPicImage, // 有尺寸的图片处理
      productTag: -3,
      addNewTagPopVisible: false,
      tagToDelId: [],
      availableTags: {
        platformServiceTagInfos: [],
        storeServiceTagInfos: []
      },
      quantityInStocks: [
        { cn: "10以内", value: [0, 10] },
        { cn: "11-50", value: [11, 50] },
        { cn: "50-100", value: [50, 100] },
        { cn: "101-200", value: [100, 200] },
        { cn: "200以上", value: [200, null] }
      ],
      evaluationScore: [
        { range: [0, 3], mark: "0-3" },
        { range: [3, 4], mark: "3-4" },
        { range: [4, 5], mark: "4-5" }
      ],
      commentAmount: [
        { mark: "100以内", range: [null, 100] },
        { mark: "100-200", range: [101, 200] },
        { mark: "200-500", range: [201, 500] },
        { mark: "500-1000", range: [501, 1000] },
        { mark: "1000以上", range: [1000, null] }
      ],
      dialogVisibleSetVirtual: false,
      virtualNum: 0,
      checkAllFlag: false,
      checkArr: [],
      searchData: {
        productFrom: null,
        productBrandId: null,
        productSort: null,
        quantityInStock: [null, null],
        commentAmount: [null, null],
        assistantScore: [null, null],
        priceFrom: null,
        priceTo: null,
        salesVolumeFrom: null,
        salesVolumeTo: null
      },
      searchDataRules: {},
      selectStatus: [
        { code: '0', value: "已上架" },
        { code: '1', value: "未上架" },
        { code: '2', value: "已售完" },
        { code: '3', value: "草稿箱" },
        { code: '4', value: "已删除" },
        { code: '5', value: "总部模板" }
      ],
      selectStatusCn: [
        "ON_SHELVE",
        "UN_SHELVE",
        "SALE_OUT",
        "DRAFT",
        "DELETED"
      ],
      pages: {
        currentPage: 1,
        totalCount: 0,
        pageSize: 10,
        pageNum: 5,
        id: null
      },
      // 表格数据
      tableData: [],
      delTagDialogVisible: false, // 弹窗层的显示
      delIdsList: [],
      tags: [],
      productSorts: [],
      modelName: "",
      productBrandInfo: [],
      modelInfo: {
        title: null,
        content: null,
        icon: null,
        iconColor: null
      },
      initTotal: 0,
      fromBrand: false,
      btnLoad: false
    };
  },
  computed: {
    currentInfo() {
      return this.$store.state.manage.currentInfo;
    },
    checkedIds() {
      if (this.checkArr.length === 0) {
        return [];
      }
      return this.checkArr.map(item => Number(item));
    },
    productQueryTypeInt() {
      return Number(this.productQueryType);
    },
    queryParams() {
      return {
        assistantCount: {
          from:
            this.searchData.commentAmount.length === 2
              ? this.searchData.commentAmount[0]
              : null,
          to: this.searchData.commentAmount[1] || null
        },
        assistantScore: {
          from:
            this.searchData.assistantScore.length === 2
              ? this.searchData.assistantScore[0]
              : null,
          to: this.searchData.assistantScore[1] || null
        },
        productBrandId: this.searchData.productBrandId || null,
        currentPage: this.pages.currentPage - 1,
        keyword: this.keyword,
        pageSize: this.pages.pageSize,
        price: {
          from: this.searchData.priceFrom || null,
          to: this.searchData.priceTo || null
        },
        saleCount: {
          from: this.searchData.salesVolumeFrom || null,
          to: this.searchData.salesVolumeTo || null
        },
        sortOne: this.searchData.productSort,
        stocks: {
          from:
            this.searchData.quantityInStock.length === 2
              ? this.searchData.quantityInStock[0]
              : null,
          to: this.searchData.quantityInStock[1] || null
        },
        storeId: this.currentInfo.shopId,
        tabCondition: this.selectStatusCn[this.productQueryType],
        tag: this.productTag
      };
    }
  },
  mounted() {
    this.init();
    this.getStoreProductBrandAndSort();
  },
  methods: {
    ...mapActions(["saveOperate", "saveCurrentInfo", "productEditId", "productTemplateId"]),
    init() {
      this.esProductList();
      this.getProductTagsCountInfo();
      this.checkArr = [];
      this.checkAllFlag = false;
    },
    toEditServer(id, ignore) {
      if (ignore) {
        window.open("#/shop-inner/product-detail?id=" + Base64.encode(id), "_blank");
        return;
      }
      if (this.productQueryTypeInt === 0) {
        this.modelName = "cantEdit";
        this.modelInfo = {
          title: "该商品暂时不能编辑！",
          content: "该商品为上架状态，请先将其下架处理。",
          icon: "icon_popup_plaint",
          iconColor: "#FCB322"
        };
        this.delTagDialogVisible = true;
        return;
      }
      this.productEditId(id);
      this.$router.push("/shop-inner/product-edit");
    },
    getStoreProductBrandAndSort() {
      axios
        .post("/getStoreProductBrandAndSort", {
          brandId: this.currentInfo.brandId,
          storeId: this.currentInfo.shopId
        })
        .then(res => {
          // var sortInfos = [];
          // for (let i = 0; i < res.productBrandInfo.length; i++) {
          //   const productBrand = res.productBrandInfo[i];
          //   for (let j = 0; j < productBrand.storeSortInfos.length; j++) {
          //     const sortOne = productBrand.storeSortInfos[j];
          //     let sortInfosIds = sortInfos.map(item => item.jimeiClassId);
          //     if (sortInfosIds.indexOf(sortOne.jimeiClassId) === -1) {
          //       sortInfos.push(sortOne);
          //     }
          //   }
          // }
          // this.productSorts = sortInfos;
          this.productBrandInfo = res.productBrandInfo;
        });
    },
    // 获取产品
    confirmDelProduct(data, bool) {
      this.tableLoading = true;
      axios
        .put(api.recoverOrDeleteProduct.URL, {
          productIds: data,
          deleted: bool
        })
        .then(res => {
          if (res.success) {
            this.$message({ type: "success", message: res.message });
          } else {
            this.$message({ type: "warning", message: res.message });
          }
          this.init();
        });
      this.delTagDialogVisible = false;
    },
    checkHasServerId(id, type) {
      if (!id.length) {
        // 提示
        utils.showTip(this, {
          msg: "请先选择所要操作的产品" + (type ? '模板' : ''),
          type: "error"
        });
        return false;
      }
      return true;
    },
    handleShop(id, service, bool) {
      if (!this.checkHasServerId(id)) return;
      let signature = "";
      switch (service) {
        case "offShelfProduct":
          signature = "onOffShelf";
          break;
        case "recommandInFirstPage":
          signature = "recommand";
          break;
        case "productShowInShop":
          signature = "showInShop";
          break;
      }
      let params = { productIds: id };
      params[signature] = bool;
      this.tableLoading = true;
      if (service === "productShowInShop") {
        let checkedGoods = this.tableData.filter(item => {
          return id.includes(item.productId);
        });
        let canShowOnline = checkedGoods.every(item => item.maxPrice > 0);
        if (!canShowOnline) {
          this.$message({
            type: "warning",
            message: "单价为0元的商品不可以网店展示，请取消勾选后重试"
          });
          this.tableLoading = false;
          return;
        }
      }
      axios.put(api[service].URL, params).then(res => {
        this.handleProductRes(res);
      });
    },
    handleProductRes(res) {
      if (res.success) {
        this.$message({ type: "success", message: res.message });
      } else {
        this.$message({ type: "warning", message: res.message });
      }
      this.init();
    },
    delServer(id) {
      if (!this.checkHasServerId(id)) return;
      this.modelName = "delProduct";
      this.modelInfo = {
        title: "确定要删除吗",
        content: "删除后，用户端商城及门店前台将不再出现该项产品",
        icon: "icon_popup_question",
        iconColor: "#FF6D61"
      };
      this.delTagDialogVisible = true;
      this.delIdsList = id;
    },
    esProductList() {
      // 区分是否点击了 品牌模板 tag
      let params = !this.fromBrand
        ? this.queryParams
        : {
            brandId: this.currentInfo.brandId,
            deleted: false,
            keyword: this.keyword,
            pageNum: this.pages.currentPage,
            pageSize: this.pages.pageSize
          };
      let url = this.fromBrand
        ? "/getProductTemplateByBrandId"
        : api.esProductList.URL;
      this.tableLoading = true;
      setTimeout(() => {
        axios.post(url, params).then(res => {
          this.searchProductListByConditionRes(res);
        });
      }, 320);
    },
    searchProductListByConditionRes(res) {
      this.pages.totalCount = res.total;
      this.initTotal = res.initTotal ? res.initTotal : 0;
      this.tableLoading = false;
      this.tableData = this.fromBrand ? res.productDetailList : res.serviceDetailList;
    },
    handleCurrentChange(val) {
      this.pages.currentPage = val;
      this.esProductList();
    },
    handleChecked() {
      this.checkAllFlag = this.checkArr.length == this.tableData.length;
    },
    checkAllChange(bool) {
      let arr = this.tableData;
      let arrIds = [];
      arr.forEach(item => {
        arrIds.push(this.fromBrand ? item.productTempId : item.productId);
      });
      this.checkArr = bool ? arrIds : [];
    },
    setVirtualSale() {
      axios
        .put(api.modifyVirtualSaleCount.URL, {
          productId: this.virtualId,
          virtualSaleNumber: this.virtualNum
        })
        .then(res => {
          this.modifyVirtualSaleCountRes(res);
        });
    },
    modifyVirtualSaleCountRes(res) {
      this.dialogVisibleSetVirtual = false;
      this.$message({
        type: res.success ? "success" : "warning",
        message: res.message
      });
      this.init();
    },
    setVirtualNum(data) {
      this.virtualId = data.productId;
      this.virtualNum = data.virtualSaleCount;
      this.dialogVisibleSetVirtual = true;
    },
    resetForm(formName) {
      this.keyword = "";
      this.productQueryType = '0';
      this.$refs[formName].resetFields();
    },
    delTags(id) {
      this.tagToDelId = id;
      this.modelName = "delTag";
      this.modelInfo = {
        title: "确定要删除吗？",
        content: "删除后，所有使用该标签的产品都不再显示该标签，不可恢复。",
        icon: "icon_popup_question",
        iconColor: "#FF6D61"
      };
      this.delTagDialogVisible = true;
    },
    modelConfirm() {
      switch (this.modelName) {
        case "cantEdit":
          this.delTagDialogVisible = false;
          break;
        case "delTag":
          this.delTag();
          break;
        case "delProduct":
          this.confirmDelProduct(this.delIdsList, true);
          break;
        default:
          break;
      }
    },
    delTag() {
      axios.del(api.deleteProductTag.URL + this.tagToDelId).then(res => {
        this.delTagDialogVisible = false;
        this.getProductTagsCountInfo();
        this.getStoreProductTags();
        if (!res.success) {
          this.$message({ type: "warning", message: res.message });
        }
      });
    },
    addNewTagFn(addNewTag) {
      axios
        .post(api.addNewProductTag.URL, {
          name: addNewTag,
          storeId: this.currentInfo.shopId
        })
        .then(() => {
          this.addServiceTagRes();
        });
    },
    getProductTagsCountInfo() {
      /* 统计信息 */
      axios
        .get(api.productTagsCountInfo.URL + this.currentInfo.shopId)
        .then(res => {
          this.getProductTagsCountInfoRes(res);
        });
    },
    getProductTagsCountInfoRes(res) {
      this.tags = res.storeTagCountList;
    },
    addServiceTagRes() {
      this.getStoreProductTags();
      this.getProductTagsCountInfo();
    },
    confirmAddTagToService(selectedAvailableTags, previousTagIds) {
      let checkIds = this.checkArr;
      let params = this.tableData
        .filter(item => checkIds.includes(item.productId))
        .map(item => {
          let currentIds = (item.tags || []).map(i => i.id);
          let allIds = [
            ...new Set(selectedAvailableTags.concat(previousTagIds))
          ];
          allIds.forEach(id => {
            if (
              selectedAvailableTags.includes(id) &&
              !previousTagIds.includes(id)
            ) {
              currentIds.push(id);
            } else if (
              !selectedAvailableTags.includes(id) &&
              previousTagIds.includes(id)
            ) {
              currentIds.splice(currentIds.indexOf(id), 1);
            }
          });
          return {
            id: item.productId,
            tagIds: [...new Set(currentIds)]
          };
        });
      axios.post("/batchSetProductTag", { tagBeans: params }).then(res => {
        this.confirmAddTagToServiceRes(res);
      });
    },
    confirmAddTagToServiceRes(res) {
      this.$message({
        type: res.success ? "success" : "warning",
        message: res.message
      });
      this.init();
      this.addNewTagPopVisible = false;
    },
    makeTag() {
      if (!this.checkHasServerId(this.checkedIds)) return;
      this.getStoreProductTags();
    },
    getStoreProductTags() {
      axios
        .put(api.getStoreProductTags.URL, {
          productIds: this.checkedIds,
          storeId: this.currentInfo.shopId
        })
        .then(res => {
          this.getStoreProductTagsRes(res);
        });
    },
    getStoreProductTagsRes(res) {
      this.availableTags.storeServiceTagInfos = res.productTagInfos;
      this.addNewTagPopVisible = true;
      let checkIds = this.checkArr;
      let tagIds = utils.publicIdsIn2dArray(
        this.tableData
          .filter(item => checkIds.includes(item.productId))
          .map(item => {
            let ids = (item.tags || []).map(i => i.id);
            return ids;
          })
      );
      // console.log({
      //   "this.checkArr":this.checkArr,
      //   "tagIds":tagIds,
      //   "this.tableData":this.tableData
      // });
      this.$nextTick(() => {
        this.$refs.addTag.statisticsSelectedTagIds(tagIds);
      });
    },
    addMore(id) {
      this.$refs.addMore.getProductStock(id);
    },
    recoverProduct(id) {
      if (!this.checkHasServerId(id)) return;
      this.tableLoading = true;
      axios
        .put(api.recoverOrDeleteProduct.URL, { productIds: id, deleted: false })
        .then(res => {
          this.$message({
            type: `${res.success ? "success" : "warning"}`,
            message: res.message
          });
          this.init();
        });
    },
    changeNO(productId, orderBy) {
      axios
        .put(api.changeProductSortOrder.URL, { productId, orderBy })
        .then(res => {
          this.$message({ type: "success", message: "设置产品排序编号成功" });
          this.esProductList();
        });
    },
    statusText(arr) {
        arr = arr ? arr : []
        let newArr = [];
        let textInfo = {
          ON_SHELVE: { cn: "已上架", type: "green" },
          UN_SHELVE: { cn: "未上架", type: "orange" },
          SALE_OUT: { cn: "已售完", type: "mred" },
          DRAFT: { cn: "草稿箱", type: "orange1" },
          DELETED: { cn: "已删除", type: "delete" },
          RECOMMANDED: { cn: "首推", type: "mred" },
          HIDE_IN_STORE: { cn: "未展示", type: "hui" }
        };
        arr.forEach(item => {
          if (textInfo[item]) {
            newArr.push(textInfo[item]);
          }
        });
        return newArr;
    },
    clearFilters() {
      this.fromBrand = false;
      this.productQueryType = '0';
      this.resetForm("form");
      this.esProductList();
    },
    changeTab() {
      this.fromBrand = this.productQueryType == '5';
      this.checkArr = [];
      this.checkAllFlag = false;
      this.pages.currentPage = 1;
      this.esProductList();
    },
    // 模板独享详事件
    toTemplateDetail(row) {
      this.productTemplateId(Number(row.productTempId));
      window.open("#/shop-inner/product-detail?fromBrand=true", "_blank");
    },
    // 使用总部模板
    useTemplate(row) {
      this.productTemplateId(Number(row.productTempId));
      this.$router.push(`/shop-inner/product-add?fromBrand=true`)
    },
    // 批量使用模板
    async batchUseTem(ids) {
      if (!this.checkHasServerId(ids, 'template')) return;
      this.btnLoad = true
      try {
        const res = await axios.post('/createProductFromTemplateBatch', {
          storeId: this.currentInfo.shopId,
          templateIds: ids,
          type: 1
        })
        if (!res.success) return this.$message.error(res.message)
        this.$message.success('批量使用成功')
        this.esProductList()
      } finally {
        this.btnLoad = false
      }
    }
  },
  watch: {
    // 监听产品品牌的变化
    'searchData.productBrandId'(val) {
      if(val) {
        this.productBrandInfo.forEach(item => {
          if(item.productBrandId === val) {
            this.productSorts = item.storeSortInfos
          }
        })
      } else {
        this.productSorts = []
      }
    }
  }
};
</script>

<style lang="scss">
#gm_service_list {
  .service_list_condition {
    padding: 10px 20px 10px 20px;
    background: #fff;
    border-radius: 10px 10px 5px 5px;
    overflow: hidden;
    min-width: 1100px;
  }

  .service-filters-box {
    display: flex;
    flex-direction: row;

    .left-area {
      flex: auto;
      min-width: 1000px;
    }

    .right-area {
      min-width: 200px;
      border-left: 1px solid #f0f1f4;
      padding-left: 25px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;

      .clear-filters {
        font-size: 14px;
        line-height: 55px;
        color: #999;

        &:hover {
          cursor: pointer;
        }
      }

      .filter-btn {
        background: rgb(88, 201, 243);
        color: #fff;
        width: 70px;
        height: 30px;
        border-radius: 5px;
        line-height: 30px;
        text-align: center;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.6s;

        &:hover {
          background: rgba(88, 201, 243, 0.8);
        }
      }
    }
  }

  .sort-area {
    display: flex;
    align-items: center;

    /deep/ .el-checkbox__label {
      display: none;
    }

    /deep/ .el-input__inner {
      text-align: center;
    }
  }

  th.is-right > .cell {
    padding-right: 16px;
  }

  .checkbox_area {
    .el-checkbox {
      width: 100px;
      margin-left: 20px;
      margin-bottom: 15px;
      display: block;
    }
  }
}
</style>

<style lang="scss" scoped>
.gm-service-box {
  .top {
    box-sizing: border-box;
    height: 35px;
    width: 100%;
    padding: 0 20px;
    margin: 20px 0;
    display: flex;
    justify-content: space-between;
  }
}

.check_single {
  margin-left: 5px;
}

.select_condition {
  display: flex;

  .label-area-single {
    flex: auto;
    display: flex;
    flex-wrap: wrap;

    .el-form-item {
      margin: 0 15px 5px 0;
    }

    /deep/ .el-select {
      width: 150px;
    }

    /deep/ .el-input--suffix .el-input__inner,
    /deep/ .el-input__inner {
      height: 35px;
    }

    .three-section {
      display: flex;
      align-items: center;

      .span {
        margin-left: -6px;
        margin-right: 6px;
      }

      .right-input {
        /deep/ .el-form-item__content {
          margin-left: 0 !important;
        }
      }

      /deep/ .el-input {
        margin-right: 14px;
      }

      /deep/ .el-input__inner {
        width: 60px;
        padding: 4px;
      }

      /deep/ .el-input {
        margin: 0;
      }
    }
  }
}

.service_operation {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .manage-buttons {
    flex: 1;
    margin-top: 20px;

    /deep/ .el-checkbox {
      margin-left: 10px;
      margin-right: 15px;
    }
  }

  .pageNation {
    margin: 20px 0;
  }
}

.service-message {
  display: flex;
  align-items: center;

  /deep/ .el-checkbox__label {
      display: none;
    }

  .image-box {
    margin-right: 10px;
    width: 64px;
    height: 62px;
    flex-shrink: 0;
    overflow: hidden;

    .image {
      display: block;
      width: 64px;
      height: 62px;
      transition: all 0.3s cubic-bezier(0.61, 0.25, 0.24, 0.85);
      cursor: pointer;

      &:hover {
        transform: scale(1.2);
      }
    }
  }

  .service-info-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    font-size: 12px;
    line-height: 17px;
    justify-content: space-between;

    .product-name {
      font-size: 12px;
      cursor: pointer;

      .ser_name {
        color: #333333;
        font-size: 14px;
      }

      .ser_code {
        color: #999999;
        font-size: 12px;
      }

      .ser_name,
      .ser_code {
        line-height: 17px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      &:hover {
        .ser_name,
        .ser_code {
          color: #58c9f3;
        }
      }
    }

    .ser_tag {
      color: #999999;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 170px;
    }
  }
}

.price {
  color: #ff6d61;
}

.virtual-number {
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #f0f1f4;
  margin-top: -20px;
  box-sizing: border-box;
  padding-top: 30px;
  margin-bottom: -10px;

  .el-input {
    width: 200px;
    margin-left: 15px;
  }
}

.container-normal-list {
  background: #ffffff;
  border-radius: 8px 8px 0 0;

  .main-con {
    width: 100%;
    box-sizing: border-box;
    padding: 0 20px;
    border-radius: 8px 8px 0 0;
    overflow: hidden;

    .table-data-list {
      /deep/ .cell {
        padding: 0 5px;
      }

      /deep/ .el-table__row:nth-child(2n) {
        background: #fff;
      }

      /deep/ .el-table__row:nth-child(2n + 1) {
        background: #f4f5f7;
      }

      /deep/ .el-table__body-wrapper {
        height: calc(100vh - 478px) !important;
      }

      /deep/ .el-table__body-wrapper.is-scrolling-left {
        overflow-x: hidden;
      }
    }

    .search-default {
      height: calc(100vh - 354px);
    }
  }
}

.search-default {
  background: #fff;
  display: flex;
  justify-content: center;
  height: calc(100vh - 300px);
}
</style>
