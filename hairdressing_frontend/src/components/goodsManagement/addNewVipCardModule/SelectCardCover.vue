<template>
  <el-form ref="form" :model="form" :rules="rules">
    <!-- 会员卡封面 -->
    <div class="form-line">
      <div class="form-title">
        <span>会员卡封面</span>
      </div>
      <div class="form-con select-card">
        <el-form-item style="width:100%;" prop="cardCover">
          <el-radio-group v-model="cardCoverType">
            <el-radio :label="1">
              <span>从素材库选择</span>
            </el-radio>
            <choose-images
              url="getMediaByGroupKey"
              :value="cardCoverFromStorage"
              :param="{groupKey:5,mediaType:'image'}"
              :pageSize="8"
              :canActive="!!cardCoverType"
              @change="changeCoverFromStorage"
            ></choose-images>

            <el-radio :label="0">
              <span>自定义</span>
            </el-radio>
            <div style="position: relative;margin-top: 15px;">
              <div class="upload-wrapper">
                <g-upload-spic
                  width="180px"
                  height="114px"
                  :size="2"
                  :photo="cardCoverUserDefined"
                  @change="changeCover"
                ></g-upload-spic>
              </div>
              <p class="upload-tip">支持jpg，png格式，大小不超过2M；建议上传460*292px的图片，点击图片可重新上传</p>
            </div>
          </el-radio-group>
        </el-form-item>
      </div>
    </div>
    <!-- 上架时间 -->
    <div class="form-line" v-if="!onEdit">
      <div class="form-title">
        <span class="xing">上架时间</span>
      </div>
      <div class="form-con on-sale-time">
        <el-form-item prop="upperTime">
          <el-radio-group v-model="form.upperImmediately">
            <el-radio :label="true">立即上架</el-radio>
            <el-radio :label="false">指定时间</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-date-picker
          class="date-time"
          v-model="form.upperTime"
          type="datetime"
          placeholder="请选择日期和时间"
          default-time="12:00:00"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
      </div>
    </div>

    <!-- 是否超值推荐 -->
    <div class="form-line" v-if="!onEdit">
      <div class="form-title">
        <span>超值推荐</span>
      </div>
      <div class="form-con">
        <el-form-item>
          <el-checkbox v-model="form.superRecommend">推荐</el-checkbox>
        </el-form-item>
      </div>
    </div>

    <!-- 新增状态下的操作 -->
    <div class="form-line" v-if="!onEdit">
      <div class="form-title"></div>
      <div class="form-con" style="margin-top:20px;">
        <el-button type="primary" @click="submitCard" :loading="submitLoading">发布</el-button>
        <el-button @click="previous">上一步</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </div>

    <!-- 编辑状态下的操作 -->
    <div class="form-line" v-if="onEdit">
      <div class="form-title"></div>
      <div class="form-con" style="margin-top:20px;">
        <el-button type="primary" @click="saveEditCover">确定</el-button>
        <el-button @click="cancelEditCover">取消</el-button>
      </div>
    </div>
  </el-form>
</template>
<script>
import * as axios from "@/util/axios";
import { mapActions, mapState } from "vuex";
import ChooseImages from "@/components/common/ChooseImages";

export default {
  components: { ChooseImages },
  props: {
    firstUseFlag: {
      type: Boolean
    }
  },
  data() {
    return {
      form: {
        cardCover: "",
        upperImmediately: true,
        upperTime: "",
        superRecommend: false
      },
      rules: {
        cardCover: [{ validator: this.validateCardCover, trigger: "submit" }],
        upperTime: [{ validator: this.validateUpperTime, trigger: "submit" }]
      },
      submitLoading: false
    };
  },
  computed: {
    cardKindInfo() {
      return this.$store.state.vipCard.addNewVipCard.cardKindInfo;
    },
    cardType() {
      return this.$store.state.vipCard.addNewVipCard.cardType.type;
    },
    /* 是否处于编辑状态 */
    onEdit() {
      return this.$store.state.vipCard.addNewVipCard.onCardEdit;
    },
    cardCoverUserDefined() {
      return this.$store.state.vipCard.cardCoverUserDefined;
    },
    cardCoverType: {
      set(val) {
        this.setCardCoverType(val);
      },
      get() {
        return this.$store.state.vipCard.cardCoverType;
      }
    },
    cardCoverFromStorage: {
      set(val) {
        this.setCardCoverFromStorage(val);
      },
      get() {
        return this.$store.state.vipCard.cardCoverFromStorage;
      }
    },
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    })
  },
  methods: {
    ...mapActions([
      "setCardCoverUserDefined",
      "setCardCoverType",
      "setCardCoverFromStorage"
    ]),
    /* 退回上一步 */
    previous() {
      this.$emit("vipCardStep", {
        data: "write-card-info",
        firstUseFlag: this.firstUseFlag
      });
    },
    /* 取消新增 */
    cancel() {
      this.$router.push(`/${this.currentEntry}-inner/goods/card-list`);
    },
    changeCover(id) {
      // if (this.cardCoverType) {
      this.form.cardCover = id;
      this.setCardCoverUserDefined(id);
      this.cardCoverType = 0;
      // }
    },
    changeCoverFromStorage(id) {
      if (id == this.cardCoverFromStorage) {
        return this.cardCoverFromStorage = ''
      }
      this.form.cardCover = id;
      this.cardCoverFromStorage = id;
    },
    validateCardCover(rule, value, callback) {
      // if (
      //   (!this.form.cardCoverType && this.form.cardCover) ||
      //   (this.form.cardCoverType && this.cardCoverFromStorage)
      // ) {
      callback();
      // } else {
      //   return callback(new Error("请选择会员卡封面"));
      // }
    },
    validateUpperTime(rule, value, callback) {
      if (!this.form.upperImmediately && this.form.upperTime == "") {
        return callback(new Error("请指定具体上架时间"));
      } else if (!this.form.upperImmediately) {
        const now = new Date().getTime();
        let d = this.form.upperTime.replace(/-/g, "/");
        d = new Date(d).getTime();
        if (d < now) {
          return callback(new Error("上架时间不能早于当前日期"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    submitCard() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let url;
          if (this.cardType === 1) {
            url = "/addPrePaidCardKindInfo";
          } else if (this.cardType === 0) {
            url = "/addIdentityCardKindInfo";
          } else if (this.cardType === 2) {
            url = "/addCountCardKindInfo";
          } else if (this.cardType === 3) {
            url = "/addTimeCardKindInfo";
          }
          let param = this.mergeForm();
          // 次卡共用次数时，将次卡的各服务次数设置为空,否则置空共用次数（必须）!!!
          if (this.cardType === 2) {
            if (param.totalCountLimitStatus) {
              param.listServiceCountInfo.map(v => {
                v.countLimit = null;
              });
            } else {
              param.totalCountLimit = null;
            }
          }
          this.submitLoading = true;
          axios
            .post(url, {
              storeId:
                this.currentEntry === "shop" ? this.currentInfo.shopId : null,
              ...param
            })
            .then(res => {
              this.submitLoading = false;
              if (res.success) {
                this.$message({
                  type: "success",
                  message:
                    this.cardType == 0 || this.cardType == 1
                      ? "新增成功，请前往各门店设置中心对该卡项进行提成设置！"
                      : "新增成功，请前往设置中心对该商品进行提成设置！",
                  duration: 5000
                });
                this.$router.push(
                  `/${this.currentEntry}-inner/goods/card-list`
                );
              }
            })
            .catch(err => {
              this.submitLoading = false;
              console.log(err);
            });
        } else {
          console.log("error");
          return false;
        }
      });
    },
    mergeForm() {
      let param = Object.assign(
        {},
        JSON.parse(JSON.stringify(this.form)),
        JSON.parse(JSON.stringify(this.cardKindInfo))
      );
      Object.keys(param).forEach(i => {
        if (param[i] === "") {
          delete param[i];
        }
        if (param[i] instanceof Array && param[i].length === 0) {
          delete param[i];
        }
      });
      param = {
        ...param,
        cardCover: this.cardCoverType
          ? this.cardCoverFromStorage
          : this.cardCoverUserDefined,
        cardCoverType: this.cardCoverType
      };
      return param;
    },
    saveEditCover() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.previous();
        } else {
          console.log("error");
          return false;
        }
      });
    },
    cancelEditCover() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="scss" scoped>
@keyframes appear {
  form {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.xing {
  &::before {
    content: "* ";
    color: #ff6d61;
  }
}

.form-line {
  display: flex;
  line-height: 40px;

  .form-title {
    width: 140px;
    text-align: right;
    box-sizing: border-box;
    padding-right: 20px;
    color: #666666;
    font-size: 14px;
  }

  .form-con {
    width: 100%;
  }

  .form-con.select-card {
    /deep/ .el-radio-group {
      display: flex;
      flex-direction: column;

      .el-radio {
        margin: 0;
        display: flex;
        min-height: 20px;
        margin-top: 13px;
      }
    }

    .upload-wrapper {
      width: 182px;
      height: 118px;
      overflow: hidden;
    }

    .upload-tip {
      position: absolute;
      left: 196px;
      top: 58px;
      width: 356px;
      line-height: 20px;
      color: #999999;
      font-size: 12px;
    }
  }

  .form-con.on-sale-time {
    display: flex;

    .date-time {
      margin-left: 20px;
      width: 200px;
      height: 40px;
      animation: appear 10s 1 linear;
    }
  }
}
</style>
