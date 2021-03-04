<template>
    <div class="setting">
        <van-nav-bar
  title="设置"
  left-arrow
  fixed
  placeholder
  @click-left="back"
  class="my-nav"
/>
<div class="content">
      <van-cell title="修改密码" :icon="require('../assets/images/passEdit.png')" is-link color='#e94d5f' size='18' class="my-cell" @click='showEdit'/> 
      <van-cell title="注销账户" :icon="require('../assets/images/esc.png')" is-link color='#e94d5f' size='18' class="my-cell" @click='cancel'/> 
</div>
         <van-popup
            v-model="isShow"
            closeable
            position="bottom"
            close-on-popstate
            :style="{ height: '40%' }"
           >
           <div class="edit-box">
              <div class="title">修改密码</div>
             <div class="inp-item">
            <van-field v-model="oldPass" placeholder="请输入原密码" class="my-inp"  label="旧密码" :type="isShowOldPass?'text':'password'"/>
              <van-icon :name="isShowOldPass?'eye-o':'closed-eye'" size="18"  color='#000' @click="showOldPass"/>
            </div>
             <div class="inp-item">
            <van-field v-model="newPass" placeholder="请输入新密码" class="my-inp" label="新密码" :type="isShowNewPass?'text':'password'"/>
              <van-icon :name="isShowNewPass?'eye-o':'closed-eye'" size="18"  color='#000' @click="showNewPass"/>
            </div>
            <div class="btn-box">
            <van-button color="#6d411e" size="large" round @click="editPass">确定修改</van-button>
            </div>  
           </div>
            </van-popup>
    </div>
</template>

<script>
import {mapMutations} from 'vuex'
export default {
  name: "setting",
  data() {
    return {
      isShow: false,
      oldPass: "",
      newPass: "",
      isShowOldPass: false,
      isShowNewPass: false
    };
  },
  methods: {
    ...mapMutations(["changeCartNum"]),
    back() {
      this.$router.back();
    },
    showEdit() {
      this.isShow = true;
    },
    showOldPass() {
      this.isShowOldPass = !this.isShowOldPass;
    },
    showNewPass() {
      this.isShowNewPass = !this.isShowNewPass;
    },
    // 确定修改密码
    editPass() {
      let tokenString = this.$cookies.get("tokenString");
      // 判断用户是否登录
      if (!tokenString) {
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }
      // 显示提示加载中
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      //   发起修改密码请求
      this.axios({
        method: "POST",
        url: this.baseUrl + "/updatePassword",
        data: {
          appkey: this.appkey,
          tokenString: tokenString,
          password: this.newPass,
          oldPassword: this.oldPass
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
          //  修改成功
          if (res.data.code == "E001") {
            this.$router.push({ name: "Login" });
             this.$cookies.remove("tokenString");
            this.$toast({
              message: "请重新登录",
              forbidClick: true,
              duration: 2000
            });
          } else {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 2000
            });
          }
        })
        .catch(err => {
          //   关闭加载提示
          this.$toast.clear();
          console.log(err);
        });
    },
    // 注销账户
    cancel() {
      let tokenString = this.$cookies.get("tokenString");
      // 判断用户是否登录
      if (!tokenString) {
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }
      this.$dialog.confirm({
          title:'注销账号',
          message:'是否确定注销账号,账户一旦注销无法恢复'
      }).then(()=>{
          // 显示提示加载中
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      //   发起注销账户请求
      this.axios({
        method: "POST",
        url: this.baseUrl + "/destroyAccount",
        data: {
          appkey: this.appkey,
          tokenString: tokenString,
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
          //  注销成功
          console.log(res)
          if (res.data.code == "G001") {
            this.$router.push({ name: "Login" });
            this.$cookies.remove("tokenString");
            this.changeCartNum(0);
            this.$toast({
              message: "请重新登录",
              forbidClick: true,
              duration: 2000
            });
          } else {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 2000
            });
          }
        })
        .catch(err => {
          //   关闭加载提示
          this.$toast.clear();
          console.log(err);
        });
      }).catch(()=> {
          
     });
    }
  }
};
</script>

<style lang="less" scoped>
.setting {
  .my-nav {
    /deep/.van-icon {
      color: #000;
    }
  }
  .content {
    width: 96%;
    margin: 10px auto;
    border-radius: 5px;
    background: #fff;
    padding: 10px;
  }
  .edit-box {
    position: relative;
    height: 100%;
    padding: 10px 0;
    .title {
      text-align: center;
      font-size: 20px;
      color: #000;
      margin-bottom: 40px;
    }
    .inp-item {
      display: flex;
      align-items: center;
      line-height: 40px;
      width: 90%;
      margin: 0 auto 10px;
      background: #fff;
      border-radius: 40px;
      font-size: 18px;
      overflow: hidden;
      height: 40px;
      box-sizing: border-box;
      // .title{
      //     margin-left: 20px;
      //     white-space: pre;
      // }
      .my-inp {
        flex: 1;
        .van-field__label {
          width: 50px;
        }
      }
      .van-icon {
        margin-right: 20px;
      }
    }
    .btn-box {
      width: 90%;
      position: absolute;
      bottom: 10px;
      left: 5%;
    }
  }
}
</style>