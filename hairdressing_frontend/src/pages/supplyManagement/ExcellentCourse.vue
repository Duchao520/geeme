 <template>
  <div class="container">
    <!-- 热卖推荐 -->
    <div class="recommended">
      <div class="recommended-header">
        <img src="/static/images/market/icon_market_hot.png"/>
        <p>最新推荐</p>
      </div>
      <BannerList :bannertype="bannertype" :btnType="btnType" :bannerList="bannerList"></BannerList>
    </div>
    <!-- 商品筛选 -->
    <div class="productFilter">
      <div class="p-f-header">
        <section>
          <img src="/static/images/market/icon_market_goods.png" alt="">
          <section>课程筛选</section>
          <dropdown name="全部" :list="['已上线','未上线']"></dropdown>
          <dropdown name="洗发水" :list="['呵护型','柔顺型','强韧型']"></dropdown>
        </section>
        <div>
         <search-input :placeholder="'请输入产品名称/品类/供应商'"></search-input>
        </div>
      </div>

      <div class="p-f-body">
        <Cate :type="type" :cateList="cateList"></Cate>
        <ListTypeTwo style="margin-top:20px;" :listOne="listOne"/>
      </div>
    </div>
  </div>
</template>
<script>
import BannerList from "@/components/supplyManagement/bannerList.vue";
import dropdown from "@/components/supplyManagement/dropdown.vue";
import Cate from "@/components/supplyManagement/Cate.vue";
import ListTypeTwo from "@/components/supplyManagement/ListTypeTwo.vue";
import searchInput from "@/components/stock/searchInput.vue"

export default {
  components: {
    BannerList,
    dropdown,
    Cate,
    ListTypeTwo,
    searchInput
  },
  data() {
    return {
       bannerList: [
        {
          id: 1,
          image: require('@/assets/images/supply/sevman01.png'),
          title: "发型师的自我修炼",
          specialPrice: 168,
          price: 1988,
          motto: "金牌课程  50000人倾情推荐",
          discount: '12节课',
          online: true,
          info: 'Gary  上海戴柏美发学院'
        },
        {
          id: 1,
          image: require('@/assets/images/supply/sevman02.png'),
          title: "钻石修剪系统课程",
          specialPrice: 1288,
          price: 6980,
          motto: "风行20年，经典的才是最好",
          discount: '五天四晚',
          online: false,
          info: '吴伟  杭州维卡博美发学院'
        },
        {
          id: 1,
          image: require('@/assets/images/supply/sevman03.png'),
          title: "钻石修剪系统课程",
          specialPrice: 100,
          price: 300,
          motto: "欧芭化妆品(厦门)有限公司",
          discount: '12节课',
          online: true,
          info: 'Tom  上海戴柏美发学院'
        },
        {
          id: 1,
          image: require('@/assets/images/supply/sevman04.png'),
          title: "发型师的自我修炼",
          specialPrice: 100,
          price: 300,
          motto: "风行20年，经典的才是最好",
          discount: '五天四晚',
          online: false,
          info: 'Gary  上海戴柏美发学院'
        }
      ],
      cateList: [
        {
          title: "品牌：", imgUrl:[
          'static/images/supply/sup_img_brand01.png',
          'static/images/supply/sup_img_brand02.png',
          'static/images/supply/sup_img_brand03.png',
          'static/images/supply/sup_img_brand04.png',
          'static/images/supply/sup_img_brand05.png'
          ]
        },
        { title: "城市：", list: ["北京", "上海", "南京"] },
        { title: "价格：", list: ["100以下", "100-500", "500-1000","1000-1500","1500-2000","2000以上"] },
        { title: "服务：", list: ["透明消费", "绝不推销", "消费返佣","五星好评", '0元领取'] }
      ],
      listOne: [
        {
          id: 1,
          image: require('@/assets/images/supply/sevman06.png'),
          title: "发型师的自我修炼",
          specialPrice: 168,
          price: 1988,
          motto: "金牌课程  50000人倾情推荐",
          discount: '12节课',
          online: true,
          info: 'Gary  上海戴柏美发学院'
        },
         {
          id: 1,
          image: require('@/assets/images/supply/sevman07.png'),
          title: "发型师的自我修炼",
          specialPrice: 168,
          price: 1988,
          motto: "金牌课程  50000人倾情推荐",
          discount: '12节课',
          online: true,
          info: 'Gary  上海戴柏美发学院'
        },
        {
          id: 1,
          image: require('@/assets/images/supply/sevman08.png'),
          title: "发型师的自我修炼",
          specialPrice: 168,
          price: 1988,
          motto: "金牌课程  50000人倾情推荐",
          discount: '12节课',
          online: true,
          info: 'Gary  上海戴柏美发学院'
        },
         {
          id: 1,
          image: require('@/assets/images/supply/sevman09.png'),
          title: "发型师的自我修炼",
          specialPrice: 168,
          price: 1988,
          motto: "金牌课程  50000人倾情推荐",
          discount: '12节课',
          online: true,
          info: 'Gary  上海戴柏美发学院'
        },
        {
          id: 1,
          image: require('@/assets/images/supply/sevman10.png'),
          title: "发型师的自我修炼",
          specialPrice: 168,
          price: 1988,
          motto: "金牌课程  50000人倾情推荐",
          discount: '12节课',
          online: true,
          info: 'Gary  上海戴柏美发学院'
        },
         {
          id: 1,
          image: require('@/assets/images/supply/sevman11.png'),
          title: "发型师的自我修炼",
          specialPrice: 168,
          price: 1988,
          motto: "金牌课程  50000人倾情推荐",
          discount: '12节课',
          online: true,
          info: 'Gary  上海戴柏美发学院'
        },
        {
          id: 1,
          image: require('@/assets/images/supply/sevman12.png'),
          title: "发型师的自我修炼",
          specialPrice: 168,
          price: 1988,
          motto: "金牌课程  50000人倾情推荐",
          discount: '12节课',
          online: true,
          info: 'Gary  上海戴柏美发学院'
        },
         {
          id: 1,
          image: require('@/assets/images/supply/sevman13.png'),
          title: "发型师的自我修炼",
          specialPrice: 168,
          price: 1988,
          motto: "金牌课程  50000人倾情推荐",
          discount: '12节课',
          online: true,
          info: 'Gary  上海戴柏美发学院'
        },
        {
          id: 1,
          image: require('@/assets/images/supply/sevman14.png'),
          title: "发型师的自我修炼",
          specialPrice: 168,
          price: 1988,
          motto: "金牌课程  50000人倾情推荐",
          discount: '12节课',
          online: true,
          info: 'Gary  上海戴柏美发学院'
        },
         {
          id: 1,
          image: require('@/assets/images/supply/sevman15.png'),
          title: "发型师的自我修炼",
          specialPrice: 168,
          price: 1988,
          motto: "金牌课程  50000人倾情推荐",
          discount: '12节课',
          online: true,
          info: 'Gary  上海戴柏美发学院'
        },
        {
          id: 1,
          image: require('@/assets/images/supply/sevman16.png'),
          title: "发型师的自我修炼",
          specialPrice: 168,
          price: 1988,
          motto: "金牌课程  50000人倾情推荐",
          discount: '12节课',
          online: true,
          info: 'Gary  上海戴柏美发学院'
        }
      ],
      btnType: true,
      bannertype: 2,
      type: 'img'
    };
  }
};
</script>
<style lang="scss" scoped>
  @import "@/assets/css/supply.scss";
</style>