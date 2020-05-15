<template>
  <div>
    <div id="map_container" style="width:500px;height:300px;"></div>
  </div>
</template>

<script>
import axios from 'axios'
import AMap from 'AMap'
import * as utils from '@/assets/js/utils'
var map,marker;
export default {
    props: {
      addressDetail: {
        type: String,
        default: ''
      },
      detail: String,
      needPos: Boolean, // 是否需要定位，用来判断mounted的时候是否执行定位
      disabled: Boolean
    },
   data () {
    return {
      mapInfo:{
        lng:'',
        lat:'',
        //detail:'',
        area: '',
        city: '',
        province: ''
      }
    }
  },
  watch: {
    addressDetail(n ,o) {
      if (n !== o && !!n) {
        // 根据用户输入的地址获取当前的经纬度信息
        this.getLngAndLat(n)
      }
      
    }
  },
  computed: {
    operateEnter() {
      return this.$store.state.manage.operate
    }
  },
  mounted(){
    this.amapView()
  },
  /* updated() {
    this.getLngAndLat(this.addressDetail)
  }, */
  methods:{
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
      if(!this.disabled) {
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
      let _addr = addressComponent.province + addressComponent.city + addressComponent.district
      // 改变mapInfo
      this.mapInfo = {
        lng: position.lng,
        lat: position.lat,
        area: addressComponent.district, // 地区
        city: addressComponent.city, // 城市
        province: addressComponent.province, // 省份
        detail: utils.matchReplace(data.formattedAddress, _addr, 'g', '')
      }
      // 向父组件传值
      this.$emit('getMapValue', this.mapInfo)
      //
      this.addMarker(position.lng, position.lat, data.formattedAddress)
    },
    // 点击地图获取当前经纬度
    showInfoClick(){
      let that = this
      AMap.event.addListener(map,'click',function (e) {
        // 将经纬度赋值给map
        that.mapInfo.lng = e.lnglat.getLng()
        that.mapInfo.lat = e.lnglat.getLat()
        that.getAddress(e.lnglat.getLng(),e.lnglat.getLat())
      })
    },
    // 根据用户输入的地址获取当前的经纬度信息
    getLngAndLat(address) {
      let that = this
      axios.get(`//restapi.amap.com/v3/geocode/geo?key=5b638921d27c314409a6f6a47dc22838&s=rsv3&city=35&address=${address}`)
      .then(function (res) {
        if(res.status == 200){
          let geocodes = res.data.geocodes
          if(!!geocodes){
            console.log(geocodes[0].district+ '11111111111111111')
            let areaDetails
            if(geocodes[0].province == geocodes[0].city) { //市辖区
              areaDetails = geocodes[0].province + geocodes[0].district
            } else {
              areaDetails = geocodes[0].province + geocodes[0].city + geocodes[0].district
            }
            if (areaDetails == geocodes[0].formatted_address) { //
              that.mapInfo.isNoDetails = true
            } else {
              that.mapInfo.isNoDetails = false
            }
            let location = geocodes[0].location.split(',')
            // that.mapInfo.detail = geocodes[0].formatted_address
            let area = geocodes[0].district;
            that.mapInfo.area = area // 地区
            that.mapInfo.city = geocodes[0].city // 城市
            that.mapInfo.province = geocodes[0].province // 省份
            that.mapInfo.detail = that.detail // 详细地址
            that.mapInfo.type = 1
            // 向父组件传值
            that.$emit('getMapValue', that.mapInfo)
            //
            map.setCenter([location[0],location[1]]); //设置地图中心点
            that.addMarker(location[0],location[1],address)
          }
        }
      })
      .catch(function (error) {
        console.log(error);
      })
    },
    // 根据经纬度获取当前地址信息
    getAddress(lng,lat){
      let that = this
      axios.get('//restapi.amap.com/v3/geocode/regeo?key=f211857599047852b425815b7d4a29e7&location='+lng+','+lat+'&radius=1000&extensions=all&batch=false&roadlevel=0')
      .then(function (res) {
        if(res.status == 200){
          console.log(res.data + '22222222222')
          if(res.data.regeocode.formatted_address){
            let formatted_address = res.data.regeocode.formatted_address
            let area = res.data.regeocode.addressComponent.district
            let city = res.data.regeocode.addressComponent.city
            let province = res.data.regeocode.addressComponent.province
            let _addr = province + city + area
            that.mapInfo.detail = utils.matchReplace(formatted_address, _addr, 'g', '')
            that.mapInfo.area = area // 地区
            that.mapInfo.city = city // 城市
            that.mapInfo.province = province // 省份
            that.mapInfo.type = 2
            // 向父组件传值
            that.$emit('getMapValue', that.mapInfo)
            //
            that.addMarker(lng,lat,formatted_address)
          }
        }
      })
      .catch(function (error) {
        console.log(error);
      })
    },
    // 根据区名来在地图上定位当前城市
    gotoCity(cityValue){
      map.setCity(cityValue);
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
    }
  }
}
</script>

<style lang='scss'>
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

</style>


