<template>
  <div class="stockOut">
    <!-- 头部 -->
    <StockHeader type="Supplier"></StockHeader>
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
        <el-table-column prop="supplierName" label="供应商名称" ></el-table-column>
        <el-table-column prop="produceType" label="产品类型" width="100"></el-table-column>
        <el-table-column prop="brandName" label="主营品牌" width="100"></el-table-column>
        <el-table-column prop="startTime" label="合作开始时间"></el-table-column>
        <el-table-column prop="supplierType" label="供应商类型" width="100"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column prop="phone" label="电话"></el-table-column>
        <el-table-column prop="chargePeople" label="负责人"></el-table-column>
        <el-table-column prop="contactPeople" label="联系人"></el-table-column>
        <el-table-column prop="notes" label="备注" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div class="operation">
              <div class="o-editor">
                <span class="icon iconfont icon-icon_operate_edit"></span>
                <div class="o-editor-aduit">编辑</div>
              </div>
              <div class="o-print">
                <span class="icon iconfont icon-icon_operate_delete"></span>
                <div class="o-print-text">删除</div>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
     <StockFooter type="Supplier" :total="tableData3.length"></StockFooter>
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
          supplierName: "广州博柔化妆品有限公司",
          produceType: "洗护类",
          brandName: "博柔",
          startTime: "2018/09/28",
          supplierType: "厂家",
          address: "广州市海珠区红卫新村西路29号A7栋（整栋）",
          phone:'020-61191863',
          chargePeople:'张洪奎13893737111',
          contactPeople:'张洪奎13893737111',
          notes: "每年12月举行展会"
        },
          {
          supplierName: "广州博柔化妆品有限公司",
          produceType: "洗护类",
          brandName: "博柔",
          startTime: "2018/09/28",
          supplierType: "厂家",
          address: "广州市海珠区红卫新村西路29号A7栋（整栋）",
          phone:'020-61191863',
          chargePeople:'张洪奎13893737111',
          contactPeople:'张洪奎13893737111',
          notes: "每年12月举行展会"
        },
          {
          supplierName: "广州博柔化妆品有限公司",
          produceType: "洗护类",
          brandName: "博柔",
          startTime: "2018/09/28",
          supplierType: "厂家",
          address: "广州市海珠区红卫新村西路29号A7栋（整栋）",
          phone:'020-61191863',
          chargePeople:'张洪奎13893737111',
          contactPeople:'张洪奎13893737111',
          notes: "每年12月举行展会"
        },
          {
          supplierName: "广州博柔化妆品有限公司",
          produceType: "洗护类",
          brandName: "博柔",
          startTime: "2018/09/28",
          supplierType: "厂家",
          address: "广州市海珠区红卫新村西路29号A7栋（整栋）",
          phone:'020-61191863',
          chargePeople:'张洪奎13893737111',
          contactPeople:'张洪奎13893737111',
          notes: "每年12月举行展会"
        },
          {
          supplierName: "广州博柔化妆品有限公司",
          produceType: "洗护类",
          brandName: "博柔",
          startTime: "2018/09/28",
          supplierType: "厂家",
          address: "广州市海珠区红卫新村西路29号A7栋（整栋）",
          phone:'020-61191863',
          chargePeople:'张洪奎13893737111',
          contactPeople:'张洪奎13893737111',
          notes: "每年12月举行展会"
        },
          {
          supplierName: "广州博柔化妆品有限公司",
          produceType: "洗护类",
          brandName: "博柔",
          startTime: "2018/09/28",
          supplierType: "厂家",
          address: "广州市海珠区红卫新村西路29号A7栋（整栋）",
          phone:'020-61191863',
          chargePeople:'张洪奎13893737111',
          contactPeople:'张洪奎13893737111',
          notes: "每年12月举行展会"
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

  .body {
    width: 100%;
    min-height: 718px;
    border-radius: 6px;
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 0px -1px 4px 0px rgba(174, 184, 229, 0.3);
    padding: 13px 10px 43px;
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

    border: 1px solid #58C9F3;
    color: #58C9F3;
  }

  .o-print {
      padding-left: 7px;
      padding-right: 7px;


    border: 1px solid #BEC3C6;
    color: #BEC3C6;
  }
}

</style>
