<template>
  <div id="app">
    <!--顶部导航 -->
    <!-- 路由页面 -->
    <router-view/>
    <!-- 底部导航 -->

  </div>
</template>
<script>

export default {
  data() {
    return {
     
    }
  },
  components:{
  
  }
}
</script>

<style lang="less">
#app{
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
*{
  padding: 0;
  margin: 0;
}
body{
  margin: 0 auto;
  color: #444;
  background-color: #f7f7f7;
  font-size: 16px;
}
</style>

