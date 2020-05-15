<template lang="pug">
#gm_appo_index
  // 预约日历页
  sub-header(
    v-if="routername === 'appotime'",
    :third="'快速预约'",
    @toSuper="toAppoAdd"
    :list="list",
    :selectlist="staffLevelList",
    :selectname="'请选择职务'",
    @select="selectChange",
    :selectId="currentInfo.appoLevelId"
  )
  // 预约列表页
  sub-header(
    v-if="routername === 'appolist'",
    :third="'快速预约'",
    @toSuper="toAppoAdd"
    :selectlist="staffLevelList",
    :sname="'预约人手机号/姓名'",
    @search="search"
  )
  <router-view></router-view>
</div>
</template>

<script>
import "@/assets/css/base.scss"
import SubHeader from '@/components/common/SubHeader'
import { mapActions, mapState } from 'vuex'
import * as api from '@/assets/js/interface'
import * as axios from '@/util/axios';
export default {
  name:'GmAppoIndex',
  data() {
    return {
      routername: null, // 根据路由名称做头部
      dialogFormVisible:false,
      staffLevelList: [{
        id: null,
        name: '全部' // 默认选择为全部
      }],
      form:{
        phone:'',
        name:'',
        shop:'',
        date:'',
        time:'',
        desc:'',
        service:[
          {name:'',person:''}
        ]
      },
      formLabelWidth:'150px',
      rules:{
        phone:[{required:true, message:'请输入用户手机号码',trigger:'blur'}],
        name:[{required:true, message:'请输入到店人姓名',trigger:'blur'}],
        shop:[{required:true, message:'请选择门店',trigger:'blur'}],
        date:[{required:true, message:'请选择日期',trigger:'blur'}],
        time:[{required:true, message:'请选择时间',trigger:'blur'}],
        service:[{required:true, message:'请选择服务',trigger:'blur'}]
      },
      list: [ // 头部显示列表
        {
          name: '待服务',
          dot: 'lan'
        }, {
          name: '已开单',
          dot: 'lu'
        }, {
          name: '未分配',
          dot: 'huang'
        }, {
          name: '已超时',
          dot: 'hei'
        }, {
          name: '已占用',
          dot: 'hui'
        }
      ],
    };
  },
  watch: {
    $route(val) {
      // 路由的判断，是否显示右边的列表
      this.showRouterList()
      // 清理存储的职级 orz
      this.init()
    }
  },
  components: {
    'sub-header': SubHeader
  },
  computed: {
    currentInfo() {
      return this.$store.state.manage.currentInfo
    }
  },
  mounted(){
    // 路由的判断，是否显示右边的列表
    this.showRouterList()
    this.init()
    // 获取员工职级列表
    axios.get(api.getStaffLevelListByStoreId.URL + this.currentInfo.shopId).then(res => {
      this.getStaffLevelListRes(res);
    })
  },
  methods: {
    ...mapActions([
      'saveCurrentInfo', 
      'saveOperate', 
      'setAppoEntry'
    ]),
    init() {
      // 清理存储的职级 orz
      this.saveCurrentInfo({
        appoLevelId: ''
      })
    },
    // 处理职级列表
    getStaffLevelListRes(res) {
      this.staffLevelList = res.staffLevelList
    },
    // 下拉列表
    selectChange(data) {
      this.saveCurrentInfo({
        appoLevelId: data
      })
    },
    // 搜索
    search(data) {
      this.$root.$emit('searchValue',data);
      console.log(data)
    },
    // 路由的判断，是否显示右边的列表
    showRouterList() {
      if (this.$router.currentRoute.path === '/shop-inner/appo/appo-time') {
        this.routername = 'appotime'
      } else if (this.$router.currentRoute.path === '/shop-inner/appo/appo-list'){
        this.routername = 'appolist'
      }
    },
    // 新增服务
    // addNewService(){
    //   this.form.service.push({
    //       name:'' ,
    //       person:''
    //    })
    // },
    // 删除服务
    // removeService(key){
    //   console.log(key)
    //   this.form.service.splice(key, 1);
    // },
    // 提交表单验证
    // submitForm(formName) {
    //   this.$refs[formName].validate((valid) => {
    //     if (valid) {
    //       alert('submit!');
    //     } else {
    //       console.log('error submit!!');
    //       return false;
    //     }
    //   });
    // },
    // toAppoAdd
    toAppoAdd(){
      this.saveOperate({clickEnter: 'add'})  // 旧的预约统一存储，manage [待删除]
      this.setAppoEntry('add') // 新的独立入口
      this.$router.push('/shop-inner/appo-addnew')
    }
  }
}
</script>
<style lang="scss">
  #gm_appo_index .el-date-editor.el-input{
    width: 49%;
    max-width:196px;
  }
</style>

<style lang="scss" scoped>
    #gm_appo_index{
        // margin-left: 20px;
        // margin-right: 40px;
        .service_item i{
          font-size:18px;
          color:#E22C37;
          margin-left:20px;
        }
        .service_item+.service_item{
          margin-top:10px;
        }
    }
</style>


