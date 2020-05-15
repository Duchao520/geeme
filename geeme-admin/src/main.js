import store from './store'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/directive/permission'

// 组件引入
import FullPage from '@/components/fullPage'
import NavBar from '@/components/navBar'
import TypeSelect from '@/components/typeSelect'
import PhotoFrame from '@/components/photoFrame'
import UploadPic from '@/components/upload'
import FormItem from '@/components/formItem'
import FormLine from '@/components/formLine'
import NumInput from '@/components/numInput'
import OptButton from '@/components/optButton'
import DetailItem from '@/components/detailItem'
import NormalInput from '@/components/normalInput'
import BorderContent from '@/components/borderContent'
import StatusTag from '@/components/statusTag'
import Image from '@/components/image'
import TextareaWhitCount from '@/components/textareaWhitCount'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import {
  Col, Row, Button, message,
  Tree, Icon, Checkbox, Input,
  Modal, Avatar, Form, Upload,
  Select, DatePicker, Radio, Spin,
  Table, Pagination, Switch, LocaleProvider,Popover,
  Alert,InputNumber
} from 'ant-design-vue'
Vue.use(Form)
Vue.component(Popover.name, Popover)
Vue.component(LocaleProvider.name, LocaleProvider)
Vue.component(Col.name, Col)
Vue.component(Row.name, Row)
Vue.component(Button.name, Button)
Vue.component(Button.Group.name, Button.Group)
Vue.component(Tree.name, Tree)
Vue.component(Icon.name, Icon)
Vue.component(Checkbox.name, Checkbox)
Vue.component(Checkbox.Group.name, Checkbox.Group)
Vue.component(Input.name, Input)
Vue.component(Input.TextArea.name, Input.TextArea)
Vue.component(Input.Search.name, Input.Search)
Vue.component(InputNumber.name, InputNumber)
Vue.component(Modal.name, Modal)
Vue.component(Avatar.name, Avatar)
Vue.component(Form.name, Form)
Vue.component(Form.Item.name, Form.Item)
Vue.component(Upload.name, Upload)
Vue.component(Select.name, Select)
Vue.component(Select.Option.name, Select.Option)
Vue.component(DatePicker.name, DatePicker)
Vue.component(DatePicker.RangePicker.name, DatePicker.RangePicker)
Vue.component(Radio.name, Radio)
Vue.component(Radio.Group.name, Radio.Group)
Vue.component(Spin.name, Spin)
Vue.component(Table.name, Table)
Vue.component(Table.Column.name, Table.Column)
Vue.component(Pagination.name, Pagination)
Vue.component(Switch.name, Switch)
Vue.component(Alert.name, Alert)
message.config({
  duration: 1,
  maxCount: 3,
})
Vue.prototype.$message = message
Vue.prototype.$confirm = Modal.confirm
Vue.prototype.$warning = Modal.warning
// 自定义组件
// 全页组件
Vue.component('G-FullPage', FullPage)
Vue.component('G-NavBar', NavBar)
Vue.component('G-TypeSelect', TypeSelect)
Vue.component('G-PhotoFrame', PhotoFrame)
Vue.component('G-Upload-Pic', UploadPic)
Vue.component('G-Form-Item', FormItem)
Vue.component('G-Form-Line', FormLine)
Vue.component('G-NumInput', NumInput)
Vue.component('G-OptButton', OptButton)
Vue.component('G-Detail-Item', DetailItem)
Vue.component('G-Normal-Input', NormalInput)
Vue.component('G-Border-Content', BorderContent)
Vue.component('G-Status-Tag', StatusTag)
Vue.component('G-Image', Image)
Vue.component('G-TextareaWhitCount', TextareaWhitCount)



import '@/assets/styles/reset.less'
import '@/assets/styles/button.less'
import '@/assets/styles/tags.less'
import '@/assets/iconfont/iconfont.css'

Vue.config.productionTip = false

const vm = new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

window.vm = vm

export default vm
