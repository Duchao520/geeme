<template lang="pug">
  .g-upload#g-upload
    el-upload(
      v-if="!onlyPreview"
      :action="uploadUrl",
      :headers="myHeaders",
      :file-list="myList",
      list-type="picture-card",
      :on-preview="handlePictureCardPreview",
      :on-remove="handleRemove",
      :on-success="handleAvatarSuccess",
      :before-upload="beforeAvatarUpload",
      multiple,
      :limit="limit",
      :on-exceed="albumExceed",
      :class='{hideUpload: fileList.length>=limit,}',
    ) 
      i.el-icon-plus
    //- 以下为仅支持预览的uoload 供各详情页面使用
    el-upload(
      v-else
      :action="uploadUrl",
      :headers="myHeaders",
      :file-list="myList",
      list-type="picture-card",
      :on-preview="handlePictureCardPreview",
      :on-remove="handleRemove",
      :on-success="handleAvatarSuccess",
      :before-upload="beforeAvatarUpload",
      multiple,
      :limit="1",
      :on-exceed="albumExceed",
      :class='{hideUpload: fileList.length>=limit,}',
    ) 
      div(
         slot="file" slot-scope="{file}"
      )
        img(
        class="el-upload-list__item-thumbnail"
        :src="file.url" alt=""
        )
        span.el-upload-list__item-actions
          span(
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          )
            i.el-icon-zoom-in

    el-dialog(
      :visible.sync="dialogVisible"
    )
      img(
        width="100%",
        :src="dialogImageUrl"
      )
    .tip(v-show="tip") {{ tip }}
</template>
<script>
import * as api from '@/assets/js/interface'
import * as utils from '@/assets/js/utils'
import * as datas from '@/assets/js/datas'
export default {
  props: {
    limit: {
      type: Number,
      default: 1
    }, // 图片的限制张数
    tip: String, // 图片提示
    size: Number, // 图片的大小
    hasPhoto: {
      type: Boolean,
      default: true
    }, // 是否有默认图片
    photoList: {
      type: Array, 
      default: function () {
        return []
      }
    }, // 已有的图片
    type: String,
    // 仅支持预览
    onlyPreview: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formatPicImage: utils.formatPicImage, // 有尺寸的图片处理
      imgId: '',
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [], // 最终的图片列表
      myList: [], // 组件中的图片列表
      num: 1
    }
  },
  watch: {
    photoList(val) {
      if (this.hasPhoto) {
        this.initImgList(val)
      }
    }
  },
  computed: {
    uploadUrl() {
      // 获取服务器端上传图片的URL
      return api.uploadPicture.URL
    },
    myHeaders() {
      return utils.getUploadHeader()
    },
  },
  created() {
    // this.initImgList(this.photoList)
  },
  methods: {
    initImgList(val) {
      if (this.num === 1 && val.length) {
        val.forEach((id, index) => {
          this.myList.push({
            name: index,
            fileKey: id,
            url: utils.formatPicImg(id)
          })
        })
      }
      this.num ++
      // 赋值到fileList,此属性是保存图片id列表
      this.fileList = val
    },
    // 文件超出限制
    albumExceed(files, fileList) {
      if ((files.length + fileList.length) > this.limit) {
        this.$message.error('最多上传' + this.limit + '张');
      }
    },
    // 上传成功
    handleAvatarSuccess(res, file) {
      console.log(this.myList)
      // 将新图片push到列表中
      this.fileList.push(res.fileKey)
      // 传值给父组件
      this.$emit('change', this.fileList,this.type)
    },
    // 上传前
    beforeAvatarUpload(file) {
      const isJPG = utils.checkImgType(file.type)
      const isLt2M = file.size / 1024 /1024 < this.size;
      console.log(isJPG,isLt2M)
      if (!isJPG) {
        this.$message.error('上传门店图片格式只能是 JPG/PNG 格式!');
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传门店图片大小不能超过'+ this.size +'M!');
      }
      return isJPG && isLt2M;
    },
    // 删除
    handleRemove(file) {
      console.log(this.myList)
      let fileKey = file.fileKey
      this.fileList.forEach((item, index) => {
        let reg = new RegExp(fileKey)
        if(reg.test(item)) {
          // 开始删除该元素
          this.fileList.splice(index, 1)
        }
      })
      // 传值给父组件
      this.$emit('change', this.fileList,this.type)
    },
    // 预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  },
}
</script>
<style lang="scss" scoped>
  #g-upload {
    position: relative;
    .avatar-uploader {
      width: 70px;
      height: 70px;
      float: left;
      .el-upload {
        width: 100%;
        height: 100%;
        .avatar {
          width: 70px;
          height: 70px;
        }
        .avatar-uploader-icon {
          width: 70px;
          height: 100%;
          line-height: 70px!important;
        }
      }
    }
    .tip {
      font-size: 12px;
      color: #999999;
    }
  }
</style>
<style lang="scss">
#g-upload .el-upload--picture-card{
  width: 100px;
  height: 100px;
  i{
    transform: translateY(-17px);
  }
}
#g-upload .hideUpload .el-upload--picture-card {
  display: none;
}
#g-upload .el-upload-list--picture-card .el-upload-list__item{
  width: 100px;
  height: 100px;
}
</style>
