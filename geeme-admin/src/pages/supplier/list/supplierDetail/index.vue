<template>
  <G-FullPage title="企业详情" @back="back">
    <div class="supplier-detail-content">
      <div class="pic-side">
        <img />
      </div>
      <div class="info-side">
        <div class="title-info">
          <span class="brand-name">杭州颜美贸易有限公司</span>
          <StatusTag :status=1 style="margin: 0 0 0 10px;"/>
          <AuthTag :status=1 style="margin: 0 0 0 10px;"/>
          <p class="brand-code">企业编号：ZJ091825016</p>
        </div>
        <!-- 基本信息 -->
        <G-Border-Content title="基本信息" class="content-wrapper">
          <div class="base-info">
            <G-Detail-Item class="info-item" label="所属行业" :layout="infoLayout">
              <span class="info-text">美发用品</span>
            </G-Detail-Item>
            <G-Detail-Item class="info-item" label="企业口号" :layout="infoLayout">
              <span class="info-text">生活可以更美</span>
            </G-Detail-Item>
            <G-Detail-Item class="info-item" label="创建人" :layout="infoLayout">
              <span class="info-text">刘一刀</span>
            </G-Detail-Item>
            <G-Detail-Item class="info-item" label="手机号码" :layout="infoLayout">
              <span class="info-text">18919288877</span>
            </G-Detail-Item>
            <G-Detail-Item class="info-item" label="客服电话" :layout="infoLayout">
              <span class="info-text">0571-88251788</span>
            </G-Detail-Item>
            <G-Detail-Item class="info-item" label="企业地址" :layout="infoLayout">
              <span class="info-text">浙江省杭州市滨江区江南大道1088号宝龙城2F-16</span>
            </G-Detail-Item>
            <G-Detail-Item class="info-item" label="营业时间" :layout="infoLayout">
              <span class="info-text">周一、周三至周五、周日 10：00-22：00</span>
            </G-Detail-Item>
            <G-Detail-Item class="info-item" label="企业简介" :layout="infoLayout">
              <span
                class="info-text"
              >颜美形象Salon是一家专业的美容美发机构。经历二十一年发展。沙龙的经营场所已成为独立精致时尚的五层小楼。现开设美发、美容养生、皮肤管理等服务项目。沙龙经营面积八百多平方米，一楼为专业美发沙龙，二楼为头皮管理，三楼为美发VIP会所，有资深发型设计师，实现预约式的一对一服务，四楼为专业女子SAP，五楼为皮肤管理中心。沙龙严格按照政府部门的要求，在消费环境、从业人员、采购产品上从严治理。卫生达标率、从业人员体检百分百，产品采购产地直接供货。确保顾客有一个安全、舒适、放心的消费环境。</span>
            </G-Detail-Item>
            <!-- operation -->
            <div class="inside-operation">
              <a-button type="primary">认证</a-button>
              <a-button style="margin-left: 10px; background:#F52D56; color: #ffffff;">禁用</a-button>
            </div>
          </div>
        </G-Border-Content>
        <!-- 系统信息 -->
        <G-Border-Content title="系统信息" class="content-wrapper">
          <div class="system-info">
            <G-Detail-Item class="info-item" label="系统版本" :layout="infoLayout">
              <span class="info-text">旗舰版</span>
            </G-Detail-Item>
            <G-Detail-Item class="info-item" label="开通时间" :layout="infoLayout">
              <span class="info-text">2019-03-05 20:25:25</span>
            </G-Detail-Item>
            <G-Detail-Item class="info-item" label="到期时间" :layout="infoLayout">
              <span class="info-text">2020-03-05 20:15:24</span>
            </G-Detail-Item>
            <!-- operation -->
            <div class="inside-operation">
              <a-button type="primary">续期</a-button>
              <a-button style="margin-left: 10px; background:#41CAC0; color: #ffffff;">升级</a-button>
            </div>
          </div>
        </G-Border-Content>
        <!-- 销售与服务 -->
        <G-Border-Content title="销售与服务" class="content-wrapper">
          <div class="sale-info">
            <a-form layout="inline" style="margin: 0 0 18px 0;">
              <a-form-item label="销售归属">
                <a-select placeholder="请选择销售公司" style="width:300px;">
                  <a-select-option value="china">杭州分公司</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item>
                <a-select placeholder="请选择销售人" style="width:200px;">
                  <a-select-option value="china">某某某</a-select-option>
                </a-select>
              </a-form-item>
            </a-form>
            <a-form layout="inline">
              <a-form-item label="服务归属">
                <a-select placeholder="请选择销售公司" style="width:300px;">
                  <a-select-option value="china">杭州分公司</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item>
                <a-select placeholder="请选择服务者" style="width:200px;">
                  <a-select-option value="china">某某某</a-select-option>
                </a-select>
              </a-form-item>
            </a-form>
          </div>
        </G-Border-Content>
        <!-- 付款记录 -->
        <G-Border-Content title="付款记录" :defualtStyle="{height: '700px'}" class="content-wrapper">
          <div class="record-info">
            <a-table>
              <a-table-column title="付款时间"></a-table-column>
              <a-table-column title="付款性质"></a-table-column>
              <a-table-column title="账号数量"></a-table-column>
              <a-table-column title="使用数量"></a-table-column>
              <a-table-column title="版本"></a-table-column>
              <a-table-column title="购买时长"></a-table-column>
              <a-table-column title="付款金额"></a-table-column>
              <a-table-column title="付款方式"></a-table-column>
              <a-table-column title="操作人"></a-table-column>
            </a-table>
          </div>
        </G-Border-Content>

        <div class="bottom-operation">
          <a-button type="primary" style="margin-right: 20px;">保存修改</a-button>
          <a-button>取消</a-button>
        </div>
      </div>
    </div>
  </G-FullPage>
</template>

<script>
import AuthTag from '../../components/authTag'
import StatusTag from '../../components/statusTag'
export default {
  components: {
    AuthTag,
    StatusTag
  },
  data() {
    return {
      infoLayout: { label: 125, content: 726 },
    };
  },
  methods: {
    back() {
      this.$router.push("/app/supplier/list");
    }
  }
};
</script>

<style lang="less" scoped>
.supplier-detail-content {
  .common-scrollbar();
  padding: 40px 0 0 70px;
  overflow-y: auto;
  height: calc(100vh - 105px);
  display: flex;
  .pic-side {
    padding: 0 40px 0 0;
    img {
      width: 160px;
      height: 160px;
      display: block;
    }
  }
  .info-side {
    width: 1110px;
    .content-wrapper {
      margin: 0 0 20px 0;
    }
    .title-info {
      display: flex;
      /* justify-content: space-between; */
      align-items: center;
      margin: 0 0 22px 0;
      height: 30px;
      .brand-name {
        color: rgba(51, 51, 51, 1);
        font-size: 22px;
      }
      .brand-code {
        color: rgba(102, 102, 102, 1);
        font-size: 14px;
        text-align: right;
        flex: 1;
      }
    }
    .base-info {
      padding: 20px 0 0 0;
      position: relative;
    }
    .system-info {
      padding: 20px 0 15px 0;
      position: relative;
    }
    .sale-info {
      padding: 20px 0 20px 70px;
      .normal-form-item();
    }
    .record-info {
      .ant-inside-table-content();
      padding: 0 17px 20px 17px;
    }
    .info-item {
      margin: 0 0 15px 0;
      .info-text {
        color: rgba(51, 51, 51, 1);
        font-size: 14px;
      }
    }
    .inside-operation {
      position: absolute;
      top: 20px;
      right: 20px;
    }
    .bottom-operation {
      margin: 40px 0;
    }
  }
}
</style>