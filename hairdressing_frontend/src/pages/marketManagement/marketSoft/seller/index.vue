<template>
  <div class="seller-main">
    <div class="search-line" :style="isTall ? '' : 'margin-bottom: 0px;'">
      <div class="table-title">
        <el-radio-group v-model="componentId">
          <el-radio-button border class="table-btns" label="SellerList">推客列表</el-radio-button>
          <el-radio-button border class="table-btns" label="PromotionGoods">推广商品</el-radio-button>
          <el-radio-button border class="table-btns" label="PromotionStatistics">推广统计</el-radio-button>
          <!-- 该模块暂不开发 -->
          <el-radio-button border class="table-btns" label="Recruit" v-if="false">线上招募</el-radio-button>
          <el-radio-button border class="table-btns" label="Grouping">人员分组</el-radio-button>
          <el-radio-button border class="table-btns" label="Setting">设置</el-radio-button>
        </el-radio-group>
        <el-button
          @click="createSeller"
          class="normal_red_btn"
          v-if="componentId === 'SellerList'"
        >新增推客</el-button>
        <el-button
          @click="createGoods"
          class="normal_red_btn"
          v-if="componentId === 'PromotionGoods'"
        >新增商品</el-button>
        <el-button
          @click="createGroup"
          class="normal_red_btn"
          v-if="componentId === 'Grouping'"
        >新增分组</el-button>
      </div>
      <!-- <div v-if="componentId === 'PromotionStatistics'"></div> -->
      <!-- <div class="search-box"> -->
      <!-- 推客列表搜索匹配 -->
      <input-search
        v-if="componentId === 'SellerList'"
        :placeholder="'搜索推客姓名或手机号'"
        width="auto"
        v-model="sellerform.keyword"
        @search="handleSearch"
      />
      <!-- 推广统计搜索匹配 -->
      <input-search
        v-if="componentId === 'PromotionStatistics'"
        :placeholder="'搜索产品名称或编号'"
        width="auto"
        v-model="sellerform.keyword"
        @search="handleSearchStatistics"
      />
      <!-- </div> -->
    </div>
    <div class="filters-line" :style="!isTall ? 'display: none;' : ''">
      <div class="filters-search" v-if="isTall">
        <el-form :model="sellerform" label-width="85px" class="query-form">
          <el-form-item :label="componentId === 'SellerList' ? '加入时间:' : '推广时间:'">
            <el-date-picker
              v-model="timeRange"
              type="datetimerange"
              clearable
              unlink-panels
              :default-time="['00:00:00', '23:59:59']"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="隶属分组: " v-if="componentId === 'SellerList'">
            <el-select v-model="sellerform.groupId" placeholder="请选择" clearable>
              <el-option
                v-for="item in sellerGroup"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              style="margin-left: -60px;"
              id="retrieval"
              @click="retrieval"
            >检索</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 动态表格组件 sonTabsChange在推广统计组件-->
    <component
      :is="componentId"
      :sellerform="sellerform"
      ref="componentRef"
      @editGroup="editGroup"
      :sellerGroup="sellerGroup"
      @sonTabsChange="sonTabsChange"
    ></component>
    <!-- 新增分组对话框 -->
    <el-dialog
      :title="createGroupTitle"
      :visible.sync="groupDialogVisible"
      width="500px"
      @close="groupClose"
    >
      <el-form :model="groupForm" :rules="groupRules" ref="groupRef" label-width="120px">
        <el-form-item label="分组名称：" prop="name">
          <el-input v-model="groupForm.name" placeholder="请输入分组名称" style="width: 270px;"></el-input>
        </el-form-item>
        <el-form-item label="推广提成比例：" prop="sellPercent">
          <el-input
            v-model.number="groupForm.sellPercent"
            style="width: 180px;"
            placeholder="请输入自然数"
          >
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="邀请提成比例：" prop="invitePercent">
          <el-input
            v-model.number="groupForm.invitePercent"
            style="width: 180px;"
            placeholder="请输入自然数"
          >
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="groupDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmCreateGroup">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增推客对话框 -->
    <el-dialog
      title="新增推客"
      :visible.sync="sellerDialogVisible"
      width="800px"
      @close="sellerClose"
      top="10vh"
    >
      <el-form :model="createSellerForm" :rules="sellerRules" ref="sellerRef">
        <el-table
          :data="createSellerTableData"
          style="width: 100%"
          height="50vh"
          class="create-seller"
          :header-cell-style="headerRowStyle"
        >
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column label="推客手机号" width="180">
            <template slot-scope="scope">
              <el-form-item
                :prop="'createSellerInfoList.' + scope.$index + '.mobile'"
                :rules="{
                  required: true,
                  validator: (rule, value, callback) => {
                    sellerMobileValidator(
                      rule,
                      value,
                      callback,
                      createSellerForm.createSellerInfoList[scope.$index]
                    );
                  },
                  trigger: 'blur'
                }"
              >
                <el-input
                  type="number"
                  style="width: 160px;"
                  placeholder="请输入手机号"
                  v-model.number="createSellerTableData[scope.$index].mobile"
                  class="count-input"
                  size="small"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="推客昵称">
            <template slot-scope="scope">
              <el-form-item
                :prop="'createSellerInfoList.' + scope.$index + '.name'"
                :rules="{ required: true, message: '请输入推客昵称' }"
              >
                <el-input
                  placeholder="请输入昵称"
                  v-model="createSellerTableData[scope.$index].name"
                  class="count-input"
                  size="small"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="邀请人手机号(不填为一级推广员)" width="180">
            <template slot-scope="scope">
              <el-form-item
                :prop="'createSellerInfoList.' + scope.$index + '.parentMobile'"
                :rules="{
                  validator: (rule, value, callback) => {
                    sellerParentMobileValidator(
                      rule,
                      value,
                      callback,
                      createSellerForm.createSellerInfoList[scope.$index]
                    );
                  },
                  trigger: 'blur'
                }"
              >
                <el-input
                  type="number"
                  style="width: 160px;"
                  placeholder="请输入手机号"
                  v-model.number="
                    createSellerTableData[scope.$index].parentMobile
                  "
                  class="count-input"
                  size="small"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="隶属分组">
            <template slot-scope="scope">
              <el-form-item
                :prop="'createSellerInfoList.' + scope.$index + '.groupId'"
                :rules="{ required: true, message: '请为推客选择分组' }"
              >
                <el-select
                  size="small"
                  v-model="createSellerTableData[scope.$index].groupId"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in sellerGroup"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column width="90">
            <template slot-scope="scope">
              <div class="operate-col">
                <i class="el-icon-circle-plus addIcon" @click="addIcon(scope.row, scope.$index)"></i>
                <i
                  class="el-icon-delete-solid deleteIcon"
                  @click="deleteIcon(scope.row, scope.$index)"
                  v-if="createSellerTableData.length > 1"
                ></i>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <!-- 新增推客对话框分页 分页怎么校验数据?不得自己写遍历吗 -->
      <!-- <el-pagination
        @current-change="handleCurrentCreateSeller"
        :current-page="createSellerPage"
        :page-size="5"
        layout="total, prev, pager, next"
        :total="createSellerForm.createSellerInfoList.length"
        class="create-seller-pagination"
      ></el-pagination>-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="sellerDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="confirmCreateSeller"
          :loading="confirmAddSellerBtnLoad"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 未设置提醒 -->
    <g-del-model
      :delTagDialogVisible="confirmSetVisible"
      @confirm="confirmSetVisible = false"
      @close="confirmSetVisible = false"
      title="暂不可进行此操作！"
      content="请先去设置中保存分销设置，再进行此操作！"
      icon="icon_popup_plaint"
      iconColor="#F52D56"
    ></g-del-model>
    <!-- 未设置人员分组提醒 -->
    <g-del-model
      :delTagDialogVisible="confirmSellerVisible"
      @confirm="confirmCreateSeller('noGroup')"
      @close="confirmSellerVisible = false"
      title="暂无人员分组！"
      content="如果继续操作，则自动生成默认分组！"
      icon="icon_popup_success"
      iconColor="#FCB322"
      :confirmButton="'继续'"
      :btnLoad="confirmSellerBtnLoad"
    ></g-del-model>
    <!-- 新增分组成功提示 -->
    <g-del-model
      :delTagDialogVisible="createGroupVisible"
      @confirm="createGroupVisible = false; groupDialogVisible = false;"
      @close="createGroupVisible = false; groupDialogVisible = false;"
      title="新增分组成功！"
      content="注意！该小组提成与奖励方案暂未对推广商品生效，请前往推广商品设置。"
      icon="icon_popup_plaint"
      iconColor="#339933"
      :confirmButton="'确定'"
    ></g-del-model>
  </div>
</template>
<script>
import Grouping from "../seller_shop/grouping";
import PromotionGoods from "../seller_shop/promotionGoods";
import PromotionStatistics from "../seller_shop/promotionStatistics";
import Recruit from "../seller_shop/recruit";
import SellerList from "../seller_shop/sellerList";
import Setting from "../seller_shop/setting";
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils.js";
import { mapActions, mapState } from "vuex";
import { truncate } from "fs";
export default {
  data() {
    return {
      // 加入时间model
      timeRange: [],
      // 推客列表请求数据
      sellerform: {
        pageNum: 1,
        pageSize: 10,
        startTime: null,
        endTime: null,
        keyword: "",
        groupId: null // 分组Id
      },
      // 动态表格组建选中
      componentId: "SellerList",
      // 推客隶属分组数据
      sellerGroup: [],
      // 颈部过滤部分区分标识
      isTall: true,
      // 添加分组对话框开关
      groupDialogVisible: false,
      // 添加分组表单参数
      groupForm: {
        name: "",
        sellPercent: 15,
        invitePercent: 10
      },
      // 添加分组表单规则
      groupRules: {
        name: [{ required: true, message: "请输入分组名称", trigger: "blur" }],
        sellPercent: [
          {
            required: true,
            validator: this.validateSellPercent,
            trigger: "blur"
          }
        ],
        invitePercent: [
          {
            required: true,
            validator: this.validateSellPercent,
            trigger: "blur"
          }
        ]
      },
      // 区分添加、修改分组对话框title
      createGroupTitle: "新增分组",
      // 新增推客-------
      sellerDialogVisible: false, // 对话框标识
      // 新增推客form参数数据
      createSellerForm: {
        createSellerInfoList: [
          { mobile: "", name: "", parentMobile: null, groupId: null }
        ]
      },
      sellerRules: {}, // 新增推客规则
      // 新增推客表格数据
      createSellerTableData: [
        { mobile: "", name: "", parentMobile: null, groupId: null }
      ],
      headerRowStyle: { background: "#f4f5f7" },
      // 新增推客表格当前页码
      createSellerPage: 1,
      // 新增推客-------
      setFlag: false,
      // 未设置分销信息对话框
      confirmSetVisible: false,
      // 未设置分组 添加推客对话框
      confirmSellerVisible: false,
      // 添加推客对话框btn
      confirmSellerBtnLoad: false,
      confirmAddSellerBtnLoad: false,
      // 分组创建完成提示
      createGroupVisible: false
    };
  },
  components: {
    Grouping,
    PromotionGoods,
    PromotionStatistics,
    Recruit,
    SellerList,
    Setting
  },
  created() {
    // 实现页面刷新保留顶部导航信息
    this.componentId =
      this.$route.params.tab ||
      this.$store.state.seller.menuStatus ||
      "SellerList";
    this.getBelongGroup();
    this.verifySet();
  },
  methods: {
    ...mapActions(["saveSellerGroup", "saveSellerMenu", "saveSellerFlag"]),
    // ------------------------- 校验 ------------------------
    // 创建分组里的提成比例校验规则([1-9]?\d|100)$
    validateSellPercent(rule, value, callback) {
      if (!/^(?:[1-9]?\d|100)$/.test(value)) {
        return callback("不小于0，且不大于100的数字");
      } else {
        callback();
      }
    },
    // 创建推客时，推客手机号验证
    sellerMobileValidator(rule, value, callback, row) {
      if (!value) {
        callback("请输入11位的手机号");
        return;
      }
      let data = this.verifySellerMobile(value);
      data.then(res => {
        if (value && value.toString().length === 11) {
          let flag = res.flag;
          if (flag) {
            // 获取品牌客户id和头像
            row.brandCustomerId = res.brandCustomerId;
            row.headPortrait = res.headPortrait;
            row.sex = res.sex;
            callback();
          } else {
            callback(res.msg);
          }
        } else {
          callback("请输入11位的手机号");
        }
      });
    },
    // 创建推客时，推客邀请人手机号验证
    sellerParentMobileValidator(rule, value, callback, row) {
      // return callback();
      if (!value) {
        row.parentSellerId = null;
        return callback();
      }
      let data = this.verifySellerParentMobile(value);
      data.then(res => {
        let flag = res.flag;
        if (flag == true) {
          // 获取邀请人id
          row.parentSellerId = res.sellerId;
          callback();
        } else {
          let err = res.msg ? res.msg : "手机号校验失败，请重新输入";
          callback(err);
        }
      });
    },
    // ------------------------- 校验 ------------------------
    // 获取隶属分组列表
    async getBelongGroup() {
      const res = await axios.post("/getSellerGroupByBrandId", {
        brandId: this.currentInfo.brandId
      });
      //根分组id排序
      res.sellerGroupInfoList.sort(function(a, b) {
        if (a.id < b.id) {
          return -1;
        } else if (a.id == b.id) {
          return 0;
        } else {
          return 1;
        }
      });
      this.sellerGroup = res.sellerGroupInfoList;
      // 将分组信息传入vuex
      this.saveSellerGroup(res.sellerGroupInfoList);
    },
    // 新增推客事件组-------
    // 新增推客对话框
    createSeller() {
      if (!this.setFlag) return (this.confirmSetVisible = true);
      // console.log(this.$store.state.seller.clientFlag)
      // this.saveSellerFlag(!this.$store.state.seller.clientFlag)
      // console.log(this.$store.state.seller.clientFlag)
      // return
      this.sellerDialogVisible = true;
      // 刷新表格
      this.handleCurrentCreateSeller(this.createSellerPage);
    },
    addIcon(row, index) {
      this.createSellerForm.createSellerInfoList.push({
        mobile: null,
        name: "",
        parentMobile: null,
        groupId: null
      });
      // 刷新表格
      this.handleCurrentCreateSeller(this.createSellerPage);
    },
    deleteIcon(row, index) {
      // 根据索引删除数组元素
      this.createSellerForm.createSellerInfoList.splice(
        // 分页准确点击清除
        // index + (this.createSellerPage - 1) * 5, // 分页
        index, // 不分页
        1
      );
      // 刷新表格
      this.handleCurrentCreateSeller(this.createSellerPage);
    },
    // 每页显示数量
    showNum(father = [], son = [], num = Number) {
      son = father.slice(5 * num, 5 * (num - 1 + 2));
      return son;
    },
    // 分页
    handleCurrentCreateSeller(index) {
      this.createSellerPage = index;
      // 分页的
      // this.createSellerTableData = this.showNum(
      //   this.createSellerForm.createSellerInfoList,
      //   this.createSellerTableData,
      //   index - 1
      // );
      // 不分页的
      this.createSellerTableData = this.createSellerForm.createSellerInfoList;
    },
    // 对话框关闭事件
    sellerClose() {
      // 表单校验还原
      this.$refs.sellerRef.resetFields();
      // 数据还原
      this.createSellerTableData = [
        {
          mobile: null,
          name: "",
          parentMobile: null,
          groupId: null
        }
      ];
      this.createSellerForm.createSellerInfoList = [
        {
          mobile: null,
          name: "",
          parentMobile: null,
          groupId: null
        }
      ];
    },
    // 校验推客手机号事件
    async verifySellerMobile(mobile) {
      const res = await axios.post("/checkSellerMobile", {
        brandId: this.currentInfo.brandId,
        mobile
      });
      if (res.success) {
        return {
          flag: true,
          brandCustomerId: res.brandCustomerId,
          headPortrait: res.headPortrait,
          sex: res.sex
        };
      } else {
        return {
          flag: false,
          msg: res.message
        };
      }
    },

    // 校验推客邀请人手机号事件
    async verifySellerParentMobile(mobile) {
      const res = await axios.post("/checkParentMobile", {
        brandId: this.currentInfo.brandId,
        parentMobile: mobile
      });
      if (res.success) {
        return {
          flag: true,
          sellerId: res.sellerId
        };
      } else {
        return {
          flag: false,
          msg: res.message
        };
      }
    },
    // 新增推客确认事件
    async confirmCreateSeller(type) {
      // 预校验之前是没有分组，创建默认分组的逻辑
      if (type == "noGroup") {
        this.confirmSellerBtnLoad = true;
        axios
          .post("/createOrUpdateSellerGroup", {
            brandId: this.currentInfo.brandId,
            deleted: false,
            invitePercent: 0,
            name: "默认分组",
            sellPercent: 0
          })
          .then(async res => {
            await this.getBelongGroup();
            this.confirmSellerVisible = false;
            this.confirmSellerBtnLoad = false;
          })
          .catch(() => {
            this.confirmSellerBtnLoad = false;
          });
        return;
      }
      if (this.sellerGroup.length == 0) {
        return (this.confirmSellerVisible = true);
      }
      // 表单预校验
      this.$refs.sellerRef.validate(async valid => {
        if (!valid) return;
        // 参数补全 //
        this.createSellerForm.createSellerInfoList.forEach(item => {
          item.brandId = this.currentInfo.brandId;
        });
        this.confirmAddSellerBtnLoad = true;
        axios
          .post("/batchCreateSeller", this.createSellerForm)
          .then(res => {
            if (!res.success || res.status === 500)
              return this.$message.error("新增推客失败");
            this.$message.success("新增推客成功");
            this.sellerDialogVisible = false;
            // 调用子组件事件刷新数据
            this.$refs.componentRef.getSellerList();
          })
          .catch(() => {
            this.confirmAddSellerBtnLoad = false;
          });
      });
    },
    // 新增推客事件组-------
    // 新增商品事件组-------
    // 新增商品
    createGoods() {
      if (!this.setFlag) return (this.confirmSetVisible = true);
      this.$router.push("/shop-inner/promotion-commission/goods-add");
    },
    // 新增商品事件组-------
    // 新增分组对话框显示
    createGroup() {
      if (!this.setFlag) return (this.confirmSetVisible = true);
      // 清空数据
      this.groupForm.name = "";
      this.groupForm.sellPercent = "";
      this.groupForm.invitePercent = "";
      this.createGroupTitle = "新增分组";
      this.groupDialogVisible = true;
    },
    // 新增分组对话关闭事件
    groupClose() {
      this.$refs.groupRef.resetFields();
    },
    // 确认新增/修改分组
    confirmCreateGroup() {
      this.$refs.groupRef.validate(async valid => {
        if (!valid) return;
        let params =
          this.createGroupTitle === "新增分组"
            ? {
                ...this.groupForm,
                brandId: this.currentInfo.brandId,
                deleted: false, // 新增/修改传false
                id: null // 新增不传
              }
            : this.groupForm;
        const res = await axios.post(`/createOrUpdateSellerGroup`, params);
        if (params.id) {
          if (res.success) {
            this.$message.success("修改分组成功");
            // 调用子组件的方法刷新数据
            this.$refs.componentRef.getGroupList();
            this.groupDialogVisible = false;
          } else {
            this.$message.error("修改分组失败");
          }
        } else {
          if (res.success) {
            this.createGroupVisible = true;
            // 调用子组件的方法刷新数据
            this.$refs.componentRef.getGroupList();
            setTimeout(() => {
              this.groupDialogVisible = false;
            }, 0);
          } else {
            this.$message.error("新增分组失败");
          }
        }
      });
    },
    // 编辑分组信息
    editGroup(data) {
      this.createGroupTitle = "编辑分组";
      this.groupDialogVisible = true;
      this.groupForm = data;
    },
    // 检索
    retrieval() {
      if (this.timeRange && this.timeRange.length > 1) {
        this.sellerform.startTime = this.timeRange[0];
        this.sellerform.endTime = this.timeRange[1];
      } else {
        this.sellerform.startTime = null;
        this.sellerform.endTime = null;
      }
      if (this.componentId === "SellerList") {
        // 调用列表子组件事件
        this.$refs.componentRef.getSellerList(this.sellerform);
      } else {
        // 传入第二个字段 /这里没用组件传值监听 利用time和key进行区分
        this.$refs.componentRef.callSonEvent(this.sellerform, "time");
      }
    },
    // 搜索
    handleSearch(val) {
      // 调用列表子组件事件
      this.$refs.componentRef.getSellerList(this.sellerform);
    },
    // 推广统计搜索
    handleSearchStatistics(val) {
      // 调用列表子组件事件
      this.$refs.componentRef.callSonEvent(this.sellerform, "key");
    },
    sonTabsChange() {
      this.sellerform.keyword = "";
      this.$nextTick(() => {
        console.log(1)
        this.$refs.componentRef.callSonEvent(this.sellerform, "time");
      })
    },
    // 校验是否设置过分销信息
    async verifySet() {
      const res = await axios.post("/getSellSettingByBrandId", {
        brandId: this.currentInfo.brandId
      });
      this.setFlag = !!res.defineSellerName;
    }
  },
  watch: {
    async componentId(val) {
      // 如果没有设置过分销规则，则不让实现一系列功能
      if (val !== "Setting" && val !== "PromotionStatistics") {
        this.verifySet();
      }
      if (val === "Setting" || val === "Grouping" || val === "PromotionGoods") {
        this.isTall = false;
      } else {
        this.isTall = true;
      }
      // 清空搜索框的值
      this.sellerform.keyword = "";
      // 回到推客列表页的时候， 重新获取所有分组信息
      if (val === "SellerList") {
        this.timeRange = []
        this.sellerform.startTime = null
        this.sellerform.endTime = null
      }
      // 将导航信息存入vuex
      this.saveSellerMenu(val);
      if (val == "PromotionStatistics") {
        // 商品统计页面，默认获取当月时间的数据
        let paramsDate = new Date();
        let paramsDateYear = paramsDate.getFullYear();
        let paramsDateMonth = paramsDate.getMonth() + 1;
        let paramsDateDay = utils.formatDateMonthDay(
          paramsDateYear,
          paramsDateMonth
        );
        paramsDateMonth =
          (paramsDateMonth + "").length == 1
            ? `0${paramsDateMonth}`
            : paramsDateMonth;
        // 获取该月的天数
        this.timeRange = [
          `${paramsDateYear}-${paramsDateMonth}-01 00:00:00`,
          `${paramsDateYear}-${paramsDateMonth}-${paramsDateDay} 23:59:59`
        ];
        // 调用检索
        this.$nextTick(() => {
          this.retrieval()
        })
      }
    }
  },
  destroyed() {
    // 离开页面时，将数据重置
    this.saveSellerMenu("SellerList");
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
.seller-main {
  width: calc(100vw - 221px);
  min-height: calc(100vh - 75px);
  display: flex;
  align-content: center;
  flex-direction: column;
}
.search-line {
  height: 35px;
  width: 100%;
  display: flex;
  // 主轴对齐
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  .search-box {
    width: 280px;
    display: flex;
    // 主轴对齐
    justify-content: flex-end;
    // 交叉轴对齐
    align-items: center;
  }
  .table-title {
    display: flex;
    justify-content: center;
    align-items: center;
    .normal_red_btn {
      padding: 9.5px 16px;
      margin-left: 20px;
    }
  }
}
.filters-line {
  // margin-top: 15px;
  height: 76px;
  width: 100%;
  background: #fff;
  box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  .filters-search {
    .query-form {
      display: flex;
      align-items: center;
      /deep/ .el-form-item {
        margin-bottom: 0;
      }
    }
  }
}

/deep/ .create-seller {
  .el-table__row td .el-form-item {
    margin-top: 22px;
    padding-bottom: 8px;
  }
}

.addIcon {
  font-size: 20px;
  cursor: pointer;
  line-height: 20px;
  vertical-align: -24%;
  // margin-left: 30px;
}

.deleteIcon {
  font-size: 20px;
  cursor: pointer;
  line-height: 20px;
  vertical-align: -24%;
  // margin-left: 50px;
}
.deleteIcon:hover {
  color: red;
}
.addIcon:hover {
  color: #409eff;
}

.create-seller-pagination {
  margin-top: 20px;
}
.operate-col {
  display: flex;
  justify-content: space-between;
  padding: 10px;
}
</style>
