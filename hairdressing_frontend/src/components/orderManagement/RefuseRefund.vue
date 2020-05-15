<template>
  <div class="root">
    <el-dialog
      :closeOnClickModal="false"
      title="拒绝退款"
      :visible="visible"
      :width="'500px'"
      @close="$emit('close')"
    >
      <el-form :model="refuseForm" ref="refuseForm" class="container">
        <div class="inner-container">
          <el-form-item label="拒绝理由:" :label-width="labelWidth">
            <el-select v-model="refuseForm.reason" placeholder="请选择拒绝理由">
              <el-option
                v-for="(item,index) in options"
                :key="index"
                :label="item.label"
                :value="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户留言:" :label-width="labelWidth">
            <input-with-count
              v-model="refuseForm.desc"
              placeholder="请输入给客户的留言(不超过150字)"
              :autosize="{minRows:4,maxRows:100}"
            ></input-with-count>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="$emit('close')">取消</el-button>
        <el-button type="primary" @click="$emit('confirmRefuse',{id:id,data:refuseForm})">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import * as api from "@/assets/js/interface";
  import * as axios from '@/util/axios';

  export default {
    name: "RefuseRefund",
    props: {
      visible: Boolean,
      id: {
        type: [Number, Object,String],
        default:null
      }
    },
    data() {
      return {
        refuseForm: {
          reason: null,
          desc: ""
        },
        options: [
          {
            label: "影响二次销售"
          },
          {
            label: "客户不想退了"
          },
          {
            label: "超过退款期限"
          }
        ],
        labelWidth: "100px"
      };
    },
  };
</script>
<style lang="scss">
  .root {
    .container {
      border-top: 1px solid #f0f1f4;
      margin-top: -20px;
      display: flex;
      flex-direction: column;
      padding-top: 6px;

      .inner-container {
        display: flex;
        flex-direction: column;
        margin-left: -10px;

        /deep/ .el-form-item {
          margin: 10px 0 0 -15px;
        }
      }
    }
  }
</style>
