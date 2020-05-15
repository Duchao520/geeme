<template>
  <div class="gm_record_dynamic" v-loading="pageLoading">
    <div class="works-con">
      <div class="dynamic_step">
            <el-row type="flex" justify="space-between" v-for="(item, index) in staffWorksList"  :key="index" class="dynamic_wrap">
              <div class="time_line">
                <p>
                  <span></span>
                </p>
              </div>
              <div  class="description">
              <div class="dynamic_item">
                 <div class="text">
                  <div class="con">
                    <div class="delete-line">
                      <p>{{item.description}}</p>
                      <el-row type="flex" middle="end" class="delete-line_right">
                        <span style="color:#666666;">{{item.createTime | fomartTime}}</span>
                        <i class="icon iconfont icon-icon_operate_delete" v-show="checkHasBtnPermission(`${currentEntry}_staff_staffRecord_dynamic_delete`)" @click="deleteStaffDynamic(item.workId)"></i>
                      </el-row>
                    </div>
                    <el-row type="flex" class="dynamic_img_list">
                      <el-row type="flex" justify="center" align="middle" v-for="(img,index) in item.photos" :key="index" class="img-wrap">
                        <img  :preview="index" :preview-text="item.projects" class="img" :src="utils.formatPicImg(img)">
                      </el-row>
                    </el-row>
                  </div>
                </div>
                <div class="time-line">
                  <div class="text">
                    <p class="title" v-if="item.projects">项目：</p>
                    <div class="con">{{item.projects}}</div>
                  </div>
                </div>
                <div class="text">
                  <p class="title" v-if="item.costs">消费：</p>
                  <div class="con">
                    <span style="color:#FF6D61" v-if="item.costs">￥{{item.costs}}</span>
                  </div>
                </div>
              </div>
              </div>
            </el-row>
      </div>
    </div>
    <div class="page-nation" v-if="staffWorksList.length>0">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="pageParam.pageNum"
        :page-sizes="[10]"
        :page-size="pageParam.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="pageParam.total"
      ></el-pagination>
    </div>
    <div class="empty" style="color:#999999" v-else>
      <g-nolist :img='noservicelist' :tip="'该员工暂无作品动态哦～'" :showBtn='false'></g-nolist>
    </div>
    <g-del-model
        :delTagDialogVisible="delTagDialogVisible"
        @close="delTagDialogVisible=false"
        @confirm="confirmDelTag"
        :title="'确定要删除吗？'"
        :content="'该作品动态将在客户端、服务者端同步删除，请谨慎操作！'"
        :icon="'icon_popup_question'"
        :iconColor="'#FF6D61'"
      ></g-del-model>
  </div>
</template>

<script>
import * as api from "@/assets/js/interface";
import * as utils from "@/assets/js/utils";
import * as axios from '@/util/axios'
import { mapState, mapActions } from "vuex";
import * as datas from "@/assets/js/datas";
export default {
  name: "GmRecordDynamic",
  data() {
    return {
      utils:utils,
      activeStep: 0,
      delTagDialogVisible: false,
      staffWorksList: [],
      noservicelist: datas.defaultImg.noservicelist,
      pageParam: {
        pageNum: 0,
        pageSize: 10,
        total: 200
      },
      delId: null,
      pageLoading: false,
      staffId: this.$route.params.staffId,
    };
  },
  computed: {
    currentInfo() {
      return this.$store.state.manage.currentInfo;
    },
    ...mapState({
      currentEntry: state => state.authRouter.currentEntry
    }),
  },
  mounted() {
    this.getStaffDynamicWorksList();
  },
  filters: {
    fomartTime(time) {
      // return utils.formatTime(time)
      return time
    }
  },
  methods: {
    getStaffDynamicWorksList() {
      this.pageLoading = true
      axios.put(
        api.getStaffDynamicWorksList.URL,
        {
          pageNum: this.pageParam.pageNum,
          pageSize: this.pageParam.pageSize,
          staffId: this.staffId,
          storeId: this.currentInfo.shopId
        }
      ).then(res => {
        this.pageParam.total = res.total;
        this.staffWorksList = [...res.staffWorksList]
        this.pageLoading = false
      })
      setTimeout(() => {
        this.pageLoading = false
      },200)
    },
    handleCurrentChange() {
      this.getStaffDynamicWorksList();
    },
    deleteStaffDynamic(id){
      this.delId = id
      this.delTagDialogVisible = true
    },
    confirmDelTag() {
      this.delTagDialogVisible = false
      axios.put(
        api.staffDynamicWorksStatusChangeByIds.URL,
        {
          idList:[this.delId],isDeleted:true
        }
      ).then(res=>{
        this.getStaffDynamicWorksList();
      })
    }
  }
};
</script>

<style lang="scss" scoped>
@mixin flex-bet {
  display: flex;
  justify-content: space-between;
}
@mixin time_line($pC,$spanC) {
   p{
      width: 15px;
      height: 15px;
      border:2px solid $pC;
      border-radius: 50%;
      position: absolute;
      top: 20px;
      left: -9px;
    }
    span {
      border-radius: 50%;
      display:inline-block;
      width: 7px;
      height: 7px;
      background: $spanC;
      margin: 0 0 3px 4px;
    }
}
.dynamic_wrap{
  position: relative;
  .time_line{
    width: 1px;
    height: auto;
    border-left: 2px solid rgba(232, 232, 232, 1);
    margin-right: 20px;
  }
  .time_line:first-child{
    @include time_line(#56C9F5,#56C9F5);
  }
  .time_line:nth-child(even){
    @include time_line(#EF7066,#EF7066);
  }
  .time_line:nth-child(odd){
    @include time_line(#39B6AE,#39B6AE);
  }
}
.gm_record_dynamic {
  // box-sizing: border-box;
  padding: 62px 75px;
  .works-con {
    display: flex;
    .dynamic_step {
      width: 100%;
      border: 1px solid 100%;
      
      .line-icon{
        width: 10px;
        height: 10px;
        background: rgba(239, 112, 102, 1);
        border-radius: 50%;
      }
      /deep/ .el-step__description{
        padding-right: 0;
      }
    }
    .description {
        width: 100%;
        box-sizing: border-box;
        padding-bottom: 55px;
      }
      .dynamic_item {
          width: 100%;
          border: 1px solid #e3e6ed;
          border-radius: 4px;
          box-sizing: border-box;
          padding: 15px 20px;
          font-size: 14px;
          line-height: 24px;
          .text {
            display: flex;
            width: 100%;
            .title {
              color: #999999;
              flex: 0 0 50px;
            }
            .con {
              flex: auto;
              color: #333333;
              .delete-line {
                @include flex-bet;
                p{
                  width: 80%;
                }
                &_right{
                  flex-flow: column;
                  align-items: flex-end;
                }
                &_right i {
                  color: rgb(190, 195, 198);
                  cursor: pointer;
                  font-size: 18px;
                  &:hover{
                    color: red;
                  }
                }
              }
              .dynamic_img_list{
                margin: 10px 0;
                width: 100%;
                flex-flow: row wrap;
                .img-wrap{
                  width: 140px;
                  height: 140px;
                  overflow: hidden;
                  margin-bottom: 10px;
                  border-radius: 6px;
                  margin-right:10px;
                }
                .img{
                  height: auto;
                  width: 100%;
                  cursor: pointer;
                }
              }
            }
          }
          .time-line {
            @include flex-bet;
          }
        }
  }
}

.page-nation {
  /deep/ .btn-prev,
  /deep/ .btn-next {
    width: 35px;
  }
}
</style>


