<template>
  <div class="award-grant">
    <div class="table-main">
      <div class="user-defined-tab">
        <el-tabs type="card" v-model="currentTab">
          <el-tab-pane
            v-for="item in tableTabs"
            :key="item.id"
            :name="item.id"
            :label="item.name"
          ></el-tab-pane>
        </el-tabs>
        <div class="table-box">
          <el-table stripe :data="tableData" height="calc(100vh - 330px)">
            <el-table-column label="分享人信息" width="200">
              <template slot-scope="scope">
                <div class="client_area">
                  <!-- <el-checkbox :label="scope.row.activityId" class="check_single"> -->

                  <div class="client_msg">
                    <div class="client_img">
                      <img
                        :src="
                        utils.formatPicImage(
                          scope.row.headPortrait,
                          'style',
                          70,
                          'someone',
                          scope.row.sex
                        )
                      "
                      />
                      <img
                        class="sex_icon"
                        v-if="scope.row.sex == '女'"
                        src="@/assets/img/female_tip.png"
                      />
                      <img class="sex_icon" v-else src="@/assets/img/male_tip.png" />
                    </div>
                    <div class="client_info">
                      <p>{{ scope.row.nickName }}</p>
                    </div>
                  </div>
                  <!-- </el-checkbox> -->
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="activityName" show-overflow-tooltip label="活动名称"></el-table-column>
            <el-table-column prop="cardName" show-overflow-tooltip label="卡项名称"></el-table-column>

            <el-table-column show-overflow-tooltip label="分享奖励">
              <template
                slot-scope="{ row }"
              >
              <div v-if="row.awardInfoList && row.awardInfoList.length > 1">
                <div v-for="item in row.awardInfoList" :key="item.awardAmount">
                  <p><span>{{item.countFrom}}-{{item.countTo}}：</span><span>{{item.awardAmount ? '￥' + item.awardAmount.toFixed(2) : '-'}}</span></p>
                </div>
              </div>
              <div v-else-if="row.awardInfoList && row.awardInfoList.length == 1">
                <p>
                  {{ row.awardInfoList[0] && row.awardInfoList[0].awardAmount ? '￥' + row.awardInfoList[0].awardAmount.toFixed(2) : '￥0.00' }}
                </p>
              </div>
              <div v-else>
                <p>-</p>
              </div>
              </template>
            </el-table-column>

            <el-table-column prop="buyTime" show-overflow-tooltip label="领取时间">
              <template slot-scope="{ row }">
                <p>{{ row.buyTime || '-'}}</p>
              </template>
            </el-table-column>
            <!-- 暂无字段 -->
            <!-- <el-table-column prop="cardName" show-overflow-tooltip label="分享次数"></el-table-column>
            <el-table-column prop="cardName" show-overflow-tooltip label="分享领取客户数"></el-table-column> -->
            <el-table-column show-overflow-tooltip label="已发放奖励金额">
              <template slot-scope="{ row }">
                <p>{{row.totalAward ? '￥' + row.totalAward.toFixed() : '-'}}</p>
              </template>
            </el-table-column>
          </el-table>
          <div class="page-line">
            <div>
              <!-- <el-button v-if="currentType === '1'" class="foot-btn normal_green_btn" @click="multipleUpGoods">批量上架</el-button>
              <el-button v-if="currentType === '0'" class="foot-btn normal_silvery_gray_btn" @click="multipleDownGoods">批量下架</el-button> -->
            </div>
            <el-pagination
              style="margin: 5px 20px 5px 0;"
              @current-change="handleCurrentChange"
              :current-page="pageNum"
              :page-size="pageSize"
              :pager-count="5"
              layout="total, prev, pager, next, jumper"
              :total="total"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as axios from "@/util/axios";
import { mapActions, mapState } from "vuex";
import * as utils from "@/assets/js/utils";
export default {
  props: {
    giftForm: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      utils,
      pageNum: 1,
      pageSize: 10,
      total: null,
      currentTab: '1',
      tableTabs: [
        {
          name: '奖励发放',
          id: '1'
        },
      ],
      tableData: []
    }
  },
  mounted() {
    // console.log(this.giftForm)
    this.getAwardGrantInfo();
  },
  methods: {
    handleCurrentChange(index) {
      this.pageNum = index
      this.getAwardGrantInfo()
    },
    async getAwardGrantInfo() {
      this.loading = true;
      try {
        const res = await axios.post("/getGiftCardAwardSumInfo", {
          ...this.giftForm,
          brandId: this.currentInfo.brandId,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        });
        this.tableData = res.awardInfoSumList;
        this.total = res.total;
      } finally {
        this.loading = false;
      }
    },
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      currentEntry: state => state.authRouter.currentEntry
    })
  },
}
</script>

<style lang="scss" scoped>

@import "@/assets/css/tab.scss";

.table-main {
  margin-top: 15px;
  .table-box {
    padding: 0 10px;
    background: #fff;
    box-shadow: 0px 0px 4px 0px rgba(174, 184, 229, 0.3);
  }
}

.page-line {
  height: 65px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .foot-btn {
    padding: 8px 18px;
  }
}

.client_area {
  display: flex;
  .check_single {
    margin: 0 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
  }
  .client_msg {
    display: flex;
    align-items: center;
    width: 80%;
    .client_img {
      margin-left: 5px;
      margin-right: 15px;
      position: relative;
    }
    .client_info {
      width: 95%;
      p {
        text-align: left;
        width: 120px;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      vertical-align: middle;
    }
    .sex_icon {
      position: absolute;
      width: 14px;
      height: 14px;
      left: 27px;
      top: 0;
    }
  }
}
</style>