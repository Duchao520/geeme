<template>
  <div class="all-wrap">
    <div class="all-wrap_table">
      <el-checkbox-group v-model="checkArr" @change="handleChecked">
        <el-table class="el-table-re" :data="tableData" stripe>
          <el-table-column align="left" width="720" label="标题">
            <template slot-scope="scope">
              <div class="title-box">
                <el-checkbox
                  :key="scope.row.id"
                  :label="scope.row.id"
                  class="check_single"
                ></el-checkbox>
                <span v-if="!scope.row.isRead" class="red-span"></span>
                <span v-else></span>
                {{scope.row.title}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="time" align="left" label="发送时间"></el-table-column>
          <el-table-column prop="type" align="left" label="消息类型"></el-table-column>
        </el-table>
      </el-checkbox-group>
      <el-row type="flex" justify="space-between" align="middle" class="all-wrap_footer">
        <el-checkbox class="all_check" v-model="checkAllFlag" @change="checkAll">全选</el-checkbox>
        <el-pagination
              class="pagination"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pages.currentPage"
              :page-size="pages.pageSize"
              :page-count="10"
              layout="total, prev, pager, next, jumper"
              :total="pages.totalCount"
            ></el-pagination>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  name: 'all',
  data() {
    return {
      // 全选
      checkAllFlag: false,
      checkArr: [],
      isCheckedAll: false,
      CheckedAllArr: [],
      tableData: [
        {
          title: '2019年3月15日系统升级通知',
          time: '2019-03-10 15:03:25',
          type: '产品消息-功能升级',
          isRead: false,
          id:1
        },
        {
          title: '您有一笔异常预约单需要紧急处理',
          time: '2019-03-10 15:03:25',
          type: '服务通知-异常预约',
          isRead: false,
          id:2
        },
        {
          title: '旗舰版调价通知，优惠仅限最后三天',
          time: '2019-03-10 15:03:25',
          type: '产品消息-市场活动',
          isRead: false,
          id:3
        },
        {
          title: '杭州银泰店的员工转入申请',
          time: '2019-03-10 15:03:25',
          type: '服务通知-人员迁移',
          isRead: true,
          id:4
        },
        {
          title: '您有一笔退款申请需要紧急处理',
          time: '2019-03-10 15:03:25',
          type: '服务通知-退款处理',
          isRead: true,
          id:5
        },
        {
          title: '您有一笔异常预约单需要紧急处理',
          time: '2019-03-10 15:03:25',
          type: '服务通知-异常预约',
          isRead: true,
          id:6
        },
        {
          title: '旗舰版调价通知，优惠仅限最后三天',
          time: '2019-03-10 15:03:25',
          type: '产品消息-市场活动',
          isRead: true,
          id:7
        },
        {
          title: '杭州银泰店的员工转入申请',
          time: '2019-03-10 15:03:25',
          type: '服务通知-人员迁移',
          isRead: true,
          id:8
        },
        {
          title: '您有一笔异常预约单需要紧急处理',
          time: '2019-03-10 15:03:25',
          type: '服务通知-异常预约',
          isRead: true,
          id:9
        }
      ],
      pages: {
        currentPage: 1, // 当前页面
        totalCount: 10, // 总页面
        pageSize: 10, // 每页的条数
      },
    }
  },
  methods: {
    checkAll(event) {
      this.checkArr = this.checkAllFlag ? this.CheckedAllArr : [];
      console.log(this.checkArr)
    },
    // 全选/复选
    handleChecked() {
      this.isCheckedAll = this.checkArr.length == this.tableData.length;
      this.checkAllFlag = this.checkArr.length == this.tableData.length;
      console.log(this.isCheckedAll)
    },
    handleCurrentChange() {

    },
    handleSizeChange() {

    },
    setCheckedAllArr() {
      let arr = [];
      this.tableData.forEach((item, index) => {
        this.CheckedAllArr.push(item.id);
      });
    },
  },
  mounted() {
    this.setCheckedAllArr()
  }
}
</script>
<style lang="scss" scoped>
  .all-wrap{
    padding: 20px;
    margin-top: 10px;
    padding-bottom: 20px;
    width: 103%;
    height: 90%;
    overflow: hidden;
    overflow-y:auto;
    &_table{
      width: 1189px;
      background-color: rgba(255, 255, 255, 1);
      box-shadow: 0px 0px 8px 0px rgba(174, 184, 229, 0.3);
      border-radius: 6px;
    }
    &_footer{
      padding: 10px 0 10px 30px;
    }
  }
  .el-table-re{
    padding:0 20px 20px 20px;
  }
  .check_single{
    margin-right: 10px
  }
  .title-box{
    span{
      display: inline-block;
      width: 9px;
      height: 9px;
      border-radius: 50%;
    }
    .red-span{
      background-color: rgba(245, 45, 86, 1);
    }
  }
</style>
<style lang="">
  .title-box .el-checkbox__label{
    display: none;
  }
</style>