<template>
    <div class="add-address">
         <van-nav-bar
  :title="$route.params.aid?'编辑收货地址':'新增收货地址'"
  left-arrow
  fixed
  placeholder
  class="my-nav"
  @click-left="back"
/>
<van-address-edit
  :area-list="areaList"
  show-postal
  show-set-default
  :show-delete='!!$route.params.aid'
  :area-columns-placeholder="['请选择', '请选择', '请选择']"
  :address-info='addressInitData'
  @save="onSave"
  @delete='onDelete'
  class="my-address"
/>
    </div>
</template>

<script>
import areaList from "../assets/js/areaList";
export default {
  name: "AddAddress",
  data() {
    return {
      areaList,
       addressInitData:{},//收货人信息初始值
    };
  },
  methods: {
      back(){
          this.$router.back();
      },
    //   保存地址
    onSave(content) {
      let tokenString = this.$cookies.get("tokenString");
      // 判断用户是否登录
      if (!tokenString) {
        this.$toast("请先登录");
        return this.$router.push("/login");
      }
      let data={
           appkey: this.appkey,
          tokenString: tokenString,
          ...content
      };
      data.isDefault=Number(data.isDefault);
         //   删除多余的字段
      delete data.country;
      let url='/addAddress';
      if(this.$route.params.aid){
        url='/editAddress';
      }
      // 显示提示加载中
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      //   发起保存地址请求
      this.axios({
        method: "POST",
        url: this.baseUrl +url,
        data
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
          //  添加保存成功
          if (res.data.code == 9000) {
            //   返回
           this.$router.back();
          }
          // 修改保存成功
            if (res.data.code == 30000) {
            //   返回
           this.$router.back();
          }
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 1000
            });
         
        })
        .catch(err => {
          //   关闭加载提示
          this.$toast.clear();
          console.log(err);
        });
    },
     // 获取收货人信息初始值
    getInitData(){
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
      //   发起查询当前地址信息请求
      this.axios({
        method: "GET",
        url: this.baseUrl + "/findAddressByAid",
        params:{
          appkey: this.appkey,
          tokenString: tokenString,
          aid:this.$route.params.aid
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
          if (res.data.code == 40000) {
            let data=res.data.result[0];
            data.isDefault = !!data.isDefault;
            this.addressInitData=data;
          } 
        })
        .catch(err => {
          //   关闭加载提示
          this.$toast.clear();
          console.log(err);
        });
    },
    // 删除地址
    onDelete(){
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
      //   发起删除当前地址信息请求
      this.axios({
        method: "POST",
        url: this.baseUrl + "/deleteAddress",
        data:{
          appkey: this.appkey,
          tokenString: tokenString,
          aid:this.$route.params.aid
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
          //   删除成功
          if (res.data.code == 10000) {
           this.$router.back();
          }
          this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 1000
            }); 
        })
        .catch(err => {
          //   关闭加载提示
          this.$toast.clear();
          console.log(err);
        });
    }
  },
  created() {
    console.log(this.$route.params.aid);
    if(this.$route.params.aid){
      this.getInitData();
    }
  },
};
</script>

<style lang="less" scoped>
.add-address {
  .my-nav {
    /deep/.van-icon {
      color: #000;
    }
  }
  .my-address{
    /deep/.van-switch--on{
        background: #6d411e;
    }
    /deep/.van-button--danger{
       background: #6d411e;
       border-color: #6d411e;
    }
  }
}
</style>