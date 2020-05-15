<template>
    <div class="page">
        <div class="downApp">
           <img :src="imgUrl" alt="">
           <div class="btn_img" @click="downApp" v-if="saveImgBtnHidden">
             <img src="../../static/img/savePhoto.png" alt="">
           </div>
          <button type='primary' class='newBtn' open-type="openSetting"
                  bindopensetting='handleSetting' v-if='openSettingBtnHidden'></button>
        </div>
    </div>
</template>

<script>
    import Tips from '@/common/js/tips';
    export default {
        name: "index",
        data(){
          return {
              imgUrl:'',
              bjtempFilePath:'',
              saveImgBtnHidden:true,
              openSettingBtnHidden:false
          }
        },
        onShow(){
            this.saveImgBtnHidden=true;
            this.openSettingBtnHidden=false;
        },
        mounted(){
           this.imgUrl = 'https://zhushangtong.oss-cn-hangzhou.aliyuncs.com/guide/2019/6/4/9f51316282bd3263463919388ea93bf7.png';
        },
        methods:{
          downApp(){
            var _this = this;
            wx.downloadFile({
              url: _this.imgUrl,
              success(res) {
                if (res.statusCode == 200) {
                  console.log('路径',res.tempFilePath);
                  _this.bjtempFilePath = res.tempFilePath;
                  _this.save();
                }
              }
            })
          },
          save() {
            var _this = this;
            //获取相册授权
            wx.getSetting({
              success(res) {
                if (!res.authSetting['scope.writePhotosAlbum']) {
                  wx.authorize({
                    scope: 'scope.writePhotosAlbum',
                    success() {//这里是用户同意授权后的回调
                      _this.savaImageToPhoto();
                    },
                    fail() {//这里是用户拒绝授权后的回调
                      _this.saveImgBtnHidden = false;
                      _this.openSettingBtnHidden = true;

                    }
                  })
                }else{
                  _this.savaImageToPhoto();
                }
              }
            })
          },
          savaImageToPhoto(){
            var _this = this;
            wx.saveImageToPhotosAlbum({
              filePath: _this.bjtempFilePath,
              success(result) {
                if(result.errMsg == "saveImageToPhotosAlbum:ok"){
                  Tips.toast('保存成功','none')
                }
              },
              fail(res){
                Tips.toast('保存失败','none');
              }
            })

          },
        }
    }
</script>

<style lang="scss" scoped>
.page{
  width:100%;
  .downApp{
    width:750rpx;
    height:1206rpx;
    position: relative;
    img{
      width:100%;
      height:100%;
      display: block;
    }
    .btn_img{
      position: absolute;
      width:250rpx;
      height:80rpx;
      left:0;right:0;margin:0 auto;
      bottom:236rpx;
      border-radius: 10rpx;
      img{
        width:100%;
        height:100%;
        display: block;
      }
    }
    .newBtn{
      position: absolute;
      width:250rpx;
      height:80rpx;
      left:0;right:0;margin:0 auto;
      bottom:236rpx;
      border-radius: 10rpx;
      background-image: url('../../static/img/souquan.png');
      -webkit-background-size: 250rpx 80rpx;
      background-size: 250rpx 80rpx;
    }
  }
}
</style>
