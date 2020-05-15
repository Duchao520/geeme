<template>
<!-- 小程序组件不兼容 暂时启用 -->
  <div class="shop-menu-main scrollbar">
    <div class="main-content">
      <el-form
        :model="addForm"
        :rules="rules"
        ref="ruleForm"
        class="demo-ruleForm"
        style=" position: relative;"
      >
        <el-table
          :data="menuData"
          style="width: 50%;"
          v-if="menuData.length > 0"
          v-loading="loading"
        >
          <el-table-column prop="weight" label="排序" width="80">
            <template slot-scope="{ row }">
              <number-input v-model="row.weight" class="input" :min="0" :max="999"></number-input>
            </template>
          </el-table-column>
          <el-table-column label="名称" width="150">
            <template slot-scope="scope">
              <el-form-item
                label
                :prop="'weAppletMenuSettingList.' + scope.$index + '.showName'"
                :rules="{validator: nameValid, trigger: 'blur'}"
                style="margin-top: 22px;"
              >
                <el-input
                  v-model="scope.row.showName"
                  maxlength="3"
                  placeholder="请输入标题"
                  style="width: 110px;"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="图标" width="250">
            <template slot-scope=" { row, $index } ">
              <div>
                <div class="icon-content">
                  <div class="two-icon-images">
                    <div class="icon-item">
                      <p>
                        <img :src="getIconImage(row.showIcon)[0]" />
                      </p>
                      <p>未选中</p>
                    </div>
                    <div class="icon-item">
                      <p>
                        <img :src="getIconImage(row.showIcon)[1]" />
                      </p>
                      <p>选中</p>
                    </div>
                  </div>
                  <button @click="changeIcon(row, $index)" style="cursor: pointer;">
                    <i class="icon iconfont icon-icon_operate_edit"></i>
                    <span>修改</span>
                  </button>
                  <div></div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="链接页面" width="150">
            <template slot-scope="{ row }">
              <el-select v-model="row.showLink" placeholder="请选择" style="width: 120px;">
                <el-option
                  v-for="item in linkOptions"
                  :key="item.name"
                  :label="item.showName"
                  :value="item.name"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="是否显示" width="100">
            <template slot-scope="{ row }">
              <el-checkbox
                v-if="row.type != 'title'"
                v-model="row.showFlag"
                :true-label="1"
                :false-label="0"
              >{{'显示'}}</el-checkbox>
              <p v-else>-</p>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作" width="180">
            <template slot-scope="{ row, $index }">
              <g-button
                :name="'恢复默认'"
                type="mgreen"
                :icon="'icon_operate_recover'"
                @click="recover(row)"
              ></g-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="preview-image">
          <h4>效果预览</h4>
          <div class="mobile-image">
            <img class="preview-theme-image" :src="previewThemeImage" alt />
            <div
              class="occlusion-strip"
              :style="{backgroundImage:`url(${require('@/assets/images/shopDecorationTheme/img_iphone_menu.png')})`}"
            >
              <div v-for="(item,index) in iconAndText" :key="index" class="icon-text">
                <img :src="getIconImage(item.icon)[item.imgIndex]" />
                <p>{{item.name}}</p>
              </div>
            </div>
          </div>
        </div>
      </el-form>
      <div class="batch-btn">
        <g-button
          :name="'批量恢复'"
          :type="'mgreenFill'"
          :icon="'icon_operate_recover'"
          @click="recover(null)"
        ></g-button>
        <el-button
          style="margin-top: 20px;"
          @click="saveEdit"
          :loading="btnLoad"
          class="normal_red_btn"
          size="small"
        >保存修改</el-button>
      </div>
    </div>
    <choose-menu-icons
      ref="ChooseMenuIcons"
      :visible="selectIconsVisible"
      @close="selectIconsVisible = false"
      @setIconId="setIconId"
      :themeId="themeId"
      :iconTypeToChange="iconTypeToChange"
    ></choose-menu-icons>
    <!-- 恢复默认提示框 -->
    <g-del-model
      :delTagDialogVisible="batchOpenConfirmVisible"
      @confirm="confirmRecover"
      @close="batchOpenConfirmVisible = false"
      title="确定要恢复吗？"
      content="恢复后，现有的数据将不做保留，请谨慎操作！"
      :icon="'icon_popup_question'"
      :iconColor="'#FF6D61'"
      :btnLoad="btnLoad"
    ></g-del-model>
  </div>
</template>
<script>
import * as axios from "@/util/axios";
import { mapState } from "vuex";
import ChooseMenuIcons from "@/components/brandStoreManagement/decorateTheme/ChooseMenuIcons";

export default {
  components: { ChooseMenuIcons },
  data() {
    return {
      linkOptions: [
        {
          name: "",
          showName: ""
        }
      ],
      menuParam: {
        name: null,
        weappTemplateCodeType: "beauty"
      },
      menuData: [],
      loading: false,
      btnLoad: false,
      addDialogVisible: false,
      tempSortList: [],
      selectIconsVisible: false,
      iconTypeToChange: {
        type: "",
        iconId: 0
      },
      menuIndex: 0,
      addForm: {
        weAppletMenuSettingList: []
      },
      rules: {},
      themeId: 1,
      batchOpenConfirmVisible: false,
      singleFlag: true,
      pitchRow: {}
    };
  },
  created() {},
  mounted() {
    this.getThemeId();
    this.getLinkInfo();
    this.getAllColumnInfo();
  },
  methods: {
    nameValid(rule, value, cb) {
      if (!value) {
        cb(new Error("请输入名称"));
      }
      cb();
    },
    onReSort(val, row) {},
    // 获取主题配色信息
    async getThemeId() {
      const res = await axios.get(
        `/getBrandThemeByBrandId/${this.currentInfo.brandId}`
      );
      this.themeId = res.themeId;
    },
    // 获取链接页面信息
    getLinkInfo() {
      this.loading = true;
      axios.get(`/getAppletMenuLinkList/${this.currentInfo.brandId}`).then(res => {
        this.linkOptions = res.appletColumnLinks;
        this.loading = false;
      });
    },
    // 获取所有菜单配置信息
    async getAllColumnInfo() {
      this.brandNum = 0;
      this.storeNum = 0;
      this.appNum = 0;
      this.loading = true;
      const res = await axios.get(
        `/getBrandWeAppletMenuSettingSelfByBrandId/${this.currentInfo.brandId}`
      );
      this.menuData = res.settingSelfList.filter(
        item => !!item.menuSettingInfo.defaultShow
      );
      this.menuData.forEach(item => {
        if (!item.id) {
          item.settingId = item.menuSettingInfo.id;
          item.showFlag = item.menuSettingInfo.defaultShow;
          item.showIcon = item.menuSettingInfo.icon;
          item.showLink = item.menuSettingInfo.link;
          item.showName = item.menuSettingInfo.name;
        }
        item.brandId = this.currentInfo.brandId;
        item.weight = item.weight || 0;
      });
      this.addForm = {
        weAppletMenuSettingList: this.menuData
      };
      this.loading = false;
    },
    async saveEdit(obj, type) {
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) return this.$message.warning("请完善相关信息");
        try {
          this.btnLoad = true;
          const res = await axios.post("/addOrModifyBrandWeAppletMenuSelf", {
            brandWeAppletMenuSelfList: type == "single" ? [obj] : this.menuData
          });
          if (!res.success)
            return this.$message.error("修改失败" + res.message);
          this.$message.success("修改成功");
          this.btnLoad = false;
          this.menuData = [];
          this.getAllColumnInfo();
          this.batchOpenConfirmVisible = false;
        } finally {
          this.btnLoad = false;
        }
      });
    },
    // 恢复模板
    recover(row) {
      this.singleFlag = !!row;
      this.pitchRow = row;
      this.batchOpenConfirmVisible = true;
    },
    confirmRecover() {
      console.log(this.singleFlag);
      if (this.singleFlag) {
        let obj = this.pitchRow;
        let recoverObj = obj.menuSettingInfo;
        obj.showFlag = recoverObj.defaultShow;
        obj.showIcon = recoverObj.icon;
        obj.showLink = recoverObj.link;
        obj.showName = recoverObj.name;
        obj.weight = 0;
        this.saveEdit(obj, "single");
      } else {
        console.log(this.menuData);
        this.menuData.forEach(item => {
          item.showFlag = item.menuSettingInfo.defaultShow;
          item.showIcon = item.menuSettingInfo.icon;
          item.showLink = item.menuSettingInfo.link;
          item.showName = item.menuSettingInfo.name;
          item.weight = 0;
        });
        this.saveEdit();
      }
    },
    getIconImage(n) {
      n = n < 10 ? "0" + n : n;
      return [
        `https://image.geeme.cn/icon_nav24_9/icon_nav00_${n}.png`, //未激活的图片
        `https://image.geeme.cn/icon_nav24_9/icon_nav0${this.themeId}_${n}.png` //激活的图片
      ];
    },
    changeIcon(data, index) {
      this.menuIndex = index;
      this.$refs.ChooseMenuIcons.iconId = data.showIcon;
      this.iconTypeToChange = {
        type: data.typeKey,
        iconId: data.showIcon
      };
      this.selectIconsVisible = true;
    },
    setIconId(data) {
      // this.form[data.type] = data.icon;
      this.menuData[this.menuIndex].showIcon = data.iconId;
      this.selectIconsVisible = false;
    },
    onReSort(val, row) {
      row.weight = val.value;
    }
  },
  filters: {},
  watch: {
    "menuParam.weappTemplateCodeType"(val) {
      this.getAllColumnInfo();
    }
  },
  computed: {
    previewThemeImage() {
      return require(`@/assets/images/shopDecorationTheme/img_theme_0${this.themeId}01.png`);
    },
    currentInfo() {
      return this.$store.state.manage.currentInfo;
    },
    iconAndText() {
      let arr = [];
      arr = this.menuData.filter(i => i.showFlag);
      arr = arr.map(i => {
        return {
          imgIndex: 1,
          name: i.showName,
          icon: i.showIcon
        };
      });
      return arr;
    }
  }
};
</script>
<style lang='scss' scoped>
@import "@/assets/css/scrollbar.scss";

@mixin font-style($lh, $fs, $col) {
  line-height: $lh;
  font-size: $fs;
  color: $col;
}

@mixin one-line($w) {
  width: $w;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.shop-menu-main {
  box-sizing: border-box;
  padding: 32px 40px 20px;
  height: calc(100% - 32px);
  overflow-y: auto;
}

.preview-image {
  position: absolute;
  top: 150px;
  right: 15%;
  transform: scale(1.5);
  h4 {
    // @include font-style(22px, 16px, #333333);
    font-weight: 700;
    line-height: 22px;
    font-size: 16px;
    color: #333;
    margin-bottom: 20px;
  }

  .mobile-image {
    position: relative;
    height: 420px;
    width: 210px;

    .preview-theme-image {
      height: 420px;
      width: 210px;
    }

    .occlusion-strip {
      position: absolute;
      bottom: 12px;
      left: 14px;
      margin: auto;
      width: 182px;
      height: 41px;
      background-size: cover;
      display: flex;
      justify-content: space-around;

      .icon-text {
        text-align: center;
        img {
          width: 12px;
          // margin: 7px 0 2px 3px;
          margin: 7px 0 2px;
        }

        p {
          text-align: center;
          // @include font-style(18px, 14px, #F52D56);
          line-height: 18px;
          font-size: 12px;
          color: #f52d56;
          width: 40px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transform: scale(0.5);
          transform-origin: 50% -30%;
        }
      }
    }
  }
}

.icon-content {
  display: flex;
  align-content: flex-start;

  .two-icon-images {
    display: flex;
    padding-top: 15px;
    .icon-item {
      margin-right: 20px;

      p:nth-child(1) {
        border: 1px dashed #d5dadf;
        width: 60px;
        height: 60px;
      }

      p:nth-child(2) {
        text-align: center;
        line-height: 40px;
        color: #999999;
      }
    }
  }

  button {
    color: #58c9f3;
    height: 14px;
    margin-top: 46px;
  }
}

.input {
  /deep/ .el-input__inner {
    width: 40px;
    height: 35px;
    text-align: center;
    text-indent: 0 !important;
  }
}

/deep/ .el-table td,
.el-table th {
  padding: 5px 0 !important;
}
</style>
