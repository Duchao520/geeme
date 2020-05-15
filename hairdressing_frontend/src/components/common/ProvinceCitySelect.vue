<template>
  <el-cascader ref="provinceAndCity" :options="options" v-model="address" @change="selectAddress"></el-cascader>
</template>
<script>
import { provinceAndCityData } from "element-china-area-data";

export default {
  data() {
    return {
      options: provinceAndCityData,
      address: [],
      flag: 1,
    };
  },
  props: {
    myAddress: Object
  },
  watch: {
    myAddress(newAddress){
      if (this.flag === 2) return;
      var p='';
      var c ='';
      var array = this.options;
      var adds = []
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        if(element.label===newAddress.province){
          adds.push(element.value)
          let cities = element.children;
          for(var j=0;j<cities.length;j++){
            newAddress.city = newAddress.city === newAddress.province ? '市辖区' : newAddress.city // 不知道为什么提交的时候把这里变了,所以要改回来
            if(cities[j].label===newAddress.city){
              adds.push(cities[j].value)
              break
            }
          }
          break
        }
      }
      this.address = adds
      this.flag = 2
    }
  },
  methods: {
    selectAddress(data) {
      let address = { province: "", city: "" };
      this.options.forEach(element => {
        if (element.value === this.address[0]) {
          address.province = element.label;
          element.children.forEach(item => {
            if (item.value === this.address[1]) {
              address.city = item.label;
              this.$emit("change", address);
            }
          });
        }
      });
    },
    handleClose() {
      this.$refs.provinceAndCity.toggleDropDownVisible(false)
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
