<template>
  <div class="empty">
    <div class="main">
      <p>披星戴月开发中，敬请期待</p>
      <i></i>
    </div>
  </div>
</template>
<script>
import * as axios from '@/util/axios'
export default {
  name: 'emptyPage',
  created() {
    // get
    // axios.get('/queryBrandPrivileges', {params: {id: 99, name: 'aa'}, baseURL: 'http://192.168.2.8:9001/service-api'}).then(res => {
    //   console.log('in pages...', res)
    // })

    // post 失败示例
    // axios.post('/getQrCode', {brandId: 1111}).then(res => {
    //   console.log('in post api')
    //   console.log(res)
    // }).catch(err => {
    //   console.log('in err')
    //   console.log(err)
    // })

    // post 联调后端本地示例
    // axios.post('/getQrCode', {brandId: 1}, {baseURL: 'http://192.168.2.8:9001/service-api'}).then(res => {
    //   console.log('in post api')
    //   console.log(res)
    // }).catch(err => {
    //   console.log('in err')
    //   console.log(err)
    // })

    // delete 1
    // axios.del('/efe/99').then(res => {
    //   console.log(res)
    // })

    // delete 2
    // axios.del('/deleteCustomerTag', {data: {tagId: 9999999}}).then(res => {
    //   console.log(res)
    // })
  }
}
</script>
<style scoped lang="scss">
.empty {
  width: 100%;
  height: 100%;
}
.main {
  background: #fff;
  margin: 0 20px;
  min-height: 800px;
}
.main::before {
  content: '';
  display: table;
}
p {
  font-size: 20px;
  color: #999;
  text-align: center;
  margin-top: 80px;
}
i {
  display: block;
  margin: 0 auto;
  width: 478px;
  height: 355px;
  margin-top: 30px;
  background: url('../assets/images/img_developing.png') center no-repeat;
  background-size: 100% 100%;
}
</style>
