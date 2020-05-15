<template>
  <div class="infoForm">
    <span class="underline">
      注: 号码随机分配
    </span>
    <div class="form">
      <div class="form-group">
        <label>姓名</label>
        <input type="text" v-model="realName" @blur="realNameVali">
      </div>
      <div class="form-group">
        <label>身份证号(根据国家实名管控要求,请如实填写,谢谢!)</label>
        <input type="text" v-model="idCard" @blur="IDCard">
      </div>
      <div class="form-group">
        <label>联系方式</label>
        <input type="text" v-model="phone" @blur="phoneVali">
      </div>
      <div class="form-group">
        <label>邮寄地址</label>
        <div class="aline">
          <select name="" class="txt-ellipsis" v-model="province" @blur="areaCodeVali">
            <option value="">省/自治区/直辖市</option>
            <option v-for="(province,index) in provinceList" :value="{name: province.name,code: province.code}" :key="index">{{province.name}}</option>
          </select>
          <select name="" v-model="city">
            <option value="">市</option>
            <option v-for="(city,index) in cityList" :value="{name: city.name,code: city.code}" :key="index">{{city.name}}</option>
          </select>
          <select name="" v-model="district">
            <option value="">区/县</option>
            <option v-for="(district,index) in districtList" :value="{name: district.name,code: district.code}" :key="index">{{district.name}}</option>
          </select>
        </div>
        <input type="text" v-model="detailAddress" placeholder="详细地址" @blur="detailAddressVali">
      </div>
      <div class="form-group">
        <button @click="submit">提交</button>
      </div>
    </div>
    <toast ref="toast" :tip="tip"></toast>
  </div>
</template>

<script>
  import {citys} from "@/assets/js/citys";
  import {rule,valiDateIDCard} from "@/assets/js/deal";
  import toast from "@/components/common/toast";
  import {unicomForm} from "@/assets/js/comm";
  import {getSignIn , postTitle} from "@/assets/js/jsBridge";

  export default {
    name: "infoForm",
    props: ['tokenPromise'],
    data(){
      return{
        title: '信息登记',
        provinceList: citys.provinceList,
        province: '',
        cityList: '',
        city: '',
        districtList: '',
        district: '',
        areaFullName: '',
        areaCode: '',
        detailAddress: '',
        realName: '',
        idCard: '',
        phone: '',
        createTime: '',
        passCode: '00000',
        tip: '',
        submitFlag: true
      }
    },
    components: {
      toast
    },
    mounted(){
      var _self = this;
      postTitle(_self.title);
    },
    methods: {
      formInit(){
        var _self = this;
        _self.realName = "";
        _self.idCard = "";
        _self.phone = "";
        _self.province = "";
        _self.city = "";
        _self.district = "";
        _self.detailAddress = "";
        _self.areaFullName = "";
      },
      realNameVali(){
        var _self = this;
        if(rule.empty(_self.realName,"请输入姓名")){
          _self.passCode = _self.changeStr(_self.passCode,1,'1');
        }else{
          _self.passCode = _self.changeStr(_self.passCode,1,'0')
        }
      },
      IDCard(){
        var _self = this;
        if(valiDateIDCard(_self.idCard)){
          _self.passCode = _self.changeStr(_self.passCode,2,'1');
        }else {
          _self.passCode = _self.changeStr(_self.passCode,2,'0');
        }
      },
      phoneVali(){
        var _self = this;
        if(rule.empty(_self.phone,"请输入电话号码") && rule.phone(_self.phone)){
          _self.passCode = _self.changeStr(_self.passCode,3,'1');
        }else {
          _self.passCode = _self.changeStr(_self.passCode,3,'0');
        }
      },
      areaCodeVali(){
        var _self = this;
        if(rule.empty(_self.areaCode,"请选择地区")){
          _self.passCode = _self.changeStr(_self.passCode,4,'1');
        }else {
          _self.passCode = _self.changeStr(_self.passCode,4,'0');
        }
      },
      detailAddressVali(){
        var _self = this;
        if(rule.empty(_self.detailAddress,"请输入街道详细地址")){
          _self.passCode = _self.changeStr(_self.passCode,5,'1');
        }else {
          _self.passCode = _self.changeStr(_self.passCode,5,'0');
        }
      },
      changeStr(allstr,start,changeStr){ //allstr:原始字符串，start,开始位置，changeStr:改变后的字
        return allstr.substring(0,start-1)+changeStr+allstr.substring(start);
      },
      submit(){
        var _self = this;
        _self.realNameVali();
        _self.IDCard();
        _self.phoneVali();
        _self.areaCodeVali();
        _self.detailAddressVali();
        if(_self.passCode == '11111'){
          if(_self.submitFlag){
            _self.submitFlag = false;
            var _data = {
              areaCode: String(_self.areaCode),
              areaFullName: String(encodeURIComponent(_self.areaFullName)),
              detailAddress: String(encodeURIComponent(_self.detailAddress)),
              idCard: String(_self.idCard),
              phone: String(_self.phone),
              realName: String(encodeURIComponent(_self.realName))
            };
            getSignIn(_data).then(sec => {
              unicomForm(_data,sec).then(res => {
                if(res.data.state == 1){
                  _self.passCode = "00000";
                  _self.formInit();
                  _self.toast((decodeURIComponent(res.data.msg)));
                }else{
                  _self.toast(decodeURIComponent(res.data.msg))
                }
                _self.submitFlag = true;
              })
            })
          }else{
            _self.toast("请勿重复提交")
          }
        }else {
          _self.toast("请完善您的个人信息")
        }
      },
      toast(tip){
        var _self = this;
        _self.tip = tip;
        _self.$refs.toast.toast();
      }
    },
    watch: {
      province(){
        var _self = this;
        _self.areaCode = _self.province.code;
        _self.districtList = '';
        _self.city = '';
        _self.areaFullName = _self.province.name + _self.city.name + _self.district.name;
        _self.provinceList.forEach(ele => {
          if(ele.code == _self.province.code){
            _self.cityList = ele.city;
          }
        })
      },
      city(){
        var _self = this;
        _self.areaCode = _self.city.code;
        _self.district = '';
        _self.areaFullName = _self.province.name + _self.city.name + _self.district.name;
        _self.cityList.forEach(ele => {
          if(ele.code == _self.city.code){
            _self.districtList = ele.district;
          }
        })
      },
      district(){
        var _self = this;
        _self.areaCode = _self.district.code;
        _self.areaFullName = _self.province.name + _self.city.name + _self.district.name;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .infoForm {
    box-sizing: border-box;
    padding: .2rem;
    /*position: fixed;*/
    header{
      color: #333333;
      font-size: .48rem;
      text-align: center;
    }
    .underline{
      color: #cd0b23;
      font-size: .28rem;
      text-decoration: underline;
    }
    .form{
      .form-group{
        width: 100%;
        margin-bottom: .82rem;
        label{
          font-size: .32rem;
          color: #333333;
          font-weight: bold;
          margin-bottom: .26rem;
        }
        label::before{
          content: '*';
          color: #cd0b23;
          font-size: .32rem;
        }
        input{
          display: block;
          width: 100%;
          height: .64rem;
          background: none;
          outline: none;
          border: .01rem solid #cccccc;
          font-size: .32rem;
          box-sizing: border-box;
          padding-left: .1rem;
        }
        .aline{
          display: flex;
          justify-content: space-between;
          select{
            width: 2.2rem;
            height: .64rem;
            background: none;
            outline: none;
            border: .01rem solid #cccccc;
            font-size: .26rem;
            color: rgb(102,102,102);
            box-sizing: border-box;
            padding: .1rem;
            margin-bottom: .15rem;
          }
        }
        button{
          display: block;
          width: 100%;
          height: .8rem;
          color: #FFFFFF;
          background: #F56730;
          border-radius: .1rem;
          cursor: pointer;
        }
      }
    }
  }
</style>
