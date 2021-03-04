<template>
    <div class="classify">
        <van-search
  shape="round"
  placeholder="请输入搜索关键词"
  @focus="search"
/>
    <img src="../assets/images/zhanshi01.jpg" >
    <div class="classify-info"  ref='goods'>
        <div class="left">
    <van-sidebar v-model="activeKey" class="my-sidebar" @change='change'>
    <van-sidebar-item :title="v.typeDesc" v-for='v in classifyList' :key='v.id'/>
   </van-sidebar>
        </div>
        <div class="right">
            <div class="item" v-for='c in classifyListData' :key='c.id'>
<GoodsItem  :mode='2' :name='c.name' :tag="c.isHot?'hot':''"  :des='c.desc' :price='c.price' :img-src='c.smallImg' :to='`/goodsinfo/${c.pid}`' :pid='c.pid'></GoodsItem>
            </div>       
        </div>
    </div>
    </div>
</template>

<script>
import "../assets/less/classify.less";
import GoodsItem from "../components/GoodsItem";
export default {
  name: "Classify",
  components: {
    GoodsItem
  },
  data() {
    return {
      activeKey: 0, //默认选中的
      classifyList: [], //分类的类型
      classifyListData: [], //某种类型的数据，默认为为默认选中的数据
      // istrag: false, //是否可以拖动
      // startY: 0, //手指按下的初始位置
      // startTop: 0, //手指按下时区块的位置
      // goodsMoveDistance: 0
    };
  },
  methods: {
    // 获取商品类型
    getClaaifyData() {
      // 显示提示加载中
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      this.axios({
        method: "GET",
        url: this.baseUrl + "/type",
        params: {
          appkey: this.appkey
        }
      })
        .then(res => {
          if (res.data.code == 400) {
            this.classifyList = res.data.result;
            // 查询默认显示的分类商品
            return this.axios({
              method: "GET",
              url: this.baseUrl + "/typeProducts",
              params: {
                appkey: this.appkey,
                key: "type",
                value: this.classifyList[this.activeKey].type
              }
            });
          }
        })
        .then(res => {
          // 关闭加载提示
          this.$toast.clear();
          if (res.data.code == 500) {
            this.classifyListData = res.data.result;
          }
        })
        .catch(err => {
          // 关闭加载提示
          this.$toast.clear();
          console.log(err);
        });
    },
    search(){
      this.$router.push({name:'Search'})
    },
    // // 开始拖动
    // goodsStart(e) {
    //   this.istrag = true;
    //   this.startY = e.targetTouches[0].pageY;
    //   this.startTop = this.goodsMoveDistance;
    //   console.log(this.$refs.goods.clientHeight)
    // },
    // // 拖动
    // goodsMove(e) {
    //   if (this.istrag) {
    //     let distance = e.targetTouches[0].pageY - this.startY;
    //     this.goodsMoveDistance = this.startTop + distance;
    //     //  限制边界
    //     this.goodsMoveDistance =
    //       this.goodsMoveDistance > 0
    //         ? 0
    //         : this.goodsMoveDistance < -(this.$refs.goods.clientHeight)
    //           ? -(this.$refs.goods.clientHeight)
    //           : this.goodsMoveDistance;
    //   }
    // },
    // // 拖动结束
    // goodsEnd() {
    //   this.istrag = false;
    // },
    // 切换
    change(index) {
      // 显示提示加载中
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      this.axios({
        method: "GET",
        url: this.baseUrl + "/typeProducts",
        params: {
          appkey: this.appkey,
          key: "type",
          value: this.classifyList[index].type
        }
      })
        .then(res => {
          // 关闭加载提示
          this.$toast.clear();
          this. goodsMoveDistance=0;
          if (res.data.code == 500) {
          this.classifyListData = [];
          this.classifyListData = res.data.result;
          }
        })
        .catch(err => {
          // 关闭加载提示
          this.$toast.clear();
          console.log(err);
        });
    }
  },
  created() {
    this.getClaaifyData();
  }
};
</script>

<style lang="less" scoped>
</style>