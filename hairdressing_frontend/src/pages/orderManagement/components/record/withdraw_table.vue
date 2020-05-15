<template>
  <div class="withdraw-box">
    <el-table
      :data="tableData"
      stripe
      style="width: 100%"
      height="calc(100vh - 389px)"
      v-loading="loading"
    >
      <el-table-column prop="createTime" label="申请时间"></el-table-column>
      <el-table-column prop="username" label="客户姓名"></el-table-column>
      <el-table-column prop="mobile" label="手机号" width="128"></el-table-column>
      <el-table-column label="申请提现金额">
        <template slot-scope="scope">
          <p>￥{{ scope.row.cashAmount.toFixed(2) }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="transferTime" label="转账时间"></el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <p v-if="scope.row.status == 1" class="dispose">
            <el-tag type="warning">待处理</el-tag>
          </p>
          <p v-if="scope.row.status == 2" class="reject">
            <el-tag type="warning">已拒绝</el-tag>
          </p>
          <p v-if="scope.row.status == 3" class="trans">
            <el-tag type="warning">已转账</el-tag>
          </p>
          <p v-if="scope.row.status == 4" class="cancel">
            <el-tag type="warning">已取消</el-tag>
          </p>
          <p v-if="scope.row.status == 5" class="modify">
            <el-tag type="warning">修改中</el-tag>
          </p>
        </template>
      </el-table-column>
      <el-table-column prop="transferUsername" label="操作人" width="120">
        <template slot-scope="{ row }">
          <div class="operation-person">
            <p class="operation-name">{{row.transferUsername}}</p>
          <p class="operation-shop">{{row.storeName}}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240">
        <template slot-scope="scope">
          <el-button
            @click="handleClick(scope.row.id)"
            type="text"
            class="normal_green_btn stylebtn"
            size="small"
          >查看进度</el-button>
          <el-button
            type="text"
            size="small"
            class="normal_red_btn stylebtn"
            @click="handleClickTrans(scope.row)"
            v-if="scope.row.status == 1"
          >转账</el-button>
          <el-button
            type="text"
            size="small"
            plain
            class="plain_pink_btn stylebtn"
            v-if="scope.row.status == 1"
            @click="handleClickReject(scope.row)"
          >拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <div class="pagination">
      <div></div>
      <div>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="filterData.pageNum"
          :page-size="filterData.pageSize"
          :pager-count="5"
          layout="total, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <!-- 进度详情对话框 -->
    <el-dialog title="查看进度" :visible.sync="planDialogVisible" width="580px" v-if="planData.length">
      <div class="box-card">
        <div class="box-card-item">
          <div class="timeLine"></div>
          <i class="el-icon-circle-check" style="color: #4A9546"></i>
          <p class="textTitle">客户提交申请</p>
          <p class="textInfo">
            <span>申请提现金额：{{ carryMonry() }}</span>
            <span>{{ carryMonryTime() }}</span>
          </p>
        </div>
        <!-- /* <div>
            <i class="el-icon-circle-check" style="color: #4A9546"></i>
          <p class="textTitle">
            你的申请单已受理，待商家审核中
          </p>
          <p class="textInfo">
            <span>{{carryMonryTime()}}</span>
          </p>
        </div> */-->
        <div class="box-card-item" v-if="planData.length == 2 && planData[1].type == 4">
          <div class="timeLine"></div>
          <i class="el-icon-remove" style="color: #F5A623"></i>
          <p class="textTitle">客户取消了提现操作</p>
        </div>
        <div class="box-card-item" v-if="planData.length == 3 && planData[1].type == 5">
          <div class="timeLine"></div>
          <i class="el-icon-circle-plus-outline" style="color: blue"></i>
          <p class="textTitle">客户修改提现申请</p>
          <p class="textInfo">
            <span>修改提现金额：{{ carryMonry("modify") }}</span>
            <span>{{ carryMonryTime("modify") }}</span>
          </p>
        </div>
        <div class="box-card-item" v-if="planData.length == 2 && planData[1].type == 2">
          <div class="timeLine"></div>
          <i class="el-icon-remove" style="color: #F19E3A"></i>
          <p class="textTitle">申请单被商家拒绝</p>
          <p class="textInfo">
            <span>拒绝理由：{{ rejectReason() }}</span>
            <span>{{ rejectTime() }}</span>
          </p>
        </div>
        <div class="box-card-item" v-if="planData.length == 2 && planData[1].type == 5">
          <div class="timeLine"></div>
          <i class="el-icon-circle-check" style="color: #4A9546"></i>
          <p class="textTitle">客户修改提现申请</p>
        </div>
        <!-- /* <div v-if="planData.length == 2 && planData[1].type == 5">
            <i class="el-icon-circle-check" style="color: #4A9546"></i>
          <p class="textTitle">
            你的申请单已受理，待商家审核中
          </p>
        </div> */-->
        <div class="box-card-item" v-if="planData.length == 3 && planData[1].type == 4">
          <div class="timeLine"></div>
          <i class="el-icon-remove" style="color: #F5A623"></i>
          <p class="textTitle">客户取消了提现操作</p>
        </div>
        <div class="box-card-item" v-if="planData.length == 3 && planData[2].type == 2">
          <div :class="{'timeLine': true, 'line-none': judgeLine}"></div>
          <i class="el-icon-remove" style="color: #F19E3A"></i>
          <p class="textTitle">申请单被商家拒绝</p>
          <p class="textInfo">
            <span>拒绝理由：{{ rejectReason() }}</span>
            <span>{{ rejectTime() }}</span>
          </p>
        </div>
        <!-- /* <div v-if="transPass">
            <i class="el-icon-circle-check" style="color: #4A9546"></i>
          <p class="textTitle">
            商家已转账
          </p>
          <p class="textInfo">
            <span>转账金额：{{transMoney()}}</span>
            <span>
              转账凭据：
              <span>
                <img :src="utils.formatPicImg(transProof())" alt />
              </span>
            </span>
          </p>
        </div> */-->
        <div class="box-card-item" v-if="planData.length == 3 && planData[1].type == 4">
          <div class="timeLine"></div>
          <i class="el-icon-remove" style="color: #F5A623"></i>
          <p class="textTitle">客户取消了提现操作</p>
        </div>
        <div class="box-card-item" v-if="transPass">
          <div class="timeLine"></div>
          <i class="el-icon-circle-check" style="color: #4A9546"></i>
          <p class="textTitle">商家已转账</p>
          <p class="textInfo">
            <span>转账金额：{{ transMoney() }}</span>
            <span>{{ transTime() }}</span>
          </p>
          <section class="textImg">
            <section class="imgBox">
              转账凭据：
              <span>
                <img :src="utils.formatPicImg(transProof())" alt />
              </span>
            </section>
            <section class="imgBox" style="margin-top: 10px;">
              备注：{{ planData[planData.length - 1].remark || '无' }}
            </section>
          </section>
        </div>
      </div>
    </el-dialog>
    <!-- 转账对话框 -->
    <el-dialog title="提现转账" :visible.sync="transDialogVisible" width="500px" @close="transClose">
      <el-form label-width="120px" :model="transForm">
        <el-form-item label="转账金额：">
          <el-input style="width: 180px;" v-model="transForm.cashAmount" disabled>
            <template slot="append">
              元
            </template>
          </el-input>
        </el-form-item>
        <br />
        <el-form-item label="转账凭据：" class="upload-img">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :headers="myHeaders"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="transForm.photo" :src="utils.formatPicImg(transForm.photo)" class="avatar" />
            <i class="icon iconfont icon-icon_num_add"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input style="width: 230px;" v-model="queryTrans.remark" type="textarea" placeholder="最多不超过60个字" :max="60"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="transDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleTransMoney">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 拒绝对话框 -->
    <el-dialog title="拒绝" :visible.sync="rejectDialogVisible" width="400px" @close="rejectClose">
      <el-form label-width="80px" :model="rejectForm" ref="rejectFormRef" :rules="rejectFormRules">
        <el-form-item label="拒绝理由" prop="reason">
          <el-input v-model="rejectForm.reason" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rejectDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="rejectMoney">确定拒绝</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import "@/assets/css/upload/upload.scss";
import "@/assets/css/tab.scss";
import * as api from "@/assets/js/interface";
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils.js";
import { mapState, mapActions } from "vuex";
export default {
  props: {
    filterData: {
      type: Object
    },
    dateFlag: {
      type: Boolean
    },
    keyword: {
      type: String
    }
  },
  data() {
    return {
      utils,
      // 加载标识
      loading: false,
      // 提现数据总数
      total: null,
      // 提现数据
      tableData: [],
      // 进度数据
      planData: [],
      // 进度对话框显示标识
      planDialogVisible: false,
      // 转账对话框标识
      transDialogVisible: false,
      // 转账对话框显示数据数据
      transForm: {
        photo: ""
      },
      // 转账拒绝请求数据
      queryTrans: {
        photo: "",
        reason: "",
        remark: ''
      },
      // 拒绝对话框标识
      rejectDialogVisible: false,
      // 拒绝表单数据
      rejectForm: {
        reason: ""
      },
      // 拒绝表单校验规则
      rejectFormRules: {
        reason: [{ required: true, message: "请输入拒绝理由", trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.getCashOut();
  },
  watch: {
    // 监听时间切换
    dateFlag(val) {
      if (val) {
        this.getCashOut();
      }
      this.$emit("changeFlag");
    },
    // 模糊匹配
    keyword(val) {
      this.filterData.mobile = val;
      this.getCashOut();
    }
  },
  methods: {
    // 获取提现数据
    async getCashOut(id) {
      let param = JSON.parse(JSON.stringify(this.filterData))
      param.storeId = this.isBrand ? param.storeId : this.currentInfo.shopId
      this.loading = true;
      const res = await axios.post(
        "/getCashOutApplyRecordForStaff",
        {...param,
        brandId: this.currentInfo.brandId
        }
      );
      this.loading = false;
      // 数据赋值
      this.tableData = res.list;
      this.total = res.total;
    },
    // 查看进度
    async handleClick(id) {
      const res = await axios.get("/getApplyProgress/" + id);
      this.planData = res.infoList.reverse();
      this.planDialogVisible = true;
      this.$nextTick(() => {
        this.judgeLine()
      })
    },
    // 分页切换事件
    handleCurrentChange(index) {
      this.filterData.pageNum = index;
      this.getCashOut();
    },
    // 点击转账
    handleClickTrans(data) {
      this.transDialogVisible = true;
      this.transForm.cashAmount = data.cashAmount;
      this.queryTrans.id = data.id;
      this.queryTrans.userId = data.userId;
      this.queryTrans.type = 1;
    },
    // 上传凭据成功事件
    handleAvatarSuccess(res, file) {
      this.transForm.photo = file.response.fileKey;
      this.queryTrans.photo = file.response.fileKey;
    },
    // 转账对话框关闭
    transClose() {
      this.transForm.photo = "";
      this.queryTrans.photo = "";
      this.queryTrans.remark = "";
    },
    // 确认转账
    async handleTransMoney() {
      const res = await axios.post("/doCashOutOrReject", {...this.queryTrans,
      storeId: this.isBrand ? null : this.currentInfo.shopId});
      // 重新获取提现数据
      this.getCashOut();
      this.$emit('changeData')
      this.transDialogVisible = false;
    },
    // 点击拒绝
    handleClickReject(data) {
      this.rejectDialogVisible = true;
      this.queryTrans.id = data.id;
      this.queryTrans.userId = data.userId;
      this.queryTrans.type = 2;
    },
    // 拒绝对话框关闭事件
    rejectClose() {
      // 充值对话框表单的数据和校验信息
      this.$refs.rejectFormRef.resetFields();
      // 清空拒绝理由
      this.queryTrans.reason = "";
    },
    // 确认拒绝事件
    async rejectMoney() {
      // 表单预校验
      this.$refs.rejectFormRef.validate(async valid => {
        if (!valid) return;
        this.queryTrans.reason = this.rejectForm.reason;
        // 发起拒绝请求
        const res = await axios.post("/doCashOutOrReject", this.queryTrans);
        // 重新获取提现数据
        this.getCashOut();
        this.rejectDialogVisible = false;
        // 清空拒绝理由
        this.queryTrans.reason = "";
      });
    },
    // 详情对话框中需要的文字信息
    // 提现金额
    carryMonry(flag) {
      return flag !== "modify"
        ? this.planData[0].cashAmount
        : this.planData[1].cashAmount;
    },
    // 申请时间
    carryMonryTime(flag) {
      return flag !== "modify"
        ? this.planData[0].createTime
        : this.planData[1].createTime;
    },
    // 转账金额
    transMoney() {
      return this.planData[1].cashAmount;
    },
    // 转账凭据
    transProof() {
      return this.planData[1].photo;
    },
    // 到账时间
    transTime() {
      return this.planData[1].createTime;
    },
    // 拒绝理由
    rejectReason() {
      let reason =
        this.planData[1].reason !== null
          ? this.planData[1].reason
          : this.planData[2].reason;
      return reason ? reason : "无";
    },
    // 拒绝时间
    rejectTime() {
      return this.planData[1].createTime || this.planData[2].createTime;
    },
    judgeLine() {
      // 原生js排他算法。。
      let lines = document.getElementsByClassName('timeLine');
      for (let i = 0; i< lines.length;i++) {
        lines[i].style.display = 'block';
      }
      lines[lines.length-1].style.display = 'none';
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo
    }),
    uploadUrl() {
      // 获取服务器端上传图片的URL
      return api.uploadPicture.URL;
    },
    // 获取上传接口的头部信息
    myHeaders() {
      return utils.getUploadHeader();
    },
    // 进度转账完成标识
    transPass() {
      return this.planData.filter(item => item.type === 3).length;
    },
    // 判断是品牌还是门店的标识
    isBrand() {
      return this.$route.path.indexOf("brand") !== -1;
    },
  }
};
</script>

<style lang="scss" scoped>
.stylebtn {
  width: 60px !important;
}

.dispose {
  span {
    color: #fff;
    background-color: #fcb322;
    border-radius: 20px;
    height: 20px;
    line-height: 18px;
  }
}

.reject {
  span {
    color: #fff;
    background-color: #f19e3a;
    border-radius: 20px;
    height: 20px;
    line-height: 18px;
  }
}

.trans {
  span {
    color: #fff;
    background-color: #75c74f;
    border-radius: 20px;
    height: 20px;
    line-height: 18px;
  }
}

.cancel {
  span {
    color: #fff;
    background-color: #b3b4b6;
    border-radius: 20px;
    height: 20px;
    line-height: 18px;
  }
}

.modify {
  span {
    color: #fff;
    background-color: blue;
    border-radius: 20px;
    height: 20px;
    line-height: 18px;
  }
}

.pagination {
  display: flex;
  justify-content: space-between;
  padding: 17px 23px;
}


.box-card {
  position: relative;
  padding-left: 30px;
  .box-card-item {
    position: relative;
    .timeLine {
      position: absolute;
      top: 0;
      left: 14px;
      width: 2px;
      height: 100%;
      background-color: #ccc;
      
    }
    i {
      z-index: 9999;
      position: absolute;
      padding-bottom: 5px;
      top: -4px;
      font-size: 30px;
      background-color: #fff;
    }
  }
}

.box-card {
  p.textTitle {
    margin-left: 43px;
    font-size: 16px;
    color: #000;
  }
  p.textInfo {
    margin-left: 43px;
    margin-top: 10px;
    margin-bottom: 10px;
    span {
      display: block;
      color: #bcbcbc;
      max-width: 15em;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis; /*超出部分用...代替*/
    }
    div {
      span {
        display: inline-block;
        vertical-align: top;
        background-color: #ededed;
        width: 100px;
        height: 100px;
        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  section.textImg {
    margin-left: 43px;
    margin-top: 10px;
    section.imgBox {
      color: #bcbcbc;
      width: 100%;
      overflow: hidden;
      span {
        margin-left: 30px;
        display: inline-block;
        vertical-align: top;
        background-color: #ededed;
        width: 120px;
        height: 100px;
        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}

/deep/ .el-dialog {
  border-radius: 5px;
}

.operation-person {
  .operation-shop {
    color: #bbb;
  }
}
</style>
