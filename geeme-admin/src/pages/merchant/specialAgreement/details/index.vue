<template>
  <G-FullPage title="特约商户" @back="back">
    <div class="business-detail-content">
      <div class="info-side">
        <!-- 联系信息 -->
        <G-Border-Content title="联系信息" class="content-wrapper">
          <div class='tagStatus'>
            <G-Status-Tag :data='styles[merchantByIdInfo.statusId]'/>
          </div>
          <div class="base-info">
            <G-Detail-Item class="info-item" label="联系人姓名" :layout="infoLayout">
              <span class="info-text">{{merchantByIdInfo.contactName}}</span>
            </G-Detail-Item>
            <G-Detail-Item class="info-item" label="手机号码" :layout="infoLayout">
              <span class="info-text">{{merchantByIdInfo.telephone}}</span>
            </G-Detail-Item>
            <G-Detail-Item class="info-item" label="常用邮箱" :layout="infoLayout">
              <span class="info-text">{{merchantByIdInfo.email}}</span>
            </G-Detail-Item>
          </div>
        </G-Border-Content>
        <!-- 经营信息 -->
        <G-Border-Content title="经营信息" class="content-wrapper">
          <div class="base-info">
            <G-Detail-Item class="info-item" label="商户简称" :layout="infoLayout">
              <span class="info-text">{{merchantByIdInfo.merchantName}}</span>
            </G-Detail-Item>
            <G-Detail-Item class="info-item" label="经营类目" :layout="infoLayout">
              <span class="info-text">{{merchantByIdInfo.levelFirst+'>'+merchantByIdInfo.levelSecond+ '>' + merchantByIdInfo.levelThird}}</span>
            </G-Detail-Item>
            <!--<G-Detail-Item class="info-item" label="售卖商品场景" :layout="infoLayout">
              <span class="info-text">{{sceneOfSaleGoods[merchantByIdInfo.sellScene]}}</span>
            </G-Detail-Item>-->
            <G-Detail-Item class="info-item" label="门店地址" :layout="infoLayout">
              <span class="info-text">{{merchantByIdInfo.storeAddress}}</span>
            </G-Detail-Item>
            <G-Detail-Item class="info-item" label="公众号/小程序名称" :layout="infoLayout">
              <span class="info-text">{{merchantByIdInfo.programName}}</span>
            </G-Detail-Item>
            <G-Detail-Item class="info-item" label="特殊资质" :layout="infoLayout">
              <G-Image :src="utils.imgFormatter(merchantByIdInfo.specialQualifications)"
                       @click="previewImage(merchantByIdInfo.specialQualifications)"></G-Image>
            </G-Detail-Item>
            <G-Detail-Item class="info-item" label="售卖商品/提供服务概念" :layout="infoLayout">
              <span class="info-text">{{merchantByIdInfo.productServiceDescription}}</span>
            </G-Detail-Item>
            <G-Detail-Item class="info-item" label="客服电话" :layout="infoLayout">
              <span class="info-text">{{merchantByIdInfo.serviceTel}}</span>
            </G-Detail-Item>
            <G-Detail-Item class="info-item" label="补充材料" :layout="infoLayout">
              <G-Image v-for="(item,index) in (merchantByIdInfo.supplementaryMaterialImages || [])" :key="index" :src="utils.imgFormatter(item)"
                       @click="previewImage(item)"></G-Image>
            </G-Detail-Item>
            <G-Detail-Item class="info-item" label="统一信用代码" :layout="infoLayout">
              <span class="info-text">{{brandInfo.creditCode}}</span>
            </G-Detail-Item>
            <G-Detail-Item class="info-item" label="营业执照" :layout="infoLayout">
              <G-Image :src="utils.imgFormatter(brandInfo.licenseImage)" width="106px" height="151px"
                       @click="previewImage(brandInfo.licenseImage)"></G-Image>
            </G-Detail-Item>
            <G-Detail-Item class="info-item" label="法人身份证(正面)" :layout="infoLayout">
              <G-Image :src="utils.imgFormatter(brandInfo.identityCardFront)" width="140px" height="90px"
                       @click="previewImage(brandInfo.identityCardFront)"></G-Image>
            </G-Detail-Item>
            <G-Detail-Item class="info-item" label="法人身份证(反面)" :layout="infoLayout">
              <G-Image :src="utils.imgFormatter(brandInfo.identityCardBack)" width="140px" height="90px"
                       @click="previewImage(brandInfo.identityCardBack)"></G-Image>
            </G-Detail-Item>
            <G-Detail-Item class="info-item" label="商标证件" :layout="infoLayout">
              <G-Image :src="utils.imgFormatter(brandInfo.logeCredentialsImage)" width="115px" height="160px"
                       @click="previewImage(brandInfo.logeCredentialsImage)"></G-Image>
            </G-Detail-Item>
            <G-Detail-Item class="info-item" label="行业资质" :layout="infoLayout">
              <div class="industry-qualification">
                <G-Image v-for="(img,index) in (brandInfo.certificationImages || '').split(',')" :key="index"
                         :src="utils.imgFormatter(img)" width="100px" height="100px" size="contain" border
                         @click="previewImage(img)"></G-Image>
              </div>
            </G-Detail-Item>
          </div>
        </G-Border-Content>
        <!-- 结算信息 -->
        <G-Border-Content title="结算信息" class="content-wrapper">
          <div class="base-info">
            <G-Detail-Item class="info-item" label="账户类型" :layout="infoLayout">
              <span class="info-text">对{{merchantByIdInfo.accountType?"公":"私"}}账户</span>
            </G-Detail-Item>
            <G-Detail-Item class="info-item" label="开户名称" :layout="infoLayout">
              <span class="info-text">{{merchantByIdInfo.accountName}}</span>
            </G-Detail-Item>
            <G-Detail-Item class="info-item" label="开户银行" :layout="infoLayout">
              <span class="info-text">{{merchantByIdInfo.openBank}}</span>
            </G-Detail-Item>
            <G-Detail-Item class="info-item" label="基本户开户行" :layout="infoLayout">
              <span class="info-text">{{merchantByIdInfo.bankBranch}}</span>
            </G-Detail-Item>
            <G-Detail-Item class="info-item" label="银行账号" :layout="infoLayout">
              <span class="info-text">{{merchantByIdInfo.bankAccount}}</span>
            </G-Detail-Item>
          </div>
        </G-Border-Content>
        <!-- 认证信息 -->
        <template v-if="pageStatus">
          <G-Border-Content title="认证信息" class="content-wrapper">
            <div class="base-info">
              <G-Detail-Item class="info-item" label="认证是否通过" :layout="infoLayout">
                <span class="info-text"><a-switch v-model='authStatus'/></span>
              </G-Detail-Item>
              <!--<G-Detail-Item v-if='authStatus' class="info-item shopNum" label="商户号" :layout="infoLayout">
                <span class="info-text"><a-input placeholder="请输入商户号"/></span>
              </G-Detail-Item>
              <G-Detail-Item v-if='!authStatus' class="info-item" label="驳回原因" :layout="infoLayout">
                <span class="info-text"><a-textarea placeholder="请输入驳回原因" :rows="4" style='width: 420px'/></span>
              </G-Detail-Item>-->
              <G-Form-Item v-bind="form.subMchId" @blur="onBlur" v-if='authStatus'></G-Form-item>
              <G-Form-Item :required="true" v-bind="form.reason" kind="textarea" v-if='!authStatus' @blur="onBlur"></G-Form-item>
            </div>
          </G-Border-Content>
          <div class="bottom-operation">
            <a-button type="primary" @click='submit' style="margin-right: 20px;">确认</a-button>
            <a-button>取消</a-button>
          </div>
        </template>
      </div>
    </div>
    <a-modal v-model="previewVisible" :footer="null" width="80%" wrapClassName="wrapClassName">
      <img :src="utils.imgFormatter(imgSrc)" style="margin-top: 20px;"/>
    </a-modal>
  </G-FullPage>
</template>

<script>
  import utils from '@/utils'
  import {getMerchantByIdInfo, authenticateInfo, addReason, updateStatus} from '@/api/merchant'
  import {validateItem, validateAll} from '@/utils/validation'

  export default {
    data() {
      return {
        infoLayout: {label: 125, content: 726},
        merchantByIdInfo: {},
        brandInfo: {},
        id: this.$route.params.id,
        authStatus: true,
        brandId: this.$route.params.brandId,
        previewVisible: false,
        imgSrc: '',
        utils,
        form: {
          subMchId: {
            name: 'subMchId',
            label: '商户号',
            placeholder: '请输入商户号',
            required: true,
            status: null,
            help: '',
            tip: '请输入商户号',
            mode: 'className',
            value: '',
            initValue: '',
          },
          reason: {
            name: 'reason',
            label: '驳回原因',
            placeholder: '请输入驳回原因',
            required: false,
            status: null,
            help: '',
            tip: '请输入商户号',
            mode: 'className',
            value: '',
            initValue: '',
          }
        },
        sceneOfSaleGoods: {
          OFFLINE_PLACE: "线下场所",
          OFFICIAL_ACCOUNT: "公众号/小程序",
          WEBSITE: "网站",
          APP: "APP"
        },
        styles: {
          0: {
            bgColor: '#FF6D61',
            content: '已驳回',
          },
          1: {
            bgColor: '#58C9F3',
            content: '已通过',
          },
          2: {
            bgColor: '#FCB322',
            content: '审核中',
          }
        }
      };
    },
    computed: {
      pageStatus() {
        return this.$route.fullPath.includes('certification') && (this.merchantByIdInfo.statusId !== 1)
      }
    },
    mounted() {
      this.getQueryDetails();
      this.authenticateInfo()
    },
    methods: {
      async getQueryDetails() {
        let res = await getMerchantByIdInfo({id: Number(this.id)});
        if (res.success) {
          this.merchantByIdInfo = {
            ...res.getMerchantByIdInfo,
            supplementaryMaterialImages:res.getMerchantByIdInfo.supplementaryMaterials.split(",")
          };
        }
      },
      async authenticateInfo() {
        let res = await authenticateInfo(this.brandId);
        this.brandInfo = res;
      },
      async submit() {
        if (this.authStatus) {
          if (validateAll(this.form)) {
            let res = await updateStatus({
              id: Number(this.id),
              statusId: 1,
              subMchId: this.form.subMchId.value
            });
            if (res.success) {
              this.$message.success(res.message);
              this.$router.go(-1)
            } else {
              this.$message.error(res.message)
            }
          }
        } else {
          if (!!this.form.reason.value) {
            let res = await addReason({
              id: Number(this.id),
              reason: this.form.reason.value
            });
            if (res.success) {
              this.$message.success(res.message);
              this.$router.go(-1)
            } else {
              this.$message.error(res.message)
            }
          } else {
            this.$message.error('请输驳回原因')
          }
        }
      },
      back() {
        this.$router.push("/app/merchant/specialAgreement");
      },
      previewImage(img) {
        this.previewVisible = true;
        this.imgSrc = img;
      },
      onBlur(data) {
        const obj = this.form[data.name];
        obj.value = data.value;
        validateItem(obj)
      },
    },
  };
</script>

<style lang="less" scoped>
  .business-detail-content {
    .common-scrollbar();
    padding: 0 30px;
    padding-top: 40px;
    overflow-y: auto;
    height: calc(100vh - 105px);
    display: flex;

    .info-side {
      width: 100%;

      .content-wrapper {
        margin: 0 0 20px 0;
        position: relative;
      }

      .tagStatus {
        position: absolute;
        top: 0;
        left: 75px;
      }

      .base-info {
        padding: 20px 0 7px 0;
        position: relative;

        .info-item {
          margin: 0 0 13px 0;
          .content{
            .image{
              margin-right: 15px;
            }
          }
        }

        .shopNum {
          line-height: 32px;
        }

        .info-text {
          color: rgba(51, 51, 51, 1);
          font-size: 14px;
        }

        .industry-qualification {
          display: flex;
          flex-wrap: wrap;

          .image {
            margin: 0 10px 10px 0;
          }
        }

        /deep/ .ant-form-item-label {
          width: 140px;
        }
      }

      .bottom-operation {
        margin: 40px 0;
      }
    }
  }
</style>
