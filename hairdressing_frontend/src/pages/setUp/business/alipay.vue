<template>
  <full-single-page :title="'开通支付宝支付'">
		<div class="alipay-page-body">
			<div class="warning-line">
				<i class="icon iconfont icon-icon_popup_plaint"></i>
				请使用 {{alipay.aliPayAccount}} 支付宝账号扫码授权!
			</div>

			<h3 class="first">方式一：打开收款支付宝扫一扫，扫描此二维码</h3>
			<div class="methods-box m1">
				<div class="left-box">
					<div id="qrcode"></div>
					<div class="text-info">打开支付宝扫一扫</div>
				</div>
				<div class="right-box">
					<div class="title-info">操作示例：</div>
					<div class="img-info">
						<img src="/static/images/alipay/img_alipay01.png">
					</div>
				</div>
			</div>

			<h3 class="second">方式二：复制链接打开新页面，或点击授权按钮进行授权</h3>
			<div class="methods-box m2">
				<div class="left-box">
					<div class="url-info text-for-copy" id="copy">{{alipay.authUrl}}</div>
					<el-button class="normal_gray_btn" @click="copyTxt">复制链接</el-button>
					<el-button class="normal_gray_btn" @click="openPage">点击授权</el-button>
				</div>
				<div class="right-box">
					<div class="title-info">操作示例：</div>
					<div class="img-info">
						<img src="/static/images/alipay/img_alipay02.png">
					</div>
				</div>
			</div>

		</div>
  </full-single-page>
</template>

<script>
	import * as axios from "@/util/axios";
	import {mapState, mapActions} from "vuex";
	import QRCode from 'qrcodejs2';
	export default {
		name: "alipay",
		data() {
			return {
				aliCallbackTimer: null, // 支付宝授权检查
			}
		},
		created() {
			// 刷新或者合法进入
			this.getCallBackFromAliPay()
			this.authAliPay({
				authUrl: this.alipay.cacheURL
			})
		},
		mounted() {
			this.Drawqrcode(this.alipay.authUrl) // 长链接会溢出
		},
		methods: {
			...mapActions(['authAliPay']),
			// 生成二维码
			Drawqrcode(codeUrl) {
				document.getElementById('qrcode').innerHTML = '';
				let qrcode = new QRCode('qrcode', {
					width: 220,
					height: 220, // 高度
					text: codeUrl // 二维码内容
				})
			},
			copyTxt() {
				// 文本复制
				var copy = document.getElementById('copy')
				if (document.body.createTextRange) { // 该属性只有IE支持
					var range = document.body.createTextRange()
					range.moveToElementText(copy)
					range.select()
					document.execCommand('Copy')
				} else if (window.getSelection) {
					var selection = window.getSelection()
					selection.removeAllRanges()
					var range = document.createRange()
					range.selectNodeContents(copy)
					selection.addRange(range)
					document.execCommand('Copy')
					selection.removeAllRanges()
				}
				this.$message({
					type: 'success',
					message: '链接已经复制，请前往新窗口访问并完成授权'
				})
			},
			openPage() {
				window.open(this.alipay.authUrl)
			},
			// 检测授权成功
      getCallBackFromAliPay() {
        axios.get(`/getAliPayVerificationCallBack/${this.currentInfo.brandId}`).then(res => {
          if (res.success) {
            window.clearTimeout(this.aliCallbackTimer)
						this.aliCallbackTimer = null
						this.$message({
							type: 'success',
							message: '授权成功，为了您的账号安全，已离开页面'
						})
						this.$router.go(-1)
          } else {
            let me = this
            this.aliCallbackTimer = setTimeout(function(){
              me.getCallBackFromAliPay()
            }, 3000)
          }
        })
      }
		},
		beforeDestroy() {
			// 刷新或者离开页面
			window.clearTimeout(this.aliCallbackTimer)
			this.aliCallbackTimer = null
			this.authAliPay({
				authUrl: null, // 品牌路由守卫有用到
			})
		},
		computed: {
			...mapState({
				alipay: state => state.payTypesAuth.aliPay,
				currentInfo: state => state.manage.currentInfo
			})
		},
	}
</script>

<style scoped lang="scss">
.alipay-page-body {
	padding: 30px 40px 20px;
	.warning-line {
		width: 630px;
		height: 40px;
		border-radius: 3px;
		background-color: rgba(252, 179, 34, 0.1);
		border: 1px solid rgba(250, 201, 72, 1);
		font-size: 14px;
		line-height: 40px;
		text-indent: 16px;
		.iconfont {
			color: #fcb322;
			margin-right: 10px;
		}
	}
	h3.first {
		margin: 18px 0;
	}
	h3.second {
		margin: 32px 0 18px;
	}
	.methods-box {
		border-radius: 2px;
		border: 1px solid rgba(240, 241, 244, 1);
		display: flex;
		flex-wrap: nowrap;
		.left-box {
			width: 500px;
			padding: 30px 38px;
		}
		.right-box {
			flex: 1;
			display: flex;
			flex-wrap: nowrap;
			padding: 20px;
			.title-info {
				width: 80px;
				font-weight: 700;
			}
			.img-info {
				// width: 662px;
				flex: 1;
			}
		}
		&.m1 {
			height: 410px;
			img {height: 370px;}
		} 
		&.m2 {
			height: 340px;
			img {
				width: 662px;
			}
		} 
		#qrcode {
			width: 220px;
			height: 220px;
			// background: #ccc;
		}
		.text-info {
			width: 220px;
			height: 40px;
			line-height: 40px;
			font-size: 14px;
			text-align: center;
		}
		.url-info {
			width: 428px;
			height: 80px;
			font-size: 14px;
			word-wrap: break-word;
			margin-bottom: 20px;
			background: #eee;
		}
	}
}

</style>
