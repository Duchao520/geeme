<template>
  <el-dialog
    width="600px"
    class="card-rights"
    :visible="visible"
    @close="$emit('close')"
    append-to-body
  >
    <h6 class="title" slot="title">享受权益</h6>
    <!-- 次卡 服务数组-->
    <el-table
      v-if="cardInfo.cardType === 2"
      :data="list"
      cell-class-name="cell-class-name"
      header-row-class-name="header-row-class-name"
      :show-summary="cardInfo.totalCountLimit>0"
      :summary-method="getSummaries"
      height="420px"
      style="width: 100%"
    >
      <el-table-column prop="serviceName" label="服务项目" width="180"></el-table-column>
      <el-table-column prop="serviceSpecificationName" label="规格" width="180"></el-table-column>
      <el-table-column prop="countLimit" label="使用后剩余次数">
        <template slot-scope="scope">
          <span v-if="scope.row.countLimit">{{scope.row.countLimit}}次</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 时间卡 服务数组-->
    <el-table
      v-if="cardInfo.cardType === 3"
      :data="list"
      cell-class-name="cell-class-name"
      header-row-class-name="header-row-class-name"
      height="420px"
      style="width: 100%"
    >
      <el-table-column prop="serviceName" label="服务项目" width="180"></el-table-column>
      <el-table-column prop="serviceSpecificationName" label="规格" width="180"></el-table-column>
      <el-table-column prop="countLimit" label="剩余次数">
        <template slot-scope="scope">
          <span v-if="scope.row.countLimit">{{scope.row.countLimit}}次</span>
          <span v-else>无限次</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 身份卡 -->
    <!-- 储值卡 -->
    <template v-if="cardInfo.cardType === 0 || cardInfo.cardType === 1">
      <!-- 这里后端暂时没给数据 -->
      <!-- listProductCardDiscountInfo ,  listServiceCardDiscountInfo-->
      <el-table v-if="cardInfo.cardDiscountStrategy === 2"></el-table>
      <div v-else>
        <p>所有服务{{cardInfo.cardDiscountStrategy === 0 ? '不打' : cardInfo.cardServiceDiscount}}折</p>
        <p>所有产品{{cardInfo.cardDiscountStrategy === 0 ? '不打' : cardInfo.cardProductDiscount}}折</p>
      </div>
    </template>
  </el-dialog>
</template>
<script>
import { deflate } from "zlib";
export default {
  props: {
    visible: Boolean,
    cardInfo: Object
  },
  computed: {
    list() {
      return this.cardInfo.listServiceCountInfo;
    }
  },
  created() {
    // console.log(this.cardInfo)
    // console.log(this.list)
  },
  methods: {
    getSummaries(param) {
      const { columns } = param;
      let sums = [];
      columns.forEach(() => {
        sums[0] = "共用次数";
        sums[2] = this.cardInfo.totalCountLimit + "次";
      });
      return sums;
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .el-dialog__header {
  padding: 0 20px;
  border-bottom: 1px solid #f0f1f4;

  .title {
    line-height: 56px;
    font-size: 18px;
    color: #333333;
  }
}

/deep/ .el-dialog__body {
  .header-row-class-name {
    th {
      background: #f0f2f5;
      color: #333333;
    }
  }

  .cell-class-name {
    color: #333333;
  }
  /deep/ .has-gutter {
    .is-leaf {
      color: #333333;
    }
  }
}
</style>
