<template>
  <div>
    <!--标题栏-->
    <header class="bg-f " :style="'padding-top:'+status_bar_height+'px'">
      <h3 class="border-buttom">职员详情</h3>
      <span class="ico-retrun fz16" @click="back"><i class="left-arrow"></i></span>
      <router-link class="icon fc-r fz16" tag="i" :to="{path:'/addStaff',query:{id:id}}">编辑</router-link>
    </header>
    <div :style="'height:'+(status_bar_height+44)+'px'"></div>
    <!---->
    <div class="bg-f mb-5 ">
      <div class="head-box relative">
        <div class="img-box">
          <img :src="staffInfo.staffImage" width="100%" height="100%" v-if="staffInfo.staffImage"/>
          <img src="@/assets/imgs/partnerCenter/head.png" width="100%" v-else/>
        </div>
        <p class="fz20">{{staffInfo.realName}}<i :class="staffInfo.gender == 1 ? 'ico-man' : 'ico-girl' "></i></p>
        <p class="fz12 fc-c space_bet"><span>ID : {{staffInfo.userName}}</span><i>业务提成{{staffInfo.royaltyRate *
          10000/100}}%</i></p>
      </div>
      <p class="fz15 fw-6 pd-lr-10">业绩统计</p>
      <div class="flex-box fz10 pd-tb-5">
        <div class="item pd-tb-5 border-right">
          <p class="fw-6 fz17">{{vipCount || 0}}<span class="fz12 fc-c" style="font-weight: normal;margin-left: 6px">推广会员</span>
          </p>
        </div>
        <div class="item pd-tb-5 border-right">
          <p class="fw-6 fz17">{{biShopCount || 0}}<span class="fz12 fc-c" style="font-weight: normal;margin-left: 6px">推广商家</span>
          </p>
        </div>
        <div class="item pd-tb-5">
          <p class="fz15 fc-c" @click="toast('该功能即将开放')">查看数据统计</p>
        </div>
      </div>
    </div>
    <!---->
    <ul class="list bg-f">
      <li class="border-buttom clearfix">
        <span class="fl-l fz15">电话</span>
        <span class="fl-r fc-c fz15">{{staffInfo.phone}}</span>
      </li>
      <li class="border-buttom clearfix">
        <span class="fl-l fz15">生日</span>
        <span class="fl-r fc-c fz15">{{staffInfo.birthDay}}</span>
      </li>
      <li class="border-buttom clearfix">
        <span class="fl-l fz15">录入时间</span>
        <span class="fl-r fc-c fz15">{{staffInfo.createTime}}</span>
      </li>
      <li class="border-buttom clearfix">
        <span class="fl-l fz15">VIP</span>
        <span class="fl-r fc-c fz15">是</span>
      </li>
      <li class="border-buttom clearfix">
        <span class="fl-l fz15">到期时间</span>
        <span class="fl-r fc-c fz15">{{memberExpiryDate || ''}}</span>
      </li>
      <li class="border-buttom clearfix">
        <span class="fl-l fz15">状态</span>
        <span class="fl-r fc-c fz15">{{staffInfo.state == 0 ? '注销' : '激活'}}</span>
      </li>
      <li class="border-buttom clearfix">
        <span class="fl-l fz15">备注信息</span>
        <span class="fl-r fc-c remark fz15">{{staffInfo.remark}}</span>
      </li>
    </ul>
    <!---->
    <!--<div style="height: 52px;"></div>-->
    <div>
      <button type="button" class="btn" v-if="staffInfo.state == 0" @click="setStaffState">激活</button>
      <button type="button" class="btn bg-c" v-else-if="staffInfo.state == 1" @click="setStaffState">注销</button>
    </div>
    <v-toast :tip="tip" ref="toast"></v-toast>
  </div>
</template>

<script>
  import {getStaffDetail , setStaffState} from '@/assets/js/getData'
  import {timestampToTime} from "@/assets/js/jsBridge";

  export default {
    props: ['partnerToken'],
    data() {
      return {
        status_bar_height: this.$route.query.status_bar_height ? Number(this.$route.query.status_bar_height) : 0,
        tip: '',
        token: '',
        staffInfo: {},
        id: this.$route.query.id,
        zstAmounts: '', //账户余额
        totalmoney: '', //话呗余额
        biShopCount: '', //推广商家
        vipCount: '', //推广会员
        memberExpiryDate: '', //会员到期时间
      }
    },
    mounted() {

    },
    created: function () {
      let _self = this;
      _self.$getParterToken().then(res => {
        _self.token = res;
        _self.getStaffDetail();
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
      //点击更改，使得页面可编辑
      setEditState() {
        this.EditState = true;
      },
      //获取职员详情
      getStaffDetail() {
        let _self = this;
        let _data = {
          token: _self.token,
          id: _self.id //职员id
        };
        _self.$getSignIn(_data).then(sec => {
          getStaffDetail(_data,sec).then(res => {
            let _data = res.data;
            if (_data.state == 1) {
              _self.memberExpiryDate = _data.data.memberExpiryDate;
              _self.zstAmounts = _data.data.zstAmounts; //账户余额
              _self.totalmoney = _data.data.totalmoney; //话呗余额
              _self.biShopCount = _data.data.biShopCount; //推广商家
              _self.vipCount = _data.data.vipCount; //推广会员
              _self.staffInfo = _data.data.staff;
              _self.staffInfo.createTime = timestampToTime(_data.data.staff.createTime);
            } else {
              _self.toast(decodeURIComponent(_data.msg));
            }
          }).catch(function (error) {
            _self.toast(error);
          });
        })

      },
      //注销或者激活该职员
      setStaffState() {
        let _self = this;
        let _data = {
          token: _self.token,
          id: _self.id,//职员id
          state: _self.staffInfo.state == 0 ? 1 : 0, //0离职  1在职
          promoteState: _self.staffInfo.promoteState, //是否有推广功能  1是  0否
        }
        _self.$getSignIn(_data).then(sec => {
          setStaffState(_data,sec).then(res => {
            let _data = res.data;
            if (_data.state == 1) {
              _self.getStaffDetail();//注销或者激活后，再次获取职员详情回填
            } else {
              _self.toast(decodeURIComponent(_data.msg));
            }
          }).catch(function (error) {
            _self.toast(error);
          });
        })

      }
    }
  }
</script>

<style scoped>
  @import '../../../../assets/css/partner_base.css';
  header .icon {
    line-height: 44px;
  }

  .head-box {
    padding: 20px 10px 20px 138px;
  }

  .head-box .fz20 {
    line-height: 2;
  }

  .head-box .img-box {
    position: absolute;
    left: 35px;
    width: 65px;
    height: 65px;
    border-radius: 50%;
    overflow: hidden;
  }

  .head-box i {
    margin-left: 10px;
  }

  .head-box .space_bet {
    display: flex;
    justify-content: space-between;
  }

  .head-box .space_bet i {
    color: #F7094D;
    background: rgba(247, 9, 77, 0.05);
    border-radius: 20px;
    padding: 0 10px;

  }


  .list {
    padding-left: 13px;
    line-height: 56px;
  }

  .list li {
    padding-right: 15px;
  }

  .btn {
    width: 100%;
    margin: 0;
    position: fixed;
    left: 0;
    bottom: 0;
    border-radius: 0;
    line-height: 50px;
    font-size: 19px;
    z-index: 10;
  }

  .btn.bg-c {
    background: #D8D8D8;
  }

  .remark {
    width: 70%;
    line-height: 1.2;
    text-align: right;
    padding: 16px 0;
  }
</style>
