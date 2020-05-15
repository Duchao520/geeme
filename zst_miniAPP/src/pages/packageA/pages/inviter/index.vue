<template>
    <div class="page">
        <div class="inv_top">
             <span style="font-size: 24rpx;">VIP会员{{dataList.memberNum}}人/普通会员{{dataList.commonNum}}人</span>
             <span style="font-size:30rpx;">累计邀请{{dataList.totalNum}}人</span>
        </div>

       <div class="inv_mid">

          <div class="noData" v-if="!showIt">
              <div style="font-size: 30rpx;">当前还没有推荐人</div>
              <div style="background:#FFA61A;color:#fff;font-size:24rpx;padding:8rpx 40rpx;border-radius: 40rpx" @click="handlePh">手动绑定</div>
          </div>

          <div class="inv_mid_con" v-if="showIt">
              <div class="in_mi_le">
                  <div class="in_mi_top">我的推荐人</div>
                  <div class="in_mi_bot">
                    <div class="le_inv">
                      <img :src="myReferee.ico" alt="">
                    </div>
                    <div class="ri_inv">
                        <div>{{myReferee.nick}}</div>
                        <div>{{myReferee.username}}</div>
                    </div>
                  </div>
              </div>
          </div>
       </div>

      <div class="inv_bot">
         <div class="inv_eve" v-for="item in dataList.data" v-if="dataList.data !=''" @click="goInvDet(item)">
            <div class="inv_eve_le">
              <img :src="'http://zhushangtong.img-cn-hangzhou.aliyuncs.com'+item.ico" alt="">
            </div>
            <div class="inv_eve_ri">
                <div style="font-size: 34rpx;overflow: hidden">
                  <span style="float: left;margin-right: 10rpx;">{{item.nick}}</span>
                  <span style="float: left;" v-if="item.gender == 1"><i class="iconfont icon-nanren" style="color:#0884e1;"></i></span>
                  <span style="float: left;" v-if="item.gender == 0"><i class="iconfont icon-nvren" style="color:#fe8989 ;"></i></span>
                </div>
                <div style="font-size: 30rpx;color:#9A9DA5;">注册时间：{{item.registeTimeStr}}</div>
            </div>
         </div>

        <no-data :showNoData = "noData" :noticeMes="conNot"/>

      </div>

    </div>

</template>

<script>
  import { getSignIn } from '@/common/js/comm'
  import Tips from '@/common/js/tips'
  import noData from '@/components/noData'
    export default {
      name: "index",
      components:{
        noData
      },
      data(){
        return {
          dataList:'',
          myReferee:'',
          myAgent:'',

          noData:false,
          conNot:'',
          showIt:true,
        }
      },

      mounted(){
        this.getMyTeam();
      },
      methods:{
        handlePh(){
          Tips.confirm('若绑定推荐，则原有团队成员将 被清空','',{'yes':'1'}).then(res=>{
            console.log(res);
            const url = '../../pages/bindingPage/main';
             wx.navigateTo({ url })
          })
        },
        getMyTeam(){
          var _this = this;
          var _data= {
            token:this.$store.state.token,
            getTime:0,
          }
          getSignIn(_data).then(sec=>{
             _this.$http.getMyteam(_data,sec).then(res=>{

               _this.dataList = res;
               console.log('看看这里的列表',_this.dataList);
               if(this.dataList.data == ''){
                   _this.noData = true;
                   _this.conNot = '暂无邀请人';
               }
               _this.myReferee = res.myReferee;
               if(_this.myReferee.id){
                  _this.showIt = true;
               }else{
                 _this.showIt = false;
               }
               _this.myAgent = res.myAgent;
             })
          })
        },
        goInvDet(par){
          wx.navigateTo({
            url:`../../pages/inviterDetail/main?imAccount=${par.imAccount}`
          })
        },
      }
    }
</script>

<style  lang="scss" scoped>
  [v-cloak] {
    display: none;
  }
.page{
  width:100%;
  overflow: hidden;
  .inv_top{
    width:710rpx;
    height:76rpx;
    background:#F70B4D;
    @include jcsb;
    padding:0 20rpx;
    span{
      color:#fff;
    }
  }
  .inv_mid{
    width:100%;
    background:#f6f6f6;
    float: left;
    .noData{
      display: flex;
      justify-content: space-between;
      align-items: center;
      height:90rpx;
      padding:0 20rpx;
    }
    .inv_mid_con{
      width:710rpx;
      margin:20rpx;

      background:#fff;
      border-radius: 10rpx;
      display: flex;
      justify-content: space-between;
      float: left;
      .in_mi_le{
        margin:20rpx;
        width:100%;
        .in_mi_top{
          font-size: 30rpx;
          margin-bottom:42rpx;
        }
        .in_mi_bot{
           .le_inv{
             float: left;
             width:78rpx;
             height:78rpx;
             background:#EEEEEE;
             border-radius: 50%;
             margin-right:20rpx;
             img{
               width:100%;
               height:100%;
               display:block;
               border-radius: 50%;
             }
           }
          .ri_inv{
             float: left;
             font-size: 28rpx;
             div{
               width:560rpx;
               @include ovh;
             }

          }
        }
      }
      .in_mi_ri{
        margin:20rpx;
        width:50%;
      }
    }
  }
  .inv_bot{
    width:670rpx;
    padding:0 40rpx;
    .inv_eve{
      width:100%;
      display: flex;
      align-items: center;
      padding:20rpx;
      .inv_eve_le{
        width:102rpx;
        height:102rpx;
        border-radius: 50%;
        float: left;
        background: #ff6700;
        margin-right:10rpx;
        img{
          width:100%;
          height:100%;
          display: block;
          border-radius:50% ;
        }
      }
    }
    .inv_eve_ri{
      float: left;
    }
  }
}
</style>
