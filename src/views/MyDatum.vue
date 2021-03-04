<template>
    <div class="mydatum">
    <van-nav-bar
  title="我的资料"
  left-arrow
  fixed
  placeholder
  @click-left="back"
  class="my-nav"
/>
 <div class="user-datum">
             <van-cell :title="v.title"  color='#e94d5f' size='14' class="my-cell" v-for='(v,k) in list' :key='k'  :value='v.value'> 
                 <template #default v-if='v.imgSrc'>
                     <img :src="v.imgSrc" alt="" class="my-touxiang">
                 </template>
             </van-cell>
        </div>
    </div>
</template>

<script>
import "../assets/less/mydatum.less";
export default {
  name: "MyDatum",
  data() {
    return {
     userInfo:{},
    };
  },
  computed:{
      list(){
          return  [
        { title: "用户头像", imgSrc: this.userInfo.userImg},
        { title: "用户ID", value:this.userInfo.userId},
        { title: "用户昵称", value:this.userInfo.nickName},
        { title: "用户手机号码", value:this.userInfo.phone},
        { title: "简介", value: this.userInfo.desc?this.userInfo.desc:'这个人很懒，什么也没留下'}
      ]
      },
  },
  methods: {
    back() {
      this.$router.back();
    },
    //获取用户资料
    getUserInfo() {
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
      //   发起获取用户资料请求
      this.axios({
        method: "GET",
        url: this.baseUrl + "/findAccountInfo",
        params: {
          appkey: this.appkey,
          tokenString: tokenString
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
          console.log(res);
          if (res.data.code == 'B001') {
            this.userInfo=res.data.result[0];
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
    this.getUserInfo();
  }
};
</script>