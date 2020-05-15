 <template>
  <div class="collect-container">
    <el-radio-group class="btn-group" v-model="componentId">
        <el-radio-button
          v-for="(item,index) in staffTypes"
          :key="index"
          :label="item.type">{{item.name}}</el-radio-button>
    </el-radio-group>
    <div>
      <ListTypeOne style="margin-top:20px;" :listOne="listOne"/>
    </div>
  </div>
</template>
<script>
import ListTypeOne from "@/components/supplyManagement/ListTypeOne.vue";
export default {
  components: {
    ListTypeOne,
  },
  data() {
    return {
      listOne: [
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i5/TB1iGN5fRoHL1JjSZFwFAz6vpXa_115648.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i1/TB1YUlYfFcJL1JjSZFO7xAWlXXa_120143.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i7/TB10bRufoF7MKJjSZFLRVAMBVXa_115921.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i3/T12Z_7Fy4cXXczBEsT_013314.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i2/TB1FYxzmpOWBuNjy0FirG4FxVXa_044620.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i5/TB1LbXBLVXXXXXLXXXXwfUe9XXX_035950.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
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
          image: "//img.alicdn.com/bao/uploaded/i6/TB1rdC6GXXXXXXZXXXXymsM.XXX_101730.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i7/TB19Q7ZFFXXXXcJapXXeNM0.FXX_110712.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i2/TB1.4.Ud_XYBeNkHFrd6coiuVXa_051530.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i2/TB1yNFhOpXXXXczXpXXZxee8VXX_031711.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i5/TB1viGQFVXXXXXjXFXXToel8VXX_032052.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i3/TB114o7mkKWBuNjy1zjta7OypXa_051200.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i1/TB1Ij50mCtYBeNjSspkPRjU8VXa_050931.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        },
        {
          id: 1,
          image: "//img.alicdn.com/bao/uploaded/i4/TB1ZMNxFVXXXXb9XXXXlbtJ7VXX_014001.jpg",
          dsc: "欧芭oba二代陶醉香草香型滋养修护受损洗发乳",
          specialPrice: 100,
          price: 300,tags:['五折起购'],
          company: "欧芭化妆品(厦门)有限公司"
        }
      ],
      componentId: 'HairCare',
      staffTypes: [
        { name: "美发用品", type: "HairCare" },
        { name: "精品课程", type: "ExcellentCourse" },
        { name: "医美整形", type: "MedicalBeauty" },
        { name: "及美优选", type: "GeemeShop" },
        { name: "同城服务", type: "CityService" }
      ],
    };
  }
};
</script>
<style lang="scss" scoped>
  .collect-container{
    padding: 20px;
  }
</style>
