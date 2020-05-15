<template>
  <div class="gm-service-box">
    <div class="top">
      <el-button
        class="normal_pink_btn normal_red_btn"
        size="medium"
        v-if="checkHasBtnPermission('/shop-inner/service-add', 'path')"
        @click="$router.push('/shop-inner/service-add')"
      >新增服务</el-button>
      <span v-if="!checkHasBtnPermission('/shop-inner/service-add', 'path')"></span>
      <input-search v-model="keyword" @search="getServiceListByMultiFilter()" placeholder="请输入服务名称"></input-search>
    </div>
    <div id="gm_service_list" class="margin_main">
      <!-- 筛选条件 -->
      <div class="service_list_condition">
        <div class="service-filters-box">
          <el-form ref="form" class="left-area" :model="searchData" label-width="84px">
            <div class="select_condition">
              <separate-button-groups
                name="name"
                count="serviceTagCount"
                :list="serviceTagInfos"
                label="id"
                v-model="searchData.tag"
                @change="
                  () => {
                    pages.currentPage = 1;
                    getServiceListByMultiFilter();
                  }
                "
              ></separate-button-groups>
              <el-collapse-transition>
                <div class="second-line">
                  <el-form-item class="single-input" label="服务分类：" prop="serviceSortId">
                    <el-cascader
                      v-model="searchData.serviceSortId"
                      :options="classifications"
                      :props="{
                        expandTrigger: 'hover',
                        label: 'sortName',
                        value: 'jimeiClassId',
                        children: 'sortTwo'
                      }"
                      @change="modifySort = true"
                    ></el-cascader>
                  </el-form-item>
                  <div class="three-section">
                    <el-form-item label="产品价格：" prop="priceFrom" class="left-input">
                      <number-input width="60px" v-model="searchData.priceFrom"></number-input>
                    </el-form-item>
                    <span class="span">至</span>
                    <el-form-item prop="priceTo" label-width="10px" class="right-input">
                      <number-input width="60px" v-model="searchData.priceTo"></number-input>
                    </el-form-item>
                  </div>
                  <div class="three-section">
                    <el-form-item label="累计销量：" prop="salesVolumeFrom" class="left-input">
                      <number-input width="60px" v-model="searchData.salesVolumeFrom"></number-input>
                    </el-form-item>
                    <span class="span">至</span>
                    <el-form-item prop="salesVolumeTo" label-width="10px" class="right-input">
                      <number-input width="60px" v-model="searchData.salesVolumeTo"></number-input>
                    </el-form-item>
                  </div>
                  <el-form-item class="single-input" label="评价得分：" prop="evaluationScore">
                    <el-select v-model="searchData.evaluationScore">
                      <el-option
                        v-for="(item, index) in evaluationScore"
                        :key="index"
                        :label="item.range"
                        :value="item.mark"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-collapse-transition>
            </div>
          </el-form>
          <div class="right-area">
            <div class="clear-filters" @click="resetForm">清空条件</div>
            <el-tooltip
              class="item"
              effect="dark"
              content="模板仅支持分类查询"
              placement="top"
              v-if="fromBrand"
            >
              <div class="filter-btn" @click="getServiceListByMultiFilter">查询</div>
            </el-tooltip>
            <div class="filter-btn" @click="getServiceListByMultiFilter" v-else>查询</div>
          </div>
        </div>
      </div>
      <div
        class="user-defined-tab container-normal-list"
        style="margin-top:20px;"
        v-loading="tableLoading"
      >
        <el-tabs type="card" v-model="searchData.serviceType" @tab-click="tabClick">
          <el-tab-pane
            v-for="(item, index) in selectStatus"
            :key="index"
            :label="item.value"
            :name="item.code"
          ></el-tab-pane>
        </el-tabs>
        <div class="main-con">
          <div v-if="initTotal === 0 && !fromBrand || pages.totalCount !== 0">
            <el-checkbox-group v-model="checkArr" @change="handleChecked">
              <el-table
                :data="tableData"
                tooltip-effect="dark"
                stripe
                style="width: 100%"
                class="table-data-list"
                height="calc(100vh - 389px)"
              >
                <el-table-column
                  align="right"
                  label="排序"
                  width="90"
                  v-if="
                    checkHasBtnPermission('shop_goods_service_tableButtons') &&
                      !fromBrand
                  "
                >
                  <template slot-scope="scope">
                    <div class="sort-area">
                      <el-checkbox :label="scope.row.serviceId" class="check_single"></el-checkbox>
                      <number-input
                        style="margin-left:10px"
                        @blur="changeNO(scope.row.serviceId, scope.row.orderNo)"
                        v-model.number="scope.row.orderNo"
                        :max="9999"
                      ></number-input>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column width="250" label="服务项目">
                  <template slot-scope="scope">
                    <div class="service-message">
                      <div
                        class="image-box"
                        @click="fromBrand ? toTemplateDetail(scope.row) : toEditServer(scope.row.serviceId, true)"
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
                          class="text"
                          @click="fromBrand ? toTemplateDetail(scope.row) : toEditServer(scope.row.serviceId, true)"
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
                        <div
                          class="tags"
                          :title="
                            (scope.row.tags || [])
                              .map(item => item.name)
                              .join('/')
                          "
                        >
                          <span>
                            {{
                            (scope.row.tags || [])
                            .map(item => item.name)
                            .join("/")
                            }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="服务时长">
                  <template slot-scope="scope">{{ scope.row.serviceTime || 0 }}分钟</template>
                </el-table-column>
                <el-table-column label="门店价">
                  <template slot-scope="scope">
                    <span class="price">
                      ¥{{
                      utils.formatPrice(
                      scope.row.minPrice,
                      scope.row.maxPrice
                      )
                      }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="销量" v-if="!fromBrand">
                  <template slot-scope="scope">
                    {{
                    scope.row.saleCount || 0
                    }}
                  </template>
                </el-table-column>
                <el-table-column label="上架时间" prop="shelvesDate">
                  <template slot-scope="scope">
                    <p>{{ scope.row.shelvesDate }}</p>
                  </template>
                </el-table-column>
                <el-table-column label="状态" v-if="!fromBrand">
                  <template slot-scope="scope">
                    <p class="oper_p">
                      <status-text
                        :name="scope.row.shelvesStatus ? '已上架' : '未上架'"
                        :type="scope.row.shelvesStatus ? 'green' : 'orange'"
                      ></status-text>
                    </p>
                    <p class="oper_p">
                      <status-text v-show="!scope.row.showStatus" name="未展示" type="grey"></status-text>
                    </p>
                    <p class="oper_p" style="min-width:70px;" v-show="scope.row.recommendStatus">
                      <status-text :name="'首推'" :type="'mred'"></status-text>
                    </p>
                  </template>
                </el-table-column>
                <el-table-column label="促销" v-if="!fromBrand">
                  <template slot-scope="scope">
                    <p v-for="(name, index) in scope.row.promotion" :key="index">{{ name }}</p>
                  </template>
                </el-table-column>
                <el-table-column label="作品数" v-if="!fromBrand">
                  <template slot-scope="scope">
                    {{
                    scope.row.worksCount || 0
                    }}
                  </template>
                </el-table-column>
                <el-table-column label="评分" v-if="!fromBrand">
                  <template slot-scope="scope">
                    {{
                    scope.row.evaluationScore || 0
                    }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  width="220"
                  v-if="
                    checkHasBtnPermission('shop_goods_service_tableButtons') &&
                      checkHasBtnPermission('/shop-inner/service-edit', 'path')
                  "
                >
                  <div slot-scope="scope" class="manage">
                    <!-- 品牌模板独享按钮 -->
                    <g-button
                      v-if="fromBrand"
                      :name="'详情'"
                      type="detail"
                      :icon="'icon_operate_eyes'"
                      @click="toTemplateDetail(scope.row)"
                    ></g-button>
                    <!-- </el-tooltip> -->
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
                    <g-button
                      v-if="
                        searchData.serviceType !== 'DELETED' &&
                          checkHasBtnPermission(
                            '/shop-inner/service-edit',
                            'path'
                          ) &&
                          !fromBrand
                      "
                      :name="'编辑'"
                      type="detail"
                      :icon="'icon_operate_edit'"
                      @click="toEditServer(scope.row.serviceId)"
                    ></g-button>
                    <g-button
                      v-if="
                        searchData.serviceType === 'ON_SHELVE' &&
                          checkHasBtnPermission(
                            'shop_goods_service_tableButtons'
                          )
                      "
                      :name="'虚拟'"
                      :type="'mgreen'"
                      :icon="'icon_operate_fictit'"
                      @click="setVirtualNum(scope.row)"
                    ></g-button>
                    <g-button
                      v-if="
                        searchData.serviceType === 'UN_SHELVE' &&
                          checkHasBtnPermission(
                            'shop_goods_service_tableButtons'
                          )
                      "
                      :name="'上架'"
                      :type="'detail'"
                      :icon="'icon_operate_up'"
                      @click="
                        handleShop([scope.row.serviceId], 'serviceOnShelves')
                      "
                    ></g-button>
                    <g-button
                      v-if="
                        searchData.serviceType === 'ON_SHELVE' &&
                          checkHasBtnPermission(
                            'shop_goods_service_tableButtons'
                          )
                      "
                      name="下架"
                      type="cancel"
                      :icon="'icon_operate_down'"
                      @click="
                        handleShop(
                          [Number(scope.row.serviceId)],
                          'serviceOffShelves'
                        )
                      "
                    ></g-button>
                    <g-button
                      v-if="
                        searchData.serviceType === 'UN_SHELVE' &&
                          checkHasBtnPermission(
                            'shop_goods_service_tableButtons'
                          )
                      "
                      :name="'删除'"
                      type="cancel"
                      :icon="'icon_operate_delete'"
                      @click="delServer([Number(scope.row.serviceId)])"
                    ></g-button>
                    <g-button
                      v-if="
                        searchData.serviceType === 'DELETED' &&
                          checkHasBtnPermission(
                            'shop_goods_service_tableButtons'
                          )
                      "
                      name="恢复"
                      type="green"
                      :icon="'icon_operate_recover'"
                      @click="
                        handleShop(
                          [Number(scope.row.serviceId)],
                          'serviceRenew'
                        )
                      "
                    ></g-button>
                    <!-- @click="recoverProduct(scope.row.id)" -->
                  </div>
                </el-table-column>
              </el-table>
            </el-checkbox-group>
            <div class="service-operation">
              <div
                class="manage-buttons"
                v-if="
                  checkHasBtnPermission('shop_goods_service_tableButtons') &&
                    !fromBrand
                "
              >
                <el-checkbox v-model="checkAllFlag" @change="checkAllChange">全选</el-checkbox>
                <add-tags-pop
                  v-if="
                    searchData.serviceType === 'ON_SHELVE' ||
                      searchData.serviceType === 'UN_SHELVE'
                  "
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
                  v-if="searchData.serviceType === 'UN_SHELVE'"
                  :name="'上架'"
                  :type="'recommend'"
                  :icon="'icon_operate_up'"
                  @click="handleShop(checkedIds, 'serviceOnShelves')"
                ></g-button>
                <g-button
                  v-if="searchData.serviceType === 'ON_SHELVE'"
                  name="下架"
                  type="grey"
                  :icon="'icon_operate_down'"
                  @click="handleShop(checkedIds, 'serviceOffShelves')"
                ></g-button>
                <g-button
                  v-if="searchData.serviceType === 'ON_SHELVE'"
                  name="首页推荐"
                  type="recommend"
                  :icon="''"
                  @click="handleShop(checkedIds, 'serviceRecommend')"
                ></g-button>
                <g-button
                  v-if="searchData.serviceType === 'ON_SHELVE'"
                  name="取消推荐"
                  type="grey"
                  :icon="''"
                  @click="handleShop(checkedIds, 'serviceUnrecommend')"
                ></g-button>
                <g-button
                  v-if="searchData.serviceType === 'ON_SHELVE'"
                  name="网店展示"
                  type="recommend"
                  :icon="''"
                  @click="handleShop(checkedIds, 'serviceShowInShop')"
                ></g-button>
                <g-button
                  v-if="searchData.serviceType === 'ON_SHELVE'"
                  name="网店隐藏"
                  type="grey"
                  :icon="''"
                  @click="handleShop(checkedIds, 'serviceUnshowInShop')"
                ></g-button>
                <g-button
                  v-if="
                    searchData.serviceType !== 'DELETED' &&
                      searchData.serviceType !== 'ON_SHELVE'
                  "
                  :name="'删除'"
                  type="delete"
                  :icon="'icon_operate_delete'"
                  @click="delServer(checkedIds)"
                ></g-button>
                <g-button
                  v-if="searchData.serviceType === 'DELETED'"
                  name="恢复"
                  type="greenFill"
                  :icon="'icon_operate_recover'"
                  @click="handleShop(checkedIds, 'serviceRenew')"
                ></g-button>
              </div>
              <div
                v-if="
                  !checkHasBtnPermission('shop_goods_service_tableButtons') ||
                    fromBrand
                "
              ></div>
              <el-pagination
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
            v-if="initTotal !== 0 && pages.totalCount === 0 || fromBrand && pages.totalCount === 0"
            @clear-back="resetForm"
          ></search-default>
        </div>
      </div>

      <!-- 设置虚拟销量  弹窗-->
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
            :min="0"
            :max="100000"
            width="200px"
            placeholder="请输入虚拟销量"
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
    </div>
  </div>
</template>

<script>
import * as api from "@/assets/js/interface";
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import MyDialog from "@/components/commonModal/modal/dialog";
import SubHeader from "@/components/common/SubHeader";
import InputFromTo from "@/components/goodsManagement/InputFromTo";
import addTagsPop from "@/components/common/addTagsPop";
import "@/assets/css/tab.scss";
import { mapActions } from "vuex";
import { Base64 } from "js-base64";

export default {
  name: "GmServiceList",
  components: {
    "my-dialog": MyDialog,
    "sub-header": SubHeader,
    "input-from-to": InputFromTo,
    "add-tags-pop": addTagsPop
  },
  data() {
    return {
      utils,
      keyword: "",
      tableLoading: true,
      delTagDialogVisible: false,
      formatPicImage: utils.formatPicImage, // 有尺寸的图片处理
      formLabelWidth: "120px",
      tagToDelId: [],
      classifications: [],
      evaluationScore: [
        // 这里组件的mark只能取字符串否则报错
        { range: "0-3", mark: "03" },
        { range: "3-4", mark: "34" },
        { range: "4-5", mark: "45" }
      ],
      categoryForm: {
        firstCategory: "",
        secondCategory: "",
        firstCategoryList: []
      },
      newCategory: "",
      dialogVisibleSetVirtual: false,
      virtualNum: 0,
      dialogVisibleMakeTag: false,
      checkedTags: [],
      checkAllFlag: false,
      checkArr: [],
      isCheckedAll: false,
      CheckedAllArr: [],
      searchData: {
        tag: -3, // 系统标签
        serviceSortId: [], // 服务来源
        evaluationScore: [null, null], // 评价得分
        serviceType: "ON_SHELVE", //服务类型
        priceFrom: null,
        priceTo: null,
        salesVolumeFrom: null,
        salesVolumeTo: null
      },
      selectStatus: [
        { code: "ON_SHELVE", value: "已上架" },
        { code: "UN_SHELVE", value: "未上架" },
        { code: "DRAFT", value: "草稿箱" },
        { code: "DELETED", value: "已删除" },
        { code: "fromBrand", value: "总部模板" }
      ],
      pages: {
        currentPage: 1, // 当前页面
        totalCount: 0, // 总页面
        pageSize: 10, // 每页的条数
        pageNum: 5, // 默认显示页面的下标数量
        serviceId: null // 当前的服务id
      },
      tableData: [],
      btnType: "", // 正在操作的按钮类型
      availableTags: {
        platformServiceTagInfos: [],
        storeServiceTagInfos: []
      },
      selectedAvailableTags: [],
      addNewTag: "",
      addNewTagPopVisible: false,
      serviceTagInfos: [],
      delIdsList: [],
      initTotal: 0,
      modelName: "",
      modelInfo: {
        title: null,
        content: null,
        icon: null,
        iconColor: null
      },
      fromBrand: false
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
    getServiceParams() {
      let score = this.searchData.evaluationScore;
      return {
        assistantScore: this.formattingParam(score[0], score[1]),
        currentPage: this.pages.currentPage - 1,
        keyword: this.keyword,
        pageSize: this.pages.pageSize,
        price: this.formattingParam(
          this.searchData.priceFrom,
          this.searchData.priceTo
        ),
        saleCount: this.formattingParam(
          this.searchData.salesVolumeFrom,
          this.searchData.salesVolumeTo
        ),
        sortOne: this.searchData.serviceSortId[0],
        sortTwo: this.searchData.serviceSortId[1],
        storeId: this.currentInfo.shopId,
        tabCondition: this.searchData.serviceType,
        tag: this.searchData.tag
      };
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions([
      "saveOperate",
      "saveCurrentInfo",
      "serviceId",
      "serviceTemplateId"
    ]),
    init() {
      this.getServiceSortLevelOneList();
      this.getServiceTagCountInfoByStoreId();
      this.getServiceListByMultiFilter();
      this.clearAway();
    },
    formattingParam(from, to) {
      let param;
      if (from && to) {
        param = {
          from: from,
          to: to
        };
      } else if (!from && !to) {
        param = null;
      } else if (from && !to) {
        param = {
          from: from,
          to: 10000000
        };
      } else if (!from && to) {
        param = {
          from: 0,
          to: to
        };
      }
      return param;
    },
    getCountInfo() {
      this.getServiceTagCountInfoByStoreId();
      this.clearAway();
    },
    getServiceSortLevelOneList() {
      axios
        .get(`/getServiceSortListByBrandId/${this.currentInfo.brandId}`)
        .then(response => {
          axios
            .post(`/getStoreSortInfoWithFilter`, {
              brandId: this.currentInfo.brandId,
              sortName: ""
            })
            .then(res => {
              // this.classifications = res.sortInfos;
              res.sortInfos.forEach(item => {
                response.sortInfos.forEach(i => {
                  if (i.jimeiClassId == item.jimeiClassId) {
                    i.sortName = item.sortName || item.name;
                    item.sortTwo.forEach(element => {
                      i.sortTwo.forEach(e => {
                        if (e.jimeiClassId == element.jimeiClassId) {
                          e.sortName = element.sortName || element.name;
                        }
                      });
                    });
                  }
                });
              });
              this.classifications = response.sortInfos;
            });
        });
    },
    getServiceTagCountInfoByStoreId() {
      axios
        .get("/getServiceTagCountInfoByStoreId/" + this.currentInfo.shopId)
        .then(res => {
          this.serviceTagInfos = res.serviceTagInfos;
        });
    },
    toEditServer(serviceId, ignore) {
      if (ignore) {
        window.open(
          "#/shop-inner/service-detail?serviceId=" + Base64.encode(serviceId),
          "_blank"
        );
        return;
      }
      if (this.searchData.serviceType === "ON_SHELVE") {
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
      this.serviceId(Number(serviceId));
      this.$router.push("/shop-inner/service-edit");
    },
    checkHasServerId(serviceIds) {
      if (!serviceIds.length) {
        // 提示
        utils.showTip(this, {
          msg: "请先选择所要操作的服务项目",
          type: "error"
        });
        return false;
      }
      return true;
    },
    makeTag() {
      if (!this.checkHasServerId(this.checkedIds)) return;
      this.getStoreServiceTags();
    },
    getStoreServiceTags() {
      axios.get("/getStoreServiceTags/" + this.currentInfo.shopId).then(res => {
        this.availableTags = res;
        this.addNewTagPopVisible = true;
        let checkIds = this.checkArr;
        let tagIds = utils.publicIdsIn2dArray(
          this.tableData
            .filter(item => checkIds.includes(item.serviceId))
            .map(item => {
              let ids = (item.tags || []).map(i => i.id);
              return ids;
            })
        );
        this.$nextTick(() => {
          this.$refs.addTag.statisticsSelectedTagIds(tagIds);
        });
      });
    },
    handleShop(serviceIds, service) {
      if (!this.checkHasServerId(serviceIds)) return;
      this.btnType = service;
      this.tableLoading = true;
      if (service === "serviceShowInShop") {
        let checkedGoods = this.tableData.filter(item => {
          return serviceIds.includes(item.serviceId);
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
      axios.post(api[service].URL, { serviceId: serviceIds }).then(res => {
        this.handleShopRes(res);
      });
    },
    handleShopRes(res) {
      if (res.success) {
        this.init();
        this.$message({ type: "success", message: res.message });
      } else {
        this.$message({ type: "warning", message: res.message });
        this.tableLoading = false;
      }
    },
    delServer(serviceId) {
      if (!serviceId.length) {
        utils.showTip(this, { msg: "请先选择要操作的服务项目", type: "error" });
        return;
      }
      this.modelInfo = {
        title: "确定要删除吗",
        content: "删除后，用户端商城及门店前台将不再出现该项服务",
        icon: "icon_popup_question",
        iconColor: "#FF6D61"
      };
      this.modelName = "delService";
      this.delTagDialogVisible = true;
      this.delIdsList = serviceId;
    },
    getServiceListByMultiFilter() {
      // 区分是否点击了 品牌模板 tag
      let params = !this.fromBrand
        ? this.getServiceParams
        : {
            brandId: this.currentInfo.brandId,
            deleted: false,
            keyword: this.keyword,
            pageNum: this.pages.currentPage,
            pageSize: this.pages.pageSize,
            sortOne: this.searchData.serviceSortId[0],
            sortTwo: this.searchData.serviceSortId[1]
          };
      let url = this.fromBrand
        ? "/getServiceTemplateByBrandId"
        : "/getServiceListByMultiFilter";
      this.tableLoading = true;
      setTimeout(() => {
        axios.post(url, params).then(res => {
          this.getServiceListRes(res);
        });
      }, 320);
    },
    getServiceListRes(res) {
      this.pages.totalCount = res.total;
      this.initTotal = res.initTotal ? res.initTotal : 0;
      this.tableData = res.serviceDetailList;
      this.tableLoading = false;
    },
    handleCurrentChange(val) {
      this.pages.currentPage = val;
      this.getServiceListByMultiFilter();
      this.checkAllFlag = false;
      this.checkArr = [];
    },
    handleChecked() {
      this.isCheckedAll = this.checkArr.length == this.tableData.length;
      this.checkAllFlag = this.checkArr.length == this.tableData.length;
    },
    checkAllChange(checked) {
      if (checked) {
        this.tableData.forEach((item, index) => {
          this.checkArr.push(item.serviceId);
        });
      } else {
        this.checkArr = [];
      }
    },
    setVirtualSale() {
      if (isNaN(this.virtualNum)) {
        utils.showTip(this, { msg: "请输入数字", type: "error" });
        return;
      }
      let params = {
        id: this.pages.serviceId,
        virtualSales: this.virtualNum
      };
      axios.post("/virtualSales", params).then(res => {
        this.tableLoading = true;
        this.virtualSalesRes(res);
      });
    },
    virtualSalesRes(res) {
      this.$message({
        type: `${res.success ? "success" : "error"}`,
        message: res.message
      });
      this.getServiceListByMultiFilter();
      this.dialogVisibleSetVirtual = false;
      this.virtualNum = 0;
    },
    setVirtualNum(data) {
      this.pages.serviceId = data.serviceId;
      this.virtualNum = data.virtualSaleCount;
      this.dialogVisibleSetVirtual = true;
    },
    resetForm() {
      this.fromBrand = false;
      this.$refs["form"].resetFields();
      this.keyword = "";
      this.searchData.serviceType = "ON_SHELVE";
      this.getServiceListByMultiFilter();
    },
    changeNO(id, number) {
      this.tableLoading = true;
      axios
        .post("/updateServiceOrderNo", { id: Number(id), number })
        .then(res => {
          this.updateServiceOrderNoRes(res);
        });
    },
    updateServiceOrderNoRes(res) {
      this.$message({ type: "success", message: "设置服务排序编号成功" });
      this.getServiceListByMultiFilter();
    },
    addNewTagFn(addNewTag) {
      axios
        .post("/addServiceTag", {
          name: addNewTag,
          storeId: this.currentInfo.shopId
        })
        .then(res => {
          this.addServiceTagRes(res);
        });
    },
    addServiceTagRes() {
      this.getStoreServiceTags();
      this.getServiceTagCountInfoByStoreId();
      this.addNewTag = "";
    },
    confirmAddTagToService(selectedAvailableTags, previousTagIds) {
      let checkIds = this.checkArr;
      let params = this.tableData
        .filter(item => checkIds.includes(item.serviceId))
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
            id: item.serviceId,
            tagIds: [...new Set(currentIds)]
          };
        });
      axios.post("/batchSetServiceTags", { tagBeans: params }).then(res => {
        this.confirmAddTagToServiceRes(res);
      });
    },
    confirmAddTagToServiceRes(res) {
      this.$message({
        type: res.success ? "success" : "warning",
        message: res.message
      });
      this.addNewTagPopVisible = false;
      this.checkArr = [];
      this.selectedAvailableTags = [];
      this.checkAllFlag = false;
      this.getCountInfo();
      this.getServiceListByMultiFilter();
    },
    modelConfirm() {
      switch (this.modelName) {
        case "tag":
          this.tableLoading = true;
          axios.post("/deleteServiceTag", { id: this.tagToDelId }).then(res => {
            this.deleteServiceTagRes(res);
          });
          break;
        case "delService":
          this.tableLoading = true;
          this.confirmDelProduct(this.delIdsList);
          break;
        default:
          this.delTagDialogVisible = false;
          break;
      }
    },
    delTags(id) {
      this.tagToDelId = id;
      this.modelInfo = {
        title: "确定要删除吗？",
        content: "删除后，所有使用该标签的服务都不再显示该标签，不可恢复。",
        icon: "icon_popup_question",
        iconColor: "#FF6D61"
      };
      this.delTagDialogVisible = true;
      this.modelName = "tag";
      this.getServiceTagCountInfoByStoreId();
    },
    deleteServiceTagRes(res) {
      this.delTagDialogVisible = false;
      this.getStoreServiceTags();
      if (!res.success) {
        this.$message({ type: "warning", message: res.message });
      }
    },
    confirmDelProduct(data) {
      this.tableLoading = true;
      axios.post("/serviceDelete", { serviceId: data }).then(res => {
        this.$message({
          type: `${res.success ? "success" : "warning"}`,
          message: res.message
        });
        this.init();
      });
      this.delTagDialogVisible = false;
    },
    clearAway() {
      this.checkArr = [];
      this.delIdsList = [];
      this.checkAllFlag = false;
    },
    tabClick() {
      this.clearAway();
      this.pages.currentPage = 1;
      this.fromBrand = this.searchData.serviceType === "fromBrand";
      this.getServiceListByMultiFilter();
    },
    // 模板独享详情按钮事件
    toTemplateDetail(row) {
      this.serviceTemplateId(Number(row.serviceId));
      window.open("#/shop-inner/service-detail?fromBrand=true", "_blank");
    },
    // 使用总部模板
    useTemplate(row) {
      this.serviceTemplateId(Number(row.serviceId));
      this.$router.push(`/shop-inner/service-add?fromBrand=true`);
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
        display: inline-block;
        width: 70px;
        font-size: 14px;
        line-height: 54px;
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

  .el-radio-button__inner {
    margin-bottom: 10px;
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
    width: 100%;
    padding: 0 20px;
    margin: 20px 0;
    height: 35px;
    display: flex;
    justify-content: space-between;
  }
}

.color_blue {
  color: #409eff;
}

.color_green {
  color: #67c23a;
}

.color_red {
  color: #e22c37;
}

.check_single {
  margin-left: 5px;
}

.select_condition {
  margin-top: 10px;

  .radio_group {
    min-width: 150px;
    display: flex;
    justify-content: space-between;

    /deep/ .el-form-item__content {
      margin-left: 0 !important;
    }

    .span {
      color: #58c9f3;
      font-size: 12px;
      cursor: pointer;
      margin-right: 10px;
      user-select: none;
      white-space: nowrap;
    }
  }

  .second-line {
    display: flex;
    flex-wrap: wrap;

    /deep/ .el-input--suffix .el-input__inner,
    /deep/ .el-input__inner {
      height: 35px;
    }

    .el-form-item {
      margin: 0 15px 0 0;
    }

    .single-input {
      /deep/ .el-input__inner {
        width: 150px;
      }
    }

    .three-section {
      margin-right: 10px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }
  }
}

.service-operation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0;

  .manage-buttons {
    flex: 1;

    /deep/ .el-checkbox {
      margin-left: 10px;
      margin-right: 15px;
    }
  }
}

.service-message {
  display: flex;

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
    flex: auto;
    display: flex;
    flex-direction: column;
    font-size: 12px;
    width: 100%;
    justify-content: space-between;

    .text {
      line-height: 17px;
      cursor: pointer;

      .ser_name {
        color: #333333;
        font-size: 14px;
      }

      .ser_code {
        color: #999999;
      }

      &:hover {
        .ser_name,
        .ser_code {
          color: #58c9f3;
        }
      }
    }

    .tags {
      color: #999999;
      font-size: 12px;
      line-height: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 170px;
    }
  }
}

.manage {
  border: 1px solid transparent;
  @media screen and (min-width: 1430px) {
    width: 220px;
  }
  @media screen and (max-width: 1430px) {
    width: 180px;
  }
}

.price {
  color: #ff6d61;
}

.oper_p {
  span {
    font-size: 12px;
    cursor: pointer;
    padding: 2px 10px;
    border-radius: 10px;

    &.oper {
      color: #fff;

      &.up {
        background: #a9d86e;
      }

      &.down {
        background: #ff6d61;
      }

      &.order {
        background: #f52d56;
      }

      &.hidden {
        background: #bec3c6;
      }
    }
  }
}

.long {
  width: 60px;
  text-align: right;
  display: inline-block;
}

.oper_p_button {
  min-width: 100px;
}

.add-button {
  margin-top: 5px;
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
  border-radius: 8px 8px 0 0;
  background: #ffffff;

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
        background: #ffffff;
      }

      /deep/ .el-table__row:nth-child(2n + 1) {
        background: #f4f5f7;
      }

      /deep/ .el-table__body-wrapper {
        height: calc(100vh - 437px) !important;
      }
      /deep/ .el-table__body-wrapper.is-scrolling-left {
        overflow-x: hidden;
      }
    }

    .search-default {
      height: calc(100vh - 314px);
    }
  }
}

/deep/ .el-pagination .btn-prev,
/deep/ .el-pagination .btn-next {
  width: 35px;
}
</style>
