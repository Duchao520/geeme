<template>
  <div class="shop-theme-main scrollbar">
    <el-radio-group v-model="themeId">
      <div
        class="radio-content"
        v-for="item in colorMatching"
        :key="item.id"
      >
        <div class="colors">
          <p :style="{background:item.color[0]}"></p>
          <p :style="{background:item.color[1]}"></p>
        </div>
        <el-radio :label="item.id">{{item.name}}</el-radio>
      </div>
    </el-radio-group>
    <h5>效果预览</h5>
    <div class="preview-images">
      <img v-for="(item ,index) in previewThemeImages" :key="index" :src="item" alt=""/>
    </div>
    <el-button class="normal_blue_btn" @click="submit">保存修改</el-button>
  </div>
</template>
<script>
  //https://image.geeme.cn/icon_nav24_9/icon_nav00_01.png
  import * as axios from "@/util/axios";
  import {mapState} from "vuex";

  export default {
    data() {
      return {
        colorMatching: [
          {
            color: ["#FF2732", "#F52D56"],
            name: "中国红/艳红",
            id: 1
          },
          {
            color: ["#323232", "#787474"],
            name: "高级黑/瓷黑",
            id: 2
          },
          {
            color: ["#CC9932", "#E9C06B"],
            name: "儒雅金/淡金",
            id: 3
          },
          {
            color: ["#009999", "#01CCCC"],
            name: "孔雀蓝/祖母绿",
            id: 4
          },
          {
            color: ["#7E46B6", "#6666CC"],
            name: "紫罗兰/淡紫",
            id: 5
          },
          {
            color: ["#FFBC00", "#FFDD98"],
            name: "柠檬黄/淡黄",
            id: 6
          },
          {
            color: ["#019966", "#00CF82"],
            name: "松石绿/翠绿",
            id: 7
          },
          {
            color: ["#0199FF", "#0066FF"],
            name: "天蓝/湖蓝",
            id: 8
          },
        ],
        themeId: 1,
      }
    },
    computed: {
      ...mapState({
        currentInfo: state => state.manage.currentInfo
      }),
      previewThemeImages() {
        let arr = [], index = 1;
        do {
          arr.push(require(`@/assets/images/shopDecorationTheme/img_theme_0${this.themeId}0${index}.png`));
          index++;
        } while (index <= 3);
        return arr;
      }
    },
    mounted() {
      this.getBrandThemeByBrandId()
    },
    methods: {
      getBrandThemeByBrandId() {
        axios.get("/getBrandThemeByBrandId/" + this.currentInfo.brandId).then(res => {
          this.themeId = res.themeId;
        })
      },
      submit() {
        axios.post("/updateBrandTheme", {
          themeId: this.themeId,
          brandId: this.currentInfo.brandId
        }).then(res => {
          this.$message({
            message: res.message,
            type: res.success ? "success" : "warning"
          })
        })
      }
    },
  }
</script>
<style lang='scss' scoped>
  @import "@/assets/css/scrollbar.scss";

  .shop-theme-main {
    box-sizing: border-box;
    height: calc(100% - 32px);
    padding: 32px 40px 20px;
    overflow-y: auto;

    .el-radio-group {
      width: 660px;

      .radio-content {
        display: inline-block;
        width: 160px;
        margin-bottom: 28px;

        .colors {
          p {
            width: 40px;
            height: 40px;
            border-radius: 20px;
            background-color: rgba(255, 39, 50, 1);
            margin: 0 10px 10px 0;
            display: inline-block;
          }
        }

        /deep/ .el-radio__label {
          color: #333333;
        }
      }
    }

    h5 {
      line-height: 22px;
      font-size: 16px;
      color: #333333;
      margin-bottom: 20px;
    }

    .preview-images {
      margin-bottom: 34px;

      img {
        width: 180px;
        margin-right: 30px;
      }
    }
  }
</style>
