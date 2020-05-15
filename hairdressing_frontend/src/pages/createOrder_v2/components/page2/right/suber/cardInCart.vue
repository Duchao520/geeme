<template>
  <div>
    <table class="selected-card-detail">
      <tr>
        <td colspan="2">
          <selected-card-top-info :cardInfo="detail" :index="index" v-on="$listeners"></selected-card-top-info>
        </td>
      </tr>
      <tr>
        <!-- 暂时取消主销售人 start -->
        <!-- <td class="second-line-detail staff-open">
          <div @click="editServerOrMasterSeller(detail)">
            <span class="name">{{detail.staffName || "选择主销售人"}}</span>
            <i class="icon iconfont icon-icon_operate_edit"></i>
          </div>
        </td>-->
        <!-- 暂时取消主销售人 end -->
        <td class="second-line-detail commission">
          <div class="choose-sale-man" @click="addAssist(detail,index)">
            <div class="assist-items">
              <span v-if="!detail.cardSellerList || detail.cardSellerList.length===0">选择辅助销售</span>
              <span
                style="color:#333333"
                v-for="(man,index_) in detail.cardSellerList"
                :key="index_"
              >
                {{man.staffName}}
                {{ shopStaffsInfo[man.id||man.staffId ] ? `(${shopStaffsInfo[man.id || man.staffId]})` : ' ' }}
                {{Math.round(man.ratio*100)/100}}%{{index_===detail.cardSellerList.length-1?'':'；'}}
              </span>
            </div>
            <div>
              <i class="icon iconfont icon-icon_ope_append"></i>
            </div>
          </div>
        </td>
      </tr>
      <tr v-if="detail.operateType !== 2">
        <td class="store-preference" colspan="2">
          <div>
            <p>门店优惠</p>
            <p class="input">
              <span>-</span>
              <!-- v-model="detail.storePreference" :max="detail.chargeMoney" -->
              <number-input
                v-model="storePreference"
                :max="detail.chargeMoney"
                @input="handleStorePreferenceChanged"
              ></number-input>
            </p>
          </div>
        </td>
      </tr>
      <tr>
        <td class="remark" colspan="2">
          <div class="remark-content">
            <span>备注：</span>
            <!-- <input
              class="input"
              contenteditable="true"
              ref="input"
              maxlength="127"
              v-model="detail.remarks"
              type="text"
              placeholder="添加备注"
              @input="changeRemarks"
            /> -->
            <el-input
              type="text"
              maxlength="120"
              placeholder="添加备注"
              v-model="remarks"
              class="input remark-input"
              @change="changeRemarks"
            />
          </div>
        </td>
      </tr>
    </table>
    <!-- <choose-add-assist
      ref="addAssistants"
      :availableAssistantsOrStaff="availableAssistantsOrStaff"
      :showAddAssistants="showAddAssistants"
      :mainStaffId="detail.staffId"
      @close="showAddAssistants = false"
      @confirmSelectStaff="confirmAddAssist"
    ></choose-add-assist>
    <choose-change-staff
      ref="changeStaff"
      :goodsType="'card'"
      :changeDialogVisible="changeDialogVisible"
      :list="staffList"
      :staffId="detail.staffId"
      :assistList="detail.cardSellerList"
      @close="changeDialogVisible = false"
      @confirm="changeServer"
    ></choose-change-staff>-->

    <DutyAndPerformanceDialog
      :goods="detail"
      v-if="showDialog === 'dutyDialog'"
      :visible="showDialog === 'dutyDialog'"
      :workStation="currentIndexStaffs"
      @close="showDialog = null"
      @editStaffsForGoods="handleGetEditedWorkStations"
    />
  </div>
</template>
<script>
import * as axios from "@/util/axios";
import SelectedCardTopInfo from "./components/SelectedCardTopInfo";
import chooseAddAssist from "@/components/createOrder/chooseAddAssist";
import chooseChangeStaff from "@/components/createOrder/chooseChangeStaff";
import DutyAndPerformanceDialog from "./dutyAndPerformanceDialog.vue";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    SelectedCardTopInfo,
    chooseAddAssist,
    chooseChangeStaff,
    DutyAndPerformanceDialog
  },
  props: {
    detail: Object,
    index: Number
  },
  data() {
    return {
      availableAssistantsOrStaff: [],
      showAddAssistants: false,
      changeDialogVisible: false,
      staffList: [],
      showDialog: null, // 'dutyDialog'
      currentIndexStaffs: [], // 编辑工位员工的当前vuex值
      storePreference: null, // 门店优惠价
      remarks:  null, // 备注
    };
  },
  created() {
    this.storePreference = this.detail.storePreference;
    this.remarks = this.detail.remarks;
  },
  computed: {
    ...mapState({
      currentInfo: state => state.manage.currentInfo,
      openGoodsType: state =>
        state.bill.currentChooseTypeAndSortOneId.sortGoodsType,
      shopStaffsInfo: state => state.shopStaffsInfo.infoMap, // -员工编号
      billInfo: state => state.bill,
    })
  },
  methods: {
    ...mapActions(["setSelectedVipCardId", "setSelectedCardsValue"]),
    addAssist(detail) {
      this.showDialog = "dutyDialog";
      this.currentIndexStaffs = this.detail["cardSellerList"];
    },
    // 工位员工及业绩比例数据回调
    handleGetEditedWorkStations(data) {
      console.log(data);
      // 开卡线字段修改
      data.map(i => {
        i.percent = i.ratio;
        i.postId = i.levelId;
        i.postName = i.levelName;
        i.sellerStaffId = i.staffId;
        i.staffName = i.name;
      });
      let currentKey = "cardSellerList";
      this.setSelectedCardsValue({
        index: this.index,
        [currentKey]: data
      });
      this.showDialog = null;
    },
    confirmAddAssist(data) {
      this.detail.cardSellerList = data;
      this.showAddAssistants = false;
    },
    changeServer(data) {
      this.detail.staffName = data.name;
      this.detail.staffId = data.id;
      this.changeDialogVisible = false;
    },
    editServerOrMasterSeller(detail) {
      this.$refs.changeStaff.selectedStaffId = detail.staffId;
      axios
        .get("/getSimpleStaffListByShopId/" + this.currentInfo.shopId)
        .then(res => {
          this.changeDialogVisible = true;
          this.staffList = res.staffList;
        });
    },
    // 门店优惠价格改变事件
    handleStorePreferenceChanged(price) {
      this.setSelectedCardsValue({
        index: this.index,
        storePreference: price,
        tempFinalPrice: this.detail.operateType == 1 ? Number((this.detail.chargeMoney - price).toFixed(2)) : Number((this.detail.memberPrice - price).toFixed(2))
      });
    },
    // 备注改变事件
    changeRemarks(val) {
      this.detail.remarks = this.remarks
      this.setSelectedCardsValue({
        index: this.index,
        remarks: val
      });
    },
  },
  watch: {
    'detail.storePreference'(val) {
      this.storePreference = val
    },
    'detail.remarks': {
      handler: function(v, o) {
        this.remarks = v
      },
      immediate: true,
      deep: true,
    },
  }
};
</script>
<style lang="scss" scoped>
.selected-card-detail {
  border-collapse: collapse;
  width: 100%;

  > tr {
    > td {
      border: 1px solid #f0f1f4;
      font-size: 12px;
    }

    .choose-sale-man {
      display: flex;
      justify-content: space-between;
      height: 37px;
      align-items: center;
      font-size: 12px;
      color: #c7cad1;
      box-sizing: content-box;
      padding: 0 10px;
      cursor: pointer;

      .iconfont {
        color: #58c9f3;
      }
    }

    .store-preference {
      > div {
        box-sizing: border-box;
        padding: 0 10px;
        line-height: 40px;
        height: 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .input {
          display: flex;

          span {
            margin-right: 5px;
          }

          /deep/ .el-input__inner {
            width: 45px;
            height: 32px;
            text-align: center;
          }
        }
      }
    }

    .remark {
      height: 40px;
      line-height: 40px;

      .remark-content {
        box-sizing: border-box;
        padding: 0 10px;
        display: flex;
        align-items: center;
        white-space: nowrap;

        .input {
          border: none;
          outline: none;
          display: block;
          transition: all 0.4s;
          font-size: 12px;
          flex: auto;
        }

        .iconfont {
          color: #58c9f3;
          cursor: pointer;
        }
      }
    }

    .second-line-detail {
      cursor: pointer;

      > div {
        box-sizing: border-box;
        padding: 0 10px;
        display: flex;
        justify-content: space-between;

        .iconfont {
          color: #58c9f3;
        }
      }
    }

    .second-line-detail.staff-open {
      width: 110px;
    }

    .second-line-detail.commission {
      max-width: 72%;

      .assist-items {
        // width: 200px;
        width: 300px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
}

.remark-input /deep/ .el-input__inner {
  border: none;
  font-size: 12px;
  outline: none;
  display: block;
  -webkit-transition: all 0.4s;
  transition: all 0.4s;
  -webkit-box-flex: 1;
  -ms-flex: auto;
  flex: auto;
  margin-right: 10px;
}
</style>
