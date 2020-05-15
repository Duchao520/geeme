<template>
  <div>
    <h3>售后评价</h3>
    <div class="table">
      <div class="line">
        <div class="title">总体评分：</div>
        <div class="text score-in-all">
          <span style="margin-right:14px;">{{afterSaleAssessmentInfo.totalScore}}分</span>
          <span style="margin-top:-2px;">
            <score-star :score="afterSaleAssessmentInfo.totalScore"></score-star>
          </span>
        </div>
      </div>
      <div class="line">
        <div class="title">分项评分：</div>
        <div style="display:flex">
          <span style="margin-right:10px;">处理态度</span>
          <score-grade :score="afterSaleAssessmentInfo.attitudeScore"></score-grade>
        </div>
        <div style="display:flex">
          <span style="margin-right:10px;">处理速度</span>
          <score-grade :score="afterSaleAssessmentInfo.speedScore"></score-grade>
        </div>
        <div style="display:flex">
          <span style="margin-right:10px;">处理结果</span>
          <score-grade :score="afterSaleAssessmentInfo.satisfyScore"></score-grade>
        </div>
      </div>
      <div class="line">
        <div class="title">评价正文：</div>
        <div class="store">
          <p style="color:#999999">{{afterSaleAssessmentInfo.createTime}}</p>
          <p style="line-height:20px;">{{afterSaleAssessmentInfo.content}}</p>
          <div>
            <img
              :src="utils.formatPicImg(image,'style',146)"
              alt
              class="images"
              v-for="(image,index) in afterSaleAssessmentInfo.images"
              :key="index"
            >
          </div>
        </div>
      </div>
      <div class="line" v-if="afterSaleAssessmentInfo.reply">
        <div class="title">商家回复：</div>
        <div class="store">
          <p style="color:#999999">{{afterSaleAssessmentInfo.replyTime}}</p>
          <p style="line-height:20px;">{{afterSaleAssessmentInfo.replyContent}}</p>
        </div>
      </div>
      <div class="line textarea" style="margin-top:10px;" v-if="!afterSaleAssessmentInfo.reply">
        <div class="title">回复客户：</div>
        <div class="text button">
          <input-width-count
            v-model="replyToComtumer"
            :autosize="{minRows:3,maxRows:100}"
            placeholder="请输入备注内容"
          ></input-width-count>
          <button class="reply" @click="reply">回复</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as utils from "@/assets/js/utils";
import * as api from "@/assets/js/interface";
import * as axios from "@/util/axios";
export default {
  data() {
    return {
      utils: utils,
      replyToComtumer: ""
    };
  },
  computed: {
    currentInfo() {
      return this.$store.state.manage.currentInfo;
    }
  },
  props: {
    afterSaleAssessmentInfo: Object,
    isProduct: Boolean
  },
  methods: {
    reply() {
      axios.post(
        api.salerReplyCustomerAfterSaleAssessment.URL,
        {
          assessmentId: this.afterSaleAssessmentInfo.id,
          content: this.replyToComtumer,
          storeId: this.currentInfo.shopId
        }
      ).then(res => {
        if (res.success) {
          this.$emit("reload");
        } else {
          this.$message({ type: "warning", message: res.message });
        }
      }) 
    }
  }
};
</script>
<style lang="scss" scoped>
h3 {
  font-size: 14px;
  margin: 12px 0;
}
.table {
  min-width: 760px;
  border: 1px solid #ebecf0;
  box-sizing: border-box;
  padding: 15px 30px 15px;
}
.line {
  display: flex;
  font-size: 12px;
  color: #666666;
  line-height: 35px;
  .title {
    min-width: 60px;
  }
  .score-in-all {
    color: #f52d56;
    display: flex;
    align-items: center;
    .scoreImg {
      width: 75px;
      height: 14px;
      position: relative;
      margin-top: -2px;
      div {
        height: 100%;
        background: red;
      }
      img {
        position: absolute;
        top: 0;
        left: 0;
        width: 75px;
      }
    }
  }
  .text {
    display: flex;
  }
  .button {
    align-items: flex-end;
  }
}
.impressions {
  display: flex;
  align-items: center;
  .impression {
    line-height: 1;
    box-sizing: border-box;
    padding: 7px 15px;
    border: 1px solid #ced4da;
    border-radius: 14px;
    margin-right: 10px;
  }
}
.scores {
  margin-right: 23px;
  .scoresKey {
    color: #f52d56;
    margin-right: 5px;
  }
  .scoresValue {
    color: #c8c7cc;
    margin-right: 5px;
  }
}
.store {
  .images {
    width: 90px;
    height: 90px;
    display: inline-block;
    margin: 10px 10px 0 0;
  }
}
.textarea {
  /deep/ .el-textarea__inner {
    min-width: 400px;
    height: 85px;
    font-size: 12px;
  }
}
.reply {
  width: 62px;
  height: 28px;
  background: #ff6d61;
  border-radius: 3px;
  line-height: 28px;
  text-align: center;
  color: white;
  margin-left: 10px;
  transition: all 0.4s;
  &:hover {
    opacity: 0.8;
  }
}
</style>
