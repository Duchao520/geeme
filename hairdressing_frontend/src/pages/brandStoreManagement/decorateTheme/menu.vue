<template>
  <div class="shop-menu-main scrollbar">
    <div class="main-content">

      <el-form ref="form" :model="form" label-width="40px" @submit.native.prevent>
        <template v-for="(item,index) in iconAndText">
          <div :key="index">
            <el-form-item label="名称">
              <el-input v-model="form[item.nameKey]" maxlength="2" placeholder="首页" style="width: 200px;"></el-input>
            </el-form-item>
            <el-form-item label="图标">
              <div class="icon-content">
                <div class="two-icon-images">
                  <div class="icon-item">
                    <p><img :src="getIconImage(form[item.typeKey])[0]"></p>
                    <p>未选中</p>
                  </div>
                  <div class="icon-item">
                    <p><img :src="getIconImage(form[item.typeKey])[1]"></p>
                    <p>选中</p>
                  </div>
                </div>
                <button @click="changeIcon(item)">
                  <i class="icon iconfont icon-icon_operate_edit"></i>
                  <span>修改</span>
                </button>
                <div></div>
              </div>
            </el-form-item>
          </div>
        </template>
        <el-form-item>
          <el-button class="normal_blue_btn" @click="submit">保存修改</el-button>
        </el-form-item>
      </el-form>
      <div class="preview-image">
        <h5>效果预览</h5>
        <div class="mobile-image">
          <img class="preview-theme-image" :src="previewThemeImage" alt="">
          <div class="occlusion-strip"
               :style="{backgroundImage:`url(${require('@/assets/images/shopDecorationTheme/img_iphone_menu.png')})`}">
            <div v-for="(item,index) in iconAndText" :key="index" class="icon-text">
              <img :src="getIconImage(item.iconId)[item.imgIndex]">
              <p>{{item.name}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <choose-menu-icons
      ref="ChooseMenuIcons"
      :visible="selectIconsVisible"
      @close="selectIconsVisible = false"
      @setIconId="setIconId"
      v-bind="form"
      :iconTypeToChange="iconTypeToChange"
    ></choose-menu-icons>
  </div>
</template>
<script>
  import * as axios from "@/util/axios";
  import {mapState} from "vuex";
  import ChooseMenuIcons from "@/components/brandStoreManagement/decorateTheme/ChooseMenuIcons";

  export default {
    components: {ChooseMenuIcons},
    data() {
      return {
        form: {
          buttonOneName: "首页",
          buttonOneType: 1,
          buttonTwoName: "预约",
          buttonTwoType: 2,
          buttonThreeName: "美购",
          buttonThreeType: 3,
          buttonFourName: "我的",
          buttonFourType: 4,
          themeId: 1,
        },
        selectIconsVisible: false,
        iconTypeToChange: {
          type: "",
          iconId: 0
        }
      }
    },
    computed: {
      ...mapState({
        currentInfo: state => state.manage.currentInfo
      }),
      previewThemeImage() {
        return require(`@/assets/images/shopDecorationTheme/img_theme_0${this.form.themeId}01.png`)
      },
      iconAndText() {
        let arr = ["One", "Two", "Three", "Four"];
        return arr.map(item => {
            return {
              imgIndex: item === 'One' ? 1 : 0,
              name: this.form[`button${item}Name`],
              iconId: this.form[`button${item}Type`],
              nameKey: `button${item}Name`,
              typeKey: `button${item}Type`
            }
          }
        )
      }
    },
    mounted() {
      this.getBrandThemeByBrandId()
    },
    methods: {
      getBrandThemeByBrandId() {
        axios.get("/getBrandThemeByBrandId/" + this.currentInfo.brandId).then(res => {
          this.form = res;
        })
      },
      getIconImage(n) {
        n = n < 10 ? "0" + n : n;
        return [
          `https://image.geeme.cn/icon_nav24_9/icon_nav00_${n}.png`,//未激活的图片
          `https://image.geeme.cn/icon_nav24_9/icon_nav0${this.form.themeId}_${n}.png`//激活的图片
        ]
      },
      submit() {
        axios.post("/updateBrandTheme", {
          ...this.form,
          brandId: this.currentInfo.brandId
        }).then(res => {
          this.$message({
            message: res.message,
            type: res.success ? "success" : "warning"
          })
        })
      },
      changeIcon(data) {
        this.$refs.ChooseMenuIcons.iconId = data.iconId;
        this.iconTypeToChange = {
          type: data.typeKey,
          iconId: data.iconId
        };
        this.selectIconsVisible = true;
      },
      setIconId(data) {
        console.log(data);
        this.form[data.type] = data.iconId;
        this.selectIconsVisible = false
      }
    },
  }
</script>
<style lang='scss' scoped>
  @import "@/assets/css/scrollbar.scss";

  @mixin font-style($lh,$fs,$col) {
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

    .main-content {
      display: flex;

      .el-form {
        width: 430px;

        .el-form-item {

          /deep/ .el-form-item__label {
            margin-right: 20px;
          }

          .icon-content {
            display: flex;
            align-content: flex-start;

            .two-icon-images {
              display: flex;

              .icon-item {
                margin-right: 20px;

                p:nth-child(1) {
                  border: 1px dashed #D5DADF;
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
              color: #58C9F3;
              height: 14px;
              margin-top: 46px;
            }
          }
        }
      }

      .preview-image {
        h5 {
          @include font-style(22px, 16px, #333333);
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
                margin: 7px 0 2px;
              }

              p {
                text-align: center;
                @include font-style(18px, 14px, #F52D56);
                @include one-line(40px);
                transform: scale(0.5);
                transform-origin: 50% -30%;
              }
            }
          }
        }
      }
    }

  }
</style>
