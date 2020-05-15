<template>
  <el-dialog
    title="补货"
    :visible="addMoreProductVisible"
    width="500px"
    :before-close="dialogBeforeClose"
  >
    <div class="con">
      <div class="line"></div>
      <el-form ref="form" label-width="160px">
        <el-form-item
          :label="'规格：'+item.specificationName"
          v-for="(item,index) in stockInfo"
          :key="index"
        >
          <div class="item-con">
            <span>库存：</span>
            <number-input v-model="item.stock" width="200px" :min="0"></number-input>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer">
      <el-button @click="addMoreProductVisible = false">取 消</el-button>
      <el-button type="primary" @click="modifyProductStock">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import * as api from "@/assets/js/interface";
import * as axios from "@/util/axios";
export default {
  props: {
    currentAddMoreId: [Object, Number]
  },
  data() {
    return {
      stockInfo: [],
      addMoreProductVisible: false
    };
  },
  methods: {
    dialogBeforeClose() {
      this.addMoreProductVisible = false
    },
    getProductStock(id) {
      axios.put(api.productStock.URL + id, {}).then(res => {
        this.stockInfo = res.stockInfo;
        this.addMoreProductVisible = true;
      });
    },
    modifyProductStock() {
      axios
        .put(api.modifyProductStock.URL, { stockInfo: this.stockInfo })
        .then(res => {
          this.stockInfo = [];
          this.$message({
            type: `${res.success ? "success" : "warning"}`,
            message: res.message
          });
          this.addMoreProductVisible = false;
          this.$emit("update")
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.con {
  margin-top: -20px;
  box-sizing: border-box;
  .line {
    border-top: 1px solid #f0f1f4;
    margin-bottom: 27px;
  }
  .item-con {
    display: block;
    display: flex;
    flex-wrap: nowrap;
  }
}
</style>
