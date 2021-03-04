<template>
    <div class="top-nav">
        <van-nav-bar fixed placeholder>
        <template #left>
         <van-search shape='round' placeholder="请输入搜索关键词" @focus='search'/>
       </template>
          <template #right>
           <div v-if='user'>
          <span class="tic">{{getTime()}}</span>
          <span class="name">{{name|frmateName}}</span>
          </div>
          <router-link tag='span' class="login-btn" v-if='!user' to='/login'>登录</router-link>
       </template>
        </van-nav-bar>
    </div>
</template>

<script>
export default {
  name: "TopNav",
  props:{
      name:String
  },
  filters: {
    frmateName(value) {
      return value.substr(0, 7);      
    }
  },
  data() {
      return {
        
      }
  },
  methods: {
    //   获取当前时间显示不同的提示
      getTime(){
          let now=new Date();
          let hour=now.getHours();
          let str=hour>6?hour>12?hour>18?'晚上好!':'下午好!':'早上好!':'深夜好!';
          return str;
      },
      search(){
          this.$router.push({name:'Search'})
      }
  },
  computed:{
      user(){
          return this.$cookies.get('tokenString');
      }
  },
};
</script>

<style lang="less" scoped>
.top-nav {
    .van-search{
        padding: 0;
    }
  .tic {
    margin-right: 3px;
    font-size: 14px;
    color: #444444;
  }
  .name {
    font-size: 16px;
    color: #c99065;
  }
  .login-btn{
       font-size: 16px;
       color: #c99065;
  }
}
</style>