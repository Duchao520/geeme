<template>
  <div class="comment">
    <p class="fz-30" style="margin-bottom: .38rem">留言内容</p>
    <textarea class="comment-input" placeholder="您的评价至关重要" v-model="comment"></textarea>
    <div class="flex_box" style="flex-wrap: wrap">
      <div class="form-file" v-for="(item,index) in imgs" :key="index">
        <img src="@/assets/imgs/common/close.png" alt="" class="delete" @click="removeImg(index)">
        <img v-lazy="item" alt="" class="thumb">
      </div>
      <div class="form-file" v-show="imgs.length<3">
        <input type="file" accept="image/*" @change="getFileList" multiple>
        <button class="flex_box flex_column align_center box_padding" style="padding-top: .3rem" type="button">
          <i style="font-size: .68rem;color: #C0C0C6;display: block">+</i>
          <span class="fz-28" style="color: #C0C0C6;display: block">上传图片</span>
        </button>
      </div>
    </div>
    <button class="submitBtn fz-36 fc-ffffff" @click="bargainComment">确认提交</button>
  </div>
</template>

<script>
  import {uploadImg} from "@/assets/js/comm";
  import {dataURLtoBlob} from "@/assets/js/deal";
  import {bargainComment} from "@/assets/js/comm";
  import axios from 'axios';

  export default {
    name: "comment",
    props: ['tokenPromise'],
    data(){
      return{
        tip: '',
        size: 1024 * 1024 * 10,
        imgs: [],
        comment: '',
        token: '',
        bargainTasksId: this.$route.query.bargainTasksId,
      }
    },
    mounted(){
      var _self = this;
      _self.tokenPromise.then(res => {
        _self.token = res;
      })
    },
    methods: {
      getFileList(e){
        var _self = this;
        var files = e.target.files;

        if(files.length > 3){
          _self.$emit('toast','请勿上传超过3个文件')
        }else {
          var _formate = new FormData();
          for(var i=0; i< files.length; i++){
            if(files[i].size > _self.size){
              _self.$emit('toast','请勿上传超过10M的图片')
            }else{
              _formate.append('files',files[i]);
            }
          }
          this.$emit('showLoad',1);
          axios.post('/api/voip/img/uploads',_formate).then(res => {
            this.$emit('showLoad',0);
            if(res.data.state == 1){
              _self.imgs = _self.imgs.concat(res.data.data.urls);
            }else{
              _self.$emit('toast',decodeURIComponent(res.data.msg));
            }
          }).catch(error => {
            this.$emit('showLoad',0);
          })
        }

      },
      bargainComment(){
        var _self = this;
        if(_self.comment){
          var imgs = '';
          _self.imgs.forEach((ele,index) => {
            if(index == _self.imgs.length-1){
              imgs += ele
            }else{
              imgs += ele + ','
            }
          })
          var _data = {
            token: String(_self.token),
            bargainTasksId: String(_self.bargainTasksId),
            imgs: String(imgs),
            comment: String(_self.comment)
          };
          bargainComment(_data).then(res => {
            if(res.data.state == 1){
              _self.$emit('toast','评价成功');
              _self.$router.go(-1);
            }else{
              _self.$emit('toast',decodeURIComponent(res.data.msg));
            }
          })
        }else{
          _self.$emit('toast','请输入评价内容');
        }
      },
      removeImg(index){
        this.imgs = this.imgs.filter((ele,idx) => idx!==index)
      }
    }
  }
</script>

<style lang="scss" scoped>
 .comment{
   box-sizing: border-box;
   padding: .2rem;
   .comment-input{
     display: block;
     width: 100%;
     height: 2.5rem;
     background: #EEEEEE;
     text-align: start;
     box-sizing: border-box;
     padding: .25rem .36rem;
     font-size: .3rem;
     margin-bottom: .2rem;
   }
   .comment-input::placeholder{
     font-size: .28rem;
     color: #8D8E98;
   }
   .form-file{
     width: 1.82rem;
     height: 1.82rem;
     border: .02rem solid #E5E5E5;
     margin-right: .28rem;
     margin-bottom: .28rem;
     position: relative;
     .delete{
       display: block;
       width: .55rem;
       height: .55rem;
       position: absolute;
       top: 0;
       right: 0;
     }
     input{
       display: block;
       width: 100%;
       height: 100%;
       opacity: 0;
     }
     .thumb{
       display: block;
       width: 100%;
       height: 100%;
       border-radius: .1rem;
     }
     button{
       display: block;
       width: 100%;
       height: 100%;
       position: absolute;
       top: 0;
       left: 0;
       z-index: -1;

     }
   }

   .submitBtn{
     margin-top: 1rem;
     display: block;
     width: 100%;
     height: 1rem;
     border-radius: .1rem;
     background: #FA336C;
   }
 }
</style>
