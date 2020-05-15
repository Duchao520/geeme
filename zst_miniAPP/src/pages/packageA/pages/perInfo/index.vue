<template>
    <div class="page">
       <div class="head_top">
            <div class="head_he" @click="choseImg">
               <img :src="ava" alt="">
            </div>
            <div class="head_title" @click="choseImg">
                选择图片
            </div>
       </div>
      <div class="eve_head">
          <div class="eve_le">
              昵称
          </div>
          <div class="eve_ri">
              {{dataList.nick}}
          </div>
      </div>

      <div class="eve_head">
        <div class="eve_le">
          地区
        </div>
        <div class="eve_ri">
          {{dataList.cityName == ''?'暂无':dataList.cityName}}
        </div>
      </div>

      <div class="eve_head"  @click="goAddress">
        <div class="eve_le">
           我的收货地址
        </div>
        <div class="eve_ri">
          <i class="iconfont icon-iconfontjiantou5"></i>
        </div>
      </div>

      <div class="eve_head" style="border:none;" @click="goPhone">
        <div class="eve_le">
          更换绑定手机号
        </div>
        <div class="eve_ri">
          <i class="iconfont icon-iconfontjiantou5"></i>
        </div>
      </div>
      <div class="shuxian"></div>
      <div class="eve_head" style="border:none;">
        <div class="eve_le">
           当前占用空间大小
        </div>
        <div class="eve_ri">
          {{currSize}}
        </div>
      </div>
      <div class="eve_head" style="border:none;" @click="clearCurr">
        <div class="eve_le">
            清除缓存
        </div>
        <div class="eve_ri">
           点击清除缓存
        </div>
      </div>
      <div class="shuxian"></div>
    </div>
</template>

<script>
  import Tips from '@/common/js/tips'
  import { getSignIn } from '@/common/js/comm'
  import { mapMutations } from 'vuex'
  import { ICONIMG }  from '@/store/mutation-types'
    export default {
        name: "index",
        data(){
          return {
            ava:'',
            nick:'',
            currSize:'',
            dataList:{
              nick:this.$store.state.nickCname,
              cityName:this.$store.state.cityName
            },
            cityName:'',
          }
        },
        mounted(){
           this.ava = this.$store.state.iconImg == '' ? this.$store.state.avatar : this.$store.state.iconImg;
           this.nick = this.$store.state.nickname;
           this.cityName = this.$store.state.cityname;
           this.getSize();
        },
        methods:{
          ...mapMutations({
            iconImg:'ICONIMG',
          }),
          goAddress(){
            wx.navigateTo({
              url:'/pages/packageA/pages/myaddress/main'
            })
          },
          goPhone(){
            wx.navigateTo({
              url:'/pages/packageA/pages/replPhone/main'
            })
          },
          getSize(){
            var _this = this;
            wx.getStorageInfo({
              success(res) {
                _this.currSize = `${res.currentSize}kb`;
              }
            })
          },
          clearCurr(){
            var _this = this;
            wx.clearStorage({
              success(res){
                Tips.toast('清除成功', 'none');
                _this.currSize = `0kb`;
              },
              fail(res){
                console.log(res)
              }
            })
          },
          choseImg(){
            var _this =  this;
            wx.chooseImage({
              count: 1, // 最多可以选择的图片张数，默认9
              sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
              sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
              success: function (res) {
                var avatar = res.tempFilePaths;
                _this.ava = avatar;
                var _data = {
                  token:_this.$store.state.token,
                }
                getSignIn(_data).then(sec=>{
                  wx.uploadFile({
                    url: 'https://zst.tenzhao.com/api/voip/user/ico/upload/file',
                    filePath: _this.ava[0],
                    name: 'userIco',
                    formData:_data,
                    header: {
                      "Content-Type": "multipart/form-data",
                      sec: sec
                    },
                    success(res) {
                      console.log('好像没有上传成功',JSON.parse(res.data));
                      if(res.statusCode == 200){
                        var data = JSON.parse(res.data);
                        Tips.toast('头像已修改', 'none');
                        _this.iconImg(data.icoUrl);
                        _this.ava = '';
                        _this.ava = data.icoUrl;
                      }
                    }
                  })
                })
              },
              fail: function () {
              },
              complete: function () {
              }
            })
          },
        },
    }
</script>

<style lang="scss" scoped>
.head_top{
  width:100%;
  height:354rpx;
  background:#f2f2f2;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .head_he{
    width:160rpx;
    height:160rpx;
    background:#f2f2f2;
    border-radius: 50%;
    margin-bottom:20rpx;
    img{
      width:100%;
      height:100%;
      display: block;
      border-radius: 50%;
    }
  }
  .head_title{
    font-size: 30rpx;
  }
}
.eve_head{
  width:710rpx;
  margin:0 20rpx;
  display: flex;
  justify-content: space-between;
  border-bottom:2rpx solid rgba(60,52,83,0.3);
  padding:20rpx 0;
  font-size: 28rpx;
}
.shuxian{
  width:100%;
  height:10rpx;
  background:#f2f2f2;
}
</style>
