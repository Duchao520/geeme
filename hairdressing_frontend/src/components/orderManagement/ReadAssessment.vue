<template>
  <div class="assessment-root">
    <el-dialog title="评价详情" :visible="readAssessmentVisible" width="500px" @close="$emit('close')">
      <el-form ref="evaluateForm" label-width="80px" :model="replyAssessmentData" :rules="rules">
        <el-form-item label="订单商品:">
          <div class="goods-detail">
            <img :src="utils.formatPicImg(goodsDetail.image,'style',40)">
            <div class="detail">
              <p>{{goodsDetail.goodsName}}</p>
              <p>{{goodsDetail.specificationName}}</p>
              <span>￥{{goodsDetail.price}}</span>
            </div>
          </div>
        </el-form-item>
        <!--<el-form-item label="服务时间">
          <span class="assessment-time">12:456454654654</span>
        </el-form-item>
        <el-form-item label="服务者">
          <span>刘建材</span>
        </el-form-item>-->
        <el-form-item label="总体评分">
          <div class="score">
            <span style="margin-right:10px">{{assessmentInfo.totalScore}}分</span>
            <score-star :score="assessmentInfo.totalScore" style="background:#DAD9E2"></score-star>
          </div>
        </el-form-item>
        <el-form-item label="评价正文">
          <div class="comment-detail">
            <p class="assessment-time">{{assessmentInfo.createTime}}</p>
            <p>{{assessmentInfo.content}}</p>
            <div class="comment-imgs">
              <img v-for="(img,index) in assessmentInfo.images" :key="index" :src="utils.formatPicImg(img,'style',40)"
                   alt class="img">
            </div>
          </div>
        </el-form-item>
        <el-form-item label="商家回复" v-if="assessmentInfo.reply">
          <div class="store-reply">
            <p class="assessment-time">{{assessmentInfo.replyTime}}</p>
            <p>{{assessmentInfo.replyContent}}</p>
          </div>
        </el-form-item>
        <el-form-item label="回复客户" v-if="!assessmentInfo.reply" prop="replyContent">
          <input-width-count :autosize="{ minRows: 4, maxRows: 100}"
                             v-model.trim="replyAssessmentData.replyContent"></input-width-count>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="$emit('close')">取消</el-button>
        <el-button v-if="!assessmentInfo.reply" type="primary" @click="confirm">确认回复</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import * as axios from "@/util/axios";
  import * as utils from "@/assets/js/utils";

  export default {
    props: {
      readAssessmentVisible: Boolean,
      goodsType: String
    },
    data() {
      return {
        replyAssessmentData: {
          replyContent: null,
          assessmentId: null
        },
        utils: utils,
        assessmentInfo: {},
        rules: {
          replyContent: [{required: true, message: "回复内容不可以为空",trigger:"blur"}]
        },
        goodsDetail: {
          image: null,
          goodsName: null,
          specificationName: null,
          price: null
        }
      };
    },
    methods: {
      getGoodsOrderAssessmentByOrderId(id) {
        axios.post("/getGoodsOrderAssessmentByOrderId", {
          goodsType: this.goodsType,
          orderId: id
        }).then(res => {
          console.log(res);
          this.assessmentInfo = res.assessmentInfo;
          this.replyAssessmentData.assessmentId = res.assessmentInfo.id;
          this.$emit("open");
        })
      },
      confirm() {
        this.$refs.evaluateForm.validate(valid => {
          if (!valid) {
            console.warn("ERROR SUBMIT!")
          } else {
            console.log("{啊啊啊啊啊啊啊")
            this.$emit('confirm', JSON.parse(JSON.stringify(this.replyAssessmentData)));
            this.replyAssessmentData.replyContent = ""
          }
        })
      }
    }
  };
</script>
<style lang="scss" scoped>
  .assessment-root {
    .el-form-item {
      margin-bottom: 0;

      .goods-detail {
        box-sizing: border-box;
        padding: 10px;
        border: 1px solid #ff6d61;
        border-radius: 5px;
        width: 300px;
        display: flex;
        margin-bottom: 10px;

        img {
          width: 70px;
          height: 70px;
          margin-right: 10px;
          border-radius: 4px;
          display: block;
        }

        .detail {
          font-size: 12px;

          p {
            color: #333333;
            line-height: 16px;
          }

          span {
            color: #ff6d61;
            line-height: 12px;
          }
        }
      }

      .assessment-time {
        color: #999999;
      }

      .score {
        display: flex;
        color: #f52d56;
        align-items: center;
      }

      .comment-detail {
        .comment-imgs {
          display: flex;
          flex-wrap: wrap;
          margin-bottom: 10px;

          .img {
            width: 90px;
            height: 90px;
            display: block;
            margin: 0 10px 10px 0;
          }
        }
      }

      .store-reply {
        margin-bottom: 10px;
      }

      /deep/ .el-form-item__content {
        line-height: 28px;
      }

      /deep/ .el-form-item__label {
        color: #666666;
        font-size: 12px;
        line-height: 28px;
      }
    }
  }
</style>
