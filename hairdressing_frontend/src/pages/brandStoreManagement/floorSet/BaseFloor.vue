<template>
  <div class="base-box scrollbar" v-loading="loading">
    <div class="base-main">
      <el-form ref="form" :model="form">
        <div class="header-in-page">
          <div class="col-in-header">
            <div class="title-sort">分区排序</div>
            <div class="title-info">楼分区名称</div>
          </div>
          <div class="col-in-header">
            <div class="title-sort">楼层排序</div>
            <div class="title-info">楼层名称</div>
          </div>
          <div class="col-in-header">楼层平面图</div>
        </div>
        <div class="floor-container">
          <div class="area-box" v-for="(area, idx) in form.areaList" :key="idx">
            <div class="area-col">
              <div class="area-main">
                <!-- 分区排序 -->
                <el-form-item 
                  :prop="`areaList.${idx}.weight`"
                  :rules="{required: false, validator: validateWeight, trigger: 'change'}"
                >
                  <el-input maxlength="4" v-model.trim="area.weight" placeholder="数大在前" style="width: 110px; text-indent: 4px;"></el-input>
                </el-form-item>
                <!-- 分区名称 -->
                <el-form-item
                  :prop="`areaList.${idx}.name`"
                  :rules="[
                    { required: form.areaList.length > 1, message: '请输入楼分区名称', trigger: 'blur' },
                    { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
                  ]"
                >
                  <el-input maxlength="16" v-model.trim="area.name" :placeholder="form.areaList.length === 1 ? '仅一个分区时可以不填' : '请输入楼分区名称'" style="width: 200px; margin-left: 12px;"></el-input>
                </el-form-item>
                <i v-if="idx" class="float-icon icon iconfont icon-icon_operate_delete" @click="deleteArea(idx)"></i>
                <i v-if="idx === form.areaList.length - 1" class="float-icon icon iconfont icon-icon_open_on" @click="addArea()"></i>
              </div>
            </div>
            <div class="floor-col">
              <div class="floor-main"
                v-for="(floor, i) in area.mallFloorInformationList" 
                :key="i"
              >
                <div class="floor-left">
                  <!-- 楼层排序 -->
                  <el-form-item
                    :prop="`areaList.${idx}.mallFloorInformationList.${i}.weight`"
                    style="margin-bottom: 0px;"
                    :rules="{required: false, validator: validateWeight, trigger: 'change'}"
                  >
                    <el-input maxlength="4" v-model.trim="floor.weight" placeholder="数大在前" style="width: 110px; text-indent: 4px;"></el-input>
                  </el-form-item>
                  <!-- 楼层名称 -->
                  <el-form-item 
                    :prop="`areaList.${idx}.mallFloorInformationList.${i}.name`"
                    style="margin-bottom: 0px;"
                    :rules="[
                      { required: true, message: '请输入楼层名称', trigger: 'blur' },
                      { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
                    ]"
                  >
                    <el-input maxlength="16" v-model.trim="floor.name" placeholder="请输入楼层名称" style="width: 200px; margin-left: 12px;"></el-input>
                  </el-form-item>
                  <i v-if="i" class="icon iconfont icon-icon_operate_delete" @click="deleteFloor(idx, i)"></i>
                  <i v-if="i === area.mallFloorInformationList.length - 1" class="icon iconfont icon-icon_open_on" @click="addFloor(idx)"></i>
                </div>
                <!-- 楼层图 -->
                <div class="floor-right">
                  <el-form-item 
                    :prop="`areaList.${idx}.mallFloorInformationList.${i}.image`"
                    style="margin-bottom: 0px;"
                  >
                    <upload-pic-callback-index 
                      :superInfo="{idx: idx, i: i, image: floor.image, tip: false}" 
                      @onSuccess="handleUploaded"
                    />
                  </el-form-item>
                  <p class="picture-tip">支持jpg，png格式，大小不超过5M；点击图片可重新上传</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-form>
    </div>
    <el-button class="normal_blue_btn" @click="saveToDB">保 存</el-button>
    <dialog-with-slot 
      :title="deleteTitle"
      v-if="deteleVisible"
      :icon="'icon_popup_plaint'"
      color="rgb(255, 109, 97)"
      :dialogVisible="deteleVisible"
      @close="deteleVisible = false"
      @resolve="deleteFloorOrArea"
    >
      <div>确定删除前,请确保您正在编辑的数据都已经<span class="red-warning">保存</span>;</div>
      <div>删除后<span class="red-warning">无法恢复</span>,如需恢复须再次创建!</div>
    </dialog-with-slot>
  </div>
</template>

<script>
import * as axios from "@/util/axios";
import { mapState } from "vuex";
import converter from "number-to-chinese-words";
export default {
  data() {
    return {
      form: {
        areaList: [
          {
            name: '',
            weight: null,
            mallFloorLevel: 'partition',
            mallFloorInformationList: [
              {
                id: null,
                image: '',
                deleted: 0, // 1 删除 0 未删除
                weight: null, // 排序
                brandId: null, // 这个提交前追加
                name: '', // 楼分区
                fatherId: null,
                mallFloorLevel: 'floor'
              }
            ]
          }
        ],
      },
      loading: false, // -
      converter: converter,
      deleteID: null, // 预删除id，
      deteleVisible: false, // 预删除警示
      deleteTitle: '', // 删除提示
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      this.loading = true
      let res = await axios.get(`/getMallBrandFloorHierarchyList/${this.currentInfo.brandId}`)
      if (res.mallPartitionList && res.mallPartitionList.length) this.form.areaList = res.mallPartitionList
      this.loading = false
    },
    addArea() {
      this.form.areaList.push({
        name: '',
        weight: null,
        mallFloorLevel: 'partition',
        mallFloorInformationList: [
          {
            id: null,
            image: '',
            deleted: 0, // 1 删除 0 未删除
            weight: null, // 排序
            brandId: null, // 这个提交前追加
            name: '', // 楼分区
            fatherId: null,
            mallFloorLevel: 'floor'
          }
        ]
      })
    },
    deleteArea(idx) {
      // console.log(1)
      let id = this.form.areaList[idx].id
      if (!id) {
        this.form.areaList.splice(idx, 1)
        // this.$refs.form.resetFields() // 重置表单数据有时候会js报错， 导致部分数据清空
      } else {
        this.deleteID = id
        this.deleteTitle = '删除楼分区'
        this.deteleVisible = true
      }
    },
    addFloor(idx) {
      this.form.areaList[idx].mallFloorInformationList.push({
        id: null,
        image: '',
        deleted: 0, // 1 删除 0 未删除
        weight: null, // 排序
        brandId: null, // 这个提交前追加
        name: '', // 楼分区
        fatherId: null,
        mallFloorLevel: 'floor'
      })
    },
    deleteFloor(idx, i) {
      // console.log(2)
      let id = this.form.areaList[idx].mallFloorInformationList[i].id
      if (!id) {
        this.form.areaList[idx].mallFloorInformationList.splice(i, 1)
        // this.$refs.form.resetFields()
      } else {
        this.deleteID = id
        this.deleteTitle = '删除楼层'
        this.deteleVisible = true
      }
    },
    // 子组件上传成功后
    handleUploaded(data) {
      this.form.areaList[data.idx].mallFloorInformationList[data.i].image = data.image
    },
    saveToDB() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let arr = JSON.parse(JSON.stringify(this.form.areaList))
          arr.map(area => {
            area.brandId = this.currentInfo.brandId
            area.mallFloorInformationList.map(floor => {
              floor.brandId = this.currentInfo.brandId
            })
          })
          this.loading = true
          axios.post('/saveBrandFloorInformation', {mallPartitionList: arr}).then(res => {
            res.success && this.$message.success('保存成功')
            this.init()
          }).catch((err) => {
          }).then(() => {
            this.loading = false
          })
        } else {
          this.$message.error('检测到非法输入, 请修正后提交!')
        }
      })
    },
    deleteFloorOrArea() {
      axios.get(`/logicDeletedBrandFloorInformation/${this.deleteID}`).then(res => {
        if (res.success) {
          this.$message.success(`${this.deleteTitle}成功`)
          this.init()
        }
      }).catch(err => {
      }).then(() => {
        this.deteleVisible = false
        this.$refs.form.resetFields()
      })
    },
    // 校验
    validateWeight(rule, value, cb) {
      if (Number.isNaN(Number(value))) {
        cb('请输入数字')
      } else {
        cb()
      }
    },
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    }),
  },
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/scrollbar.scss";
.base-box {
  margin: 20px;
  background: #fff;
  border-radius: 8px;
  // min-height: calc(100vh - 95px);
  min-width: 1178px;
  box-shadow: 0px -1px 4px 0px rgba(174, 184, 229, 0.3);
  padding: 20px;
}

.base-main {
  margin: 20px;
  margin-top: 0;
  .header-in-page {
    height: 55px;
    line-height: 55px;
    font-size: 16px;
    display: flex;
    .col-in-header {
      width: 33.3%;
      display: flex;
      .title-sort { width: 124px;}
    }
  }
  .floor-container {
    overflow-y: auto;
    height: calc(100vh - 250px);
    &::-webkit-scrollbar {
      width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: rgba(0, 0, 0, 0.2);
    }
    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 0;
      background: rgba(0, 0, 0, 0.1);
    }
  }
}

.area-box {
  // padding: 24px 12px;
  border: 1px solid #EBEEF5;
  // border-radius: 8px;
  position: relative;
  // margin-bottom: 12px;
  display: flex;
  flex-wrap: wrap;
  .area-col {
    width: 33.3%;
    display: flex;
    // justify-content: center;
  }
  .floor-col {
    width: 66.6%;
  }
}
.area-box  + .area-box  {
  border-top-color: transparent;
}
.area-main {
  margin-top: 12px;
  display: flex;
  height: 52px;
  align-items: center;
}
.floor-main {
  display: flex;
  align-items: center;
  border: 1px solid transparent;
  // border-left-color: #EBEEF5;
  .floor-left {
    width: 50%;
    height: 100%;
    display: flex;
    align-items: center;
  }
  .floor-right {
    width: 50%;
    height: 72px;
    border: 1px solid transparent;
    // border-left-color: #EBEEF5;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-left: 22px;
    /deep/ .avatar-uploader-icon {
      width: 64px;
      height: 64px;
      line-height: 64px !important;
    }
    /deep/ .avatar {
      width: 64px;
      height: 64px;
    }
    /deep/ .el-form-item__content {
      line-height: 0;
    }
  }
}
.floor-main + .floor-main {
  border-top-color: #EBEEF5;
}
.iconfont {
  font-size: 14px;
  cursor: pointer;
  color: #41CAC0;
  margin-left: 8px;
}
.normal_blue_btn {
  margin-left: 20px;
}
.picture-tip {
  font-size: 12px;
  color: #999;
  text-indent: 8px;
}

.red-warning {
  color: red;
}
</style>