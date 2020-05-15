<template>
  <div class="photo-library-wrapper" id='photo-library-wrapper'>
    <!-- top -->
    <div class="operation top">
      <G-TypeSelect :list="typeList" @select="select" @click='closeGroup'/>
      <div class='headerBtn'>
        <a-button
          style="margin:0 20px 0 0; width:90px;"
          type="primary" @click="changeType('upload')">上传</a-button>
        <a-popover title='请输入分组名称' trigger="click" placement="bottomRight" v-model='GroupPopover'>
          <a-input slot="content" v-model='groupName' :autoFocus='true' @pressEnter='addGroup' maxlength='10'></a-input>
          <div class='btns' slot="content">
            <a-button @click='GroupPopover=false'>取消</a-button>
            <a-button type="primary" @click='addGroup'>确认</a-button>
          </div>
          <a-button
            style="background:#F52D56; border:none; color: #ffffff;" >
            新建分组
          </a-button>
        </a-popover>
      </div>
    </div>
    <!-- content -->
    <div class="content" id='content'>
      <a-checkbox-group v-model='checkedList' v-if='photoList.length> 0'>
        <G-PhotoFrame class="item" v-for="item in photoList" :checkedList='checkedList' :data='item' :key="item.key" @click='delItems'/>
      </a-checkbox-group>
      <div v-else class='noList'>暂无数据</div>
    </div>
    <!-- bottom -->
    <div class="operation bottom">
      <div>
        <a-checkbox style="color:#333333;" :checked='checkedAll' @change='changeAll'>全选</a-checkbox>
        <G-OptButton type="deletePhoto" @click='delItems(checkedList)'></G-OptButton>
        <a-button
          style="background:#41CAC0; border:none;  color: #ffffff;"
          icon="swap" @click='changeType("move")'>
          移动分组
        </a-button>
      </div>
      <a-pagination
        showQuickJumper
        :pageSize.sync="queryInfo.pageSize"
        v-model="queryInfo.pageNum"
        @change="onPageChange"
        :total="total"
        :showTotal="total => `共 ${total} 条`"/>
    </div>
    <!-- 上传弹框 -->
    <a-modal
      :title="operationType == 'upload'? '上传素材': '移动分组' "
      v-model="uploadModal"
    >
      <a-row :gutter='15'>
        <a-col :span="6"><span class="textItem">选择分组</span></a-col>
        <a-col :span="18">
          <a-select v-model='groupId' style="width: 120px">
            <a-select-option v-for='(item,key) in filterGroup' :key='key' :value="item.id">{{item.name}}</a-select-option>
          </a-select>
        </a-col>
      </a-row>
      <a-row :gutter='15' v-if='operationType == "upload"'>
        <a-col :span="6"><span class="textItem">上传图片</span></a-col>
        <a-col :span="18">
          <a-upload
            multiple
            :action="uploadUrl"
            listType="picture-card"
            :fileList="fileList"
            @change="handleChange"
            :headers='uploadHeader'
            @preview="handlePreview"
          >
            <div>
              <a-icon type="plus" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
        </a-col>
      </a-row>
      <template slot="footer">
        <a-button key="back" @click="uploadModal = false">取消</a-button>
        <a-button key="submit" type="primary" :loading="upLoading" @click="submit">
          确认
        </a-button>
      </template>
    </a-modal>
    <!-- 预览图片 -->
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%;margin-top:20px;" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script>
import { uploadUrl, uploadHeader } from '@/api/upload'
import { addMediaStorageGroup, getMediaStorageGroup, addMediaToGroup, getMedia, delMedia, moveMedia, delMediaStorageGroup } from '@/api/materialBase'
export default {
  data() {
    return {
      typeList: [],
      photoList: [],
      filterGroup: [], //过滤全部和未分组 分组
      uploadModal: false,
      GroupPopover: false,
      upLoading: false,
      fileList: [],
      uploadUrl: uploadUrl,
      uploadHeader: uploadHeader(),
      mediaType: 'image', // 素材类型
      groupName: '', // 新增分组名称
      groupId: null,
      uploadList: [],
      queryInfo: {
        groupId: '',
        pageNum: 1,
        pageSize: 12
      },
      total: 0,
      checkedList: [],
      checkedAll: false,
      previewVisible: false,
      previewImage: '',
      operationType: 'upload', // upload 上传 move 移动分组
    }
  },
  watch: {
    checkedList(val) {
      if (this.photoList.length> 0) this.checkedAll = val.length < this.photoList.length ? false : true;
    }
  },
  mounted() {
    var content = document.getElementById('content');
    let rowSize = Math.floor(content.offsetWidth / (183+15));  // 183图片盒子宽度 + 15 间距
    this.queryInfo.pageSize = rowSize*2;
    this.init();
    let that = this
    window.onresize = () => {
      return (() => {
        var content = document.getElementById('content');
        let rowSize = Math.floor(content.offsetWidth / (183+15));  // 183图片盒子宽度 + 15 间距
        if (that.queryInfo.pageSize/2 != rowSize) {
          that.queryInfo.pageSize = rowSize*2;
          that.getMediaList();
        }
      })()
    }
  },
  methods: {
    init() {
      this.getGroupList();
    },
    // 获取分组列表
    async getGroupList() {
      let res = await getMediaStorageGroup({mediaType: this.mediaType})
      if (res.code == 1200) {
        this.typeList = res.data;
      }
    },
    // 获取素材列表
    async getMediaList(num) {
      let mediaType = this.mediaType;
      this.queryInfo.pageNum = num ? num : this.queryInfo.pageNum;
      let param  = {...this.queryInfo, mediaType}
      let res = await getMedia(param)
      if (res.code == 1200) {
        res.data.medias.forEach(item => {
          item.checked = false;
        })
        this.photoList = res.data.medias;
        this.total = res.data.total;
      } else {
        this.$message.error(res.message)
      }
    },
    // 切换分组
    select(id) {
      this.queryInfo.groupId = id;
      this.getMediaList(1);
      this.checkedList = [];
    },
    // 点击显示上传弹框
    changeType(type) {
      if (type == 'move') {
        if (this.checkedList.length <= 0) {
          return this.$message.error('请先选择要移动的素材')
        }
      }
      let arr = [];
      this.typeList.forEach(item => {
        if (item.id>=0) {
          arr.push(item)
        }
      })
      this.filterGroup = arr;
      this.operationType = type
      this.groupId = null;
      this.uploadModal = true;
      this.fileList = [];
    },
    // 提交上传内容
    async submit() {
      if (this.operationType == 'upload') {
        if (this.fileList.length <= 0) {
          this.$message.error('请先上传图片！');
        } else {
          this.upLoading = true;
          try {
            let mediaKeys = []
            this.fileList.forEach(item => {
              if (item.response && item.response.code == 1200) {
                mediaKeys.push(item.response.data.fileKey)
              }
            })
            let param = {
              groupId: this.groupId ? this.groupId: -1, // 未选择分组默认添加到未分组中
              mediaType: this.mediaType,
              mediaKeys: mediaKeys
            }
            let res = await addMediaToGroup(param)
            if (res.code == 1200) {
              this.success('上传成功');
              this.uploadModal = false;
            } else {
              this.$message.error(res.message);
            }
          } finally {
            this.upLoading = false;
          }
        }
      } else {
        this.moveItems();
      }
    },
    // 新增分组
    async addGroup() {
      if (this.groupName != '') {
        const res = await addMediaStorageGroup({mediaType: this.mediaType,name: this.groupName})
        if (res.code == 1200) {
          this.success('添加成功');
          this.groupName = '';
          this.GroupPopover = false;
        } else {
          this.$message.error(res.message);
        }
      } else {
        this.$message.error('请输入分组名称')
      }
    },
    // 上传文件状态
    handleChange (info) {
      let file = info.file
      let fileList = info.fileList
      const isJPG =  /(jpg|jpeg|png|gif)$/.test(file.type);
      if (!isJPG) {
        file.status = ''
        return this.$message.error('仅支持JPG，PNG，GIF三种格式');
      }
      const isSize = file.size / 1024 / 1024 < 5
      if (!isSize) {
        file.status = ''
        return this.$message.error(`上传图片大小不能超过5M！`)
      }
      this.fileList = fileList
    },
    // 删除单个或多个素材
    delItems(items) {
      let that = this
      if (items.length > 0) {
        this.$confirm({
          title: '删除素材',
          content: '确定要删除所选数据吗？',
          async onOk() {
            let param = {
              ids: items,
              mediaType: that.mediaType
            }
            let res =  await delMedia(param);
            if (res.code == 1200) {
              that.success('删除成功');
            } else {
              that.$message.error(res.message);
            }
          },
          onCancel() {},
        });
      } else {
        this.$message.error("请先选择要删除的素材");
      }
    },
    //移动分组
    async moveItems () {
      let param = {
        groupId: this.groupId,
        ids: this.checkedList,
        mediaType: this.mediaType
      }
      let res = await moveMedia(param);
      if (res.code == 1200) {
        this.success('移动成功');
        this.uploadModal = false;
      } else {
        this.$message.error(res.message)
      }
    },
    // 删除分组
    closeGroup(data) {
      let that = this
      if(data.system) {
        return this.$message.error('系统分组不能删除！');
      }
      this.$confirm({
        title: '删除分组',
        content: '确定要删除该分组吗？',
        async onOk() {
          let res = await delMediaStorageGroup(data.id);
          if (res.code == 1200) {
            that.success('删除成功');
          } else {
            that.$message.error(res.message)
          }
        },
        onCancel() {},
      });
    },
    // 接口请求成功 统一处理
    success(text) {
      this.$message.success(text);
      this.getGroupList();
      this.getMediaList(1);
      this.checkedList = [];
    },
    onPageChange(current) {
      this.checkedList = [];
      this.getMediaList(current);
    },
    handlePreview (file) {
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    handleCancel () {
      this.previewVisible = false
    },
    changeAll() {
      this.checkedAll = !this.checkedAll;
      this.checkedList =[]
      if (this.checkedAll) {
        this.photoList.forEach(item => {
          this.checkedList.push(item.id);
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.photo-library-wrapper {
  padding: 0 20px;
  .operation {
    display: flex;
    align-items: center;
    justify-content: space-between;
    // width: 1178px;
    margin: 0 auto;
  }
  .top {
    height: 100px;
  }
  .headerBtn{
    display: flex;
  }
  .content {
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
    // width: 1190px;
    margin: 0 auto;
    .item {
      margin: 0 15px 30px 0;
      // flex: 16.6%;
    }
    .noList{
      width: 100%;
      height: 200px;
      line-height: 200px;
      text-align: center;
    }
  }
  .ant-checkbox-group{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    // justify-content: space-between;
  }
}
.ant-popover {
  .ant-input{
    width: 250px;
  }
  .btns{
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
    .ant-btn{
      margin-left: 10px;
    }
  }
}
.ant-row{
  margin-bottom: 10px;
  .textItem{
    text-align: right;
    line-height: 32px;
    display: block;
  }
}
</style>
