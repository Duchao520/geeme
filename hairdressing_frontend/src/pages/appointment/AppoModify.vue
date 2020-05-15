  <template>
  <transition name="fade">
    <section class="order-detail text-for-copy">
      <div class="order-detail-container" v-if="!!appoDetailsData">
        <div class="order-detail-header">
          <div class="title">预约详情</div>
          <div class="close" @click="close">
            <i class="icon iconfont icon-icon_close"></i>
          </div>
        </div>
        <div class="order-modify-body scrollbar">
          <div class="form_area">
            <div class="fast-order">
              <g-gradbtn
                class="text-cant-copy"
                v-show="!appoDetailsData.appointment.abnormal && checkHasBtnPermission('shop_cashier_quickAddBill')"
                :title="'快速开单'"
                :mark="'/shop-inner/choose-person'"
                :icon="'icon_add'"
                @click="toOpenOrder"
              />
            </div>
            <div class="abnormal-info" v-show="appoDetailsData.appointment.abnormal">
              <span style="color:#666;">异常原因</span>
              <span
                style="color: #f52d56; margin-left: 22px;"
              >{{appoDetailsData.appointment.abnormalReason}}</span>
            </div>
            <div class="sub-title" v-show="appoDetailsData.appointment.abnormal">预约信息</div>
            <el-form
              :class="{'main-form': appoDetailsData.appointment.abnormal}"
              :model="myForm"
              label-width="1.05rem"
            >
              <el-form-item class="no-form-bottom" label="服务状态">
                <status-text :type="bgColor[referenceInfo.status]" :name="referenceInfo.status" />
              </el-form-item>
              <el-form-item class="no-form-bottom" label="预约门店">
                <span class="value">{{ referenceInfo.city }}&nbsp;&nbsp;{{ referenceInfo.shopName }}</span>
              </el-form-item>
              <el-form-item label="预约客户">
                <div class="click-group">
                  <user-box :list="[appoDetailsData.customer]" />
                </div>
                <div class="click-group">
                  <g-clickbtn :title="'查看客户档案'" :icon="'icon_operate_eyes'" @click="gotocustomer" />
                </div>
              </el-form-item>
              <appo-details-dialog
                :customerId="list.customer.id"
                @appoSubmitFromDetails="handleOnSubmitFromDetails"
                ref="formDetails"
                :info="referenceInfo"
                :editable="list.editable"
                @giveStaffInfo="giveStaffInfo"
              />
            </el-form>
            <div class="notes">
              <h6 style="font-size:14px;line-height:38px;color:#333333">备注信息</h6>
              <div class="notes-box">
                <div class="notes-con">
                  <div class="notes-con-item" v-for="(item, index) in notes" :key="index">
                    <div class="left">
                      <p class="name">
                        {{item.name}}
                        <span v-show="item.position">({{item.position}})</span>
                      </p>
                      <p class="time">{{item.time}}</p>
                    </div>
                    <div class="right">{{item.note}}</div>
                  </div>
                </div>
                <div class="add-note">
                  <div class="left">添加备注</div>
                  <div class="right">
                    <input-with-count :autosize="{minRows: 4, maxRows: 100}" v-model="myForm.notes"></input-with-count>
                  </div>
                </div>
              </div>
            </div>
            <div class="footer text-cant-copy">
              <div class="btn-group">
                <div class="group-item">
                  <g-btn
                    :name="'取消预约'"
                    :size="'large'"
                    :type="'black'"
                    :mark="'/shop-inner/appo/appo-time'"
                    @click.native="toOpera('cancel')"
                  />
                </div>
                <div class="group-item">
                  <g-btn
                    :name="'保存修改'"
                    :size="'large'"
                    :type="'blue1'"
                    :mark="'/shop-inner/appo/appo-time'"
                    @click="toOpera('submit')"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </transition>
</template>
 <script>
import "@/assets/css/scrollbar.scss";
import * as api from "@/assets/js/interface";
import * as utils from "@/assets/js/utils";
import * as datas from "@/assets/js/datas";
import UserBox from "@/components/appoModule/userBox";
import InputWithCount from "@/components/common/InputWithCount";
import AppoDetailsDialog from "./appoDetailsDialog"; // 新的日期到规格数量的组件
import { mapActions, mapState } from "vuex";
import { setTimeout } from "timers";
export default {
  props: {
    list: {
      type: Object
    }
  },
  components: {
    "user-box": UserBox,
    "input-with-count": InputWithCount, // 备注字数
    "appo-details-dialog": AppoDetailsDialog
  },
  data() {
    return {
      appoDetailsData: null, // 用户预约详情列表
      bgColor: datas.SERVER_STATUS,
      referenceInfo: "",
      // propServiceInfo: '',
      notes: [],
      myForm: {
        customerId: null, // 客户id
        id: null // 预约id
      }
    };
  },
  computed: {
    // 获取当前操作的预约单数据
    billInfo() {
      return this.$store.state.bill;
    }
  },
  watch: {},
  created() {
    this.initFromProps();
  },
  methods: {
    ...mapActions([
      "saveCurrentInfo",
      "saveOperate",
      "beautyRecordId",
      "setIsCount",
      "clearBillInfo"
    ]),
    gotocustomer() {
      // this.beautyRecordId(this.myForm.customerId)
      // this.$router.push(`/shop-inner/customerRecord`)

      // 新标签页打开
      this.toPagesInNewTags(
        `/shop-inner/customerRecord/${this.myForm.customerId}`
      );
    },
    initFromProps() {
      let res = this.$props.list;
      this.appoDetailsData = res;
      this.myForm.id = res.appointment.id;
      this.myForm.customerId = res.customer.id;
      // 对比用的预约规格信息, 主要对比规格id是否变化; 仅数量变化不影响提交对象status字段
      this.referenceInfo = res.appointment;

      // 备注信息按前端原来的格式传入
      if (res.appointment.customerNotes) {
        this.notes.push({
          name: res.customer.name,
          position: "顾客",
          time: new Date(res.appointment.customerNotesTime).format(
            "yyyy-MM-dd hh:mm"
          ),
          note: res.appointment.customerNotes
        });
      }
      if (res.appointment.staffNotes) {
        this.notes.push({
          name: res.appointment.staffName,
          position: "服务者",
          time: new Date(res.appointment.staffNotesTime).format(
            "yyyy-MM-dd hh:mm"
          ),
          note: res.appointment.staffNotes
        });
      }
      if (res.appointment.frontDeskNotes) {
        this.notes.push({
          name: "门店",
          position: "",
          time: new Date(res.appointment.frontDeskNotesTime).format(
            "yyyy-MM-dd hh:mm"
          ),
          note: res.appointment.frontDeskNotes
        });
      }
    },
    close() {
      this.$emit("close", "showModifyDialog");
    },
    toOpera(data) {
      // 取消预约
      if (data === "cancel") {
        this.$emit("cancelOrder");
        // 取消，则直接隐藏弹窗
        this.close();
      } else {
        // 发起子组件的表单提交事件, 由本页面的子组件将数据发送到本页面的父组件
        this.$refs["formDetails"].submitEvent();
      }
    },
    toOpenOrder() {
      if (!this.list.orderAble) {
        this.$message({
          type: "warning",
          message: this.list.unOrderReason
        });
        return;
      }
      this.$emit("billFromAppoint");
    },
    handleOnSubmitFromDetails(data) {
      let params = {
        id: data.id,
        orderId: data.orderId,
        storeId: this.$store.state.manage.currentInfo.shopId,
        customerId: this.appoDetailsData.customer.id,
        staffId: data.staffId,
        appointmentServiceInfoList: data.appointmentServiceInfoList,
        dueTime: data.date + " " + data.time,
        // amount: 0, // 1.0不做预约金, 且预约金应该由后端自己计算
        notes: this.myForm.notes
      };
      this.$emit("callSuperCreateAppointmentApi", params);
    },
    getSonStaffInfo() {
      console.log(1)
      // 这里还要调用子组件发方法获取数据。。。
      this.$refs.formDetails.getStaffInfo()
    },
    giveStaffInfo(data) {
      this.$emit('giveStaffInfo', data)
    }
  }
};
</script>
<style lang="scss" scoped>
.pointer {
  cursor: pointer;
}
/deep/ .el-input__inner {
  cursor: pointer;
}
.content {
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  margin-bottom: 10px;
}
.form_area {
  position: relative;
}
.notes {
  .notes-box {
    border: 1px solid#F0F1F4;
    border-radius: 3px;
    margin-bottom: 15px;
    .notes-con {
      box-sizing: border-box;
      padding: 10px 0;
      padding-right: 20px;
      .notes-con-item {
        display: flex;
        font-size: 14px;
        line-height: 20px;
        margin-bottom: 10px;
        .left {
          width: 140px;
          text-align: right;
          box-sizing: border-box;
          padding-right: 20px;
          display: inline-block;
          .name {
            color: #666666;
          }
          .time {
            font-size: 12px;
            color: #999999;
          }
        }
        .right {
          flex: 1;
          text-align: justify;
        }
      }
    }
    .add-note {
      display: flex;
      margin-bottom: 15px;
      .left {
        width: 140px;
        color: #666666;
        font-size: 14px;
        box-sizing: border-box;
        padding-right: 20px;
        text-align: right;
      }
      .right {
        /deep/ .el-textarea__inner {
          width: 500px;
        }
      }
    }
  }
}
.order-modify-body {
  max-height: 600px;
  overflow: auto;
}
.abnormal-info {
  height: 50px;
  line-height: 50px;
  font-size: 14px;
  text-indent: 38px;
  box-shadow: 0 0 4px 0 rgba(174, 184, 229, 0.3);
  position: relative;
}
.sub-title {
  margin: 20px 0 10px;
  color: #333;
  font-weight: 700;
  font-size: 14px;
}
.main-form {
  box-shadow: 0 0 4px 0 rgba(174, 184, 229, 0.3);
}
</style>
