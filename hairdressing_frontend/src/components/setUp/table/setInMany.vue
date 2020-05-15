<template>
  <el-dialog
    title="批量设置"
    :visible="setInManyVisible"
    width="500px"
    :before-close="dialogBeforeClose"
  >
    <div class="main-con-forms">
      <div class="line" style="width:100%;border-top:1px solid #F0F1F4;margin-top:-18px;margin-bottom:10px;"></div>
      <el-form
        ref="form"
        class="main-con-form"
        :model="commissionRatio"
        :rules="commissionRatioRules"
      >
        <div class="line-box">
          <div class="box-left">提成方式</div>
          <div class="box-right">
            <el-form-item style="margin-top:2px;" prop="commissionType" class="num-input-item">
              <el-select v-model="commissionRatio.commissionType" placeholder="" size='mini'>
                  <el-option
                      v-for="item in commissionTypes"
                      :key="item.value"
                      :label="item.name"
                      :value="item.type">
                  </el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <div class="line-box">
          <div class="box-left">普通会员（指定）</div>
          <div class="box-right">
            <el-form-item style="margin-top:2px;" prop="commonVipAssign" class="num-input-item">
              <el-input
                placeholder="0"
                type="number"
                v-model.number="commissionRatio.commonVipAssign"
              >
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </div>
        </div>
        <div class="line-box">
          <div class="box-left">普通会员（非指定）</div>
          <div class="box-right">
            <el-form-item style="margin-top:2px;" prop="commonVipUnAssign" class="num-input-item">
              <el-input
                placeholder="0"
                type="number"
                v-model.number="commissionRatio.commonVipUnAssign"
              >
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </div>
        </div>
        <div class="line-box">
          <div class="box-left">身份会员（指定）</div>
          <div class="box-right">
            <el-form-item style="margin-top:2px;" prop="IdVipAssign" class="num-input-item">
              <el-input placeholder="0" type="number" v-model.number="commissionRatio.IdVipAssign">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </div>
        </div>
        <div class="line-box">
          <div class="box-left">身份会员（非指定）</div>
          <div class="box-right">
            <el-form-item style="margin-top:2px;" prop="IdVipUnAssign" class="num-input-item">
              <el-input
                placeholder="0"
                type="number"
                v-model.number="commissionRatio.IdVipUnAssign"
              >
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <div slot="footer" class="footer">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    var validateNumber = (rule, value, callback) => {
      if (value < 0 || value > 100 || typeof value === "string") {
        callback(new Error("请输入0-100之间的数字"));
      } else {
        callback();
      }
    };
    var numRule = [
      { required: true, trigger: "change", validator: validateNumber }
    ];
    return {
      commissionRatio: {
        commissionType: "labour",
        commonVipAssign: 0,
        commonVipUnAssign: 0,
        IdVipAssign: 0,
        IdVipUnAssign: 0
      },
      commissionRatioRules: {
        commissionType: [{required:true,trigger:'blur',message:"请选择提成类别"}],
        commonVipAssign: numRule,
        commonVipUnAssign: numRule,
        IdVipAssign: numRule,
        IdVipUnAssign: numRule
      },
      commissionTypes: [
        { name: "劳动提成", type: "labour" },
        { name: "业绩提成", type: "performance" }
      ],
    };
  },
  props: {
    setInManyVisible: Boolean
  },
  methods: {
    dialogBeforeClose() {
      this.$emit("close");
    },
    confirm(){
        this.$refs['form'].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.main-con-form {
  .line-box {
    width: 100%;
    display: flex;
    .box-left,
    .box-right {
      width: 50%;
      box-sizing: border-box;
      padding: 0 10px;
      height: 48px;
    }
    .box-left {
      color: #666666;
      font-size: 14px;
      text-align: right;
      line-height: 48px;
    }
    .box-right {
      /deep/ .el-input {
        width: 100px;
        height: 32px;
        /deep/ .el-input__inner {
          height: 32px;
          padding: 0 8px;
        }
        /deep/ .el-select .el-input .el-select__caret {
          line-height: 30px;
        }
      }
      /deep/ .el-input-group__append {
        width: 32px;
        height: 30px;
        padding: 0;
        text-align: center;
        color: white;
        background: #d5dadf;
        font-size: 16px;
      }
    }
  }
}
.footer{
    margin-top: -25px;
}
</style>
