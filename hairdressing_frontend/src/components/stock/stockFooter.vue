<template>
  <div class="stockFooter">
    <div class="bottom-buttons">
      <div class="buttons-left">
        <el-button type="primary" class="button-fill" v-if="type == 'List'">批量补货</el-button>
        <el-button type="primary" class="button-disc" v-if="type == 'List'">批量盘点</el-button>
        <el-button type="primary" class="button-audit" v-if="type == 'Out' || type == 'Transfers'">批量审核</el-button>
        <el-button type="primary" class="button-allPrint" v-if="type == 'Out' || type == 'Transfers'">批量打印</el-button>
        <el-button type="primary" class="button-print">导出Excle</el-button>
        <div class="button-delete" v-if="type != 'Out' && type != 'Transfers'">删除</div>
      </div>
      <div class="buttons-right">
        <el-pagination
          :total="total"
          @size-change="sizeChange"
          @current-change="currentChange"
          @prev-click="prevClick"
          @next-click="nextClick"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: String,
    total: Number
  },
  name: "stockFooter",
  data() {
    return {};
  },
  methods: {
    /**
     * 分页
     */
    sizeChange() {
      this.$emit("sizeChange");
    },
    currentChange() {
      this.$emit("currentChange");
    },
    prevClick() {
      this.$emit("prevClick");
    },
    nextClick() {
      this.$emit("nextClick");
    }
  }
};
</script>

<style lang="scss" scoped>
.bottom-buttons {
  width: 98%;
  height: 35px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px;
  .buttons-left {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    .button-fill {
      width: 73px;
      height: 32px;
      background-color: #41cac0;
      border: 0;
      padding: 0;
      border-radius: 3px;
      color: white;
    }
    .button-disc {
      width: 73px;

      height: 32px;
      background-color: #58c9f3;
      border: 0;
      padding: 0;
      border-radius: 3px;
      color: white;

    }
    .button-word {
      width: 73px;
      height: 32px;
      background-color: #f4f5f7;
      color: #676868;
      border: 0;
      padding: 0;
      border-radius: 3px;
    }
    .button-delete {
      width: 73px;
      height: 32px;
      background-color: #ffffff 100%;
      border: 1px solid #e0e3e9;
      font-size: 12px;
      text-align: center;
      line-height: 32px;
      border-radius: 3px;
      margin-left: 10px;
    }
    .button-audit{
      width: 73px;
      height: 32px;
      background-color: #FCB322;
      color: white;
      border: 0;
      padding: 0;
      border-radius: 3px;
    }
    .button-allPrint{
      width: 73px;
      height: 32px;
      background-color: #58C9F3;
      color: white;
      border: 0;
      padding: 0;
      border-radius: 3px;
    }
    .button-print{
      width: 73px;
      height: 32px;
      background-color: #F4F5F7;
      color: #676868;
      border: 0;
      padding: 0;
      border-radius: 3px;
    }
  }
  .buttons-right {
  }
}
</style>