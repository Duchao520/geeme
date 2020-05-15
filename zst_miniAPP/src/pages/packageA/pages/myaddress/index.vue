<template>
  <div class="page">
      <div class="con_adr" v-if="dataList !=''">
          <div class="eve_con_adr" v-for="(item,index) in dataList" :key="item.id">
                <div class="le_eve_con">
                  <div class="eve_ph" v-if="swHref"  @click="goOrder(item)">{{item.consignee}}  {{item.phone}}</div>
                  <div class="eve_ph" v-if="!swHref">{{item.consignee}}  {{item.phone}}</div>
                  <div class="le_add" v-if="swHref"  @click="goOrder(item)">{{item.regionInfo[0]}} {{item.regionInfo[1]}} {{item.regionInfo[2]}} {{item.detailAddress}}</div>
                  <div class="le_add" v-if="!swHref">{{item.regionInfo[0]}} {{item.regionInfo[1]}} {{item.regionInfo[2]}} {{item.detailAddress}}</div>
                  <div class="iconHead">
                     <div class="iche_le">
                        <div style="float: left;display: flex;align-items: center">
                          <i class="iconfont icon-xianshi_xuanze" style="float:left;font-size: 36rpx;font-weight: 700"  :class="thisNum == index || item.isDefault == 1 ? 'isDefa':''"></i>
                          <span style="font-size: 26rpx;margin-left:10rpx;"  :class="thisNum == index || item.isDefault == 1 ? 'isDefa':''" @click="defaAdd(item,index)">设置为默认地址</span>
                        </div>
                     </div>
                     <div class="iche_ri">
                        <div style="display: flex;align-items: center;margin-right:20rpx;" @click="goEditor(item)">
                          <i class="iconfont icon-bianji1" style="float:left;font-size: 36rpx;color:#cc645b;"></i>
                          <span style="font-size: 26rpx;margin-left:10rpx;color:#cc645b;">编辑</span>
                        </div>
                       <div>
                         <i class="iconfont icon-shanchu" style="float:left;font-size: 36rpx;color:#cc645b;"></i>
                         <span style="font-size: 26rpx;margin-left:10rpx;color:#cc645b;" @click="deleAdd(item)">删除</span>
                       </div>
                     </div>
                  </div>
                </div>
          </div>
      </div>
      <div v-else class="noData">
         还没有地址哦，快去添加吧
      </div>
      <div class="add_address" @click="goEditorA">
          添加地址
      </div>
  </div>
</template>

<script>
  import {getQuery , getSignIn , encodeSearchParams} from '@/common/js/comm'
  import Tips from '@/common/js/tips'
  export default {
    data() {
      return {
        motto: 'Hello World',
        dataList:[],
        swHref:true,
        thisNum:-1,
        frompage:'',
        orderNum:'',
      }
    },
    mounted(){
      this.getaddress();
      var page = getCurrentPages();
      if(page[1].route.indexOf('perInfo')>-1){
          this.swHref = false;
      }
      var par = getQuery();
      this.frompage = par.frompage;
      console.log('我的地址页面',this.frompage);
      this.orderNum = par.orderNum;
    },
    methods: {
      getaddress(){
          var _this = this;
          var _data = {
            token:this.$store.state.token
          }
          getSignIn(_data).then(sec=>{
             _this.$http.getaddress(_data,sec).then(res=>{
               console.log('地址列表',res.data);
               if(res.state==1){
                 for(let i=0;i<res.data.length;i++){
                   res.data[i].regionInfo = res.data[i].regionInfo.trim().split(",")
                 }
                  _this.dataList = res.data;
                 console.log(res.data);
               }
             })
          })
      },
      //去往编辑页面
      goEditor(par){
        var str = encodeSearchParams(par);
          var url;
          if(this.frompage =='payLottery'){
               url = `../goeditor/main?${str}&frompage=payLottery`;
          }else{
               url = `../goeditor/main?${str}`;
          }
          wx.redirectTo({ url })
      },
      //选中之后去往订单页面
      goOrder(par){
        if(this.frompage =='payLottery'){
          const url = `../payLottery/main?id=${par.id}&consignee=${par.consignee}&phone=${par.phone}
        &regionInfo=${par.regionInfo}&detailAddress=${par.detailAddress}&areaCode=${par.areaCode}`;
          wx.redirectTo({url})
        }else {
          const url = `../orderpage/main?id=${par.id}&consignee=${par.consignee}&phone=${par.phone}
        &regionInfo=${par.regionInfo}&detailAddress=${par.detailAddress}&areaCode=${par.areaCode}`;
          wx.redirectTo({url})
        }
      },
      //添加地址
      goEditorA(){

        var url;
        if(this.frompage =='payLottery'){
            url = `../goeditor/main?&frompage=payLottery`;
        }else{
            url = `../goeditor/main?`;
        }
        // const url = '../goeditor/main';
        wx.redirectTo({ url })
      },
      //设置为默认地址
      defaAdd(item,ind){
        console.log('前面带的参数',ind)
          var _this = this;
          _this.thisNum = ind;
          var _data = {
            isDefault:1,
            token:_this.$store.state.token,
            id:item.id
          };
          console.log(_data)
          getSignIn(_data).then(sec=>{
            _this.$http.setDeAdd(_data,sec).then(res=>{
                if(res.state == 1){
                  Tips.toast('已设为默认地址','none');
                  _this.dataList = [];
                  _this.thisNum = -1;
                  _this.getaddress();
                }
            })
            console.log('默认地址设置',res);
          })
      },
      //删除地址
      deleAdd(item){
        console.log(item);
          var _data = {
            token:this.$store.state.token,
            id:item.id
          }
          var _this = this;
        Tips.confirm('确认删除该地址吗','',{'yes':1}).then(res=>{
          if(res.yes == 1){
            getSignIn(_data).then(sec=>{
              console.log(sec);
              _this.$http.deleteAdd(_data , sec).then(res=>{
                if(res.state == 1){
                  Tips.toast('删除成功','none');
                  this.getaddress(this.parData);
                }else{
                  Tips.toast(decodeURIComponent(res.msg),'none');
                }
              })
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.page{
  .isDefa{
    color:#cc645b;
  }
  width:100%;
  overflow: hidden;
  .con_adr{
    width:710rpx;
    margin:0 20rpx;
    .eve_con_adr{
      border-bottom:2rpx solid $backColor;
      width:100%;
      @include jcsa;
      .le_eve_con{
        width:100%;
        padding:16rpx 0;
        .eve_ph{
          font-weight: 700;
        }
        .le_add{
          width:100%;
          padding:20rpx 0;
          font-size: 28rpx;
          @include ovhm(2);
        }
        .iconHead{
          display: flex;
          justify-content: space-between;
          align-items: center;
          .iche_ri{
            display: flex;
            justify-content: space-around;
          }
        }
      }
      .ri_eve_con{
        i{
          font-size: 40rpx;
          color:$iconColor;
        }
      }
    }
  }
  .add_address{
    @include poFix(0,0);
    @include inwh(100%,100rpx);
    background:$btnri;
    color:#fff;
    line-height: 100rpx;
    text-align: center;
  }
}

</style>
