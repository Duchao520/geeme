<template>
    <el-dialog
    :visible="visible"
    width="500px"
    @close="$emit('close')"
    append-to-body
    custom-class="custom-class"
  >
    <h6 slot="title" class="title">选择规格</h6>
    <div class="body-content">
      <el-button
        v-for="(item, index) in specificationInfoList"
        :key="index"
        @click="choose(index)"
        class="specification-info"
        :class="[currentIndex === index ? 'active' : '']"
        :disabled="item.stock===0"
      >
        <div :class="[type==='service'?'service-button':'production-button']">
          <p>{{item.name}}</p>
          <p v-if="type==='production'">库存：{{item.stock}}件</p>
          <p>￥{{item.memberPrice}}</p>
        </div>
      </el-button>
    </div>

    <div class="footer" slot="footer">
      <div class="specificate-num">
        <span>数量</span>
        <input-number :max="10" :min="1" v-model="amount"></input-number>
      </div>
      <div>
        <el-button class="plain_gray_btn" @click="$emit('close')">取消</el-button>
        <el-button class="normal_blue_btn" @click="confirm">确定</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { mapActions, mapState } from "vuex";

export default {
  props: {
    specificationInfoList: {
      type: Array,
      default: () => {
        return []
      }
    },
    type: String,
    visible: Boolean
  },
  data() {
    return {
      currentIndex: 0, // 存放激活和未激活状态
      amount: 1, // 数量
    };
  },
  methods: {
    choose(index) {
      this.currentIndex = index;
    },
    confirm() {
      let choosedSpecification = this.specificationInfoList[this.currentIndex];
      // if (choosedSpecification.stock <= 0) {
      //   return this.$message({ type: 'error', message: '库存不足' })
      // } else {
      //   this.$emit('addToCart', {idx: this.currentIndex, num: this.amount})
      // }
      // 产品库存数不足处理
        let flag = false;
        if (choosedSpecification.stock <= 0) {
          flag = true;
        }
        this.billInfo.selectedGoods.map(i => {
          if (choosedSpecification.id == i.specificationId) {
            if (choosedSpecification.stock <= i.count) {
              flag = true;
            }
          }
        });
        if (flag) return this.$message.error("库存不足");
        this.$emit('addToCart', {idx: this.currentIndex, num: this.amount})
      this.amount = 1;
    }
  },
  computed: {
    ...mapState({
      billInfo: state => state.bill,
      currentInfo: state => state.manage.currentInfo
    }),
  },
  watch: {
    specificationInfoList: {
      handler(val) {
        for (let i = 0; i < val.length; i++) {
          let item = val[i];
          if (item.stock === undefined) {
            break
          } else {
            if (item.stock > 0) {
              this.currentIndex = i;
              break;
            }
          }
        }
      },
      immediate: true
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
@mixin one-line($w){
  width: $w;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/deep/ .el-dialog__header {
  padding: 4px 20px 0;
  border-bottom: 1px solid #F0F1F4;
}

.custom-class {

  .title {
    @include font-style(56px, 18px, #333333);
  }

  .body-content {
    height: 200px;
    overflow-y: auto;
    @include scroll-bar(4px, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1));
    .specification-info {
      width: 100%;
      height: 40px;
      border-radius: 4px;
      margin: 0 0 10px 0;
      color: #999999;
      padding: 12px;
      .service-button,.production-button{
        display: flex;
        justify-content: space-between;
      }
      .service-button{
        p:nth-child(1){
          @include one-line(350px);
          text-align: left;
        }
      }
      .production-button{
        p:nth-child(1){
          @include one-line(215px);
          text-align: left;
        }
        p:nth-child(2){
          width: 100px;
          text-align: left;
        }
        p:nth-child(3){
          flex: 1;
          text-align: right;
        }
      }
    }

    .active.specification-info {
      background: #FF6D61;
      color: #fff;
      border-color: #FF6D61;
    }
  }

  .footer {
    display: flex;
    justify-content: space-between;

    span {
      @include font-style(20px, 14px, #666666);
      margin-right: 20px;
    }
  }
}
</style>
