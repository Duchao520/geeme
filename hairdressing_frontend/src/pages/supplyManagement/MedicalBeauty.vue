 <template>
  <div class="container">
    <!-- 热卖推荐 -->
    <div class="recommended">
      <div class="recommended-header">
        <img src="/static/images/market/icon_market_hot.png"/>
        <p>美丽精选</p>
      </div>
      <ListTypeOne style="margin-top:20px;" :listOne="listOne"/>
    </div>
    <div class="recommended">
      <div class="recommended-header">
        <img src="/static/images/market/icon_market_hot.png"/>
        <p>促销爆品</p>
      </div>
      <ListTypeOne style="margin-top:20px;" :listOne="listThree"/>
    </div>
    <!-- 商品筛选 -->
    <div class="productFilter">
      
      <div class="p-f-header">
        <section>
          <img src="/static/images/market/icon_market_goods.png" alt="">
          <section>商品筛选</section>
          <dropdown name="全部" :list="['已上线','未上线']"></dropdown>
          <dropdown name="洗发水" :list="['呵护型','柔顺型','强韧型']"></dropdown>
        </section>
        <div>
          <search-input :placeholder="'请输入产品名称/品类/供应商'"></search-input>
        </div>
      </div>

      <div class="p-f-body">
        <Cate :type="type" :cateList="cateList"></Cate>
        <ListTypeOne style="margin-top:20px;" :listOne="listTwo"/>
      </div>

    </div>
  </div>
</template>
<script>
import BannerList from "@/components/supplyManagement/bannerList.vue";
import dropdown from "@/components/supplyManagement/dropdown.vue";
import Cate from "@/components/supplyManagement/Cate.vue";
import ListTypeOne from "@/components/supplyManagement/ListTypeOne.vue";
import searchInput from "@/components/stock/searchInput.vue"

export default {
  components: {
    BannerList,
    dropdown,
    Cate,
    ListTypeOne,
    searchInput
  },
  data() {
    return {
      cateList: [
        { title: "品牌：", imgUrl:[
          'static/images/supply/sup_img_brand01.png',
          'static/images/supply/sup_img_brand02.png',
          'static/images/supply/sup_img_brand03.png',
          'static/images/supply/sup_img_brand04.png',
          'static/images/supply/sup_img_brand05.png'
          ]
        },
        { title: "城市：", list: ["北京", "上海", "南京"] },
        { title: "价格：", list: ["100以下", "100-500", "500-1000","1000-1500","1500-2000","2000以上"] },
        { title: "服务：", list: ["货到付款", "先销后付", "直接上线","0起订量"] }
      ],
      type: 'img',
      listOne: [
        {
          id: 1,
          image: "https://img10.360buyimg.com/n7/jfs/t22513/361/1516365647/131841/6588f142/5b629e79N5d2a9348.jpg",
          dsc: "【水光针】水光针注射护肤 强效补水美白针 锁水嫩肤",
          specialPrice: 100,
          price: 300,
          tags:['半年保价'],
          company: "杭州美立方医疗美容"
        },
        {
          id: 1,
          image: "https://img13.360buyimg.com/n7/jfs/t27655/214/1778879735/171309/5261fc1/5bee821aN300ef986.jpg",
          dsc: "【自体脂肪隆胸】胸部整形 自体脂肪填充美胸",
          specialPrice: 100,
          price: 300,
          tags:['名医专场', '赠送保险'],
          company: "杭州整形医院·国际部"
        },
        {
          id: 1,
          image: "https://img13.360buyimg.com/n7/jfs/t1/31139/12/2766/365086/5c6e13aaEa33463c9/21ac3999899e3c8d.jpg",
          dsc: "【祛妊娠纹】祛妊娠纹 孕纹 肥胖纹 产后修复 无痛修复",
          specialPrice: 600,
          price: 498,
          tags:['不满意重做'],
          company: "杭州格莱美医疗美容医院"
        },
        {
          id: 1,
          image: "https://img14.360buyimg.com/n7/jfs/t23584/24/1443308447/115193/80077cb5/5b5fd274Nebf40cc8.jpg",
          dsc: "【伊婉玻尿酸】送两次毛孔清洁 进口伊婉C玻尿酸",
          specialPrice: 1200,
          price: 988,
          tags:['正品质量', '透明诊疗'],
          company: "杭州丽星医疗美容"
        },
        {
          id: 1,
          image: "https://img12.360buyimg.com/n7/jfs/t25636/97/1910646730/103232/2c227468/5bc02d52Nae3062f4.jpg",
          dsc: "【双眼皮+祛皮去脂+开眼角+下眼下至】芭比电眼",
          specialPrice: 19800,
          price: 7800,
          tags:['半年内半价'],
          company: "深圳医美汇医疗美容门诊部"
        },
        {
          id: 1,
          image: "https://img13.360buyimg.com/n7/jfs/t26032/340/1013882073/234078/a19b6fe1/5b87b70bN488385c0.jpg",
          dsc: "【激光嫩肤】进口皮秒翠绿宝石净肤 一白遮三丑 ",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i7/T1iFQcFDJXXXXiKOoW_023743.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i2/TB1ePWFfKEJL1JjSZFG7Ri6OXXa_014025.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        }
      ],
      listTwo: [
        {
          id: 1,
          image: "https://img10.360buyimg.com/n7/jfs/t22513/361/1516365647/131841/6588f142/5b629e79N5d2a9348.jpg",
          dsc: "【水光针】水光针注射护肤 强效补水美白针 锁水嫩肤",
          specialPrice: 100,
          price: 300,
          tags:['半年保价'],
          company: "杭州美立方医疗美容"
        },
        {
          id: 1,
          image: "https://img13.360buyimg.com/n7/jfs/t27655/214/1778879735/171309/5261fc1/5bee821aN300ef986.jpg",
          dsc: "【自体脂肪隆胸】胸部整形 自体脂肪填充美胸",
          specialPrice: 100,
          price: 300,
          tags:['名医专场', '赠送保险'],
          company: "杭州整形医院·国际部"
        },
        {
          id: 1,
          image: "https://img13.360buyimg.com/n7/jfs/t1/31139/12/2766/365086/5c6e13aaEa33463c9/21ac3999899e3c8d.jpg",
          dsc: "【祛妊娠纹】祛妊娠纹 孕纹 肥胖纹 产后修复 无痛修复",
          specialPrice: 600,
          price: 498,
          tags:['不满意重做'],
          company: "杭州格莱美医疗美容医院"
        },
        {
          id: 1,
          image: "https://img14.360buyimg.com/n7/jfs/t23584/24/1443308447/115193/80077cb5/5b5fd274Nebf40cc8.jpg",
          dsc: "【伊婉玻尿酸】送两次毛孔清洁 进口伊婉C玻尿酸",
          specialPrice: 1200,
          price: 988,
          tags:['正品质量', '透明诊疗'],
          company: "杭州丽星医疗美容"
        },
        {
          id: 1,
          image: "https://img12.360buyimg.com/n7/jfs/t25636/97/1910646730/103232/2c227468/5bc02d52Nae3062f4.jpg",
          dsc: "【双眼皮+祛皮去脂+开眼角+下眼下至】芭比电眼",
          specialPrice: 19800,
          price: 7800,
          tags:['半年内半价'],
          company: "深圳医美汇医疗美容门诊部"
        },
        {
          id: 1,
          image: "https://img13.360buyimg.com/n7/jfs/t26032/340/1013882073/234078/a19b6fe1/5b87b70bN488385c0.jpg",
          dsc: "【激光嫩肤】进口皮秒翠绿宝石净肤 一白遮三丑 ",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i7/T1iFQcFDJXXXXiKOoW_023743.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i2/TB1ePWFfKEJL1JjSZFG7Ri6OXXa_014025.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        },
         {
          id: 1,
          image: "https://img12.360buyimg.com/n7/jfs/t23326/103/2390566544/224609/560c8cdf/5b7cd499N08e57f08.png",
          dsc: "玻尿酸玻璃酸破尿酸原液精华液水光针补水保湿美容院专用大瓶送喷瓶加压缩面膜",
          specialPrice: 100,
          price: 300,
          tags:['半年保价'],
          company: "杭州美立方医疗美容"
        },
        {
          id: 1,
          image: "https://img13.360buyimg.com/n7/jfs/t27655/214/1778879735/171309/5261fc1/5bee821aN300ef986.jpg",
          dsc: "【自体脂肪隆胸】胸部整形 自体脂肪填充美胸",
          specialPrice: 100,
          price: 300,
          tags:['名医专场', '赠送保险'],
          company: "杭州整形医院·国际部"
        },
        {
          id: 1,
          image: "https://img12.360buyimg.com/n7/jfs/t25636/97/1910646730/103232/2c227468/5bc02d52Nae3062f4.jpg",
          dsc: "【双眼皮+祛皮去脂+开眼角+下眼下至】芭比电眼",
          specialPrice: 19800,
          price: 7800,
          tags:['半年内半价'],
          company: "深圳医美汇医疗美容门诊部"
        },
        {
          id: 1,
          image: "https://img13.360buyimg.com/n7/jfs/t26032/340/1013882073/234078/a19b6fe1/5b87b70bN488385c0.jpg",
          dsc: "【激光嫩肤】进口皮秒翠绿宝石净肤 一白遮三丑 ",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "https://img13.360buyimg.com/n7/jfs/t1/31139/12/2766/365086/5c6e13aaEa33463c9/21ac3999899e3c8d.jpg",
          dsc: "【祛妊娠纹】祛妊娠纹 孕纹 肥胖纹 产后修复 无痛修复",
          specialPrice: 600,
          price: 498,
          tags:['不满意重做'],
          company: "杭州格莱美医疗美容医院"
        },
        {
          id: 1,
          image: "https://img14.360buyimg.com/n7/jfs/t23584/24/1443308447/115193/80077cb5/5b5fd274Nebf40cc8.jpg",
          dsc: "【伊婉玻尿酸】送两次毛孔清洁 进口伊婉C玻尿酸",
          specialPrice: 1200,
          price: 988,
          tags:['正品质量', '透明诊疗'],
          company: "杭州丽星医疗美容"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i7/T1iFQcFDJXXXXiKOoW_023743.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i2/TB1ePWFfKEJL1JjSZFG7Ri6OXXa_014025.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        }
      ],
      listThree: [
         {
          id: 1,
          image: "https://img12.360buyimg.com/n7/jfs/t23326/103/2390566544/224609/560c8cdf/5b7cd499N08e57f08.png",
          dsc: "玻尿酸玻璃酸破尿酸原液精华液水光针补水保湿美容院专用大瓶送喷瓶加压缩面膜",
          specialPrice: 100,
          price: 300,
          tags:['半年保价'],
          company: "杭州美立方医疗美容"
        },
        {
          id: 1,
          image: "https://img13.360buyimg.com/n7/jfs/t27655/214/1778879735/171309/5261fc1/5bee821aN300ef986.jpg",
          dsc: "【自体脂肪隆胸】胸部整形 自体脂肪填充美胸",
          specialPrice: 100,
          price: 300,
          tags:['名医专场', '赠送保险'],
          company: "杭州整形医院·国际部"
        },
        {
          id: 1,
          image: "https://img12.360buyimg.com/n7/jfs/t25636/97/1910646730/103232/2c227468/5bc02d52Nae3062f4.jpg",
          dsc: "【双眼皮+祛皮去脂+开眼角+下眼下至】芭比电眼",
          specialPrice: 19800,
          price: 7800,
          tags:['半年内半价'],
          company: "深圳医美汇医疗美容门诊部"
        },
        {
          id: 1,
          image: "https://img13.360buyimg.com/n7/jfs/t26032/340/1013882073/234078/a19b6fe1/5b87b70bN488385c0.jpg",
          dsc: "【激光嫩肤】进口皮秒翠绿宝石净肤 一白遮三丑 ",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "https://img13.360buyimg.com/n7/jfs/t1/31139/12/2766/365086/5c6e13aaEa33463c9/21ac3999899e3c8d.jpg",
          dsc: "【祛妊娠纹】祛妊娠纹 孕纹 肥胖纹 产后修复 无痛修复",
          specialPrice: 600,
          price: 498,
          tags:['不满意重做'],
          company: "杭州格莱美医疗美容医院"
        },
        {
          id: 1,
          image: "https://img14.360buyimg.com/n7/jfs/t23584/24/1443308447/115193/80077cb5/5b5fd274Nebf40cc8.jpg",
          dsc: "【伊婉玻尿酸】送两次毛孔清洁 进口伊婉C玻尿酸",
          specialPrice: 1200,
          price: 988,
          tags:['正品质量', '透明诊疗'],
          company: "杭州丽星医疗美容"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i7/T1iFQcFDJXXXXiKOoW_023743.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i2/TB1ePWFfKEJL1JjSZFG7Ri6OXXa_014025.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        }
      ],
      bannerList: [
        {
          id: 1,
          image: "https://img14.360buyimg.com/n7/jfs/t14491/347/1359186704/152420/42dfca43/5a4d9689N460cc4da.jpg",
          dsc: "卡诗（KERASTASE）神仙精油 新双重精油 ",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司",
          discount: '5折起购',
          btn: '订购'
        },
        {
          id: 1,
          image: "https://img10.360buyimg.com/n7/jfs/t1/17071/16/3903/348753/5c2c3717E87f18040/7bf1b4b9f21f128d.jpg",
          dsc: "沙宣洗护套装修护水养洗发水护发素",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司",
          discount: '5折起购',
          btn: '订购'
        },
        {
          id: 1,
          image: "https://img12.360buyimg.com/n7/jfs/t17557/74/1426700612/231206/8dbc8036/5acafc63Nd669d6eb.jpg",
          dsc: "沙宣洗护套装修护水养洗发水护发素",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司",
          discount: '5折起购',
          btn: '订购'
        },
        {
          id: 1,
          image: "https://img10.360buyimg.com/n2/jfs/t1/11497/38/10594/154589/5c81e33bEf1bf4472/ad7c8017327d5e0e.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司",
          discount: '5折起购',
          btn: '订购'
        }
      ],
      btnType: true,
      bannertype: 1
    };
  }
};
</script>
<style lang="scss" scoped>
    @import "@/assets/css/supply.scss";
</style>