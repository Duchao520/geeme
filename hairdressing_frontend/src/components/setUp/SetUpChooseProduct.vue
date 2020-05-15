<template>
  <el-dialog title="选择商品" :visible="chooseProductVisible" width="800px" :before-close="handleClose">
    <div class="line"></div>
    <div class="search" v-if='selectGoodsTitle !="details"'>
      <el-select v-model="optionsFirstValue" placeholder="一级分类" style="width:140px;">
        <el-option
          v-for="(item,index) in classification"
          :key="index"
          :label="item.sortName"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-select
        v-model="optionsSecondValue"
        placeholder="二级分类"
        @change="changeSortTwo"
        style="margin-left:10px;width:140px"
      >
        <el-option
          v-for="(item,index) in secondary"
          :key="index"
          :label="item.sortName"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-input
        placeholder="搜索商品名称 "
        v-model="keyword"
        style="width:220px;float:right;margin-right: 40px"
        @keydown.native="keydown_search"
      >
        <div slot="append" @click="search">
          <i style="margin-right:2px;" class="icon iconfont icon-icon_search"></i>
        </div>
      </el-input>
    </div>
    <div class='tabelList'>
      <el-table v-if='chooseProductVisible' :data="product" class="pro-list" :header-cell-style="{background:'#F4F5F7',borderBottom: 'none'}">
        <el-table-column width="52px" type="selection" prop='checked' v-if='selectGoodsTitle !="details"'>
          <!-- <template slot-scope="scope">
            <el-checkbox v-model="scope.row.checked"></el-checkbox>
          </template> -->
        </el-table-column>
        <el-table-column prop="serviceName" label="商品名称"></el-table-column>
        <el-table-column prop="specificationName" label="规格"></el-table-column>
        <el-table-column prop="shopPrice" label="售价"></el-table-column>
        <el-table-column prop="performanceCost" label="扣成本">
          <template slot-scope="scope">
            <div :class="setInMany&&scope.row.checked?['deductCost','deductCost-blue']:['deductCost','deductCost-grey']" >
              <el-input class="num-input" :disabled='selectGoodsTitle =="details"' placeholder="0" v-model.number="scope.row.performanceCost">
                <template slot="append" style='width:40px;padding:0;text-align:center'>元</template>
              </el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="setTime" width='180' label="设置时间" v-if='selectGoodsTitle =="details"'></el-table-column>
      </el-table>
    </div>
    <div class="pro-list" v-if='false'>
      <div class="list-item firstline">
        <div class="checked"></div>
        <div class="name">商品名称</div>
        <div class="specifications">规格</div>
        <div class="price">商品价格</div>
        <div class="deductCost">业绩成本</div>
        <div class="time">设置时间</div>
      </div>
      <div class="list-item" v-for="(item,index) in product" :key="index">
        <div class="checked">
          <el-checkbox v-model="item.checked"></el-checkbox>
        </div>
        <div class="name">{{item.serviceName}}</div>
        <div class="specifications">{{item.specificationName}}</div>
        <div class="price">{{item.shopPrice}}</div>
        <div
          :class="setInMany&&item.checked?['deductCost','deductCost-blue']:['deductCost','deductCost-grey']"
        >
          <el-input class="num-input" placeholder="80" v-model.number="item.performanceCost">
            <template slot="append">元</template>
          </el-input>
        </div>
        <div class="time">{{item.setTime}}</div>
      </div>
    </div>
    <div class="list-item bottom-line">
      <div style="display: flex;align-items: center;" v-if='selectGoodsTitle !="details"'>
        <div class="checked">
          <el-checkbox v-model="allChecked" @change="changeAllChecked">全选</el-checkbox>
        </div>
        <div
          :class="setInMany?['set-many','set-many-active']:['set-many','set-many-common']"
          @click="setInMany=!setInMany"
        >
          <i style="margin-right:2px;" class="icon iconfont icon-info_set"></i>
          <span>批量设置</span>
        </div>
        <div class="num-input-box">
          <el-input
            class="num-input"
            placeholder="80"
            maxlength="4"
            v-model.number="cost"
            @input="setInManyInput"
          >
            <template slot="append">元</template>
          </el-input>
        </div>
      </div>
      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          :page-size="pageParam.pageSize"
          :current-page="pageParam.currentPage"
          layout="total, prev, pager, next"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <span slot="footer" class="dialog-footer" v-if='selectGoodsTitle !="details"'>
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { mapState } from "vuex";
import * as api from "@/assets/js/interface";
import * as axios from "@/util/axios";
export default {
  props: {
    chooseProductVisible: Boolean,
    selectGoodsTitle: String
  },
  data() {
    return {
      optionsFirstValue: null,
      optionsSecondValue: null,
      keyword: "",
      allChecked: false,
      cost: 0,
      setInMany: false,
      //props:
      product: [
        {
          performanceCost: 0,
          serviceName: null,
          setTime: null,
          shopPrice: null,
          specificationId: null,
          specificationName: null
        }
      ],
      classification: [],
      pageParam: {
        currentPage: 1,
        pageSize: 10
      },
      total: 0
    };
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo
    }),
    secondary() {
      for (let i = 0; i < this.classification.length; i++) {
        if (this.classification[i].id === this.optionsFirstValue) {
          return this.classification[i].sortTwo;
        }
      }
    },
    getStoreServiceListForPerformanceCostParam() {
      return {
        keyword: this.keyword,
        pageParam: this.pageParam,
        sortOne: this.optionsFirstValue,
        sortTwo: this.optionsSecondValue,
        storeId: this.currentInfo.shopId
      };
    }
  },
  mounted() {
    this.getStoreSortInfo();
    this.getStoreServiceListForPerformanceCost();
  },
  methods: {
    getStoreSortInfo() {
      axios.get(
        api.getStoreSortInfo.URL + this.currentInfo.brandId
      ).then(res => {
        this.getStoreSortInfoRes(res)
      })
    },
    getStoreSortInfoRes(res) {
      console.log(res);
      this.classification = res.sortInfos;
    },
    getStoreServiceListForPerformanceCost() {
      // axios.post(
      //   api.getStoreServiceListForPerformanceCost.URL,
      //   this.getStoreServiceListForPerformanceCostParam
      // ).then(res => {
      //   this.getStoreServiceListForPerformanceCostRes(res)
      // })
    },
    getStoreServiceListForPerformanceCostRes(res) {
      console.log(res);
      this.product = res.serviceInfoList;
      this.total = res.total;
    },
    handleClose() {
      this.$emit("close");
    },
    confirm() {
      var selectedArr = [];
      this.product.forEach(i => {
        if (i.checked) {
          selectedArr.push(i.specificationId);
        }
      });
      axios.post(
        api.batchSetPerformanceCost.URL,
        {
          ids: selectedArr,
          performanceCost: this.cost
        }
      ).then(res => {
        this.batchSetPerformanceCostRes(res)
      })
    },
    batchSetPerformanceCostRes(res) {
      if (res.success) {
        this.$message({ type: "success", message: "保存成功" });
        this.allChecked = false;
        this.changeAllChecked(false);
        this.setInMany = false;
        this.$emit("close");
      }
    },
    changeAllChecked(checked) {
      var arr = JSON.parse(JSON.stringify(this.product));
      arr.map(element => {
        element.checked = checked;
      });
      this.product = arr;
    },
    handleCurrentChange(val) {
      this.allChecked = false;
      this.pageParam.currentPage = val;
      this.getStoreServiceListForPerformanceCost();
    },
    setInManyInput(value) {
      console.log(value);
      if (!this.setInMany) {
        console.log("不能设置");
        return;
      }
      console.log("设置");
      this.product.map(item => {
        if (item.checked) {
          return (item.performanceCost = value);
        }
      });
    },
    changeSortTwo() {
      this.getStoreServiceListForPerformanceCost();
    },
    search() {
      this.getStoreServiceListForPerformanceCost();
    },
    keydown_search(e) {
      if (e.keyCode === 13) {
        this.search();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.line {
  width: 100%;
  border-top: 1px solid #f0f1f4;
  margin-top: -30px;
  margin-bottom: 17px;
}
.search {
  width: 100%;
  margin: 12px 0 15px;
  padding: 0 20px;
  margin-top: -5px;
  /deep/ .el-input-group__append {
    background: #58c9f3;
    width: 40px;
    padding: 0;
    text-align: center;
    color: white;
    cursor: pointer;
    .iconfont {
      font-size: 24px;
    }
  }
}
/deep/ .el-dialog__body {
  padding: 30px 0;
  padding-bottom: 0;
}
.list-item {
  border-bottom: 1px solid #f0f1f4;
  box-sizing: border-box;
  padding: 8px 0;
  display: flex;
  align-items: center;
  .checked {
    flex: 0 0 48px;
    text-align: center;
  }
  .name {
    max-width: 180px;
    flex: auto;
  }
  .specifications {
    max-width: 130px;
    flex: auto;
  }
  .price {
    max-width: 90px;
    flex: auto;
  }
  .time {
    margin-left: 60px;
  }
}
.bottom-line {
  border: 0;
  margin-top: 5px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  position: relative;
  height: 60px;
  .set-many {
    width: 83px;
    height: 32px;
    box-sizing: border-box;
    border-radius: 3px;
    line-height: 30px;
    font-size: 12px;
    color: #75c74f;
    display: flex;
    justify-content: center;
    cursor: pointer;
    span {
      margin-left: 3px;
    }
  }
  .set-many-common {
    border: 1px solid #75c74f;
  }
  .set-many-active {
    border: 2px solid #75c74f;
    line-height: 28px;
    font-weight: 700;
  }
  .checked {
    margin-right: 10px;
    margin-left: 33px;
  }
  .pagination {
    overflow: hidden;
    margin-left: 86px;
    position: absolute;
    right: 0;
    /deep/ .btn-next {
      width: 35px;
    }
    /deep/ .btn-prev {
      width: 35px;
    }
    /deep/ .el-pagination {
      margin: 0;
    }
  }
}
.num-input-box {
  margin-left: 10px;
  /deep/ input {
    height: 36px;
  }
  /deep/ .num-input {
    width: 100px;
    height: 32px;
    padding: 0;
  }
  /deep/ .el-input-group__append {
    width: 40px;
    padding: 0;
    text-align: center;
  }
}
.pro-list {
  max-height: 540px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: rgba(0, 0, 0, 0.2);
  }
  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
  }
}
  .deductCost {
    width: 100px;
    height: 32px;
    /deep/ .el-input-group__append {
      width: 40px;
      height: 32px;
      line-height: 32px;
      padding: 0;
      text-align: center;
      color: white;
    }
  }
  .deductCost-grey {
    /deep/ .el-input-group__append {
      background: #d5dadf;
    }
  }
  .deductCost-blue {
    /deep/ .el-input-group__append {
      background: #58c9f3;
    }
  }
</style>
<style lang="scss">
.deductCost .el-input-group--append .el-input__inner{
  height: 32px;
}
.tabelList{
  padding: 0 20px;
  /deep/.el-table th,.el-table td{
    padding: 8px 0;
  }
} 
</style>