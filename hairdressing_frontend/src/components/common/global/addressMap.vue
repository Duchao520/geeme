<template>
    <div>
        <el-form :model="formData" :rules="rules" label-width="1.53rem">
            <s-address :isdisabled='isdisabled' :myAddress='formData.address' @changeCityData='changeCityData'></s-address>
			<el-form-item prop='addressDetail' class='detail'>
				<el-input 
					style="width:420px"
					v-model="formData.addressDetail"
					placeholder="请输入详细地址"
                    :disabled="isdisabled"
					:class='{"errorInput": !isSure && formData.addressDetail != ""}'></el-input>
					<span v-if='!isSure && formData.addressDetail != ""' class='detailError'>未查询到该地址</span>
			</el-form-item>
			<el-form-item>
				<div id="map_container" style="width:500px;height:300px;"></div>
			</el-form-item>
		</el-form>
    </div>
</template>
<script>
// import * as axios from '@/util/axios'
import axios from 'axios'
import AMap from 'AMap'
import * as utils from '@/assets/js/utils'
var map,marker;
export default {
    data() {
        return {
			formData: {
				address: [],
            	addressDetail: '',
			},
			isChange: true,
			rules: {
				address: [{ required: true, message: "请选择省市区", trigger: "change" }],
				addressDetail: [
					{ required: true, message: "请输入详细地址", trigger: "change" }
				],
			},
			isSure: true // 判断详细地址是否与省市区下
        }
    },
    props: {
        isdisabled: Boolean,
		needPos: Boolean,
        parentDetails: Object,   // 父组件传递下来的城市数据 {address，addressDetail}
    },
    created() {
        
    },
    mounted() {
        this.amapView()
    },
    methods: {
        // 初始化地图
        amapView(){
            map = new AMap.Map('map_container', {
                zoom:11,
                resizeEnable: true,
            })
            if (this.needPos) {
                // 调用定位
                this.getCurrentPos(map)
            }
            AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], function () {
                map.addControl(new AMap.ToolBar())
                map.addControl(new AMap.Scale())
            })   
            if(!this.isdisabled) {
                this.showInfoClick()
            }
        },
        getCurrentPos(map) {
            let _this = this
            // 获取当前定位信息
            map.plugin('AMap.Geolocation', function() {
                var geolocation = new AMap.Geolocation({
                    enableHighAccuracy: true,//是否使用高精度定位，默认:true
                    timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                    maximumAge: 0,           //定位结果缓存0毫秒，默认：0
                    convert: false,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                    showButton: true,        //显示定位按钮，默认：true
                    buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
                    buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                    showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
                    showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
                    panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
                    zoomToAccuracy:true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                });
                map.addControl(geolocation);
                geolocation.getCurrentPosition();
                AMap.event.addListener(geolocation, 'complete', data => {
                    _this.toGeolocation(data)
                });
                //返回定位信息
                AMap.event.addListener(geolocation, 'error', err => {
                    console.log(err)
                });
                //返回定位出错信息
            });
        },
        // 改变地图所在位置
        toGeolocation(data) {
            let position = data.position
			let addressComponent = data.addressComponent
			let newCity = {
				province: data.addressComponent.province,
				city: data.addressComponent.city,
				area: data.addressComponent.district,
				formatted_address: data.formattedAddress,
				lng:data.position.lng,
				lat: data.position.lat
			}
            this.handleCityData(newCity,'init')
        },
        // 点击后在该地点添加点标记及其label标签
        addMarker(lng,lat,detail){
            //如果存在上一个marker，则先删除，之后再添加新的marker
            if(marker){
                map.remove(marker);
            }
            marker = new AMap.Marker({
                icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
                position: [lng,lat],
                // offset: new AMap.Pixel(-13,-30)
            });
            marker.setMap(map);
            marker.setLabel({
                //修改label相对于maker的位置
                offset: new AMap.Pixel(-50, 40),
                content: "<div class='info'>"+detail+"</div>"
			});
        },
        // 根据用户输入的地址获取当前的经纬度信息
        getLngAndLat(address) {
            let that = this
            axios.get(`//restapi.amap.com/v3/geocode/geo?key=5b638921d27c314409a6f6a47dc22838&s=rsv3&city=35&address=${address}`)
            .then(function (res) {
                if(res.data.status == 1){
                    let geocodes = res.data.geocodes[0]
                    let p = geocodes.province
                    let c = geocodes.city
                    let a = address.slice(p.length + c.length)
                    if(!!geocodes){
						let location = geocodes.location.split(',');
						let newCity = {
							province: p,
							city: c,
							area: Array.isArray(geocodes.district) ? a : geocodes.district,
							formatted_address: geocodes.formatted_address,
							lng:location[0],
							lat: location[1]
						}
						that.handleCityData(newCity,'check')
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
            })
        },
        // 点击地图获取当前经纬度
		showInfoClick(){
			let that = this
			AMap.event.addListener(map,'click',function (e) {
				that.getAddress(e.lnglat.getLng(),e.lnglat.getLat())
			})
		},
		// 根据经纬度获取当前地址信息
		getAddress(lng,lat){
			let that = this
			axios.get('//restapi.amap.com/v3/geocode/regeo?key=f211857599047852b425815b7d4a29e7&location='+lng+','+lat+'&radius=1000&extensions=all&batch=false&roadlevel=0')
			.then(function (res) {
				if(res.data.status == 1){
					if(res.data.regeocode.formatted_address){
						let newCity = {
							province: res.data.regeocode.addressComponent.province,
							city: res.data.regeocode.addressComponent.city,
							area: Array.isArray(res.data.regeocode.addressComponent.district) ? res.data.regeocode.addressComponent.township : res.data.regeocode.addressComponent.district,
							formatted_address: res.data.regeocode.formatted_address,
							lng:lng,
							lat: lat
						}
						that.handleCityData(newCity,'click');
					}
				}
			}).catch(function (error) {
				console.log(error);
			})
		},
		// 处理地图返回的数据
		handleCityData(data,type) {
            console.log(data)
			let that = this
            let _addr,newCity;
            if (data.province != data.city) { // 处理新数据与旧数据不匹配
                _addr = data.province + data.city + data.area
            } else {
                _addr = data.province + data.area
            }
            let oldCity = that.formData.address[0] + that.formData.address[1] + that.formData.address[2];
            let detail = utils.matchReplace(data.formatted_address, _addr, 'g', '');
            let oldDetail = utils.matchReplace(this.mapAddress, oldCity, 'g', '');
            if (data.city.length == 0 || data.city == data.province) { // 处理城市数据与高德返回的数据不同问题
                if (data.area.length != 0) {
                    if (data.area.charAt(data.area.length - 1) == '区') {
                        data.city = data.province.replace('市','城区')
                    } else if (data.area.charAt(data.area.length - 1) == '县') {
                        data.city = data.province.replace('市','郊县')
                    }
                }
            }
            if (detail != '' && oldDetail != '' && type == 'check') {
                detail = oldDetail
            }
			if (_addr == oldCity && detail == '') {
				this.isSure = false
			} else {
				this.isSure = true
            }
			newCity = [data.province,data.city,data.area];
            this.isChange = false;
            new Promise(function(resolve, reject){ // 阻止再次请求高德地图
				that.formData.address = newCity;
				if (detail != '') that.formData.addressDetail = detail;
				return resolve();
			}).then(result =>{
				that.isChange = true
            })
            let mapInfo = {
				province: newCity[0],
				city: newCity[1],
				area: newCity[2],
				lng: data.lng,
				lat: data.lat,
				addressDetail: this.formData.addressDetail,
				isSure: this.formData.addressDetail == ''? true : this.isSure
			}
			map.setCenter([data.lng,data.lat]); //设置地图中心点
			this.addMarker(data.lng,data.lat,this.mapAddress);
			that.$emit('getMapValue',mapInfo) // 向父组件发送数据
        },
        changeCityData(val,num) {
            this.formData.address = val;
            if ( num>1 && this.isChange) {
                this.formData.addressDetail = '';
            }
        }
    },
    computed: {
        mapAddress() {
            let city = this.formData.address.join('')
            return city + this.formData.addressDetail
        }
    },
    watch: {
        mapAddress(newVal, oldVal) {
            if (newVal != oldVal) {
                if (this.isChange) {
					this.getLngAndLat(newVal);
				}
            }
        },
		parentDetails(val) {
            let that = this
            new Promise(function(resolve, reject){ // 阻止再次请求高德地图
                that.isChange = false;
				that.formData.address = val.address
				return resolve();
			}).then(result =>{
                that.formData.addressDetail = val.addressDetail
                that.isChange = true
            })
		}
    },
}
</script>
<style lang="scss">
    .amap-icon img,
    .amap-marker-content img{
        width: 25px;
        height: 34px;
    }
    .amap-marker-label {
        width: 200px;
        border: 1px solid #ccc;
        padding: 10px 18px 10px 10px;
        line-height: 1.4;
        overflow: auto;
        box-shadow: 0 3px 14px rgba(0,0,100,.6);
        background: #fff;
        border-radius: 2px;
        padding: 10px;
        text-align: left;
        word-break: normal;
        white-space: normal	;
    }
    .amap-geolocation-con {
      z-index: 200!important;
	}
	.detail{
		position: relative;
	}
	.detailError{
		position: absolute;
		bottom: -30px;
		left: 0;
		font-size: 12px;
		color: #f56c6c;
	}
	.errorInput{
		.el-input__inner{
			border-color: #f56c6c!important;
		}
	}
</style>
<style lang="scss" scope>
    label {
        position: relative;
        .mask {
            position: absolute;
            top: -10px;
            left: 0;
             width: 217px;
            height: 40px;
            z-index: 1;
        }
    }

</style>
