<template>
  <el-popover offset="-95" class="wrap-con" placement="top" width="440" trigger="manual" v-model="addNewTagPopVisible">
    <div class="make-tags">
      <el-checkbox-group class="tag-zong" v-model="selectedTagsArr">
        <el-checkbox
          v-for="(item,index) in availableTags.platformServiceTagInfos"
          :key="index"
          :label="item.id"
        >
          <span :title="item.name">{{item.name}}</span>
        </el-checkbox>
      </el-checkbox-group>
      <div class="define-oneself">
        <h6>自定义标签</h6>
        <el-checkbox-group v-model="selectedTagsArr">
          <div
            class="check-box-wrap"
            v-for="(item,index) in availableTags.storeServiceTagInfos"
            :key="index"
          >
            <el-checkbox :label="item.id">
              <span>{{item.name}}</span>
            </el-checkbox>
            <span style="cursor:pointer">
              <i
                style="margin-left:3px;color:#BEC3C6"
                @click="$emit('delTags',item.id)"
                class="icon iconfont icon-icon_operate_delete"
              ></i>
            </span>
          </div>
        </el-checkbox-group>
        <div class="add-new">
          <el-form ref="form" :model="form" :rules="formRules">
            <el-form-item prop="addNewTag">
              <input type="text" style="display: none;">
              <el-input placeholder="输入自定义标签" maxlength="12" v-model="form.addNewTag">
                <div class="text" slot="append" @click="addNewTagFn">新增</div>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="buttons">
          <el-button size="small" @click="$emit('close')">取消</el-button>
          <el-button
            size="small"
            type="primary"
            @click="confirm"
          >确定
          </el-button>
        </div>
      </div>
    </div>
    <g-button
      slot="reference"
      :name="'打标签'"
      :type="'mgreenFill'"
      :icon="'icon_operate_tag'"
      @click="$emit('makeTag')"
    ></g-button>
  </el-popover>
</template>
<script>
  export default {
    props: {
      availableTags: {
        type: Object,
        default: {
          platformServiceTagInfos: [],
          storeServiceTagInfos: []
        }
      },
      addNewTagPopVisible: Boolean
    },
    data() {
      var addNewTagValidator = (rules, value, callback) => {
        let type = typeof (value)
        if (type === 'string' && value.length === 0) {
          callback("请输入自定义标签名")
        } else if (/^\s*$/.test(value)) {
          callback("请输入合法的标签名")
        } else {
          callback()
        }
      };
      return {
        selectedTagsArr: [],
        previousTagIds:[],
        form: {
          addNewTag: null
        },
        formRules: {
          addNewTag: [
            {required: true, trigger: "change", validator: addNewTagValidator}
          ]
        },
      };
    },
    methods: {
      addNewTagFn() {
        if (this.form.addNewTag === null) {
          this.form.addNewTag = ""
        }
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.$emit("addNewTagFn", this.form.addNewTag);
            this.form.addNewTag = null;
          } else {
            console.log("ERROR SUBMIT");
          }
        });
      },
      confirm() {
        // 允许删除标签
        // if (this.selectedTagsArr.length === 0) {
        //   this.$message({
        //     type: "warning",
        //     message: "请选择标签！"
        //   });
        //   return
        // }
        this.$emit('confirmAddTagToService', this.selectedTagsArr,this.previousTagIds);
        this.selectedTagsArr = []
      },
      statisticsSelectedTagIds(tagIds) {
        if(tagIds){
          this.selectedTagsArr = tagIds;
          this.previousTagIds = tagIds;
          return;
        }
        let availableTags = this.availableTags;
        let newArr = availableTags.platformServiceTagInfos.concat(availableTags.storeServiceTagInfos);
        let idArr = [];
        newArr.forEach(element => {
          if (element.selected) {
            idArr.push(element.id)
          }
        });
        this.selectedTagsArr = idArr
      }
    }
  };
</script>
<style lang="scss" scoped>
  .make-tags {
    display: block;
    box-sizing: border-box;
    padding: 18px;

    .el-checkbox-group {
      box-sizing: border-box;
      padding-bottom: 3px;

      .check-box-wrap {
        display: inline-flex;
        width: 33.33%;
        box-sizing: border-box;

        .icon-icon_operate_delete {
          visibility: hidden;
          flex: 0;
          margin-right: 15px;
        }

        .el-checkbox {
          flex: 1 1 auto;
          width: 40px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        &:hover {
          .icon-icon_operate_delete {
            visibility: visible;
          }
        }
      }

      .el-checkbox {
        margin: 0 0 15px 0;

        /deep/ .el-checkbox__label {
          color: #666666;
          display: inline-block;
        }
      }
    }

    .tag-zong {
      /deep/ .el-checkbox {
        margin: 0 0 15px 0;
        width: 33.3%;

        /deep/ .el-checkbox__label {
          color: #666666;
          // display: block;
        }
      }
    }

    .define-oneself {
      h6 {
        font-size: 14px;
        line-height: 1;
        margin-bottom: 10px;
      }
    }

    .add-new {
      width: 200px;
      magin-bottom: 17px;

      /deep/ .el-input__inner {
        height: 32px;
      }

      /deep/ .el-input-group__append {
        width: 50px;
        padding: 0;
        text-align: center;
        color: #666666;
        cursor: pointer;
      }
    }

    .buttons {
      width: 100%;
      display: flex;
      justify-content: flex-end;
    }
  }
</style>
