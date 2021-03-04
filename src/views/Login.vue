<template>
    <div class='login'>
        <div class="bg"></div>
        <van-overlay :show="true" z-index='-1' class-name='block'/>
        <van-nav-bar class="my-login-nav" :border='false' right-text='注册' title='登录'   @click-right="showRegist">
           <template #left>
           <van-icon name="arrow-left" size="24"  color='#fff' @click="backHome"/>
           </template>
        </van-nav-bar>
        <div class="content">
            <div class="logo">
                <img src="../assets/images/logo.png" alt="">
            </div>
            <div class="inp-item">
             <!-- <span class="title">手机号:</span> -->
            <van-field v-model="userLoginInfo.phone" placeholder="请输入手机号" class="my-inp" label="手机号"/>
            </div>
            <div class="inp-item">
                <!-- <span class="title">密 码:</span> -->
                <van-field v-model="userLoginInfo.pass" placeholder="请输入密码" class="my-inp" :type="isShowLoginPass?'text':'password'" label="密码"/>
                <van-icon :name="isShowLoginPass?'eye-o':'closed-eye'" size="18"  color='#000' @click="showLoginPass"/>
            </div>
            <div class="forget-passs"><span @click="findPass">忘记密码？</span></div>
            <div class="btn-box">
            <van-button color="#6d411e" size="large" round @click="login">登录</van-button>
            </div>  
        </div>
            <van-popup
            v-model="isShowRegist"
            closeable
            position="bottom"
            close-on-popstate
            :style="{ height: '50%' }"
           >
           <div class="register-box">
               <div class="title">注册</div>
                 <div class="inp-item">
             <!-- <span class="title">手机号:</span> -->
            <van-field v-model="userRegInfo.phone" placeholder="请输入手机号" class="my-inp"  label="手机号"/>
            </div>
             <div class="inp-item">
             <!-- <span class="title">昵&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称:</span> -->
            <van-field v-model="userRegInfo.nickName" placeholder="请输入昵称" class="my-inp" label="昵称"/>
            </div>
            <div class="inp-item">
                <!-- <span class="title">密&#12288;码:</span> -->
                <van-field v-model="userRegInfo.pass" placeholder="请输入密码" class="my-inp" :type="isShowRegPass?'text':'password'" label="密码"/>
                <van-icon :name="isShowRegPass?'eye-o':'closed-eye'" size="18"  color='#000' @click="showRegPass"/>
            </div>
            <div class="btn-box">
            <van-button color="#6d411e" size="large" round @click="register">注册</van-button>
            </div>  
           </div>
            </van-popup>
    </div>
</template>
<script>
import "../assets/less/login.less";
import { utils } from "../assets/js/utils";
export default {
  data() {
    return {
      // 用户登录信息
      userLoginInfo: {
        phone: "", //用户名
        pass: "" //密码
      },
      // 用户注册信息
      userRegInfo: {
        phone: "", //用户名
        nickName: "", //昵称
        pass: "" //密码
      },
      isShowLoginPass: false, //是否显示登录密码
      isShowRegPass: false, //是否显示注册密码
      isShowRegist: false //是否显示注册页面
    };
  },
  methods: {
    //显示隐藏登录密码
    showLoginPass() {
      this.isShowLoginPass = !this.isShowLoginPass;
    },
    //显示隐藏注册密码
    showRegPass() {
      this.isShowRegPass = !this.isShowRegPass;
    },
    // 显示注册页面
    showRegist() {
      this.isShowRegist = true;
    },
    // 返回
    back(){
      this.$router.back();
    },
    backHome(){
this.$router.push({name:'Home'});
    },
    // 注册验证
    register() {
      let o = {
        phone: {
          value: this.userRegInfo.phone,
          reg: /^1[3-9]\d{9}$/,
          errorMsg: "手机号格式不正确"
        },
        nickName: {
          value: this.userRegInfo.nickName,
          reg: /^[\u4e00-\u9fa5A-Za-z0-9]{1,10}$/,
          errorMsg: "昵称支持汉字字母数字组合"
        },
        pass: {
          value: this.userRegInfo.pass,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: "密码支持字母数字_组合且首字符必须为字母"
        }
      };
      //验证表单
      //表单验证不通过, 拦截注册请求
      if (!utils.validForm(o)) {
        return;
      }
      // 弹出提示框
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      //发起注册请求
      this.axios({
        method: "POST",
        url: this.baseUrl+"/register",
        data: {
          appkey: this.appkey,
          nickName: this.userRegInfo.nickName,
          password: this.userRegInfo.pass,
          phone: this.userRegInfo.phone
        }
      }).then(res=>{
        // 关闭提示
        this.$toast.clear();
        if(res.data.code==100){
          // 注册成功，关闭弹出层
         this.isShowRegist=false;
        //  清除用户注册信息
        for(let key in this.userRegInfo){
          this.userRegInfo[key]='';
        }
        }else{
          // 注册失败,提示错误信息
           this.$toast({
            message: res.data.msg,
            forbidClick: true,
            duration: 3000
           })
        }
      }).catch(err=>{
        console.log(err);
      });
    },
     // 登录验证
    login() {
      let o = {
        phone: {
          value: this.userLoginInfo.phone,
          reg: /^1[3-9]\d{9}$/,
          errorMsg: "手机号格式不正确"
        },
        pass: {
          value: this.userLoginInfo.pass,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: "密码支持字母数字_组合且首字符必须为字母"
        }
      };
      //验证表单
      //表单验证不通过, 拦截注册请求
      if (!utils.validForm(o)) {
        return;
      }
      // 弹出提示框
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      //发起登录请求
      this.axios({
        method: "POST",
        url: this.baseUrl+"/login",
        data: {
          appkey: this.appkey,
          password: this.userLoginInfo.pass,
          phone: this.userLoginInfo.phone
        }
      }).then(res=>{
        // 关闭提示
        this.$toast.clear();
        if(res.data.code==200){
        // 将服务器返回的token保存到cookie中
        this.$cookies.set('tokenString',res.data.token,'1d');
        // 跳转页面
        this.back();
        }else{
          // 登录失败,提示错误信息
           this.$toast({
            message: res.data.msg,
            forbidClick: true,
            duration: 3000
           })
        }
      }).catch(err=>{
        console.log(err);
      });
    },
    findPass(){
      this.$router.push({name:'FindPass'})
    }
  }
};
</script>