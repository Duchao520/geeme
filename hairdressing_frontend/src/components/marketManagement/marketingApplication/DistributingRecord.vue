<template>
  <div class="root-div">
    <div class="top-date">
      <span style="font-size:14px;color:#333333">派发时间：</span>
      <el-date-picker
        v-model="dateRange"
        unlink-panels
        :default-time="['00:00:00','23:59:59']"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd HH:mm:ss"
      ></el-date-picker>
    </div>
    <distributing-record-table></distributing-record-table>
  </div>
</template>
<script>
import DistributingRecordTable from "./DistributingRecordTable.vue"
export default {
  components: {
    'distributing-record-table':DistributingRecordTable
  },
  data() {
    return {
      dateRange: [],
    };
  },
  methods: {
    
  }
};
</script>
<style lang="scss" scoped>
@mixin button($color, $bg, $border) {
  box-sizing: border-box;
  padding: 0 10px;
  color: $color;
  border: 1px solid $color;
  line-height: 28px;
  border: 1px solid $border;
  border-radius: 4px;
  transition: 0.6s;
  background: $bg;
  &:hover {
    opacity: 0.8;
  }
}
.root-div {
  .top-date {
    box-sizing: border-box;
    padding: 12px 20px;
    background: #ffffff;
    margin: 15px 0;
    box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
    border-radius: 5px;
  }
  .table-main {
    .table {
      box-sizing: border-box;
      padding: 0 10px;
      background: #ffffff;
      /deep/ .el-table__row {
        td {
          padding: 16px 0;
        }
      }
      .buttons {
        width: 150px;
      }
    }
  }
  .button-detail {
    @include button(#75c74f, transparent, #75c74f);
  }
  .button-resend {
    @include button(#58c9f3, transparent, #58c9f3);
  }
  .button-resendd {
    @include button(#fff, #58c9f3, #58c9f3);
  }
  .button-stop {
    @include button(#fff, #ff6d61, #ff6d61);
    margin-left: 18px;
  }
  .bottom {
    box-sizing: border-box;
    padding: 20px;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .pagination{
        /deep/ .btn-prev,/deep/ .btn-next{
            width: 35px;
        }
    }
  }
}
</style>
