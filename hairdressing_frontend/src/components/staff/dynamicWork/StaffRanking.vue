<template>
  <div class="table-root">
    <el-table :data="tableData" style="width: 100%" height='100%' >
      <el-table-column label="排名" type="index" align="left">
        <template slot-scope="scope">
          <span v-if="scope.$index>2">{{scope.$index+1}}</span>
          <img
            style="display:inline-block;width:16px"
            v-else
            :src="require(`@/assets/images/NO/icon_staff_0${scope.$index+1}.png`)"
          >
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="员工">
        <template slot-scope="scope">
          <div class="detail">
            <img class='headerImg' :src="utils.formatPicImg(scope.row.headPortrait,'style',40)">
            <img class="sex_icon" v-if="scope.row.isMale == '女'" src="@/assets/img/female_tip.png">
            <img class="sex_icon" v-else-if="scope.row.isMale == '男'" src="@/assets/img/male_tip.png">
            <div class="staffInfo">
              <p>{{scope.row.name?scope.row.name: '未知'}}</p>
              <p class='mobile'>{{scope.row.mobile}}</p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="dynamicNum">
        <template slot="header" slot-scope="scope">
          <span
            @click="changeSort('dynamicNum')"
            class="table-header"
            :class="[fieldSort==='dynamicNum'?'active':'']"
          >
            作品数
            <span class="i">
              <i class="icon iconfont icon-icon_xiala"></i>
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="thumbUp">
        <template slot="header" slot-scope="scope">
          <span
            @click="changeSort('thumbUp')"
            class="table-header"
            :class="[fieldSort==='thumbUp'?'active':'']"
          >
            点赞
            <span class="i">
              <i class="icon iconfont icon-icon_xiala"></i>
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="collections">
        <template slot="header" slot-scope="scope">
          <span
            @click="changeSort('collections')"
            class="table-header"
            :class="[fieldSort==='collections'?'active':'']"
          >
            收藏
            <span class="i">
              <i class="icon iconfont icon-icon_xiala"></i>
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="comments">
        <template slot="header" slot-scope="scope">
          <span
            @click="changeSort('comments')"
            class="table-header"
            :class="[fieldSort==='comments'?'active':'']"
          >
            评论
            <span class="i">
              <i class="icon iconfont icon-icon_xiala"></i>
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="shares">
        <template slot="header" slot-scope="scope">
          <span
            @click="changeSort('shares')"
            class="table-header"
            :class="[fieldSort==='shares'?'active':'']"
          >
            分享
            <span class="i">
              <i class="icon iconfont icon-icon_xiala"></i>
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="firstPublishTime" label="首次发布时间"></el-table-column> 
      <el-table-column prop="nearestPublishTime" label="最后发布时间"></el-table-column>
    </el-table>
  </div>
</template>
<script>
import * as utils from "@/assets/js/utils";
import * as axios from '@/util/axios'
export default {
  props: {
    params: Object
  },
  data() {
    return {
      utils: utils,
      fieldSort: 'dynamicNum',
      tableData: []
    };
  },
  computed: {
  },
  methods: {
    changeSort(data) {
      this.fieldSort = data; /* 切换点亮位置 */
      this.query();
    },
    query() {
      let send = this.params
      let params = {
        brandId:send.brandId,
        storeId: send.storeId,
        fieldSort: this.fieldSort,
        pageNum: send.pageNum,
        pageSize: send.pageSize,
        startDate: send.startDate,
        endDate: send.endDate
      }
      axios.post(`${SERVICE_URL}/service-api/getDynamicStaffRankList`,params).then(res =>{
        this.tableData = [...res.responseList]
        this.$emit("settotal", res.total);
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.query()
    })
  }
};
</script>
<style lang="scss" scoped>
.table-root{
    height: calc(100vh - 360px);
    border-radius: 8px;
    .table-header {
      cursor: pointer;
      .i {
        i {
          display: inline-block;
          font-size: 5px;
        }
      }
    }
    .active {
      color: green;
    }
    .detail{
      position: relative;
      .headerImg{
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
      .sex_icon {
        position: absolute;
        width: 14px;
        height: 14px;
        left: 22px;
        top: 0;
      }
      .staffInfo{
        padding-left: 10px;
        color: #333;
        font-size: 14px;
        .mobile{
          color: #666;
          font-size: 12px;
        }
      }
    }
  }
</style>
