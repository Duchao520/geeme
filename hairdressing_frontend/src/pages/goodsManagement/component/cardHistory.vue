<template>
  <div class="card-history">
    <el-table :data="list" :stripe="true">
      <el-table-column prop="cardName" label="卡项名称"></el-table-column>
      <el-table-column label="创建/修改人">
        <template slot-scope="scope">
          <div>
            {{scope.row.userName}}
            <br>
            {{scope.row.userPhone}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="modifyTime" label="创建/修改时间"></el-table-column>
      <el-table-column label="首次充值/售价">
        <template slot-scope="scope">
          <div v-if="scope.row.cardType === 1">￥{{scope.row.cardFirstRechargeNum}}</div>
          <div v-if="scope.row.cardType === 0">￥{{scope.row.cardPrice}}</div>
        </template>
      </el-table-column>
      <el-table-column label="适用门店">
        <template slot-scope="scope">
          <div>{{formatSuitStore(scope.row.suitStoreStrategy)}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="sales" label="销量"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div style="display:flex;align-items:center;">
            <g-button
              class="text-cant-copy"
              @click="goDetail(scope.row)"
              :name="'详情'"
              :type="'green'"
              :icon="'icon_operate_eyes'"
            ></g-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pageNation"
      @current-change="handleCurrentChange"
      :current-page="queryParam.pageNum + 1"
      :page-size="queryParam.pageSize"
      :total="total"
      layout="total, prev, pager, next, jumper"
    ></el-pagination>
  </div>
</template>

<script>
import * as api from "@/assets/js/interface";
import * as axios from "@/util/axios";
export default {
  props: {
    id: Number
    /* 还应该包含 cardType 用以区分显示哪几列 */
  },
  data() {
    return {
      queryParam: {
        cardKindId: this.id,
        pageNum: 0,
        pageSize: 10
      },
      total: 0,
      list: [
        {
          cardName: "至尊卡",
          cardPrice: 1000,
          cardFirstRechargeNum: 500,
          cardType: 0,
          id: 100010, //会员卡种类快照ID,
          modifyTime: "2019-01-23 10:00:12",
          sales: 568, // 会员卡销量
          suitStoreStrategy: 0,
          userName: "熊洪安",
          userPhone: "18958895656"
        },
        {
          cardName: "至尊卡二号",
          cardPrice: 2000,
          cardFirstRechargeNum: 500,
          cardType: 1,
          id: 100010,
          modifyTime: "2019-01-23 10:00:12",
          sales: 568,
          suitStoreStrategy: 1,
          userName: "熊洪安",
          userPhone: "18958895656"
        }
      ],
      cacheMaxId: 0, // 
    };
  },
  mounted() {
    this.getCardHistoryList();
  },
  methods: {
    getCardHistoryList() {
      axios.post(api.pagedQueryCardKindHistory.URL, this.queryParam).then(res => {
        this.list = res.listHistoryCardKindBasicInfo;
        if (this.queryParam.pageNum === 0) {
          this.cacheMaxId = res.listHistoryCardKindBasicInfo[0].id
        }
        this.total = res.total;
      }).catch(err => {
        console.log(err)
      })
    },
    formatSuitStore(type) {
      switch (type) {
        case 0:
          return "所有门店";
        case 1:
          return "所有直营店";
        case 2:
          return "指定门店";
      }
    },
    goDetail(row) {
      this.$emit('change', {id: row.id, cacheMaxId: this.cacheMaxId})
    },
    handleCurrentChange(page) {
      this.queryParam.pageNum = page - 1;
      this.getCardHistoryList();
    }
  }
};
</script>

<style lang="scss" scoped>
.card-history {
  padding: 0 20px 20px 20px;
  .pageNation {
    margin: 14px 0 0 0;
  }
}
</style>