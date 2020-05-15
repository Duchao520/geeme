<template>
  <div class="stockOut">
    <!-- 头部 -->
    <StockHeader type="Out"></StockHeader>
    <!-- 导航 -->
    <div class="banner">
      <div class="banner-left">
        <div class="banner-l-top">
          <div>
            <span class="colword">调拨类型：</span>
            <el-select v-model="typeValue" placeholder="请选择">
              <el-option
                v-for="item in type"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div>
            <span class="colword">品牌：</span>

            <el-select v-model="proviceValue" placeholder="请选择">
              <el-option
                v-for="item in provice"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>

          <div>
            <span class="colword">调出门店：</span>

            <el-select v-model="brandValue" placeholder="请选择">
              <el-option
                v-for="item in brand"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>

          <div>
            <span class="colword">调入门店：</span>

            <el-select v-model="storeValue" placeholder="请选择">
              <el-option
                v-for="item in store"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>

        <div class="banner-l-bottom">
          <div>
            <span class="colword">出库时间：</span>
            <el-date-picker
              v-model="time"
              type="daterange"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </div>

          <div>
            <span class="colword">审核状态：</span>
            <el-select v-model="storeValue" placeholder="请选择">
              <el-option
                v-for="item in store"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>

          <div>
            <span class="colword">操作人：</span>
            <el-select v-model="storeValue" placeholder="请选择">
              <el-option
                v-for="item in store"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div style="width:60%"></div>
        </div>
      </div>
      <div class="banner-right">
        <el-button type="primary" class="searchbutton">查询</el-button>
      </div>
    </div>
    <!-- 列表 -->
    <div class="body">
      <el-table
        ref="multipleTable"
        :data="tableData3"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        stripe
      >
        <el-table-column type="selection" show-overflow-tooltip></el-table-column>
        <el-table-column label="调拨单号" width="150">
          <template slot-scope="scope">{{ scope.row.productNumber }}</template>
        </el-table-column>
        <el-table-column prop="productName" label="产品名称"></el-table-column>
        <el-table-column prop="brand" label="品牌" width="65"></el-table-column>
        <el-table-column prop="endTime" label="调拨时间" width="100"></el-table-column>
        <el-table-column prop="type" label="调拨类型" width="80"></el-table-column>
        <el-table-column prop="replenishPrice" label="进货价格" width="80"></el-table-column>


        <el-table-column prop="transfersCount" label="调拨数量" width="80"></el-table-column>
        <el-table-column prop="transfersPrice" label="调拨金额" width="80"></el-table-column>
        <el-table-column prop="outStore" label="调出门店" width="100"></el-table-column>
        <el-table-column prop="enterStore" label="调入门店" width="100"></el-table-column>
        <el-table-column prop="controlPeople" label="操作人" width="80"></el-table-column>
        <el-table-column prop="auditPeople" label="审核人" width="80"></el-table-column>
        <el-table-column prop="status" label="审核状态" width="80">
            <template slot-scope="scope">
                <div :class="{through:true,ok:scope.row.status == '已审核',no:scope.row.status == '待审核'}">
                    {{scope.row.status}}
                </div>
            </template>
        </el-table-column>


        <el-table-column prop="notes" label="备注" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div class="operation">
              <div class="o-editor">
                <span class="icon iconfont icon-icon_ope_review"></span>
                <div class="o-editor-aduit">审核</div>
              </div>
              <div class="o-print">
                <span class="icon iconfont icon-icon_ope_print"></span>
                <div class="o-print-text">打印</div>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <StockFooter type="Transfers" :total="tableData3.length"></StockFooter>
    </div>
  </div>
</template>
<script>
import StockHeader from "@/components/stock/stockHeader";
import StockFooter from "@/components/stock/stockFooter";

export default {
  components: {
    StockHeader,
    StockFooter
  },
  data() {
    return {
      // 产品分类
      type: [
        {
          value: "选项1",
          label: "洗发水"
        }
      ],
      typeValue: "",
      // 供应商
      proviceValue: "",
      provice: [
        {
          value: "选项1",
          label: "杭州丝悦贸易有..."
        }
      ],
      //品牌
      brandValue: "",
      brand: [
        {
          value: "选项1",
          label: "施华蔻"
        }
      ],
      //门店
      storeValue: "",
      store: [
        {
          value: "选项1",
          label: "杭州 庆春店"
        }
      ],
      //入库时间
      time: "",

      //入库数量
      countValue: "",
      count: [
        {
          value: "选项1",
          label: "10"
        }
      ],

      //剩余库存
      dayValue: "",
      day: [
        {
          value: "选项1",
          label: "30"
        }
      ],

      //列表
      //列表
      tableData3: [
        {
          productNumber: "GY2018092902156",
          productName: "施华蔻多效修护19洗发露600ml",
          brand: "施华蔻",
          startTime: "2018/09/28 15:36:39",
          endTime: "2019/12/31",
          type: "借调",
          replenishPrice:'￥69',
          transfersCount:10,
          transfersPrice:'￥690',
          outStore:'杭州文一店',
          enterStore:'杭州庆春店',
          controlPeople:'李雯',
          auditPeople:'刘先美',
          status:'已审核',
          notes: "双11特价促销"
        },
          {
          productNumber: "GY2018092902156",
          productName: "施华蔻多效修护19洗发露600ml",
          brand: "施华蔻",
          startTime: "2018/09/28 15:36:39",
          endTime: "2019/12/31",
          type: "借调",
          replenishPrice:'￥69',
          transfersCount:10,
          transfersPrice:'￥690',
          outStore:'杭州文一店',
          enterStore:'杭州庆春店',
          controlPeople:'李雯',
          auditPeople:'刘先美',
          status:'待审核',
          notes: "双11特价促销"
        },
          {
          productNumber: "GY2018092902156",
          productName: "施华蔻多效修护19洗发露600ml",
          brand: "施华蔻",
          startTime: "2018/09/28 15:36:39",
          endTime: "2019/12/31",
          type: "借调",
          replenishPrice:'￥69',
          transfersCount:10,
          transfersPrice:'￥690',
          outStore:'杭州文一店',
          enterStore:'杭州庆春店',
          controlPeople:'李雯',
          auditPeople:'刘先美',
          status:'已审核',
          notes: "双11特价促销"
        },
          {
          productNumber: "GY2018092902156",
          productName: "施华蔻多效修护19洗发露600ml",
          brand: "施华蔻",
          startTime: "2018/09/28 15:36:39",
          endTime: "2019/12/31",
          type: "借调",
          replenishPrice:'￥69',
          transfersCount:10,
          transfersPrice:'￥690',
          outStore:'杭州文一店',
          enterStore:'杭州庆春店',
          controlPeople:'李雯',
          auditPeople:'刘先美',
          status:'已审核',
          notes: "双11特价促销"
        },
          {
          productNumber: "GY2018092902156",
          productName: "施华蔻多效修护19洗发露600ml",
          brand: "施华蔻",
          startTime: "2018/09/28 15:36:39",
          endTime: "2019/12/31",
          type: "借调",
          replenishPrice:'￥69',
          transfersCount:10,
          transfersPrice:'￥690',
          outStore:'杭州文一店',
          enterStore:'杭州庆春店',
          controlPeople:'李雯',
          auditPeople:'刘先美',
          status:'已审核',
          notes: "双11特价促销"
        },
          {
          productNumber: "GY2018092902156",
          productName: "施华蔻多效修护19洗发露600ml",
          brand: "施华蔻",
          startTime: "2018/09/28 15:36:39",
          endTime: "2019/12/31",
          type: "借调",
          replenishPrice:'￥69',
          transfersCount:10,
          transfersPrice:'￥690',
          outStore:'杭州文一店',
          enterStore:'杭州庆春店',
          controlPeople:'李雯',
          auditPeople:'刘先美',
          status:'已审核',
          notes: "双11特价促销"
        },
          {
          productNumber: "GY2018092902156",
          productName: "施华蔻多效修护19洗发露600ml",
          brand: "施华蔻",
          startTime: "2018/09/28 15:36:39",
          endTime: "2019/12/31",
          type: "借调",
          replenishPrice:'￥69',
          transfersCount:10,
          transfersPrice:'￥690',
          outStore:'杭州文一店',
          enterStore:'杭州庆春店',
          controlPeople:'李雯',
          auditPeople:'刘先美',
          status:'已审核',
          notes: "双11特价促销"
        },
          {
          productNumber: "GY2018092902156",
          productName: "施华蔻多效修护19洗发露600ml",
          brand: "施华蔻",
          startTime: "2018/09/28 15:36:39",
          endTime: "2019/12/31",
          type: "借调",
          replenishPrice:'￥69',
          transfersCount:10,
          transfersPrice:'￥690',
          outStore:'杭州文一店',
          enterStore:'杭州庆春店',
          controlPeople:'李雯',
          auditPeople:'刘先美',
          status:'已审核',
          notes: "双11特价促销"
        },
          {
          productNumber: "GY2018092902156",
          productName: "施华蔻多效修护19洗发露600ml",
          brand: "施华蔻",
          startTime: "2018/09/28 15:36:39",
          endTime: "2019/12/31",
          type: "借调",
          replenishPrice:'￥69',
          transfersCount:10,
          transfersPrice:'￥690',
          outStore:'杭州文一店',
          enterStore:'杭州庆春店',
          controlPeople:'李雯',
          auditPeople:'刘先美',
          status:'已审核',
          notes: "双11特价促销"
        }
      ],
    };
  },
  methods: {
      searchChange(value) {
      console.log(value);
    },

    /**
     * 列表方法
     */
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  },
};
</script>
<style lang="scss" scoped>
*{
    box-sizing: border-box;
}
.stockOut {
    width: 100%;
  .banner {
    width: 100%;
    // height: 131px;
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
    border-radius: 6px;
    padding: 12px 30px 18px;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    margin-bottom: 20px;
    .banner-left {
      width: 86%;
      border-right: 1px solid #f0f1f4;
      padding-right: 20px;
      .banner-l-top {
        width: 100%;
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        margin-bottom: 15px;
        div {
          width: 60%;
          display: flex;
          flex-wrap: nowrap;
          justify-content: flex-start;
          align-items: center;
          .colword {
            display: inline-block;
            width: 97px;
            text-align: right;
          }
        }
      }
      .banner-l-bottom {
        width: 100%;
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        div {
          width: 60%;
          display: flex;
          flex-wrap: nowrap;
          justify-content: flex-start;
          align-items: center;
          .colword {
            display: inline-block;
            width: 97px;
            text-align: right;
          }
        }
      }
    }
    .banner-right {
      width: 14%;
      height: 94px;
      position: relative;
      .searchbutton {
        height: 35px;
        border: 0;
        background-color: #58c9f3;
        position: absolute;
        bottom: 0;
        left: 30px;
      }
    }
  }
  .body {
    width: 100%;
    min-height: 718px;
    border-radius: 6px;
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 0px -1px 4px 0px rgba(174, 184, 229, 0.3);
    padding: 13px 10px 43px;
    .bottom-buttons {
      width: 100%;
      height: 35px;
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
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
        }
        .button-disc {
          width: 73px;

          height: 32px;
          background-color: #58c9f3;
          border: 0;
          padding: 0;
          border-radius: 3px;
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
      }
      .buttons-right {
      }
    }
  }
}
.operation {
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  div {
    // width: 28px;
    height: 28px;
    font-size: 13px;
    border-radius: 2px;
    text-align: center;
    line-height: 28px;
    margin-right: 5px;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
  }
  .o-editor {
      padding-left: 7px;
      padding-right: 7px;

    border: 1px solid #75C74F;
    color: #75C74F;
  }

  .o-print {
      padding-left: 7px;
      padding-right: 7px;


    border: 1px solid #FF6D61;
    color: #FF6D61;
  }
}

.through{
    width: 50px;
    border-radius: 15px;
    font-size: 12px;
    color: white;
    text-align: center;
    line-height: 16px;
    &.ok{
        background-color: #A9D86E;
    }
    &.no{
        background-color: #FF6D61;

    }
}
</style>
