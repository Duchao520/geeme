<template>
  <div class="choose-images" :style="{width:width}">
    <div class="image-list-card">
      <div v-for="(item,index) in imageLists" :key="index" class="image-box">
        <div
          class="image-back"
          :style="{backgroundImage:`url(${utils.formatPicImg(item.mediaKey)})`,backgroundSize: backgroundSize}"
          :class="{active:(canActive && imagesKeys.includes(item.mediaKey)),disabled:disabled,square:type==='square'}"
          @click="canActive && clickImage(item.mediaKey)"
        >
          <div class="active-style">
            <div class="icon-box">
              <p class="el-icon-check"></p>
            </div>
          </div>
          <div class="zoom-out" @click.stop="canActive && imagePreview(item)" v-show="type==='square'">
            <i class="icon iconfont icon-icon_enlarge"></i>
          </div>
        </div>
        <p class="image-name" :title="item.name+'.jpg'" v-if="showImageName">{{item.name}}.jpg</p>
      </div>

      <div v-for="item in 10" :key="0-item" class="image-box">
        <div class="image-back empty-image"></div>
      </div>

    </div>
    <el-pagination
      layout="total,prev, pager, next,jumper"
      @current-change="handleCurrentChange"
      :total="total"
      :current-page="pageNum"
      :page-size="pageSize"
    ></el-pagination>
    <div class="already-select" v-if="showAlreadySelect">
      <p>已选：</p>
      <div class="image-list-card">
        <div v-for="(item,index) in value" :key="index" class="image-box">
          <div
            class="image-back square operate"
            :style="{backgroundImage:`url(${item.url})`,backgroundSize:backgroundSize}"
          >
            <div class="operate-area">
              <i class="el-icon-zoom-in" @click.stop.prevent="handlePictureCardPreview(item)"></i>
              <i class="el-icon-delete" @click.stop.prevent="handleRemove(item)"></i>
            </div>
          </div>
        </div>
        <div v-for="index in 10" :key="0-index" class="image-box">
          <div class="image-back empty-image square"></div>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" width="790px">
      <img style="display: block;max-width: 750px" :src="dialogImageUrl" alt/>
    </el-dialog>
  </div>
</template>
<script>
  import * as axios from "@/util/axios";
  import * as utils from "@/assets/js/utils.js";

  export default {
    props: {
      param: {type: Object, required: true},
      value: {
        type: [String, Array, function (param) {
          return param === null;
        }],
        required: true
      },
      url: String,
      disabled: Boolean,
      // 父组件可能含单选框，标记是否激活状态
      canActive: {
        type: Boolean,
        default: true
      },
      width: {
        type: String,
        default: "1130px"
      },
      type: {
        type: String,
        default: "rectangle" //square
      },
      pageSize: {
        type: Number,
        default: 8
      },
      showLists: {
        type: Boolean,
        default: false
      },
      limits: {
        type: Number,
        default: 1000
      },
      showImageName: {
        type: Boolean,
        default: false
      },
      backgroundSize: {
        type: String,
        default: 'cover'
      }
    },
    data() {
      return {
        utils,
        pageNum: 1,
        total: 0,
        imageLists: [],
        dialogVisible: false,
        dialogImageUrl: "",
        keyWord: ""
      };
    },
    computed: {
      imagesKeys() {
        if (Array.isArray(this.value)) {
          return this.value.map(item => {
            return item.response
              ? item.response.fileKey
              : item.url.split("/").pop();
          });
        } else {
          return this.value;
        }
      },
      showAlreadySelect() {
        return (
          Array.isArray(this.value) && this.value.length > 0 && this.showLists
        );
      }
    },
    mounted() {
      this.getMediaByGroupKey();
    },
    methods: {
      getMediaByGroupKey(keyWord) {
        this.keyWord = keyWord;
        axios
          .post(`/${this.url}`, {
            ...this.param,
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            keyWord: this.keyWord

          })
          .then(res => {
            this.imageLists = res.data.medias || [];
            this.total = res.data.total;
          });
      },
      clickImage(img) {
        if (Array.isArray(this.value)) {
          let hasAlready = this.includesItem(this.value, img);
          if (hasAlready !== undefined) {
            let imgList = JSON.parse(JSON.stringify(this.value));
            imgList.splice(hasAlready, 1);
            this.sendOutData(imgList, img)
          } else {
            if (this.value.length >= this.limits) {
              this.$message({
                type: "warning",
                message: `最多上传${this.limits}张`
              });
              return;
            }
            this.sendOutData([
              ...this.value,
              {
                name: `${Math.random()}`,
                url: utils.formatPicImg(img)
              }
            ], img);
          }
        } else {
          this.sendOutData(img)
        }
      },
      sendOutData(data, img) {
        this.$emit("input", data, img);
        this.$emit("change", data, img)
      },
      handleCurrentChange(num) {
        this.pageNum = num;
        this.getMediaByGroupKey(this.keyWord);
      },
      includesItem(arr, item) {
        for (let i = 0; i < arr.length; i++) {
          let val = arr[i];
          let url = val.response
            ? val.response.fileKey
            : val.url.split("/").pop();
          if (url.includes(item)) {
            return i;
            break;
          }
        }
      },
      handleRemove(img) {
        this.clickImage(
          img.response ? img.response.fileKey : img.url.split("/").pop()
        );
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      imagePreview(img) {
        this.dialogImageUrl = utils.formatPicImg(img.mediaKey);
        this.dialogVisible = true;
      }
    }
  };
</script>
<style lang="scss" scoped>
  .choose-images {
    padding: 15px 0 0;

    .image-list-card {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      .image-box {
        .image-back {
          width: 270px;
          height: 150px;
          border-radius: 8px;
          margin-bottom: 15px;
          position: relative;
          background-position: center;
          background-repeat: no-repeat;
          box-sizing: border-box;
          cursor: pointer;
          transition: background 0.1s;

          .active-style {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 8px;
            box-sizing: border-box;
            border: 2px solid #58c9f3;
            opacity: 0;
            transition: opacity 0.3s;
            overflow: hidden;

            .icon-box {
              display: block;
              position: absolute;
              bottom: 0;
              right: 0;
              width: 50px;
              height: 22px;
              background: #58c9f3;
              font-size: 16px;
              color: #fff;
              transform: rotateZ(-30deg);
              transform-origin: 100% 0;

              .el-icon-check {
                position: absolute;
                bottom: 6px;
                right: 10px;
                color: #fff;
                font-size: 16px;
                transform: rotateZ(30deg);
              }
            }
          }

          .zoom-out {
            position: absolute;
            right: 10px;
            top: 10px;
            width: 31px;
            height: 31px;
            background-color: rgba(0, 0, 0, 0.5);
            border-radius: 50%;
            color: #ffffff;
            line-height: 31px;
            text-align: center;
            transition: all 0.3s;
            opacity: 0;
          }

          &:hover {
            .zoom-out {
              opacity: 1;
            }
          }
        }

        .image-back.empty-image {
          height: 0px;
          margin-top: 0;
          margin-bottom: 0;
        }

        .image-back.operate {
          overflow: hidden;

          .operate-area {
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, .5);
            color: #fff;
            font-size: 20px;
            transition: opacity 0.3s;
            opacity: 0;
            text-align: center;

            .el-icon-zoom-in, .el-icon-delete {
              line-height: 148px;
            }

            .el-icon-delete {
              margin-left: 15px;
            }
          }

          &:hover {
            .operate-area {
              opacity: 1;
            }
          }
        }

        .image-name {
          color: #999999;
          width: 148px;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 37px;
          font-size: 12px;
        }

        .active {
          .active-style {
            opacity: 1;
          }
        }

        .square {
          width: 148px;
          height: 148px;
          border-radius: 8px;
          box-shadow: 0px 2px 4px 0px rgba(189, 206, 255, 0.67);
          margin-bottom: 10px;
        }
      }
    }

    .already-select {
      margin-bottom: 10px;

      p {
        color: #333333;
        line-height: 40px;
      }

      /deep/ .el-upload {
        display: none;
      }

      /deep/ .el-upload-list__item {
        .el-upload-list__item-status-label {
          display: none;
        }
      }
    }
  }
</style>
