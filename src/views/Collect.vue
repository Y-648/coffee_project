<template>
    <div class="collect">
<van-nav-bar
  title="我的收藏"
  left-arrow
  @click-left="back"
  class="mynav"
/>
<div class="content" v-if='collectData.length!=0'>
    <van-grid :border="false" :column-num="2" :gutter='10'>
  <van-grid-item v-for='v in collectData' :key='v.pid'>
    <GoodsItem :img-src='v.smallImg' :name='v.name' :price='v.price' :des='v.enname' :tag="v.isHot?'hot':''" :is-collect='true' :to="`/goodsinfo/${v.pid}`" @delete='deleteCollect(v.pid)'></GoodsItem>
  </van-grid-item>
</van-grid>
</div>
<van-empty description="你还未收藏任何商品" :image="require('../assets/images/collect.png')" v-else/>
    </div>
</template>

<script>
import GoodsItem from "../components/GoodsItem";
export default {
  data() {
    return {
        collectData:[]//收藏的商品
    };
  },
  components: {
    GoodsItem
  },
  methods: {
    back() {
      this.$router.back();
    },
    // 获取收藏的数据
    getCollectData(){
       let tokenString = this.$cookies.get("tokenString");
      // 判断用户是否登录
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }
      // 显示提示加载中
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      this.axios({
        method: "GET",
        url: this.baseUrl + "/findAllLike",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(res => {
          // 关闭加载提示
          this.$toast.clear();
          //  没有登录
          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000
            });
            return this.$router.push({ name: "Login" });
          }
          if (res.data.code == 2000) {
            this.collectData=res.data.result;
          }
        })
        .catch(err => {
          // 关闭加载提示
          this.$toast.clear();
          console.log(err);
        });
    },
    // 删除收藏
    deleteCollect(id){
     let tokenString = this.$cookies.get("tokenString");
      // 判断用户是否登录
      if (!tokenString) {
        this.$toast("请先登录");
        return this.$router.push("/login");
      }
      // 显示提示加载中
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      //   发起取消收藏请求
      this.axios({
        method: "POST",
        url: this.baseUrl + "/notlike",
        data: {
          appkey: this.appkey,
          tokenString: tokenString,
          pid: id
        }
      })
        .then(res => {
          //   关闭加载提示
          this.$toast.clear();
          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000
            });
            return this.$router.push("/login");
          }
          //   查询成功
          if (res.data.code == 900) {
            //取消收藏成功
            if (res.data.result === 1) {
              this.collectData = this.collectData.filter(v=>v.pid!=id);
            }
          } else {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000
            });
          }
        })
        .catch(err => {
          //   关闭加载提示
          this.$toast.clear();
          console.log(err);
        });
    }
  },
  created() {
      this.getCollectData();
  },
};
</script>

<style lang="less" scoped>
.collect {
  .mynav {
    /deep/.van-icon {
      color: #000;
    }
  }
  .content{
      margin-top: 10px;
  }
}
</style>