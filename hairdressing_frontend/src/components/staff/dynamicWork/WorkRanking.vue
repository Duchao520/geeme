<template>
  <div class="table-root">
    <el-table :data="tableData" style="width: 100%;" height='100%'>
      <el-table-column label="排名" width="width" type="index" align="center">
        <template slot-scope="scope">
          <span v-if="scope.$index>2">{{scope.$index+1}}</span>
          <img
            style="display:inline-block;width:16px"
            v-else
            :src="require(`@/assets/images/NO/icon_staff_0${scope.$index+1}.png`)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="prop" width="300px" label="作品动态内容描述">
        <template slot-scope="scope">
          <div class="detail">
            <img :src="scope.row.photos[0]?utils.formatPicImg(scope.row.photos[0],'style',40):''">
            <div class="text">
              <div class="text-top">
                <el-popover
                placement="top-start"
                trigger="hover"
                
                >
                <p v-text="scope.row.description" style="padding:20px">
                </p>
                <p slot="reference"  v-if="scope.row.description">{{scope.row.description}}</p>
              </el-popover>
              </div>
              <p class="text-bottom">
                <span v-for="item in scope.row.serviceName" :key="item">{{item}}</span>
              </p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="left" label="关联商品" width="145px">
        <template slot-scope="scope">
          <div
            style="color:#666666;font-size:12px;line-height:20px"
            v-for="(item,index) in scope.row.namePriceList"
            :key="index"
          >{{item.name}}￥{{item.price}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="发布人"></el-table-column>
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
      <el-table-column prop="comments" show-overflow-tooltip label="评论">
        <template slot="header" prop="comments" slot-scope="scope">
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
      <el-table-column prop="shares" label="分享">
        <template slot="header"  slot-scope="scope">
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
      <el-table-column prop="createTime" label="发布时间"></el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <div class="button-box">
            <button class="button-text"  style="background:#F52D56"  v-if="scope.row.hotS">热门</button>
            <span v-else>-</span>
            <!-- <button class="button-text" style="background:#4A90E2" v-if="scope.row.coverS">封面</button> -->
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import * as utils from "@/assets/js/utils";
import * as axios from '@/util/axios'
export default {
  props:{
    data:Array,
    params: Object
  },
  data() {
    return {
      utils: utils,
      fieldSort: 'thumbUp',
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
      axios.post('/getDynamicWorksRankList',params).then(res =>{
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
.d-text{
  width: 100%;
  max-height: 150px;
}
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
  }
</style>
