 <template>
  <div class="org-auth" v-loading="loading">
    <div class="left-box">
      <role-list 
        :brands="brandRole"
        :shops="shopRole"
      >
      </role-list>
    </div>
    <div class="right-box">
      <auth-tree @loadingStatusEvent="loadingStatus"></auth-tree>
    </div>
  </div>
</template>
 
<script>
import * as axios from '@/util/axios'
import * as api from '@/assets/js/interface'
import * as utils from '@/assets/js/utils'
import roleList from "./roleList.vue"
import authTree from "./authTree.vue"
export default {
  name: "org-auth",
  components: { roleList, authTree },
  data() {
    return {
      brandRole: [],
      shopRole: [],
      loading: false,
    };
  },
  computed: {
  },
  created() {
    this.init()
  },
  methods: {
    init(){
      this.loadingStatus(true)
      axios.get(`${SERVICE_URL}/service-api/getAllRoles`).then(res => {
        this.loadingStatus(false)
        res.roleInfo.forEach(item => {
          if (item.roleTypeName === '总部') {
            this.brandRole = item.roles
          } else {          
            this.shopRole = item.roles
          }
        })
      })
    },
    loadingStatus(type) {
      this.loading = type
    }
  }
};
</script>
 
<style scoped lang='scss'>
.org-auth {
  display: flex;
  padding: 0 20px 30px 30px;
  .left-box {
    margin: 0 20px 0 0;
  }
  .right-box {
    flex-grow: 1;
    width: calc(100% - 383px)
  }
}
</style>
 