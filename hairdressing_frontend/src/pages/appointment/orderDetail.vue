<template lang="pug">
transition(
  name="fade"
)
  section.order-detail.text-for-copy(
    v-if="show"
  )
    .order-detail-container
      .order-detail-header
        .title 预约详情
        .close(
          @click="close('close')"
        )
          i.icon.iconfont.icon-icon_close
      .order-detail-body
        .abnormal-info(
          v-show="list.appointment.abnormal"
        )
          span(style="color:#666;") 异常原因
          span(style="color: #f52d56; margin-left: 22px;") {{list.appointment.abnormalReason}}
        .box-modules.clearfix
          .title 预约信息
          .status
            status-text(
              :type="bgColor[list.appointment.status]",
              :name="list.appointment.status === '已服务' ? '已开单': list.appointment.status"
            )
          .content
            detail-info(
              :list="list.appointment"
            )
        .box-modules.clearfix
          .title 客户信息
          .user-box-wrap
            user-box(
              :list="[list.customer]"
            )
            .to-read
              g-clickbtn(
                :title="'查看客户档案'",
                :icon="'icon_operate_eyes'",
                @click="gotocustomer"
              )
        .box-modules.clearfix(
          v-show="notesList.length"
        )
          .title 备注信息
          .content
            remark-info(
              :notes="notesList"
            )
      .modify-order(
        v-show="/待服务/.test(list.appointment.status)"
      )

</template>

<script>
import DetailInfo from '@/components/appoModule/detailInfo'
import UserBox from '@/components/appoModule/userBox'
import RemarkInfo from '@/components/appoModule/remarkInfo'
import * as datas from '@/assets/js/datas'
import { mapActions, mapState } from 'vuex'
  export default {
    props: {
      show: Boolean,
      list: Object
    },
    data() {
      return {
        bgColor: datas.SERVER_STATUS,
        notesList: [], // 需要重组的备注数据
      }
    },
    components: {
      'detail-info': DetailInfo,
      'user-box': UserBox,
      'remark-info': RemarkInfo
    },
    created() {
       // 备注信息按前端原来的格式传入
        if (this.list.appointment.customerNotes) {
          this.notesList.push({
            name: this.list.customer.name,
            job: '顾客',
            time: new Date(this.list.appointment.customerNotesTime).format('yyyy-MM-dd hh:mm'),
            remark: this.list.appointment.customerNotes
          })
        }
        if (this.list.appointment.staffNotes) {
          this.notesList.push({
            name: this.list.appointment.staffName,
            job: '服务者',
            time: new Date(this.list.appointment.staffNotesTime).format('yyyy-MM-dd hh:mm'),
            remark: this.list.appointment.staffNotes
          })
        }
        if (this.list.appointment.frontDeskNotes) {
          this.notesList.push({
            name: '门店',
            job: '',
            time: new Date(this.list.appointment.frontDeskNotesTime).format('yyyy-MM-dd hh:mm'),
            remark: this.list.appointment.frontDeskNotes
          })
        }
    },
    methods: {
      ...mapActions(['beautyRecordId']),
      close() {
        this.$emit('close', 'showDetailDialog')
      },
      toOpera() {
        // 修改预约
        this.$emit('modify', '')
      },
      gotocustomer() {
        // this.beautyRecordId(this.list.customer.id)
        // this.$router.push(`/shop-inner/customerRecord`)

        // 新标签页打开
        this.toPagesInNewTags(`/shop-inner/customerRecord/${this.list.customer.id}`)
      },
    },
  }
</script>

<style lang="scss" scoped>
.abnormal-info {
  height: 50px;
  line-height: 50px;
  font-size: 14px;
  text-indent: 38px;
  box-shadow: 0 0 4px 0 rgba(174, 184, 229, .3);
  position: relative;
  margin-bottom: 20px;
}
.sub-title {
  margin: 20px 0 10px;
  color: #333;
  font-weight: 700;
  font-size: 14px;
}
.main-form {
  box-shadow: 0 0 4px 0 rgba(174, 184, 229, .3);
}
.content {
  min-height: 40px;
}
</style>
