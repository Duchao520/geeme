<template>
  <div>
    <h3>评价记录</h3>
    <div class="table">
      <div class="line">
        <div class="title">总体评分：</div>
        <div class="text score-in-all">
          <span style="margin-right:14px;">{{assessmentInfo.assessmentInfo.totalScore}}分</span>
          <span style="margin-top:-2px;">
            <score-star :score="assessmentInfo.assessmentInfo.totalScore"></score-star>
          </span>
        </div>
      </div>
      <div class="line" v-if="!isProduct">
        <div class="title">分项评分：</div>
        <div style="display:flex">
          <span style="margin-right:10px;">专业度</span>
          <score-grade :score="assessmentInfo.assessmentInfo.professionScore"></score-grade>
        </div>
        <div style="display:flex">
          <span style="margin-right:10px;">环境</span>
          <score-grade :score="assessmentInfo.assessmentInfo.environmentScore"></score-grade>
        </div>
        <div style="display:flex">
          <span style="margin-right:10px;">服务</span>
          <score-grade :score="assessmentInfo.assessmentInfo.serviceScore"></score-grade>
        </div>
      </div>
      <div class="line" v-if="isProduct">
        <div class="title">分项评分：</div>
        <div style="display:flex">
          <span style="margin-right:10px;">商品质量</span>
          <score-grade :score="assessmentInfo.assessmentInfo.productQuality"></score-grade>
        </div>
        <div style="display:flex">
          <span style="margin-right:10px;">发货速度</span>
          <score-grade :score="assessmentInfo.assessmentInfo.deliverSpeed"></score-grade>
        </div>
        <div style="display:flex">
          <span style="margin-right:10px;">快递物流</span>
          <score-grade :score="assessmentInfo.assessmentInfo.express"></score-grade>
        </div>
      </div>
      <div class="line impressions">
        <div class="title">印象标签：</div>
        <div
          class="impression"
          v-for="(item,index) in (assessmentInfo.assessmentInfo.tagInfos || [])"
          :key="index"
        >{{item.tag}}</div>
      </div>
      <div class="line" v-if="!isProduct">
        <div class="title">服务者：</div>
        <div class="text">
          <span style="margin-right:10px;">{{assessmentInfo.serverInfo.nickName}}</span>
          <score-grade :score="assessmentInfo.assessmentInfo.serverScore"></score-grade>
        </div>
      </div>
      <div class="line">
        <div class="title">评价正文：</div>
        <div class="store">
          <p style="color:#999999">{{assessmentInfo.assessmentInfo.createTime}}</p>
          <p style="line-height:20px;">{{assessmentInfo.assessmentInfo.content}}</p>
          <div>
            <img
              :src="utils.formatPicImg(image,'style',146)"
              alt
              class="images"
              v-for="(image,index) in assessmentInfo.assessmentInfo.images"
              :key="index"
            >
          </div>
        </div>
      </div>
      <div class="line" v-if="assessmentInfo.assessmentInfo.reply">
        <div class="title">商家回复：</div>
        <div class="store">
          <p style="color:#999999">{{assessmentInfo.assessmentInfo.replyTime}}</p>
          <p style="line-height:20px;">{{assessmentInfo.assessmentInfo.replyContent}}</p>
        </div>
      </div>
      <div
        class="line textarea"
        style="margin-top:10px;"
        v-if="!assessmentInfo.assessmentInfo.reply"
      >
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
  props: {
    assessmentInfo: Object,
    isProduct: Boolean
  },
  methods: {
    reply() {
      axios
        .post(api.replyAssessment.URL, {
          assessmentId: this.assessmentInfo.assessmentInfo.id,
          replyContent: this.replyToComtumer
        })
        .then(res => {
          if (res.success) {
            this.$emit("reload");
          } else {
            this.$message({ type: "warning", message: res.message });
          }
        });
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
