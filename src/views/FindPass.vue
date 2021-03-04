<template>
    <div class="findpass">
        <van-nav-bar
  title="找回密码"
  left-arrow
  fixed
  placeholder
  @click-left="back"
  class="my-nav"
/>
<div class="form">
    <div v-if='!isValidate'>
    <div class="inp-item">
            <van-field v-model="email" placeholder="请输入邮箱" class="my-inp"  label="邮箱"/>
            </div>
             <div class="inp-item">
            <van-field v-model="code" placeholder="请输入验证码" class="my-inp" label="验证码"/>
            <van-button color="#6d411e" size="mini" @click="getCode" :disabled='isSend'>{{isSend?`请${countDown}秒后再发送`:'发送验证码'}}</van-button>
            </div>
            </div>
            <div v-else>
            <div class="inp-item">
            <van-field v-model="phone" placeholder="请输入手机号" class="my-inp" label="手机号"/>
            </div>
            <div class="inp-item">
                <van-field v-model="pass" placeholder="请输入新密码" class="my-inp" :type="isShowPass?'text':'password'" label="密码"/>
                <van-icon :name="isShowPass?'eye-o':'closed-eye'" size="18"  color='#000' @click="showPass"/>
            </div>
            </div>
</div>
<div class="btn-box">
    <div v-if='!isValidate'>
    <van-button color="#6d411e" size="large" round @click='validateCode'>下一步</van-button>
    </div>
     <div v-else>
    <van-button color="#6d411e" size="large" round class="find" @click='findPass'>找回密码</van-button>
    <van-button color="#666" size="large" round @click='prev'>返回</van-button>
    </div>
</div>
    </div>
</template>

<script>
import { utils } from "../assets/js/utils";
export default {
  name: "FindPass",
  data() {
    return {
      email: "", //输入的邮箱
      code: "", //输入的验证码
      countDown: 60, //请求验证码倒计时
      timer: null, //定时器
      isSend: false, //是否请求验证码成功
      isValidate: false, //是否验证成功
      isShowPass: false, //是否显示密码
      phone: "", //手机号
      pass: "" //密码
    };
  },
  methods: {
    back() {
      this.$router.back();
    },
    // 获取验证码
    getCode() {
      // 验证邮箱
      let o = {
        email: {
          value: this.email,
          reg: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
          errorMsg: "邮箱格式不正确"
        }
      };
      if (!utils.validForm(o)) {
        return;
      }
      // 显示提示加载中
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      //  获取验证码
      this.axios({
        method: "POST",
        url: this.baseUrl + "/emailValidCode",
        data: {
          appkey: this.appkey,
          email: this.email
        }
      })
        .then(res => {
          //   关闭加载提示
          this.$toast.clear();
          //   获取验证码成功
          console.log(res);
          if (res.data.code == "J001") {
            this.isSend = true;
            this.timer = setInterval(() => {
              this.countDown--;
              if (this.countDown <= 0) {
                clearInterval(this.timer);
                this.isSend = false;
              }
            }, 1000);
          }
          this.$toast({
            message: res.data.msg,
            forbidClick: true,
            duration: 3000
          });
        })
        .catch(err => {
          //   关闭加载提示
          this.$toast.clear();
          console.log(err);
        });
    },
    //提交验证
    validateCode() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      //  获取验证码
      this.axios({
        method: "POST",
        url: this.baseUrl + "/checkValidCode",
        data: {
          appkey: this.appkey,
          validCode: this.code
        }
      })
        .then(res => {
          //   关闭加载提示
          this.$toast.clear();
          //   获取验证码成功
          console.log(res);
          if (res.data.code == "K001") {
            this.isValidate = true;
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
    // 显示隐藏密码
    showPass() {
      this.isShowPass = !this.isShowPass;
    },
    // 找回密码
    findPass() {
         let o = {
        phone: {
          value: this.phone,
          reg: /^1[3-9]\d{9}$/,
          errorMsg: "手机号格式不正确"
        },
        pass: {
          value: this.pass,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: "密码支持字母数字_组合且首字符必须为字母"
        }
      };
      //验证表单
      //表单验证不通过, 拦截注册请求
      if (!utils.validForm(o)) {
        return;
      }
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      this.axios({
        method: "POST",
        url: this.baseUrl + "/retrievePassword",
        data: {
          appkey: this.appkey,
          phone:this.phone,
          password:this.pass
        }
      })
        .then(res => {
          //   关闭加载提示
          this.$toast.clear();
          //   找回密码成功
          if (res.data.code == "K001") {
              this.$router.push({name:'Login'})
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
    prev(){
        this.isValidate=false;
    }
  }
};
</script>

<style lang="less" scoped>
.findpass {
  .my-nav {
    /deep/.van-icon {
      color: #000;
    }
  }
  .form {
    width: 96%;
    margin: 10px auto;
    border-radius: 8px;
    background: #fff;
    padding: 10px 10px 20px;
    .inp-item {
      display: flex;
      align-items: center;
      border-bottom: 1px solid #f5f6f7;
      &:last-child {
        border-bottom: none;
      }
      .my-inp {
        flex: 1;
      }
    }
  }
  .btn-box {
    margin: 15px auto;
    width: 95%;
    .find {
      margin-bottom: 15px;
    }
  }
}
</style>