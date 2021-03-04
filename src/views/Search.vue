<template>
    <div class="search">
    <van-search
    v-model="keyWord"
    show-action
    placeholder="请输入搜索关键词"
    @cancel="back"
    @search="search"
    ref='search'
  />
  <!-- <div class="my-tabs">
  <van-tabs v-model="active">
  <van-tab title="标签 1">内容 1</van-tab>
  <van-tab title="标签 2">内容 2</van-tab>
  <van-tab title="标签 3">内容 3</van-tab>
  </van-tabs>
  </div> -->
  <div class="result-box" v-if='searchResult!=0'>
     <GoodsItem  :mode='2' :name='c.name' :tag="c.isHot?'hot':''"  :des='c.enname' :price='c.price' :img-src='c.smallImg' :to='`/goodsinfo/${c.pid}`' v-for='(c,k) in searchResult' :key='k' class="my-goods"></GoodsItem>
  </div>
  <van-empty :image="require('../assets/images/search.png')" description="没有搜索结果" v-if='isSou && searchResult==0'/>
    </div>
</template>

<script>
import "../assets/less/search.less";
import GoodsItem from '../components/GoodsItem'
export default {
  data() {
    return {
      keyWord: "", //搜索关键字
      active:0,
      searchResult:[],//搜索结果
      isSou:false,
    };
  },
  components:{
      GoodsItem
  },
  methods: {
    back() {
      this.$router.back();
    },
    search(value){
         // 显示提示加载中
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      //  发起请求
      this.axios({
        method: "GET",
        url: this.baseUrl + "/search",
        params: {
          appkey: this.appkey,
          name: value
        }
      })
        .then(res => {
          // 关闭加载中
           this.$toast.clear();
          if (res.data.code === 'Q001') {
              this.searchResult=res.data.result;
              this.isSou=true;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  mounted() {
    // 自动触焦
    this.$refs.search.querySelector("input").focus();
  },
  created() {}
};
</script>