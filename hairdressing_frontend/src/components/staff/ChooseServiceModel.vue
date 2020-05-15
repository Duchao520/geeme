<template>
  <el-dialog
    title="选择服务"
    :visible="chooseBasicServiceVisible"
    width="800px"
    :before-close="handleClose"
    :lock-scroll="false"
    :modal="false"
  >
    <div class="line"></div>
    <el-row type="flex" justify="space-between" class="search">
      <el-select v-model="levelId" placeholder="请选择职级" :popper-append-to-body="true" style="position:relative" @change="sendLevelList">
        <el-option v-for="(item,index) in characters" :key="index" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <input-search width="200px" @search="search" @input="keydown_search" v-model="serviceName" placeholder="搜索商品名称"></input-search>
    </el-row>
    <div class="pro-list">
      <div class="list-item firstline">
        <div class="checked"></div>
        <div class="name">服务名称</div>
        <div class="specifications">规格</div>
        <div class="price">服务价格</div>
        <div class="time">发布</div>
      </div>
      <div class="list-item" v-for="(item,index) in serviceLists" :key="index">
        <div class="checked">
          <el-radio v-model="selectedSpecification" :label="item"></el-radio>
        </div>
        <div class="name">{{item.serviceName}}</div>
        <div class="specifications">{{item.specificationName}}</div>
        <div class="price">{{item.price}}</div>
        <div class="time">{{item.publishTime}}</div>
      </div>
    </div>
    <div class="list-item bottom-line">
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
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { mapState } from "vuex";
import * as utils from "@/assets/js/utils";
import * as axios from '@/util/axios'
import * as api from "@/assets/js/interface";
export default {
  props: {
    chooseBasicServiceVisible: Boolean,
    character:Number,
    characters:Array,
    selectServerData: Array
  },
  data() {
    return {
      optionsSecondValue: null,
      serviceName: "",
      selectedSpecification: null,
      serviceLists: [],
      classification: [],
      pageParam: {
        currentPage: 1,
        pageSize: 10
      },
      total: 0,
      levelId: null
    };
  },
  watch: {
    character(val) {
      if(val) {
        this.levelId =val
      }
    },
    selectServerData(val) {
      this.selectedSpecification = val.length > 0 ? val[0] : null
    }
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo
    }),
    currentInfo(){
      return this.$store.state.manage.currentInfo
    },
    getServiceListByLevelFilterParam() {
      return {
        pageParam: this.pageParam,
        storeId:this.currentInfo.shopId,
        serviceName:this.serviceName
      };
    }
  },
  methods: {
    getServiceListByLevelFilter(id) {
      let levelId = id ? id : this.levelId;
      axios.post(
        api.getServiceListByLevelFilter.URL,
        {...this.getServiceListByLevelFilterParam,levelId}
      ).then(res => {
        this.getServiceListByLevelFilterRes(res)
      })
    },
    getServiceListByLevelFilterRes(res) {
      this.serviceLists = res.staffBaseServiceList;
      this.total = res.total;
    },
    handleClose() {
      this.$emit("close");
    },
    confirm() {
      if(!this.selectedSpecification){
        utils.showTip(this, { msg: '请选择一项服务！', type: "warning" });
      } else {
        this.$emit("confirm",this.selectedSpecification)
      }
    },
    handleCurrentChange(val) {
      this.pageParam.currentPage = val;
      this.getServiceListByLevelFilter();
    },
    search() {
      this.getServiceListByLevelFilter();
    },
    keydown_search(e) {
      if (e.keyCode === 13) {
        this.search();
      }
    },
    sendLevelList(data) {
      this.getServiceListByLevelFilter()
      this.$emit('getLevelList', data)
    }
  }
};
</script>
<style lang="scss" scoped>
.line {
  width: 100%;
  border-top: 1px solid #f0f1f4;
  margin-top: -20px;
}
.search {
  width: 100%;
  margin: 12px 0 15px;
  /deep/ [data-v-55c40e1e] .el-input__inner {
    height: 40px;
  }
}
/deep/ .el-dialog__body {
  padding-bottom: 0;
}
.firstline.list-item{
    background: #F4F5F7;
}
.list-item {
  border-bottom: 1px solid #f0f1f4;
  box-sizing: border-box;
  padding: 8px 0;
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;
  color: #333333;
  .checked {
    width:calc(100%*43/752);
    text-align: center;
    /deep/ .el-radio__label{
        display: none;
    }
  }
  .name {
    width:calc(100%*185/752);
  }
  .specifications {
    width:calc(100%*185/752);
  }
  .price {
    width:calc(100%*170/752);
  }
  .time {
    width:calc(100%*170/752);
  }
}

.bottom-line {
  border: 0;
  margin-top: 5px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  .pagination {
    overflow: hidden;
    margin-left: 86px;
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
</style>
