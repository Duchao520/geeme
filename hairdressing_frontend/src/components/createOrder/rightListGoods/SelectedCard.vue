<template>
  <div>
    <table class="selected-card-detail">
      <tr>
        <td colspan="2">
          <selected-card-top-info
            :cardInfo="detail"
            :index="index"
            v-on="$listeners"
          ></selected-card-top-info>
        </td>
      </tr>
      <tr>
        <!-- 暂时取消主销售人 start -->
        <!-- <td class="second-line-detail staff-open">
          <div @click="editServerOrMasterSeller(detail)">
            <span class="name">{{detail.staffName || "选择主销售人"}}</span>
            <i class="icon iconfont icon-icon_operate_edit"></i>
          </div>
        </td> -->
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
              <number-input v-model="detail.storePreference" :max="detail.chargeMoney"></number-input>
            </p>
          </div>
        </td>
      </tr>
      <tr>
        <td class="remark" colspan="2">
          <div class="remark-content">
            <span>备注：</span>
            <input
              class="input"
              contenteditable="true"
              ref="input"
              maxlength="127"
              v-model="detail.remarks"
              type="text"
              placeholder="添加备注"
            >
          </div>
        </td>
      </tr>
    </table>
    <choose-add-assist
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
    ></choose-change-staff>
  </div>
</template>
<script>
  import * as axios from "@/util/axios";
  import SelectedCardTopInfo from "@/components/createOrder/SelectedCardTopInfo";
  import chooseAddAssist from "@/components/createOrder/chooseAddAssist";
  import chooseChangeStaff from "@/components/createOrder/chooseChangeStaff";
  import {mapState, mapActions} from "vuex";

  export default {
    components: {
      SelectedCardTopInfo,
      chooseAddAssist,
      chooseChangeStaff
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
        staffList: []
      }
    },
    computed: {
      ...mapState({
        currentInfo: state => state.manage.currentInfo,
        openGoodsType: state => state.bill.currentChooseTypeAndSortOneId.sortGoodsType,
        shopStaffsInfo: state => state.shopStaffsInfo.infoMap, // -员工编号
      }),
    },
    methods: {
      ...mapActions(['setSelectedVipCardId']),
      addAssist(detail) {
        let currentSelectedStaff =
          detail.assistantOrSalers || detail.cardSellerList || [];
        let ids = currentSelectedStaff.map(item => item.id);
        this.$refs.addAssistants.checkedStaffIds = ids;
        this.chooseSaleMan();
      },
      chooseSaleMan() {
        axios.get("/getSimpleStaffListByShopId/" + this.currentInfo.shopId, {}).then(res => {
          this.$refs.addAssistants.currentStaffType = "saleMan";
          this.$refs.addAssistants.getPerformanceAllocation("sales");
          this.availableAssistantsOrStaff = res.staffList;
          this.showAddAssistants = true;
        });
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
    },
    watch: {
      'detail': {
        // 增减卡项、修改卡续费金额、修改门店优惠等都可能导致所选的会员卡不能使用。 需要清空 . (偷懒写法， 修改备注等也会)
        handler: function(v, o) {
          this.setSelectedVipCardId({})
        },
        immediate: true,
        deep: true
      },
    },
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
</style>
