<template lang="pug">
  .g-address
    .address.p
      <el-select :clearable="clearable" class="add-select" v-model="province" @change="provinceChange" placeholder="请选择省">
        <el-option v-for="(item, index) in provinceList" :key="index" :label="item.label" :value="item"></el-option>
      </el-select>
    .address.c
      <el-select :clearable="clearable" class="add-select" v-model="city" placeholder="请选择市" @change="cityChange">
        <el-option v-for="(item, index) in cityList" :key="index" :label="item.label" :value="item"></el-option>
      </el-select>
</template>
<script>
import { regionData } from "element-china-area-data";
export default {
  data() {
    return {
      province: "", // 省份
      city: "", // 城市
      provinceList: [], // 省份列表
      cityList: [] // 城市列表
    };
  },
  props:{
    reset: Boolean,
    clearable: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    reset(val) {
      if (!val) {
        this.province = ''
        this.city = ''
      }
    }
  },
  mounted() {
    // 格式化祖籍的省份
    this.provinceList.push({
      label: "所有省份",
      value: null
    });
    this.formatRegionData(regionData, "provinceList");
  },
  methods: {
    // 格式化祖籍的省份和地区
    formatRegionData(data, name) {
      if (!!data) {
        data.forEach(item => {
          this[name].push(item);
        });
      }
    },
    // 当选择完省份后就获取省份对应的城市
    provinceChange(data) {
      this.province = data.label;
      this.city = "";
      this.cityList = [{label:"所有城市",value:null}];
      if (
        !!data.children &&
        data.children[0] &&
        data.children[0].label === "市辖区"
      ) {
        // 开始向父组件发送地址信息
        this.$emit("select", {
          province: this.province,
          city: this.city
        });
        this.formatRegionData(data.children[0].children, "cityList");
      } else {
        // 开始向父组件发送地址信息
        this.$emit("select", {
          province: this.province || null,
          city: this.city || null
        });
        // 获取祖籍的城市列表
        this.formatRegionData(data.children, "cityList");
      }
    },
    // 选择完城市之后
    cityChange(data) {
      this.city = data.label;
      // 开始向父组件发送地址信息
      this.$emit("select", {
        province: this.province,
        city: this.city || null
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.g-address {
  width: 300px;
  display: flex;
  justify-content: space-between;
  .address.p,
  .address.c {
    width: 140px;
    /deep/ .el-input__inner {
      height: 35px;
    }
  }
}
</style>
