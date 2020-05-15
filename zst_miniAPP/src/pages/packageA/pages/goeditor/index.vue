<template>
  <div class="page">
    <div class="all_pa_con">
       <div class="peo_name">
            <div class="left">收货人</div>
            <input type="text" v-model="people" @blur="testpeople" placeholder="请输入收货人">
       </div>

      <div class="peo_name">
        <div class="left">手机号码</div>
        <input type="number" v-model="phone" @blur="testphone" placeholder="请输入手机号">
      </div>

      <!--<div class="peo_name">-->
        <!--<div class="left">邮政编码</div>-->
        <!--<input type="number" v-model="postCode" @blur="testpostCode" placeholder="请输入邮政编码">-->
      <!--</div>-->

      <div class="peo_name">
        <div class="left">选择城市</div>
        <picker
          mode="region"
          @change="bindRegionChange"
          :value="region"
          :custom-item="customItem">
          <div class="picker">
             {{region[0]}} {{region[1]}} {{region[2]}}
          </div>
        </picker>
      </div>

      <div class="peo_name" @blur="testAdd">
        <div class="left">详细地址</div>
        <input type="text" v-model="detailAddress"  placeholder="请输入详细地址">
      </div>

      <div class="confirm_btn" @click="postForm">
          提交
      </div>
    </div>


  </div>
</template>

<script>
  import {getQuery , getSignIn} from '@/common/js/comm'
  import Tips from '@/common/js/tips'
  export default {
    components: {

    },
    data() {
      return {
        motto: 'Hello World',
        val:'',
        people:'',
        phone:'',
        curCity:'',
        detailAddress:'',
        addressCode:'',
        isDefault:0,
        id:'',
        postCode:'',
        region: ['浙江省','杭州市','萧山区'],
        zipcode:'',
        frompage:'',
      };
    },
    mounted(){
      var par = getQuery();
      this.frompage = par.frompage ? par.frompage:'';
      console.log('编辑页面',par)
      if(JSON.stringify(par) != '{}' && this.frompage ==''){
        this.addressCode = par.areaCode;
        this.people = par.consignee;
        this.detailAddress = par.detailAddress;
        this.id = par.id;
        this.phone = par.phone;
        this.postCode = par.postCode;
        var str = par.regionInfo;
        this.region = str.split(",");
      }else{
        this.addressCode = '';
        this.people = '';
        this.detailAddress = '';
        this.id = '';
        this.phone = '';
        this.postCode = '';
        this.getLocations();
      }
    },
    methods: {
      goEditor() {
        const url = '../orderpage/main';
        wx.navigateTo({url})
      },
      testpeople() {
        console.log('没有人员',this.people);
          if(this.people == ''){
             // Tips.toast('请输入收货人','none');
             return false;
          }else{
            return true
          }
      },
      // testpostCode(){
      //   console.log('这里是怎么提交的',(this.postCode == ''));
      //   if(this.postCode == ''){
      //     Tips.toast('请输入邮政编码','none');
      //     throw new Error('this is my customed error');
      //   }
      // },
      testphone(){
        var reg = /^1[34578]\d{9}$/;
        if(this.phone == ''){
          // Tips.toast('请输入手机号','none');
          return false;
        }
        else if(!reg.test(this.phone)) {
          // Tips.toast('请输入正确的手机号', 'none');
          return false;
        }else{
          return true
        }
      },
      testAdd(){
        if(this.detailAddress == ''){
          return false
        }else{
          return true
        }
      },
      postForm(){
        var _this = this;
        var _data={
          token:this.$store.state.token,
          consignee:this.people,
          phone:this.phone,
          regionInfo:this.region,
          detailAddress:this.detailAddress,
          areaCode:this.addressCode,
          postCode:this.postCode,
          isDefault:this.isDefault,
          id:this.id
        }
        // this.testpeople();
        if(!(this.testpeople())){
          Tips.toast('请输入收货人','none');
          return
        }
        // this.testphone()
        if(!(this.testphone())){
          Tips.toast('手机号输入有误','none');
          return
        }
        if(!(this.testAdd())){
          Tips.toast('请输入你的详细地址','none');
          return
        }
        getSignIn(_data).then(sec=>{
          _this.$http.postAddress(_data,sec).then(res=>{
            if(res.state==1){
                var url ;
                if(_this.frompage =='payLottery') {
                     url = `../myaddress/main?id=${this.id}&frompage=payLottery`;
                }else{
                     url = `../myaddress/main?id=${this.id}`;
                }
               wx.redirectTo({url})
            }else if(res.state == 903702){
              Tips.toast(`邮政编码错误`,'none')
            }else{
              Tips.toast(`${decodeURIComponent(res.msg)}`,'none')
            }
          })
        })

      },
      bindRegionChange(res){
        console.log(res);
        this.region = res.target.value;
        this.postCode = res.target.postcode;
      },
      getLocations(){
        let _this = this
        wx.getSetting({
          success(res) {

            // 判断用户是否授权过，
            // 未授权过、
            if (!res.authSetting['scope.userLocation']) {
              wx.authorize({
                scope: 'scope.userLocation',
                success(res) {
                  console.log(res);
                  _this.wxGetLocation()
                },
                fail(err) {
                  console.log(err);
                  // 当用户拒绝 查看自己的位置的时候  统计数据
                  // 统计数据  地理位置为空
                  _this.region = ['浙江省','杭州市','萧山区'];
                  _this.postCode = '311200';

                }
              })
            } else {
              // 授权过
              _this.wxGetLocation();
            }
          },
          fail(err) {
            console.log(err)
          }
        });
      },
      wxGetLocation(){
        let _this = this;
        wx.getLocation({
          type: 'wgs84',
          success: function (res) {
            console.log(res);
            let latitude,longitude;
            latitude = res.latitude.toString();
            longitude = res.longitude.toString();
            wx.request({
              header:{
                "Content-Type": "application/text"
              },
              url:'https://apis.map.qq.com/ws/geocoder/v1/?location='+latitude+','+longitude+'&key=BQ5BZ-KE434-I4CU6-X5WGI-J4MXE-7CFZL',
              success: function(res) {
                var country,province,city,district,curCity,addressCode;
                country = res.data.result.address_component.nation;
                province =res.data.result.address_component.province;
                city = res.data.result.address_component.city;
                district = res.data.result.address_component.district;
                addressCode =res.data.result.ad_info.adcode
                _this.region = [province,city,district];
                _this.addressCode = addressCode;
              }
            });
          },
          fail: function(err) {
            console.log(err);
          }
        });
      },

    }
  }
</script>

<style lang="scss" scoped>
.page{
  width:100%;
  overflow: hidden;
  .all_pa_con{
    width:710rpx;
    margin:0 20rpx;
    .peo_name{
      height:98rpx;
      border-bottom:1rpx solid $fontColor;
      display: flex;
      align-items: center;
      .left{
        width:150rpx;
        margin-right:50rpx;
      }
      input{
        width:510rpx;
      }
    }
  }
  .confirm_btn{
    position: fixed;
    left:0;
    bottom:0;
    height:100rpx;
    background:$btnri;
    width:100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color:#fff;
  }
}

</style>
