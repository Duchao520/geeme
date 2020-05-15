<template>
  <el-table class="table-manage" stripe :data="data" style="width: 100%">
    <el-table-column prop="brandInfo" label="品牌信息">
      <template slot-scope="scope">
        <div class="brand-info">
          <img :src="utils.formatPicImg(scope.row.logoSquare)" alt class="img">
          <span>{{scope.row.brandName}}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="brandOwner" label="品牌持有人"></el-table-column>
    <el-table-column prop="createUserName" label="创建人"></el-table-column>
    <el-table-column prop="phone" label="手机号"></el-table-column>
    <el-table-column label="状态 ">
      <template slot-scope="scope">
        <div class="status-text">
          <p class="status" v-if="scope.row.auditStatus==='CHECKING_CREATE'" style="background:#FCB322">待审核</p>
          <p class="status" v-if="scope.row.auditStatus==='REJECT_CREATE'" style="background:#E22C37">已驳回</p>
          <p class="status" v-if="scope.row.auditStatus==='CHECKING_MODIFY'" style="background:#FCB322">待审核</p>
          <p class="status" v-if="scope.row.auditStatus==='REJECT_MODIFY'" style="background:#E22C37">更新驳回</p>
          <p class="status" v-if="scope.row.auditStatus==='PASSED'" style="background:#A9D86E">已通过</p>
          <p class="reject-reason" v-if="scope.row.rejectReason">{{scope.row.rejectReason}}</p>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="操作 " width="200">
      <template slot-scope="scope">
        <div style="display:flex">
          <g-button
            v-if="scope.row.auditStatus==='PASSED'"
            name="更新"
            icon="icon_operate_edit"
            type="detail"
            @click="intoDetail(scope.row.id)"
          ></g-button>
          <g-button
            v-if="scope.row.auditStatus==='REJECT_CREATE' || scope.row.auditStatus==='REJECT_MODIFY'"
            name="修改"
            icon="icon_operate_edit"
            type="detail"
            @click="intoDetail(scope.row.id)"
          ></g-button>
          <g-button
            v-if="scope.row.auditStatus==='REJECT_CREATE'"
            name="删除"
            icon="icon_operate_delete"
            type="cancel"
            @click="delProductBrandCreate(scope.row.id)"
          ></g-button>
          <g-button
            v-if="scope.row.auditStatus==='REJECT_MODIFY'"
            name="回退"
            icon="icon_operate_recover"
            type="green"
            @click="delProductBrandCreate(scope.row.id)"
          ></g-button>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import * as utils from "@/assets/js/utils";
import * as axios from "@/util/axios";
import { mapActions } from "vuex";
export default {
  props: {
    data: Array
  },
  data() {
    return {
      utils: utils
    };
  },
  methods: {
    ...mapActions(["saveCommodityBrandId"]),
    intoDetail(id) {
      this.saveCommodityBrandId(id);
      this.$router.push("/brand-inner/edit-new-brand");
    },
    delProductBrandCreate(id) {
      axios.del(`/delProductBrandCreate/${id}`).then(res => {
        this.$emit("update");
        this.$message({type:res.code == 1200?'success':'warning',message:res.code == 1200?'删除成功':res.message})
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.con-table {
  box-sizing: border-box;
  background: #ffffff;
  box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
  border-radius: 8px 8px 4px 4px;
  color: #333333;
  .table-contain {
    box-sizing: border-box;
    padding: 10px 20px;
    .table-manage {
      /deep/.el-table tr:nth-child(2n + 1) {
        background: #f0f1f4;
      }
    }
  }

  .brand-info {
    display: flex;
    align-items: center;
    .img {
      margin: 0 10px;
      display: block;
      width: 40px;
      height: 40px;
    }
    .el-form {
      .el-form-item {
        margin-bottom: 0;
        transform: translateY(-10px);
      }
    }
  }
  .status-text {
    .status {
      color: white;
      line-height: 17px;
      height: 17px;
      font-size: 12px;
      border-radius: 8px;
      width: 62px;
      text-align: center;
    }
    .reject-reason{
      font-size: 12px;
      color: #F52D56;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  .page {
    padding: 10px 0 20px;
  }
}
</style>
