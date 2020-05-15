<template>
  <!--居住地址三级联动选项-->
  <section class="showChose" v-show="showPickerState">
    <section class="address bg-f">
      <section class="title fz14 clearfix">
        <div class="area" @click="provinceSelected()">{{Province?Province:info[province-1].name}}</div>
        <div class="area" @click="citySelected()" :class="City?'':'active'">{{City?City:'请选择'}}</div>
        <div class="area" @click="districtSelected()" :class="District?'':'active'" v-show="City">
          {{District?District:'请选择'}}
        </div>
        <span @click="closeAdd()" class="fl-r">取消</span>
      </section>
      <ul class="fz14">
        <li class="addList" v-for="(v,k) in info" @click="getProvinceId(v.code , v.id, v.name, k)" v-show="showProvince"
            :class="v.selected ? 'active' : ''">{{v.name}}<i class="right-arrow"></i></li>
        <li class="addList" v-for="(v,k) in showCityList" @click="getCityId(v.code , v.id, v.name, k)" v-show="showCity"
            :class="v.selected ? 'active' : ''">{{v.name}}<i class="right-arrow"></i></li>
        <li class="addList" v-for="(v,k) in showDistrictList" @click="getDistrictId(v.code , v.id, v.name, k)"
            v-show="showDistrict" :class="v.selected ? 'active' : ''">{{v.name}}
        </li>
      </ul>
    </section>
  </section>
</template>

<script>
  import * as city from '@/assets/js/citys'
  import {USERINFO} from "@/assets/js/deal";

  export default {
    props: ["showPickerState", "areaName", "areaCode", "firstTime"],
    name: 'picker',
    data() {
      return {
        showChose: true,
        showProvince: true,
        showCity: false,
        showDistrict: false,
        showCityList: false,
        showDistrictList: false,
        province: 1,
        city: 3,
        district: 57,
        GetProvinceId: 2,
        District: false,
        Province: false,
        City: false,
        info: city.citys.provinceList,
        // v-for循环判断是否为当前
        selected: false,
      }
    },
    methods: {
      /*choseAdd: function() {
          this.showChose = true;
        },*/
      closeAdd() {
        //this.showChose = false;
        this.$emit('update:showPickerState', false);
      },
      _filter(add, name, code) {
        let result = [];
        for (let i = 0; i < add.length; i++) {
          if (code == add[i].id) {
            result = add[i][name];
          }
        }
        return result;
      },
      getProvinceId: function (code, id, input, index) {
        this.province = id;
        this.Province = input;
        this.showProvince = false;
        this.showCity = true;
        this.showDistrict = false;
        this.showCityList = this._filter(this.info, 'city', this.province);
        // 点击选择当前
        this.info.map(a => a.selected = false);
        this.info[index].selected = true;
      },
      provinceSelected: function () {
        // 清除市级和区级列表
        this.showCityList = false;
        this.showDistrictList = false;
        // 清除市级和区级选项
        this.City = false;
        this.District = false;
        // 选项页面的切换
        this.showProvince = true;
        this.showCity = false;
        this.showDistrict = false;
      },
      getCityId: function (code, id, input, index) {
        this.city = id;
        this.City = input;
        this.showProvince = false;
        this.showCity = false;
        this.showDistrict = true;
        this.showDistrictList = this._filter(this.showCityList, 'district', this.city);
        // 选择当前添加active
        this.showCityList.map(a => a.selected = false);
        this.showCityList[index].selected = true;
      },
      citySelected: function () {
        this.showProvince = false;
        this.showCity = true;
        this.showDistrict = false;
      },
      getDistrictId: function (code, id, input, index) {
        this.district = id;
        this.District = input;
        // 选择当前添加active
        this.showDistrictList.map(a => a.selected = false);
        this.showDistrictList[index].selected = true;
        // 选取市区选项之后关闭弹层
        //this.showChose = false;
        console.log(code + ',,' + this.Province + this.City + this.District)
        this.$emit('update:areaCode', code);
        this.$emit('update:areaName', this.Province + this.City + this.District);
        this.$emit('update:firstTime', '1');
        this.$emit('update:showPickerState', false);
        USERINFO.areaCode = code;
      },
      districtSelected: function () {
        this.showProvince = false;
        this.showCity = false;
        this.showDistrict = true;
      }
    },
    watch: {}
  }
</script>

<style scoped>
  @import '../../../../assets/css/partner_base.css';
  .myAddress {
    width: 100%;
    border-top: 4px solid rgba(245, 245, 245, 1);
    color: #333;
  }

  .myAddress .cont {
    border-bottom: 1px solid rgba(245, 245, 245, 0.8);
  }

  .myAddress .cont span {
    display: inline-block;
    font-size: 0.28rem;
    color: #333;
    line-height: 0.88rem;
    margin-left: 0.32rem;
  }

  .myAddress .cont section {
    float: left;
  }

  .myAddress .cont p {
    display: inline-block;
    font-size: 0.28rem;
    color: #333333;
    line-height: 0.88rem;
    margin-left: 1rem;
  }

  .myAddress .cont .pic2 {
    float: right;
    width: 0.14rem;
    height: 0.24rem;
    margin: 0.32rem 0.32rem 0.32rem 0;
  }

  .myAddress .cont p.text {
    margin-left: 0.72rem;
  }

  .showChose {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 120;
    background: rgba(0, 0, 0, 0.5);
  }

  .address {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 121;
    background: #fff;
    width: 100%;
  }

  .title span {
    line-height: 48px;
    color: #D8D8D8;
    padding-right: .5rem;
  }

  .area {
    display: inline-block;
    line-height: 48px;
    margin-left: 0.42rem;
    color: #333;
  }

  .addList {
    width: 100%;
    padding: 0 .25rem 0 .5rem;
    box-sizing: border-box;
    line-height: 40px;
    color: #333;
  }

  /* 修改的格式 */
  .address ul {
    height: 100%;
    height: 11rem;
    overflow: auto;
  }

  .address ul li {
    position: relative;
  }

  .address .title .active {
    border-bottom: 2px solid #FF4F81;
  }

  .address ul .active {
    color: #FF4F81;
  }
</style>
