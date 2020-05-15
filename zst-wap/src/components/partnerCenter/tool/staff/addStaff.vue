<template>
  <div style="overflow: hidden">
    <!--标题栏-->
    <header class="bg-f " :style="'padding-top:'+status_bar_height+'px'">
      <h3 class="border-buttom"><span v-if="staffId">编辑</span><span v-else>新增</span>职员</h3>
      <span class="ico-retrun fz16" @click="back"><i class="left-arrow"></i></span>
    </header>
    <div :style="'height:'+(status_bar_height+44)+'px'"></div>
    <!---->
    <ul class="bg-f list fz15">
      <li class="border-buttom clearfix">
        <span class="fl-l">职员姓名</span>
        <input type="text" placeholder="请输入职员真实姓名" class="fl-r" v-model="realName"/>
      </li>
      <li class="border-buttom clearfix">
        <span class="fl-l">性别</span>
        <div class="fl-r">
          <input type="radio" name="sex" id="sex1" v-model="gender" value="1"/>
          <label class="radio" for="sex1">男</label>
        </div>
        <div class="fl-r">
          <input type="radio" name="sex" id="sex2" v-model="gender" value="0"/>
          <label class="radio" for="sex2">女</label>
        </div>
      </li>
      <li class="border-buttom clearfix">
        <span class="fl-l">联系电话</span>
        <input type="tel" placeholder="请输入联系电话" maxlength="11" class="fl-r" v-model="phone"/>
      </li>
      <li class="border-buttom clearfix">
        <span class="fl-l">出生日期</span>
        <input type="text" placeholder="请选择时间" class="fl-r" readonly="readonly" v-model="birth" @click="showPicker"/>
      </li>
      <li class="border-buttom clearfix">
        <span class="fl-l">助商通账号</span>
        <input type="number" placeholder="请输入职员的助商通账号(ID:123554)" class="fl-r" v-model="id"/>
      </li>
      <li class="border-buttom clearfix">
        <span class="fl-l">是否激活</span>
        <div class="fl-r">
          <input type="radio" name="promoteState" id="promoteState1" v-model="promoteState" value="1"/>
          <label class="radio" for="promoteState1">是</label>
        </div>
        <div class="fl-r">
          <input type="radio" name="promoteState" id="promoteState2" v-model="promoteState" value="0"/>
          <label class="radio" for="promoteState2">否</label>
        </div>
      </li>
      <li class="clearfix">
        <span class="fl-l">备注</span>
        <textarea class="fl-r" placeholder="请输入备注" rows="3" v-model="remark"></textarea>
      </li>
      <li class="clearfix">
        <span class="fl-l">业务提成比例</span>
        <input type="tel" placeholder="请输入提成比例,设置区间1%~100%" class="fl-r" @blur="royaltyRateVal" v-model="royaltyRate"/>
      </li>
    </ul>
    <button type="button" class="btn" @click="setStaff" v-if="btnState">确定</button>
    <button type="button" class="btn btn-opcity" v-else>确定</button>

    <!---->
    <mt-popup v-model="popupSelect" position="bottom">
      <mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
    </mt-popup>
    <!--<mt-datetime-picker
          v-model="popupSelect"
          type="date"
          year-format="{value} 年"
          month-format="{value} 月"
          date-format="{value} 日">
      </mt-datetime-picker>-->
    <v-toast :tip="tip" ref="toast"></v-toast>
  </div>
</template>

<script>
  import {getStaffDetail , addStaff , editStaff} from '@/assets/js/getData'
  import * as dataTime from '@/assets/js/dataTiem'
  import {rule} from "@/assets/js/deal";
  export default {
    props: ['partnerToken'],
    data() {
      return {
        status_bar_height: this.$route.query.status_bar_height ? Number(this.$route.query.status_bar_height) : 0,
        tip: '',
        token: '',
        realName: '',
        gender: '',
        birth: '',
        id: '', //助商通账号id
        editId: '', //编辑职员时，所需要的id
        staffId: this.$route.query.id,
        phone: '',
        promoteState: '1',
        remark: '',
        popupSelect: false,
        btnState: true,
        royaltyRate: '',
        slots: [
          {
            flex: 1,
            values: dataTime.dataTime.mouth,
            className: 'slot1',
            textAlign: 'center'
          }, {
            divider: true,
            content: '-',
            className: 'slot2'
          }, {
            flex: 1,
            values: dataTime.dataTime.day,
            className: 'slot3',
            textAlign: 'center'
          }
        ]
      }
    },
    created: function () {
      let _self = this;
      _self.$getParterToken().then(res => {
        _self.token = res;
        if (_self.staffId) { //编辑职员信息
          _self.getStaffDetail();
        }
      });
    },
    methods: {
      toast(tip){
        var _self = this;
        _self.tip = tip;
        _self.$refs.toast.toast();
      },
      /*返回上一页*/
      back() {
        this.$router.go(-1);//返回上一层
      },
      royaltyRateVal(){
        var _self = this;
        // _self.royaltyRate = Number(_self.royaltyRate).toFixed(2);
        var reg = /^[1-9][0-9]{0,1}$/;
        if(reg.test(_self.royaltyRate)){
          return true;
        }else{
          _self.toast("请输入0-100内的数字");
          return false;
        }
      },
      //获取职员详情
      getStaffDetail() {
        let _self = this;
        let _data = {
          token: _self.token,
          id: _self.staffId //职员id
        };
        _self.$getSignIn(_data).then(sec => {
          getStaffDetail(_data,sec).then(res => {
            let _data = res.data;
            if (_data.state == 1) {
              _self.birth = _data.data.staff.birthDay;
              _self.realName = _data.data.staff.realName;
              _self.gender = _data.data.staff.gender;
              _self.id = _data.data.staff.spuserName;
              _self.editId = _data.data.staff.id;
              _self.phone = _data.data.staff.phone;
              _self.promoteState = _data.data.staff.promoteState;
              _self.remark = _data.data.staff.remark;
              _self.royaltyRate = _data.data.staff.royaltyRate * 100;
            } else {
              _self.toast(decodeURIComponent(_data.msg));
            }
          }).catch(function (error) {
            _self.toast(error);
          });
        })

      },
      onValuesChange(picker, values) {
        let _self = this;
        console.log(picker)
        console.log(values)
        _self.birth = values.join("-");
      },
      //显示选择时间picker
      showPicker() {
        this.popupSelect = true;
      },
      setStaff() {
        let _self = this;
        if (_self.staffId) { //编辑职员信息
          _self.editStaff();
        } else {
          _self.addStaff(); //新增职员
        }
      },
      //新增职员
      addStaff() {
        let _self = this;
        if (rule.empty(_self.realName, "姓名不能为空") && rule.empty(_self.gender, "性别必选") && rule.empty(_self.phone, "手机号不能为空") && rule.phone(_self.phone) && rule.empty(_self.birth, "请选择时间") && rule.empty(_self.id, "请输入助商通ID") && _self.royaltyRateVal()) {
          let _data = {
            realName: _self.realName,
            gender: _self.gender,
            token: _self.token,
            remark: _self.remark,
            spuserName: _self.id,
            birthDay: _self.birth,
            phone: _self.phone,
            promoteState: _self.promoteState,
            royaltyRate: _self.royaltyRate / 100
          };
          _self.btnState = false;
          _self.$getSignIn(_data).then(sec => {
            addStaff(_data,sec).then(res => {
              let _data = res.data;
              _self.btnState = true;
              if (_data.state == 1) {//编辑修改成功跳转职员列表页
                _self.toast(decodeURIComponent(_data.msg));
                _self.$router.push({path: '/staff'});
              } else {
                _self.toast(decodeURIComponent(_data.msg));
              }
            }).catch(function (error) {
              _self.toast(error);
            });
          })
        }
      },
      //编辑职员信息
      editStaff() {
        let _self = this;
        if (rule.empty(_self.realName, "姓名不能为空") && rule.empty(String(_self.gender), "性别必选") && rule.empty(_self.phone, "手机号不能为空") && rule.phone(_self.phone) && rule.empty(_self.birth, "请选择时间") && rule.empty(_self.id, "请输入助商通ID") && _self.royaltyRateVal()) {
          let _data = {
            realName: _self.realName,
            gender: _self.gender,
            token: _self.token,
            remark: _self.remark,
            id: _self.editId,
            birthDay: _self.birth,
            phone: _self.phone,
            promoteState: _self.promoteState,
            royaltyRate: _self.royaltyRate/100
          };
          _self.btnState = false;
          _self.$getSignIn(_data).then(sec => {
            editStaff(_data,sec).then(res => {
              let _data = res.data;
              _self.btnState = true;
              if (_data.state == 1) {//编辑修改成功跳转职员列表页
                _self.$router.push({path: '/staff'});
              } else {
                _self.toast(decodeURIComponent(_data.msg));
              }
            }).catch(function (error) {
              _self.toast(error);
            });
          })
        }
      }
    },
  }
</script>

<style scoped>
  @import '../../../../assets/css/partner_base.css';
  .list {
    padding-left: 13px;
    line-height: 55px;
  }

  .list li {
    padding-right: 15px;
  }

  .list input, .list textarea {
    padding: 15px 0;
    text-align: right;
    height: 25px;
    line-height: 25px;
    width: 70%;
    font-size: 15px;
  }

  .radio {
    margin-left: 10px;
  }

  input[type="radio"]:checked + label {
    color: #0d0d0d;
  }

  .mint-popup {
    width: 100%;
  }
</style>
