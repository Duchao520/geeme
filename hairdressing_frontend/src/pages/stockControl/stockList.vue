<template>
  <div class="stocklit-wrap">
    <!-- 头部 -->
    <StockHeader type="List"></StockHeader>
    <!-- 导航 -->
    <div class="banner">
      <div class="banner-left">
        <div class="banner-l-top">
          <div>
            <span class="colword">产品分类：</span>
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
            <span class="colword">供应商：</span>

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
            <span class="colword">品牌：</span>

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
            <span class="colword">门店：</span>

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
            <span class="colword">状态：</span>
            <el-select v-model="statusValue" class="colword-count-two" placeholder="请选择">
              <el-option
                v-for="item in status"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>

          <div>
            <span class="colword">销量：</span>
            <div class="colword-count-one">
              <div class="symbol">&gt;</div>
            <el-input v-model="salesValue" placeholder="请输入内容"></el-input>
            </div>
          </div>

          <div>
            <span class="colword">剩余库存：</span>
            <div class="colword-count-one">
              <div class="symbol">&lt;</div>
            <el-input v-model="countValue" placeholder="请输入内容" ></el-input>
            </div>
          </div>

          <div>
            <span class="colword">有效期天数：</span>
            <div class="colword-count-one">
              <div class="symbol">&lt;</div>
            <el-input v-model="dayValue" placeholder="请输入内容" ></el-input>

            </div>
          </div>
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
        <el-table-column label="产品编号">
          <template slot-scope="scope">{{ scope.row.productNumber }}</template>
        </el-table-column>
        <el-table-column prop="productName" label="产品名称"></el-table-column>
        <el-table-column prop="brand" label="品牌" width="65"></el-table-column>
        <el-table-column prop="startTime" label="入库时间" width="100"></el-table-column>
        <el-table-column prop="endTime" label="到期时间"></el-table-column>
        <el-table-column prop="type" label="产品类型"></el-table-column>
        <el-table-column prop="company" label="供应商"></el-table-column>
        <el-table-column prop="buyCount" label="采购数量" width="50"></el-table-column>
        <el-table-column prop="sellCount" label="销售数量" width="50"></el-table-column>
        <el-table-column prop="withCount" label="领用数量" width="50"></el-table-column>
        <el-table-column prop="adjustableCount" label="调拨数量" width="50"></el-table-column>
        <el-table-column prop="count" label="库存剩余" width="50"></el-table-column>
        <el-table-column prop="buyPrice" label="采购价" width="65"></el-table-column>
        <el-table-column prop="buyTotalPrice" label="采购金额" width="80"></el-table-column>
        <el-table-column prop="countPrice" label="库存金额" width="80"></el-table-column>
        <el-table-column prop="price" label="售价" width="50"></el-table-column>
        <el-table-column prop="noCount" label="库存预警" width="50"></el-table-column>
        <el-table-column prop="storeName" label="门店" width="70"></el-table-column>
        <el-table-column prop="notes" label="备注" show-overflow-tooltip></el-table-column>
        <el-table-column prop="status" label="状态" width="70">
          <template slot-scope="scope">
            <div class="statusShow">
              <div class="true" v-if="scope.row.status">合作中</div>
              <div class="false" v-else>终止进货</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <div class="operation">
              <div class="o-editor">
                <span class="icon iconfont icon-icon_operate_edit"></span>
              </div>
              <div class="o-fill">
                <span>补</span>
              </div>
              <div class="o-disc">
                <span>盘</span>
              </div>
              <div class="o-delete">
                <span class="icon iconfont icon-icon_operate_delete"></span>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <StockFooter type='List' :total="tableData3.length"></StockFooter>
    </div>
  </div>
</template>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.stocklit-wrap {
  width: 100%;
  // 头部

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
      .banner-l-top{
        width: 100%;
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        margin-bottom: 15px;
        div{
              width: 60%;
          display: flex;
          flex-wrap: nowrap;
          justify-content: flex-start;
          align-items: center;
        }
      }
      .banner-l-bottom{
        width: 100%;
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        div{
          width: 70%;
          display: flex;
          flex-wrap: nowrap;
          justify-content: flex-start;
          align-items: center;

          .colword-count-two{
          width: 60%;

          }
          .colword-count-one{
          width: 70%;
          display: flex;
          flex-wrap: nowrap;
          justify-content: flex-start;
          align-items: center;
            .symbol {
              width: 17%;
              height: 40px;
              font-size: 14px;
              color: white;
              background-color: #DEE1E6;
              padding-left: 7%;
              line-height: 35px;
              z-index: 999;
            }
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
    // padding: 13px 10px 43px;
  }
}
.colword {
  display: inline-block;
  width: 97px;
  text-align: right;
}
.picker {
  width: 218px;
}
.operation {
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  div {
    width: 28px;
    height: 28px;
    font-size: 13px;
    border-radius: 2px;
    text-align: center;
    line-height: 28px;
    margin-right: 5px;
  }
  .o-editor {
    border: 1px solid #58c9f3;
    color: #58c9f3;
  }
  .o-fill {
    border: 1px solid #75c74f;
    color: #75c74f;
  }
  .o-disc {
    border: 1px solid #41cac0;
    color: #41cac0;
  }
  .o-delete {
    border: 1px solid #bec3c6;
    color: #bec3c6;
  }
}
.statusShow {
  div {
    text-align: center;
    line-height: 17px;
    font-size: 12px;
    color: white;
    border-radius: 15px;
  }
  .true {
    width: 50px;
    height: 17px;
    background-color: #a9d86e;
  }
  .false {
    width: 58px;
    height: 17px;
    background-color: #ff6d61;
  }
}
/deep/.el-input{
    .el-input__inner{
        margin-left: -4px;
    }
}
</style>

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
      //状态
      statusValue: "",
      status: [
        {
          value: "选项1",
          label: "合作中"
        }
      ],

      //销量
      salesValue: "",

      //剩余库存
      countValue: "",
      count: [
        {
          value: "选项1",
          label: "10"
        }
      ],

      //有效期天数
      dayValue: "",
      day: [
        {
          value: "选项1",
          label: "30"
        }
      ],

      //列表
      tableData3: [
        {
          productNumber: "GY2018092902156",
          productName: "施华蔻多效修护19洗发露600ml",
          brand: "施华蔻",
          startTime: "2018/09/28 15:36:39",
          endTime: "2019/12/31",
          type: "洗发水",
          company: "杭州丝悦贸易有限公司",
          buyCount: 568,
          sellCount: 290,
          withCount: 100,
          adjustableCount: 10,
          count: 20,
          buyPrice: 69,
          buyTotalPrice: 34500,
          countPrice: 3103,
          price: 100,
          noCount: 20,
          storeName: "杭州庆春店",
          notes: "洗发水修护受损发质…",
          status: 1
        },
        {
          productNumber: "GY2018092902156",
          productName: "施华蔻多效修护19洗发露600ml",
          brand: "施华蔻",
          startTime: "2018/09/28 15:36:39",
          endTime: "2019/12/31",
          type: "洗发水",
          company: "杭州丝悦贸易有限公司",
          buyCount: 568,
          sellCount: 290,
          withCount: 100,
          adjustableCount: 10,
          count: 20,
          buyPrice: 69,
          buyTotalPrice: 34500,
          countPrice: 3103,
          price: 100,
          noCount: 20,
          storeName: "杭州庆春店",
          notes: "洗发水修护受损发质…",
          status: 1
        },
        {
          productNumber: "GY2018092902156",
          productName: "施华蔻多效修护19洗发露600ml",
          brand: "施华蔻",
          startTime: "2018/09/28 15:36:39",
          endTime: "2019/12/31",
          type: "洗发水",
          company: "杭州丝悦贸易有限公司",
          buyCount: 568,
          sellCount: 290,
          withCount: 100,
          adjustableCount: 10,
          count: 20,
          buyPrice: 69,
          buyTotalPrice: 34500,
          countPrice: 3103,
          price: 100,
          noCount: 20,
          storeName: "杭州庆春店",
          notes: "洗发水修护受损发质…",
          status: 0
        },
        {
          productNumber: "GY2018092902156",
          productName: "施华蔻多效修护19洗发露600ml",
          brand: "施华蔻",
          startTime: "2018/09/28 15:36:39",
          endTime: "2019/12/31",
          type: "洗发水",
          company: "杭州丝悦贸易有限公司",
          buyCount: 568,
          sellCount: 290,
          withCount: 100,
          adjustableCount: 10,
          count: 20,
          buyPrice: 69,
          buyTotalPrice: 34500,
          countPrice: 3103,
          price: 100,
          noCount: 20,
          storeName: "杭州庆春店",
          notes: "洗发水修护受损发质…",
          status: 1
        },
        {
          productNumber: "GY2018092902156",
          productName: "施华蔻多效修护19洗发露600ml",
          brand: "施华蔻",
          startTime: "2018/09/28 15:36:39",
          endTime: "2019/12/31",
          type: "洗发水",
          company: "杭州丝悦贸易有限公司",
          buyCount: 568,
          sellCount: 290,
          withCount: 100,
          adjustableCount: 10,
          count: 20,
          buyPrice: 69,
          buyTotalPrice: 34500,
          countPrice: 3103,
          price: 100,
          noCount: 20,
          storeName: "杭州庆春店",
          notes: "洗发水修护受损发质…",
          status: 1
        },
        {
          productNumber: "GY2018092902156",
          productName: "施华蔻多效修护19洗发露600ml",
          brand: "施华蔻",
          startTime: "2018/09/28 15:36:39",
          endTime: "2019/12/31",
          type: "洗发水",
          company: "杭州丝悦贸易有限公司",
          buyCount: 568,
          sellCount: 290,
          withCount: 100,
          adjustableCount: 10,
          count: 20,
          buyPrice: 69,
          buyTotalPrice: 34500,
          countPrice: 3103,
          price: 100,
          noCount: 20,
          storeName: "杭州庆春店",
          notes: "洗发水修护受损发质…",
          status: 1
        },
        {
          productNumber: "GY2018092902156",
          productName: "施华蔻多效修护19洗发露600ml",
          brand: "施华蔻",
          startTime: "2018/09/28 15:36:39",
          endTime: "2019/12/31",
          type: "洗发水",
          company: "杭州丝悦贸易有限公司",
          buyCount: 568,
          sellCount: 290,
          withCount: 100,
          adjustableCount: 10,
          count: 20,
          buyPrice: 69,
          buyTotalPrice: 34500,
          countPrice: 3103,
          price: 100,
          noCount: 20,
          storeName: "杭州庆春店",
          notes: "洗发水修护受损发质…",
          status: 1
        },
        {
          productNumber: "GY2018092902156",
          productName: "施华蔻多效修护19洗发露600ml",
          brand: "施华蔻",
          startTime: "2018/09/28 15:36:39",
          endTime: "2019/12/31",
          type: "洗发水",
          company: "杭州丝悦贸易有限公司",
          buyCount: 568,
          sellCount: 290,
          withCount: 100,
          adjustableCount: 10,
          count: 20,
          buyPrice: 69,
          buyTotalPrice: 34500,
          countPrice: 3103,
          price: 100,
          noCount: 20,
          storeName: "杭州庆春店",
          notes: "洗发水修护受损发质…",
          status: 1
        },
        {
          productNumber: "GY2018092902156",
          productName: "施华蔻多效修护19洗发露600ml",
          brand: "施华蔻",
          startTime: "2018/09/28 15:36:39",
          endTime: "2019/12/31",
          type: "洗发水",
          company: "杭州丝悦贸易有限公司",
          buyCount: 568,
          sellCount: 290,
          withCount: 100,
          adjustableCount: 10,
          count: 20,
          buyPrice: 69,
          buyTotalPrice: 34500,
          countPrice: 3103,
          price: 100,
          noCount: 20,
          storeName: "杭州庆春店",
          notes: "洗发水修护受损发质…",
          status: 1
        },
        {
          productNumber: "GY2018092902156",
          productName: "施华蔻多效修护19洗发露600ml",
          brand: "施华蔻",
          startTime: "2018/09/28 15:36:39",
          endTime: "2019/12/31",
          type: "洗发水",
          company: "杭州丝悦贸易有限公司",
          buyCount: 568,
          sellCount: 290,
          withCount: 100,
          adjustableCount: 10,
          count: 20,
          buyPrice: 69,
          buyTotalPrice: 34500,
          countPrice: 3103,
          price: 100,
          noCount: 20,
          storeName: "杭州庆春店",
          notes: "洗发水修护受损发质…",
          status: 1
        }
      ],
      multipleSelection: []
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
  }
};
</script>
