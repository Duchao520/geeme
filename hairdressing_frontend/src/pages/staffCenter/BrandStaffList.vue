<template>
  <div class="wrap-con">
    <div class="top-line">
      <div>
        <el-radio-group @change="changeStaff()" class="btn-group" v-model="componentId">
          <el-radio-button
            v-for="(item,index) in staffTypes"
            :key="index"
            :label="item.type"
          >{{item.name}}</el-radio-button>
        </el-radio-group>
        <el-button v-if="componentId === 'BrandStaffListBrand' && checkHasBtnPermission(`/${currentEntry}-inner/staff-add`,'path')" @click="toStaffAdd" class="normal_red_btn add-button" size='medium'>新增员工</el-button>
      </div>
      <input-search placeholder="请输入员工姓名/手机号/员工编号" style="width:275px" v-model="keyword" @search="search"></input-search>
    </div>
    <component :ref="componentId" @isNoData="isNoData" @clearNoData="clearNoData" :noData="noData" :keyword="keyword" :is="componentId"></component>
  </div>
</template>
<script>
import BrandStaffListBrand from '@/components/staff/brandStaff/BrandStaffListBrand'
import BrandStaffListStore from '@/components/staff/brandStaff/BrandStaffListStore'
import { mapActions, mapState } from "vuex";
import util from "@/util/base.js";
export default {
  components:{
    BrandStaffListStore,
    BrandStaffListBrand
  },
  data() {
    let strValidator = [{trigger:"change",message:''},{trigger:"blur",message:''}]
    let numValidator_=(rule,value,callback)=>{
      callback()
    }
    let numValidator = [{trigger:"change",validator:numValidator_},{trigger:"blur",validator:numValidator_}]
    return {
      keyword: "",
      staffTypes: [
        { name: "总部员工", type: "BrandStaffListBrand" },
        { name: "门店员工", type: "BrandStaffListStore" }
      ],
      componentId: 'BrandStaffListBrand',
      noData: false
    };
  },
  methods: {
    ...mapActions(["saveCurrentInfo"]),
    search() {
      this.$refs[this.componentId].clearForm()
      this.noData = true
      this.$refs[this.componentId].getStaffs()
    },
    searchData: util.debounce(function(text) {
      this.noData = true
      this.keyword = text[0]
      this.$refs[this.componentId].clearForm()
      this.$refs[this.componentId].getStaffs()
    }),
    /**
     * 跳转到新增员工界面
     */
    toStaffAdd() {
      this.$router.push('/brand-inner/staff-add')
    },
    changeStaff() {
      let isBrand = false 
      if(this.componentId === 'BrandStaffListBrand') {
        isBrand = false
      } else {
        isBrand = true
      }
      this.saveCurrentInfo({
        isBrand
      });
    },
    clearNoData() {
      this.keyword = ''
      this.noData = false
    },
    isNoData(data) {
      this.noData = data
    }
  },
  computed: {
    currentInfo() {
      return this.$store.state.manage.currentInfo;
    },
    ...mapState({
      currentEntry: state => state.authRouter.currentEntry
    }),
  },
  // mounted() {
  //   this.saveCurrentInfo({
  //     isBrand:false
  //   });
  // },
  created() {
    if(!this.currentInfo.isBrand) {
      this.componentId='BrandStaffListBrand'
    } else {
      this.componentId='BrandStaffListStore'
    }
  },
  watch: {
    componentId() {
      this.keyword = '';
    }
  }
};
</script>
<style lang="scss" scoped>
.btn-group{
  box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
}
.wrap-con{
  box-sizing: border-box;
  padding: 0 20px;
  .top-line{
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin: 23px 0 16px;
    .add-button {
      margin-left: 20px;
    }
    /deep/ .el-radio-button__inner{
      height: 35px;
      line-height: 35px;
      padding-top: 0;
      padding-bottom: 0;
      border: none;
    }
    /deep/ .el-radio-button.is-active{
      .el-radio-button__inner{
        background: #58C9F3;
      }
    }
  }
}
</style>
