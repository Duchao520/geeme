<template>
  <div class="pages-main-box scrollbar">
    <div class="pages-edit-container">
      <div class="record-history-box" v-loading="pageLoading">
        <div class="no-info" v-if="noData">
          <img :src="require('@/assets/img/bg_default_goods.png')" />
          <p>该客户暂无备注</p>
          <el-button class="normal_red_btn" @click="dialogVisible = true">添加备注</el-button>
        </div>
        <div class="has-record" v-else>
          <div class="content-for-remark">
            <el-button class="normal_red_btn" @click="dialogVisible = true">添加备注</el-button>
            <div class="remark-info" v-for="item in list" :key="item.id">
              <div class="head-portrait-box">
                <img :src="utils.formatPicImg(item.userInfo.headPortrait,'circle', 70, 'someone')">
              </div>
              <div class="right-info-box">
                <h3>{{item.userInfo.nickName || item.userInfo.name || '佚名'}}</h3>
                <div style="color: #999;">{{item.createTime}}</div>
                <div class="remark-text">
                  {{item.content}}
                </div>
                <div class="item-images-list" v-if="item.images">
                  <img  
                    v-for="(i, idx) in item.imageList" 
                    :key="idx" 
                    :preview="item.id" 
                    :preview-text="''" 
                    :src="utils.formatPicImg(i,'style', 146)" 
                    style="object-fit: cover; object-position: center center;"
                  >
                </div>
              </div>
              <i @click="handleDeleteRemark(item.id)" class="icon iconfont icon-icon_operate_delete"></i>
            </div>
          </div>
          <div class="bottom-line">
            <el-pagination
              style="margin: 5px 20px 5px 0;"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-size="pageSize"
              :pager-count="5"
              layout="total, prev, pager, next"
              :total="total"
            ></el-pagination>
          </div>
        </div>  
      </div>
    </div>
    <!-- 添加备注 对话框 -->
    <el-dialog 
      title="添加备注"
      :visible.sync="dialogVisible"
      width="800px"
      :before-close="handleColseDialog"
    >
      <input-width-count style="margin-bottom: 20px;" v-model.trim="dialogContent" :length="300" placeholder="请输入备注, 必填!"/>
      <el-upload
        :action="uploadUrl"
        :headers="{Authorization: token}"
        list-type="picture-card"
        multiple
        :on-exceed="onExceed"
        :on-success="onSuccess"
        :before-upload="beforeUploadWithSize"
        :on-remove="handleRemove"
        :file-list="fileList"
        :limit="limit"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <p style="color:#999999;font-size:12px;height:25px">支持png，jpg格式，建议像素800*800px以上，大小不超过2M，最多{{limit}}张，点击图片可重新上传</p>
      <div slot="footer">
        <el-button plain class="plain_gray_btn" @click="handleColseDialog">取 消</el-button> 
        <el-button class="normal_blue_btn" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import * as axios from "@/util/axios";
import * as utils from "@/assets/js/utils";
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      utils: utils,
      currentPage: 0,
      pageSize: 10,
      pageLoading: false,
      total: 0,
      noData: false, // 缺省页
      list: [],

      limit: 5, // 图片数量
      dialogVisible: false,
      uploadUrl: `${process.env.SERVICE_URL}/service-api/uploadPicture/`,
      fileList: [], // 组件上传成功的图片
      dialogContent: '',
      token: '',
    };
  },
  created() {
    this.init();
    this.token = utils.getCookieToken("geeme_pc_token")[2];
  },
  methods: {
    init() {
      // 区分请求地址
      let url =
        this.currentEntry === "shop"
          ? "/getListByStoreCustomerId"
          : "/getListByBrandCustomerId";
      // 区分品牌门店客户id
      let CustomerId = this.currentEntry === "shop" ? 'storeCustomerId' : 'brandCustomerId'
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      params[CustomerId] = this.$route.params.id * 1,
      console.log(this.$route.params.id * 1)
      this.pageLoading = true
      axios.post(url, params).then(res => {
        this.list = res.customerRemarkResponseList || []
        this.noData = !this.list.length
        this.total = res.total
        this.$previewRefresh() // 避免图片预览不执行
        this.pageLoading = false
      }).catch(err => {
        this.total = 0
        this.list = []
        this.noData = true
        this.pageLoading = false
      })
    },
    // 页码切换
    handleCurrentChange(page) {
      this.currentPage = page;
      this.init();
    },
    // 删除备注
    handleDeleteRemark(id) {
      axios.get(`/logicDeleteStoreCustomerRemark/${id}`).then(res => {
        this.$message({
          type: res.success ? 'success' : 'error',
          message: res.success ? '删除成功' : '删除失败'
        })
      }).catch(err => {
      }).then(this.init)
    },
    // 文件数量超限制
    onExceed(files, fileList) {
      this.$message.error(`最多上传${this.limit}张`)
    },
    onSuccess(res, file, fileList) {
      this.fileList = fileList;
    },
    // 上传图片前校验图片大小
    beforeUploadWithSize(file) {
      return this.beforeUpload(file, 2);
    },
    beforeUpload(file, size) {
      const isJPG = utils.checkImgTypes(file.type);
      const isLt2M = file.size / 1024 / 1024 <= size;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG/PNG/GIF 格式!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error(`上传图片大小不能超过${size}M!`);
      }
      return isJPG && isLt2M;
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    handleColseDialog() {
      this.fileList = []
      this.dialogContent = ''
      this.dialogVisible = false
    },
    handleSubmit() {
      if (this.dialogContent) {
        let imageList = []
        this.fileList.map(i => {
          imageList.push(i.response.fileKey)
        })
        axios.post('/saveStoreCustomerRemark', {
          content: this.dialogContent,
          imageList: imageList,
          customerId: this.$route.params.id * 1,
        }).then(res => {
          this.handleColseDialog()
          this.init()
          this.$message({
            type: res.success ? 'success' : 'error',
            message: res.success ? '添加成功' : '添加失败'
          })
        }).catch(err => {
        })
      } else {
        this.$message.error('备注信息必填!')
      }
    },
  },
  computed: {
    ...mapState({
      currentEntry: state => state.authRouter.currentEntry
    })
  },
  components: {},
  filters: {}
};
</script>
<style lang="scss" scoped>
@import "@/assets/css/scrollbar.scss";
.pages-main-box {
  width: calc(100vw - 40px);
  height: calc(100vh - 105px);
  padding: 0 20px 20px;
  margin-top: 85px;
  overflow-y: auto;
  box-sizing: content-box;
  .pages-edit-container {
    min-height: calc(100vh - 105px);
  }
}
$red: #ef7066;
$green: #39b6ae;
$blue: #56c9f5;
$purple: #8074c5;
.record-history-box {
  position: relative;
  padding: 20px 70px 20px 80px;
  // font-size: 14px;
  max-width: 1440px;
  // min-height: 100%;
  min-height: calc(100vh - 105px);
  box-sizing: border-box;
  // padding: 40px 70px;
  margin: 0 auto;
  background: #fff;
  border-radius: 6px;
  .content-for-remark {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  .remark-info {
    width: 1230px;
    padding: 20px;
    display: flex;
    flex-wrap: nowrap; 
    border: 1px solid rgb(227, 230, 237);
    margin-top: 20px;
    border-radius: 4px;
    position: relative;
    .icon-icon_operate_delete {
      position: absolute;
      top: 20px;
      right: 20px;
      cursor: pointer;
    }
    .head-portrait-box {
      width: 50px;
      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        object-fit: cover;
        object-position: center center;
      }
    }
    .right-info-box {
      flex: 1;
      margin-left: 12px;
      & > div {
        margin-top: 10px;
      }
      .remark-text {
        width: 880px;
      }
      .item-images-list {
        img {
          width: auto;
          height: auto;
          max-height: 140px;
          border-radius: 4px;
          object-fit: cover;
          // object-position: center center;
          cursor: pointer;
        }
        img + img {
          margin-left: 20px;
        }
      }
    }
  }
}
.bottom-line {
  height: 40px;
  display: flex;
  justify-content: flex-end;
}
.no-info {
  text-align: center;
  position: relative;
  img {
    width: 276px;
    margin-top: 200px;
  }
  p {
    color: rgba(153, 153, 153, 1);
    font-size: 16px;
    text-align: center;
    margin-top: 40px;
  }
  .normal_red_btn {
    position: absolute;
    top: 20px;
    right: 20px;
  }
}
.right-top-btn {
  float: right;
}
</style>
