<template>
  <div class="center-guide-wrap">
    <div class="page-title center-nav__wrap">
      <ul class="nav-list">
        <li class="nav-item">新手引导</li>
      </ul>
    </div>
    <div class="programa-body-box">
      <div class="programa-item">
        <div class="programa-title"><div class="info">快速开店</div></div>
        <div class="programa-row three">
          <programa-card @click.native="detailImg('01')" :icon="'icon_novice01'" :title="'创建品牌'"/>
          <div class="arrow left"></div>
          <programa-card @click.native="detailImg('02')" :icon="'icon_novice02'" :title="'创建门店'"/>
          <div class="arrow left"></div>
          <programa-card @click.native="detailImg('03')" :icon="'icon_novice03'" :title="'新增职务'"/>
        </div>
        <div class="programa-row three empty">
          <div class="none"></div>
          <div class="arrow down"></div>
        </div>
        <div class="programa-row three">
          <programa-card @click.native="detailImg('06')" :icon="'icon_novice06'" :title="'快速开单'"/>
          <div class="arrow left right"></div>
          <programa-card @click.native="detailImg('05')" :icon="'icon_novice05'" :title="'新增员工'"/>
          <div class="arrow left right"></div>
          <programa-card @click.native="detailImg('04')" :icon="'icon_novice04'" :title="'新增服务/产品'"/>
        </div>
      </div>
      <div class="programa-item">
        <div class="programa-title"><div class="info">开通小程序</div></div>
        <div class="programa-row two">
          <programa-card @click.native="detailImg('07')" :icon="'icon_novice07'" :title="'品牌认证'"/>
          <div class="arrow left"></div>
          <programa-card @click.native="detailImg('08')" :icon="'icon_novice08'" :title="'申请生成小程序'"/>
        </div>
      </div>
      <div class="programa-item">
        <div class="programa-title"><div class="info">开通线上支付</div></div>
        <div class="programa-row two">
          <programa-card @click.native="detailImg('09')" :icon="'icon_novice09'" :title="'开通微信支付'"/>
          <div class="arrow left"></div>
          <programa-card @click.native="detailImg('--')" :icon="'icon_novice10'" :title="'开通支付宝支付'"/>
        </div>
      </div>
      <div class="programa-item">
        <div class="programa-title"><div class="info">基础设置</div></div>
        <div class="programa-row three">
          <programa-card @click.native="detailImg('11')" :icon="'icon_novice11'" :title="'排班设置'"/>
          <div class="arrow left"></div>
          <programa-card @click.native="detailImg('12')" :icon="'icon_novice12'" :title="'预约设置'"/>
          <div class="arrow left"></div>
          <programa-card @click.native="detailImg('13')" :icon="'icon_novice13'" :title="'提成设置'"/>
        </div>
      </div>
    </div>
    <el-dialog width="1000px" :title='dialogTitle' :visible.sync="centerDialogVisible">
      <img width="960" :src="require(`@/assets/images/center_NoviceGuide/img_novice${imgUrl}.png`)">
    </el-dialog>
    <DelModel 
      title="暂未开放"
      content="该功能暂未开放，敬请期待"
      :icon="'icon_order_close'"
      :iconColor="'#fcb322'"
      :showConcelBtn='false' 
      :delTagDialogVisible="delTagDialogVisible" 
      @confirm="closeDialog" 
      @close="closeDialog"
    />
  </div>
</template>
<script>
import programaCard from '@/components/center/noviceGuide/programaCard'
export default {
  name: 'g-novice-guide',
  components: { programaCard },
  data() {
    return {
      centerDialogVisible: false,
      delTagDialogVisible: false,
      imgUrl: '01',
      dialogTitle: '晚安',
    }
  },
  methods: {
    detailImg(img) {
      if (isNaN(img)) {
        this.delTagDialogVisible = true
      } else {
        switch (img) {
          case '01': // 创建品牌
          case '02': // 创建门店
          case '07': // 品牌认证
            this.dialogTitle = '个人中心'
            break
          case '03': // 新增职务
          case '08': // 申请生成小程序
          case '09': // 开通微信支付
          case '13': // 提成设置
            this.dialogTitle = '总部管理台'
            break
          case '04': // 新增服务/产品
          case '05': // 新增员工
          case '06': // 快速开单
          case '11': // 排班设置
          case '12': // 预约设置
            this.dialogTitle = '门店管理台'
            break
        }
        this.imgUrl = img
        this.centerDialogVisible = true
      }
    },
    closeDialog(data) {
      this.delTagDialogVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
$title_color: #f52d56;
@mixin scroll-bar ($width, $color, $bg) {
    &::-webkit-scrollbar {
        width: $width;
    }
    &::-webkit-scrollbar-thumb {
        border-radius: 5px;
        -webkit-box-shadow: inset 0 0 5px $color;
        box-shadow: inset 0 0 5px $color;
        background: $color;
    }
    &::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 5px $color;
        box-shadow: inset 0 0 5px $color;
        border-radius: 0;
        background: $bg;
    }
}
.center-guide-wrap {
  padding: 0 20px;
  color: #333;
  font-size: 18px;
  .page-title {
    // height: 51px;
    // line-height: 51px;
    // border-bottom: 1px solid #dcdfe6;
    // text-indent: 18px;
    // color: $title_color;
    font-size: 16px;
    color: #E33443;
  }
  .programa-body-box {
    // height: calc(100vh - 157px);
    // overflow-y: auto;
    &::before {
      content: '';
      display: table;
    }
  }
  .programa-item {
    margin-top: 40px;
    .programa-title {
      padding-left: 18px;
      height: 18px;
      line-height: 18px;
      margin-bottom: 18px;
      .info {
        border-left: 3px solid #333;
        text-indent: 10px;
        font-weight: bold;
      }
    }
    .programa-row {
      margin-left: 120px;
      display: flex;
      position: relative;
      z-index: 10; // 避免旋转后遮挡卡片
      &.empty {
        z-index: 1; // 避免旋转后遮挡卡片
      }
      &.three {
        width: 992px;
      }
      &.two {
        width: 616px;
      }
      .none {
        flex: 1;
      }
    }
    .arrow {
      background: url('../../assets/images/center_NoviceGuide/icon_novice_arrow.png') no-repeat;
      background-size: 64px 34px;
      background-position: center;
      &.left {
        flex: 1;
      }
      &.right {
        transform: rotate(180deg);
      }
      &.down {
        width: 240px;
        height: 100px;
        transform: rotate(90deg);
      }
    }
    &:last-child {
      margin-bottom: 20px;
    }
  }
  .el-dialog__wrapper {
    @include scroll-bar(4px, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1));
  }
}

</style>
