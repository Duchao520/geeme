<template>
  <div class="main-con-table">
    <div class="thwartwise title">
      <div class="thwartwiseItem">一级分类</div>
      <div class="thwartwiseItem">二级分类</div>
      <div class="thwartwiseItem product">产品名称</div>
      <div class="thwartwiseItem">提成方式</div>
      <div class="thwartwiseItem">普通会员（指定）</div>
      <div class="thwartwiseItem">身份会员（指定）</div>
    </div>
    <div
      class="thwartwise"
      v-for="(levelOneItem,indexOne) in planData"
      :key="indexOne"
      :style="indexOne===planData.length-1?{'border-right': '1px solid #f0f1f4','border-bottom': '1px solid #f0f1f4'}:{'border-right': '1px solid #f0f1f4'}"
      >
      <div class="thwartwiseItem levelOneName">
        <div class="center-text">
          <p>{{levelOneItem.name}}</p>
          <span @click="setMany">批量设置</span>
        </div>
      </div>
      <div class="firstSort">
        <div
          class="secondSort"
          v-for="(levelTwoItem,indexTwo) in levelOneItem.list"
          :key="indexTwo"
        >
          <div class="levelTwoItemName">
            <div class="center-text">
              <p>{{levelTwoItem.name}}</p>
              <span @click="setMany">批量设置</span>
            </div>
          </div>
          <div class="levelTwoItem">
            <el-form
              class="ServiceItem"
              v-for="(ServiceItem,indexThree) in levelTwoItem.list"
              :key="indexThree"
              :model="ServiceItem"
              :rules="ServiceItemRules"
              ref="serviceItemModify"
            >
              <div class="ServiceItemKey name">{{ServiceItem.name}}</div>
              <div class="ServiceItemKey">
                <el-select v-model="ServiceItem.commissionType" placeholder>
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
              <div class="ServiceItemKey">
                <el-form-item prop="commonVipAssign" class="num-input-item">
                  <el-input
                    placeholder="0"
                    maxlength="4"
                    v-model.number="ServiceItem.commonVipAssign"
                  >
                    <template slot="append">%</template>
                  </el-input>
                </el-form-item>
              </div>

              <div class="ServiceItemKey">
                <el-form-item prop="IdVipAssign" class="num-input-item">
                  <el-input placeholder="0" type="number" v-model.number="ServiceItem.IdVipAssign">
                    <template slot="append">%</template>
                  </el-input>
                </el-form-item>
              </div>

            </el-form>
          </div>
        </div>
      </div>
    </div>
    <set-in-many :setInManyVisible="setInManyVisible"  @close="setInManyVisible=false"></set-in-many>
  </div>
</template>
<script>
import planData from "./data.js";
import SetInMany from "@/components/setUp/table/setInMany";
export default {
  components: {
    'set-in-many':SetInMany
  },
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
      planData: planData,
      options: [
        {
          name: "固定提成",
          value: "fixed"
        },
        {
          name: "比例提成",
          value: "radio"
        }
      ],
      ServiceItemRules: {
        commonVipAssign: numRule,
        commonVipUnAssign: numRule,
        IdVipAssign: numRule,
        IdVipUnAssign: numRule
      },
      setInManyVisible:false

    };
  },
  props: {
    // planData:Array
  },
  methods: {
    validData() {
      /* this.$refs["serviceItemModify"].validate(valid => {
        if (valid) {
          alert("表单校验通过!");
        } else {
          console.log("error submit!!");
          return false;
        }
      }); */
    },
    setMany(){
      this.setInManyVisible = true;
    }
  }
};
</script>
<style lang="scss" scoped>
@mixin border-l-t {
  border-left: 1px solid #f0f1f4;
  border-top: 1px solid #f0f1f4;
}
@mixin border-r-b {
  border-right: 1px solid #f0f1f4;
  border-bottom: 1px solid #f0f1f4;
}
.main-con-table {
  box-shadow: 0px 0px 8px 0px rgba(174, 184, 229, 0.3);
  padding: 0 10px 10px;
  margin-bottom: 10px;
  .thwartwise {
    width: 100%;
    display: flex;

    .levelOneName {
      @include border-l-t;
    }
    .thwartwiseItem {
      width: calc(100% / 7);
      min-height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .thwartwiseItem.product{
      width: calc(100%/7*2);
      justify-content: flex-start;
      text-indent: 20px;
    }
    .firstSort {
      width: calc(100% / 7 * 6);
      .secondSort {
        width: 100%;
        display: flex;
        .levelTwoItemName {
          width: calc(100% / 6);
          display: flex;
          justify-content: center;
          align-items: center;
          @include border-l-t;
        }
        .levelTwoItem {
          width: calc(100% / 6 * 5);

          .ServiceItem {
            width: 100%;
            display: flex;
            @include border-l-t;

            .ServiceItemKey {
              width: calc(100% / 5);
              min-height: 60px;
              display: flex;
              align-items: center;
              justify-content: center;
              .num-input-item {
                margin-bottom: -0px;
              }
              /deep/ .el-select {
                width: 100px;
                height: 32px;
              }
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
            .ServiceItemKey.name{
              width: calc(100% / 5*2);
              justify-content: flex-start;
              text-indent: 20px;
            }
          }
        }
      }
    }
  }
  .title {
    .thwartwiseItem {
      justify-content: center;
    }
  }
}
.ServiceItem {
  display: flex;
}
.center-text {
  text-align: center;
  p {
    font-size: 14px;
  }
  span {
    color: #58c9f3;
    font-size: 12px;
    line-height: 26px;
    cursor: pointer;
  }
}
</style>
