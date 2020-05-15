<template>
	<div>
		<el-form-item :label="label" prop='address'>
			<el-cascader 
				placeholder="请选择省市区"
				:options="options"
				:props='prop'
				v-model="address"
				:change-on-select='changeOnSelect'
				:disabled="isdisabled"
				expand-trigger='click'>
			</el-cascader>
		</el-form-item>
	</div>
</template>
<script>
// import * as axios from '@/util/axios'
import axios from 'axios'
export default {
  props: {
    myAddress: Array,  // [''] 从父组件接受过来的数据 ['浙江省',杭州市','西湖区']
    isdisabled: {
      type: Boolean,
      default: false
    }, // 是否禁用
    changeOnSelect: { // 是否可选区，默认可选
      type:Boolean,
      default: false
    },
    label: {
      type: String,
      default: '门店地址'
    }
  },
  data() {
    return {
      options:[],
      address: [],
      prop:{
      label: 'name',
      value: 'name',
      children: 'districts'
		},
      	num: 0, // 标识是否是第一次刷新数据
    }
  },
  watch: {
    myAddress(val, old) {
		console.log(val)
      	this.address = val
	},
	address(val) {
		this.num++
		this.$emit('changeCityData',val,this.num);
	}
  },
  cerated() {
	  
  },
  mounted() {
	  this.getCityData();
  },
  methods: {
    //从高德地图拉取城市数据
    // - 2019-9-19  webApi key: 0ee95e63e7ef04ac814f5653981273ba  账号：13588732250
    getCityData() {
        axios.get(`//restapi.amap.com/v3/config/district?key=f211857599047852b425815b7d4a29e7&keywords=&subdistrict=3&extensions=base`).then(res => {
            if (res.data.status == '1'){
                this.options = res.data.districts[0].districts
                this.forEachCityData(this.options)
            }
        })
    },
    //遍历城市数据
    forEachCityData(data) {
        data.forEach(res => {
            if (res.districts.length == 0) {
                res.districts = null
            } else {
                this.forEachCityData(res.districts)
            }
        })
    },
  },
}
</script>
<style lang="scss">
.el-cascader__label span {
  color: #c0c4cc;
}
  .g-saddress {
    .saddress {
      width: 100%;
      .el-cascader {
        width: 100%;
      }
    }
  }
</style>